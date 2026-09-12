import Link from "next/link"

import { Clock } from "@/components/ui/clock"
import { ArrowIcon, ButtonArrow, CheckIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import {
  DETAIL_PAGE,
  LICENCE_FACTS,
  placesFor,
  SLUG_IMAGE,
} from "@/content/pages"
import type { ServiceContent } from "@/content/services"

/**
 * The sections that make up a per-service or per-licence page: overview,
 * process track, where we deliver it, and what to read next. The FAQ block is
 * the shared Faq component, and the hero is the shared PageHero.
 */

/** Sticky photo and assurances beside the copy, inclusions and any regulators. */
export function Overview({
  service,
  index,
  crumb,
  isLicence,
}: {
  service: ServiceContent
  index: number
  crumb: string
  isLicence: boolean
}) {
  const num = String(index + 1).padStart(2, "0")
  const facts = LICENCE_FACTS[service.slug]

  return (
    <section className="ov" id="overview" data-surface="light" data-spy-section>
      <div className="wrap">
        <aside className="svc-side">
          <div style={{ position: "relative" }}>
            <b className="svc-num" aria-hidden="true">
              {num}
            </b>
            <div className="svc-ph">
              <img src={SLUG_IMAGE[service.slug]} alt="" />
              <span className={`tag${isLicence ? "" : "is-flag"}`}>
                {crumb}
              </span>
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
          <SplitText
            as="h2"
            className="h2"
            text={
              isLicence
                ? DETAIL_PAGE.overviewHeading.licence
                : DETAIL_PAGE.overviewHeading.service
            }
          />
          {service.intro.map((paragraph) => (
            <p className="body" data-reveal key={paragraph.slice(0, 40)}>
              {paragraph}
            </p>
          ))}

          <blockquote className="pull">
            {isLicence && facts ? `${facts.audience}.` : service.tagline}
          </blockquote>

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

          {isLicence && facts ? (
            <div className="block" data-reveal>
              <h3>{DETAIL_PAGE.blocks.regulators}</h3>
              <ul className="check">
                {facts.regulators.map((regulator) => (
                  <li key={regulator}>
                    <i>
                      <CheckIcon />
                    </i>
                    {regulator}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="note" data-reveal>
            <b>
              {isLicence && facts
                ? facts.ownership
                : DETAIL_PAGE.note.service.title}
            </b>
            <p>
              {isLicence
                ? DETAIL_PAGE.note.licenceBody
                : DETAIL_PAGE.note.service.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Horizontal track of phases with a live step counter. Shared by the detail
 * pages and the India landing page, so it takes plain phases rather than a
 * whole service.
 */
export function ProcessTrack({
  phases,
  eyebrow = DETAIL_PAGE.process.eyebrow,
  headline,
  note = DETAIL_PAGE.process.note,
  id = "process",
}: {
  phases: { title: string; body: string }[]
  eyebrow?: string
  headline?: string
  note?: string
  id?: string
}) {
  const last = String(phases.length).padStart(2, "0")

  return (
    <section className="dproc" id={id} data-surface="dark" data-spy-section>
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {eyebrow}
            </p>
            <SplitText
              as="h2"
              className="h2"
              text={headline ?? DETAIL_PAGE.process.headline(phases.length)}
            />
          </div>
          <div className="count" id="procCount" data-reveal>
            <b>01</b> / {last}
          </div>
        </div>

        <div
          className="track"
          style={{ "--n": phases.length } as React.CSSProperties}
        >
          <i className="line" />
          <i className="lfill" />
          {phases.map((phase, i) => (
            <div className="pc" key={phase.title}>
              <span className="nd">{String(i + 1).padStart(2, "0")}</span>
              <span className="k">
                {DETAIL_PAGE.process.stepLabel} {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{phase.title}</h3>
              <p>{phase.body}</p>
            </div>
          ))}
        </div>

        <div className="foot" data-reveal>
          <SmartLink
            className="btn"
            href={DETAIL_PAGE.process.cta.href}
            data-magnetic
          >
            {DETAIL_PAGE.process.cta.label} <ButtonArrow />
          </SmartLink>
          <span className="muted" style={{ fontSize: 13.5 }}>
            {note}
          </span>
        </div>
      </div>
    </section>
  )
}

/** A service's own phases, with the leading "1." stripped from each title. */
export function ServiceProcess({ service }: { service: ServiceContent }) {
  return (
    <ProcessTrack
      phases={service.phases.map((p) => ({
        title: p.title.replace(/^\d+\.\s*/, ""),
        body: p.description,
      }))}
    />
  )
}

/** Market tiles derived from the service's own jurisdictions, with live clocks. */
export function WhereWeDeliver({ service }: { service: ServiceContent }) {
  const places = placesFor(service.jurisdictions)
  const headline =
    places.length === 1 && places[0]
      ? DETAIL_PAGE.where.single(places[0].name)
      : DETAIL_PAGE.where.many(places.length)

  return (
    <section className="where" id="where" data-surface="light" data-spy-section>
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {DETAIL_PAGE.where.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={headline} />
          </div>
          <Link className="link" href={DETAIL_PAGE.where.link.href} data-reveal>
            {DETAIL_PAGE.where.link.label} <ArrowIcon />
          </Link>
        </div>

        <div className={`reg-row${places.length > 3 ? "many" : ""}`}>
          {places.map((place) => (
            <SmartLink className="region" href="/#regions" key={place.name}>
              <img src={place.image} alt="" />
              <span className="tz">
                <i />
                <Clock as="span" timeZone={place.timeZone} />
              </span>
              <div className="in">
                <span className="k">{place.kicker}</span>
                <h3>{place.name}</h3>
                <p>{place.body}</p>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The next item in the set, plus cards for the rest and the hub. */
export function UpNext({
  next,
  siblings,
  isLicence,
  hubHref,
  hrefFor,
  indexOf,
}: {
  next: ServiceContent
  siblings: ServiceContent[]
  isLicence: boolean
  hubHref: string
  hrefFor: (slug: string) => string
  indexOf: (slug: string) => number
}) {
  const copy = DETAIL_PAGE.next

  return (
    <section className="upnext" id="next" data-surface="light" data-spy-section>
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {copy.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="h2"
          text={isLicence ? copy.headline.licence : copy.headline.service}
        />

        <Link className="upnext-big" href={hrefFor(next.slug)} data-reveal>
          <span className="n">
            {String(indexOf(next.slug) + 1).padStart(2, "0")}
          </span>
          <div>
            <span className="k">
              {isLicence ? copy.kicker.licence : copy.kicker.service}
            </span>
            <h3>{next.title}</h3>
            <p>{next.tagline}</p>
          </div>
          <span className="go">
            <ArrowIcon />
          </span>
        </Link>

        <ul className="sibs">
          {siblings.map((sibling) => (
            <li key={sibling.slug}>
              <Link className="sib" href={hrefFor(sibling.slug)}>
                <b>{String(indexOf(sibling.slug) + 1).padStart(2, "0")}</b>
                <strong>{sibling.title}</strong>
                <span>
                  {copy.readCta} <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link className="sib" href={hubHref}>
              <b>All</b>
              <strong>
                {isLicence ? copy.allCta.licence : copy.allCta.service}
              </strong>
              <span>
                {copy.openCta} <ArrowIcon />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
