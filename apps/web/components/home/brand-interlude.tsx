import { BrandMark } from "@/components/ui/brand-mark"
import { SplitText } from "@/components/ui/split-text"
import { BRAND_INTERLUDE } from "@/content/home"

/**
 * The mark drawing itself.
 *
 * Two copies of the artwork are stacked: `brand-ghost` is the faint outline
 * that is always visible, `brand-mark` is the one the motion layer draws with
 * strokeDashoffset and then fills. On desktop the section pins while it draws,
 * and the caption counts the progress.
 */
export function BrandInterlude() {
  return (
    <section className="brand" id="brand" data-surface="dark">
      <div className="wrap brand-stage">
        <div className="brand-copy">
          <p className="eyebrow" data-reveal>
            {BRAND_INTERLUDE.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={BRAND_INTERLUDE.headline} />
          <p className="lede muted" data-reveal>
            {BRAND_INTERLUDE.lede}
          </p>
        </div>
        <div>
          <div className="brand-art">
            <BrandMark className="brand-ghost" />
            <BrandMark className="brand-mark" />
          </div>
          <p className="brand-caption" id="brandCaption">
            {BRAND_INTERLUDE.caption.replace("{pct}", "0")}
          </p>
        </div>
      </div>
    </section>
  )
}
