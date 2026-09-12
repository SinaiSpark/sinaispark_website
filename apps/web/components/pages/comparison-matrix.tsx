import { ArrowIcon, CheckIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { LICENCE_FACTS, LICENCES_PAGE } from "@/content/pages"
import type { ServiceContent } from "@/content/services"

/**
 * The five licences side by side.
 *
 * Each row answers one question rather than listing attributes: who it is for,
 * what ownership it allows, who signs it off, how it is issued, what it
 * unlocks. Hovering any cell highlights that licence's whole column, which the
 * motion layer drives through a `data-col` attribute.
 *
 * Below 1100px the table scrolls sideways and a hint says so.
 */
function Tick() {
  return (
    <i>
      <CheckIcon />
    </i>
  )
}

export function ComparisonMatrix({ licences }: { licences: ServiceContent[] }) {
  const { matrix } = LICENCES_PAGE

  return (
    <section className="matrix" id="matrix" data-surface="light">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {matrix.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={matrix.headline} />
        <p className="lede muted" data-reveal>
          {matrix.lede}
        </p>
        <p className="mx-hint">{matrix.scrollHint}</p>

        <div className="mx-wrap" data-reveal>
          <table className="mx">
            <thead>
              <tr>
                <th />
                {licences.map((licence, i) => (
                  <th key={licence.slug}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nm">{licence.title}</span>
                    <span className="for">
                      {LICENCE_FACTS[licence.slug]?.audience}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{matrix.rows.ownership}</th>
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <div className="stmt">
                      <Tick />
                      <span>{LICENCE_FACTS[licence.slug]?.ownership}</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <th>{matrix.rows.regulators}</th>
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <ul className="dots">
                      {LICENCE_FACTS[licence.slug]?.regulators.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <th>{matrix.rows.issued}</th>
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <ol className="mini">
                      {licence.phases.map((phase, i) => (
                        <li key={phase.title}>
                          <b>{String(i + 1).padStart(2, "0")}</b>
                          {phase.title.replace(/^\d+\.\s*/, "")}
                        </li>
                      ))}
                    </ol>
                  </td>
                ))}
              </tr>

              <tr>
                <th>{matrix.rows.highlights}</th>
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <ul className="ticks">
                      {licence.assurances.map((assurance) => (
                        <li key={assurance}>
                          <Tick />
                          <span>{assurance}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <th>{matrix.rows.where}</th>
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <span className="where">
                      {licence.jurisdictions.join(" · ")}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <th />
                {licences.map((licence) => (
                  <td key={licence.slug}>
                    <a className="go" href={`#${licence.slug}`}>
                      {matrix.readCta} <ArrowIcon />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
