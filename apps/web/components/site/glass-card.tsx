import { cn } from "@workspace/ui/lib/utils"

type GlassCardProps = React.ComponentProps<"div"> & {
  /** Subtle teal wash from the top edge, for featured tiles. */
  tint?: boolean
  /** Lift + brighten on hover; use only when the whole card is a link. */
  interactive?: boolean
}

/**
 * Translucent panel for navy surfaces. Frosted fill, hairline border and a
 * 1px inner highlight on the top edge so the card reads as a sheet of glass
 * rather than a grey box. Keep blur modest — heavy blur is expensive on
 * Safari, and the effect is in the edge, not the blur.
 */
export function GlassCard({
  className,
  tint = false,
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        tint &&
          "bg-gradient-to-b from-brand-solid/[0.18] via-white/[0.05] to-white/[0.03]",
        interactive &&
          "transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09]",
        className
      )}
    />
  )
}
