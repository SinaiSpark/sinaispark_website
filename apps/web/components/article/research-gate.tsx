"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { ButtonArrow, LockIcon } from "@/components/ui/icons"
import { RESEARCH } from "@/content/research"

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * The email gate under a gated article's preview. The rest of the article is
 * never sent to the browser until this succeeds: /api/subscribe sets the
 * signed reader cookie, and the refresh re-renders the page on the server
 * with the full text.
 */
export function ResearchGate({ articleId }: { articleId: string }) {
  const copy = RESEARCH.gate
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [newsletter, setNewsletter] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setFailure("")
    setBusy(true)
    try {
      const res = await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          newsletter,
          source: "Research gate",
          research: articleId,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setFailure(body.error ?? copy.failure)
        setBusy(false)
        return
      }
      router.refresh()
    } catch {
      setFailure(copy.failure)
      setBusy(false)
    }
  }

  return (
    <aside className="ar-gate" aria-labelledby="ar-gate-title">
      <p className="eyebrow">
        <LockIcon /> {copy.eyebrow}
      </p>
      <h2 id="ar-gate-title">{copy.headline}</h2>
      <p>{copy.body}</p>

      <form noValidate onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="ar-gate-email">
          {copy.emailLabel}
        </label>
        <div className="row">
          <input
            id="ar-gate-email"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setInvalid(false)
            }}
            aria-invalid={invalid || undefined}
          />
          <button className="btn" type="submit" disabled={busy}>
            {copy.submit} <ButtonArrow />
          </button>
        </div>
        <label className="opt">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          {copy.newsletter}
        </label>
        <small role={failure ? "alert" : undefined}>
          {failure || copy.disclaimer}
        </small>
      </form>
    </aside>
  )
}
