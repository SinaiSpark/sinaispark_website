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
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Research catalog — Stitch Institutional Excellence edition.
 * Features a high-impact flagship report with dual action CTAs,
 * dual-tier market & topic filters with live search, and gold-capped publication cards.
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

  return (
    <div className="flex flex-col gap-12">
      {/* 1 · Featured Flagship Report Hero Card */}
      {featured ? <FeaturedReport report={featured} /> : null}

      {/* 2 · Interactive Filter & Search Controls */}
      <div className="flex flex-col gap-6 rounded-xl border border-border/80 bg-background-alt p-6 shadow-sm">
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

          {/* Search Bar */}
          <div className="relative min-w-64">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="h-10 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/30"
            />
          </div>
        </div>
      </div>

      {/* 3 · Publications Grid */}
      {rest.length > 0 ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
              Latest Publications ({rest.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing filtered research intelligence
            </span>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((report) => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </ul>
        </div>
      ) : featured ? (
        <div className="text-center text-sm text-muted-foreground">
          Showing 1 featured report for this selection.
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-base font-semibold text-foreground">
            No research reports found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your market, topic, or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setMarket("All")
              setTopic("All")
              setSearch("")
            }}
            className="mt-4 inline-flex h-9 items-center rounded-md bg-gold px-4 text-xs font-semibold text-primary-deep hover:bg-gold/90"
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
              "shrink-0 snap-start rounded-md border px-3.5 py-1.5 text-xs font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              value === option
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:border-gold/60 hover:text-primary"
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
    <article className="group relative overflow-hidden rounded-xl border border-border bg-background shadow-md transition-shadow hover:shadow-lg lg:grid lg:grid-cols-[5fr_7fr]">
      {/* Left visual column */}
      <div className="relative min-h-64 overflow-hidden bg-primary lg:min-h-full">
        {asset ? (
          <Image
            src={asset.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            quality={85}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={asset.focal ? { objectPosition: asset.focal } : undefined}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/40 to-transparent lg:bg-gradient-to-r" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded bg-gold px-2.5 py-1 text-[0.7rem] font-bold tracking-wider text-primary-deep uppercase shadow-sm">
            Annual Flagship Report
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-primary-deep/80 px-2 py-0.5 text-xs text-primary-foreground/90 backdrop-blur-sm">
            <FileTextIcon className="size-3 text-gold" />
            24-Page Whitepaper
          </span>
        </div>
      </div>

      {/* Right narrative content */}
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="mist">{report.market}</Badge>
            <Badge variant="outline">{report.topic}</Badge>
            <span className="text-xs text-muted-foreground">· Q1 2026</span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {report.title}
          </h2>

          <p className="mt-3 leading-relaxed text-muted-foreground">
            {report.summary}
          </p>

          <div className="mt-4 grid gap-2 rounded-lg bg-background-alt p-4 text-xs text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              <span>Foreign Direct Investment metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              <span>Ministry approval timeline benchmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              <span>Regional Headquarter (RHQ) case studies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              <span>Full statutory tax & ZATCA analysis</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Link
            href={`/research/${report.slug}/`}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-sm font-semibold text-primary-deep shadow-sm transition-all hover:-translate-y-px hover:bg-gold/90"
          >
            <ArrowDownToLineIcon className="size-4" />
            Download Executive PDF (Free)
          </Link>
          <Link
            href={`/research/${report.slug}/`}
            className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-primary"
          >
            Read Full Analysis
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function ReportCard({ report }: { report: Report }) {
  return (
    <li className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold/80 hover:shadow-md">
      {/* Stitch signature 3px gold cap */}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[3px] bg-gold"
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
          className="mt-4 block outline-none"
        >
          <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {report.title}
          </h3>
        </Link>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
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
          className="inline-flex items-center gap-1 font-semibold text-gold-strong transition-colors hover:text-gold"
        >
          {report.gated ? "Download PDF" : "Read Briefing"}
          <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </li>
  )
}
