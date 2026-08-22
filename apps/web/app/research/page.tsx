import type { Metadata } from "next"
import { MailIcon } from "lucide-react"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ReportCatalog } from "@/components/research/report-catalog"

export const metadata: Metadata = {
  title: "Research & Market Insights",
  description:
    "Original research, regulatory reports and market insight from Sinai Spark Global, covering business setup trends across Saudi Arabia, the UAE, the UK, India and Bahrain.",
  alternates: { canonical: "/research/" },
}

export default function ResearchPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/research/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            Research
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">
            Original research and market insight
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Deeper, longer shelf life content: annual market entry reports,
            licensing trend analysis and survey based insight pieces — distinct
            from our regular blog updates.
          </p>
        </div>
      </div>

      <section aria-label="Report catalog" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <ReportCatalog />

          {/* Newsletter capture — provider TBD (plan §9 open item #3). */}
          <aside
            aria-labelledby="newsletter-title"
            className="mt-14 rounded-lg bg-primary p-8 md:p-10"
          >
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold"
                >
                  <MailIcon className="size-5" />
                </span>
                <div>
                  <h2
                    id="newsletter-title"
                    className="text-xl font-semibold tracking-tight text-primary-foreground"
                  >
                    Get new research first
                  </h2>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-primary-foreground/75">
                    One email when we publish a new report or major insight. No
                    noise.
                  </p>
                </div>
              </div>
              {/* Newsletter form wires to the email provider once tooling is confirmed. */}
              <form
                action="/contact/"
                method="get"
                className="flex w-full max-w-sm gap-2"
                aria-label="Subscribe to research updates via contact page"
              >
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-md border border-primary-foreground/25 bg-transparent px-3 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/50 focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/40"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-md bg-gold px-5 text-sm font-semibold text-primary-deep transition-colors outline-none hover:bg-gold/90 focus-visible:ring-3 focus-visible:ring-gold/50"
                >
                  Notify me
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
