"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

import type { ImageAsset } from "@/lib/images"
import { heroStagger, revealVariants } from "@/lib/transitions"
import { cn } from "@workspace/ui/lib/utils"

type ImageHeroProps = {
  asset?: ImageAsset | null
  assets?: ImageAsset[]
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
  assets,
  eyebrow,
  title,
  subtitle,
  tagline,
  priority = false,
  size = "full",
  children,
  className,
}: ImageHeroProps) {
  const images = assets && assets.length > 0 ? assets : asset ? [asset] : []
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [images.length])

  const activeAsset = images[activeIndex]
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden",
        size === "full" ? "min-h-[70svh] md:min-h-[85svh]" : "min-h-[46svh]",
        className
      )}
    >
      {activeAsset ? (
        <AnimatePresence initial={false}>
          <motion.div
            key={activeAsset.src}
            initial={{ scale: 1.05, opacity: 0, x: "-3%", filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, x: "0%", filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              x: "3%",
              filter: "blur(4px)",
              position: "absolute",
              zIndex: -1,
            }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeAsset.src}
              alt={activeAsset.alt}
              fill
              priority={priority && activeIndex === 0}
              sizes="100vw"
              quality={85}
              className="object-cover"
              style={
                activeAsset.focal
                  ? { objectPosition: activeAsset.focal }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>
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
