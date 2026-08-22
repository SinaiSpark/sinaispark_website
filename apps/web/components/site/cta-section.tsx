import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

type CtaButton = {
  label: string
  href: string
  variant?: "primary" | "gold" | "secondary"
}

const ctaClasses: Record<NonNullable<CtaButton["variant"]>, string> = {
  // Navy fill for light surfaces.
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-deep hover:-translate-y-px",
  // Gold reserved for the single most important action on navy bands (§11.6).
  gold: "bg-gold text-primary-deep hover:bg-gold/90 hover:-translate-y-px font-semibold",
  secondary:
    "border-primary-foreground/40 text-primary-foreground hover:border-gold hover:text-gold",
}

/**
 * Reusable full-bleed navy closing CTA band (§11.7).
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
    <section className={cn("relative overflow-hidden bg-primary", className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance text-primary-foreground md:text-4xl">
          {title}
        </h2>
        {subheadline ? (
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/75">
            {subheadline}
          </p>
        ) : null}
        {buttons?.length ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {buttons.map((button) => (
              <Link
                key={button.label}
                href={button.href}
                className={cn(
                  "inline-flex h-11 items-center rounded-md px-6 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  ctaClasses[button.variant ?? "secondary"]
                )}
              >
                {button.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
