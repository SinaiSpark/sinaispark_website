import { HOME } from "@/lib/content/home"

/**
 * How It Works — horizontal four-step timeline with a gold connector (§13).
 * Numbering is justified: the steps are a real sequence.
 */
export function ProcessTimeline() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            {HOME.howItWorks.eyebrow}
          </p>
          <h2
            id="how-it-works-title"
            className="text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl"
          >
            {HOME.howItWorks.title}
          </h2>
        </div>

        <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
          {HOME.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-3">
              {/* Connector line — desktop only, hidden on the last step. */}
              {index < HOME.howItWorks.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-4 left-[2.75rem] hidden h-px w-[calc(100%-1.5rem)] bg-gold/60 md:block"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative z-10 inline-flex size-9 items-center justify-center rounded-full border-2 border-gold bg-primary font-mono text-sm font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
