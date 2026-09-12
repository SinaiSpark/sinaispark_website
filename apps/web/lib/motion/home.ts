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
import {
  gsap,
  prefersReducedMotion,
  q,
  qa,
  ScrollTrigger,
} from "@/lib/motion/gsap"

/**
 * Home page motion, in the same order the approved design ran it. Order
 * matters: ScrollTrigger creates triggers in call order, and the pinned markets
 * strip adds a screen-and-a-bit of spacing that anything registered earlier
 * would otherwise measure without — hence the sort() and refresh() at the end.
 */
export function initHomeMotion(signal: AbortSignal) {
  const opts: CoreOptions = { signal }

  if (prefersReducedMotion()) {
    const video = q<HTMLVideoElement>("#heroVideo")
    video?.removeAttribute("autoplay")
    video?.pause()
    applyReducedMotionFallback()
    return
  }

  const ctx = gsap.context(() => {
    const lenis = initSmoothScroll(opts)
    lenis.stop() // held until the loader lifts

    initCursor(opts)
    initMagnetic(opts)
    initSpotlights([".mv-panel", ".cta"], opts)

    heroSparks(signal)
    intro(() => lenis.start())
    heroParallax()

    const nav = initNav()
    brandMarkDraw()
    statsDots(signal)
    initMarkDraw("#ctaMark", ".cta")
    indiaParallax()
    initSurfaceNav(nav)
    initReveals()
    initSplits(":not(.hero-h)")
    marketsStrip()
    whoStack()
    initCounters()
    servicesStack()
    processRail()
    whyRows()

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

/** Drifting spark particles over the hero video. */
function heroSparks(signal: AbortSignal) {
  const canvas = q<HTMLCanvasElement>("#sparks")
  const ctx2d = canvas?.getContext("2d")
  if (!canvas || !ctx2d) return

  let width = 0
  let height = 0
  let mx = 0
  let my = 0
  let running = true
  let frame = 0
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const size = () => {
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const make = () => ({
    x: Math.random() * width,
    y: height + Math.random() * height * 0.3,
    r: Math.random() * 1.6 + 0.4,
    s: Math.random() * 0.35 + 0.15,
    a: Math.random() * 0.6 + 0.2,
    d: Math.random() * Math.PI * 2,
    z: Math.random(),
  })

  size()
  const particles = Array.from({ length: 110 }, () => {
    const p = make()
    p.y = Math.random() * height
    return p
  })

  window.addEventListener("resize", size, { signal })
  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
    },
    { passive: true, signal }
  )

  let t = 0
  const draw = () => {
    if (!running) return
    t += 0.008
    ctx2d.clearRect(0, 0, width, height)
    for (const p of particles) {
      p.y -= p.s
      p.x += Math.sin(t * 2 + p.d) * 0.25
      if (p.y < -10) Object.assign(p, make())
      const px = p.x + mx * 40 * p.z
      const py = p.y + my * 24 * p.z
      const tw = 0.6 + 0.4 * Math.sin(t * 6 + p.d)
      ctx2d.beginPath()
      ctx2d.arc(px, py, p.r, 0, Math.PI * 2)
      ctx2d.fillStyle = `rgba(60,201,210,${(p.a * tw).toFixed(3)})`
      ctx2d.fill()
    }
    frame = requestAnimationFrame(draw)
  }
  draw()

  const video = q<HTMLVideoElement>("#heroVideo")
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top bottom",
    end: "bottom top",
    onToggle: (s) => {
      running = s.isActive
      if (running) {
        draw()
        video?.play().catch(() => {})
      } else {
        video?.pause()
      }
    },
  })

  signal.addEventListener("abort", () => {
    running = false
    cancelAnimationFrame(frame)
  })
}

