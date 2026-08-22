import Image from "next/image"

import { HOME } from "@/lib/content/home"
import { IMAGES } from "@/lib/images"
import { Reveal } from "@/components/motion/reveal"

/**
 * Regional Coverage in Saudi Arabia — three image cards with overlay
 * captions (§13).
 */
export function RegionalCoverage() {
  return (
    <section
      aria-labelledby="regional-coverage-title"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            {HOME.regionalCoverage.eyebrow}
          </p>
          <h2
            id="regional-coverage-title"
            className="text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl"
          >
            {HOME.regionalCoverage.title}
          </h2>
        </div>

        <Reveal stagger className="grid gap-5 md:grid-cols-3">
          {HOME.regionalCoverage.regions.map((region) => {
            const asset = IMAGES[region.imageKey]
            return (
              <article
                key={region.city}
                className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-lg outline-none focus-within:ring-3 focus-within:ring-ring/60"
              >
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  quality={80}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={
                    asset.focal ? { objectPosition: asset.focal } : undefined
                  }
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/30 to-transparent"
                />
                <div className="relative p-5">
                  <h3 className="text-xl font-semibold tracking-tight text-primary-foreground">
                    {region.city}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/80">
                    {region.description}
                  </p>
                </div>
              </article>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
