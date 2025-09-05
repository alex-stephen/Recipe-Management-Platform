import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  distDir: 'build',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/:path*' : 'http://backend:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
