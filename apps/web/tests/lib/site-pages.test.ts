import { describe, expect, it } from "vitest"

import cmsCopy from "../../../cms/scripts/site-pages.json"
import { SITE_PAGES } from "@/lib/site-pages"

/**
 * Seam: lib/site-pages
 * Behavior spec: every page the site publishes has a Page SEO entry the CMS
 * can create, so the list the CMS seeds from must match the site's own.
 */
describe("site pages", () => {
  it("matches the copy the CMS seeds Page SEO from", () => {
    expect(cmsCopy).toEqual(SITE_PAGES)
  })

  it("has unique, slash-terminated paths", () => {
    const paths = SITE_PAGES.map((p) => p.path)
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) expect(path).toMatch(/^\/([a-z0-9-]+\/)*$/)
  })
})
