import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

const accountId = process.env.R2_ACCOUNT_ID || '80cb977372f202bf141deb4906b650d6';
const bucketName = process.env.R2_BUCKET_NAME || 'ambrosia';
const publicUrl = (process.env.R2_PUBLIC_URL || 'https://pub-8204a887dc104db5bc9768e902671861.r2.dev').replace(/\/$/, '');
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

const isR2Configured = Boolean(accessKeyId && secretAccessKey);

let s3Client: S3Client | null = null;
if (isR2Configured) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export const uploadToR2 = async (
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const sanitizedName = `${Date.now()}-${fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
  
  if (isR2Configured && s3Client) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: sanitizedName,
      Body: buffer,
      ContentType: contentType,
    });
    await s3Client.send(command);
    return `${publicUrl}/${sanitizedName}`;
  }

  // Graceful fallback to local uploads directory when R2 credentials are pending
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, sanitizedName);
  fs.writeFileSync(filePath, buffer);
  
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/uploads/${sanitizedName}`;
};

export const getR2PresignedUploadUrl = async (fileName: string, contentType: string) => {
  const sanitizedName = `${Date.now()}-${fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;

  if (!isR2Configured || !s3Client) {
    throw new Error('R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) not configured in .env');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: sanitizedName,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const finalPublicUrl = `${publicUrl}/${sanitizedName}`;

  return {
    uploadUrl,
    publicUrl: finalPublicUrl,
    key: sanitizedName,
  };
};

export const listR2Files = async () => {
  if (isR2Configured && s3Client) {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 100,
    });
    const response = await s3Client.send(command);
    return (response.Contents || []).map((item) => ({
      key: item.Key,
      url: `${publicUrl}/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
    }));
  }

  // Fallback to local files
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) return [];

  const files = fs.readdirSync(uploadsDir);
  const port = process.env.PORT || 5000;
  return files.map((file) => {
    const stat = fs.statSync(path.join(uploadsDir, file));
    return {
      key: file,
      url: `http://localhost:${port}/uploads/${file}`,
      size: stat.size,
      lastModified: stat.mtime,
    };
  });
};
