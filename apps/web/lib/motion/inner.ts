import {
  applyReducedMotionFallback,
  initCounters,
  initCursor,
  initMagnetic,
  initMarkDraw,
  initNav,
  initReveals,
  initSmoothScroll,
  initSpotlights,
  initSplits,
  initSurfaceNav,
  type CoreOptions,
} from "@/lib/motion/core"
import { gsap, isFinePointer, q, qa, ScrollTrigger } from "@/lib/motion/gsap"
import type { MotionVariant } from "@/components/motion/page-motion"

/**
 * Motion for every page that is not the home page: the two hubs, the ten
 * service and licence pages, and the India landing page.
 *
 * The shared part runs first, in the order the design ran it, then anything
 * whose markup is actually present on the page is wired up. Detecting by
 * element rather than by route keeps this in step with what was rendered.
 */
export function initInnerMotion(variant: MotionVariant, signal: AbortSignal) {
  const opts: CoreOptions = { signal, anchorOffset: -90 }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyReducedMotionFallback()
    return
  }

  const ctx = gsap.context(() => {
    initSmoothScroll(opts)
    initCursor(opts)
    initMagnetic(opts)
    initSpotlights([".cta"], opts)

    pageHeroIntro()
    heroParallax()
    initCounters({ delay: 0.9, once: false })

    const nav = initNav()
    initSurfaceNav(nav)
    initReveals()
    initSplits(":not(.phero .h1)")

    scrollSpy(signal)
    ghostNumerals()
    imageReveals()
    checklists()
    steppers()
    comparisonMatrix(signal)
    licenceFan(signal)
    processTrack()

    if (variant === "india") indiaMotion(signal)

    initMarkDraw("#ctaMark", ".cta")

    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    window.addEventListener(
      "load",
      () => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      },
      { signal }
    )
  })

  signal.addEventListener("abort", () => ctx.revert())
}

/** Page hero: masked headline, crumbs and meta rising in behind the nav. */
function pageHeroIntro() {
  if (!q(".phero")) return
  gsap.set(".phero .wi", { yPercent: 110 })
  gsap.set(".phero .crumbs, .phero .lede, .phero-meta, .phero-side", {
    y: 24,
    autoAlpha: 0,
  })
  gsap.set("#nav", { y: -24, autoAlpha: 0 })

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

  // Not every page hero has a photo — the licences hero carries the card fan
  // instead — and GSAP warns about a tween with no target.
  if (q(".phero-media img")) {
    tl.from(
      ".phero-media img",
      { scale: 1.16, duration: 1.8, ease: "power3.out" },
      0
    )
  }

  tl.to(".phero .wi", { yPercent: 0, duration: 1.1, stagger: 0.05 }, 0.15)
    .to(".phero .crumbs", { y: 0, autoAlpha: 1, duration: 0.8 }, 0.5)
    .to(
      ".phero .lede, .phero-meta, .phero-side",
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
      0.7
    )
    .to(
      "#nav",
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        // Hand the nav back to CSS. Left alone, this tween keeps an inline
        // `transform: translate(0px, 0px)` on the header for the life of the
        // page, and an inline transform outranks the stylesheet — so any rule
        // that later moves the nav would silently do nothing.
        onComplete: () => {
          gsap.set("#nav", { clearProps: "all" })
        },
      },
      0.6
    )
}

function heroParallax() {
  if (!q(".phero-media img")) return
  gsap.to(".phero-media img", {
    yPercent: 18,
    scale: 1.06,
    ease: "none",
    scrollTrigger: {
      trigger: ".phero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  })
}

/** Sticky sub-nav that follows the section you are reading. */
function scrollSpy(signal: AbortSignal) {
  const links = qa<HTMLAnchorElement>(".spy a[data-spy]")
  const indicator = q(".spy .ind")
  if (!links.length) return

  const setSpy = (id: string) => {
    links.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === id))
    const active = links.find((a) => a.dataset.spy === id)
    if (!active || !indicator) return
    gsap.to(indicator, {
      x: active.offsetLeft,
      width: active.offsetWidth,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    })
    active.scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  qa("[data-spy-section]").forEach((section) =>
    ScrollTrigger.create({
      trigger: section,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (s) => {
        if (s.isActive) setSpy(section.id)
      },
    })
  )

  window.addEventListener(
    "resize",
    () => {
      const active = links.find((a) => a.classList.contains("is-active"))
      if (active && indicator) {
        gsap.set(indicator, { x: active.offsetLeft, width: active.offsetWidth })
      }
    },
    { signal }
  )
}

/** Outlined section numerals drifting against the scroll. */
function ghostNumerals() {
  qa(".svc-num").forEach((n) =>
    gsap.fromTo(
      n,
      { yPercent: 30 },
      {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: n.closest(".svc") as Element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    )
  )
}

/** Photographs wiped in from the bottom edge. */
function imageReveals() {
  qa(".svc-ph img").forEach((img) =>
    gsap.fromTo(
      img,
      { clipPath: "inset(100% 0 0 0)", scale: 1.15 },
      {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img.closest(".svc-ph") as Element,
          start: "top 85%",
        },
      }
    )
  )
}

function checklists() {
  qa(".check").forEach((ul) =>
    gsap.from(qa("li", ul), {
      y: 14,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.5,
      ease: "power3.out",
      scrollTrigger: { trigger: ul, start: "top 85%" },
    })
  )
  qa(".assure").forEach((ul) =>
    gsap.from(qa("li", ul), {
      y: 14,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.5,
      ease: "power3.out",
      scrollTrigger: { trigger: ul, start: "top 90%" },
    })
  )
}

/** Vertical phase steppers on the hub pages. */
function steppers() {
  qa(".stepper").forEach((st) => {
    const items = qa("li", st)
    const fill = q(".fill", st)
    if (!fill) return
    gsap.to(fill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: st,
        start: "top 70%",
        end: "bottom 55%",
        scrub: 0.5,
        onUpdate: (s) =>
          items.forEach((li, i) =>
            li.classList.toggle("is-on", s.progress * items.length >= i + 0.3)
          ),
      },
    })
  })
}

