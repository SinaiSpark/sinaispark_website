import { ProcessIconGlyph } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { PROCESS } from "@/content/home"

/**
 * How it works: four steps on a rail that fills as you scroll, with a spark
 * travelling along it. Horizontal above 800px, vertical below — the motion
 * layer picks which axis to animate.
 */
export function Process() {
  return (
    <section className="process" id="process" data-surface="dark">
      <div className="wrap">
        <div className="proc-head">
          <div>
            <p className="eyebrow" data-reveal>
              {PROCESS.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={PROCESS.headline} />
          </div>
          <p className="lede muted" data-reveal>
            {PROCESS.lede}
          </p>
        </div>

        <div className="proc" id="proc">
          <div className="rail">
            <i className="rail-fill" id="railFill" />
            <i className="rail-dot" id="railDot" />
          </div>
          <ol className="steps" id="steps">
            {PROCESS.steps.map((step, i) => {
              const num = String(i + 1).padStart(2, "0")
              return (
                <li className="step" key={step.title}>
                  <div className="node">
                    <span>{num}</span>
                  </div>
                  <div className="step-card">
                    <b className="ghost">{num}</b>
                    <div className="ic">
                      <ProcessIconGlyph name={step.icon} />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <span className="out">{step.outcome}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
