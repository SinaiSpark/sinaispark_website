"use client"

import { useState } from "react"

import { BrandMark } from "@/components/ui/brand-mark"
import { ArrowIcon, ButtonArrow, LockIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { BRAND } from "@/content/site"
import { RESEARCH, type Market, type Topic } from "@/content/research"
import type { Report } from "@/lib/content-api"
import { cx } from "@/lib/cx"

/**
 * Research page sections: the featured article, the filterable library and
 * the method behind the research. Articles come from the CMS; gated ones ask
 * for an email on the article page itself.
 */

/** The featured article, shown as a cover that tilts toward the pointer. */
export function FeaturedReport({
  report,
  total,
}: {
  report: Report
  total: number
}) {
  const copy = RESEARCH.featured

  return (
    <section
      className="rs-feat"
      id="featured"
      data-surface="dark"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="rs-cover-wrap" data-reveal>
          <SmartLink className="rs-cover" id="rsCover" href={report.href}>
            <BrandMark className="mk" />
            <div className="hd">
              <span>{report.topic}</span>
              <span>{report.date}</span>
            </div>
            <h3>{report.title}</h3>
            <div className="ft">
              <img src="/brand/logo-white.svg" alt={BRAND.name} />
              <span>{report.readTime} read</span>
              <span>{report.market}</span>
            </div>
          </SmartLink>
        </div>

        <div>
          <p className="eyebrow" data-reveal>
            {copy.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={report.title} />
          <p className="lede muted" data-reveal>
            {report.summary}
          </p>

          <div className="rs-meta" data-reveal>
            <span>{report.market}</span>
            <span>{report.topic}</span>
            <span>{report.date}</span>
            {report.gated ? (
              <span className="lk">
                <LockIcon />
                {copy.gatedNote}
              </span>
            ) : null}
          </div>

          <div className="d-actions" style={{ marginTop: 0 }} data-reveal>
            <SmartLink className="btn" href={report.href} data-magnetic>
              {copy.primary} <ButtonArrow />
            </SmartLink>
            <a className="link" href="#library">
              {copy.link(total)} <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ReportCard({
  report,
  hidden = false,
}: {
  report: Report
  hidden?: boolean
}) {
  const copy = RESEARCH.library

  return (
    <SmartLink
      className={cx("rs-card", hidden && "is-hidden")}
      href={report.href}
    >
      <div className="rs-thumb">
        <img src={report.image} alt={report.imageAlt} />
        <span className="tag">{report.topic}</span>
        {report.gated ? (
          <span className="rs-lock">
            <LockIcon />
            {copy.gatedLabel}
          </span>
        ) : null}
        <span className="pg" aria-hidden="true">
          {report.readMinutes}
          <small>min</small>
        </span>
      </div>
      <div className="tx">
        <div className="tags">
          <span>{report.market}</span>
          <time dateTime={report.isoDate}>{report.date}</time>
        </div>
        <h3>{report.title}</h3>
        <p>{report.summary}</p>
        <div className="meta">
          <span>{report.readTime} read</span>
          <span className="dl">
            {copy.read} <ArrowIcon />
          </span>
        </div>
      </div>
    </SmartLink>
  )
}

/**
 * The library, filterable by market and by topic. Only markets with at least
 * one article get a chip.
 *
 * Cards are hidden rather than unmounted so the entrance triggers the motion
 * layer created keep pointing at live nodes.
 */
type MarketFilter = Market | "all"
type TopicFilter = Topic | "all"

export function ReportLibrary({ reports }: { reports: Report[] }) {
  const copy = RESEARCH.library
  const [market, setMarket] = useState<MarketFilter>("all")
  const [topic, setTopic] = useState<TopicFilter>("all")

  const matches = (report: Report) =>
    (market === "all" || report.market === market) &&
    (topic === "all" || report.topic === topic)
  const shown = reports.filter(matches).length
  const markets = copy.markets.filter((option) =>
    reports.some((r) => r.market === option)
  )

  const reset = () => {
    setMarket("all")
    setTopic("all")
  }

  return (
    <section
      className="rs-lib"
      id="library"
      data-surface="light"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={copy.headline} />
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="rs-empty">{copy.none}</div>
        ) : (
          <>
            <div className="rs-filters" data-reveal>
              <div className="row">
                <span className="lbl">{copy.marketLabel}</span>
                <button
                  className="rs-chip"
                  type="button"
                  aria-pressed={market === "all"}
                  onClick={() => setMarket("all")}
                >
                  {copy.all}
                </button>
                {markets.map((option) => (
                  <button
                    className="rs-chip"
                    type="button"
                    key={option}
                    aria-pressed={market === option}
                    onClick={() => setMarket(option)}
                  >
                    {option}
                    <b>
                      {String(
                        reports.filter((r) => r.market === option).length
                      ).padStart(2, "0")}
                    </b>
                  </button>
                ))}
              </div>

              <div className="row">
                <span className="lbl">{copy.topicLabel}</span>
                <button
                  className="rs-chip"
                  type="button"
                  aria-pressed={topic === "all"}
                  onClick={() => setTopic("all")}
                >
                  {copy.all}
                </button>
                {copy.topics.map((option) => (
                  <button
                    className="rs-chip"
                    type="button"
                    key={option}
                    aria-pressed={topic === option}
                    onClick={() => setTopic(option)}
                  >
                    {option}
                    <b>
                      {String(
                        reports.filter((r) => r.topic === option).length
                      ).padStart(2, "0")}
                    </b>
                  </button>
                ))}
                <span className="rs-count">
                  {copy.count(shown, reports.length)}
                </span>
              </div>
            </div>

            <div className="rs-grid" id="rsGrid">
              {reports.map((report) => (
                <ReportCard
                  report={report}
                  hidden={!matches(report)}
                  key={report.id}
                />
              ))}
            </div>

            {shown === 0 ? (
              <div className="rs-empty">
                {copy.empty}
                <button type="button" className="link" onClick={reset}>
                  {copy.reset} <ArrowIcon />
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}

/** How the research gets written, in the order the work happens. */
export function ResearchMethod() {
  const copy = RESEARCH.method

  return (
    <section
      className="rs-method"
      id="method"
      data-surface="light"
      data-spy-section=""
    >
      <div className="wrap">
        <div>
          <p className="eyebrow" data-reveal>
            {copy.eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={copy.headline} />
          <p className="lede muted" data-reveal>
            {copy.lede}
          </p>
        </div>

        <ol className="rs-steps">
          {copy.steps.map((step, i) => (
            <li className="rs-step" key={step.title}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
