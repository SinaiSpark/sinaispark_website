import { ROUTES } from "@/content/site"

/**
 * Link filtering for the Insights switch (see lib/insights.ts). Kept apart
 * from the server-only gate so the header, a client component, can use it.
 */

/** True for any link into research. The blog is always public. */
export const isInsightsLink = (href: string) => href.startsWith(ROUTES.research)

/** The links, minus the research ones while Insights is off. */
export function visibleLinks<T extends { href: string }>(
  links: readonly T[],
  insights: boolean
): T[] {
  return insights
    ? [...links]
    : links.filter((link) => !isInsightsLink(link.href))
}
