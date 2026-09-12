import Link from "next/link"

import { ArrowIcon, ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { INDIA_SPOTLIGHT } from "@/content/home"

/**
 * India teaser on the home page. The photograph drifts at its own rate inside
 * the frame (`data-parallax` / `data-speed`), with the three structures listed
 * over it.
 */
export function IndiaSpotlight() {
  return (
    <section className="india" id="india" data-surface="dark">
      <div className="wrap">
        <div>
          <p className="eyebrow" data-reveal>
            {INDIA_SPOTLIGHT.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={INDIA_SPOTLIGHT.headline} />
          <p className="lede muted" data-reveal>
            {INDIA_SPOTLIGHT.lede}
          </p>
          <ul className="trust" data-reveal>
            {INDIA_SPOTLIGHT.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="india-ctas" data-reveal>
            <SmartLink
              className="btn"
              href={INDIA_SPOTLIGHT.primary.href}
              data-magnetic
            >
              {INDIA_SPOTLIGHT.primary.label} <ButtonArrow />
            </SmartLink>
            <Link
              className="link"
              href={INDIA_SPOTLIGHT.secondary.href}
              style={{ color: "var(--spark)" }}
            >
              {INDIA_SPOTLIGHT.secondary.label} <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className="india-visual" data-reveal data-parallax>
          <img
            src={INDIA_SPOTLIGHT.image.src}
            alt={INDIA_SPOTLIGHT.image.alt}
            data-speed="1.1"
          />
          <div className="struct">
            {INDIA_SPOTLIGHT.structures.map((structure) => (
              <div key={structure.name}>
                {structure.name}
                {"badge" in structure && structure.badge ? (
                  <span className="pop">{structure.badge}</span>
                ) : null}
                {"note" in structure && structure.note ? (
                  <small>{structure.note}</small>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
