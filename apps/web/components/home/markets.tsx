import Link from "next/link"

import { ArrowIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { MARKETS } from "@/content/home"
import { cx } from "@/lib/cx"

/**
 * The five markets, scrolled sideways while the section is pinned.
 *
 * On desktop the motion layer pins this and translates `#mkTrack`; below 900px
 * the CSS turns the cards into a snap-scrolling row instead, so the markup is
 * the same either way.
 */
export function Markets() {
  return (
    <section className="markets" id="markets" data-surface="dark">
      <div className="mk-stage">
        <div className="mk-track" id="mkTrack">
          <div className="mk-intro">
            <p className="eyebrow">{MARKETS.eyebrow}</p>
            <SplitText as="h2" className="h2" text={MARKETS.headline} />
            <p className="muted">{MARKETS.body}</p>
          </div>

          <div className="mk-cards">
            {MARKETS.cards.map((card) => (
              <Link className="mk-card" href={card.href} key={card.name}>
                <div className="ph">
                  <img src={card.image} alt={card.alt} />
                </div>
                <span className={cx("tag", card.flagship && "is-flag")}>
                  {card.tag}
                </span>
                <div className="body">
                  <div className="name">{card.name}</div>
                  <p className="desc">{card.description}</p>
                  <span className="go">
                    {MARKETS.cardCta} <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mk-progress">
          <i id="mkBar" />
        </div>
      </div>
    </section>
  )
}
