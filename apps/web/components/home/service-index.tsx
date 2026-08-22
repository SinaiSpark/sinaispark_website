"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { HOME } from "@/lib/content/home"
import { IMAGES, type ImageKey } from "@/lib/images"
import { cn } from "@workspace/ui/lib/utils"
import { Reveal } from "@/components/motion/reveal"

/**
 * What We Do — editorial index rows (§13): divider-separated numbered list,
 * hovering a row reveals its supporting image. Deliberately not a card grid.
 */
export function ServiceIndex() {
  const [activeKey, setActiveKey] = useState<ImageKey | null>(
    HOME.whatWeDo.items[0]?.imageKey ?? null
  )
  const activeAsset = activeKey ? IMAGES[activeKey] : null

  return (
    <section aria-labelledby="what-we-do-title" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <Reveal className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            {HOME.whatWeDo.eyebrow}
          </p>
          <h2
            id="what-we-do-title"
            className="text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl"
          >
            {HOME.whatWeDo.title}
          </h2>
        </Reveal>

        <Reveal
          delay={0.15}
          className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14"
        >
          <ol className="divide-y divide-border border-t border-b border-border">
            {HOME.whatWeDo.items.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col items-start gap-4 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/60 sm:flex-row sm:items-center sm:gap-6 sm:py-8"
                  onMouseEnter={() => {
                    if (item.imageKey) setActiveKey(item.imageKey)
                  }}
                  onFocus={() => {
                    if (item.imageKey) setActiveKey(item.imageKey)
                  }}
                >
                  <span className="font-mono text-sm font-semibold tracking-widest text-gold-strong/60 transition-colors group-hover:text-gold">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-gold sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground sm:text-lg">
                      {item.description}
                    </p>
                  </div>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-muted-foreground opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ol>

          {/* Image reveal area — hidden on mobile */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24 aspect-[4/5] w-full overflow-hidden rounded-xl border border-border shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/60">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted">
                <AnimatePresence mode="wait">
                  {activeAsset && (
                    <motion.div
                      key={activeAsset.src}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <Image
                        src={activeAsset.src}
                        alt={activeAsset.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        quality={85}
                        priority
                        className="object-cover"
                        style={
                          activeAsset.focal
                            ? { objectPosition: activeAsset.focal }
                            : undefined
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
