import Link from "next/link"

import { SplitText } from "@/components/ui/split-text"
import { cx } from "@/lib/cx"

/**
 * Hero shared by the hub pages and the ten detail pages: a full-bleed
 * photograph, breadcrumbs, a masked headline, and either a stat strip or
 * whatever the page passes as `side`.
 */
export interface Crumb {
  label: string
  href?: string
}

export interface HeroStat {
  /** Counts up from zero when given a number. */
  value?: number
  /** Rendered as-is for text values such as an ownership rule. */
  text?: string
  label: string
}

export function PageHero({
  image,
  crumbs,
  headline,
  lede,
  stats,
  actions,
  side,
  className = "",
}: {
  image?: string
  crumbs: readonly Crumb[]
  headline: string
  lede: string
  stats?: readonly HeroStat[]
  actions?: React.ReactNode
  side?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx("phero", className)} data-surface="dark">
      {image ? (
        <div className="phero-media">
          <img src={image} alt="" />
        </div>
      ) : null}

      <div className="wrap">
        <div>
          <div className="crumbs">
            {crumbs.map((crumb, i) => (
              <span key={crumb.label} style={{ display: "contents" }}>
                {i > 0 ? <span>/</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
          <SplitText as="h1" className="h1" text={headline} />
          <p className="lede">{lede}</p>
          {actions}
        </div>

        {stats ? (
          <aside className="phero-meta">
            {stats.map((stat) => (
              <div key={stat.label}>
                {stat.text ? (
                  <b
                    style={{
                      fontSize: "clamp(20px,1.6vw,26px)",
                      letterSpacing: "-.03em",
                      lineHeight: 1.15,
                    }}
                  >
                    {stat.text}
                  </b>
                ) : (
                  <b>
                    <span data-count={stat.value}>0</span>
                  </b>
                )}
                <span>{stat.label}</span>
              </div>
            ))}
          </aside>
        ) : null}

        {side}
      </div>
    </section>
  )
}
