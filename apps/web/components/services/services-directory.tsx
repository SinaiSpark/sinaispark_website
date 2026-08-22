"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react"

import { getAllServices, type ServiceContent } from "@/lib/content/services"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export function ServicesDirectory() {
  const [filter, setFilter] = useState<"all" | "core" | "license">("all")
  const allServices = getAllServices()

  const filteredServices = allServices.filter((service) => {
    if (filter === "all") return true
    return service.category === filter
  })

  return (
    <div className="flex flex-col gap-12">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background-alt hover:text-foreground"
            )}
          >
            All Practices ({allServices.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("core")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              filter === "core"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background-alt hover:text-foreground"
            )}
          >
            Core Corporate Advisory (5)
          </button>
          <button
            type="button"
            onClick={() => setFilter("license")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              filter === "license"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background-alt hover:text-foreground"
            )}
          >
            Saudi Business Licenses (5)
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing {filteredServices.length} specialized corporate practices
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredServices.map((service) => (
          <ServicePracticeCard key={service.slug} service={service} />
        ))}
      </div>

      {/* Advisory Lifecycle Sequence */}
      <div className="mt-8 rounded-xl border border-border/80 bg-background-alt p-8 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            End-To-End Advisory Model
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            How our advisory practices integrate for your growth
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We operate as a single institutional partner across the full
            lifecycle of your expansion, eliminating handoff delays between
            legal, ministry, and operational teams.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative rounded-lg border border-border bg-background p-5">
            <span className="text-xs font-bold text-gold-strong">STAGE 01</span>
            <h3 className="mt-1 font-semibold text-foreground">
              Entity Structuring & MISA
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Foreign ownership model selection, Articles of Association, and
              investment approvals.
            </p>
          </div>

          <div className="relative rounded-lg border border-border bg-background p-5">
            <span className="text-xs font-bold text-gold-strong">STAGE 02</span>
            <h3 className="mt-1 font-semibold text-foreground">
              Licensing & Clearances
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Commercial, industrial, or professional service licensing aligned
              to ISIC activities.
            </p>
          </div>

          <div className="relative rounded-lg border border-border bg-background p-5">
            <span className="text-xs font-bold text-gold-strong">STAGE 03</span>
            <h3 className="mt-1 font-semibold text-foreground">
              Workforce & Legal
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Qiwa quotas, executive residency (Iqamas), labor contracts, and
              bilingual advisory.
            </p>
          </div>

          <div className="relative rounded-lg border border-border bg-background p-5">
            <span className="text-xs font-bold text-gold-strong">STAGE 04</span>
            <h3 className="mt-1 font-semibold text-foreground">
              Ongoing Upkeep & Asset
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              ZATCA tax filing, annual license renewals, audit compliance, and
              facility management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServicePracticeCard({ service }: { service: ServiceContent }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/80 hover:shadow-lg">
      {/* Signature 3px gold indicator on card top */}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[3px] bg-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={service.category === "core" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {service.category === "core" ? "Core Practice" : "Saudi License"}
            </Badge>
            {service.disputeSupport ? (
              <Badge
                variant="outline"
                className="border-gold/60 text-[0.65rem] text-gold-strong"
              >
                Dispute Support Included
              </Badge>
            ) : null}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {service.jurisdictions[0]}
          </span>
        </div>

        <Link
          href={`/services/${service.slug}/`}
          className="mt-4 block outline-none"
        >
          <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {service.title}
          </h2>
        </Link>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.tagline}
        </p>

        {/* Deliverables Checklist */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
            Key Scope & Mandates
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {service.bullets.slice(0, 3).map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-xs leading-relaxed text-foreground/90"
              >
                <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-gold-strong" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assurances Chips */}
        {service.assurances && service.assurances.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
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
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs font-semibold text-muted-foreground">
          Explore Practice Specifications
        </span>
        <Link
          href={`/services/${service.slug}/`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-strong transition-colors hover:text-gold"
        >
          View Details
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
