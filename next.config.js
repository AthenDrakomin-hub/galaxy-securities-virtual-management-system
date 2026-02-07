/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 Turbopack（开发模式下生效，生产环境暂未完全支持）
  experimental: {
    turbo: true,
  },
  // 基础配置（可选，根据项目需求补充）
  reactStrictMode: true, // 开启 React 严格模式，建议保留
  swcMinify: true, // 启用 SWC 压缩，提升构建速度
  // 路径别名（与 tsconfig.json 保持一致，可选）
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': `${__dirname}/src`,
    };
    return config;
  },
};

module.exports = nextConfig;