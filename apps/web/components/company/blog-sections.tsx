"use client"

import { useEffect, useRef, useState } from "react"

import { ArrowIcon } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { SplitText } from "@/components/ui/split-text"
import { BLOG, type PostFormat } from "@/content/blog"
import type { Post } from "@/lib/content-api"
import { cx } from "@/lib/cx"

/**
 * The blog's filter bar, featured post and grid.
 *
 * They share one piece of state — the selected format — so they render from a
 * single component, in the design's order: sticky bar, featured post beside the
 * filing-rhythm panel, then the grid.
 *
 * Filtering hides cards rather than unmounting them, which keeps the scroll
 * entrance triggers the motion layer created pointing at live nodes. The switch
 * itself is deliberately instant: it is a control someone clicks repeatedly,
 * and animating it would only make the page feel slower.
 */
type Filter = PostFormat | "all"

export function PostCard({
  post,
  featured = false,
  hidden = false,
}: {
  post: Post
  featured?: boolean
  hidden?: boolean
}) {
  return (
    <SmartLink
      className={cx("bl-post", featured && "is-feat", hidden && "is-hidden")}
      href={post.href}
    >
      <div className="ph">
        <img src={post.image} alt={post.imageAlt} />
        <span className="tag">{featured ? BLOG.featuredTag : post.format}</span>
      </div>
      <div className="tx">
        <div className="tags">
          <span>{post.format}</span>
          <span>{post.market}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="meta">
          <time dateTime={post.isoDate}>{post.date}</time>
          <span>{post.readTime} read</span>
        </div>
      </div>
    </SmartLink>
  )
}

/** The recurring Saudi filing calendar, beside the featured post. */
function FilingRhythm() {
  const copy = BLOG.rhythm

  return (
    <aside className="bl-rhythm" data-reveal>
      <span className="hd">{copy.kicker}</span>
      <h3>{copy.headline}</h3>
      <ol>
        {copy.items.map((item) => (
          <li key={item.title}>
            <b>{item.cadence}</b>
            <div>
              <strong>{item.title}</strong>
              <small>{item.body}</small>
            </div>
          </li>
        ))}
      </ol>
      <p className="ft">
        {copy.footnote}{" "}
        <SmartLink className="link" href={copy.link.href}>
          {copy.link.label} <ArrowIcon />
        </SmartLink>
      </p>
    </aside>
  )
}

export function BlogPosts({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Filter>("all")
  const barRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null
  )

  const [featured, ...rest] = posts
  const matches = (post: Post) => active === "all" || post.format === active
  const shown = posts.filter(matches).length

  // The pill slides to the selected format. Measured rather than animated by
  // the motion layer, so it is in the right place before GSAP has loaded.
  useEffect(() => {
    const place = () => {
      const current = barRef.current?.querySelector<HTMLElement>(
        '[aria-pressed="true"]'
      )
      if (current) {
        setIndicator({ x: current.offsetLeft, w: current.offsetWidth })
      }
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [active])

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: BLOG.filter.all, count: posts.length },
    ...BLOG.formats.map((format) => ({
      id: format as Filter,
      label: BLOG.filter.labels[format],
      count: posts.filter((post) => post.format === format).length,
    })),
  ]

  return (
    <>
      <div className="spy bl-bar" id="spy">
        <div className="wrap" ref={barRef}>
          <i
            className="ind"
            style={
              indicator
                ? {
                    transform: `translateX(${indicator.x}px)`,
                    width: indicator.w,
                    opacity: 1,
                  }
                : undefined
            }
          />
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              aria-pressed={active === tab.id}
              onClick={() => setActive(tab.id)}
            >
              <b>{String(tab.count).padStart(2, "0")}</b>
              {tab.label}
            </button>
          ))}
          <span className="cnt">{BLOG.filter.count(shown)}</span>
        </div>
      </div>

      <section className="bl-feat" data-surface="light">
        <div className="wrap">
          {featured ? (
            <PostCard post={featured} featured hidden={!matches(featured)} />
          ) : null}
          <FilingRhythm />
        </div>
      </section>

      <section className="bl-posts" id="posts" data-surface="light">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow">{BLOG.allPosts}</p>
          </div>

          <div className="bl-grid" id="blGrid">
            {rest.map((post) => (
              <PostCard post={post} hidden={!matches(post)} key={post.title} />
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="bl-empty">{BLOG.filter.none}</div>
          ) : shown === 0 ? (
            <div className="bl-empty">
              {BLOG.filter.empty}
              <button
                type="button"
                className="link"
                onClick={() => setActive("all")}
              >
                {BLOG.filter.reset} <ArrowIcon />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

/** Hand-off to the research page, using the shared "up next" treatment. */
export function DeeperReading() {
  const copy = BLOG.deeper

  return (
    <section className="upnext" data-surface="light">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {copy.eyebrow}
        </p>
        <SplitText as="h2" className="h2" text={copy.headline} />
        <SmartLink className="upnext-big" href={copy.href} data-reveal>
          <span className="n">07</span>
          <div>
            <span className="k">{copy.kicker}</span>
            <h3>{copy.title}</h3>
            <p>{copy.body}</p>
          </div>
          <span className="go">
            <ArrowIcon />
          </span>
        </SmartLink>
      </div>
    </section>
  )
}
