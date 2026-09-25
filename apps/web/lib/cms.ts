/**
 * Server-side access to the Strapi CMS (apps/cms). Every call carries the
 * scoped "Website" API token, so this module must never reach the browser.
 */
const CMS_URL = process.env.CMS_URL ?? "http://localhost:1337"

export class CmsError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
  }
}

export async function cms<T>(
  path: string,
  init: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {}
): Promise<T> {
  const token = process.env.CMS_API_TOKEN
  if (!token) throw new CmsError(500, "CMS_API_TOKEN is not set")

  const res = await fetch(`${CMS_URL}/api${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers,
    },
    signal: init.signal ?? AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new CmsError(res.status, `CMS ${res.status} on ${path}: ${body}`)
  }
  return (await res.json()) as T
}
