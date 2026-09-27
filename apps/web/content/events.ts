import { ROUTES } from "@/content/site"

/**
 * Events page copy. The events themselves (write-ups, photos and videos) come
 * from the CMS (lib/content-api.ts).
 */

/** Must match the "role" options on the CMS's Event type. */
export type EventRole = "Organised" | "Attended"

export const EVENTS = {
  hero: {
    image: "/images/events/events-hero.jpg",
    crumb: "Events",
    headline: "In the room where the Kingdom does business.",
    lede: "The forums we host for founders entering the Gulf, and the conferences, trade missions and ministry briefings where you will find our team. Photos, video and what we took away from each.",
    primary: { label: "Browse events", href: "#events" },
    /** Replaces the primary button while something is coming up. */
    primaryUpcoming: { label: "See what's coming up", href: "#upcoming" },
    secondary: { label: "Invite us to speak", href: ROUTES.consult },
    /** Stat labels under the hero; the values are counted from the events. */
    stats: { events: "Events", cities: "Cities", media: "Photos & videos" },
  },

  roles: ["Organised", "Attended"] as const satisfies readonly EventRole[],

  filter: {
    all: "All events",
    /** Plural labels for the filter pills; the singular is the event's own tag. */
    labels: {
      Organised: "Hosted by us",
      Attended: "Where we attended",
    } as Record<EventRole, string>,
    count: (n: number) => `${n} ${n === 1 ? "event" : "events"}`,
    empty: "No events of this kind yet.",
    /** Before the first event is published. */
    none: "The first write-ups are on their way.",
    reset: "Show all events",
  },

  /** How an event's role reads on its card and page. */
  roleTag: {
    Organised: "Hosted by Sinai Spark",
    Attended: "Attended",
  } as Record<EventRole, string>,

  featuredTag: "Latest event",
  mediaCount: (photos: number, videos: number) =>
    [
      photos ? `${photos} ${photos === 1 ? "photo" : "photos"}` : "",
      videos ? `${videos} ${videos === 1 ? "video" : "videos"}` : "",
    ]
      .filter(Boolean)
      .join(" · "),

  upcoming: {
    eyebrow: "Coming up",
    headline: "Where to find us next.",
    register: "Register",
    details: "Details",
  },

  archive: {
    eyebrow: "The archive",
    headline: "Every event, newest first.",
  },

  moments: {
    eyebrow: "Moments",
    headline: "From the floor.",
    lede: "A few frames from recent events. Open any event for the full gallery.",
  },

  /** Around the write-up on an event page. */
  article: {
    back: "All events",
    facts: {
      date: "Date",
      location: "Location",
      role: "Our role",
      format: "Format",
      market: "Market",
    },
    highlights: "In numbers",
    gallery: {
      eyebrow: "Gallery",
      headline: "Photos and video from the day.",
      open: (n: number) => `Open item ${n}`,
      close: "Close gallery",
      prev: "Previous",
      next: "Next",
    },
    videos: {
      eyebrow: "Watch",
      headline: "Sessions and highlights.",
      play: "Play video",
      open: "Watch on the host's site",
    },
    register: {
      headline: "Join us there.",
      body: "Registration is handled by the organiser.",
      label: "Register",
    },
    more: "More events",
    ctaHeadline: "Planning an event in the Gulf?",
    ctaBody:
      "We host founder briefings and speak at industry forums. Tell us about yours.",
    cta: { label: "Get in touch", href: ROUTES.consult },
  },

  cta: {
    eyebrow: "Speakers & partners",
    headline: "Want us at your event?",
    lede: "Our advisors speak on Saudi market entry, licensing and cross-border structuring. Tell us about the audience and the date.",
    secondary: { label: "Read the blog", href: ROUTES.blog },
    primary: { label: "Invite us to speak", href: ROUTES.consult },
  },
} as const
