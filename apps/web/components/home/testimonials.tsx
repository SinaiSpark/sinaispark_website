import { SplitText } from "@/components/ui/split-text"
import { TESTIMONIALS } from "@/content/testimonials"

/**
 * Testimonial marquee. The design duplicated the track on the client to get a
 * seamless loop; here the cards are simply repeated four times in the markup,
 * which produces the same thing without touching the DOM after render.
 *
 * MOCK DATA — see content/testimonials.ts.
 */
const LOOPS = 4

export function Testimonials() {
  return (
    <section className="testi" data-surface="dark">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {TESTIMONIALS.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={TESTIMONIALS.headline} />
        <p className="lede muted" data-reveal>
          {TESTIMONIALS.lede}
        </p>
      </div>

      <div className="marquee">
        <div className="marquee-track" id="mqTrack">
          {Array.from({ length: LOOPS }).flatMap((_, loop) =>
            TESTIMONIALS.items.map((item) => (
              <div
                className="tcard"
                key={`${loop}-${item.name}`}
                aria-hidden={loop > 0}
              >
                <q>{item.quote}</q>
                <div className="tby">
                  <div className="av">{item.name.charAt(0)}</div>
                  <div>
                    <div className="nm">{item.name}</div>
                    <div className="rl">{item.role}</div>
                  </div>
                  <span className="mk">{item.market}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
