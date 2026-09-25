import type { Core } from "@strapi/strapi"

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // The preview panel frames the website; videos embedded in articles
          // show their player inside the editor.
          "frame-src": [
            "'self'",
            env("WEB_URL", "http://localhost:3100"),
            "https://www.youtube.com",
            "https://www.youtube-nocookie.com",
            "https://player.vimeo.com",
          ],
          "img-src": ["'self'", "data:", "blob:"],
          "media-src": ["'self'", "data:", "blob:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  // JPEG/PNG uploads become WebP; must run after the body parser.
  "global::webp-uploads",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
]

export default config
