import { cookies } from "next/headers"

import { cms, CmsError } from "@/lib/cms"
import { subscribeSchema } from "@/lib/contact-schema"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { READER_COOKIE, READER_MAX_AGE, signReader } from "@/lib/reader"

/** Newsletter sign-ups and research unlocks, both kept in the CMS email list. */
export async function POST(request: Request) {
  if (!rateLimit(`subscribe:${clientIp(request)}`, 10, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const parsed = subscribeSchema.safeParse(
    await request.json().catch(() => ({}))
  )
  if (!parsed.success) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    )
  }
  const { email, source, research, newsletter } = parsed.data

  try {
    await cms("/subscribers/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, source, research, newsletter }),
    })
  } catch (error) {
    console.error(error)
    const unknownArticle = error instanceof CmsError && error.status === 400
    return Response.json(
      {
        error: unknownArticle
          ? "That article is no longer available."
          : "We couldn't save your email. Please try again shortly.",
      },
      { status: unknownArticle ? 400 : 502 }
    )
  }

  // A research unlock also opens every other gated article in this browser.
  if (source === "Research gate") {
    ;(await cookies()).set(READER_COOKIE, await signReader(email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: READER_MAX_AGE,
    })
  }

  return Response.json({ ok: true })
}
