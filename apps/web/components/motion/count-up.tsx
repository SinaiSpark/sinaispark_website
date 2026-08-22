"use client"

import { useEffect, useRef, useState } from "react"
import {
  animate,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion"

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
 * Count-up stat — animates on viewport enter.
 * SSRs the final value (no CLS), and renders it immediately when reduced
 * motion is preferred (§15).
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

  // Initialize to full value for SSR/SEO, so no CLS occurs.
  const count = useMotionValue(value)
  const displayValue = useTransform(
    count,
    (latest) => `${prefix}${format(latest)}${suffix}`
  )
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!inView || prefersReducedMotion || hasAnimated) return

    // Animate from 0 to target value once in view
    const controls = animate(0, value, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => count.set(latest),
      onComplete: () => setHasAnimated(true),
    })

    return () => controls.stop()
  }, [inView, value, duration, prefersReducedMotion, hasAnimated, count])

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {displayValue}
    </motion.span>
  )
}
