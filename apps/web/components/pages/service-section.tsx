import Link from "next/link"

import { ArrowIcon, ButtonArrow, CheckIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import type { ServiceContent } from "@/content/services"
import { DETAIL_PAGE, SERVICES_PAGE, SLUG_IMAGE } from "@/content/pages"
import { cx } from "@/lib/cx"

/**
 * One service or licence, rendered in full on a hub page.
 *
 * The left column is sticky: an outlined numeral, the photograph, the assurance
 * tiles and the jurisdictions. The right column carries the copy, the
 * inclusions checklist and the phase stepper.
 */
export function ServiceSection({
  service,
  index,
  crumb,
  flag = false,
  fullPageHref,
}: {
  service: ServiceContent
  index: number
  crumb: string
  flag?: boolean
  /** Link through to the dedicated page for this item. */
  fullPageHref: string
}) {
  const num = String(index + 1).padStart(2, "0")

  return (
    <section
      className="svc"
      id={service.slug}
      data-surface="light"
      data-spy-section
    >
      <div className="wrap">
        <aside className="svc-side">
          <div style={{ position: "relative" }}>
            <b className="svc-num" aria-hidden="true">
              {num}
            </b>
            <div className="svc-ph">
              <img src={SLUG_IMAGE[service.slug]} alt="" />
              <span className={cx("tag", flag && "is-flag")}>{crumb}</span>
            </div>
          </div>

          <ul className="assure">
            {service.assurances.map((assurance) => (
              <li key={assurance}>
                <i>
                  <CheckIcon />
                </i>
                {assurance}
              </li>
            ))}
          </ul>

          <div className="juris">
            {service.jurisdictions.map((j, i) => (
              <span key={j} style={{ display: "contents" }}>
                {i > 0 ? <span>·</span> : null}
                <span>{j}</span>
              </span>
            ))}
          </div>
        </aside>

        <div className="svc-main">
          <p className="eyebrow" data-reveal>
            {num} — {crumb}
          </p>
          <SplitText as="h2" className="h2" text={service.title} />
          <p className="svc-tag" data-reveal>
            {service.tagline}
          </p>
          {service.intro.map((paragraph) => (
            <p className="body" data-reveal key={paragraph.slice(0, 40)}>
              {paragraph}
            </p>
          ))}

          <div className="block" data-reveal>
            <h3>{DETAIL_PAGE.blocks.included}</h3>
            <ul className="check">
              {service.bullets.map((bullet) => (
                <li key={bullet}>
                  <i>
                    <CheckIcon />
                  </i>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="block" data-reveal>
            <h3>{DETAIL_PAGE.process.eyebrow}</h3>
            <ol className="stepper">
              <i className="fill" />
              {service.phases.map((phase, i) => (
                <li key={phase.title}>
                  <span className="nd">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{phase.title.replace(/^\d+\.\s*/, "")}</h4>
                    <p>{phase.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {service.closingNote ? (
            <div className="note" data-reveal>
              <b>{service.closingNote.title}</b>
              <p>{service.closingNote.body}</p>
            </div>
          ) : null}

          <div className="svc-ctas" data-reveal>
            <SmartLink
              className="btn btn--navy"
              href={SERVICES_PAGE.sectionCtas.consult.href}
              data-magnetic
            >
              {SERVICES_PAGE.sectionCtas.consult.label} <ButtonArrow />
            </SmartLink>
            <Link className="link" href={fullPageHref}>
              {SERVICES_PAGE.sectionCtas.full} <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
