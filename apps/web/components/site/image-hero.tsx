"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "lucide-react"

import type { ImageAsset } from "@/lib/images"
import { heroStagger, heroItem } from "@/lib/transitions"
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

/** How long each slide is shown before crossfading to the next. */
const DWELL_MS = 6500

/**
 * Full-bleed, imagery-led hero with a navy scrim (§13).
 *
 * The headline block is vertically centred and resolves in ~600ms with a
 * strong ease-out — first paint is what the user judges speed by. The
 * slideshow behind it is ambient: a slow, blurred crossfade that never
 * competes with the copy. Segmented progress bars mirror the slide timing
 * and double as jump controls.
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
    }, DWELL_MS)
    return () => clearInterval(timer)
  }, [images.length, activeIndex])

  const activeAsset = images[activeIndex]
  const isFull = size === "full"

  return (
    <section
      data-surface="navy"
      className={cn(
        "relative flex items-center overflow-hidden bg-primary-deep",
        isFull
          ? "min-h-[clamp(560px,88svh,860px)]"
          : "min-h-[clamp(360px,52svh,520px)]",
        className
      )}
    >
      {activeAsset ? (
        <AnimatePresence initial={false}>
          <motion.div
            key={activeAsset.src}
            initial={{ scale: 1.08, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
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
      ) : null}

      {/* Scrim: heavier on the left where the copy sits, lifting toward the right. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/70 to-primary-deep/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary-deep/85 to-transparent"
      />

      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          isFull ? "py-20 md:py-28" : "py-14 md:py-20"
        )}
      >
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {eyebrow ? (
            <motion.p
              variants={heroItem}
              className="mb-5 text-xs font-semibold tracking-[0.18em] text-brand uppercase"
            >
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h1
            variants={heroItem}
            className={cn(
              "font-semibold tracking-[-0.03em] text-balance text-primary-foreground",
              isFull
                ? "text-5xl leading-[1.02] md:text-6xl xl:text-7xl"
                : "text-4xl leading-[1.05] md:text-5xl"
            )}
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p
              variants={heroItem}
              className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:text-xl"
            >
              {subtitle}
            </motion.p>
          ) : null}
          {tagline ? (
            <motion.p
              variants={heroItem}
              className="mt-5 flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-primary-foreground/60 uppercase"
            >
              <span aria-hidden="true" className="h-px w-8 bg-brand/70" />
              {tagline}
            </motion.p>
          ) : null}
          {children ? (
            <motion.div
              variants={heroItem}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 pb-6 sm:px-6 lg:px-8">
            <div
              role="group"
              aria-label="Hero slides"
              className="flex w-full max-w-md gap-2"
            >
              {images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className="group/seg relative h-6 flex-1 cursor-pointer outline-none"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-colors group-hover/seg:bg-white/40 group-focus-visible/seg:bg-white/40">
                    {index === activeIndex ? (
                      <motion.span
                        key={activeIndex}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: DWELL_MS / 1000,
                          ease: "linear",
                        }}
                        className="absolute inset-0 origin-left bg-brand"
                      />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
            {isFull ? (
              <p
                aria-hidden="true"
                className="hidden shrink-0 items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-primary-foreground/60 uppercase md:flex"
              >
                Scroll to explore
                <ChevronDownIcon className="animate-scroll-cue size-4 text-brand" />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
