import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Single registration point for GSAP. The design was built against GSAP 3.12.5
 * with ScrollTrigger and Lenis, and package.json pins that exact version so the
 * timings behave the way they were signed off.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  /**
   * Entrance animations rewind when their section leaves upward, so scrolling
   * back to the top and down again plays them a second time.
   *
   * GSAP's own default is "play none none none" — fire once, then sit there.
   * That left the page inconsistent: everything scrub-linked (the markets pin,
   * the brand draw, the process rail) already replayed on every pass, while the
   * reveals and counters did not. Scrubbed triggers ignore toggleActions, so
   * this only reaches the one-shot entrances.
   */
  ScrollTrigger.defaults({ toggleActions: "play none none reverse" })
}

export { gsap, ScrollTrigger }

/** Shorthands the ported motion code uses, kept terse to stay close to the source. */
export const q = <T extends Element = HTMLElement>(
  sel: string,
  root: ParentNode = document
) => root.querySelector<T>(sel)

export const qa = <T extends Element = HTMLElement>(
  sel: string,
  root: ParentNode = document
) => Array.from(root.querySelectorAll<T>(sel))

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer:fine)").matches
