"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import { CTA_LABEL, NAV_LINKS, SERVICE_GROUPS } from "@/lib/site-config"
import { LogoLockup } from "@/components/site/logo"
import { Sheet, SheetContent } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname()
  const active =
    pathname === href || (href !== "/" && Boolean(pathname?.startsWith(href)))
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      {title}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-3 -bottom-px h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-200",
          active && "scale-x-100"
        )}
      />
    </Link>
  )
}

function ServicesDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none group-focus-within:text-primary group-hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Services
        <ChevronDownIcon
          className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
          aria-hidden="true"
        />
      </button>
      <div className="invisible absolute top-full left-1/2 z-40 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="grid w-[36rem] grid-cols-2 gap-x-6 gap-y-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[0.65rem] font-semibold tracking-[0.14em] text-gold-strong uppercase">
                {group.label}
              </p>
              {group.items.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="rounded-md px-3 py-2 outline-none hover:bg-accent focus-visible:bg-accent"
                >
                  <span className="block text-sm font-medium">
                    {service.title}
                  </span>
                  {service.description ? (
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <LogoLockup />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <NavLink href="/" title="Home" />
          <ServicesDropdown />
          <NavLink href="/about-us/" title="About Us" />
          <NavLink href="/sinai-spark-india/" title="India" />
          <NavLink href="/research/" title="Research" />
          <NavLink href="/blog/" title="Blog" />
          <NavLink href="/faqs/" title="FAQs" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact/"
            className="hidden h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 outline-none hover:-translate-y-px hover:bg-primary-deep focus-visible:ring-3 focus-visible:ring-ring/50 sm:inline-flex"
          >
            {CTA_LABEL}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-11 items-center justify-center rounded-md outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileNav open={open} onOpenChange={setOpen} />
    </header>
  )
}

function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="Navigation menu" side="right">
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 overflow-y-auto pb-16"
        >
          {SERVICE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mt-6 mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
                {group.label}
              </p>
              {group.items.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={() => onOpenChange(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          ))}
          <p className="mt-6 mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            Company
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
            >
              {link.title}
            </Link>
          ))}
          <Link
            href="/contact/"
            onClick={() => onOpenChange(false)}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            {CTA_LABEL}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
