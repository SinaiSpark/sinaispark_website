"use client"

import { useEffect } from "react"

/**
 * Starts a page's motion once its markup is in the DOM.
 *
 * Render this as the last child of a page. Effects run bottom-up, so by the
 * time this one fires every section above it has mounted — which matters
 * because ScrollTrigger measures the real layout, and the pinned sections only
 * report the right size once everything is present.
 *
 * Everything a variant sets up is torn down through the AbortSignal and the
 * gsap.context each initialiser wraps itself in, so React's development double
 * mount does not leave duplicate triggers behind.
 */
export type MotionVariant = "home" | "inner" | "detail" | "india"

export function PageMotion({ variant }: { variant: MotionVariant }) {
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    // Loaded lazily so GSAP, ScrollTrigger and Lenis stay out of the server
    // bundle and off the critical path.
    const load = async () => {
      const [{ initHomeMotion }, { initInnerMotion }] = await Promise.all([
        import("@/lib/motion/home"),
        import("@/lib/motion/inner"),
      ])
      if (cancelled) return
      document.documentElement.classList.add("js-motion")

      if (variant === "home") initHomeMotion(controller.signal)
      else initInnerMotion(variant, controller.signal)
    }

    void load()

    return () => {
      cancelled = true
      controller.abort()
      document.documentElement.classList.remove("js-motion")
    }
  }, [variant])

  return null
}
