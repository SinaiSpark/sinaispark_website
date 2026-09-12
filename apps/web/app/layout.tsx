import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"

import { SITE } from "@/lib/site-config"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Neutral root layout. The previous shell (header, footer, motion provider,
 * WhatsApp button) belonged to the superseded design and was removed; the
 * rebuild supplies its own chrome. Fonts stay wired so the design tokens in
 * globals.css resolve.
 */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Business Setup Services in Saudi Arabia and Beyond`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", fontMono.variable, geist.variable)}
    >
      <body className="flex min-h-svh flex-col overflow-x-hidden">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
