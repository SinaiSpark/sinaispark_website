import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { HOME } from "@/lib/content/home"
import { IMAGES, type ImageKey } from "@/lib/images"

/**
 * Global Presence — the site's signature band (§11.1/§13): five market tiles
 * directly beneath the hero, KSA emphasized first. India links to the India LP.
 */
export function CountryTiles() {
  const markets: readonly Market[] = HOME.globalPresence.markets
  const flagship = markets[0]
  const rest = markets.slice(1)
  if (!flagship) return null

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

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((market) => (
            <MarketTile key={market.name} market={market} />
          ))}
        </ul>
        <ul className="mt-4">
          {/* KSA flagship tile spans full width with landscape crop (§13). */}
          <li className="[&>a]:h-44 md:[&>a]:h-52">
            <MarketTile market={flagship} featured />
          </li>
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
      className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/60 md:h-44 lg:h-48"
    >
      {asset ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 1280px, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          quality={80}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/25 to-transparent"
      />
      <div className="relative flex items-end justify-between gap-3 p-4">
        <div>
          <span className="mb-1.5 inline-block rounded-sm bg-gold/15 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-gold uppercase">
            {market.tag}
          </span>
          <span className="block text-base leading-tight font-semibold text-primary-foreground md:text-lg">
            {market.name}
          </span>
          {!featured ? (
            <span className="mt-1 block text-xs leading-snug text-primary-foreground/75">
              {market.description}
            </span>
          ) : null}
        </div>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
    </Link>
  )
}
