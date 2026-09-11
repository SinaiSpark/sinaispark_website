/**
 * Motion tokens — IMPLEMENTATION_PLAN.md §15.
 * Subtle, premium, purposeful. GPU-only properties. Reduced-motion is handled
 * globally by <MotionProvider> (MotionConfig reducedMotion="user").
 *
 * Easing rules of thumb:
 *  - Entering / exiting UI  → EASE_OUT (starts fast, feels responsive)
 *  - Moving / morphing on screen → EASE_IN_OUT
 *  - Never ease-in for UI: it delays the first frame, which is exactly when
 *    the user is watching.
 */

/** Strong ease-out for entrances and UI feedback. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Strong ease-in-out for on-screen movement. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
/** Softer ease-out used by scroll reveals. */
export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const

export const transitions = {
  /** UI state changes (dropdowns, hovers). */
  smooth: { type: "tween", duration: 0.24, ease: EASE_OUT },
  /** Snappy micro-feedback (150ms). */
  snappy: { type: "tween", duration: 0.15, ease: EASE_OUT },
  /** Section/element entrances (fade + rise). */
  reveal: { type: "tween", duration: 0.55, ease: EASE_REVEAL },
  /** Interactive spring for taps/toggles. */
  spring: { type: "spring", stiffness: 300, damping: 24 },
  /** Apple-style spring for layout moves — easy to reason about. */
  layout: { type: "spring", duration: 0.55, bounce: 0.12 },
} as const

/** Stagger rhythm for orchestrated lists/heroes — max 4 items deep. */
export const STAGGER_CHILDREN = 0.07
export const STAGGER_DELAY = 0.08

export const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...transitions.reveal },
  },
} as const

/**
 * Hero entrance: the headline block resolves in ~600ms total. The first
 * paint is what the user judges the site's speed by, so nothing here is
 * allowed to feel slow.
 */
export const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const

export const heroItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "tween", duration: 0.6, ease: EASE_OUT },
  },
} as const

export const listStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_CHILDREN },
  },
} as const
