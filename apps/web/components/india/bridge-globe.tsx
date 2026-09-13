"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

import { BRIDGE_GLOBE } from "@/content/india-page"

/**
 * The rotating globe behind the NRI bridge, with an arc from each of our
 * markets into Mumbai.
 *
 * three.js, three-globe and React Three Fiber are about a megabyte between
 * them, so this is deliberately expensive to show and deliberately cheap to
 * not show:
 *
 * - `ssr: false` keeps the whole stack out of the server render and out of the
 *   initial JS payload; it is fetched only once this component decides to
 *   mount it.
 * - Nothing loads until the section is close to the viewport. The bridge sits
 *   well down the India page, so most visitors reach it late or never.
 * - Visitors who ask for reduced motion get the globe without the spin.
 *
 * It is decorative, so the canvas takes no pointer events — dragging it would
 * otherwise fight the page's smooth scrolling, and there is nothing to click.
 */
const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false }
)

export function BridgeGlobe() {
  const host = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [spin, setSpin] = useState(true)

  useEffect(() => {
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)")
    setSpin(!motionOff.matches)

    const el = host.current
    if (!el) return

    // Start fetching a screen before it arrives so it is ready on arrival.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: "800px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="bglobe" ref={host} aria-hidden="true">
      {show ? (
        <World
          data={BRIDGE_GLOBE.arcs}
          globeConfig={{
            ...BRIDGE_GLOBE.config,
            // The globe is held still by default; this only ever takes
            // rotation away, never adds it.
            autoRotate: BRIDGE_GLOBE.config.autoRotate && spin,
          }}
        />
      ) : null}
    </div>
  )
}
