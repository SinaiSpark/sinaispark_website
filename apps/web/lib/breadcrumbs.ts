import { NAV_LINKS, SERVICES, SITE } from "@/lib/site-config"

export interface Crumb {
  label: string
  href: string
}

const SERVICE_LABELS = new Map(
  SERVICES.map((service) => [service.href, service.title])
)

const STATIC_LABELS = new Map<string, string>([
  ["/", "Home"],
  ["/services/", "Services"],
  ...NAV_LINKS.map((link) => [link.href, link.title] as const),
  ["/contact/", "Contact Us"],
  ["/privacy-policy/", "Privacy Policy"],
  ["/terms/", "Terms & Conditions"],
])

function humanize(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Builds the Home-rooted breadcrumb trail for a pathname.
 * Labels resolve from approved site config; unknown segments fall back to a
 * humanized slug. Used by the breadcrumbs UI and BreadcrumbList schema.
 */
export function buildBreadcrumbs(pathname: string): Crumb[] {
  const normalized =
    pathname.endsWith("/") && pathname !== "/" ? pathname : `${pathname}/`
  const segments = normalized.split("/").filter(Boolean)

  const crumbs: Crumb[] = [
    { label: SITE.shortName === "Sinai Spark" ? "Home" : "Home", href: "/" },
  ]

  let current = ""
  for (const segment of segments) {
    current += `${segment}/`
    const href = `/${current}`
    const label =
      SERVICE_LABELS.get(href) ?? STATIC_LABELS.get(href) ?? humanize(segment)
    crumbs.push({ label, href })
  }

  // Home page itself has no trail.
  if (segments.length === 0) return []

  return crumbs
}
