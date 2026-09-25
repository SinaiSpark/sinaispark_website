/**
 * Transactional email through Resend's HTTP API (no SDK: one fetch works on
 * any runtime). Without RESEND_API_KEY nothing is sent and the message is
 * logged instead, which is what local development wants.
 */
export interface Mail {
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
}

/** Returns true when the provider accepted the message. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  if (!key || !from) {
    console.info(`[mail:skipped] ${mail.subject} → ${String(mail.to)}`)
    return false
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
    signal: AbortSignal.timeout(8000),
  }).catch((error: Error) => {
    console.error(`[mail] ${error.message}`)
    return null
  })

  if (!res?.ok) {
    console.error(`[mail] Resend returned ${res?.status}`)
    return false
  }
  return true
}
