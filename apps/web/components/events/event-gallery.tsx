"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import {
  ArrowIcon,
  ChevronIcon,
  CloseIcon,
  PlayIcon,
} from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { EVENTS } from "@/content/events"
import type { EventMedia } from "@/lib/content-api"
import { cx } from "@/lib/cx"
import { toVideoEmbed } from "@/lib/video-embed"

const copy = EVENTS.article

/** Tiles shown before the "+N more" tile; the lightbox still has them all. */
const GRID_LIMIT = 11

/**
 * An event's photos and uploaded clips: a bento grid, and a full-screen
 * viewer that steps through every item with the arrow keys or a swipe.
 *
 * The viewer is portalled to <body> so no transformed ancestor (the motion
 * layer animates sections) can trap its fixed positioning, and it holds the
 * page still while open: Lenis ignores it (data-lenis-prevent) and wheel and
 * touch scrolling are cancelled on it.
 */
export function EventGallery({
  items,
  title,
}: {
  items: EventMedia[]
  title: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items.length) return null

  const visible = items.slice(0, GRID_LIMIT)
  const extra = items.length - visible.length

  return (
    <section className="ev-gallery" id="gallery" data-surface="dark">
      <div className="wrap">
        <div className="ev-gallery-head">
          <div>
            <p className="eyebrow">{copy.gallery.eyebrow}</p>
            <SplitText as="h2" className="h2" text={copy.gallery.headline} />
          </div>
          <span className="ev-gallery-count">
            {EVENTS.mediaCount(
              items.filter((i) => i.kind === "image").length,
              items.filter((i) => i.kind === "video").length
            )}
          </span>
        </div>

        <ul className={cx("ev-bento", items.length < 4 && "is-few")}>
          {visible.map((item, i) => (
            <li key={`${item.src}-${i}`}>
              <button
                type="button"
                className="ev-tile"
                onClick={() => setOpen(i)}
                aria-label={item.alt || copy.gallery.open(i + 1)}
              >
                <Thumb item={item} />
                {extra > 0 && i === visible.length - 1 ? (
                  <span className="ev-more">+{extra + 1}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null ? (
        <Lightbox
          items={items}
          index={open}
          title={title}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  )
}

/** A grid tile. Clips play silently while hovered, as a preview. */
function Thumb({ item }: { item: EventMedia }) {
  const ref = useRef<HTMLVideoElement>(null)

  if (item.kind === "image") {
    return <img src={item.src} alt={item.alt} loading="lazy" />
  }
  return (
    <span
      className="ev-clip"
      onPointerEnter={() => void ref.current?.play().catch(() => {})}
      onPointerLeave={() => ref.current?.pause()}
    >
      {/* #t=0.1 makes browsers paint the first frame as the poster. */}
      <video
        ref={ref}
        src={`${item.src}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <span className="ev-play" aria-hidden="true">
        <PlayIcon />
      </span>
    </span>
  )
}

function Lightbox({
  items,
  index,
  title,
  onIndex,
  onClose,
}: {
  items: EventMedia[]
  index: number
  title: string
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const item = items[index]!
  const count = items.length

  const step = useCallback(
    (by: number) => onIndex((index + by + count) % count),
    [index, count, onIndex]
  )

  // Keyboard: arrows step, Escape closes, Tab stays inside the viewer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
      else if (e.key === "Tab" && rootRef.current) {
        const focusable = rootRef.current.querySelectorAll<HTMLElement>(
          "button, video[controls]"
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [step, onClose])

  // Hold the page still, and hand focus back to where it was on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const root = rootRef.current
    const stop = (e: Event) => e.preventDefault()
    root?.addEventListener("wheel", stop, { passive: false })
    root?.addEventListener("touchmove", stop, { passive: false })
    document.documentElement.classList.add("ev-lb-open")
    return () => {
      root?.removeEventListener("wheel", stop)
      root?.removeEventListener("touchmove", stop)
      document.documentElement.classList.remove("ev-lb-open")
      previous?.focus()
    }
  }, [])

  return createPortal(
    <div
      className="ev-lb"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      ref={rootRef}
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        const start = touchX.current
        const end = e.changedTouches[0]?.clientX
        touchX.current = null
        if (start == null || end == null || Math.abs(end - start) < 40) return
        step(end < start ? 1 : -1)
      }}
    >
      <div className="ev-lb-bar">
        <span className="ev-lb-count">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </span>
        <span className="ev-lb-title">{title}</span>
        <button
          type="button"
          className="ev-lb-close"
          onClick={onClose}
          ref={closeRef}
          aria-label={copy.gallery.close}
        >
          <CloseIcon />
        </button>
      </div>

      <figure className="ev-lb-stage" key={index}>
        {item.kind === "image" ? (
          <img src={item.src} alt={item.alt} />
        ) : (
          <video src={item.src} controls autoPlay playsInline />
        )}
        {item.caption || item.alt ? (
          <figcaption>{item.caption || item.alt}</figcaption>
        ) : null}
      </figure>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="ev-lb-nav is-prev"
            onClick={() => step(-1)}
            aria-label={copy.gallery.prev}
          >
            <ChevronIcon />
          </button>
          <button
            type="button"
            className="ev-lb-nav is-next"
            onClick={() => step(1)}
            aria-label={copy.gallery.next}
          >
            <ChevronIcon />
          </button>
        </>
      ) : null}
    </div>,
    document.body
  )
}

/**
 * YouTube and Vimeo links. Each shows a still until pressed, so a page with
 * several videos does not load several players up front.
 */
export function EventVideos({
  videos,
}: {
  videos: { title: string; url: string }[]
}) {
  if (!videos.length) return null
  return (
    <section className="ev-videos" id="videos" data-surface="dark">
      <div className="wrap">
        <p className="eyebrow">{copy.videos.eyebrow}</p>
        <SplitText as="h2" className="h2" text={copy.videos.headline} />
        <div className={cx("ev-vgrid", videos.length === 1 && "is-one")}>
          {videos.map((video) => (
            <VideoTile video={video} key={video.url} />
          ))}
        </div>
      </div>
    </section>
  )
}

const hqStill = (src: string) => src.replace("maxresdefault", "hqdefault")

function VideoTile({ video }: { video: { title: string; url: string } }) {
  const [playing, setPlaying] = useState(false)
  const embed = toVideoEmbed(video.url)

  // Not a host we can embed: a plain link out.
  if (!embed) {
    return (
      <a
        className="ev-vtile is-link"
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ev-vframe">
          <span className="ev-play" aria-hidden="true">
            <ArrowIcon />
          </span>
        </span>
        <span className="ev-vtitle">{video.title || copy.videos.open}</span>
      </a>
    )
  }

  return (
    <div className="ev-vtile">
      <div className="ev-vframe">
        {playing ? (
          <iframe
            src={embed.embedUrl}
            title={video.title || copy.videos.play}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${copy.videos.play}: ${video.title}`}
          >
            {embed.thumbnail ? (
              <img
                src={embed.thumbnail}
                alt=""
                loading="lazy"
                // Older and smaller uploads have no max-resolution still;
                // YouTube answers with a 120px placeholder or a 404.
                onLoad={(e) => {
                  const img = e.currentTarget
                  if (img.naturalWidth <= 120) img.src = hqStill(img.src)
                }}
                onError={(e) => {
                  e.currentTarget.src = hqStill(e.currentTarget.src)
                }}
              />
            ) : null}
            <span className="ev-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </button>
        )}
      </div>
      {video.title ? <span className="ev-vtitle">{video.title}</span> : null}
    </div>
  )
}
