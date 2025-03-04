/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cloud.appwrite.io', 'github.com'], // Add any other domains as necessary
  },
};

export default nextConfig;
