import { HOME } from "@/lib/content/home"
import { Reveal } from "@/components/motion/reveal"

/**
 * Testimonials — placeholder structure (revised doc §10). Currently renders
 * MOCK quotes for site review; MUST be swapped to BDM/sales-verified
 * testimonials before launch (tracked in /PENDING_CLIENT_DATA.md).
 */
export function TestimonialSection() {
  if (!HOME.testimonials.published) return null

  return (
    <section aria-labelledby="testimonials-title" className="bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            {HOME.testimonials.eyebrow}
          </p>
          <h2
            id="testimonials-title"
            className="text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl"
          >
            {HOME.testimonials.title}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {HOME.testimonials.subheadline}
          </p>
        </div>

        <Reveal stagger className="grid gap-5 md:grid-cols-3">
          {HOME.testimonials.items.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-lg border bg-background p-6"
            >
              <span
                aria-hidden="true"
                className="font-serif text-5xl leading-none text-gold"
              >
                “
              </span>
              <blockquote className="mt-2 flex-1">
                <p className="leading-relaxed">{testimonial.quote}</p>
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <span className="block text-sm font-semibold">
                  {testimonial.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {testimonial.role} · {testimonial.market}
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
