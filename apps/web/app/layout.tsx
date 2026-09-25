import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope, Schibsted_Grotesk } from "next/font/google"

import "./globals.css"

import { Cursor } from "@/components/chrome/loader"
import { PageTrail } from "@/components/chrome/page-trail"
import { SiteFooter } from "@/components/chrome/site-footer"
import { SiteNav } from "@/components/chrome/site-nav"
import { JsonLd } from "@/components/seo/json-ld"
import { mediaUrl } from "@/lib/content-api"
import { organizationJsonLd, siteRobots } from "@/lib/seo"
import { getSeoSettings, getSiteSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

/**
 * Root layout: the three typefaces from the design, then the shared chrome in
 * the design's DOM order — cursor, header, mobile sheet, main, footer.
 */

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

/**
 * Site-wide metadata from the CMS's SEO settings: title template, default
 * description and share image, search-console verification, and the
 * indexing switch. While the site is pre-launch that switch is off, which
 * sends noindex on every page. robots.txt blocks crawling as well, but a URL
 * that is merely disallowed can still be indexed from a link elsewhere; the
 * noindex header is what actually keeps it out.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  const image = mediaUrl(seo.defaultShareImage?.url)
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${seo.siteName}: Business Setup Services in Saudi Arabia and Beyond`,
      template: seo.titleTemplate.includes("%s")
        ? seo.titleTemplate
        : `%s | ${seo.siteName}`,
    },
    description: seo.defaultDescription || SITE.description,
    applicationName: seo.siteName,
    robots: siteRobots(seo),
    openGraph: {
      siteName: seo.siteName,
      type: "website",
      locale: "en_GB",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      site: seo.twitterHandle
        ? `@${seo.twitterHandle.replace(/^@/, "")}`
        : undefined,
    },
    verification: {
      google: seo.googleSiteVerification || undefined,
      other: seo.bingSiteVerification
        ? { "msvalidate.01": seo.bingSiteVerification }
        : undefined,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ insightsEnabled }, seo] = await Promise.all([
    getSiteSettings(),
    getSeoSettings(),
  ])

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <JsonLd data={organizationJsonLd(seo)} />
        <Cursor />
        <PageTrail />
        <SiteNav insights={insightsEnabled} />
        <main id="top">{children}</main>
        <SiteFooter insights={insightsEnabled} />
      </body>
    </html>
  )
}
