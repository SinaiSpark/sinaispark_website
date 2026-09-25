import { notFound } from "next/navigation"

import { isPreviewing } from "@/lib/preview"
import { getSiteSettings } from "@/lib/settings"

/**
 * "Insights" is the research section. It stays hidden until an admin
 * switches it on in the CMS (Site settings → insightsEnabled): its pages
 * answer 404 and every link to them disappears (lib/insights-links.ts).
 * The blog is always public.
 * An editor previewing this very article still gets through, so drafts can
 * be checked before launch; nothing else opens (lib/preview.ts).
 */
export async function requireInsights(previewPath?: string) {
  const { insightsEnabled } = await getSiteSettings()
  if (insightsEnabled) return
  if (!previewPath || !(await isPreviewing(previewPath))) notFound()
}
