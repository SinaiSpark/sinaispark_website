import type { Handoff } from "@/lib/assistant/protocol"

/**
 * Carries what a visitor told the assistant over to the contact form, so
 * going there from the chat never means typing it all again.
 *
 * It travels in this tab's sessionStorage, never the URL: names, emails and
 * phone numbers stay out of links, browser history and server logs. The chat
 * session id goes with it, so the form's submission updates the chat's
 * enquiry instead of adding a second lead.
 */
const KEY = "ss:assistant-handoff"

/** Fired on window when the chat sends the visitor to the form. */
export const HANDOFF_EVENT = "assistant:handoff"

export function saveHandoff(handoff: Handoff) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(handoff))
  } catch {
    // Storage blocked: the form simply starts empty.
  }
}

export function readHandoff(): Handoff | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    const handoff = raw ? (JSON.parse(raw) as Handoff) : null
    return handoff?.session ? handoff : null
  } catch {
    return null
  }
}

/** Tells a form already on screen to pick up the latest details. */
export function announceHandoff() {
  window.dispatchEvent(new Event(HANDOFF_EVENT))
}
