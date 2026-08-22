"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { HOME } from "@/lib/content/home"
import { IMAGES, type ImageKey } from "@/lib/images"
import { cn } from "@workspace/ui/lib/utils"

/**
 * What We Do — editorial index rows (§13): divider-separated numbered list,
 * hovering a row reveals its supporting image. Deliberately not a card grid.
 */
export function ServiceIndex() {
  const [activeKey, setActiveKey] = useState<ImageKey | null>(
    HOME.whatWeDo.items[0]?.imageKey ?? null
  )
  const activeAsset = activeKey ? IMAGES[activeKey] : null

  return (
    <section aria-labelledby="what-we-do-title" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            {HOME.whatWeDo.eyebrow}
          </p>
          <h2
            id="what-we-do-title"
            className="text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl"
          >
            {HOME.whatWeDo.title}
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <ol className="divide-y divide-border border-t border-b border-border">
            {HOME.whatWeDo.items.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setActiveKey(item.imageKey)}
                  onFocus={() => setActiveKey(item.imageKey)}
                  className={cn(
                    "group relative flex items-center gap-5 py-5 pr-2 pl-1 transition-colors outline-none focus-visible:bg-accent",
                    "hover:bg-accent/50"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="w-8 font-mono text-sm text-muted-foreground tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-lg font-medium tracking-tight transition-colors",
                        "group-hover:text-primary group-focus-visible:text-primary"
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className={cn(
                      "size-5 shrink-0 transition-all duration-200",
                      "-translate-x-1 translate-y-1 text-primary opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ol>

          <div
            className="relative hidden overflow-hidden rounded-lg lg:block"
            aria-hidden="true"
          >
            {activeAsset ? (
              <Image
                src={activeAsset.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 0px"
                quality={80}
                className="object-cover"
                style={
                  activeAsset.focal
                    ? { objectPosition: activeAsset.focal }
                    : undefined
                }
              />
            ) : (
              <div className="absolute inset-0 bg-primary" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
