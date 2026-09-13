import Link from "next/link"

import { Clock } from "@/components/ui/clock"
import { ArrowIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { ABOUT } from "@/content/about"
import { PLACES } from "@/content/pages"
import { ROUTES } from "@/content/site"
import { cx } from "@/lib/cx"

/**
 * The About page's own sections. Its story, mission, team and closing CTA are
 * the shared components; what lives here is the material that only this page
 * has — the three differentiators, the three values, and the five markets.
 */

/** What sets us apart: the same editorial row treatment as the home page's "why". */
export function AboutApart() {
  const copy = ABOUT.apart

  return (
    <section className="ab-apart" id="apart" data-surface="light">
      <div className="wrap">
        <div className="lead">
          <p className="eyebrow" data-reveal>
            {copy.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={copy.headline} />
          <p className="lede muted" data-reveal>
            {copy.lede}
          </p>
          <SmartLink className="link" href={copy.link.href} data-reveal>
            {copy.link.label} <ArrowIcon />
          </SmartLink>
        </div>

        <ul className="why-list">
          {copy.rows.map((row, i) => (
            <li className="why-row" key={row.title}>
              <span className="k">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </div>
              <svg
                className="arrow"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * Three value tiles. The outlined numeral behind each one drifts against the
 * scroll, and the middle tile is navy so the row has a centre of gravity.
 */
export function AboutValues() {
  const copy = ABOUT.values

  return (
    <section
      className="ab-vals"
      id="values"
      data-surface="light"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
          <p className="lede muted" data-reveal style={{ maxWidth: "36ch" }}>
            {copy.lede}
          </p>
        </div>

        <div className="ab-val-grid">
          {copy.items.map((value, i) => (
            <div
              className={cx("ab-val", i === 1 && "is-dark")}
              key={value.name}
            >
              <span className="gn" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="k">{value.kicker}</span>
              <h3>{value.name}</h3>
              <p>{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The five markets, each with the local time running in the corner. */
const MARKET_KEYS = ["saudi", "uae", "india", "uk", "bahrain"] as const

export function AboutWhere() {
  const copy = ABOUT.where
  const markets = MARKET_KEYS.flatMap((key) => PLACES[key] ?? [])

  return (
    <section
      className="dwhere ab-where"
      id="where"
      data-surface="light"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
          <Link className="link" href={copy.link.href} data-reveal>
            {copy.link.label} <ArrowIcon />
          </Link>
        </div>

        <div className={cx("reg-row", markets.length > 3 && "many")}>
          {markets.map((market) => (
            <SmartLink
              className="region"
              href={market.name === "India" ? ROUTES.india : ROUTES.markets}
              key={market.name}
            >
              <img src={market.image} alt="" />
              <span className="tz">
                <i />
                <Clock as="span" timeZone={market.timeZone} />
              </span>
              <div className="in">
                <span className="k">{market.kicker}</span>
                <h3>{market.name}</h3>
                <p>{market.body}</p>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}
