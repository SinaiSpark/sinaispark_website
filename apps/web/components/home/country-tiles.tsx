"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"

import { HOME } from "@/lib/content/home"
import { IMAGES, type ImageKey } from "@/lib/images"
import { transitions } from "@/lib/transitions"
import { SectionHeading } from "@/components/site/section-heading"

/**
 * Global Presence — the site's signature band (§11.1/§13): five market tiles
 * directly beneath the hero, KSA emphasized first. India links to the India LP.
 * Sits on deep navy so the hero → markets → stats block reads as one
 * continuous, cinematic opening.
 */
export function CountryTiles() {
  const markets: readonly Market[] = HOME.globalPresence.markets
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % markets.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [markets.length])

  const flagship = markets[activeIndex]
  if (!flagship) return null

  const rest = markets.filter((_, i) => i !== activeIndex)
  const orderedMarkets = [flagship, ...rest]

  return (
    <section
      aria-labelledby="global-presence-title"
      data-surface="navy"
      className="relative overflow-hidden bg-primary-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          tone="navy"
          rule
          eyebrow="Global Presence"
          title={
            <span id="global-presence-title">{HOME.globalPresence.intro}</span>
          }
          className="mb-12"
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {orderedMarkets.map((market, index) => {
            const isFeatured = index === 0
            return (
              <motion.li
                layout
                transition={transitions.layout}
                key={market.name}
                className={
                  isFeatured ? "sm:col-span-2 lg:row-span-2" : "col-span-1"
                }
              >
                <MarketTile market={market} featured={isFeatured} />
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export type Market = {
  name: string
  tag: string
  description: string
  imageKey: ImageKey
  href: string
}

export function MarketTile({
  market,
  featured = false,
}: {
  market: Market
  featured?: boolean
}) {
  const asset = IMAGES[market.imageKey]
  return (
    <Link
      href={market.href}
      data-surface="navy"
      className="group relative flex h-full min-h-60 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 transition-[border-color,transform] duration-300 ease-out outline-none hover:-translate-y-0.5 hover:border-white/25 focus-visible:ring-3 focus-visible:ring-ring/60 active:scale-[0.995] lg:min-h-64"
    >
      {asset ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 50vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          quality={85}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-primary-deep/95 via-primary-deep/55 to-primary-deep/10"
      />
      <div className="relative flex items-end justify-between gap-3 p-5 md:p-6">
        <div className="min-w-0">
          {featured ? (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/15 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-brand uppercase backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-brand"
              />
              {market.tag}
            </span>
          ) : null}
          <span
            className={
              featured
                ? "block text-2xl leading-tight font-semibold tracking-[-0.02em] text-primary-foreground md:text-3xl"
                : "block text-lg leading-tight font-semibold tracking-tight text-primary-foreground md:text-xl"
            }
          >
            {market.name}
          </span>
          <span
            className={
              featured
                ? "mt-2 block max-w-sm text-sm leading-relaxed text-primary-foreground/80 md:text-base"
                : "mt-1.5 block text-xs leading-snug text-primary-foreground/75"
            }
          >
            {market.description}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-primary-foreground/70 backdrop-blur-sm transition-[background-color,color,transform] duration-300 ease-out group-hover:bg-brand group-hover:text-brand-foreground"
        >
          <ArrowUpRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
