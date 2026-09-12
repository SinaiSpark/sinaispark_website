import { ButtonArrow, LockIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { INSIGHTS, type Insight } from "@/content/insights"
import { cx } from "@/lib/cx"

/**
 * Research and insights: one feature card and two compact rows.
 *
 * PENDING_CLIENT_DATA — the reports have no destination pages yet, so every
 * card currently points at the consultation anchor.
 */
function Meta({ meta, gated }: { meta: string; gated: boolean }) {
  return (
    <div className="meta">
      <span>{meta}</span>
      {gated ? (
        <span className="lock">
          <LockIcon />
          {INSIGHTS.gatedLabel}
        </span>
      ) : null}
    </div>
  )
}

function Card({ item, feature }: { item: Insight; feature?: boolean }) {
  return (
    <SmartLink
      className={cx("ins", feature ? "ins--feat" : "ins--row")}
      href={item.href}
      data-reveal
    >
      <div className="ph">
        <img src={item.image} alt="" />
      </div>
      <div className="tx">
        <div className="tags">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h3>{item.title}</h3>
        {item.summary ? <p>{item.summary}</p> : null}
        <Meta meta={item.meta} gated={item.gated} />
      </div>
    </SmartLink>
  )
}

export function Insights() {
  return (
    <section className="insights" id="insights" data-surface="light">
      <div className="wrap">
        <div className="ins-head">
          <div>
            <p className="eyebrow" data-reveal>
              {INSIGHTS.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={INSIGHTS.headline} />
          </div>
          <SmartLink
            className="btn btn--ghost"
            href={INSIGHTS.cta.href}
            data-magnetic
            data-reveal
          >
            {INSIGHTS.cta.label} <ButtonArrow />
          </SmartLink>
        </div>

        <div className="ins-grid">
          <Card item={INSIGHTS.feature} feature />
          <div className="ins-side">
            {INSIGHTS.rows.map((row) => (
              <Card item={row} key={row.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