/** Comparison table: rows rise in, and hovering follows one licence down it. */
function comparisonMatrix(signal: AbortSignal) {
  const mx = q<HTMLTableElement>("table.mx")
  if (!mx) return

  mx.addEventListener(
    "pointerover",
    (e) => {
      const cell = (e.target as Element).closest("td,th")
      if (!cell?.parentElement) return
      const i = Array.from(cell.parentElement.children).indexOf(cell)
      mx.dataset.col = i > 0 ? String(i) : ""
    },
    { signal }
  )
  mx.addEventListener(
    "pointerleave",
    () => {
      mx.dataset.col = ""
    },
    { signal }
  )

  gsap.from(qa("tbody tr", mx), {
    y: 12,
    autoAlpha: 0,
    stagger: 0.07,
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: { trigger: mx, start: "top 80%" },
  })
}

/** The fanned licence cards in the licences hero. */
function licenceFan(signal: AbortSignal) {
  const fan = q("#fan")
  const cards = qa<HTMLAnchorElement>("#fan a")
  if (!fan || !cards.length) return

  const spread = () => {
    const width = fan.clientWidth
    const cardWidth = cards[0]?.offsetWidth ?? 0
    return Math.max(22, Math.min(56, (width - cardWidth) / 4 - 26))
  }

  // GSAP owns the centring (xPercent/yPercent). The CSS deliberately does not
  // use `translate`, because browsers differ on whether GSAP folds that into
  // its own transform — which is what once pushed the whole fan off-centre.
  const layout = (i: number, hovered?: number) => ({
    xPercent: -50,
    yPercent: -50,
    rotate: (i - 2) * 7,
    x: (i - 2) * spread(),
    y: Math.abs(i - 2) * 18 + (hovered === i ? -26 : 0),
    z: hovered === i ? 80 : 0,
    scale: hovered === i ? 1.04 : 1,
    zIndex: hovered === i ? 10 : 5 - Math.abs(i - 2),
  })

  gsap.set(cards, { transformOrigin: "50% 110%" })
  cards.forEach((c, i) => gsap.set(c, layout(i)))
  gsap.from(cards, {
    xPercent: -50,
    yPercent: -50,
    rotate: 0,
    x: 0,
    y: 120,
    autoAlpha: 0,
    stagger: 0.08,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.5,
  })

  window.addEventListener(
    "resize",
    () => cards.forEach((c, i) => gsap.set(c, layout(i))),
    { signal }
  )

  cards.forEach((card, i) => {
    card.addEventListener(
      "pointerenter",
      () =>
        cards.forEach((other, k) =>
          gsap.to(other, { ...layout(k, i), duration: 0.5, ease: "power3.out" })
        ),
      { signal }
    )
    card.addEventListener(
      "pointerleave",
      () =>
        cards.forEach((other, k) =>
          gsap.to(other, { ...layout(k), duration: 0.7, ease: "power3.out" })
        ),
      { signal }
    )
  })

  if (isFinePointer()) {
    fan.addEventListener(
      "pointermove",
      (e) => {
        const r = fan.getBoundingClientRect()
        const dx = (e.clientX - r.left) / r.width - 0.5
        const dy = (e.clientY - r.top) / r.height - 0.5
        gsap.to(fan, {
          rotateY: dx * 10,
          rotateX: -dy * 8,
          duration: 0.6,
          ease: "power2.out",
        })
      },
      { signal }
    )
    fan.addEventListener(
      "pointerleave",
      () => gsap.to(fan, { rotateY: 0, rotateX: 0, duration: 0.8 }),
      { signal }
    )
  }
}

