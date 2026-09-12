"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { FINDER } from "@/content/licence-finder"
import { ROUTES } from "@/content/site"

/**
 * Licence finder.
 *
 * Cycles through the options on its own while it is on screen and untouched,
 * so the section demonstrates itself; the first click hands control to the
 * visitor and the cycling stops for good. Hovering pauses it.
 *
 * `variant` decides where the answer's button goes: on the home page it books a
 * consultation, on the licences page it jumps to that licence's section.
 */
export function LicenceFinder({
  variant = "home",
  className = "",
  style,
}: {
  variant?: "home" | "licences"
  className?: string
  /** The licences hub tints the section so it separates from the hero above. */
  style?: React.CSSProperties
}) {
  const [index, setIndex] = useState(0)
  const [switching, setSwitching] = useState(false)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const swapTimer = useRef<number | undefined>(undefined)

  // Respect a reduced-motion preference by never auto-cycling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setAuto(false)
  }, [])

  const select = useCallback((next: number) => {
    setSwitching(true)
    window.clearTimeout(swapTimer.current)
    swapTimer.current = window.setTimeout(() => {
      setIndex(next)
      setSwitching(false)
    }, 180)
  }, [])

  // Only run while the panel is actually in view.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      {
        threshold: 0.35,
      }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // One timer per visible option rather than a single interval, so the progress
  // bar restarts cleanly and the timing survives a pause.
  const running = auto && visible && !paused
  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(
      () => select((index + 1) % FINDER.options.length),
      FINDER.dwell
    )
    return () => window.clearTimeout(id)
  }, [running, index, select])

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  const current = (FINDER.options[index] ?? FINDER.options[0])!
  const isIndia = current.id === "india"

  const cta = (() => {
    if (variant === "licences") {
      return {
        label: isIndia ? FINDER.indiaReadCta : FINDER.readCta,
        href: isIndia
          ? ROUTES.india
          : `#${current.href.split("/").filter(Boolean).pop()}`,
      }
    }
    return isIndia ? FINDER.indiaCta : FINDER.cta
  })()

  return (
    <section
      className={`finder ${className}`.trim()}
      id="finder"
      data-surface="light"
      style={style}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="finder-lead">
          <p className="eyebrow" data-reveal>
            {FINDER.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={FINDER.headline} />
          <p className="lede muted" data-reveal>
            {FINDER.lede}
          </p>
          <div
            className="chips"
            id="chips"
            role="group"
            aria-label={FINDER.chipsLabel}
            data-reveal
          >
            {FINDER.options.map((option, i) => (
              <button
                className={`chip${running && i === index ? "is-auto" : ""}`}
                type="button"
                key={option.id}
                aria-pressed={i === index}
                style={
                  { "--dwell": `${FINDER.dwell}ms` } as React.CSSProperties
                }
                onClick={() => {
                  setAuto(false)
                  if (i !== index) select(i)
                }}
              >
                {option.chip}
                <span className="dot" />
              </button>
            ))}
          </div>
        </div>

        <div className="finder-panel" data-reveal ref={panelRef}>
          <div
            className={`finder-body${switching ? "is-switching" : ""}`}
            id="finderBody"
          >
            <span className="finder-k">{current.kicker}</span>
            <h3 className="finder-name">{current.name}</h3>
            <p className="finder-tag">{current.tagline}</p>
            <ol className="finder-steps">
              {current.steps.map((step, i) => (
                <li key={step}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {step}
                </li>
              ))}
            </ol>
            <div className="finder-foot">
              <SmartLink className="btn" href={cta.href} data-magnetic>
                {cta.label} <ButtonArrow />
              </SmartLink>
              <small>{FINDER.footnote}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
