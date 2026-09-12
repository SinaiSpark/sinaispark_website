import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DetailPage } from "@/components/detail/detail-page"
import { LICENCE_SLUGS } from "@/content/pages"
import { getService } from "@/content/services"

/** One page per licence class, built from content/services.ts. */
export function generateStaticParams() {
  return LICENCE_SLUGS.map((licence) => ({ licence }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ licence: string }>
}): Promise<Metadata> {
  const { licence: slug } = await params
  const licence = getService(slug)
  if (!licence) return {}
  return { title: licence.title, description: licence.metaDescription }
}

export default async function LicenceDetailPage({
  params,
}: {
  params: Promise<{ licence: string }>
}) {
  const { licence: slug } = await params
  const licence = getService(slug)
  if (
    !licence ||
    !LICENCE_SLUGS.includes(slug as (typeof LICENCE_SLUGS)[number])
  )
    notFound()

  const siblings = LICENCE_SLUGS.flatMap((s) => getService(s) ?? [])
  return <DetailPage service={licence} siblings={siblings} kind="licence" />
}
