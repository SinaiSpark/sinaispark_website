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
import { AboutImageStack } from "@/components/home/about-image-stack"
import { ServiceIndex } from "@/components/home/service-index"
import { StatsBand } from "@/components/home/stats-band"
import { ProcessTimeline } from "@/components/home/process-timeline"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { RegionalCoverage } from "@/components/home/regional-coverage"
import { Reveal } from "@/components/motion/reveal"
import { MissionVision } from "@/components/home/mission-vision"
import { WhyChooseUsGrid } from "@/components/home/why-choose-us-grid"
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
        assets={[IMAGES.homeHero, IMAGES.countryUk, IMAGES.countryUae]}
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
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={HOME.whoWeAre.eyebrow}
                title={<span id="who-we-are-title">{HOME.whoWeAre.title}</span>}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {HOME.whoWeAre.body}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <blockquote className="mt-8 border-l-2 border-gold pl-5">
                <p className="text-lg leading-relaxed font-medium tracking-tight text-primary italic md:text-xl">
                  “{HOME.whoWeAre.pullQuote}”
                </p>
              </blockquote>
            </Reveal>
          </div>
          <Reveal
            delay={0.1}
            className="relative min-h-[350px] pr-4 pb-4 md:min-h-[450px] md:pr-6 md:pb-6 lg:min-h-full"
          >
            <div className="absolute top-4 right-0 bottom-0 left-4 rounded-lg border-2 border-gold md:top-6 md:left-6" />
            <Link
              href="/about-us/"
              className="relative block h-full w-full outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
              aria-label="Learn more about us"
            >
              <AboutImageStack
                assets={[
                  IMAGES.aboutHandshake,
                  IMAGES.aboutMeeting,
                  IMAGES.aboutDocument,
                ]}
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4 · Mission / Vision — animated typography band */}
      <MissionVision />

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
          <WhyChooseUsGrid points={HOME.whyChooseUs.points} />
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
