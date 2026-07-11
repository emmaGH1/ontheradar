import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // monorepo: keep file tracing rooted at frontend, not parent
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
