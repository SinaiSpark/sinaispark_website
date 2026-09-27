import { ArrowIcon, ButtonArrow, PinIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { EVENTS } from "@/content/events"
import type { EventItem } from "@/lib/content-api"
import { cx } from "@/lib/cx"
import { dateStamp } from "@/lib/event-dates"

/**
 * The two dark bands on the events page: what is coming up, and a moving
 * wall of photos from past events.
 */

/** Upcoming events, soonest first, each with a way to register. */
export function UpcomingEvents({ events }: { events: EventItem[] }) {
  if (!events.length) return null
  const copy = EVENTS.upcoming

  return (
    <section className="ev-next" id="upcoming" data-surface="dark">
      <div className="wrap">
        <div className="ev-next-head">
          <p className="eyebrow" data-reveal>
            {copy.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={copy.headline} />
        </div>

        <ol className="ev-next-list">
          {events.map((event) => {
            const stamp = dateStamp(event.isoDate)
            return (
              <li key={event.id}>
                <span className="ev-next-date">
                  <b>{stamp.day}</b>
                  <small>{stamp.rest}</small>
                </span>
                <div className="ev-next-tx">
                  <span
                    className={cx(
                      "ev-role",
                      event.role === "Organised" && "is-host"
                    )}
                  >
                    {EVENTS.roleTag[event.role]}
                  </span>
                  <h3>
                    <SmartLink href={event.href}>{event.title}</SmartLink>
                  </h3>
                  <p>
                    <PinIcon />{" "}
                    {[event.venue, event.city].filter(Boolean).join(", ")}
                    <span className="ev-next-when">{event.date}</span>
                  </p>
                </div>
                <div className="ev-next-go">
                  {event.registrationUrl ? (
                    <a
                      className="btn"
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-magnetic
                    >
                      {copy.register} <ButtonArrow />
                    </a>
                  ) : null}
                  <SmartLink className="link" href={event.href}>
                    {copy.details} <ArrowIcon />
                  </SmartLink>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/**
 * Two rows of photos from past galleries drifting in opposite directions.
 * Each row is rendered twice so the CSS loop joins without a gap; the copy
 * is hidden from assistive tech and out of the tab order.
 */
export function EventMoments({ events }: { events: EventItem[] }) {
  const frames = events.flatMap((event) =>
    event.gallery
      .filter((item) => item.kind === "image")
      .slice(0, 4)
      .map((item) => ({ ...item, href: event.href, title: event.title }))
  )
  if (frames.length < 6) return null

  const copy = EVENTS.moments
  const half = Math.ceil(frames.length / 2)
  const rows = [frames.slice(0, half), frames.slice(half)]

  return (
    <section className="ev-moments" data-surface="dark">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {copy.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={copy.headline} />
        <p className="lede" data-reveal>
          {copy.lede}
        </p>
      </div>

      <div className="ev-reel">
        {rows.map((row, r) => (
          <div className={cx("ev-reel-row", r === 1 && "is-rev")} key={r}>
            {[0, 1].map((copyIndex) => (
              <ul
                className="ev-reel-track"
                key={copyIndex}
                aria-hidden={copyIndex === 1 || undefined}
              >
                {row.map((frame, i) => (
                  <li key={`${frame.src}-${i}`}>
                    <SmartLink
                      href={frame.href}
                      tabIndex={copyIndex === 1 ? -1 : undefined}
                      aria-label={frame.title}
                    >
                      <img src={frame.src} alt={frame.alt} loading="lazy" />
                      <span>{frame.title}</span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
