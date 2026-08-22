import { cn } from "@workspace/ui/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  align?: "left" | "center"
  tone?: "light" | "navy"
  className?: string
}

/**
 * Consistent section rhythm device (§11.3): gold eyebrow, H2, optional lede.
 * `tone="navy"` for use on full-bleed navy bands.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-3",
        align === "center" && "items-center text-center mx-auto",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "text-xs font-semibold tracking-[0.14em] uppercase",
          tone === "light" ? "text-gold-strong" : "text-gold"
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl",
          tone === "light" ? "text-foreground" : "text-primary-foreground"
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "text-lg leading-relaxed",
            tone === "light" ? "text-muted-foreground" : "text-primary-foreground/75"
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}
