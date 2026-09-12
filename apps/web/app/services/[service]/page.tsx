import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DetailPage } from "@/components/detail/detail-page"
import { CORE_SLUGS } from "@/content/pages"
import { getService } from "@/content/services"

/** One page per core service, built from content/services.ts. */
export function generateStaticParams() {
  return CORE_SLUGS.map((service) => ({ service }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service: slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return { title: service.title, description: service.metaDescription }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service: slug } = await params
  const service = getService(slug)
  if (!service || !CORE_SLUGS.includes(slug as (typeof CORE_SLUGS)[number]))
    notFound()

  const siblings = CORE_SLUGS.flatMap((s) => getService(s) ?? [])
  return <DetailPage service={service} siblings={siblings} kind="service" />
}
