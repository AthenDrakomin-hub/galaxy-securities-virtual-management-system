
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Turbopack specific rules
      },
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_KEY: process.env.API_KEY,
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
