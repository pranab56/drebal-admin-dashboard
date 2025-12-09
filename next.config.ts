import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "http",
        hostname: "10.10.7.102",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
