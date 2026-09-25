import { CONSULT } from "@/content/home"
import { ROUTES } from "@/content/site"

/**
 * Where an enquiry came from, and what the form should preselect for it.
 *
 * Every "book a consultation" button leads to the one form on the contact
 * page. The page the visitor was on before is what the team needs to know
 * (and what picks the service and market), so it's recorded instead of the
 * contact page itself. Someone who opened the contact page directly is
 * recorded as that. The label the admin shows is made on the server
 * (lib/enquiry-label.ts), so the page list stays out of the browser.
 */

type Market = (typeof CONSULT.markets)[number]["label"]
type Service = (typeof CONSULT.services)[number]

export const DIRECT_SOURCE = "Contact page (direct)"

const SERVICE_BY_PATH: [prefix: string, service: Service, market?: Market][] = [
  [ROUTES.india, "Indian company registration (NRI)", "India"],
  [
    "/services/administrative-solutions/",
    "Business setup / company formation",
    "Saudi Arabia",
  ],
  ["/services/legal-services/", "Legal & regulatory advisory"],
  ["/services/pro-visa-services/", "PRO & visa services"],
  ["/services/compliance/", "Compliance"],
  ["/services/property-management/", "Property management"],
  [
    ROUTES.licences,
    "A licence (commercial, industrial, entrepreneurial, service, real estate)",
    "Saudi Arabia",
  ],
]

export type Prefill = { service?: Service; market?: Market; plan?: string }

/** What to preselect for a visitor who came from `path`. */
export function prefillFor(path: string | null): Prefill {
  if (!path) return {}
  const match = SERVICE_BY_PATH.find(([prefix]) => path.startsWith(prefix))
  return match ? { service: match[1], market: match[2] } : {}
}

export { consultHref } from "@/content/site"

/** Reads `?service=&market=&plan=` back, ignoring anything not on the form. */
export function prefillFromQuery(search: string): Prefill {
  const params = new URLSearchParams(search)
  const service = CONSULT.services.find((s) => s === params.get("service"))
  const market = CONSULT.markets.find(
    (m) => m.label === params.get("market")
  )?.label
  const plan = params.get("plan")?.slice(0, 60) || undefined
  return { service, market, plan }
}

const TRAIL_KEY = "ss:trail"
type Trail = { current: string; previous: string | null }

/** Called on every route change by <PageTrail>. */
export function recordVisit(path: string) {
  try {
    const trail = readTrail()
    if (trail?.current === path) return
    const next: Trail = { current: path, previous: trail?.current ?? null }
    sessionStorage.setItem(TRAIL_KEY, JSON.stringify(next))
  } catch {
    // Storage blocked: the referrer fallback below still works.
  }
}

function readTrail(): Trail | null {
  try {
    return JSON.parse(sessionStorage.getItem(TRAIL_KEY) ?? "null") as Trail
  } catch {
    return null
  }
}

/**
 * The page before this one on the site, or null if the visitor arrived here
 * directly. Order: this tab's own history, then the browser's referrer (a
 * link opened in a new tab).
 */
export function previousPath(here: string): string | null {
  const trail = readTrail()
  // The trail may not have caught up with this page yet.
  const before = trail?.current === here ? trail.previous : trail?.current
  if (before && before !== here) return before

  try {
    const ref = new URL(document.referrer)
    if (ref.origin === window.location.origin && ref.pathname !== here) {
      return ref.pathname
    }
  } catch {
    // No referrer.
  }
  return null
}
