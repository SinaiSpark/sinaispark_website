/**
 * What the chat widget and /api/assistant/ send each other. Types only, so
 * the widget can import it without pulling server code into the browser.
 *
 * The widget posts one ClientEvent per action. The reply is a stream of
 * ServerEvents, one JSON object per line: complete messages for written
 * answers, or start/delta/end for a generated one, then the new state.
 */

export type ClientEvent =
  /** Opening the panel: the greeting, or the saved conversation. */
  | { type: "start" }
  /**
   * A menu option; "menu" is the first menu. The label lets the server find
   * the option again if the menu was edited since it was shown.
   */
  | { type: "topic"; id: string; label?: string }
  | { type: "text"; text: string }
  /** The phone step's picker: its country and the typed number. */
  | { type: "phone"; country: string; number: string }
  /** "I'd rather not" during the details step. */
  | { type: "decline" }

export interface ClientRequest {
  session: string | null
  /** The page the visitor is on, recorded with the lead. */
  page: string
  event: ClientEvent
}

export type Action = "consult" | "whatsapp"

export interface Option {
  id: string
  label: string
}

export interface BotMessage {
  role: "assistant"
  text: string
  options?: Option[]
  link?: { label: string; href: string }
  actions?: Action[]
  sources?: { title: string; href: string }[]
}

export interface UserMessage {
  role: "user"
  text: string
}

export type Message = BotMessage | UserMessage

/** What the composer should ask for next. */
export type InputKind = "text" | "name" | "email" | "phone"

/**
 * What the contact form can be filled in with if the visitor goes there
 * (lib/assistant/handoff.ts). Only what the visitor typed themselves.
 */
export interface Handoff {
  session: string
  name?: string
  email?: string
  phone?: string
  phoneCountry?: string
  service?: string
  market?: string
  message?: string
}

export type ServerEvent =
  | { type: "session"; id: string }
  | { type: "history"; messages: Message[] }
  | { type: "message"; message: BotMessage }
  | { type: "start" }
  | { type: "delta"; text: string }
  | { type: "end"; message: BotMessage }
  | {
      type: "state"
      input: InputKind
      /** Suggested country for the phone picker. */
      country?: string
      handoff: Handoff
    }
  | { type: "error"; message: string }
