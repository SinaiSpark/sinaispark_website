import { pageStructuredData } from "@/lib/seo"

/** One JSON-LD block. `<` is escaped so a value can never close the tag. */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

/** Whatever structured data an editor added to this page's Page SEO. */
export async function PageJsonLd({ path }: { path: string }) {
  return <JsonLd data={await pageStructuredData(path)} />
}
