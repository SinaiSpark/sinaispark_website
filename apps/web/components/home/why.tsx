import { ArrowIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { WHY } from "@/content/home"

/**
 * Why Sinai Spark: an editorial list rather than a card grid. Rows slide in as
 * a batch and lift on hover.
 */
export function Why() {
  return (
    <section className="why" data-surface="light">
      <div className="wrap">
        <div className="why-lead">
          <p className="eyebrow" data-reveal>
            {WHY.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={WHY.headline} />
          <p className="lede muted" data-reveal>
            {WHY.lede}
          </p>
          <SmartLink className="link" href={WHY.link.href} data-reveal>
            {WHY.link.label} <ArrowIcon />
          </SmartLink>
        </div>

        <ul className="why-list" id="whyList">
          {WHY.rows.map((row) => (
            <li className="why-row" key={row.title}>
              <span className="k">{row.kicker}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
                {"marks" in row && row.marks ? (
                  <p className="mk">
                    {row.marks.map((mark, i) => (
                      <span key={mark}>
                        {i > 0 ? " · " : null}
                        <b>{mark}</b>
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
              <svg
                className="arrow"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
