import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests to Next.js dev resources when accessing via IP
  allowedDevOrigins: ["10.13.86.134", "localhost"],
};

export default nextConfig;
