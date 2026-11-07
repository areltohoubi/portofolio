import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your Next.js configuration options go here
  allowedDevOrigins: [
    "192.168.0.102:3000",
    "https://avatars.githubusercontent.com",
    "https://raw.githubusercontent.com",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;