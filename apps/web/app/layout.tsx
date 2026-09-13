import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope, Schibsted_Grotesk } from "next/font/google"

import "./globals.css"

import { Cursor } from "@/components/chrome/loader"
import { SiteFooter } from "@/components/chrome/site-footer"
import { SiteNav } from "@/components/chrome/site-nav"
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Business Setup Services in Saudi Arabia and Beyond`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  /**
   * Pre-launch: nothing here should reach a search result yet.
   *
   * `app/robots.ts` already refuses crawling, but a URL that is merely
   * disallowed can still be indexed from a link elsewhere — the crawler skips
   * the page and lists the bare address. This header is what actually keeps it
   * out, and it also covers crawlers that ignore robots.txt. Remove both at
   * launch.
   */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <Cursor />
        <SiteNav />
        <main id="top">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
