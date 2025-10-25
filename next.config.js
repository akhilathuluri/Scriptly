/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes for email feature
  // If you need static export, you'll need to use a different approach for email sending
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
