import { CtaLink, type CtaVariant } from "@/components/site/cta-link"
import { cn } from "@workspace/ui/lib/utils"

type CtaButton = {
  label: string
  href: string
  variant?: CtaVariant
}

/**
 * Reusable full-bleed navy closing CTA band (§11.7). The brand mark sits
 * faintly in the corner — the "brand background" treatment from the
 * identity guide — so the band is unmistakably theirs without adding noise.
 */
export function CTASection({
  eyebrow,
  title,
  subheadline,
  buttons,
  className,
}: {
  eyebrow?: string
  title: string
  subheadline?: string
  buttons?: CtaButton[]
  className?: string
}) {
  return (
    <section
      data-surface="navy"
      className={cn("relative overflow-hidden bg-primary", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-[30rem] bg-[url(/brand/mark-white.svg)] bg-contain bg-no-repeat opacity-[0.06] md:size-[38rem]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-balance text-primary-foreground md:text-5xl">
          {title}
        </h2>
        {subheadline ? (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            {subheadline}
          </p>
        ) : null}
        {buttons?.length ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {buttons.map((button) => (
              <CtaLink
                key={button.label}
                href={button.href}
                size="lg"
                variant={button.variant ?? "secondary"}
                arrow={button.variant === "brand"}
              >
                {button.label}
              </CtaLink>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
