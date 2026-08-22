type JsonLdProps = {
  /** A schema.org JSON-LD object (or an @graph array). */
  data: Record<string, unknown>
}

/** Renders a schema.org JSON-LD script tag (SEO checklist, §3 Technical SEO). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped against </script> injection below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
