"use client"

import { useEffect, useState } from "react"

/**
 * Live local time for one market.
 *
 * Renders the design's `--:--` placeholder on the server and fills in after
 * mount, so the server and client markup always agree. Ticks every 15 seconds,
 * like the design did.
 */

const PLACEHOLDER = "--:--"

export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState(PLACEHOLDER)

  useEffect(() => {
    const format = () => {
      try {
        return new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        }).format(new Date())
      } catch {
        return PLACEHOLDER
      }
    }
    setTime(format())
    const id = window.setInterval(() => setTime(format()), 15000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}

export function Clock({
  timeZone,
  as: Tag = "b",
  className,
}: {
  timeZone: string
  as?: "b" | "span" | "time"
  className?: string
}) {
  const time = useLocalTime(timeZone)
  return (
    <Tag className={className} suppressHydrationWarning>
      {time}
    </Tag>
  )
}
