"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
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
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

import { getAllServices, type ServiceContent } from "@/lib/content/services"
import { IMAGES } from "@/lib/images"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export function ServicesDirectory() {
  const [activeTab, setActiveTab] = useState<"all" | "core" | "license">("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const allServices = getAllServices()

  // Flagship service is Business Setup in Saudi Arabia
  const flagship = allServices.find(
    (s) => s.slug === "administrative-solutions"
  )

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesTab = activeTab === "all" || service.category === activeTab
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesTab && matchesSearch
    })
  }, [allServices, activeTab, searchQuery])

  const corePractices = filteredServices.filter((s) => s.category === "core")
  const licensePractices = filteredServices.filter(
    (s) => s.category === "license"
  )

  return (
    <div className="flex flex-col gap-16">
      {/* 1 · Flagship Service Spotlight Card */}
      {flagship && searchQuery === "" && activeTab !== "license" ? (
        <FlagshipSpotlightCard service={flagship} />
      ) : null}

      {/* 2 · Interactive Filter Bar & Instant Practice Search */}
      <div className="rounded-xl border border-border/80 bg-background-alt p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
              )}
            >
              All Practices ({allServices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("core")}
              className={cn(
                "rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                activeTab === "core"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
              )}
            >
              Core Corporate Advisory (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("license")}
              className={cn(
                "rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                activeTab === "license"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
              )}
            >
              Saudi Business Licenses (5)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-72">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, licenses, or keywords..."
              className="h-10 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/30"
            />
          </div>
        </div>
      </div>

      {/* 3 · Group A: Core Corporate Advisory Practices */}
      {corePractices.length > 0 ? (
        <section aria-labelledby="core-practices-heading">
          <div className="mb-6 flex flex-col gap-1 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-gold-strong uppercase">
                Foundational Corporate Services
              </p>
              <h2
                id="core-practices-heading"
                className="text-2xl font-bold tracking-tight text-foreground"
              >
                Core Advisory Practices
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              End-to-end formation, compliance, and ongoing governance
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {corePractices.map((service) => (
              <ExecutivePracticeCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      ) : null}

      {/* 4 · Group B: Saudi Business Licensing Pathways */}
      {licensePractices.length > 0 ? (
        <section aria-labelledby="licenses-heading" className="mt-4">
          <div className="mb-6 flex flex-col gap-1 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-gold-strong uppercase">
                Saudi Investment Law Framework
              </p>
              <h2
                id="licenses-heading"
                className="text-2xl font-bold tracking-tight text-foreground"
              >
                Specialized Business Licenses
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              ISIC4 activity mapping, ministerial approvals, and permits
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {licensePractices.map((service) => (
              <LicensePracticeCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Empty State */}
      {filteredServices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-base font-semibold text-foreground">
            No practices found matching "{searchQuery}"
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing your search query or selecting a different category
            tab.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setActiveTab("all")
            }}
            className="mt-4 inline-flex h-9 items-center rounded-md bg-gold px-4 text-xs font-semibold text-primary-deep hover:bg-gold/90"
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      {/* 5 · "Find Your Route" Decision Matrix */}
      <div className="rounded-2xl border border-border/80 bg-background-alt p-8 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.14em] text-gold-strong uppercase">
            Market Entry Navigator
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            What is your primary commercial objective?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Select your strategic path below to jump directly to the relevant
            licensing and advisory requirements.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/services/administrative-solutions/"
            className="group flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-md"
          >
            <div>
              <div className="inline-flex size-9 items-center justify-center rounded-md bg-gold/15 text-gold-strong">
                <Building2Icon className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                Establishing a New Saudi Entity
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                100% foreign-owned LLC, branch, or representative office
                registration with MISA.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-strong">
              View Business Setup →
            </span>
          </Link>

          <Link
            href="/services/commercial-license/"
            className="group flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-md"
          >
            <div>
              <div className="inline-flex size-9 items-center justify-center rounded-md bg-gold/15 text-gold-strong">
                <LayersIcon className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                Trading, Wholesale & Retail
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Securing a commercial trading license and customs integration
                for foreign goods.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-strong">
              View Commercial License →
            </span>
          </Link>

          <Link
            href="/services/industrial-license/"
            className="group flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-md"
          >
            <div>
              <div className="inline-flex size-9 items-center justify-center rounded-md bg-gold/15 text-gold-strong">
                <CompassIcon className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                Factory & Industrial Site
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Manufacturing permits, MODON land allocation, and raw material
                duty exemptions.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-strong">
              View Industrial License →
            </span>
          </Link>

          <Link
            href="/sinai-spark-india/"
            className="group flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-md"
          >
            <div>
              <div className="inline-flex size-9 items-center justify-center rounded-md bg-gold/15 text-gold-strong">
                <Globe2Icon className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                Gulf-India Cross-Border Setup
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Online registration of Pvt Ltd, LLP, or OPC entities in India
                for Gulf NRIs.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-strong">
              View India Gateway →
            </span>
          </Link>
        </div>
      </div>

      {/* 6 · Advisory Lifecycle Architecture */}
      <div className="rounded-2xl border border-border/80 bg-background p-8 shadow-sm sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.14em] text-gold-strong uppercase">
            Lifecycle Partnership
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            How our advisory practices integrate for your long-term success
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We eliminate handoff friction by serving as your single
            institutional partner from Day 1 formation through decades of
            operational compliance.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative rounded-xl border border-border bg-background-alt p-6">
            <span className="inline-block rounded bg-primary px-2.5 py-0.5 text-[0.7rem] font-bold text-primary-foreground uppercase">
              Stage 01
            </span>
            <h3 className="mt-3 font-bold text-foreground">
              Strategy & MISA Setup
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Foreign equity modeling, Articles of Association drafting, and
              investment approvals.
            </p>
          </div>

          <div className="relative rounded-xl border border-border bg-background-alt p-6">
            <span className="inline-block rounded bg-primary px-2.5 py-0.5 text-[0.7rem] font-bold text-primary-foreground uppercase">
              Stage 02
            </span>
            <h3 className="mt-3 font-bold text-foreground">
              Licensing & Clearances
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Commercial, industrial, or service license issuance aligned to
              official ISIC activities.
            </p>
          </div>

          <div className="relative rounded-xl border border-border bg-background-alt p-6">
            <span className="inline-block rounded bg-primary px-2.5 py-0.5 text-[0.7rem] font-bold text-primary-foreground uppercase">
              Stage 03
            </span>
            <h3 className="mt-3 font-bold text-foreground">
              Workforce & Legal Governance
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Qiwa quotas, executive residency (Iqamas), bilingual commercial
              contracts, and banking.
            </p>
          </div>

          <div className="relative rounded-xl border border-border bg-background-alt p-6">
            <span className="inline-block rounded bg-primary px-2.5 py-0.5 text-[0.7rem] font-bold text-primary-foreground uppercase">
              Stage 04
            </span>
            <h3 className="mt-3 font-bold text-foreground">
              Statutory Upkeep & Facilities
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              ZATCA tax filing, annual license renewals, audit compliance, and
              corporate office leasing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Flagship Spotlight Card for Business Setup in Saudi Arabia */
function FlagshipSpotlightCard({ service }: { service: ServiceContent }) {
  const asset = service.imageKey ? IMAGES[service.imageKey] : null

  return (
    <article className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-background shadow-md transition-shadow hover:shadow-xl lg:grid lg:grid-cols-[5fr_7fr]">
      {/* Left visual column */}
      <div className="relative min-h-72 overflow-hidden bg-primary lg:min-h-full">
        {asset ? (
          <Image
            src={asset.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            quality={85}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={asset.focal ? { objectPosition: asset.focal } : undefined}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/95 via-primary/40 to-transparent lg:bg-gradient-to-r" />

        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded bg-gold px-3 py-1 text-xs font-bold tracking-wider text-primary-deep uppercase shadow-sm">
            <SparklesIcon className="size-3.5" />
            Flagship Corporate Practice
          </span>
          <span className="rounded bg-primary-deep/80 px-2.5 py-1 text-xs text-primary-foreground/90 backdrop-blur-sm">
            Saudi Arabia
          </span>
        </div>

        <div className="absolute right-5 bottom-5 left-5 text-white">
          <p className="text-xs font-medium text-white/80">
            Primary Advisory Track
          </p>
          <p className="text-sm font-bold text-white">
            Ministry of Investment (MISA) & MoC Commercial Registration
          </p>
        </div>
      </div>

      {/* Right narrative content */}
      <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="text-xs">
              Company Formation
            </Badge>
            <Badge
              variant="outline"
              className="border-gold text-xs text-gold-strong"
            >
              Dispute Support Scoped
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              · 100% Foreign Ownership Permitted
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {service.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {service.tagline} We handle the complete legal, ministerial, and
            operational formation for foreign enterprises entering the Kingdom
            under the updated Saudi Investment Law.
          </p>

          {/* Key Deliverables Matrix */}
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {service.bullets.slice(0, 4).map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-2 text-xs text-foreground/90"
              >
                <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-gold-strong" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Assurances tags */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-4">
            {service.assurances.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded bg-background-alt px-2.5 py-1 text-xs font-semibold text-muted-foreground"
              >
                <ShieldCheckIcon className="size-3.5 text-gold-strong" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Link
            href={`/services/${service.slug}/`}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-xs font-bold text-primary-deep shadow-sm transition-all hover:-translate-y-px hover:bg-gold/90"
          >
            Explore Business Setup Practice
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/contact/"
            className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border px-5 text-xs font-semibold text-foreground transition-colors hover:border-gold hover:text-primary"
          >
            Speak with Setup Director
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Executive Practice Card for Core Advisory Services */
function ExecutivePracticeCard({ service }: { service: ServiceContent }) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case "legal-services":
        return <ScaleIcon className="size-5 text-gold-strong" />
      case "pro-visa-services":
        return <UsersIcon className="size-5 text-gold-strong" />
      case "compliance":
        return <FileCheckIcon className="size-5 text-gold-strong" />
      case "property-management":
        return <Building2Icon className="size-5 text-gold-strong" />
      default:
        return <LayersIcon className="size-5 text-gold-strong" />
    }
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/80 hover:shadow-lg">
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[3px] bg-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex size-10 items-center justify-center rounded-lg bg-gold/15">
            {getIcon(service.slug)}
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {service.jurisdictions[0]?.split("(")[0]}
          </span>
        </div>

        <Link
          href={`/services/${service.slug}/`}
          className="mt-4 block outline-none"
        >
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {service.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {service.tagline}
        </p>

        {/* Deliverables */}
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-[0.68rem] font-bold tracking-wider text-muted-foreground uppercase">
            Mandate Deliverables
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {service.bullets.slice(0, 3).map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-xs text-foreground/90"
              >
                <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-gold-strong" />
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
        <Link
          href={`/services/${service.slug}/`}
          className="inline-flex items-center gap-1 text-xs font-bold text-gold-strong transition-colors hover:text-gold"
        >
          View Practice
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

/** License Practice Card for Saudi Licensing Pathways */
function LicensePracticeCard({ service }: { service: ServiceContent }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/80 hover:shadow-lg">
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[3px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="border-border text-[0.7rem] font-bold"
          >
            Saudi License
          </Badge>
          <span className="text-[0.7rem] font-medium text-gold-strong">
            ISIC4 Mapped
          </span>
        </div>

        <Link
          href={`/services/${service.slug}/`}
          className="mt-3.5 block outline-none"
        >
          <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {service.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {service.tagline}
        </p>

        {/* Assurances tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {service.assurances.slice(0, 2).map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded bg-background-alt px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground"
            >
              <ShieldCheckIcon className="size-3 text-gold" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5">
        <span className="text-xs text-muted-foreground">MISA Approved</span>
        <Link
          href={`/services/${service.slug}/`}
          className="inline-flex items-center gap-1 text-xs font-bold text-foreground transition-colors group-hover:text-gold"
        >
          Details
          <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
