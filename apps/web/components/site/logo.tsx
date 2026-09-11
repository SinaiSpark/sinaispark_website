import Image from "next/image"
import Link from "next/link"

import { SITE } from "@/lib/site-config"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Official brand assets, extracted as vectors from the client's Brand.pdf.
 * Intrinsic ratios: lockup 1303.36x267.52, mark 325.6x326.08.
 */
const LOCKUP = { width: 1303.36, height: 267.52 } as const

type LogoTone = "light" | "navy"

type LogoLockupProps = {
  className?: string
  /** "light" for light backgrounds (default), "navy" for navy surfaces. */
  tone?: LogoTone
  /** Rendered height in px; width follows the intrinsic ratio. */
  height?: number
  priority?: boolean
}

/**
 * Full horizontal lockup — brand mark + "sinai spark" wordmark + tagline.
 * On navy surfaces the all-white variant is used, per the brand guide.
 */
export function LogoLockup({
  className,
  tone = "light",
  height = 40,
  priority = false,
}: LogoLockupProps) {
  const width = Math.round((height * LOCKUP.width) / LOCKUP.height)

  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — ${SITE.tagline}`}
      className={cn(
        "inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src={tone === "navy" ? "/brand/logo-white.svg" : "/brand/logo.svg"}
        alt={SITE.name}
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-auto"
        style={{ height, width }}
      />
    </Link>
  )
}

type LogoMarkProps = {
  className?: string
  tone?: LogoTone
  size?: number
}

/** Square brand mark on its own — favicons, compact headers, avatars. */
export function LogoMark({
  className,
  tone = "light",
  size = 32,
}: LogoMarkProps) {
  return (
    <Image
      src={tone === "navy" ? "/brand/mark-white.svg" : "/brand/mark.svg"}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  )
}