/** Loader mark draws itself, then hands over to the hero. */
function intro(onLoaderDone: () => void) {
  gsap.set(".hero .wi", { yPercent: 110 })
  gsap.set(".hero-eyebrow, .hero-sub, .hero-ctas, .hero-meta", {
    y: 26,
    autoAlpha: 0,
  })
  gsap.set("#nav", { y: -24, autoAlpha: 0 })

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
  const paths = qa<SVGPathElement>(".loader-mark .mp")
  paths.forEach((p) => {
    const len = p.getTotalLength()
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
  })

  tl.to(paths, {
    strokeDashoffset: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: "power2.inOut",
  })
    .to(
      paths,
      { fillOpacity: 1, strokeOpacity: 0, duration: 0.5, ease: "power2.out" },
      "-=.25"
    )
    .to(
      ".loader-line i",
      { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
      "-=.9"
    )
    .from(".loader-word", { autoAlpha: 0, y: 8, duration: 0.5 }, "-=.7")
    .to(
      "#loader",
      {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
        onComplete: () => {
          // The design removed the node; hiding it keeps React's tree intact.
          const loader = q("#loader")
          if (loader) loader.style.display = "none"
          onLoaderDone()
        },
      },
      "+=.15"
    )
    .from(
      ".hero-media .media",
      { scale: 1.12, duration: 2, ease: "power3.out" },
      "-=.9"
    )
    .to(".hero .wi", { yPercent: 0, duration: 1.1, stagger: 0.06 }, "-=1.7")
    .to(".hero-eyebrow", { y: 0, autoAlpha: 1, duration: 0.8 }, "-=1.1")
    .to(
      ".hero-sub, .hero-ctas, .hero-meta",
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
      "-=.9"
    )
    .to("#nav", { y: 0, autoAlpha: 1, duration: 0.8 }, "-=.9")
}

function heroParallax() {
  gsap.to(".hero-media .media", {
    yPercent: 16,
    scale: 1.08,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  })
  gsap.to(".hero .wrap", {
    yPercent: -12,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "40% top",
      end: "bottom top",
      scrub: true,
    },
  })
}

/** The brand mark draws and fills while the section is pinned. */
function brandMarkDraw() {
  const paths = qa<SVGPathElement>(".brand-mark .mp")
  if (!paths.length) return
  paths.forEach((p) => {
    const len = p.getTotalLength()
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
  })
  const caption = q("#brandCaption")

  gsap
    .matchMedia()
    .add({ desk: "(min-width: 900px)", mob: "(max-width: 899px)" }, (ctx) => {
      const desk = Boolean(ctx.conditions?.desk)
      if (desk) {
        ScrollTrigger.create({
          trigger: "#brand",
          start: "top top",
          end: "+=110%",
          pin: true,
          anticipatePin: 1,
        })
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#brand",
          start: desk ? "top 65%" : "top 70%",
          end: desk
            ? () => `+=${Math.round(window.innerHeight * (0.65 + 1.1))}`
            : "bottom 60%",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            if (!caption) return
            const p = Math.round(s.progress * 100)
            caption.textContent =
              p < 100 ? `Drawing · ${p}%` : "Sinai Spark Global · The mark"
          },
        },
      })
      tl.fromTo(
        ".brand-mark",
        { scale: 0.94, rotate: -3 },
        { scale: 1, rotate: 0, ease: "none", duration: 10 },
        0
      )
        .to(
          paths,
          { strokeDashoffset: 0, ease: "none", duration: 6.5, stagger: 0.5 },
          0
        )
        .to(
          paths,
          { fillOpacity: 1, ease: "power1.inOut", duration: 2.2, stagger: 0.3 },
          6.8
        )
        .to(paths, { strokeOpacity: 0, duration: 1.2 }, 8.8)
    })
}

