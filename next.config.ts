import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` }, // if you keep REST
      { source: '/graphql', destination: `${API_URL}/api/graphql` },       // GraphQL proxy
    ];
  },
};

export default nextConfig;
