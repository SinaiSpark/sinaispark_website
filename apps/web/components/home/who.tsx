import { SplitText } from "@/components/ui/split-text"
import { WHO } from "@/content/home"
import { cx } from "@/lib/cx"

/**
 * The positioning statement beside a parallax stack of three photographs. Each
 * figure carries a `data-speed` the motion layer reads to decide how far it
 * drifts.
 *
 * The home page tells it as "who we are" and the About page as "our story", so
 * the copy is a prop; everything else about the section is the same.
 */
export interface StoryImage {
  src: string
  alt: string
  /** Parallax rate. 1 keeps pace with the page; higher drifts faster. */
  speed: string
}

export interface StoryContent {
  eyebrow: string
  headline: string
  lede: string
  quote: string
  images: readonly StoryImage[]
  chip: { badge: string; text: string }
}

/** Grid positions for the three figures, in the order the design stacked them. */
const FIGURES = ["f1", "f2", "f3"] as const

export function Who({
  content = WHO,
  id = "who",
  className,
  spy = false,
}: {
  content?: StoryContent
  id?: string
  className?: string
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
} = {}) {
  return (
    <section
      className={cx("who", className)}
      id={id}
      data-surface="light"
      data-spy-section={spy ? "" : undefined}
    >
      <div className="wrap">
        <div className="who-text">
          <p className="eyebrow" data-reveal>
            {content.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={content.headline} />
          <p className="lede muted" data-reveal>
            {content.lede}
          </p>
          <p className="who-quote" data-reveal>
            {content.quote}
          </p>
        </div>

        <div className="who-stack">
          {content.images.slice(0, FIGURES.length).map((image, i) => (
            <figure
              className={FIGURES[i]}
              data-speed={image.speed}
              key={image.src}
            >
              <img src={image.src} alt={image.alt} />
            </figure>
          ))}
          <div className="chip" data-speed="1.2">
            <b>{content.chip.badge}</b>
            {content.chip.text}
          </div>
        </div>
      </div>
    </section>
  )
}
