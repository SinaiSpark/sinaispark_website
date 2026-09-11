import type { Metadata } from "next"
import Link from "next/link"

import { HOME } from "@/lib/content/home"
import { IMAGES } from "@/lib/images"
import { SITE } from "@/lib/site-config"
import { buildOrganizationSchema } from "@/components/site/organization-schema"
import { JsonLd } from "@/components/site/jsonld"
import { ImageHero } from "@/components/site/image-hero"
import { CtaLink } from "@/components/site/cta-link"
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

export const metadata: Metadata = {
  title: `${SITE.name}: Business Setup Services in Saudi Arabia and Beyond`,
  description: SITE.description,
}

export default function HomePage() {
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
        <CtaLink href={HOME.hero.primaryCta.href} variant="brand" size="lg">
          {HOME.hero.primaryCta.label}
        </CtaLink>
        <CtaLink
          href={HOME.hero.secondaryCta.href}
          variant="secondary"
          size="lg"
          arrow
        >
          {HOME.hero.secondaryCta.label}
        </CtaLink>
      </ImageHero>

      {/* 2 · Global Presence — dark signature band directly beneath the hero */}
      <CountryTiles />

      {/* 3 · Snapshot Stats — closes the dark opening block */}
      <StatsBand />

      {/* 4 · Who We Are — editorial split */}
      <section aria-labelledby="who-we-are-title" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-32 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-8">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={HOME.whoWeAre.eyebrow}
                title={<span id="who-we-are-title">{HOME.whoWeAre.title}</span>}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
                {HOME.whoWeAre.body}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <blockquote className="mt-8 border-l-2 border-brand pl-5">
                <p className="text-lg leading-relaxed font-medium tracking-tight text-primary italic md:text-xl">
                  “{HOME.whoWeAre.pullQuote}”
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.4}>
              <CtaLink
                href="/about-us/"
                variant="outline"
                arrow
                className="mt-8"
              >
                More about us
              </CtaLink>
            </Reveal>
          </div>
          <Reveal
            delay={0.1}
            className="relative min-h-[350px] pr-4 pb-4 md:min-h-[450px] md:pr-6 md:pb-6 lg:min-h-full"
          >
            <div className="absolute top-4 right-0 bottom-0 left-4 rounded-2xl border-2 border-brand/50 md:top-6 md:left-6" />
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

      {/* 5 · Mission / Vision — animated typography band */}
      <MissionVision />

      {/* 6 · What We Do — editorial index */}
      <ServiceIndex />

      {/* 7 · Why Choose Us — hairline grid */}
      <section aria-labelledby="why-us-title" className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <SectionHeading
            rule
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

      {/* 9 · Testimonials — dark band; hidden until verified quotes arrive */}
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
