import type { Metadata } from "next"
import { NewspaperIcon } from "lucide-react"

import { PageHeader } from "@/components/site/page-header"
import { CtaLink } from "@/components/site/cta-link"

export const metadata: Metadata = {
  title: "Blog: Regulatory Updates, Guides & Market News",
  description:
    "Regulatory updates, practical guides and market news from Sinai Spark Global across Saudi Arabia and four more markets.",
  alternates: { canonical: "/blog/" },
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        pathname="/blog/"
        eyebrow="Blog"
        title="Regulatory updates & market news"
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-24 lg:px-8">
          {/* Empty state until the CMS supplies posts (Phase 5) — uses the
              approved Empty-state pattern rather than fake articles. */}
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-border p-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <NewspaperIcon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-lg font-semibold">
              No articles published yet
            </p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Our first regulatory updates are in the works. In the meantime,
              our research hub has deeper market analysis.
            </p>
            <CtaLink href="/research/" variant="primary" arrow className="mt-7">
              Explore Research
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}
