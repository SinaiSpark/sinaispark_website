import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FileTextIcon } from "lucide-react"

import { REPORTS } from "@/lib/content/research"
import { PageHeader } from "@/components/site/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { CTASection } from "@/components/site/cta-section"

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
      <PageHeader
        pathname={`/research/${report.slug}/`}
        eyebrow="Research report"
        title={report.title}
        lede={report.summary}
      >
        <Badge variant="mist">{report.market}</Badge>
        <Badge variant="outline">{report.topic}</Badge>
        <span className="text-sm text-muted-foreground">{report.readTime}</span>
      </PageHeader>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          {/* Report body arrives with the first real publication (CMS, Phase 5). */}
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <FileTextIcon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Full publication text will appear here once this report is
              released.
            </p>
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
            variant: "brand",
          },
        ]}
      />
    </>
  )
}
