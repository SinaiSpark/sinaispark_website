import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "Article",
  robots: { index: false },
}

/**
 * Blog article template — CMS-driven in Phase 5. Until posts exist, unknown
 * slugs render a friendly placeholder instead of fake content.
 */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  // PENDING: posts come from Strapi (Phase 5); no sample articles are invented.
  if (!slug) notFound()

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Article coming soon
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          This article has not been published yet. Browse the blog for the
          latest regulatory updates.
        </p>
      </div>
    </section>
  )
}
