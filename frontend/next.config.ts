import type { NextConfig } from "next";

/**
 * Hosts allowed for next/image. The storage host is derived from
 * NEXT_PUBLIC_R2_PUBLIC_URL so that pointing the app at a different bucket or
 * CDN cannot silently break images: next/image rejects any host not listed
 * here, and the failure only shows up at runtime.
 */
const storageUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const storageHost = (() => {
  if (!storageUrl) return null;
  try {
    const u = new URL(storageUrl);
    return { protocol: u.protocol.replace(":", ""), hostname: u.hostname };
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle for the Docker runtime stage
  output: 'standalone',
  images: {
    remotePatterns: [
      ...(storageHost
        ? [
            {
              protocol: storageHost.protocol as "http" | "https",
              hostname: storageHost.hostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'pub-8204a887dc104db5bc9768e902671861.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
