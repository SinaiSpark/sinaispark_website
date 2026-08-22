import Link from "next/link"

import { SITE } from "@/lib/site-config"
import { cn } from "@workspace/ui/lib/utils"

type LogoLockupProps = {
  className?: string
  /** "light" for light backgrounds (default), "navy" for navy surfaces. */
  tone?: "light" | "navy"
}

/**
 * Wordmark lockup: "Sinai Spark" + GLOBAL + tagline.
 * Temporary text wordmark until final SVG logo assets arrive (open item #6).
 */
export function LogoLockup({ className, tone = "light" }: LogoLockupProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — ${SITE.tagline}`}
      className={cn("group flex flex-col gap-0.5 outline-none", className)}
    >
      <span
        className={cn(
          "flex items-baseline gap-1.5 leading-none",
          tone === "light" ? "text-primary" : "text-primary-foreground"
        )}
      >
        <span className="text-lg font-semibold tracking-tight md:text-xl">
          Sinai Spark
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[0.6rem] font-semibold tracking-[0.22em]",
            tone === "light" ? "text-gold-strong" : "text-gold"
          )}
        >
          GLOBAL
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "text-[0.65rem] font-medium tracking-[0.08em]",
          tone === "light" ? "text-muted-foreground" : "text-primary-foreground/70"
        )}
      >
        {SITE.tagline}
      </span>
    </Link>
  )
}
