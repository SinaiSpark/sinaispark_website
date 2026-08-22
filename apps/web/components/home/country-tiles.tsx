"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"

import { HOME } from "@/lib/content/home"
import { IMAGES, type ImageKey } from "@/lib/images"

/**
 * Global Presence — the site's signature band (§11.1/§13): five market tiles
 * directly beneath the hero, KSA emphasized first. India links to the India LP.
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
      className="bg-background-alt"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
              Global Presence
            </p>
            <h2
              id="global-presence-title"
              className="max-w-xl text-2xl font-semibold tracking-tight text-balance md:text-3xl"
            >
              {HOME.globalPresence.intro}
            </h2>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {orderedMarkets.map((market, index) => {
            const isFeatured = index === 0
            return (
              <motion.li
                layout
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
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

type Market = {
  name: string
  tag: string
  description: string
  imageKey: ImageKey
  href: string
}

function MarketTile({
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
      className="group relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/60 lg:min-h-64"
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
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-primary-deep/95 via-primary-deep/60 to-transparent"
      />
      <div className="relative flex items-end justify-between gap-3 p-5 md:p-6">
        <div>
          {featured ? (
            <span className="mb-2 inline-block rounded-sm bg-gold/20 px-2 py-0.5 text-[0.65rem] font-bold tracking-widest text-gold uppercase shadow-sm">
              {market.tag}
            </span>
          ) : null}
          <span className="block text-lg leading-tight font-bold tracking-tight text-primary-foreground md:text-xl">
            {market.name}
          </span>
          {!featured ? (
            <span className="mt-1.5 block text-xs leading-snug font-medium text-primary-foreground/80">
              {market.description}
            </span>
          ) : (
            <span className="mt-2 block max-w-xs text-sm leading-relaxed font-medium text-primary-foreground/80">
              {market.description}
            </span>
          )}
        </div>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
    </Link>
  )
}
