import Link from "next/link"

import { ArrowIcon } from "@/components/ui/icons"

/**
 * Sticky sub-navigation. The pill indicator slides to whichever section is in
 * view; the motion layer owns that, reading `data-spy` here and
 * `data-spy-section` on the sections themselves.
 *
 * It sits under the header and rises to the top when the header hides, which
 * the stylesheet handles with `body:has(#nav.is-hidden)`.
 */
export function SpyNav({
  items,
  extra,
}: {
  items: { id: string; label: string }[]
  extra?: { label: string; href: string }
}) {
  return (
    <div className="spy" id="spy">
      <div className="wrap">
        <i className="ind" />
        {items.map((item, i) => (
          <a href={`#${item.id}`} data-spy={item.id} key={item.id}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            {item.label}
          </a>
        ))}
        {extra ? (
          <Link className="spy-x" href={extra.href}>
            {extra.label} <ArrowIcon />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
