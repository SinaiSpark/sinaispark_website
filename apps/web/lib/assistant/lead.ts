import {
  findPhoneNumbersInText,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js"

/**
 * Reading contact details out of what a visitor types, without a model:
 * "I'm Sara", "sara@acme.com", "+966 50 123 4567", or all three at once.
 * Pure functions, so the rules are unit tested (tests/lib/assistant-lead.test.ts).
 */

export interface LeadDetails {
  name?: string
  email?: string
  /** International format, e.g. "+966 50 123 4567". */
  phone?: string
  phoneCountry?: string
}

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i

export function extractEmail(text: string) {
  return text.match(EMAIL)?.[0].toLowerCase()
}

export function extractPhone(
  text: string,
  country: CountryCode = "SA"
): { phone: string; country?: string } | undefined {
  const found = findPhoneNumbersInText(text, { defaultCountry: country })
  const valid = found.find((f) => f.number.isValid())
  if (valid) {
    return {
      phone: valid.number.formatInternational(),
      country: valid.number.country,
    }
  }
  return undefined
}

/** A number from the phone picker: its country plus what was typed. */
export function phoneFromPicker(country: string, number: string) {
  const parsed = parsePhoneNumberFromString(number, country as CountryCode)
  if (!parsed || !isValidPhoneNumber(number, country as CountryCode)) return
  return { phone: parsed.formatInternational(), country: parsed.country }
}

const NAME_LEAD =
  /^(?:hi|hello|hey)?[\s,!.]*(?:(?:my\s+name\s+is|my\s+name's|name\s*[:-]|i\s*am|i'm|im|it's|its|this\s+is|call\s+me|you\s+can\s+call\s+me)\s+)/i

/** Title case for a name typed all in lower case; otherwise as typed. */
const tidyName = (name: string) =>
  name === name.toLowerCase()
    ? name.replace(
        /(^|[\s'-])(\p{L})/gu,
        (_, a: string, b: string) => a + b.toUpperCase()
      )
    : name

/**
 * A plausible name from a reply to "who am I speaking with?": one to four
 * words of letters, after dropping "my name is" and the like. Anything with
 * digits, an @ or a question mark isn't a name.
 */
export function extractName(text: string): string | undefined {
  let rest = text.replace(EMAIL, " ").trim()
  const phone = findPhoneNumbersInText(rest)
  for (const p of phone.reverse()) {
    rest = rest.slice(0, p.startsAt) + rest.slice(p.endsAt)
  }
  rest = rest
    .replace(NAME_LEAD, "")
    .replace(
      /\s*(?:and|,)?\s*(?:my\s+)?(?:email|e-mail|phone|number|mobile)\b.*$/i,
      ""
    )
    .replace(/[\s.,!;:]+$/, "")
    .replace(/^[\s,]+/, "")
    .trim()
  if (!rest || rest.length > 60 || /[\d@?#/\\<>{}[\]=_*]/.test(rest)) return
  const words = rest.split(/\s+/)
  if (words.length > 4) return
  if (!words.every((w) => /^[\p{L}][\p{L}'.-]*$/u.test(w))) return
  if (DECLINE.test(rest) || GREETING.test(rest)) return
  return tidyName(rest)
}

const GREETING = /^(?:hi|hello|hey|ok|okay|sure|yes|yeah|thanks|thank you)$/i

/** "No thanks", "skip", "why do you need that?", "I'd rather not". */
const DECLINE =
  /\b(?:no|nope|nah|skip|rather\s+not|prefer\s+not|don'?t\s+want|do\s+not\s+want|won'?t|not\s+comfortable|not\s+sharing|no\s+thanks|not\s+now|why\s+do\s+you\s+need|why\s+should\s+i|none\s+of\s+your|private|anonymous)\b/i

export function isDecline(text: string) {
  return DECLINE.test(text) && !extractEmail(text) && !extractPhone(text)
}

/** Everything recognisable in one message. */
export function readDetails(text: string, country?: CountryCode): LeadDetails {
  const phone = extractPhone(text, country)
  return {
    email: extractEmail(text),
    phone: phone?.phone,
    phoneCountry: phone?.country,
    name: extractName(text),
  }
}

/**
 * The country an email's domain points to (sara@acme.co.uk → GB), to
 * preselect in the phone picker. Generic domains (.com) give nothing.
 */
export function countryFromEmail(email: string | null | undefined) {
  const tld = email?.split(".").pop()?.toUpperCase()
  if (!tld || tld.length !== 2) return undefined
  const code = tld === "UK" ? "GB" : tld
  return isSupportedCountry(code) ? code : undefined
}

/** First name, for a friendlier reply. */
export const firstName = (name: string) => name.split(/\s+/)[0] ?? name
