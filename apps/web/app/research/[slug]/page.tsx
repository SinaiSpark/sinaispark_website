import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { REPORTS } from "@/lib/content/research"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { Badge } from "@workspace/ui/components/badge"
import { CTASection } from "@/components/site/cta-section"
import { WhatsAppButton } from "@/components/site/whatsapp-button"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return REPORTS.map((report) => ({ slug: report.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const report = REPORTS.find((r) => r.slug === slug)
  if (!report) return {}
  return {
    title: report.title,
    description: report.summary,
    alternates: { canonical: `/research/${report.slug}/` },
  }
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params
  const report = REPORTS.find((r) => r.slug === slug)
  if (!report) notFound()

  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname={`/research/${report.slug}/`} />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="flex items-center gap-2">
            <Badge variant="mist">{report.market}</Badge>
            <Badge variant="outline">{report.topic}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">
            {report.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {report.summary}
          </p>
        </div>
      </div>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Report body arrives with the first real publication (CMS, Phase 5). */}
          <div className="rounded-lg border border-dashed p-10 text-center text-sm leading-relaxed text-muted-foreground">
            Full publication text will appear here once this report is released.
          </div>
        </div>
      </section>

      <CTASection
        title={
          report.gated ? "Request this report" : "Questions about the data?"
        }
        buttons={[
          {
            label: "Contact Our Research Team",
            href: "/contact/",
            variant: "gold",
          },
        ]}
      />
      <WhatsAppButton
        message={`Hello, I'd like to know more about "${report.title}".`}
      />
    </>
  )
}
