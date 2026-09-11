"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  Building2Icon,
  CheckCircle2Icon,
  CompassIcon,
  FileCheckIcon,
  Globe2Icon,
  LayersIcon,
  ScaleIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

import { getAllServices, type ServiceContent } from "@/lib/content/services"
import { ctaClassName } from "@/components/site/cta-link"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

type Tab = "all" | "core" | "license"

const NAVIGATOR = [
  {
    href: "/services/administrative-solutions/",
    icon: Building2Icon,
    title: "Establishing a New Saudi Entity",
    body: "100% foreign-owned LLC, branch, or representative office registration with MISA.",
    cta: "View Business Setup",
  },
  {
    href: "/services/commercial-license/",
    icon: LayersIcon,
    title: "Trading, Wholesale & Retail",
    body: "Securing a commercial trading license and customs integration for foreign goods.",
    cta: "View Commercial License",
  },
  {
    href: "/services/industrial-license/",
    icon: CompassIcon,
    title: "Factory & Industrial Site",
    body: "Manufacturing permits, MODON land allocation, and raw material duty exemptions.",
    cta: "View Industrial License",
  },
  {
    href: "/sinai-spark-india/",
    icon: Globe2Icon,
    title: "Gulf-India Cross-Border Setup",
    body: "Online registration of Pvt Ltd, LLP, or OPC entities in India for Gulf NRIs.",
    cta: "View India Gateway",
  },
] as const

const LIFECYCLE = [
  {
    title: "Strategy & MISA Setup",
    body: "Foreign equity modeling, Articles of Association drafting, and investment approvals.",
  },
  {
    title: "Licensing & Clearances",
    body: "Commercial, industrial, or service license issuance aligned to official ISIC activities.",
  },
  {
    title: "Workforce & Legal Governance",
    body: "Qiwa quotas, executive residency (Iqamas), bilingual commercial contracts, and banking.",
  },
  {
    title: "Statutory Upkeep & Facilities",
    body: "ZATCA tax filing, annual license renewals, audit compliance, and corporate office leasing.",
  },
] as const

export function ServicesDirectory() {
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const allServices = getAllServices()
  const coreCount = allServices.filter((s) => s.category === "core").length
  const licenseCount = allServices.length - coreCount

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allServices.filter((service) => {
      const matchesTab = activeTab === "all" || service.category === activeTab
      const matchesSearch =
        q === "" ||
        service.title.toLowerCase().includes(q) ||
        service.tagline.toLowerCase().includes(q) ||
        service.keywords.some((k) => k.toLowerCase().includes(q))
      return matchesTab && matchesSearch
    })
  }, [allServices, activeTab, searchQuery])

  const corePractices = filteredServices.filter((s) => s.category === "core")
  const licensePractices = filteredServices.filter(
    (s) => s.category === "license"
  )

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "all", label: `All Practices (${allServices.length})` },
    { id: "core", label: `Core Corporate Advisory (${coreCount})` },
    { id: "license", label: `Saudi Business Licenses (${licenseCount})` },
  ]

  return (
    <div className="flex flex-col gap-16">
      {/* Filter bar */}
      <div className="rounded-2xl border border-border/80 bg-background-alt p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            aria-label="Practice category"
            className="flex flex-wrap items-center gap-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold tracking-[0.06em] uppercase transition-[background-color,border-color,color,transform] duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
                  activeTab === tab.id
                    ? "border border-primary bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:border-brand/60 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-72">
            <SearchIcon
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, licenses, or keywords…"
              aria-label="Search practices"
              className="h-11 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm text-foreground transition-[border-color] duration-200 outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        </div>
      </div>

      {corePractices.length > 0 ? (
        <section aria-labelledby="core-practices-heading">
          <GroupHeader
            id="core-practices-heading"
            eyebrow="Foundational Corporate Services"
            title="Core Advisory Practices"
            note="End-to-end formation, compliance, and ongoing governance"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {corePractices.map((service) => (
              <ExecutivePracticeCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      ) : null}

      {licensePractices.length > 0 ? (
        <section aria-labelledby="licenses-heading">
          <GroupHeader
            id="licenses-heading"
            eyebrow="Saudi Investment Law Framework"
            title="Specialized Business Licenses"
            note="ISIC4 activity mapping, ministerial approvals, and permits"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {licensePractices.map((service) => (
              <LicensePracticeCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      ) : null}

      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            No practices found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-muted-foreground">
            Try clearing your search query or selecting a different category
            tab.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setActiveTab("all")
            }}
            className={ctaClassName({
              variant: "outline",
              size: "sm",
              className: "mt-5",
            })}
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      {/* Market entry navigator */}
      <div className="rounded-2xl border border-border/80 bg-background-alt p-8 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            Market Entry Navigator
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
            What is your primary commercial objective?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Select your strategic path below to jump directly to the relevant
            licensing and advisory requirements.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NAVIGATOR.map(({ href, icon: Icon, title, body, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out outline-none hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_30px_-16px_rgba(0,56,102,0.25)] focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div>
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                {cta}
                <ArrowRightIcon
                  className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Lifecycle */}
      <div className="rounded-2xl border border-border/80 bg-background p-8 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            Lifecycle Partnership
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
            How our advisory practices integrate for your long-term success
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We eliminate handoff friction by serving as your single
            institutional partner from Day 1 formation through decades of
            operational compliance.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIFECYCLE.map((stage, index) => (
            <li
              key={stage.title}
              className="rounded-2xl border border-border bg-background-alt p-6"
            >
              <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.1em] text-primary-foreground uppercase tabular-nums">
                Stage {(index + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function GroupHeader({
  id,
  eyebrow,
  title,
  note,
}: {
  id: string
  eyebrow: string
  title: string
  note: string
}) {
  return (
    <div className="mb-7 flex flex-col gap-2 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl"
        >
          {title}
        </h2>
      </div>
      <span className="text-sm text-muted-foreground">{note}</span>
    </div>
  )
}

const CARD_CLASS =
  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out outline-none hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_30px_-16px_rgba(0,56,102,0.25)] focus-visible:ring-3 focus-visible:ring-ring/50"

function practiceIcon(slug: string) {
  switch (slug) {
    case "legal-services":
      return ScaleIcon
    case "pro-visa-services":
      return UsersIcon
    case "compliance":
      return FileCheckIcon
    case "property-management":
      return Building2Icon
    default:
      return LayersIcon
  }
}

function ExecutivePracticeCard({ service }: { service: ServiceContent }) {
  const Icon = practiceIcon(service.slug)

  return (
    <Link href={`/services/${service.slug}/`} className={CARD_CLASS}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {service.jurisdictions[0]?.split("(")[0]}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.tagline}
        </p>

        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Mandate Deliverables
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {service.bullets.slice(0, 3).map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <CheckCircle2Icon
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span className="line-clamp-2">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs font-medium text-muted-foreground">
          {service.assurances[0] || "Full Compliance"}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
          View Practice
          <ArrowRightIcon
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}

function LicensePracticeCard({ service }: { service: ServiceContent }) {
  return (
    <Link href={`/services/${service.slug}/`} className={CARD_CLASS}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="font-semibold">
            Saudi License
          </Badge>
          <span className="text-xs font-medium text-brand">ISIC4 Mapped</span>
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {service.assurances.slice(0, 2).map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-background-alt px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground"
            >
              <ShieldCheckIcon
                className="size-3 text-brand"
                aria-hidden="true"
              />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs text-muted-foreground">MISA Approved</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
          Details
          <ArrowRightIcon
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}
