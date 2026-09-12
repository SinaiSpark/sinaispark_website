import Lenis from "lenis"

import { gsap, isFinePointer, q, qa, ScrollTrigger } from "@/lib/motion/gsap"

/**
 * Motion shared by every page: smooth scroll, the custom cursor, magnetic
 * buttons, the hiding nav, the light/dark surface swap and the generic reveal
 * and word-mask animations.
 *
 * Each helper takes an AbortSignal so the page hook can tear its listeners
 * down; GSAP tweens are cleaned up by the gsap.context() the caller wraps
 * everything in.
 */

export interface CoreOptions {
  signal: AbortSignal
  /** Offset applied when an in-page anchor is clicked. */
  anchorOffset?: number
}

/** Lenis + ScrollTrigger wiring, plus anchor links routed through Lenis. */
export function initSmoothScroll({ signal, anchorOffset = -80 }: CoreOptions) {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on("scroll", ScrollTrigger.update)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  qa<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener(
      "click",
      (e) => {
        const id = a.getAttribute("href")
        const target = id && id.length > 1 ? q(id) : null
        if (target) {
          e.preventDefault()
          lenis.scrollTo(target, { offset: anchorOffset })
        }
      },
      { signal }
    )
  )

  signal.addEventListener("abort", () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
  })

  return lenis
}

/** The trailing dot cursor. Pointer-fine devices only. */
export function initCursor({ signal }: CoreOptions) {
  const cur = q("#cursor")
  if (!cur || !isFinePointer()) return

  const cx = gsap.quickTo(cur, "x", { duration: 0.18, ease: "power3" })
  const cy = gsap.quickTo(cur, "y", { duration: 0.18, ease: "power3" })

  window.addEventListener(
    "pointermove",
    (e) => {
      cx(e.clientX)
      cy(e.clientY)
      cur.classList.add("is-on")
    },
    { passive: true, signal }
  )
  document.addEventListener(
    "pointerover",
    (e) => {
      const t = e.target as Element | null
      cur.classList.toggle("is-link", !!t?.closest?.("a,button"))
    },
    { signal }
  )
}

/** Buttons that lean toward the pointer and spring back. */
export function initMagnetic({ signal }: CoreOptions) {
  if (!isFinePointer()) return
  qa("[data-magnetic]").forEach((b) => {
    const xTo = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" })
    const yTo = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" })
    b.addEventListener(
      "pointermove",
      (e) => {
        const r = b.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38)
      },
      { signal }
    )
    b.addEventListener(
      "pointerleave",
      () => {
        gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,.45)" })
      },
      { signal }
    )
  })
}

/** Hides the nav on the way down, shows it on the way back up. */
export function initNav() {
  const nav = q("#nav")
  if (!nav) return null

  ScrollTrigger.create({
    start: 80,
    onUpdate: (s) => {
      nav.classList.toggle(
        "is-hidden",
        s.direction === 1 &&
          s.scroll() > 200 &&
          !document.body.classList.contains("is-sheet")
      )
      nav.classList.add("is-scrolled")
    },
    onLeaveBack: () => nav.classList.remove("is-scrolled", "is-hidden"),
  })

  return nav
}

/** Flips the nav to its light treatment while a light section sits under it. */
export function initSurfaceNav(nav: HTMLElement | null) {
  if (!nav) return
  qa('[data-surface="light"]').forEach((sec) =>
    ScrollTrigger.create({
      trigger: sec,
      start: "top 40px",
      end: "bottom 40px",
      onToggle: (s) => nav.classList.toggle("is-light", s.isActive),
    })
  )
}

/** Everything tagged data-reveal rises into place once. */
export function initReveals() {
  qa("[data-reveal]").forEach((el) =>
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    })
  )
}

/**
 * Word-mask headings. The `.w` / `.wi` spans are rendered on the server by the
 * SplitText component, so there is no markup rewrite on the client.
 */
export function initSplits(exclude = "") {
  qa(`[data-split]${exclude}`).forEach((el) =>
    gsap.from(qa(".wi", el), {
      yPercent: 110,
      duration: 1,
      stagger: 0.035,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    })
  )
}

/** Pointer-following glow, used by the mission panels and the closing CTA. */
export function initSpotlights(selectors: string[], { signal }: CoreOptions) {
  selectors
    .flatMap((s) => qa(s))
    .forEach((el) =>
      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect()
          el.style.setProperty("--mx", `${e.clientX - r.left}px`)
          el.style.setProperty("--my", `${e.clientY - r.top}px`)
        },
        { signal }
      )
    )
}

/** Count-up numbers. */
export function initCounters({ delay = 0, once = true } = {}) {
  qa<HTMLElement>("[data-count]").forEach((el) => {
    const value = Number(el.dataset.count)
    const obj = { n: 0 }
    const run = () =>
      gsap.to(obj, {
        n: value,
        duration: 1.8,
        ease: "power3.out",
        delay,
        onUpdate: () => {
          el.textContent = String(Math.round(obj.n))
        },
      })
    if (once) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: run,
      })
    } else {
      run()
    }
  })
}

/** Draws an inline brand mark as the section scrolls past. */
export function initMarkDraw(selector: string, triggerSel: string) {
  const paths = qa<SVGPathElement>(`${selector} .mp`)
  if (!paths.length) return
  paths.forEach((p) => {
    const len = p.getTotalLength()
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
  })
  gsap.to(paths, {
    strokeDashoffset: 0,
    ease: "none",
    stagger: 0.25,
    scrollTrigger: {
      trigger: triggerSel,
      start: "top 90%",
      end: "bottom bottom",
      scrub: 0.6,
    },
  })
}

/** Static end-state used when the visitor asks for reduced motion. */
export function applyReducedMotionFallback() {
  qa(".step").forEach((s) => s.classList.add("is-on"))
  qa(".stepper li").forEach((l) => l.classList.add("is-on"))
  qa<HTMLElement>(".stepper .fill").forEach((f) => {
    f.style.transform = "none"
  })
  qa<HTMLElement>("[data-count]").forEach((el) => {
    el.textContent = el.dataset.count ?? el.textContent
  })
  const loader = q("#loader")
  if (loader) loader.style.display = "none"
}
