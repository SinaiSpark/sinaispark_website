import type { Metadata } from "next"

import { HOME } from "@/lib/content/home"
import { IMAGES } from "@/lib/images"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import { SectionHeading } from "@/components/site/section-heading"
import { MarketTile } from "@/components/home/country-tiles"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Where We Work: Saudi Arabia, UAE, UK, India & Bahrain",
  description:
    "Sinai Spark Global operates across five markets — Saudi Arabia as our flagship, plus the UAE, the UK, India and Bahrain — with a team on the ground in each.",
  alternates: { canonical: "/where-we-work/" },
}

/**
 * Markets hub. Exists so the breadcrumb on every country page resolves to a
 * real destination, and gives the five-market story a home of its own.
 */
export default function WhereWeWorkPage() {
  const markets = HOME.globalPresence.markets

  return (
    <>
      <ImageHero
        asset={IMAGES.homeHero}
        size="compact"
        breadcrumbPath="/where-we-work/"
        eyebrow="Where we work"
        title="Five markets, one team on the ground"
        subtitle={HOME.globalPresence.intro}
        priority
      />

      <section aria-labelledby="markets-title" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            rule
            eyebrow="Our Markets"
            title={
              <span id="markets-title">
                Saudi Arabia first, with a growing footprint across the globe
              </span>
            }
            className="mb-12"
          />
          <Reveal stagger>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {markets.map((market, index) => (
                <li
                  key={market.name}
                  className={index === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
                >
                  <MarketTile market={market} featured={index === 0} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Not sure which market to enter first?"
        subheadline="We assess your commercial model against each jurisdiction's licensing, ownership and tax position — free of charge."
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "brand",
          },
          {
            label: "Explore Our Services",
            href: "/services/",
            variant: "secondary",
          },
        ]}
      />
    </>
  )
}
