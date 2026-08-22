import type { MetadataRoute } from "next"

import { getAllServices } from "@/lib/content/services"
import { REPORTS } from "@/lib/content/research"
import { NAV_LINKS, SITE } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticPages = [
    "",
    "/services/",
    "/about-us/",
    "/sinai-spark-india/",
    "/research/",
    "/blog/",
    "/faqs/",
    "/contact/",
    "/privacy-policy/",
    "/terms/",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  const servicePages = getAllServices().map((service) => ({
    url: `${base}/services/${service.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const reportPages = REPORTS.map((report) => ({
    url: `${base}/research/${report.slug}/`,
    lastModified: new Date(report.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }))

  const countryPages = ["saudi-arabia", "uae", "uk", "bahrain"].map(
    (country) => ({
      url: `${base}/where-we-work/${country}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  )

  // Nav links are already covered by staticPages; keep the reference honest.
  void NAV_LINKS

  return [...staticPages, ...servicePages, ...reportPages, ...countryPages]
}