/** Horizontal process track on the detail and India pages. */
function processTrack() {
  const track = q(".track")
  if (!track) return
  const cards = qa(".pc", track)
  const fill = q(".lfill", track)
  const counter = q("#procCount b")
  if (!fill || !cards.length) return

  gsap.from(cards, {
    y: 30,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: track, start: "top 82%" },
  })

  const vertical = () => window.matchMedia("(max-width:900px)").matches

  ScrollTrigger.create({
    trigger: track,
    start: "top 70%",
    end: "bottom 45%",
    scrub: 0.5,
    onUpdate: (s) => {
      const p = s.progress
      if (vertical()) gsap.set(fill, { scaleX: 1, scaleY: p })
      else gsap.set(fill, { scaleY: 1, scaleX: p })
      cards.forEach((card, i) =>
        card.classList.toggle("is-on", p * cards.length >= i + 0.35)
      )
      if (counter) {
        counter.textContent = String(
          Math.min(cards.length, Math.max(1, Math.ceil(p * cards.length)))
        ).padStart(2, "0")
      }
    },
  })
}

/** India page: the incorporation certificate, the Gulf-to-Mumbai arc and fees. */
function indiaMotion(signal: AbortSignal) {
  certificate(signal)
  bridgeReveals()

  qa(".aud-list .why-row").forEach((row) =>
    gsap.from(row, {
      y: 26,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 88%" },
    })
  )
  qa(".inc-item").forEach((item, i) =>
    gsap.from(item, {
      y: 24,
      autoAlpha: 0,
      duration: 0.7,
      delay: (i % 2) * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: item, start: "top 90%" },
    })
  )
  qa(".wy-tile").forEach((tile, i) =>
    gsap.from(tile, {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      delay: (i % 3) * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tile.parentElement as Element,
        start: "top 85%",
      },
    })
  )
  qa(".pk").forEach((pack, i) =>
    gsap.from(pack, {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: pack.parentElement as Element,
        start: "top 85%",
      },
      clearProps: "transform",
    })
  )

  // Fees count up with Indian digit grouping.
  qa<HTMLElement>("[data-fee]").forEach((el) => {
    const value = Number(el.dataset.fee)
    const obj = { n: 0 }
    gsap.to(obj, {
      n: value,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => {
        el.textContent = `₹${Math.round(obj.n).toLocaleString("en-IN")}`
      },
    })
  })
}

/** The certificate types out its number, stamps itself, then ticks the kit. */
function certificate(signal: AbortSignal) {
  const cert = q("#cert")
  if (!cert) return
  const cin = q(".cin", cert)
  const kit = qa(".kit span", cert)
  const stamp = q(".stamp", cert)
  const NUMBER = cert.dataset.cin ?? ""
  if (!cin || !stamp) return

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 1.4 })
  tl.add(() => {
    cert.classList.remove("is-done")
    kit.forEach((k) => k.classList.remove("is-on"))
  })
    .set(cin, { textContent: "" })
    .set(stamp, { opacity: 0, scale: 0.6, rotate: -14 })
    .to(
      { n: 0 },
      {
        n: NUMBER.length,
        duration: 1.6,
        ease: "none",
        onUpdate() {
          const target = this.targets()[0] as { n: number }
          cin.textContent = NUMBER.slice(0, Math.round(target.n))
        },
      }
    )
    .add(() => cert.classList.add("is-done"))
    .to(
      stamp,
      {
        opacity: 1,
        scale: 1,
        rotate: -14,
        duration: 0.35,
        ease: "back.out(3)",
      },
      "+=.2"
    )

  kit.forEach((k, i) =>
    tl.add(() => k.classList.add("is-on"), `+=${i ? 0.32 : 0.5}`)
  )

  if (isFinePointer()) {
    const wrap = cert.parentElement
    wrap?.addEventListener(
      "pointermove",
      (e) => {
        const r = wrap.getBoundingClientRect()
        const dx = (e.clientX - r.left) / r.width - 0.5
        const dy = (e.clientY - r.top) / r.height - 0.5
        gsap.to(cert, {
          rotateY: dx * 10,
          rotateX: -dy * 8,
          duration: 0.6,
          ease: "power2.out",
        })
      },
      { signal }
    )
    wrap?.addEventListener(
      "pointerleave",
      () => gsap.to(cert, { rotateY: 0, rotateX: 0, duration: 0.8 }),
      { signal }
    )
  }
}

/**
 * The two city cards and the big zero rising over the bridge globe.
 *
 * The arc itself used to be an SVG path drawn on scroll; it is the globe's
 * own animated arc now, so only the overlay is animated here.
 */
function bridgeReveals() {
  qa(".bnode").forEach((node, i) =>
    gsap.from(node, {
      y: 20,
      autoAlpha: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ".bmap", start: "top 75%" },
    })
  )

  const zero = q(".bmap .zero b")
  if (zero) {
    gsap.from(zero, {
      scale: 0.7,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".bmap", start: "top 70%" },
    })
  }
}
