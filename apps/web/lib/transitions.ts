/**
 * Motion tokens — IMPLEMENTATION_PLAN.md §15.
 * Subtle, premium, purposeful. GPU-only properties. Reduced-motion is handled
 * globally by <MotionProvider> (MotionConfig reducedMotion="user").
 */

export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  /** UI state changes (dropdowns, hovers). */
  smooth: { type: "tween", duration: 0.3, ease: "easeInOut" },
  /** Snappy micro-feedback (150ms). */
  snappy: { type: "tween", duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  /** Section/element entrances (fade + rise). */
  reveal: { type: "tween", duration: 0.55, ease: EASE_REVEAL },
  /** Interactive spring for taps/toggles. */
  spring: { type: "spring", stiffness: 300, damping: 24 },
} as const;

/** Stagger rhythm for orchestrated lists/heroes — max 4 items deep. */
export const STAGGER_CHILDREN = 0.07;
export const STAGGER_DELAY = 0.08;

export const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...transitions.reveal },
  },
} as const;

export const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
} as const;

export const listStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_CHILDREN },
  },
} as const;
