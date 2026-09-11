import { cn } from "@workspace/ui/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  align?: "left" | "center"
  tone?: "light" | "navy"
  /** Hairline rule running from the eyebrow to the right edge. */
  rule?: boolean
  className?: string
}

/**
 * Consistent section rhythm device (§11.3): brand eyebrow, H2, optional lede.
 * `tone="navy"` for use on full-bleed navy bands. The eyebrow colour is
 * surface-aware, so it stays legible on either.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  rule = false,
  className,
}: SectionHeadingProps) {
  const navy = tone === "navy"

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "mx-auto max-w-3xl items-center text-center"
          : "max-w-3xl",
        rule && align === "left" && "max-w-none",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center gap-4 text-xs font-semibold tracking-[0.16em] text-brand uppercase",
          align === "center" && "justify-center"
        )}
      >
        {eyebrow}
        {rule ? (
          <span
            className={cn(
              "h-px flex-1",
              navy ? "bg-primary-foreground/15" : "bg-border"
            )}
          />
        ) : null}
      </span>
      <h2
        className={cn(
          "max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-balance md:text-5xl",
          navy ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "max-w-2xl text-lg leading-relaxed",
            navy ? "text-primary-foreground/75" : "text-muted-foreground"
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}
