"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { INDIA } from "@/content/india"
import { INDIA_PAGE } from "@/content/india-page"
import { cx } from "@/lib/cx"

/**
 * "Choosing a structure" — the same chip-and-panel pattern as the licence
 * finder, applied to the four Indian company structures. It cycles while it is
 * on screen and untouched, pauses on hover, and stops once someone picks.
 */
export function StructurePicker() {
  const copy = INDIA_PAGE.structures
  const rows = INDIA.structures.rows

  const [index, setIndex] = useState(0)
  const [switching, setSwitching] = useState(false)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const swapTimer = useRef<number | undefined>(undefined)

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

  const running = auto && visible && !paused
  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(
      () => select((index + 1) % rows.length),
      copy.dwell
    )
    return () => window.clearTimeout(id)
  }, [running, index, rows.length, copy.dwell, select])

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  const current = (rows[index] ?? rows[0])!

  return (
    <section
      className="finder stx"
      id="structure"
      data-surface="light"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="finder-lead">
          <p className="eyebrow" data-reveal>
            {INDIA.structures.title}
          </p>
          <SplitText as="h2" className="h2" text={copy.headline} />
          <p className="lede muted" data-reveal>
            {copy.lede}
          </p>

          <div className="chips" id="schips" data-reveal>
            {rows.map((row, i) => (
              <button
                className={cx("chip", running && i === index && "is-auto")}
                type="button"
                key={row.structure}
                aria-pressed={i === index}
                style={{ "--dwell": `${copy.dwell}ms` } as React.CSSProperties}
                onClick={() => {
                  setAuto(false)
                  if (i !== index) select(i)
                }}
              >
                <span className="dot" />
                {row.structure}
                {row.popular ? (
                  <span className="pop">{copy.popularLabel}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="finder-panel" data-reveal ref={panelRef}>
          <div
            className={cx("finder-body", switching && "is-switching")}
            id="sbody"
          >
            <span className="finder-k">
              {current.popular ? copy.popularLabel : copy.kicker}
            </span>
            <h3 className="finder-name">{current.structure}</h3>
            <div className="grid2">
              <div>
                <b>{copy.bestForLabel}</b>
                <p>{current.bestFor}</p>
              </div>
              <div>
                <b>{copy.keyPointsLabel}</b>
                <p>{current.keyPoints}</p>
              </div>
            </div>
            <div className="finder-foot">
              <SmartLink
                className="btn"
                href={INDIA_PAGE.cta.primary.href}
                data-magnetic
              >
                {copy.ctaPrefix} {copy.short[index]} <ButtonArrow />
              </SmartLink>
              <small>{copy.footnote}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
