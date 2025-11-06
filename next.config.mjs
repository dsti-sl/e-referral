/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/eref-web',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '/eref-web/',
};

export default nextConfig;
