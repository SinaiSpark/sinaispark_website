"use client"

import { useEffect, useState } from "react"

import { Clock } from "@/components/ui/clock"
import {
  ArrowIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { CONTACT, type Desk } from "@/content/contact"
import { cx } from "@/lib/cx"

/**
 * Contact page sections: the live desk card in the hero, the direct lines, and
 * the offices band. The consultation form itself is the shared ConsultForm.
 */

/** Short weekday names as en-GB formats them, indexed the way Date does. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/**
 * Whether a desk is inside its own working hours right now.
 *
 * Every desk keeps its local week — Saudi Arabia and Bahrain run Sunday to
 * Thursday — so the answer is read from that desk's time zone rather than the
 * visitor's. Returns null until the first client tick, so the server and the
 * first client render agree.
 */
function useOpenNow(desk: Desk) {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const read = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: desk.timeZone,
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).formatToParts(new Date())
        const find = (type: Intl.DateTimeFormatPartTypes) =>
          parts.find((part) => part.type === type)?.value ?? ""

        const day = WEEKDAYS.indexOf(find("weekday"))
        const hour = Number(find("hour"))
        const minute = Number(find("minute"))
        if (day < 0 || Number.isNaN(hour) || Number.isNaN(minute)) return null

        const time = hour + minute / 60
        return (
          desk.days.includes(day) &&
          time >= desk.opensAt &&
          time < desk.closesAt
        )
      } catch {
        return null
      }
    }

    setOpen(read())
    const id = window.setInterval(() => setOpen(read()), 60000)
    return () => window.clearInterval(id)
  }, [desk])

  return open
}

function DeskRow({ desk }: { desk: Desk }) {
  const open = useOpenNow(desk)
  const copy = CONTACT.desks

  return (
    <li>
      <div>
        <b>{desk.city}</b>
        <small>{desk.hours}</small>
      </div>
      <Clock as="time" timeZone={desk.timeZone} />
      <span
        className={cx("st", open && "is-open")}
        suppressHydrationWarning
        aria-live="off"
      >
        {open === null ? copy.pending : open ? copy.open : copy.closed}
      </span>
    </li>
  )
}

/** The glass card in the hero: five desks, live clocks, open or closed. */
export function DeskCard() {
  const copy = CONTACT.desks

  return (
    <aside className="phero-side ct-card">
      <div className="hd">
        <span>
          <i />
          {copy.label}
        </span>
        <span>{copy.count}</span>
      </div>
      <ul className="ct-clocks">
        {copy.items.map((desk) => (
          <DeskRow desk={desk} key={desk.city} />
        ))}
      </ul>
      <p className="ft">{copy.reply}</p>
    </aside>
  )
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: <LinkedInIcon />,
  Instagram: <InstagramIcon />,
  YouTube: <YouTubeIcon />,
}

/** Email, phone, WhatsApp and the social handles, set at headline size. */
export function DirectLines() {
  const copy = CONTACT.direct

  return (
    <section
      className="ct-lines"
      id="direct"
      data-surface="light"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
          <span className="mock" data-reveal>
            {copy.note}
          </span>
        </div>

        <ul className="ct-line-list">
          {[copy.email, copy.phone, copy.whatsapp].map((line) => {
            const external = line.href.startsWith("http")
            return (
              <li key={line.kicker}>
                <a
                  className={cx(
                    "ct-line",
                    line.kicker === "WhatsApp" && "is-wa"
                  )}
                  href={line.href}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  <span className="k">
                    {line.kicker}
                    <small>{line.note}</small>
                  </span>
                  <span className="v">
                    {line.value}
                    {"pending" in line && line.pending ? (
                      <span className="pend">{copy.pendingLabel}</span>
                    ) : null}
                  </span>
                  <span className="go">
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            )
          })}

          <li>
            <div className="ct-line">
              <span className="k">
                {copy.social.kicker}
                <small>{copy.social.note}</small>
              </span>
              <div className="ct-social">
                {copy.social.links.map((social) => (
                  <a
                    href={social.href}
                    key={social.label}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {SOCIAL_ICONS[social.label]}
                    {social.label}
                  </a>
                ))}
              </div>
              <span />
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

/** Three Saudi offices as photo tiles, then the four desks abroad. */
export function Offices() {
  const copy = CONTACT.offices

  return (
    <section
      className="dwhere ct-off"
      id="offices"
      data-surface="dark"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
          <span className="mock" data-reveal>
            {copy.note}
          </span>
        </div>

        <div className="reg-row">
          {copy.items.map((office) => (
            <SmartLink className="region" href="#form" key={office.name}>
              <img src={office.image} alt="" />
              <span className="tz">
                <i />
                <Clock as="span" timeZone={office.timeZone} />
              </span>
              <div className="in">
                <span className="k">{office.kicker}</span>
                <h3>{office.name}</h3>
                <p>{office.body}</p>
                <span className="addr">{office.address}</span>
              </div>
            </SmartLink>
          ))}
        </div>

        <ul className="ct-remote">
          {copy.remote.map((desk) => (
            <li key={desk.city}>
              <div>
                <b>{desk.city}</b>
                <small>{desk.market}</small>
              </div>
              <Clock as="time" timeZone={desk.timeZone} />
            </li>
          ))}
        </ul>

        <p className="ct-hours">
          <b>{copy.hoursLabel}</b>
          <span>{copy.hoursNote}</span>
        </p>
      </div>
    </section>
  )
}
