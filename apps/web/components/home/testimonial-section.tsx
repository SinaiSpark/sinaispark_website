import { HOME } from "@/lib/content/home"
import { Reveal } from "@/components/motion/reveal"
import { GlassCard } from "@/components/site/glass-card"
import { SectionHeading } from "@/components/site/section-heading"

/**
 * Testimonials — placeholder structure (revised doc §10). Currently renders
 * MOCK quotes for site review; MUST be swapped to BDM/sales-verified
 * testimonials before launch (tracked in /PENDING_CLIENT_DATA.md).
 */
export function TestimonialSection() {
  if (!HOME.testimonials.published) return null

  return (
    <section
      aria-labelledby="testimonials-title"
      data-surface="navy"
      className="relative overflow-hidden bg-primary-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          tone="navy"
          rule
          eyebrow={HOME.testimonials.eyebrow}
          title={<span id="testimonials-title">{HOME.testimonials.title}</span>}
          lede={HOME.testimonials.subheadline}
          className="mb-12"
        />

        <Reveal stagger className="grid gap-4 md:grid-cols-3">
          {HOME.testimonials.items.map((testimonial) => (
            <GlassCard
              key={testimonial.name}
              className="flex flex-col p-6 md:p-7"
            >
              <span
                aria-hidden="true"
                className="font-serif text-6xl leading-none text-brand"
              >
                “
              </span>
              <figure className="flex flex-1 flex-col">
                <blockquote className="mt-1 flex-1">
                  <p className="text-base leading-relaxed text-primary-foreground/90 md:text-lg">
                    {testimonial.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <span className="block text-sm font-semibold text-primary-foreground">
                    {testimonial.name}
                  </span>
                  <span className="block text-xs text-primary-foreground/65">
                    {testimonial.role} · {testimonial.market}
                  </span>
                </figcaption>
              </figure>
            </GlassCard>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
