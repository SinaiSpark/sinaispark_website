"use client"

import { useState } from "react"

import { ArrowIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { cx } from "@/lib/cx"

/**
 * FAQ accordion — one answer open at a time, clicking the open one closes it.
 *
 * The open/closed state drives `.is-open`, and the CSS animates the answer's
 * grid row from 0fr to 1fr so the height transition needs no measuring.
 */
export interface FaqEntry {
  question: string
  answer: string
}

export function Faq({
  eyebrow,
  headline,
  lede,
  link,
  items,
  id = "faq",
  className = "faq",
  style,
  spy = false,
}: {
  eyebrow: string
  headline: string
  lede: string
  link: { label: string; href: string }
  items: FaqEntry[]
  id?: string
  className?: string
  style?: React.CSSProperties
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
}) {
  const [open, setOpen] = useState(0)

  return (
    <section
      className={className}
      id={id}
      data-surface="light"
      style={style}
      data-spy-section={spy ? "" : undefined}
    >
      <div className="wrap">
        <div className="faq-lead">
          <p className="eyebrow" data-reveal>
            {eyebrow}
          </p>
          <SplitText as="h2" className="h2" text={headline} />
          <p className="lede muted" data-reveal>
            {lede}
          </p>
          <SmartLink className="link" href={link.href} data-reveal>
            {link.label} <ArrowIcon />
          </SmartLink>
        </div>

        <ul className="faq-list" data-reveal>
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <li
                className={cx("faq-item", isOpen && "is-open")}
                key={item.question}
              >
                <button
                  className="faq-q"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {item.question}
                  <span className="pm" />
                </button>
                <div className="faq-a">
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
