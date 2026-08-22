"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import { CTA_LABEL, NAV_LINKS, SERVICES } from "@/lib/site-config"
import { LogoLockup } from "@/components/site/logo"
import { Sheet, SheetContent } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== "/" && Boolean(pathname?.startsWith(href)))
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
          "bg-gold absolute inset-x-3 -bottom-px h-0.5 origin-left scale-x-0 transition-transform duration-200",
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
        className="text-muted-foreground flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none group-hover:text-primary group-focus-within:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Services
        <ChevronDownIcon
          className="size-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden="true"
        />
      </button>
      <div className="invisible absolute top-full left-1/2 z-40 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="bg-popover text-popover-foreground grid w-[34rem] grid-cols-2 gap-1 rounded-lg border p-2 shadow-lg">
          {SERVICES.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="hover:bg-accent focus-visible:bg-accent rounded-md px-3 py-2.5 outline-none"
            >
              <span className="block text-sm font-medium">{service.title}</span>
              {service.description ? (
                <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                  {service.description}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-background/90 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-40 border-b backdrop-blur">
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
            className="bg-primary text-primary-foreground hover:bg-primary-deep hidden h-11 items-center rounded-md px-5 text-sm font-medium transition-all duration-200 outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-ring/50 sm:inline-flex"
          >
            {CTA_LABEL}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="hover:bg-muted inline-flex size-11 items-center justify-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
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
        <nav aria-label="Mobile" className="flex flex-col gap-1 overflow-y-auto pb-16">
          <p className="text-gold-strong mt-6 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
            Services
          </p>
          {SERVICES.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              onClick={() => onOpenChange(false)}
              className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium"
            >
              {service.title}
            </Link>
          ))}
          <p className="text-gold-strong mt-6 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
            Company
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium"
            >
              {link.title}
            </Link>
          ))}
          <Link
            href="/contact/"
            onClick={() => onOpenChange(false)}
            className="bg-primary text-primary-foreground mt-6 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium"
          >
            {CTA_LABEL}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
