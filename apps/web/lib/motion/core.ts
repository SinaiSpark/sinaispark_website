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

/**
 * Gives the nav its scrolled treatment — the translucent dark bar and blur —
 * once the page has moved past the hero.
 *
 * The nav stays on screen the whole way down. The design hid it on the way
 * down and brought it back on the way up, but that left the sub-nav with
 * nothing fixed to sit under, so the header is now simply always there and the
 * spy bar parks below it at a constant offset.
 */
export function initNav() {
  const nav = q("#nav")
  if (!nav) return null

  ScrollTrigger.create({
    start: 80,
    onUpdate: () => nav.classList.add("is-scrolled"),
    onLeaveBack: () => nav.classList.remove("is-scrolled"),
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

/**
 * Everything tagged data-reveal rises into place.
 *
 * The tween is cleared when it lands: a finished `from()` leaves
 * `transform: translate(0px, 0px)` inline, which outranks any `:hover`
 * transform in the stylesheet and quietly kills the card lifts.
 */
export function initReveals() {
  qa("[data-reveal]").forEach((el) =>
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onComplete: () => {
        gsap.set(el, { clearProps: "transform" })
      },
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

/**
 * Count-up numbers.
 *
 * `onScroll: false` runs them straight away — the inner pages put their figures
 * in the page hero, where there is nothing to scroll down to. Otherwise they
 * count on entry and rewind to zero once the section leaves upward, so a second
 * pass down the page counts again instead of showing a number already landed.
 */
export function initCounters({ delay = 0, onScroll = true } = {}) {
  qa<HTMLElement>("[data-count]").forEach((el) => {
    const value = Number(el.dataset.count)
    const obj = { n: 0 }
    const write = () => {
      el.textContent = String(Math.round(obj.n))
    }
    const run = () =>
      gsap.to(obj, {
        n: value,
        duration: 1.8,
        ease: "power3.out",
        delay,
        overwrite: true,
        onUpdate: write,
      })

    if (!onScroll) {
      run()
      return
    }

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: run,
      onLeaveBack: () => {
        gsap.killTweensOf(obj)
        obj.n = 0
        write()
      },
    })
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

/**
 * Couples a CSS marquee's speed to how fast the page is scrolling.
 *
 * The loop itself stays a CSS animation, so it keeps running on the compositor
 * — this only nudges `playbackRate`, which is why hover-to-pause
 * (`animation-play-state`) still wins. Speed decays back to 1x once the scroll
 * settles, and direction never flips: reversing a list of regulator names on
 * every upward scroll reads as a glitch rather than as motion.
 */
export function initMarqueeVelocity(selector: string, { signal }: CoreOptions) {
  const tracks = qa(selector)
  if (!tracks.length) return

  /** Resolved lazily: the CSS animation may not exist on the first frame. */
  const animations = () => tracks.flatMap((t) => t.getAnimations?.() ?? [])

  let boost = 1
  let current = 1
  let applied = 1

  tracks.forEach((track) =>
    ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        boost = Math.min(1 + Math.abs(self.getVelocity()) / 1600, 3)
      },
    })
  )

  const tick = () => {
    boost += (1 - boost) * 0.06 // settle back to the resting speed
    current += (boost - current) * 0.1
    if (Math.abs(current - applied) < 0.01) return
    applied = current
    animations().forEach((a) => {
      a.playbackRate = current
    })
  }

  gsap.ticker.add(tick)
  signal.addEventListener("abort", () => {
    gsap.ticker.remove(tick)
    animations().forEach((a) => {
      a.playbackRate = 1
    })
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
