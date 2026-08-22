import { HOME } from "@/lib/content/home"

/**
 * Testimonials — placeholder structure only (revised doc §10): the section
 * renders NOTHING until verified client quotes arrive from BDM/sales
 * (Decision #5). Never publish invented quotes.
 */
export function TestimonialSection() {
  if (!HOME.testimonials.published) return null

  // Verified testimonials will render here as a single large-quote slider.
  return null
}
