"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Link that keeps the design's smooth-scrolling behaviour.
 *
 * Anchors are written in full — `/#markets`, `/contact/#form` — so they work
 * from anywhere. When the visitor is already on that page the link collapses to
 * a bare `#form`, which the Lenis handler picks up and scrolls to smoothly;
 * from any other page it stays a real route link so navigation still works.
 * Everything else is an ordinary Next link.
 */
export function SmartLink({
  href,
  children,
  ...rest
}: { href: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname()

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  const [path, hash] = href.split("#")
  const target = path === "" ? "/" : path
  if (hash && target === pathname) {
    return (
      <a
        href={`#${hash}`}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
