"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import type { ImageAsset } from "@/lib/images"
import { heroStagger, revealVariants } from "@/lib/transitions"
import { cn } from "@workspace/ui/lib/utils"

type ImageHeroProps = {
  asset: ImageAsset | null
  eyebrow?: string
  title: string
  subtitle?: string
  /** Extra line under the headline (e.g., the brand tagline). */
  tagline?: string
  priority?: boolean
  size?: "full" | "compact"
  children?: React.ReactNode
  className?: string
}

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: revealVariants.visible,
}

/**
 * Full-bleed imagery-led hero with a navy scrim (§13). Single orchestrated
 * entrance sequence; reduced-motion users get static content.
 */
export function ImageHero({
  asset,
  eyebrow,
  title,
  subtitle,
  tagline,
  priority = false,
  size = "full",
  children,
  className,
}: ImageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden",
        size === "full" ? "min-h-[70svh] md:min-h-[85svh]" : "min-h-[46svh]",
        className
      )}
    >
      {asset ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority={priority}
          sizes="100vw"
          quality={85}
          className="object-cover"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-primary" />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/80 to-primary/40"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 md:pb-20 lg:px-8">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {eyebrow ? (
            <motion.p
              variants={staggerItem}
              className="mb-4 text-xs font-semibold tracking-[0.18em] text-gold uppercase"
            >
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h1
            variants={staggerItem}
            className={cn(
              "font-semibold tracking-[-0.02em] text-balance text-primary-foreground",
              size === "full"
                ? "text-4xl md:text-5xl xl:text-6xl"
                : "text-3xl md:text-4xl"
            )}
          >
            {title}
          </motion.h1>
          {tagline ? (
            <motion.p
              variants={staggerItem}
              className="mt-4 text-sm font-medium tracking-[0.08em] text-gold uppercase"
            >
              {tagline}
            </motion.p>
          ) : null}
          {subtitle ? (
            <motion.p
              variants={staggerItem}
              className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg"
            >
              {subtitle}
            </motion.p>
          ) : null}
          {children ? (
            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap gap-3"
            >
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
