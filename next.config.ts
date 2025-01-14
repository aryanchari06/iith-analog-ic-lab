import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iith.ac.in",
        pathname: "/assets/images/**",
      },
    ],
  },
  // Add other configuration options here if needed
};

export default nextConfig;
