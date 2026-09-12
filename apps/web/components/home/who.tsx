import { SplitText } from "@/components/ui/split-text"
import { WHO } from "@/content/home"

/**
 * Who we are: the positioning statement beside a parallax stack of three
 * photographs. Each figure carries a `data-speed` the motion layer reads to
 * decide how far it drifts.
 */
export function Who() {
  const [first, second, third] = WHO.images

  return (
    <section className="who" id="who" data-surface="light">
      <div className="wrap">
        <div className="who-text">
          <p className="eyebrow" data-reveal>
            {WHO.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={WHO.headline} />
          <p className="lede muted" data-reveal>
            {WHO.lede}
          </p>
          <p className="who-quote" data-reveal>
            {WHO.quote}
          </p>
        </div>

        <div className="who-stack">
          <figure className="f1" data-speed={first.speed}>
            <img src={first.src} alt={first.alt} />
          </figure>
          <figure className="f2" data-speed={second.speed}>
            <img src={second.src} alt={second.alt} />
          </figure>
          <figure className="f3" data-speed={third.speed}>
            <img src={third.src} alt={third.alt} />
          </figure>
          <div className="chip" data-speed={WHO.chip ? "1.2" : undefined}>
            <b>{WHO.chip.badge}</b>
            {WHO.chip.text}
          </div>
        </div>
      </div>
    </section>
  )
}
