/**
 * The "reader" cookie: proof that this browser gave an email address to read
 * gated research. It holds the email and an HMAC of it, so it cannot be
 * forged, and it opens every gated article, not only the first one.
 *
 * Web Crypto only, so it runs on Node and on Cloudflare Workers alike.
 */
export const READER_COOKIE = "ss_reader"
export const READER_MAX_AGE = 60 * 60 * 24 * 365

const encoder = new TextEncoder()

function secret() {
  const value = process.env.READER_COOKIE_SECRET
  if (!value) throw new Error("READER_COOKIE_SECRET is not set")
  return value
}

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

const fromBase64Url = (text: string) =>
  Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (char) =>
    char.charCodeAt(0)
  )

async function hmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  )
  return toBase64Url(new Uint8Array(signature))
}

/** Cookie value for a reader who has given this email. */
export async function signReader(email: string) {
  const payload = toBase64Url(encoder.encode(email))
  return `${payload}.${await hmac(payload)}`
}

/** The reader's email if the cookie is genuine, otherwise null. */
export async function verifyReader(value: string | undefined) {
  if (!value) return null
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null
  const expected = await hmac(payload)
  // Constant-time comparison: never leak how much of a forged value matched.
  if (expected.length !== signature.length) return null
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  if (diff !== 0) return null
  try {
    return new TextDecoder().decode(fromBase64Url(payload))
  } catch {
    return null
  }
}
