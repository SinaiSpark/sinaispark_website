import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { cn } from "@workspace/ui/lib/utils"

type PageHeaderProps = {
  pathname: string
  eyebrow?: string
  title: React.ReactNode
  lede?: string
  /** CTAs or meta rendered beneath the lede. */
  children?: React.ReactNode
  className?: string
}

/**
 * Light page header for content-led routes (contact, FAQs, legal, blog).
 * Image-led routes use <ImageHero size="compact"> instead; both share the
 * same breadcrumb placement and type scale so the site reads as one system.
 * The brand mark sits faintly in the corner so even text-only pages carry
 * the identity.
 */
export function PageHeader({
  pathname,
  eyebrow,
  title,
  lede,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-border/60 bg-background-alt",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-12 size-[22rem] bg-[url(/brand/mark.svg)] bg-contain bg-no-repeat opacity-[0.05] md:size-[30rem]"
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs pathname={pathname} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 md:pt-14 md:pb-20 lg:px-8">
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            {eyebrow}
          </p>
        ) : null}
        {/* One H1 per page. */}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-balance md:text-5xl lg:text-6xl lg:leading-[1.05]">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {lede}
          </p>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {children}
          </div>
        ) : null}
      </div>
    </header>
  )
}
