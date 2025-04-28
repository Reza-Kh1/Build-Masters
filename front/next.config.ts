import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "building-blog.storage.iran.liara.space",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: true,
  distDir: "build",
  crossOrigin: "anonymous",
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            // value: "http://localhost:5173",
            value: "https://admin.buildmasters.ir",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "OPTIONS, GET, DELETE, PATCH, POST, PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
