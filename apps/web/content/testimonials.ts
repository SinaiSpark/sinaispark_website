/**
 * Testimonial marquee on the home page.
 *
 * MOCK DATA: these three quotes were written for the design review and are not
 * real client feedback. They must be replaced with approved, attributable
 * testimonials before launch (tracked in PENDING_CLIENT_DATA.md).
 */

export interface Testimonial {
  quote: string
  name: string
  role: string
  market: string
}

export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  headline: "What our clients say.",
  lede: "Real feedback from founders and investors we have helped enter new markets.",
  items: [
    {
      quote:
        "They handled the entire MISA process while we kept running our business. We were licensed in weeks, not months.",
      name: "Ahmed K.",
      role: "Managing Director, Industrial Group",
      market: "Saudi Arabia",
    },
    {
      quote:
        "One team for formation, licensing and visas meant nothing fell through the cracks. Clear pricing from day one.",
      name: "Sarah M.",
      role: "Founder, Tech Consultancy",
      market: "UAE",
    },
    {
      quote:
        "As an NRI in Riyadh, registering my Indian company entirely online felt effortless. FEMA structuring was handled correctly the first time.",
      name: "Rajesh P.",
      role: "Director, Trading Company",
      market: "India",
    },
  ] satisfies Testimonial[],
}
