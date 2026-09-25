import { BrandMark } from "@/components/ui/brand-mark"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"

/**
 * Closing call to action, shared by every page.
 *
 * The brand mark behind it is drawn line by line as the section scrolls into
 * view, and the glow follows the pointer. Only the copy changes per page.
 */
export function CtaSection({
  eyebrow,
  headline,
  lede,
  primary,
  secondary,
  children,
  id = "contact",
}: {
  eyebrow: string
  headline: string
  lede: string
  primary: { label: string; href: string }
  /** Optional: left out when its target is hidden (e.g. research). */
  secondary?: { label: string; href: string }
  /** Optional extra row under the buttons, used by the India page. */
  children?: React.ReactNode
  id?: string
}) {
  return (
    <section className="cta" id={id} data-surface="dark">
      <BrandMark
        className="bgmark"
        id="ctaMark"
        preserveAspectRatio="xMidYMid meet"
      />
      <div className="wrap">
        <p className="eyebrow" data-reveal style={{ justifyContent: "center" }}>
          {eyebrow}
        </p>
        <SplitText as="h2" className="h1" text={headline} />
        <p className="lede muted" data-reveal>
          {lede}
        </p>
        <div className="cta-btns" data-reveal>
          {secondary ? (
            <SmartLink
              className="btn btn--ghost"
              href={secondary.href}
              data-magnetic
            >
              {secondary.label} <ButtonArrow />
            </SmartLink>
          ) : null}
          <SmartLink className="btn" href={primary.href} data-magnetic>
            {primary.label} <ButtonArrow />
          </SmartLink>
        </div>
        {children}
      </div>
    </section>
  )
}
