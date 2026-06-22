import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Локально Next.js не будет качать картинки через себя
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'salerussiatravel-marriottkrasnodar.ru',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;