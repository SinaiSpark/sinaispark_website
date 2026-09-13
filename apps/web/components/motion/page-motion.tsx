"use client"

import { useEffect, useLayoutEffect, type ReactNode } from "react"

/**
 * Starts a page's motion once its markup is in the DOM, and — just as
 * important — stops it before React takes that markup away again.
 *
 * Wrap the page's content in this component rather than rendering it as a
 * sibling. Both halves of that matter:
 *
 * - **It wraps.** ScrollTrigger's `pin` moves the pinned section into a
 *   `.pin-spacer` div of its own making. React still believes that section is
 *   a direct child of `<main>`, so on navigation it calls
 *   `main.removeChild(section)` and the browser throws NotFoundError — the
 *   node is inside the spacer now. React then regenerates the tree, which
 *   surfaces as a hydration error somewhere else entirely. When the teardown
 *   runs first the spacers are already unwrapped and the DOM is back to the
 *   shape React expects. React unmounts a subtree parent-first, so a wrapper's
 *   cleanup is guaranteed to run before its children are removed; a sibling
 *   rendered last is reached far too late.
 *
 * - **It uses a layout effect.** Cleanups from `useEffect` are deferred to the
 *   passive phase, which happens *after* the DOM removal that throws. Only a
 *   layout-effect cleanup runs early enough.
 *
 * Setup still happens after every section has mounted: layout effects fire
 * bottom-up, so the children are in place and measurable before this one runs.
 *
 * Everything a variant sets up is torn down through the AbortSignal and the
 * gsap.context each initialiser wraps itself in, so React's development double
 * mount does not leave duplicate triggers behind.
 */
export type MotionVariant = "home" | "inner" | "detail" | "india"

/** Layout effects do not run on the server; fall back so SSR stays quiet. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

export function PageMotion({
  variant,
  children,
}: {
  variant: MotionVariant
  children: ReactNode
}) {
  useIsomorphicLayoutEffect(() => {
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

  return <>{children}</>
}
