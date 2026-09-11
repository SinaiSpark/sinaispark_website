import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export type CtaVariant = "primary" | "brand" | "secondary" | "outline"

type CtaLinkProps = Omit<React.ComponentProps<typeof Link>, "className"> & {
  variant?: CtaVariant
  size?: "md" | "lg"
  /** Trailing ↗ that nudges on hover — signals "this takes you somewhere". */
  arrow?: boolean
  className?: string
}

/**
 * Site-wide call-to-action link. Pill-shaped, presses down on :active,
 * animates only transform + colour so it never drops a frame.
 *
 * `brand` and `secondary` are surface-aware: `bg-brand` / `text-brand-foreground`
 * flip inside [data-surface="navy"], so the same variant is legible on both
 * light and navy bands. `outline` is the light-surface twin of `secondary`.
 */
const variantClasses: Record<CtaVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-deep",
  brand: "bg-brand text-brand-foreground hover:bg-brand/90",
  secondary:
    "border border-primary-foreground/40 text-primary-foreground hover:border-brand hover:text-brand",
  outline:
    "border border-border bg-background/60 text-foreground hover:border-primary hover:text-primary",
}

const sizeClasses = {
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
} as const

export function CtaLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group/cta inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap outline-none select-none",
        "transition-[transform,background-color,border-color,color] duration-200 ease-out",
        "focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
      {arrow ? (
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
        />
      ) : null}
    </Link>
  )
}

export { variantClasses as ctaVariantClasses }
