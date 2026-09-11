"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowDownToLineIcon,
  ArrowRightIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react"

import { MARKETS, REPORTS, TOPICS, type Report } from "@/lib/content/research"
import { IMAGES } from "@/lib/images"
import { CtaLink, ctaClassName } from "@/components/site/cta-link"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Research catalog: a flagship report with dual CTAs, market/topic chips with
 * live search, and a publication grid.
 */
export function ReportCatalog() {
  const [market, setMarket] = useState<string>("All")
  const [topic, setTopic] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  const filtered = useMemo(
    () =>
      REPORTS.filter((report) => {
        const matchesMarket = market === "All" || report.market === market
        const matchesTopic = topic === "All" || report.topic === topic
        const matchesSearch =
          search.trim() === "" ||
          report.title.toLowerCase().includes(search.toLowerCase()) ||
          report.summary.toLowerCase().includes(search.toLowerCase())
        return matchesMarket && matchesTopic && matchesSearch
      }),
    [market, topic, search]
  )

  const [featured, ...rest] = filtered

  const reset = () => {
    setMarket("All")
    setTopic("All")
    setSearch("")
  }

  return (
    <div className="flex flex-col gap-12">
      {featured ? <FeaturedReport report={featured} /> : null}

      {/* Filters */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-background-alt p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <ChipRow
              label="Market"
              options={["All", ...MARKETS]}
              value={market}
              onChange={setMarket}
            />
            <ChipRow
              label="Topic"
              options={["All", ...TOPICS]}
              value={topic}
              onChange={setTopic}
            />
          </div>

          <div className="relative min-w-64">
            <SearchIcon
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports…"
              aria-label="Search reports"
              className="h-11 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm text-foreground transition-[border-color] duration-200 outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {rest.length > 0 ? (
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Latest Publications ({rest.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing filtered research intelligence
            </span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((report) => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </ul>
        </div>
      ) : featured ? (
        <p className="text-center text-sm text-muted-foreground">
          Showing 1 featured report for this selection.
        </p>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            No research reports found
          </p>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your market, topic, or search query.
          </p>
          <button
            type="button"
            onClick={reset}
            className={ctaClassName({
              variant: "outline",
              size: "sm",
              className: "mt-5",
            })}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-brand/60 hover:text-primary"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function FeaturedReport({ report }: { report: Report }) {
  const asset = report.imageKey ? IMAGES[report.imageKey] : null
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-background lg:grid lg:grid-cols-[5fr_7fr]">
      {/* Visual column — dark scrim, so it's a navy surface for the tags. */}
      <div
        data-surface="navy"
        className="relative min-h-64 overflow-hidden bg-primary lg:min-h-full"
      >
        {asset ? (
          <Image
            src={asset.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            quality={85}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={asset.focal ? { objectPosition: asset.focal } : undefined}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/40 to-transparent lg:bg-gradient-to-r" />
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand px-3 py-1 text-[0.7rem] font-bold tracking-[0.12em] text-brand-foreground uppercase">
            Annual Flagship Report
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-primary-deep/70 px-2.5 py-1 text-xs text-primary-foreground/90 backdrop-blur-sm">
            <FileTextIcon className="size-3 text-brand" aria-hidden="true" />
            24-Page Whitepaper
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="mist">{report.market}</Badge>
            <Badge variant="outline">{report.topic}</Badge>
            <span className="text-xs text-muted-foreground">· Q1 2026</span>
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
            {report.title}
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {report.summary}
          </p>

          <ul className="mt-6 grid gap-2.5 rounded-xl bg-background-alt p-5 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "Foreign Direct Investment metrics",
              "Ministry approval timeline benchmarks",
              "Regional Headquarter (RHQ) case studies",
              "Full statutory tax & ZATCA analysis",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-brand"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <CtaLink href={`/research/${report.slug}/`} variant="brand">
            <ArrowDownToLineIcon className="size-4" aria-hidden="true" />
            Download Executive PDF (Free)
          </CtaLink>
          <CtaLink href={`/research/${report.slug}/`} variant="outline" arrow>
            Read Full Analysis
          </CtaLink>
        </div>
      </div>
    </article>
  )
}

function ReportCard({ report }: { report: Report }) {
  return (
    <li className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand/70 hover:shadow-[0_12px_30px_-16px_rgba(0,56,102,0.25)]">
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[3px] bg-brand"
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="mist" className="text-[0.7rem]">
              {report.market}
            </Badge>
            <Badge variant="outline" className="text-[0.7rem]">
              {report.topic}
            </Badge>
          </div>
          <span className="text-[0.7rem] text-muted-foreground">
            {report.readTime}
          </span>
        </div>

        <Link
          href={`/research/${report.slug}/`}
          className="mt-5 block outline-none"
        >
          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {report.title}
          </h3>
        </Link>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {report.summary}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
        <time dateTime={report.date} className="text-muted-foreground">
          {new Date(report.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <Link
          href={`/research/${report.slug}/`}
          className="inline-flex items-center gap-1 font-semibold text-brand outline-none hover:underline focus-visible:underline"
        >
          {report.gated ? "Download PDF" : "Read Briefing"}
          <ArrowRightIcon
            className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </li>
  )
}
