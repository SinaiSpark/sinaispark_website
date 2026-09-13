"use client"

import { useState } from "react"

import { Clock } from "@/components/ui/clock"
import { ButtonArrow, TickIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { CONSULT } from "@/content/home"
import { cx } from "@/lib/cx"

/**
 * Consultation request form.
 *
 * FRONTEND ONLY: there is no backend yet, so a valid submission just shows the
 * confirmation panel after a short delay. Nothing is sent or stored, and the
 * form says so. The endpoint is specified in BACKEND_AND_AI_REQUIREMENTS.md.
 *
 * Choosing a market also switches the local-office readout beside the form.
 *
 * The home page carries it inline as `#consult`; the contact page makes it the
 * page's own first section, so the section id, class and headline are props.
 */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

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
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const market = (CONSULT.markets[marketIndex] ?? CONSULT.markets[0])!

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()

    const next = { name: !name, email: !email || !EMAIL.test(email) }
    setErrors(next)
    if (next.name || next.email) {
      const field = e.currentTarget.querySelector<HTMLInputElement>(
        next.name ? "#f-name" : "#f-email"
      )
      field?.focus()
      return
    }

    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setDone(true)
    }, 700)
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
              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={CONSULT.fields.phone.placeholder}
              />
            </div>
            <div className="field">
              <label htmlFor="f-market">{CONSULT.fields.market.label}</label>
              <select
                id="f-market"
                name="market"
                value={String(marketIndex)}
                onChange={(e) => setMarketIndex(Number(e.target.value))}
              >
                {CONSULT.markets.map((m, i) => (
                  <option value={String(i)} key={m.label}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-service">{CONSULT.fields.service.label}</label>
            <select id="f-service" name="service">
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
              placeholder={CONSULT.fields.message.placeholder}
            />
          </div>

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
