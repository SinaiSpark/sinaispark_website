import type { Core } from "@strapi/strapi"

import { applyAdminLabels } from "./lib/admin-labels"
import { applyAdminLayouts } from "./lib/admin-layouts"
import { registerSiteRefresh } from "./lib/revalidate"
import { importGoogleReviews, seedSiteContent } from "./lib/site-content"
import { ensureSiteDefaults } from "./lib/site-defaults"
import { registerSlugFill } from "./lib/slugs"

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // The article editor (src/admin/rich-text). Stored as rich text (HTML).
    strapi.customFields.register({ name: "rich-text", type: "richtext" })
    registerSlugFill(strapi)
    registerSiteRefresh(strapi)
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureSiteDefaults(strapi)
    await seedSiteContent(strapi)
    await importGoogleReviews(strapi)
    await applyAdminLabels(strapi)
    await applyAdminLayouts(strapi)
  },
}
