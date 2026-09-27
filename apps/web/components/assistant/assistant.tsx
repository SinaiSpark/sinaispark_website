"use client"

import { BotMessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { MessageText } from "@/components/assistant/message-text"
import { BrandMark } from "@/components/ui/brand-mark"
import { PhoneField, type PhoneValue } from "@/components/ui/phone-field"
import { consultHref } from "@/content/site"
import {
  announceHandoff,
  RESET_EVENT,
  saveHandoff,
  SESSION_KEY,
} from "@/lib/assistant/handoff"
import type {
  BotMessage,
  ClientEvent,
  Handoff,
  InputKind,
  Message,
  ServerEvent,
} from "@/lib/assistant/protocol"
import { cx } from "@/lib/cx"
// Not part of the design export, so not in globals.css; imported here it
// also reloads in development (an @import-ed file isn't watched).
import "@/styles/8-assistant.css"
import type { CountryCode } from "libphonenumber-js"

/**
 * The website assistant: a round launcher at the bottom right and the chat
 * panel it opens. On the home page the launcher waits until the hero has
 * scrolled away; everywhere else it's there from the start.
 *
 * The conversation lives on the server (app/api/assistant); this keeps only
 * the session id, in localStorage, so a returning visitor picks up where
 * they left off and isn't asked for their details twice. Once the enquiry a
 * handoff led to is sent, that memory is cleared (lib/assistant/handoff.ts)
 * and the next open starts afresh.
 */

const PLACEHOLDER: Record<InputKind, string> = {
  text: "Type your question…",
  name: "Your name",
  email: "you@company.com",
  phone: "Phone number",
}

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function writeSession(id: string) {
  try {
    localStorage.setItem(SESSION_KEY, id)
  } catch {
    // Private mode: the chat still works, it just won't be remembered.
  }
}

/** Parses newline-delimited JSON as it streams in. */
async function* events(res: Response): AsyncGenerator<ServerEvent> {
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += value
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""
    for (const line of lines) if (line.trim()) yield JSON.parse(line)
  }
  if (buffer.trim()) yield JSON.parse(buffer)
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function Assistant({
  name,
  whatsapp,
  whatsappLabel,
}: {
  name: string
  /** wa.me link from the contact details, or null to hide the button. */
  whatsapp: string | null
  whatsappLabel: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [pastHero, setPastHero] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [streaming, setStreaming] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState<InputKind>("text")
  const [draft, setDraft] = useState("")
  const [phone, setPhone] = useState<PhoneValue>({ country: "SA", number: "" })
  const [handoff, setHandoff] = useState<Handoff | null>(null)

  const started = useRef(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Home: wait for the hero to scroll away. Elsewhere: always there.
  const onHome = pathname === "/"
  useEffect(() => {
    const hero = onHome ? document.querySelector(".hero") : null
    if (!hero) return
    // Reports the hero's current position straight away, then on each change.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setPastHero(
          entry.intersectionRatio < 0.2 && entry.boundingClientRect.top < 0
        )
      },
      { threshold: [0, 0.2, 0.5] }
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [onHome])
  const shown = !onHome || pastHero

  const send = useCallback(async (event: ClientEvent, echo?: string) => {
    if (echo) setMessages((m) => [...m, { role: "user", text: echo }])
    setBusy(true)
    try {
      const res = await fetch("/api/assistant/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          session: readSession(),
          page: window.location.pathname,
          event,
        }),
      })
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? "unavailable")
      }
      for await (const e of events(res)) {
        switch (e.type) {
          case "session":
            writeSession(e.id)
            break
          case "history":
            setMessages(e.messages)
            break
          case "message":
            setMessages((m) => [...m, e.message])
            break
          case "start":
            setStreaming("")
            break
          case "delta":
            setStreaming((s) => (s ?? "") + e.text)
            break
          case "end":
            setStreaming(null)
            setMessages((m) => [...m, e.message])
            break
          case "state":
            setInput(e.input)
            if (e.country)
              setPhone((p) =>
                p.number ? p : { ...p, country: e.country as CountryCode }
              )
            setHandoff(e.handoff)
            saveHandoff(e.handoff)
            break
          case "error":
            throw new Error(e.message)
        }
      }
    } catch (error) {
      setStreaming(null)
      const text =
        error instanceof Error && error.message !== "unavailable"
          ? error.message
          : "I can't connect right now. Please try again in a moment, or reach the team directly."
      setMessages((m) => [
        ...m,
        { role: "assistant", text, actions: ["consult", "whatsapp"] },
      ])
    } finally {
      setBusy(false)
    }
  }, [])

  // The handoff's enquiry was sent: drop the finished conversation, so the
  // next open greets the visitor again under a new session.
  useEffect(() => {
    const reset = () => {
      started.current = false
      setMessages([])
      setStreaming(null)
      setInput("text")
      setDraft("")
      setPhone({ country: "SA", number: "" })
      setHandoff(null)
    }
    window.addEventListener(RESET_EVENT, reset)
    return () => window.removeEventListener(RESET_EVENT, reset)
  }, [])

  // First open: the greeting, or the conversation so far.
  useEffect(() => {
    if (!open || started.current) return
    started.current = true
    void send({ type: "start" })
  }, [open, send])

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    log.scrollTo({
      top: log.scrollHeight,
      behavior: reducedMotion() ? "auto" : "smooth",
    })
  }, [messages, streaming, busy])

  // Focus the composer when the panel opens or the step changes.
  useEffect(() => {
    if (!open || busy) return
    const target =
      input === "phone"
        ? panelRef.current?.querySelector<HTMLInputElement>(
            ".sa-compose .phone input:not([type=hidden])"
          )
        : inputRef.current
    // Not on touch screens: the keyboard would cover the answer.
    if (window.matchMedia("(pointer: fine)").matches) target?.focus()
  }, [open, busy, input])

  // Escape closes; phones get a full-screen panel with the page locked.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    const small = window.matchMedia("(max-width: 560px)").matches
    if (small) document.documentElement.classList.add("sa-locked")

    // The on-screen keyboard shrinks the visual viewport, not the layout one.
    const vv = window.visualViewport
    const panel = panelRef.current
    const fit = () => {
      if (!vv || !panel || !small) return
      panel.style.height = `${vv.height}px`
      panel.style.top = `${vv.offsetTop}px`
    }
    fit()
    vv?.addEventListener("resize", fit)
    vv?.addEventListener("scroll", fit)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.classList.remove("sa-locked")
      vv?.removeEventListener("resize", fit)
      vv?.removeEventListener("scroll", fit)
      if (panel) {
        panel.style.height = ""
        panel.style.top = ""
      }
    }
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (input === "phone") {
      const number = phone.number.trim()
      if (!number) return
      void send({ type: "phone", country: phone.country, number }, number)
      return
    }
    const text = draft.trim()
    if (!text) return
    setDraft("")
    void send({ type: "text", text }, text)
  }

  const choose = (id: string, label: string) => {
    if (busy) return
    void send({ type: "topic", id, label }, label)
  }

  const toContactForm = () => {
    if (handoff) saveHandoff(handoff)
    announceHandoff()
    setOpen(false)
    router.push(
      consultHref({
        service: handoff?.service,
        market: handoff?.market,
      })
    )
  }

  const whatsappHref = (() => {
    if (!whatsapp) return null
    const question = handoff?.message
    const text = question
      ? `Hello Sinai Spark, I have a question: ${question}`
      : "Hello Sinai Spark, I have a question."
    return `${whatsapp}?text=${encodeURIComponent(text)}`
  })()

  const last = messages.length - 1

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={cx(
          "sa-launcher",
          (shown || open) && "is-shown",
          open && "is-open"
        )}
        aria-label={open ? `Close ${name}` : `Chat with ${name}`}
        aria-expanded={open}
        aria-controls="sa-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <BotMessageSquare className="sa-ico-bot" aria-hidden="true" />
        <svg className="sa-ico-close" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        ref={panelRef}
        id="sa-panel"
        className={cx("sa-panel", open && "is-open")}
        role="dialog"
        aria-label={name}
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sa-head">
          <span className="sa-avatar" aria-hidden="true">
            <BrandMark className="sa-mark" />
          </span>
          <div className="sa-who">
            <b>{name}</b>
            <small>
              <i aria-hidden="true" /> Sinai Spark Global
            </small>
          </div>
          <button
            type="button"
            className="sa-close"
            aria-label="Close chat"
            onClick={() => {
              setOpen(false)
              launcherRef.current?.focus()
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div
          className="sa-log"
          ref={logRef}
          role="log"
          aria-live="polite"
          data-lenis-prevent
        >
          {messages.map((message, i) =>
            message.role === "user" ? (
              <div className="sa-msg is-user" key={i}>
                <div className="sa-bubble">{message.text}</div>
              </div>
            ) : (
              <BotBubble
                key={i}
                message={message}
                latest={i === last && streaming === null}
                busy={busy}
                whatsapp={whatsappHref}
                whatsappLabel={whatsappLabel}
                onChoose={choose}
                onConsult={toContactForm}
                onNavigate={() => {
                  if (window.matchMedia("(max-width: 560px)").matches)
                    setOpen(false)
                }}
              />
            )
          )}
          {streaming !== null ? (
            <div className="sa-msg is-bot">
              <div className="sa-bubble">
                <MessageText text={streaming} />
                <span className="sa-caret" aria-hidden="true" />
              </div>
            </div>
          ) : busy ? (
            <div className="sa-msg is-bot" aria-label="Typing">
              <div className="sa-bubble sa-typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          ) : null}
        </div>

        <form className="sa-compose" onSubmit={submit}>
          {input === "phone" ? (
            <PhoneField
              id="sa-phone"
              name="phone"
              value={phone}
              onChange={(value) => setPhone(value)}
            />
          ) : (
            <input
              ref={inputRef}
              key={input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={PLACEHOLDER[input]}
              aria-label={PLACEHOLDER[input]}
              type={input === "email" ? "email" : "text"}
              inputMode={input === "email" ? "email" : "text"}
              autoComplete={
                input === "name" ? "name" : input === "email" ? "email" : "off"
              }
              enterKeyHint="send"
              maxLength={500}
            />
          )}
          <button
            type="submit"
            className="sa-send"
            aria-label="Send"
            disabled={
              busy || (input === "phone" ? !phone.number.trim() : !draft.trim())
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <p className="sa-note">
          Answers are general guidance; a specialist confirms the details. Your
          contact details only go to our team.
        </p>
      </div>
    </>
  )
}

function BotBubble({
  message,
  latest,
  busy,
  whatsapp,
  whatsappLabel,
  onChoose,
  onConsult,
  onNavigate,
}: {
  message: BotMessage
  /** Only the newest message keeps its options clickable. */
  latest: boolean
  busy: boolean
  whatsapp: string | null
  whatsappLabel: string
  onChoose: (id: string, label: string) => void
  onConsult: () => void
  /** Following a link: phones close the full-screen panel. */
  onNavigate: () => void
}) {
  const actions = message.actions ?? []
  return (
    <div className="sa-msg is-bot">
      <div className="sa-bubble">
        <MessageText text={message.text} />
        {message.link ? (
          <Link
            className="sa-link"
            href={message.link.href}
            onClick={onNavigate}
          >
            {message.link.label}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </Link>
        ) : null}
        {message.sources?.length ? (
          <p className="sa-sources">
            From:{" "}
            {message.sources.map((s, i) => (
              <span key={s.href}>
                {i ? " · " : ""}
                <Link href={s.href} onClick={onNavigate}>
                  {s.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>

      {latest && actions.length ? (
        <div className="sa-actions">
          {actions.includes("consult") ? (
            <button type="button" className="sa-cta" onClick={onConsult}>
              Book a free consultation
            </button>
          ) : null}
          {actions.includes("whatsapp") && whatsapp ? (
            <a
              className="sa-cta is-wa"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.6 12.6c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-2.9-.7-2.5-1-4-3.5-4.2-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z" />
              </svg>
              {whatsappLabel}
            </a>
          ) : null}
        </div>
      ) : null}

      {latest && message.options?.length ? (
        <div className="sa-options" role="group" aria-label="Suggested options">
          {message.options.map((option) => (
            <button
              type="button"
              key={option.id}
              className={cx(
                "sa-chip",
                (option.id === "menu" || option.id === "decline") && "is-quiet"
              )}
              disabled={busy}
              onClick={() => onChoose(option.id, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
