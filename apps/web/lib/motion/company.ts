import { initStoryStack, initTeamCards, initWhyRows } from "@/lib/motion/core"
import { gsap, isFinePointer, q, qa, ScrollTrigger } from "@/lib/motion/gsap"

/**
 * Motion for the four company and content pages: about, contact, blog and
 * research.
 *
 * Everything shared with the rest of the site — the hero intro, reveals, word
 * masks, the spy bar and the process track — is already running by the time
 * this is called from initInnerMotion. What is here is only what these four
 * pages added, and each block checks for its own markup first so one function
 * can serve all four routes.
 */
export function initCompanyMotion(signal: AbortSignal) {
  // About reuses three of the home page's set pieces.
  initStoryStack()
  initWhyRows()
  initTeamCards()

  valueTiles()
  deskCard()
  directLines()
  blogCards()
  reportCover(signal)
  reportCards()
}

/**
 * About: the three value tiles arrive in sequence, and the outlined numeral
 * behind each one drifts against the scroll so the row has depth.
 */
function valueTiles() {
  const tiles = qa(".ab-val")
  if (!tiles.length) return

  tiles.forEach((tile, i) =>
    gsap.from(tile, {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ab-val-grid", start: "top 85%" },
      clearProps: "transform",
    })
  )

  qa(".ab-val .gn").forEach((numeral) =>
    gsap.fromTo(
      numeral,
      { yPercent: 18 },
      {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".ab-val-grid",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    )
  )
}

/**
 * Contact: the five desks step into the hero card once the headline has
 * landed, then the card lifts and settles on a long loop so the live clocks
 * read as something running rather than a screenshot.
 */
function deskCard() {
  const card = q(".ct-card")
  if (!card) return

  gsap.from(".ct-clocks li", {
    y: 14,
    autoAlpha: 0,
    stagger: 0.07,
    duration: 0.6,
    ease: "power3.out",
    delay: 1.1,
  })

  gsap.to(card, {
    y: -10,
    duration: 3.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 2,
  })
}

/** Contact: the oversized direct lines, then the four desks abroad. */
function directLines() {
  qa(".ct-line").forEach((line) =>
    gsap.from(line, {
      y: 24,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: line, start: "top 90%" },
      clearProps: "transform",
    })
  )

  qa(".ct-remote li").forEach((desk, i) =>
    gsap.from(desk, {
      y: 18,
      autoAlpha: 0,
      duration: 0.6,
      delay: i * 0.06,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ct-remote", start: "top 90%" },
    })
  )
}

/**
 * Blog: the featured post, the grid and the filing-rhythm rows.
 *
 * The grid animates through `onEnter` rather than a pre-set hidden state,
 * because a card filtered out of view never enters — pre-hiding it would leave
 * it invisible when the visitor switches the filter back.
 */
function blogCards() {
  if (!q(".bl-post")) return

  gsap.from(".bl-post.is-feat", {
    y: 40,
    autoAlpha: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".bl-feat", start: "top 80%" },
    clearProps: "transform",
  })

  ScrollTrigger.batch("#blGrid .bl-post", {
    start: "top 90%",
    onEnter: (batch) =>
      gsap.from(batch, {
        y: 30,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
        clearProps: "transform",
      }),
  })

  qa(".bl-rhythm li").forEach((row, i) =>
    gsap.from(row, {
      x: -12,
      autoAlpha: 0,
      duration: 0.5,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: ".bl-rhythm", start: "top 80%" },
    })
  )
}

/** Research: the featured cover, held at an angle and tilting toward the pointer. */
function reportCover(signal: AbortSignal) {
  const cover = q(".rs-cover")
  const wrap = cover?.parentElement
  if (!cover || !wrap) return

  const RESTING = { rotateY: -14, rotateX: 4 }
  gsap.set(cover, RESTING)
  gsap.to(cover, {
    y: -12,
    duration: 3.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })

  if (!isFinePointer()) return

  wrap.addEventListener(
    "pointermove",
    (e) => {
      const r = wrap.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5
      const dy = (e.clientY - r.top) / r.height - 0.5
      gsap.to(cover, {
        rotateY: RESTING.rotateY + dx * 22,
        rotateX: RESTING.rotateX - dy * 16,
        duration: 0.6,
        ease: "power2.out",
      })
    },
    { signal }
  )
  wrap.addEventListener(
    "pointerleave",
    () => gsap.to(cover, { ...RESTING, duration: 0.9 }),
    { signal }
  )
}

/** Research: the library cards, the method steps and what is inside the report. */
function reportCards() {
  if (q("#rsGrid")) {
    ScrollTrigger.batch("#rsGrid .rs-card", {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.from(batch, {
          y: 30,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
          clearProps: "transform",
        }),
    })
  }

  qa(".rs-step").forEach((step, i) =>
    gsap.from(step, {
      y: 24,
      autoAlpha: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".rs-steps", start: "top 85%" },
      clearProps: "transform",
    })
  )

  qa(".rs-inside li").forEach((line, i) =>
    gsap.from(line, {
      x: -12,
      autoAlpha: 0,
      duration: 0.5,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: ".rs-inside", start: "top 85%" },
    })
  )
}
