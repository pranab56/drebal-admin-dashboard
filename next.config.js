/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },

      {
        protocol: "https",
        hostname: "ismail4000.binarybards.online",
        pathname: "/image/**",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "http",
        hostname: "10.10.7.102",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

module.exports = nextConfig;

