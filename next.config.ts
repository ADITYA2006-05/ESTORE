import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon', '@neondatabase/serverless'],
};

export default nextConfig;

// Only initialize Cloudflare dev mode when running locally (not in CI/Vercel builds)
if (process.env.NODE_ENV === 'development' && !process.env.CI) {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
