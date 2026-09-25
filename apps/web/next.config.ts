import type { NextConfig } from "next"

/** The CMS's origin: its preview panel shows the site in a frame. */
const cmsOrigin = new URL(
  process.env.CMS_PUBLIC_URL ?? process.env.CMS_URL ?? "http://localhost:1337"
).origin

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Every internal href and canonical in the codebase uses a trailing slash;
  // without this, each one is a 308 hop and canonicals point at redirects.
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Only this site and the CMS preview may frame it (clickjacking).
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${cmsOrigin}`,
          },
        ],
      },
    ]
  },
}

export default nextConfig
