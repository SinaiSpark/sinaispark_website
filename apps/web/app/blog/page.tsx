import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/site/breadcrumbs"

export const metadata: Metadata = {
  title: "Blog: Regulatory Updates, Guides & Market News",
  description:
    "Regulatory updates, practical guides and market news from Sinai Spark Global across Saudi Arabia and four more markets.",
  alternates: { canonical: "/blog/" },
}

export default function BlogPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/blog/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            Blog
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">
            Regulatory updates & market news
          </h1>
        </div>
      </div>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          {/* Empty state until the CMS supplies posts (Phase 5) — uses the
              approved Empty-state pattern rather than fake articles. */}
          <div className="mx-auto max-w-xl rounded-lg border border-dashed border-border p-12 text-center">
            <p className="font-medium">No articles published yet</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our first regulatory updates are in the works. In the meantime,
              our research hub has deeper market analysis.
            </p>
            <Link
              href="/research/"
              className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary-deep focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Explore Research
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
