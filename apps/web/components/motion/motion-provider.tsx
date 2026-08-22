"use client"

import { MotionConfig } from "framer-motion"

/**
 * Global motion configuration — respects the user's prefers-reduced-motion
 * setting for every animation in the tree (IMPLEMENTATION_PLAN.md §15).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
