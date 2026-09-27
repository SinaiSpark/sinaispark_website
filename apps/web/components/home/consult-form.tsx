"use client"

import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js"
import { useEffect, useRef, useState } from "react"

import { Clock } from "@/components/ui/clock"
import { ButtonArrow, TickIcon } from "@/components/ui/icons"
import {
  PhoneField,
  phoneIsValid,
  type PhoneValue,
} from "@/components/ui/phone-field"
import { SplitText } from "@/components/ui/split-text"
import { CONSULT } from "@/content/home"
import {
  endAssistantSession,
  HANDOFF_EVENT,
  readHandoff,
} from "@/lib/assistant/handoff"
import { cx } from "@/lib/cx"
import {
  prefillFor,
  prefillFromQuery,
  previousPath,
} from "@/lib/enquiry-source"

/**
 * Consultation request form. Posts to /api/enquiry, which emails the team and
 * stores the enquiry in the CMS.
 *
 * Choosing a market also switches the local-office readout beside the form
 * and the phone field's country (until the visitor picks one themselves).
 *
 * It lives on the contact page; every "book a consultation" button on the
 * site leads here. On arrival it preselects the service and market from the
 * page the visitor came from (or from ?service=&market=&plan= on the link),
 * and it sends that page along so the team sees where the enquiry started.
 *
 * A visitor who talked to the website assistant first finds what they told
 * it already filled in (lib/assistant/handoff.ts), and the submission joins
 * that conversation's enquiry instead of creating a second one.
 */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** The phone country each market starts with. */
const MARKET_COUNTRY: Record<string, CountryCode> = {
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  India: "IN",
  "United Kingdom": "GB",
  Bahrain: "BH",
}

