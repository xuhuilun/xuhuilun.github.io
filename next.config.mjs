import { withContentlayer } from 'next-contentlayer';

const nextConfig = {
  reactStrictMode: true,
  // 静态导出：构建产物输出到 out/，用于 GitHub Pages 部署
  output: 'export',
  // GitHub Pages 使用目录式 URL（/blog/foo/ -> foo/index.html）
  trailingSlash: true,
  images: {
    // 静态导出下 next/image 不经过优化服务，直接输出原生 <img>
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withContentlayer(nextConfig);
