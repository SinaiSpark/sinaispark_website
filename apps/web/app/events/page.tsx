import { CtaSection } from "@/components/chrome/cta-section"
import { EventMoments, UpcomingEvents } from "@/components/events/events-bands"
import { EventsBrowser } from "@/components/events/events-sections"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { EVENTS } from "@/content/events"
import { ROUTES } from "@/content/site"
import { getEvents } from "@/lib/content-api"
import { pageMetadata } from "@/lib/seo"

export function generateMetadata() {
  return pageMetadata({
    title: "Events",
    description: EVENTS.hero.lede,
    path: ROUTES.events,
  })
}

/**
 * Events: the ones Sinai Spark hosts and the ones its team attends, each
 * with a write-up, photos and video from the CMS.
 *
 * Upcoming events get their own band up top, soonest first; everything that
 * has happened goes into the filterable archive, grouped by year, and its
 * photos feed the moving wall further down.
 */
export default async function EventsPage() {
  const events = await getEvents()
  const upcoming = events
    .filter((event) => event.upcoming)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
  const past = events.filter((event) => !event.upcoming)

  const cities = new Set(events.map((event) => event.city).filter(Boolean))
  const media = events.reduce(
    (sum, event) => sum + event.photoCount + event.videoCount,
    0
  )
  const labels = EVENTS.hero.stats
  const primary = upcoming.length
    ? EVENTS.hero.primaryUpcoming
    : EVENTS.hero.primary

  return (
    <PageMotion variant="company">
      <PageHero
        className="dhero bl-hero ev-hero"
        image={EVENTS.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: EVENTS.hero.crumb },
        ]}
        headline={EVENTS.hero.headline}
        lede={EVENTS.hero.lede}
        stats={[
          { value: events.length, label: labels.events },
          { value: cities.size, label: labels.cities },
          { value: media, label: labels.media },
        ]}
        actions={
          <div className="d-actions">
            <SmartLink className="btn" href={primary.href} data-magnetic>
              {primary.label} <ButtonArrow down />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={EVENTS.hero.secondary.href}
              data-magnetic
            >
              {EVENTS.hero.secondary.label} <ButtonArrow />
            </SmartLink>
          </div>
        }
      />

      <UpcomingEvents events={upcoming} />

      <EventsBrowser events={past} />

      <EventMoments events={past} />

      <CtaSection
        eyebrow={EVENTS.cta.eyebrow}
        headline={EVENTS.cta.headline}
        lede={EVENTS.cta.lede}
        secondary={EVENTS.cta.secondary}
        primary={EVENTS.cta.primary}
      />
    </PageMotion>
  )
}
