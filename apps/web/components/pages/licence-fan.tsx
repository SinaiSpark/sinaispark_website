import { BrandMark } from "@/components/ui/brand-mark"
import type { ServiceContent } from "@/content/services"

/**
 * The five licence cards fanned out in the licences hero.
 *
 * Position, rotation and stacking all come from GSAP — including the centring,
 * which is why there is no `translate` in the stylesheet. Browsers disagree on
 * whether GSAP absorbs a CSS `translate` into its own transform, and when one
 * of them did not, every card lost its half-width offset and the fan slid off
 * to the right.
 */
export function LicenceFan({ licences }: { licences: ServiceContent[] }) {
  return (
    <div className="fan" id="fan">
      {licences.map((licence, i) => (
        <a href={`#${licence.slug}`} data-i={i} key={licence.slug}>
          <b>
            {String(i + 1).padStart(2, "0")} /{" "}
            {String(licences.length).padStart(2, "0")}
          </b>
          <div>
            <strong>{licence.title}</strong>
            <small>{licence.tagline}</small>
          </div>
          <BrandMark className="mk" />
        </a>
      ))}
    </div>
  )
}
