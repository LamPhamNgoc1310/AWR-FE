import type { NextConfig } from "next";

const BE_URL = process.env.BE_URL;

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  }
  async rewrites() {
    return [
      {
        source: '/generate',
        destination: `${BE_URL}/generate`,
      }
    ]
  }
};

export default nextConfig;
