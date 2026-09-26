"use client"

import { useEffect, useRef, useState } from "react"

import { ChevronIcon } from "@/components/ui/icons"
import { cx } from "@/lib/cx"

/**
 * The team cards' container. Up to four members sit in the design's grid;
 * beyond that the row scrolls sideways (snapping card by card) and gains
 * previous/next buttons for mouse users. Touch and trackpads scroll it
 * directly.
 */
export function TeamRail({
  scroll,
  children,
}: {
  scroll: boolean
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = ref.current
    if (!scroll || !el) return
    const read = () =>
      setEdge({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      })
    read()
    el.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)
    return () => {
      el.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [scroll])

  /** One card's width plus the gap, so each click lands on a card edge. */
  const step = (direction: 1 | -1) => {
    const el = ref.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    })
  }

  return (
    <>
      <div
        ref={ref}
        className={cx("team-grid", scroll && "is-scroll")}
        {...(scroll
          ? { role: "region", "aria-label": "Team members", tabIndex: 0 }
          : {})}
      >
        {children}
      </div>
      {scroll ? (
        <div className="team-ctrl">
          <button
            type="button"
            className="team-arrow is-prev"
            aria-label="Previous team members"
            disabled={edge.start}
            onClick={() => step(-1)}
          >
            <ChevronIcon />
          </button>
          <button
            type="button"
            className="team-arrow"
            aria-label="More team members"
            disabled={edge.end}
            onClick={() => step(1)}
          >
            <ChevronIcon />
          </button>
        </div>
      ) : null}
    </>
  )
}
