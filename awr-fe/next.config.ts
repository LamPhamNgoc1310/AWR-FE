import type { NextConfig } from "next";

const BE_URL = process.env.BE_URL;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/generate',
        destination: `${BE_URL}/generate`,
      },
      {
        source: '/weather-info',
        destination: `${BE_URL}/weather-info`
      },
      {
        source: '/schedule',
        destination: `${BE_URL}/schedule`
      }
    ]
  }
};

export default nextConfig;