/** Dot grid behind the stats, rippling out from the top left. */
function statsDots(signal: AbortSignal) {
  const holder = q("#statsDots")
  const section = q("#stats")
  if (!holder || !section) return

  const build = (): [number, number] => {
    const cols = Math.ceil(section.clientWidth / 34)
    const rows = Math.ceil(section.clientHeight / 34)
    holder.style.gridTemplateColumns = `repeat(${cols},1fr)`
    holder.innerHTML = "<i></i>".repeat(cols * rows)
    return [rows, cols]
  }

  let grid = build()
  const dots = () => qa("#statsDots i")
  gsap.set(dots(), { scale: 0, opacity: 0 })

  ScrollTrigger.create({
    trigger: "#stats",
    start: "top 75%",
    once: true,
    onEnter: () => {
      gsap.to(dots(), {
        scale: 1,
        opacity: 0.55,
        duration: 0.8,
        ease: "power2.out",
        stagger: { grid, from: [0.08, 0.55], amount: 1.4 },
      })
      gsap.to(dots(), {
        scale: 2.2,
        opacity: 1,
        duration: 0.45,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        delay: 1.9,
        stagger: { grid, from: [0.08, 0.55], amount: 1.3 },
      })
    },
  })

  window.addEventListener(
    "resize",
    () => {
      grid = build()
      gsap.set(dots(), { scale: 1, opacity: 0.55 })
    },
    { signal }
  )
}

function indiaParallax() {
  qa<HTMLElement>("[data-parallax] [data-speed]").forEach((el) =>
    gsap.to(el, {
      yPercent: (parseFloat(el.dataset.speed ?? "1") - 1) * -80,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("[data-parallax]") as Element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  )
}

/** Markets scroll sideways while the section is pinned. */
function marketsStrip() {
  const track = q("#mkTrack")
  if (!track) return

  gsap.matchMedia().add("(min-width: 900px)", () => {
    const dist = () => track.scrollWidth - window.innerWidth
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: ".markets",
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (s) => gsap.set("#mkBar", { scaleX: s.progress }),
      },
    })

    qa(".mk-card img").forEach((img) =>
      gsap.fromTo(
        img,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".mk-card") as Element,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        }
      )
    )

    gsap.from(".mk-card", {
      y: 80,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".markets", start: "top 70%" },
    })
  })
}

function whoStack() {
  qa<HTMLElement>(".who-stack [data-speed]").forEach((el) =>
    gsap.to(el, {
      y: () => (1 - parseFloat(el.dataset.speed ?? "1")) * -240,
      ease: "none",
      scrollTrigger: {
        trigger: ".who",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  )
  gsap.from(".who-stack > *", {
    y: 60,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: { trigger: ".who-stack", start: "top 80%" },
  })
}

/** Service cards stack and dim as the next one arrives. */
function servicesStack() {
  const cards = qa(".svc-card")
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return
    gsap.fromTo(
      card,
      { "--dim": 0 },
      {
        "--dim": 0.35,
        scale: 0.94,
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top bottom-=40",
          end: "top top+=110",
          scrub: true,
        },
      }
    )
  })
  gsap.from(cards, {
    y: 80,
    autoAlpha: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: "#svcStack", start: "top 85%" },
  })
}

/** Process rail fills and a spark travels along it. */
function processRail() {
  const steps = qa(".step")
  const fill = q("#railFill")
  const dot = q("#railDot")
  if (!steps.length || !fill || !dot) return

  gsap
    .matchMedia()
    .add({ desk: "(min-width: 800px)", mob: "(max-width: 799px)" }, (ctx) => {
      const desk = Boolean(ctx.conditions?.desk)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#proc",
          start: "top 72%",
          end: "bottom 55%",
          scrub: 0.6,
          onUpdate: (s) =>
            steps.forEach((st, i) =>
              st.classList.toggle("is-on", s.progress * 4 >= i + 0.28)
            ),
        },
      })
      tl.to(
        fill,
        {
          ...(desk ? { scaleX: 1 } : { scaleY: 1 }),
          ease: "none",
          duration: 4,
        },
        0
      )
      tl.to(
        dot,
        {
          ...(desk ? { left: "100%" } : { top: "100%" }),
          ease: "none",
          duration: 4,
        },
        0
      )
      steps.forEach((st, i) =>
        tl.from(
          st.querySelector(".step-card"),
          { y: 34, autoAlpha: 0, duration: 0.9, ease: "power2.out" },
          i + 0.1
        )
      )
    })
}

function whyRows() {
  gsap.set(".why-row", { y: 10, autoAlpha: 0 })
  ScrollTrigger.batch(".why-row", {
    start: "top 90%",
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.05,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      }),
  })
}
