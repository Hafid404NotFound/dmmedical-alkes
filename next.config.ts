import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // this allows all hostnames, though not recommended for security/perf
      },
    ],
  },
};

export default nextConfig;
