import { Clock } from "@/components/ui/clock"
import { ArrowIcon, ButtonArrow, CheckIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { INDIA } from "@/content/india"
import { INDIA_PAGE } from "@/content/india-page"
import { cx } from "@/lib/cx"

/**
 * The India landing page's own sections. The copy is the client's, supplied
 * verbatim in content/india.ts; the framing comes from content/india-page.ts.
 */

/** Hero: the incorporation certificate that fills itself in, beside the pitch. */
export function IndiaHero() {
  const cert = INDIA_PAGE.certificate
  const route = INDIA_PAGE.route

  return (
    <section className="phero ihero" data-surface="dark">
      <div className="phero-media">
        <img
          src="/images/india/mumbai-business-district.jpg"
          alt="Mumbai skyline"
        />
      </div>

      <div className="wrap">
        <div>
          <div className="crumbs">
            <SmartLink href="/">Home</SmartLink>
            <span>/</span>
            <span>India</span>
          </div>
          <p className="eyebrow" data-reveal>
            <i className="tri" />
            {INDIA.hero.eyebrow}
          </p>
          <SplitText
            as="h1"
            className="h1"
            text={`${INDIA.hero.headline}.`}
            style={{ marginTop: 22 }}
          />
          <p className="lede">{INDIA.hero.subheadline}</p>

          <div className="d-actions">
            <SmartLink
              className="btn"
              href={INDIA_PAGE.hero.primary}
              data-magnetic
            >
              {INDIA.hero.primaryCta.label} <ButtonArrow />
            </SmartLink>
            <a
              className="btn btn--ghost"
              href={INDIA_PAGE.hero.secondary}
              data-magnetic
            >
              {INDIA.hero.secondaryCta.label} <ButtonArrow down />
            </a>
          </div>

          <ul className="trust" data-reveal>
            {INDIA.hero.trustStrip.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="phero-side cert-wrap">
          <div className="cert" id="cert" data-cin={cert.cin}>
            <div className="hd">
              <span>
                <i /> {cert.authority}
              </span>
              <span>{cert.form}</span>
            </div>
            <h3>{cert.title}</h3>
            <div className="co">{cert.company}</div>
            <div className="row">
              <b>{cert.cinLabel}</b>
              <span className="cin" />
            </div>
            {cert.rows.map((row) => (
              <div className="row" key={row.label}>
                <b>{row.label}</b>
                <span>{row.value}</span>
              </div>
            ))}
            <div className="kit">
              {cert.kit.map((item) => (
                <span key={item}>
                  <i>
                    <CheckIcon />
                  </i>
                  {item}
                </span>
              ))}
            </div>
            <div className="stamp">{cert.stamp}</div>
          </div>

          <div className="route">
            <span>
              {route.from.city} <Clock timeZone={route.from.timeZone} />
            </span>
            <i className="ln" />
            <span>
              {route.to.city} <Clock timeZone={route.to.timeZone} />
            </span>
            <span>{route.note}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Mono ticker of the two trust strips. */
export function IndiaTicker() {
  const items = [...INDIA.hero.trustStrip, ...INDIA.trustStrip2]
  return (
    <div className="tick">
      <div className="marquee">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Who the page is for: five numbered rows against a sticky heading. */
export function IndiaAudiences() {
  return (
    <section className="aud" id="who" data-surface="light">
      <div className="wrap">
        <div className="aud-lead">
          <p className="eyebrow" data-reveal>
            {INDIA.audiences.title}
          </p>
          <SplitText
            as="h2"
            className="h2"
            text={INDIA_PAGE.audiences.headline}
          />
          <p className="lede muted" data-reveal>
            {INDIA_PAGE.audiences.lede}
          </p>
          <a className="link" href={INDIA_PAGE.audiences.link.href} data-reveal>
            {INDIA_PAGE.audiences.link.label} <ArrowIcon />
          </a>
        </div>

        <ul className="aud-list">
          {INDIA.audiences.items.map((item, i) => (
            <li className="why-row" key={item}>
              <span className="k">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{INDIA_PAGE.audienceTitles[i]}</h3>
                <p>{item}</p>
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

/** Everything we handle, as numbered tiles. */
export function IndiaIncluded() {
  return (
    <section className="inc" id="included" data-surface="light">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {INDIA_PAGE.included.eyebrow}
            </p>
            <SplitText
              as="h2"
              className="h2"
              text={INDIA_PAGE.included.headline}
            />
          </div>
          <SmartLink
            className="btn btn--navy"
            href={INDIA_PAGE.included.cta.href}
            data-magnetic
            data-reveal
          >
            {INDIA_PAGE.included.cta.label} <ButtonArrow />
          </SmartLink>
        </div>

        <div className="inc-grid">
          {INDIA.servicesList.map((item, i) => (
            <div className="inc-item" key={item}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The NRI bridge: two cities, a drawn arc and a large zero. */
export function IndiaBridge() {
  const bridge = INDIA_PAGE.bridge

  return (
    <section className="bridge" id="nri" data-surface="dark">
      <div className="wrap">
        <div>
          <p className="eyebrow" data-reveal>
            {INDIA.nri.title}
          </p>
          <SplitText as="h2" className="h2" text={bridge.headline} />
          <p className="lede" data-reveal>
            {INDIA.nri.intro}
          </p>
          <ul className="check" data-reveal>
            {INDIA.nri.points.map((point) => (
              <li key={point}>
                <i>
                  <CheckIcon />
                </i>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bmap">
          <svg viewBox="0 0 560 560" aria-hidden="true">
            <circle className="ring" cx="280" cy="280" r="200" />
            <circle className="ring" cx="280" cy="280" r="130" />
            <path className="arc" d="M70 380 C 150 120, 330 60, 500 90" />
            <path
              className="arcfill"
              id="arcFill"
              d="M70 380 C 150 120, 330 60, 500 90"
            />
            <circle className="dot" id="arcDot" cx="70" cy="380" r="6" />
          </svg>

          <div className="bnode a">
            <span>
              <i />
              {bridge.from.label}
            </span>
            <b>{bridge.from.title}</b>
            <Clock as="span" className="t" timeZone={bridge.from.timeZone} />
          </div>
          <div className="bnode b">
            <span>
              <i />
              {bridge.to.label}
            </span>
            <b>{bridge.to.title}</b>
            <Clock as="span" className="t" timeZone={bridge.to.timeZone} />
          </div>
          <div className="zero">
            <b>{bridge.zero.figure}</b>
            <span>{bridge.zero.label}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Six reasons, one of them rendered as a figure. */
export function IndiaWhy() {
  const { why, whyTitles } = INDIA_PAGE

  return (
    <section className="wy" id="why" data-surface="light">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {why.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={why.headline} />

        <div className="wy-grid">
          {INDIA.whyUs.map((item, i) => (
            <div
              className={cx("wy-tile", i === why.featureIndex && "is-dark")}
              key={item}
            >
              <span className="gn">{String(i + 1).padStart(2, "0")}</span>
              <h3>
                {i === why.featureIndex ? (
                  <>
                    <span>{why.featureFigure}</span> {why.featureRest}
                  </>
                ) : (
                  whyTitles[i]
                )}
              </h3>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Three packages. Fees are placeholders and the badge says so. */
export function IndiaPricing() {
  const copy = INDIA_PAGE.pricing

  return (
    <section className="price" id="pricing" data-surface="light">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
          <span className="mock" data-reveal>
            {copy.mockBadge}
          </span>
        </div>

        <div className="pk-grid">
          {INDIA.pricing.packages.map((pack) => (
            <div className={cx("pk", pack.popular && "is-pop")} key={pack.name}>
              {pack.popular ? (
                <span className="pop">
                  {copy.mockBadge ? "Most popular" : ""}
                </span>
              ) : null}
              <span className="nm">{pack.name}</span>
              <div className="fee">
                <span data-fee={pack.fee.replace(/[^\d]/g, "")}>
                  {pack.fee}
                </span>
                <small>{copy.feeSuffix}</small>
              </div>
              <div>
                <div className="st">{pack.structure}</div>
                <div className="bf">{pack.bestFor}</div>
              </div>
              <ul>
                {pack.includes.split(/,\s*/).map((line) => (
                  <li key={line}>
                    <i>
                      <CheckIcon />
                    </i>
                    {line}
                  </li>
                ))}
              </ul>
              <SmartLink
                className={cx("btn", !pack.popular && "btn--navy")}
                href={INDIA_PAGE.cta.primary.href}
                data-magnetic
              >
                {copy.choosePrefix} {pack.name} <ButtonArrow />
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
