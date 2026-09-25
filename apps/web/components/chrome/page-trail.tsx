"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { recordVisit } from "@/lib/enquiry-source"

/**
 * Remembers the previous page in this tab, so the contact form can record
 * where an enquiry really came from (lib/enquiry-source.ts). Renders nothing.
 */
export function PageTrail() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname) recordVisit(pathname)
  }, [pathname])
  return null
}
