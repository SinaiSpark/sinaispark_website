"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"

interface Point {
  readonly title: string
  readonly description: string
}

interface WhyChooseUsGridProps {
  readonly points: readonly Point[]
}

/**
 * Six proof points in a hairline grid. A single shared highlight follows
 * the pointer between cells (layoutId) instead of each cell lighting up
 * independently — one moving object reads calmer than six toggles.
 */
export function WhyChooseUsGrid({ points }: WhyChooseUsGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getCornerRadiusClass = (index: number) => {
    return cn(
      // Mobile (1 col)
      index === 0 && "rounded-t-2xl",
      index === points.length - 1 && "rounded-b-2xl",

      // Tablet (2 cols)
      index === 0 && "sm:rounded-tl-2xl sm:rounded-tr-none",
      index === 1 && "sm:rounded-tl-none sm:rounded-tr-2xl",
      index === points.length - 2 && "sm:rounded-br-none sm:rounded-bl-2xl",
      index === points.length - 1 && "sm:rounded-br-2xl sm:rounded-bl-none",

      // Desktop (3 cols)
      index === 0 && "lg:rounded-tl-2xl lg:rounded-tr-none",
      index === 2 && "lg:rounded-tl-none lg:rounded-tr-2xl",
      index === 3 && "lg:rounded-br-none lg:rounded-bl-2xl",
      index === 5 && "lg:rounded-br-2xl lg:rounded-bl-none",
      // Reset non-corners on desktop
      index === 1 && "lg:rounded-none",
      index === 4 && "lg:rounded-none"
    )
  }

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
    >
      {points.map((point, index) => {
        const cornerClass = getCornerRadiusClass(index)
        const isHovered = hoveredIndex === index

        return (
          <div
            key={point.title}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              "group relative bg-background p-6 select-none md:p-8",
              cornerClass
            )}
          >
            {isHovered && (
              <motion.div
                layoutId="why-choose-us-hover-box"
                className={cn(
                  "pointer-events-none absolute inset-0 z-10 border border-brand/60 bg-brand-soft/60",
                  cornerClass
                )}
                transition={{ type: "spring", stiffness: 450, damping: 34 }}
              />
            )}

            <div className="relative z-20">
              <span
                aria-hidden="true"
                className="mb-4 block h-1 w-8 rounded-full bg-brand/40 transition-[width,background-color] duration-300 ease-out group-hover:w-12 group-hover:bg-brand"
              />
              <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand">
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
