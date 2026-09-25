import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { after } from "next/server"

import { ArticleShell } from "@/components/article/article-shell"
import { PreviewBar } from "@/components/article/preview-bar"
import { ResearchGate } from "@/components/article/research-gate"
import { ReportCard } from "@/components/company/research-sections"
import { RESEARCH } from "@/content/research"
import { ROUTES } from "@/content/site"
import { cleanArticleHtml, previewHtml } from "@/lib/article-html"
import { cms } from "@/lib/cms"
import { getReport, getReports } from "@/lib/content-api"
import { READER_COOKIE, verifyReader } from "@/lib/reader"
import { requireInsights } from "@/lib/insights"
import { isPreviewing } from "@/lib/preview"
import { toMetadata } from "@/lib/seo"
import { getSeoSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const reports = await getReports()
  return reports.map((report) => ({ slug: report.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.researchArticle(slug))
  const [report, settings] = await Promise.all([
    getReport(slug, { draft }),
    getSeoSettings(),
  ])
  if (!report) return {}
  return toMetadata(
    report.seo,
    {
      title: report.title,
      description: report.summary,
      path: report.href,
      image: report.image,
      type: "article",
      publishedTime: report.isoDate,
    },
    settings
  )
}

/**
 * A research article. When the editor has switched the email gate on, only
 * the first `previewBlocks` blocks are rendered until the reader has given an
 * email; the rest never leaves the server. Ungated articles stay static.
 *
 * In preview the whole draft is shown, with a note saying where readers
 * would meet the gate.
 */
export default async function ResearchArticlePage({ params }: Params) {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.researchArticle(slug))
  await requireInsights(ROUTES.researchArticle(slug))

  const [report, reports] = await Promise.all([
    getReport(slug, { draft }),
    getReports(),
  ])
  if (!report) notFound()

  let reader: string | null = null
  if (report.gated && !draft) {
    reader = await verifyReader((await cookies()).get(READER_COOKIE)?.value)
    // A known reader opening another gated article: record the unlock too,
    // after the page is sent, so the team sees what each reader read.
    if (reader) {
      const email = reader
      after(() =>
        cms("/subscribers/subscribe", {
          method: "POST",
          body: JSON.stringify({
            email,
            source: "Research gate",
            research: report.id,
          }),
        }).catch((error) => console.error(error))
      )
    }
  }
  const locked = report.gated && !reader && !draft
  const clean = cleanArticleHtml(report.body)
  const body = locked ? previewHtml(clean, report.previewBlocks) : clean

  const copy = RESEARCH.article
  const more = reports.filter((r) => r.slug !== slug).slice(0, 3)

  return (
    <ArticleShell
      image={report.image}
      crumbs={[
        { label: "Home", href: ROUTES.home },
        { label: RESEARCH.hero.crumb, href: ROUTES.research },
        { label: report.topic },
      ]}
      title={report.title}
      lede={report.summary}
      facts={[
        { label: "Published", value: report.date, dateTime: report.isoDate },
        { label: "Topic", value: report.topic },
        { label: "Market", value: report.market },
        { label: "Reading time", value: report.readTime },
      ]}
      back={{ label: copy.back, href: ROUTES.research }}
      cta={{ headline: copy.ctaHeadline, body: copy.ctaBody, ...copy.cta }}
      preview={
        draft ? (
          <PreviewBar
            path={report.href}
            note={
              report.gated
                ? `Email gate on: readers see the first ${report.previewBlocks} blocks, then the email form.`
                : undefined
            }
          />
        ) : null
      }
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: report.title,
          description: report.summary,
          datePublished: report.isoDate,
          image: report.image,
          url: `${SITE.url}${report.href}`,
          isAccessibleForFree: !report.gated,
          publisher: { "@type": "Organization", name: SITE.name },
        },
        report.seo?.structuredData,
      ]}
      after={
        more.length ? (
          <section className="ar-more" data-surface="light">
            <div className="wrap">
              <p className="eyebrow">{copy.more}</p>
              <div className="rs-grid">
                {more.map((r) => (
                  <ReportCard report={r} key={r.id} />
                ))}
              </div>
            </div>
          </section>
        ) : null
      }
    >
      <div
        className={locked ? "ar-rich ar-preview" : "ar-rich"}
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {locked ? <ResearchGate articleId={report.id} /> : null}
    </ArticleShell>
  )
}
