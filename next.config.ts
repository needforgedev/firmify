import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: the parent folder holds unrelated projects with
  // their own lockfiles, and Next would otherwise infer the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
