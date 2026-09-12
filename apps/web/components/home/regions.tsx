import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { REGIONS } from "@/content/home"
import { ROUTES } from "@/content/site"

/**
 * Regional coverage inside Saudi Arabia. Three tiles that expand on hover.
 */
export function Regions() {
  return (
    <section className="regions" id="regions" data-surface="light">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {REGIONS.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={REGIONS.headline} />
        <div className="reg-row" data-reveal>
          {REGIONS.tiles.map((tile) => (
            <SmartLink className="region" href={ROUTES.contact} key={tile.name}>
              <img src={tile.image} alt="" />
              <div className="in">
                <span className="k">{tile.kicker}</span>
                <h3>{tile.name}</h3>
                <p>{tile.body}</p>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}
