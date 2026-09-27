import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleShell } from "@/components/article/article-shell"
import { PreviewBar } from "@/components/article/preview-bar"
import { EventGallery, EventVideos } from "@/components/events/event-gallery"
import { EventCard } from "@/components/events/events-sections"
import { ButtonArrow } from "@/components/ui/icons"
import { EVENTS } from "@/content/events"
import { ROUTES } from "@/content/site"
import { cleanArticleHtml } from "@/lib/article-html"
import { getEvent, getEvents } from "@/lib/content-api"
import { isPreviewing } from "@/lib/preview"
import { toMetadata } from "@/lib/seo"
import { getSeoSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.event(slug))
  const [event, settings] = await Promise.all([
    getEvent(slug, { draft }),
    getSeoSettings(),
  ])
  if (!event) return {}
  return toMetadata(
    event.seo,
    {
      title: event.title,
      description: event.summary,
      path: event.href,
      image: event.image,
      type: "article",
      publishedTime: event.isoDate,
    },
    settings
  )
}

/**
 * One event: the write-up beside its facts, then the photo and video
 * gallery, any YouTube or Vimeo links, and three more events.
 */
export default async function EventPage({ params }: Params) {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.event(slug))

  const [event, events] = await Promise.all([
    getEvent(slug, { draft }),
    getEvents(),
  ])
  if (!event) notFound()

  const copy = EVENTS.article
  const more = events.filter((e) => e.slug !== slug).slice(0, 3)
  const location = [event.venue, event.city].filter(Boolean).join(", ")
  const body = cleanArticleHtml(event.body)

  return (
    <ArticleShell
      image={event.image}
      crumbs={[
        { label: "Home", href: ROUTES.home },
        { label: EVENTS.hero.crumb, href: ROUTES.events },
        { label: EVENTS.roleTag[event.role] },
      ]}
      title={event.title}
      lede={event.summary}
      facts={[
        { label: copy.facts.date, value: event.date, dateTime: event.isoDate },
        { label: copy.facts.location, value: location || "–" },
        { label: copy.facts.role, value: EVENTS.roleTag[event.role] },
        { label: copy.facts.format, value: event.format || "–" },
        { label: copy.facts.market, value: event.market || "–" },
      ]}
      back={{ label: copy.back, href: ROUTES.events }}
      cta={{ headline: copy.ctaHeadline, body: copy.ctaBody, ...copy.cta }}
      preview={draft ? <PreviewBar path={event.href} /> : null}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.summary,
          startDate: event.isoDate,
          endDate: event.isoEnd || event.isoDate,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          image: [event.image, ...event.gallery.map((m) => m.src)].slice(0, 5),
          url: `${SITE.url}${event.href}`,
          location: {
            "@type": "Place",
            name: event.venue || event.city,
            address: [event.city, event.market].filter(Boolean).join(", "),
          },
          ...(event.role === "Organised"
            ? { organizer: { "@type": "Organization", name: SITE.name } }
            : {}),
        },
        event.seo?.structuredData,
      ]}
      after={
        <>
          <EventGallery items={event.gallery} title={event.title} />
          <EventVideos videos={event.videos} />
          {more.length ? (
            <section className="ar-more" data-surface="light">
              <div className="wrap">
                <p className="eyebrow">{copy.more}</p>
                <div className="ev-grid is-three">
                  {more.map((e) => (
                    <EventCard event={e} key={e.id} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      }
    >
      {event.upcoming && event.registrationUrl ? (
        <div className="ev-register">
          <div>
            <b>{copy.register.headline}</b>
            <p>{copy.register.body}</p>
          </div>
          <a
            className="btn"
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
          >
            {copy.register.label} <ButtonArrow />
          </a>
        </div>
      ) : null}

      {event.highlights.length ? (
        <div className="ev-figs" aria-label={copy.highlights}>
          {event.highlights.map((figure) => (
            <div key={figure.label}>
              <b>
                <span data-count={figure.value}>{figure.value}</span>
                {figure.suffix}
              </b>
              <span>{figure.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {body ? (
        <div className="ar-rich" dangerouslySetInnerHTML={{ __html: body }} />
      ) : null}
    </ArticleShell>
  )
}