export function ConsultForm({
  id = "consult",
  className,
  headline = CONSULT.headline,
  spy = false,
}: {
  id?: string
  className?: string
  headline?: string
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
} = {}) {
  const [marketIndex, setMarketIndex] = useState(0)
  const [service, setService] = useState<string>(CONSULT.services[0])
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState<PhoneValue>({ country: "SA", number: "" })
  const [phoneCountryPicked, setPhoneCountryPicked] = useState(false)
  const [from, setFrom] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [failure, setFailure] = useState("")
  const [chat, setChat] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const market = (CONSULT.markets[marketIndex] ?? CONSULT.markets[0])!

  const chooseMarket = (index: number) => {
    setMarketIndex(index)
    const country = MARKET_COUNTRY[CONSULT.markets[index]?.label ?? ""]
    if (country && !phoneCountryPicked) setPhone((p) => ({ ...p, country }))
  }

  // Preselect from the link and the page the visitor came from.
  useEffect(() => {
    const came = previousPath(window.location.pathname)
    const fromPage = prefillFor(came)
    const fromLink = prefillFromQuery(window.location.search)
    setFrom(came)
    const pickedMarket = fromLink.market ?? fromPage.market
    const pickedService = fromLink.service ?? fromPage.service
    if (pickedMarket) {
      const index = CONSULT.markets.findIndex((m) => m.label === pickedMarket)
      if (index >= 0) {
        setMarketIndex(index)
        const country = MARKET_COUNTRY[pickedMarket]
        if (country) setPhone((p) => ({ ...p, country }))
      }
    }
    if (pickedService) setService(pickedService)
    if (fromLink.plan) {
      setMessage(`I'm interested in the ${fromLink.plan} package.`)
    }
  }, [])

  // What the visitor already told the assistant: on arrival, and again if
  // the chat sends them here while the form is already on screen.
  useEffect(() => {
    const apply = () => {
      const handoff = readHandoff()
      if (!handoff) return
      setChat(handoff.session)
      const fill = (input: HTMLInputElement | null, value?: string) => {
        if (input && value && !input.value.trim()) input.value = value
      }
      fill(nameRef.current, handoff.name)
      fill(emailRef.current, handoff.email)
      if (handoff.phone) {
        const parsed = parsePhoneNumberFromString(handoff.phone)
        if (parsed?.country) {
          setPhone((p) =>
            p.number
              ? p
              : { country: parsed.country!, number: parsed.formatNational() }
          )
          setPhoneCountryPicked(true)
        }
      }
      if (handoff.market) {
        const index = CONSULT.markets.findIndex(
          (m) => m.label === handoff.market
        )
        if (index >= 0) setMarketIndex(index)
      }
      const service = CONSULT.services.find((s) => s === handoff.service)
      if (service) setService(service)
      if (handoff.message) setMessage((m) => m || handoff.message!)
    }
    apply()
    window.addEventListener(HANDOFF_EVENT, apply)
    return () => window.removeEventListener(HANDOFF_EVENT, apply)
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >
    const name = (data.name ?? "").trim()
    const email = (data.email ?? "").trim()

    const next = {
      name: !name,
      email: !email || !EMAIL.test(email),
      phone: !phoneIsValid(phone),
    }
    setErrors(next)
    setFailure("")
    if (next.name || next.email || next.phone) {
      form
        .querySelector<HTMLInputElement>(
          next.name ? "#f-name" : next.email ? "#f-email" : "#f-phone"
        )
        ?.focus()
      if (next.phone && !next.name && !next.email) {
        setFailure(
          "That phone number doesn't look right for the country chosen."
        )
      }
      return
    }

    setBusy(true)
    try {
      const res = await fetch("/api/enquiry/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // The page before this one; the server turns it into a label.
        body: JSON.stringify({ ...data, from, chat }),
      })
      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        fields?: string[]
      }
      if (!res.ok) {
        setErrors(Object.fromEntries((body.fields ?? []).map((f) => [f, true])))
        setFailure(body.error ?? CONSULT.failure)
        return
      }
      setDone(true)
      // Sent from a chat handoff: the chat is finished, forget it.
      if (chat) endAssistantSession()
    } catch {
      setFailure(CONSULT.failure)
    } finally {
      setBusy(false)
    }
  }

  const invalid = (key: string) =>
    errors[key] ? { style: { borderColor: "#D0473C" } } : {}

  return (
    <section
      className={cx("consult", className)}
      id={id}
      data-surface="light"
      data-spy-section={spy ? "" : undefined}
    >
      <div className="wrap">
        <div className="consult-lead">
          <p className="eyebrow" data-reveal>
            {CONSULT.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={headline} />
          <p className="lede muted" data-reveal>
            {CONSULT.lede}
          </p>
          <ol className="next" data-reveal>
            {CONSULT.steps.map((step, i) => (
              <li key={step}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                {step}
              </li>
            ))}
          </ol>
          <div className="office" data-reveal>
            <div>
              <span className="k">{CONSULT.officeLabel}</span>
              <b id="officeName">{market.office}</b>
            </div>
            <time id="officeTime">
              <Clock as="span" timeZone={market.timeZone} />
              <small>{CONSULT.localTimeLabel}</small>
            </time>
          </div>
        </div>

        <form
          className={cx("form", done && "is-done")}
          id="consult-form"
          noValidate
          data-pending="backend"
          onSubmit={onSubmit}
        >
          <div className="row">
            <div className="field">
              <label htmlFor="f-name">{CONSULT.fields.name.label}</label>
              <input
                ref={nameRef}
                id="f-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={CONSULT.fields.name.placeholder}
                {...invalid("name")}
              />
            </div>
            <div className="field">
              <label htmlFor="f-email">{CONSULT.fields.email.label}</label>
              <input
                ref={emailRef}
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={CONSULT.fields.email.placeholder}
                {...invalid("email")}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="f-phone">{CONSULT.fields.phone.label}</label>
              <PhoneField
                id="f-phone"
                name="phone"
                value={phone}
                invalid={errors.phone}
                onChange={(value, picked) => {
                  setPhone(value)
                  if (picked) setPhoneCountryPicked(true)
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="f-market">{CONSULT.fields.market.label}</label>
              <select
                id="f-market"
                name="market"
                value={market.label}
                onChange={(e) =>
                  chooseMarket(
                    CONSULT.markets.findIndex((m) => m.label === e.target.value)
                  )
                }
              >
                {CONSULT.markets.map((m) => (
                  <option value={m.label} key={m.label}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-service">{CONSULT.fields.service.label}</label>
            <select
              id="f-service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {CONSULT.services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="f-msg">{CONSULT.fields.message.label}</label>
            <textarea
              id="f-msg"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={CONSULT.fields.message.placeholder}
            />
          </div>

          {/* Honeypot: invisible to people, filled in by bots. */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />

          {failure ? (
            <p className="form-error" role="alert">
              {failure}
            </p>
          ) : null}

          <div className="form-foot">
            <button
              className={cx("btn", busy && "is-busy")}
              type="submit"
              id="submit"
              disabled={busy}
            >
              <span className="btn-in">
                {CONSULT.submit} <ButtonArrow />
              </span>
            </button>
            <small>{CONSULT.disclaimer}</small>
          </div>

          <div className="form-done" aria-live="polite">
            <div>
              <div className="tick">
                <TickIcon />
              </div>
              <h3>{CONSULT.done.title}</h3>
              <p>{CONSULT.done.body}</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
