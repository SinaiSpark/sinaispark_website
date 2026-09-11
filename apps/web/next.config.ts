import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Every internal href and canonical in the codebase uses a trailing slash;
  // without this, each one is a 308 hop and canonicals point at redirects.
  trailingSlash: true,
}

export default nextConfig
