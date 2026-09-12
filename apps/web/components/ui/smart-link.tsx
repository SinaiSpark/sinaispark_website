"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Link that keeps the design's smooth-scrolling behaviour.
 *
 * Anchors written as `/#who` point at a section of the home page. When the
 * visitor is already on the home page it renders a bare `#who`, which the Lenis
 * handler picks up and scrolls to; from any other page it stays a real route
 * link so navigation still works. Everything else is an ordinary Next link.
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
  const isHomeAnchor = Boolean(hash) && (path === "/" || path === "")
  if (isHomeAnchor && pathname === "/") {
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
