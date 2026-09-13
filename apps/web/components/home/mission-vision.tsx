import { BrandMark } from "@/components/ui/brand-mark"
import { SplitText } from "@/components/ui/split-text"
import { MISSION_VISION } from "@/content/home"

/**
 * Mission and vision as two spotlit panels. The glow inside each one follows
 * the pointer, wired up by the motion layer.
 */
export function MissionVision({
  spy = false,
}: {
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
} = {}) {
  return (
    <section
      className="mv"
      id="mission"
      data-surface="dark"
      data-spy-section={spy ? "" : undefined}
    >
      <BrandMark className="bgmark" preserveAspectRatio="xMidYMid meet" />
      <div className="wrap">
        <div className="mv-head">
          <div>
            <p className="eyebrow" data-reveal>
              {MISSION_VISION.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={MISSION_VISION.headline} />
          </div>
          <p className="lede muted" data-reveal>
            {MISSION_VISION.lede}
          </p>
        </div>

        <div className="mv-grid">
          {MISSION_VISION.panels.map((panel) => (
            <article className="mv-panel" data-reveal key={panel.label}>
              <span className="mv-k">
                <b>{panel.badge}</b>
                {panel.label}
              </span>
              <SplitText as="p" className="mv-text" text={panel.text} />
              <ul className="mv-tags">
                {panel.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
