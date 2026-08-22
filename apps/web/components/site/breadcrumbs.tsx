import Link from "next/link"

import { buildBreadcrumbs } from "@/lib/breadcrumbs"
import { JsonLd } from "@/components/site/jsonld"
import { SITE } from "@/lib/site-config"
import { cn } from "@workspace/ui/lib/utils"

type BreadcrumbsProps = {
  pathname: string
  className?: string
  /** Tone for pages with dark hero surfaces. */
  tone?: "light" | "navy"
}

/**
 * Breadcrumb trail UI + BreadcrumbList JSON-LD (SEO checklist).
 * Labels resolve from approved site config via lib/breadcrumbs.
 */
export function Breadcrumbs({
  pathname,
  className,
  tone = "light",
}: BreadcrumbsProps) {
  const crumbs = buildBreadcrumbs(pathname)
  if (crumbs.length <= 1) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${SITE.url}${crumb.href}`,
    })),
  }

  return (
    <>
      <JsonLd data={schema} />
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "text-sm",
          tone === "light"
            ? "text-muted-foreground"
            : "text-primary-foreground/70",
          className
        )}
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span
                    aria-current="page"
                    className={
                      tone === "light"
                        ? "font-medium text-foreground"
                        : "font-medium text-primary-foreground"
                    }
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className={
                      tone === "light"
                        ? "transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
                        : "transition-colors outline-none hover:text-gold focus-visible:text-gold"
                    }
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden="true" className="opacity-60">
                    /
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
