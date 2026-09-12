"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ButtonArrow, ChevronIcon, ArrowIcon } from "@/components/ui/icons"
import { Clock } from "@/components/ui/clock"
import { SmartLink } from "@/components/ui/smart-link"
import { BRAND, CLOCKS, MEGA, NAV, ROUTES, SHEET } from "@/content/site"
import { cx } from "@/lib/cx"

/**
 * Header and mobile sheet.
 *
 * They share one piece of state — whether the sheet is open — so they live in
 * the same component and render as siblings, matching the design's DOM order
 * (header, then sheet, then main).
 *
 * The nav's scrolled / hidden / light classes are driven by ScrollTrigger in
 * lib/motion, not from here.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the sheet on navigation, and keep the body lock in sync with it.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.classList.toggle("is-sheet", open)
    return () => document.body.classList.remove("is-sheet")
  }, [open])

  return (
    <>
      <header className="nav" id="nav">
        <div className="wrap">
          <Link
            className="nav-logo"
            href={ROUTES.home}
            aria-label={BRAND.homeAriaLabel}
          >
            {/* Two lockups: the light one sits on dark sections, the dark one on light. */}
            <img
              className="logo-light"
              src="/brand/logo-white.svg"
              alt={BRAND.name}
            />
            <img className="logo-dark" src="/brand/logo.svg" alt={BRAND.name} />
          </Link>

          <ul className="nav-links">
            <li className="nav-item">
              <Link href={MEGA.trigger.href} aria-haspopup="true">
                {MEGA.trigger.label} <ChevronIcon />
              </Link>
              <div className="mega">
                <div className="mega-in">
                  {MEGA.columns.map((col) => (
                    <div key={col.heading}>
                      <h5>{col.heading}</h5>
                      <ul>
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href}>
                              {item.label}
                              {item.description ? (
                                <small>{item.description}</small>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="feat">
                    <img src={MEGA.feature.image} alt="" />
                    <b>{MEGA.feature.title}</b>
                    <span>{MEGA.feature.body}</span>
                    <SmartLink href={MEGA.feature.cta.href}>
                      {MEGA.feature.cta.label}{" "}
                      <svg
                        viewBox="0 0 16 16"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 12 12 4M6 4h6v6" />
                      </svg>
                    </SmartLink>
                  </div>
                </div>
              </div>
            </li>
            {NAV.links.map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href}>{link.label}</SmartLink>
              </li>
            ))}
          </ul>

          <SmartLink className="btn nav-cta" href={NAV.cta.href} data-magnetic>
            {NAV.cta.label} <ButtonArrow />
          </SmartLink>

          <button
            className="nav-burger"
            id="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className="lbl">
              <i>{NAV.burger.open}</i>
              <i>{NAV.burger.close}</i>
            </span>
            <span className="ico">
              <b />
              <b />
              <b />
            </span>
          </button>
        </div>
      </header>

      <nav
        className={cx("nav-sheet", open && "is-open")}
        id="sheet"
        aria-label="Mobile"
      >
        <div className="sheet-big">
          {SHEET.primary.map((link) => (
            <SmartLink
              key={link.href + link.label}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label} <ArrowIcon />
            </SmartLink>
          ))}
        </div>

        <div className="sheet-svc">
          {SHEET.groups.map((group) => (
            <div key={group.heading}>
              <h5>{group.heading}</h5>
              <div className="sheet-grid">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sheet-foot">
          <SmartLink
            className="btn"
            href={SHEET.cta.href}
            onClick={() => setOpen(false)}
          >
            {SHEET.cta.label} <ButtonArrow />
          </SmartLink>
          <div className="clocks">
            {CLOCKS.map((clock) => (
              <span key={clock.timeZone}>
                {clock.city} <Clock timeZone={clock.timeZone} />
              </span>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
