import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { HOME } from "@/lib/content/home"
import { IMAGES } from "@/lib/images"
import { SITE } from "@/lib/site-config"
import { buildOrganizationSchema } from "@/components/site/organization-schema"
import { JsonLd } from "@/components/site/jsonld"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import { SectionHeading } from "@/components/site/section-heading"
import { CountryTiles } from "@/components/home/country-tiles"
import { ServiceIndex } from "@/components/home/service-index"
import { StatsBand } from "@/components/home/stats-band"
import { ProcessTimeline } from "@/components/home/process-timeline"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { RegionalCoverage } from "@/components/home/regional-coverage"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: `${SITE.name}: Business Setup Services in Saudi Arabia and Beyond`,
  description: SITE.description,
}

const heroCtas = [
  {
    label: HOME.hero.primaryCta.label,
    href: HOME.hero.primaryCta.href,
    className:
      "bg-gold text-primary-deep hover:bg-gold/90 font-semibold hover:-translate-y-px",
  },
  {
    label: HOME.hero.secondaryCta.label,
    href: HOME.hero.secondaryCta.href,
    className:
      "border border-primary-foreground/40 text-primary-foreground hover:border-gold hover:text-gold",
  },
]

export default function HomePage() {
  const teamAsset = IMAGES.aboutTeam

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />

      {/* 1 · Hero */}
      <ImageHero
        assets={[IMAGES.homeHero, IMAGES.countrySaudiArabia, IMAGES.countryUae]}
        eyebrow={HOME.hero.eyebrow}
        title={HOME.hero.headline}
        subtitle={HOME.hero.subheadline}
        tagline={SITE.tagline}
        priority
      >
        {heroCtas.map((cta) => (
          <Link
            key={cta.label}
            href={cta.href}
            className={cn(
              "inline-flex h-11 items-center rounded-md border border-transparent px-6 text-sm transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              cta.className
            )}
          >
            {cta.label}
          </Link>
        ))}
      </ImageHero>

      {/* 2 · Global Presence — signature band directly beneath the hero */}
      <CountryTiles />

      {/* 3 · Who We Are — editorial split */}
      <section aria-labelledby="who-we-are-title" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-32 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={HOME.whoWeAre.eyebrow}
              title={<span id="who-we-are-title">{HOME.whoWeAre.title}</span>}
            />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {HOME.whoWeAre.body}
            </p>
            <blockquote className="mt-8 border-l-2 border-gold pl-5">
              <p className="text-lg leading-relaxed font-medium tracking-tight text-primary italic md:text-xl">
                “{HOME.whoWeAre.pullQuote}”
              </p>
            </blockquote>
          </Reveal>
          <Reveal
            delay={0.1}
            className="relative min-h-72 pr-4 pb-4 md:pr-6 md:pb-6 lg:min-h-full"
          >
            <div className="absolute top-4 right-0 bottom-0 left-4 rounded-lg border-2 border-gold md:top-6 md:left-6" />
            <Link
              href="/about-us/"
              className="relative block h-full w-full overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
              aria-label="Learn more about us"
            >
              <Image
                src={teamAsset.src}
                alt={teamAsset.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={80}
                className="object-cover transition-transform duration-500 hover:scale-105"
                style={
                  teamAsset.focal
                    ? { objectPosition: teamAsset.focal }
                    : undefined
                }
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4 · Mission / Vision — quiet paper band */}
      <section aria-label="Mission and vision" className="bg-background-alt">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:gap-14 lg:px-8">
          {[HOME.missionVision.mission, HOME.missionVision.vision].map(
            (item) => (
              <Reveal key={item.title} className="border-t-2 border-gold pt-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* 5 · Snapshot Stats */}
      <StatsBand />

      {/* 6 · What We Do — editorial index */}
      <ServiceIndex />

      {/* 7 · Why Choose Us — mist tiles */}
      <section aria-labelledby="why-us-title" className="bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <SectionHeading
            eyebrow={HOME.whyChooseUs.eyebrow}
            title={
              <span id="why-us-title" className="contents">
                {HOME.whyChooseUs.title}
              </span>
            }
          />
          <Reveal
            stagger
            className="mt-10 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3"
          >
            {HOME.whyChooseUs.points.map((point) => (
              <div key={point.title} className="bg-background p-6">
                <h3 className="text-base font-semibold tracking-tight">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 8 · How It Works */}
      <ProcessTimeline />

      {/* 9 · Testimonials — hidden until verified quotes arrive */}
      <TestimonialSection />

      {/* 10 · Regional Coverage in Saudi Arabia */}
      <RegionalCoverage />

      {/* 11 · Closing CTA */}
      <CTASection
        title={HOME.closingCta.title}
        subheadline={HOME.closingCta.subheadline}
        buttons={HOME.closingCta.buttons.map((button) => ({
          label: button.label,
          href: button.href,
          variant: button.variant,
        }))}
      />
    </>
  )
}
