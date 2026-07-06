import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  ...(process.env.CAPACITOR_EXPORT === "1" ? { output: "export" as const } : {}),
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
