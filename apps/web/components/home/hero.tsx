import { Clock } from "@/components/ui/clock"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { HERO } from "@/content/home"
import { CLOCKS } from "@/content/site"

/**
 * Hero: looping city video, a spark canvas the motion layer paints on, the
 * masked headline, and live local time in all five markets.
 *
 * The video carries two sources — the local file first, a CDN copy as backup.
 */
export function Hero() {
  return (
    <section className="hero" data-surface="dark">
      <div className="hero-media">
        <video
          className="media"
          id="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO.video.poster}
          aria-label={HERO.video.label}
        >
          {HERO.video.sources.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
      </div>

      <canvas className="hero-canvas" id="sparks" aria-hidden="true" />

      <div className="wrap">
        <div>
          <p className="eyebrow hero-eyebrow">{HERO.eyebrow}</p>
          <SplitText as="h1" className="h1 hero-h" text={HERO.headline} />
          <p className="lede hero-sub">{HERO.lede}</p>
          <div className="hero-ctas">
            <SmartLink className="btn" href={HERO.primary.href} data-magnetic>
              {HERO.primary.label} <ButtonArrow />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={HERO.secondary.href}
              data-magnetic
            >
              {HERO.secondary.label} <ButtonArrow down />
            </SmartLink>
          </div>
        </div>

        <aside className="hero-meta" aria-label="Local time in our markets">
          <div className="lbl">{HERO.clocksLabel}</div>
          {CLOCKS.map((clock) => (
            <div className="row" key={clock.timeZone}>
              <span>{clock.city}</span>
              <Clock timeZone={clock.timeZone} />
            </div>
          ))}
        </aside>
      </div>
    </section>
  )
}
