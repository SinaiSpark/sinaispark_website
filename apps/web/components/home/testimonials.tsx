import { SplitText } from "@/components/ui/split-text"
import { TESTIMONIALS } from "@/content/testimonials"
import type { Testimonial } from "@/lib/site-content"

/**
 * Testimonial marquee. The design duplicated the track on the client to get a
 * seamless loop; here the cards are simply repeated in the markup, which
 * produces the same thing without touching the DOM after render.
 *
 * The reviews come from the CMS (lib/site-content.ts): imported Google
 * reviews and ones added by hand, whichever an editor has published. A card
 * with a link opens that review on Google in a new tab.
 */

/** Copies of the set in the track. Even, so sliding by -50% loops cleanly. */
const loopsFor = (count: number) => (count >= 6 ? 2 : 4)
/** The design's pace: six cards' width every 46 seconds. */
const SECONDS_PER_CARD = 46 / 6

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tstars" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "on" : undefined}>
          ★
        </span>
      ))}
    </span>
  )
}

function Card({ item, hidden }: { item: Testimonial; hidden: boolean }) {
  const body = (
    <>
      <Stars rating={item.rating} />
      <q>{item.quote}</q>
      <div className="tby">
        <div className="av" aria-hidden="true">
          {item.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="nm">{item.name}</div>
          <div className="rl">
            {[item.byline, item.date].filter(Boolean).join(" · ")}
          </div>
        </div>
        {item.market ? <span className="mk">{item.market}</span> : null}
      </div>
    </>
  )

  return item.url ? (
    <a
      className="tcard is-link"
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      title="Read this review on Google"
    >
      {body}
    </a>
  ) : (
    <div className="tcard" aria-hidden={hidden || undefined}>
      {body}
    </div>
  )
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null
  const loops = loopsFor(items.length)
  const duration = (loops / 2) * items.length * SECONDS_PER_CARD

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
        <div
          className="marquee-track"
          id="mqTrack"
          style={{ animationDuration: `${duration}s` }}
        >
          {Array.from({ length: loops }).flatMap((_, loop) =>
            items.map((item, i) => (
              <Card key={`${loop}-${i}`} item={item} hidden={loop > 0} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
