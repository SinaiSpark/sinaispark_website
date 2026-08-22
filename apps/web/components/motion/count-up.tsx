"use client"

import { useEffect, useRef } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"

type CountUpProps = {
  /** Target value. */
  value: number
  /** Duration in ms. */
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

const format = (n: number) => Math.round(n).toLocaleString("en-US")

/**
 * Count-up stat — animates on viewport enter via rAF (framer-motion `animate`),
 * SSRs the final value (no CLS), and renders it immediately when reduced
 * motion is preferred (§15). Writes textContent directly — no React state.
 */
export function CountUp({
  value,
  duration = 1400,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-64px" })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return
    if (prefersReducedMotion) return // final value already rendered server-side
    const controls = animate(0, value, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
    })
    return () => controls.stop()
  }, [inView, value, duration, prefersReducedMotion])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  )
}
