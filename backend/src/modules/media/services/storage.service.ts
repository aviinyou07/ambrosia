import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

/**
 * S3-compatible object storage.
 *
 * Works against any S3 API — RustFS (self-hosted, what this deployment uses),
 * Cloudflare R2, MinIO, AWS S3 — because only the endpoint and addressing style
 * differ between them.
 *
 * Configuration (the S3_* names are preferred; the R2_* names are still read so
 * existing deployments keep working):
 *
 *   S3_ENDPOINT          Base URL of the S3 API, e.g. https://s3.example.com
 *                        For R2: https://<account-id>.r2.cloudflarestorage.com
 *   S3_BUCKET            Bucket name
 *   S3_ACCESS_KEY_ID     Access key
 *   S3_SECRET_ACCESS_KEY Secret key
 *   S3_PUBLIC_URL        Public base URL used to build browser-facing links.
 *                        Omit it and links are built from the endpoint + bucket.
 *   S3_REGION            Defaults to us-east-1 ("auto" for R2)
 *   S3_FORCE_PATH_STYLE  "true" (default) uses endpoint/bucket/key, which is
 *                        what RustFS and MinIO expect. R2 also accepts it.
 *                        Set "false" for virtual-host style (bucket.endpoint).
 *
 * With no credentials configured it falls back to writing into ./uploads so that
 * local development and a half-configured deployment still work.
 */

const env = (...names: string[]): string => {
  for (const n of names) {
    const v = process.env[n];
    if (v !== undefined && v !== '') return v.trim();
  }
  return '';
};

const bool = (value: string, fallback: boolean): boolean => {
  if (value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const stripTrailingSlash = (s: string) => s.replace(/\/+$/, '');

const accessKeyId = env('S3_ACCESS_KEY_ID', 'R2_ACCESS_KEY_ID');
const secretAccessKey = env('S3_SECRET_ACCESS_KEY', 'R2_SECRET_ACCESS_KEY');
const bucketName = env('S3_BUCKET', 'S3_BUCKET_NAME', 'R2_BUCKET_NAME') || 'ambrosia';
const region = env('S3_REGION', 'R2_REGION') || 'us-east-1';
const forcePathStyle = bool(env('S3_FORCE_PATH_STYLE'), true);

// Uploaded images are referenced directly by the browser, so objects must be
// anonymously readable. Set S3_PUBLIC_READ=false if a CDN or signed URLs will
// serve them instead.
const publicRead = bool(env('S3_PUBLIC_READ'), true);

// An explicit endpoint wins. Otherwise derive R2's endpoint from its account id,
// so pre-existing R2 configuration keeps working untouched.
const r2AccountId = env('R2_ACCOUNT_ID');
const endpoint =
  stripTrailingSlash(env('S3_ENDPOINT', 'R2_ENDPOINT')) ||
  (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : '');

/**
 * Base URL for browser-facing links. When unset, derive it: path-style public
 * reads live at <endpoint>/<bucket>/<key>, virtual-host style at
 * <bucket>.<host>/<key>.
 */
const configuredPublicUrl = stripTrailingSlash(env('S3_PUBLIC_URL', 'R2_PUBLIC_URL'));
const publicUrl = (() => {
  if (configuredPublicUrl) return configuredPublicUrl;
  if (!endpoint) return '';
  return forcePathStyle ? `${endpoint}/${bucketName}` : endpoint;
})();

export const isStorageConfigured = Boolean(endpoint && accessKeyId && secretAccessKey);

const s3Client: S3Client | null = isStorageConfigured
  ? new S3Client({
      region,
      endpoint,
      forcePathStyle,
      credentials: { accessKeyId, secretAccessKey },
    })
  : null;

/** Describes the active configuration without leaking secrets. */
export const storageInfo = () => ({
  configured: isStorageConfigured,
  endpoint: endpoint || null,
  bucket: bucketName,
  region,
  forcePathStyle,
  publicUrl: publicUrl || null,
  mode: isStorageConfigured ? 's3' : 'local-fallback',
});

const sanitize = (fileName: string): string =>
  `${Date.now()}-${fileName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(-120)}`;

const localUploadsDir = () => path.resolve(process.cwd(), 'uploads');

const localPublicBase = () =>
  stripTrailingSlash(env('PUBLIC_API_URL')) || `http://localhost:${process.env.PORT || 5000}`;

/**
 * Create the bucket when it does not exist yet. RustFS and MinIO start empty, so
 * without this the first upload fails with NoSuchBucket.
 */
const applyPublicReadPolicy = async (): Promise<void> => {
  if (!s3Client || !publicRead) return;
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };
  try {
    await s3Client.send(
      new PutBucketPolicyCommand({ Bucket: bucketName, Policy: JSON.stringify(policy) })
    );
    console.log(`[storage] public-read policy applied to "${bucketName}"`);
  } catch (error: any) {
    console.warn(
      `[storage] could not set public-read policy on "${bucketName}": ${error?.message}. ` +
        'Uploaded images may return 403 to browsers.'
    );
  }
};

export const ensureBucket = async (): Promise<void> => {
  if (!s3Client) return;
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    await applyPublicReadPolicy();
  } catch {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`[storage] created bucket "${bucketName}"`);
      await applyPublicReadPolicy();
    } catch (error: any) {
      // Losing a race with another instance, or lacking CreateBucket rights, is
      // not fatal: uploads still work if the bucket exists.
      if (!['BucketAlreadyOwnedByYou', 'BucketAlreadyExists'].includes(error?.name)) {
        console.warn(`[storage] could not ensure bucket "${bucketName}":`, error?.message);
      }
    }
  }
};

export const uploadFile = async (
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const key = sanitize(fileName);

  if (s3Client) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
    return `${publicUrl}/${key}`;
  }

  const dir = localUploadsDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, key), buffer);
  return `${localPublicBase()}/uploads/${key}`;
};

export const getPresignedUploadUrl = async (fileName: string, contentType: string) => {
  if (!s3Client) {
    throw new Error(
      'Object storage is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY.'
    );
  }

  const key = sanitize(fileName);
  const uploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: contentType }),
    { expiresIn: 3600 }
  );

  return { uploadUrl, publicUrl: `${publicUrl}/${key}`, key };
};

export const listFiles = async () => {
  if (s3Client) {
    const response = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName, MaxKeys: 100 })
    );
    return (response.Contents || []).map((item) => ({
      key: item.Key,
      url: `${publicUrl}/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
    }));
  }

  const dir = localUploadsDir();
  if (!fs.existsSync(dir)) return [];
  const base = localPublicBase();
  return fs.readdirSync(dir).map((file) => {
    const stat = fs.statSync(path.join(dir, file));
    return {
      key: file,
      url: `${base}/uploads/${file}`,
      size: stat.size,
      lastModified: stat.mtime,
    };
  });
};

export const deleteFile = async (key: string): Promise<void> => {
  if (s3Client) {
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    return;
  }
  const filePath = path.join(localUploadsDir(), path.basename(key));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};
