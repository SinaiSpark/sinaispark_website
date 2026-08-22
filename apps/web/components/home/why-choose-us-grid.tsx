"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { Reveal } from "@/components/motion/reveal"

interface Point {
  readonly title: string
  readonly description: string
}

interface WhyChooseUsGridProps {
  readonly points: readonly Point[]
}

export function WhyChooseUsGrid({ points }: WhyChooseUsGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getCornerRadiusClass = (index: number) => {
    return cn(
      // Mobile (1 col)
      index === 0 && "rounded-t-xl",
      index === points.length - 1 && "rounded-b-xl",

      // Tablet (2 cols)
      index === 0 && "sm:rounded-tl-xl sm:rounded-tr-none",
      index === 1 && "sm:rounded-tl-none sm:rounded-tr-xl",
      index === points.length - 2 && "sm:rounded-br-none sm:rounded-bl-xl",
      index === points.length - 1 && "sm:rounded-br-xl sm:rounded-bl-none",

      // Desktop (3 cols)
      index === 0 && "lg:rounded-tl-xl lg:rounded-tr-none",
      index === 2 && "lg:rounded-tl-none lg:rounded-tr-xl",
      index === 3 && "lg:rounded-br-none lg:rounded-bl-xl",
      index === 5 && "lg:rounded-br-xl lg:rounded-bl-none",
      // Reset non-corners on desktop
      index === 1 && "lg:rounded-none",
      index === 4 && "lg:rounded-none"
    )
  }

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border/80 bg-border/80 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
    >
      {points.map((point, index) => {
        const cornerClass = getCornerRadiusClass(index)
        const isHovered = hoveredIndex === index

        return (
          <div
            key={point.title}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              "group relative cursor-pointer bg-background p-6 transition-colors select-none md:p-8",
              cornerClass
            )}
          >
            {/* Smooth Moving Shared Highlight (layoutId) */}
            {isHovered && (
              <motion.div
                layoutId="why-choose-us-hover-box"
                className={cn(
                  "pointer-events-none absolute inset-0 z-20 border border-gold bg-gold/[0.02] shadow-[inset_0_0_20px_rgba(204,162,76,0.1)]",
                  cornerClass
                )}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            <div className="relative z-20">
              <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
