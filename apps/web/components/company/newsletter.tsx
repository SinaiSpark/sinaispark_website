"use client"

import { useState } from "react"

import { ButtonArrow, CheckIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { NEWSLETTER } from "@/content/newsletter"

/**
 * Email capture, shared by the blog and the research page.
 *
 * FRONTEND ONLY: nothing is sent or stored — a valid address just swaps the
 * field for the confirmation line, and the copy under it says so. The provider
 * is still to be chosen.
 */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function Newsletter({
  eyebrow,
  headline,
  lede,
  picks,
}: {
  eyebrow: string
  headline: string
  lede: string
  /** What subscribing actually gets you, numbered down the left. */
  picks: readonly string[]
}) {
  const [email, setEmail] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAIL.test(email)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setDone(true)
  }

  return (
    <section
      className="nl-band"
      id="newsletter"
      data-surface="dark"
      data-spy-section=""
    >
      <div className="wrap">
        <div>
          <p className="eyebrow" data-reveal>
            {eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={headline} />
          <p className="lede muted" data-reveal>
            {lede}
          </p>
          <ul className="nl-picks" data-reveal>
            {picks.map((pick, i) => (
              <li key={pick}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                {pick}
              </li>
            ))}
          </ul>
        </div>

        <form className="nl-form" noValidate onSubmit={onSubmit} data-reveal>
          {done ? (
            <p className="done">
              <i>
                <CheckIcon />
              </i>
              {NEWSLETTER.done}
            </p>
          ) : (
            <>
              <div className="row">
                <label className="sr-only" htmlFor="nl-email">
                  {NEWSLETTER.emailLabel}
                </label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={NEWSLETTER.placeholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setInvalid(false)
                  }}
                  aria-invalid={invalid || undefined}
                  style={invalid ? { borderColor: "#D0473C" } : undefined}
                />
                <button className="btn" type="submit">
                  {NEWSLETTER.submit} <ButtonArrow />
                </button>
              </div>
              <small>{NEWSLETTER.disclaimer}</small>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
