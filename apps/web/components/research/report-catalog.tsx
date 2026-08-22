"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDownToLineIcon } from "lucide-react"

import { MARKETS, REPORTS, TOPICS, type Report } from "@/lib/content/research"
import { IMAGES } from "@/lib/images"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Research catalog — featured report pinned, filterable by market and topic
 * via chip bar (horizontally scrollable on mobile, §16). Client-side filter;
 * swaps to CMS data in Phase 5.
 */
export function ReportCatalog() {
  const [market, setMarket] = useState<string>("All")
  const [topic, setTopic] = useState<string>("All")

  const filtered = useMemo(
    () =>
      REPORTS.filter(
        (report) =>
          (market === "All" || report.market === market) &&
          (topic === "All" || report.topic === topic)
      ),
    [market, topic]
  )

  const [featured, ...rest] = filtered

  return (
    <div>
      {/* Featured report */}
      {featured ? <FeaturedReport report={featured} /> : null}

      {/* Filter chips */}
      <div className="mt-12 flex flex-col gap-4">
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

      {/* Grid */}
      {rest.length > 0 ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))}
        </ul>
      ) : featured ? null : (
        <p className="mt-8 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No reports match these filters yet — new publications are added as our
          research team releases them.
        </p>
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
      <span className="w-14 shrink-0 text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
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
              "shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-gold/60 hover:text-primary"
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
    <article className="group relative grid overflow-hidden rounded-lg border bg-background-alt md:grid-cols-2">
      {asset ? (
        <Image
          src={asset.src}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={80}
          className="object-cover"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
      ) : (
        <div className="hidden bg-primary md:block" aria-hidden="true" />
      )}
      <div className="flex flex-col gap-3 p-6 md:p-10">
        <Badge variant="gold" className="w-fit">
          Featured Report
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight text-balance">
          {report.title}
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {report.summary}
        </p>
        <ReportMeta report={report} />
      </div>
    </article>
  )
}

function ReportCard({ report }: { report: Report }) {
  return (
    <li className="group flex flex-col rounded-lg border p-5 transition-colors outline-none focus-within:ring-3 focus-within:ring-ring/50 hover:border-gold/60">
      <div className="flex items-center gap-2">
        <Badge variant="mist">{report.market}</Badge>
        <Badge variant="outline">{report.topic}</Badge>
      </div>
      <Link href={`/research/${report.slug}/`} className="mt-3 outline-none">
        <span className="block font-semibold tracking-tight transition-colors group-hover:text-primary">
          {report.title}
        </span>
      </Link>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {report.summary}
      </p>
      <div className="mt-auto pt-4">
        <ReportMeta report={report} compact />
      </div>
    </li>
  )
}

function ReportMeta({
  report,
  compact = false,
}: {
  report: Report
  compact?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
      <time dateTime={report.date}>
        {new Date(report.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
        {" · "}
        {report.readTime}
      </time>
      {!compact ? (
        <span className="inline-flex items-center gap-1.5 font-medium text-gold-strong">
          <ArrowDownToLineIcon aria-hidden="true" className="size-3.5" />
          {report.gated ? "Gated download" : "Download PDF"}
        </span>
      ) : null}
    </div>
  )
}
