import type { Metadata } from "next"
import { MailIcon } from "lucide-react"

import { IMAGES } from "@/lib/images"
import { ImageHero } from "@/components/site/image-hero"
import { ctaClassName } from "@/components/site/cta-link"
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
      <ImageHero
        asset={IMAGES.serviceCompliance}
        size="compact"
        breadcrumbPath="/research/"
        eyebrow="Research"
        title="Original research and market insight"
        subtitle="Deeper, longer shelf life content: annual market entry reports, licensing trend analysis and survey based insight pieces — distinct from our regular blog updates."
        priority
      />

      <section aria-label="Report catalog" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <ReportCatalog />

          {/* Newsletter capture — provider TBD (plan §9 open item #3). */}
          <aside
            aria-labelledby="newsletter-title"
            data-surface="navy"
            className="relative mt-16 overflow-hidden rounded-2xl bg-primary p-8 md:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-10 size-72 bg-[url(/brand/mark-white.svg)] bg-contain bg-no-repeat opacity-[0.06]"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"
                >
                  <MailIcon className="size-5" />
                </span>
                <div>
                  <h2
                    id="newsletter-title"
                    className="text-2xl font-semibold tracking-tight text-primary-foreground"
                  >
                    Get new research first
                  </h2>
                  <p className="mt-1 max-w-md leading-relaxed text-primary-foreground/75">
                    One email when we publish a new report or major insight. No
                    noise.
                  </p>
                </div>
              </div>
              {/* Newsletter form wires to the email provider once tooling is confirmed. */}
              <form
                action="/contact/"
                method="get"
                className="flex w-full max-w-md gap-2"
                aria-label="Subscribe to research updates via contact page"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-full border border-primary-foreground/25 bg-white/[0.06] px-5 text-sm text-primary-foreground backdrop-blur-sm transition-[border-color,background-color] duration-200 outline-none placeholder:text-primary-foreground/50 focus-visible:border-brand focus-visible:bg-white/[0.1] focus-visible:ring-3 focus-visible:ring-brand/40"
                />
                <button
                  type="submit"
                  className={ctaClassName({
                    variant: "brand",
                    className: "shrink-0",
                  })}
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
