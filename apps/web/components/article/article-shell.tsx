import type { ReactNode } from "react"

import { PageMotion } from "@/components/motion/page-motion"
import { PageHero, type Crumb } from "@/components/pages/page-hero"
import { ArrowIcon, ButtonArrow } from "@/components/ui/icons"
import { JsonLd } from "@/components/seo/json-ld"
import { SmartLink } from "@/components/ui/smart-link"

/**
 * The page around a blog post or research article: the photo hero, the text
 * with a sticky side column (facts, the way back, a consultation prompt), then
 * whatever comes after (related reading).
 */
export function ArticleShell({
  image,
  crumbs,
  title,
  lede,
  facts,
  back,
  cta,
  children,
  after,
  jsonLd,
  preview,
}: {
  image: string
  crumbs: readonly Crumb[]
  title: string
  lede: string
  facts: { label: string; value: string; dateTime?: string }[]
  back: { label: string; href: string }
  cta: { headline: string; body: string; label: string; href: string }
  children: ReactNode
  after?: ReactNode
  /** The article block, plus any structured data the editor added. */
  jsonLd: unknown[]
  /** The preview bar, while an editor is looking at a draft. */
  preview?: ReactNode
}) {
  return (
    <PageMotion variant="company">
      {jsonLd.map((data, i) => (
        <JsonLd data={data} key={i} />
      ))}
      {preview}

      <PageHero
        className="dhero ar-hero"
        image={image}
        crumbs={crumbs}
        headline={title}
        lede={lede}
      />

      <section className="ar-body" data-surface="light">
        <div className="wrap">
          <aside className="ar-side">
            <SmartLink className="link ar-back" href={back.href}>
              <ArrowIcon /> {back.label}
            </SmartLink>
            <dl className="ar-facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    {fact.dateTime ? (
                      <time dateTime={fact.dateTime}>{fact.value}</time>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="ar-cta">
              <b>{cta.headline}</b>
              <p>{cta.body}</p>
              <SmartLink className="btn" href={cta.href} data-magnetic>
                {cta.label} <ButtonArrow />
              </SmartLink>
            </div>
          </aside>

          <article className="ar-prose">{children}</article>
        </div>
      </section>

      {after}
    </PageMotion>
  )
}
