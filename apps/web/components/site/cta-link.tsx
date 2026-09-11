import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export type CtaVariant = "primary" | "brand" | "secondary" | "outline"
export type CtaSize = "sm" | "md" | "lg"

/**
 * Site-wide call-to-action styling. Pill-shaped, presses down on :active,
 * animates only transform + colour so it never drops a frame.
 *
 * `brand` and `secondary` are surface-aware: `bg-brand` / `text-brand-foreground`
 * flip inside [data-surface="navy"], so the same variant is legible on both
 * light and navy bands. `outline` is the light-surface twin of `secondary`.
 *
 * `ctaClassName` is exported so real <button>s (form submits) can share the
 * exact look without pretending to be links.
 */
const variantClasses: Record<CtaVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-deep",
  brand: "bg-brand text-brand-foreground hover:bg-brand/90",
  secondary:
    "border border-primary-foreground/40 text-primary-foreground hover:border-brand hover:text-brand",
  outline:
    "border border-border bg-background/60 text-foreground hover:border-primary hover:text-primary",
}

const sizeClasses: Record<CtaSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
}

export function ctaClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: CtaVariant
  size?: CtaSize
  className?: string
} = {}) {
  return cn(
    "group/cta inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap outline-none select-none",
    "transition-[transform,background-color,border-color,color] duration-200 ease-out",
    "focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    sizeClasses[size],
    variantClasses[variant],
    className
  )
}

/** Trailing ↗ that nudges on hover — signals "this takes you somewhere". */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRightIcon
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5",
        className
      )}
    />
  )
}

type CtaLinkProps = Omit<React.ComponentProps<typeof Link>, "className"> & {
  variant?: CtaVariant
  size?: CtaSize
  arrow?: boolean
  className?: string
}

export function CtaLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <Link {...props} className={ctaClassName({ variant, size, className })}>
      {children}
      {arrow ? <CtaArrow /> : null}
    </Link>
  )
}
