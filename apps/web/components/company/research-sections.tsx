"use client"

import { useState } from "react"

import { BrandMark } from "@/components/ui/brand-mark"
import { ArrowIcon, ButtonArrow, LockIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { BRAND } from "@/content/site"
import { REPORTS, RESEARCH, type Market, type Topic } from "@/content/research"
import { cx } from "@/lib/cx"

/**
 * Research page sections: the featured report, the filterable library and the
 * method behind the reports.
 *
 * Nothing is downloadable yet, so every card and button leads to the contact
 * page and the gated ones say "request access" rather than pretending at a
 * file. The catalogue carries a pending flag of its own.
 */

/** The flagship report, shown as a cover that tilts toward the pointer. */
export function FeaturedReport() {
  const copy = RESEARCH.featured
  const report = copy.report

  return (
    <section
      className="rs-feat"
      id="featured"
      data-surface="dark"
      data-spy-section=""
    >
      <div className="wrap">
        <div className="rs-cover-wrap" data-reveal>
          <div className="rs-cover" id="rsCover">
            <BrandMark className="mk" />
            <div className="hd">
              <span>{copy.cover.kicker}</span>
              <span>{copy.cover.edition}</span>
            </div>
            <h3>{report.title}</h3>
            <div className="ft">
              <img src="/brand/logo-white.svg" alt={BRAND.name} />
              <span>
                {report.pages} pages · {report.readTime} read
              </span>
              <span>{copy.cover.footnote}</span>
            </div>
          </div>
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

          <ul className="rs-inside" data-reveal>
            {copy.inside.map((line, i) => (
              <li key={line}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                {line}
              </li>
            ))}
          </ul>

          <div className="d-actions" style={{ marginTop: 0 }} data-reveal>
            <SmartLink className="btn" href={copy.primary.href} data-magnetic>
              {copy.primary.label} <ButtonArrow />
            </SmartLink>
            <a className="link" href={copy.link.href}>
              {copy.link.label} <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The catalogue, filterable by market and by topic.
 *
 * Cards are hidden rather than unmounted so the entrance triggers the motion
 * layer created keep pointing at live nodes.
 */
type MarketFilter = Market | "all"
type TopicFilter = Topic | "all"

export function ReportLibrary() {
  const copy = RESEARCH.library
  const [market, setMarket] = useState<MarketFilter>("all")
  const [topic, setTopic] = useState<TopicFilter>("all")

  const matches = (report: (typeof REPORTS)[number]) =>
    (market === "all" || report.market === market) &&
    (topic === "all" || report.topic === topic)
  const shown = REPORTS.filter(matches).length

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
          <span className="mock" data-reveal>
            {copy.note}
          </span>
        </div>

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
            {copy.markets.map((option) => (
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
                    REPORTS.filter((r) => r.market === option).length
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
                    REPORTS.filter((r) => r.topic === option).length
                  ).padStart(2, "0")}
                </b>
              </button>
            ))}
            <span className="rs-count">
              {copy.count(shown, REPORTS.length)}
            </span>
          </div>
        </div>

        <div className="rs-grid" id="rsGrid">
          {REPORTS.map((report) => (
            <SmartLink
              className={cx("rs-card", !matches(report) && "is-hidden")}
              href={copy.href}
              key={report.title}
            >
              <div className="rs-thumb">
                <img src={report.image} alt="" />
                <span className="tag">{report.topic}</span>
                {report.gated ? (
                  <span className="rs-lock">
                    <LockIcon />
                    {copy.gatedLabel}
                  </span>
                ) : null}
                <span className="pg" aria-hidden="true">
                  {report.pages}
                  <small>pp</small>
                </span>
              </div>
              <div className="tx">
                <div className="tags">
                  <span>{report.market}</span>
                  <span>{report.date}</span>
                </div>
                <h3>{report.title}</h3>
                <p>{report.summary}</p>
                <div className="meta">
                  <span>{report.readTime} read</span>
                  <span className="dl">
                    {report.gated ? copy.request : copy.download} <ArrowIcon />
                  </span>
                </div>
              </div>
            </SmartLink>
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
      </div>
    </section>
  )
}

/** How a report gets written, in the order the work happens. */
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
