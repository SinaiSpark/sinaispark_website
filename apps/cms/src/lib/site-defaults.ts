import path from "node:path"
import type { Core } from "@strapi/strapi"

interface SitePage {
  page: string
  path: string
}

/**
 * Makes sure the entries the website expects exist, on every boot:
 * Site settings (Insights starts switched off), SEO settings, and one Page
 * SEO entry per website page (the list comes from the site itself, see
 * apps/web/lib/site-pages.ts). Existing entries are never changed, so
 * editors' work survives restarts and deploys.
 */
export async function ensureSiteDefaults(strapi: Core.Strapi) {
  const settings = strapi.documents("api::site-setting.site-setting")
  if (!(await settings.findFirst())) {
    await settings.create({ data: { insightsEnabled: false } })
  }

  const seo = strapi.documents("api::seo-setting.seo-setting")
  if (!(await seo.findFirst())) {
    await seo.create({
      data: {
        siteName: "Sinai Spark Global",
        titleTemplate: "%s | Sinai Spark Global",
        defaultDescription:
          "Company formation, MISA licensing, legal advisory and PRO services for businesses entering Saudi Arabia, the UAE, the UK, India and Bahrain.",
        // Pre-launch: an admin switches this on at launch.
        allowIndexing: false,
      },
    })
  }

  const pages: SitePage[] = require(
    path.join(strapi.dirs.app.root, "scripts", "site-pages.json")
  )
  const pageSeo = strapi.documents("api::page-seo.page-seo")
  const existing = new Set(
    (await pageSeo.findMany({ fields: ["path"], limit: 1000 })).map(
      (entry) => entry.path
    )
  )
  for (const page of pages) {
    if (!existing.has(page.path)) {
      await pageSeo.create({ data: { page: page.page, path: page.path } })
    }
  }
}
