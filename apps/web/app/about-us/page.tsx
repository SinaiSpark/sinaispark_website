import type { Metadata } from "next"
import Image from "next/image"

import { IMAGES } from "@/lib/images"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "About Sinai Spark Global: Global Business Setup Advisors",
  description:
    "Sinai Spark Global is a business setup and corporate solutions firm supporting company formation, licensing and compliance for investors expanding into new markets.",
  alternates: { canonical: "/about-us/" },
}

const apart = [
  {
    title: "One point of contact",
    body: "A single team across formation, licensing, legal and compliance — nothing falls between departments.",
  },
  {
    title: "On the ground in the Kingdom",
    body: "Hands-on experience across Riyadh, Jeddah and Dammam, with the ministry relationships that come from doing the work locally.",
  },
  {
    title: "A cross-border perspective",
    body: "Active operations spanning Saudi Arabia, the UAE, the UK, India and Bahrain, so structures are designed with the next market in mind.",
  },
]

const values = [
  { title: "Trust", body: "Clear, honest guidance at every stage." },
  { title: "Precision", body: "No shortcuts on regulatory detail." },
  {
    title: "Partnership",
    body: "Success measured by client outcomes, not transactions.",
  },
]

export default function AboutPage() {
  const story = IMAGES.aboutHandshake

  return (
    <>
      <ImageHero
        asset={IMAGES.aboutMeeting}
        size="compact"
        breadcrumbPath="/about-us/"
        eyebrow="About Us"
        title="From a Saudi formation service to a global corporate solutions firm"
        priority
      />

      {/* Our story — editorial split */}
      <section aria-labelledby="story-title" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[6fr_6fr] lg:gap-20 lg:px-8">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 lg:aspect-auto lg:min-h-[520px]">
            <Image
              src={story.src}
              alt={story.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={85}
              className="object-cover"
              style={story.focal ? { objectPosition: story.focal } : undefined}
            />
          </Reveal>
          <div className="flex flex-col justify-center">
            <Reveal>
              <SectionHeading
                eyebrow="Our Story"
                title={
                  <span id="story-title">
                    Built to close the gap between ambition and regulation
                  </span>
                }
              />
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
                Sinai Spark Global was founded to close the gap between
                international ambition and the fast evolving regulatory
                landscape of the markets our clients want to enter. What began
                as a company formation service focused on Saudi Arabia has grown
                into a full corporate solutions firm with active reach across
                the UAE, the UK, India and Bahrain, supporting clients from
                their first registration through years of ongoing operation.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What sets us apart — numbered rows */}
      <section aria-labelledby="apart-title" className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            rule
            eyebrow="What Sets Us Apart"
            title={
              <span id="apart-title">A partner, not a paperwork processor</span>
            }
            className="mb-12"
          />
          <Reveal stagger>
            <ol className="grid gap-4 md:grid-cols-3">
              {apart.map((item, index) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-7"
                >
                  <span className="text-sm font-semibold tracking-[0.14em] text-brand tabular-nums">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            rule
            eyebrow="Our Values"
            title={<span id="values-title">What we hold ourselves to</span>}
            className="mb-12"
          />
          <Reveal stagger>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="bg-background p-7 md:p-9">
                  <span
                    aria-hidden="true"
                    className="mb-5 block h-1 w-8 rounded-full bg-brand"
                  />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          {/* Team section intentionally omitted pending client team data (Conflict log #3). */}
        </div>
      </section>

      <CTASection
        title="Let's build your market entry together"
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "brand",
          },
        ]}
      />
    </>
  )
}
