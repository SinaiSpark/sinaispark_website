import { GOV } from "@/content/home"

/**
 * Two scrolling bands under the hero: the regulators we file with, and the
 * industries served. Both carry a visible caveat because neither list is
 * client-confirmed yet.
 *
 * The tracks are doubled in the markup so the CSS marquee loops seamlessly.
 */
function Track({
  items,
  reverse = false,
}: {
  items: readonly string[]
  reverse?: boolean
}) {
  const doubled = [...items, ...items]
  return (
    <div className="gov-row">
      <div
        className="gov-track"
        style={
          reverse
            ? { animationDirection: "reverse", animationDuration: "46s" }
            : undefined
        }
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

export function GovBand() {
  return (
    <section
      className="gov"
      data-surface="dark"
      aria-label="Regulators we file with"
    >
      <div className="wrap">
        <span className="lbl">{GOV.regulators.label}</span>
        <Track items={GOV.regulators.items} />
        <span className="note">{GOV.regulators.note}</span>
      </div>
      <div className="wrap" style={{ marginTop: 14 }}>
        <span className="lbl">{GOV.industries.label}</span>
        <Track items={GOV.industries.items} reverse />
        <span className="note">{GOV.industries.note}</span>
      </div>
    </section>
  )
}
