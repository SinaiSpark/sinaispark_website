import Link from "next/link"

import { ArrowIcon, ButtonArrow } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { SERVICES_STACK } from "@/content/home"

/**
 * What we do: six cards that stack and dim as the next one scrolls over them.
 * The dimming is a `--dim` custom property the motion layer animates.
 */
export function ServicesStack() {
  return (
    <section className="services" id="services" data-surface="light">
      <div className="wrap">
        <div className="svc-head">
          <div>
            <p className="eyebrow" data-reveal>
              {SERVICES_STACK.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={SERVICES_STACK.headline} />
          </div>
          <Link
            className="btn btn--ghost"
            href={SERVICES_STACK.cta.href}
            data-magnetic
            data-reveal
          >
            {SERVICES_STACK.cta.label} <ButtonArrow />
          </Link>
        </div>

        <div className="svc-stack" id="svcStack">
          {SERVICES_STACK.cards.map((card) => (
            <article className="svc-card" key={card.title}>
              <div className="txt">
                <div>
                  <span className="num">{card.kicker}</span>
                  <h3 className="h3">{card.title}</h3>
                  <p>{card.body}</p>
                </div>
                <Link className="link" href={card.href}>
                  {SERVICES_STACK.cardCta} <ArrowIcon />
                </Link>
              </div>
              <div className="ph">
                <img src={card.image} alt="" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
