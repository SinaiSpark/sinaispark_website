/**
 * A small fixed-window limiter for the public form endpoints. It lives in
 * memory, so each server instance counts on its own. That is enough to blunt
 * a script hammering one form; Cloudflare's rules sit in front for the rest.
 */
const windows = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const entry = windows.get(key)
  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    if (windows.size > 10_000) {
      for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k)
    }
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

export function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  )
}
