"use client"

import { useEffect, useRef, useState } from "react"

import { ArrowIcon, CameraIcon, PinIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { EVENTS, type EventRole } from "@/content/events"
import type { EventItem } from "@/lib/content-api"
import { cx } from "@/lib/cx"
import { dateStamp } from "@/lib/event-dates"

/**
 * The events page's filter bar, featured event and archive.
 *
 * Like the blog, they share one piece of state (the selected role), so they
 * render from one component. Filtering hides cards rather than unmounting
 * them, which keeps the scroll triggers the motion layer created pointing at
 * live nodes; a year with nothing left to show hides with them.
 */
type Filter = EventRole | "all"

const where = (event: EventItem) =>
  [event.venue, event.city].filter(Boolean).join(", ")

export function EventCard({
  event,
  hidden = false,
}: {
  event: EventItem
  hidden?: boolean
}) {
  const stamp = dateStamp(event.isoDate)
  const media = EVENTS.mediaCount(event.photoCount, event.videoCount)

  return (
    <SmartLink
      className={cx("ev-card", hidden && "is-hidden")}
      href={event.href}
    >
      <div className="ev-ph">
        {event.image ? <img src={event.image} alt={event.imageAlt} /> : null}
        <span className="ev-stamp">
          <b>{stamp.day}</b>
          <small>{stamp.rest}</small>
        </span>
        <span
          className={cx("ev-role", event.role === "Organised" && "is-host")}
        >
          {EVENTS.roleTag[event.role]}
        </span>
      </div>
      <div className="ev-tx">
        <div className="ev-tags">
          {event.format ? <span>{event.format}</span> : null}
          {event.market ? <span>{event.market}</span> : null}
        </div>
        <h3>{event.title}</h3>
        <p>{event.summary}</p>
        <div className="ev-meta">
          <span>
            <PinIcon /> {event.city || "–"}
          </span>
          {media ? (
            <span>
              <CameraIcon /> {media}
            </span>
          ) : null}
        </div>
      </div>
    </SmartLink>
  )
}

/**
 * The latest event, full-bleed: its cover behind the title, and a strip of
 * three frames from its gallery so the page opens on the photos.
 */
function FeaturedEvent({
  event,
  hidden,
}: {
  event: EventItem
  hidden: boolean
}) {
  const frames = event.gallery
    .filter((item) => item.kind === "image")
    .slice(0, 3)
  const media = EVENTS.mediaCount(event.photoCount, event.videoCount)

  return (
    <SmartLink
      className={cx("ev-feat-card", hidden && "is-hidden")}
      href={event.href}
    >
      {event.image ? (
        <img className="bg" src={event.image} alt={event.imageAlt} />
      ) : null}
      <div className="ev-feat-tx">
        <div className="ev-feat-kick">
          <span className="ev-live">{EVENTS.featuredTag}</span>
          <span>{EVENTS.roleTag[event.role]}</span>
        </div>
        <h3>{event.title}</h3>
        <p>{event.summary}</p>
        <div className="ev-feat-meta">
          <span>
            <time dateTime={event.isoDate}>{event.date}</time>
          </span>
          <span>
            <PinIcon /> {where(event) || "–"}
          </span>
          {media ? (
            <span>
              <CameraIcon /> {media}
            </span>
          ) : null}
        </div>
      </div>
      {frames.length ? (
        <div className="ev-feat-frames" aria-hidden="true">
          {frames.map((frame) => (
            <img src={frame.src} alt="" key={frame.src} />
          ))}
        </div>
      ) : null}
      <span className="ev-feat-go" aria-hidden="true">
        <ArrowIcon />
      </span>
    </SmartLink>
  )
}

export function EventsBrowser({ events }: { events: EventItem[] }) {
  const [active, setActive] = useState<Filter>("all")
  const barRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null
  )

  const [featured, ...rest] = events
  const matches = (event: EventItem) =>
    active === "all" || event.role === active
  const shown = events.filter(matches).length

  // Same measured pill as the blog's bar: in place before GSAP has loaded.
  useEffect(() => {
    const place = () => {
      const current = barRef.current?.querySelector<HTMLElement>(
        '[aria-pressed="true"]'
      )
      if (current) {
        setIndicator({ x: current.offsetLeft, w: current.offsetWidth })
      }
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [active])

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: EVENTS.filter.all, count: events.length },
    ...EVENTS.roles.map((role) => ({
      id: role as Filter,
      label: EVENTS.filter.labels[role],
      count: events.filter((event) => event.role === role).length,
    })),
  ]

  // The archive, newest year first. Events arrive sorted by date already.
  const years: { year: string; events: EventItem[] }[] = []
  for (const event of rest) {
    const year = event.isoDate.slice(0, 4) || "–"
    const last = years[years.length - 1]
    if (last?.year === year) last.events.push(event)
    else years.push({ year, events: [event] })
  }

  // Wrapped so the sticky bar lets go once the archive has scrolled past,
  // rather than riding over the dark bands below it.
  return (
    <div className="ev-browse">
      <div className="spy bl-bar" id="spy">
        <div className="wrap" ref={barRef}>
          <i
            className="ind"
            style={
              indicator
                ? {
                    transform: `translateX(${indicator.x}px)`,
                    width: indicator.w,
                    opacity: 1,
                  }
                : undefined
            }
          />
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              aria-pressed={active === tab.id}
              onClick={() => setActive(tab.id)}
            >
              <b>{String(tab.count).padStart(2, "0")}</b>
              {tab.label}
            </button>
          ))}
          <span className="cnt">{EVENTS.filter.count(shown)}</span>
        </div>
      </div>

      <section className="ev-archive" id="events" data-surface="light">
        <div className="wrap">
          {featured ? (
            <FeaturedEvent event={featured} hidden={!matches(featured)} />
          ) : null}

          {years.length ? (
            <div className="ev-archive-head">
              <p className="eyebrow">{EVENTS.archive.eyebrow}</p>
              <h2 className="h3">{EVENTS.archive.headline}</h2>
            </div>
          ) : null}

          {years.map((group) => (
            <div
              className={cx(
                "ev-year",
                !group.events.some(matches) && "is-hidden"
              )}
              key={group.year}
            >
              <div className="ev-year-lbl" aria-hidden="true">
                {group.year}
              </div>
              <div className="ev-grid">
                {group.events.map((event) => (
                  <EventCard
                    event={event}
                    hidden={!matches(event)}
                    key={event.id}
                  />
                ))}
              </div>
            </div>
          ))}

          {events.length === 0 ? (
            <div className="bl-empty">{EVENTS.filter.none}</div>
          ) : shown === 0 ? (
            <div className="bl-empty">
              {EVENTS.filter.empty}
              <button
                type="button"
                className="link"
                onClick={() => setActive("all")}
              >
                {EVENTS.filter.reset} <ArrowIcon />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
