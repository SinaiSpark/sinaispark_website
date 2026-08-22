"use client"

import { motion, type Variants } from "framer-motion"

import { listStagger, revealVariants } from "@/lib/transitions"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Stagger direct children instead of revealing as one block. */
  stagger?: boolean
  delay?: number
}

const itemVariants: Variants = revealVariants

/**
 * Reveal-on-scroll wrapper — fade + rise 16px, plays once (§15).
 * With `stagger`, direct children animate in sequence (60–80ms rhythm).
 */
export function Reveal({ children, className, stagger = false, delay = 0 }: RevealProps) {
  if (stagger) {
    return (
      <motion.div
        className={className}
        variants={listStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-64px" }}
      >
        {children}
      </motion.div>
    )
  }
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export { itemVariants }
