import type { ComponentType } from "react"
import type { StrapiApp } from "@strapi/strapi/admin"
import {
  ChartPie,
  Clock,
  Feather,
  Lightning,
  Mail,
  Message,
} from "@strapi/icons"
import "@fontsource-variable/manrope"
import "@fontsource-variable/schibsted-grotesk"

import logo from "./extensions/logo.svg"
import mark from "./extensions/mark.svg"
import { applyAdminStyles } from "./admin-styles"
import { SchedulePanel } from "./panels/SchedulePanel"

/** Brand teal (#16959f) as Strapi's primary scale. */
const teal = {
  primary100: "#e8f5f6",
  primary200: "#b9e2e5",
  primary500: "#16959f",
  primary600: "#127e87",
  primary700: "#0e656c",
  buttonPrimary500: "#16959f",
  buttonPrimary600: "#127e87",
}

/** The home screen, top to bottom. Strapi's own cards follow, minus these. */
const HOME_ORDER = [
  "quick-actions",
  "leads",
  "recent-enquiries",
  "content",
  "scheduled",
]
const HOME_HIDDEN = ["profile-info"]

export default {
  config: {
    locales: [],
    auth: { logo },
    menu: { logo: mark },
    head: { favicon: mark },
    theme: {
      light: { colors: teal },
      dark: {
        colors: {
          ...teal,
          primary100: "#0e2a2d",
          primary200: "#134349",
          primary600: "#3fb3bc",
          primary700: "#7fd0d6",
        },
      },
    },
    translations: {
      en: {
        "Auth.form.welcome.title": "Sinai Spark Global",
        "Auth.form.welcome.subtitle": "Sign in to manage the website",
        "app.components.LeftMenu.navbrand.title": "Sinai Spark",
        "app.components.LeftMenu.navbrand.workplace": "Website admin",
        "HomePage.header.subtitle":
          "Write, publish and follow up on enquiries from one place.",
      },
    },
    tutorials: false,
    notifications: { releases: false },
  },

  register(app: StrapiApp) {
    app.customFields.register({
      name: "rich-text",
      type: "richtext",
      icon: Feather,
      intlLabel: {
        id: "sinaispark.rich-text.label",
        defaultMessage: "Article editor",
      },
      intlDescription: {
        id: "sinaispark.rich-text.description",
        defaultMessage:
          "Write with '/' blocks: headings, images, tables and video",
      },
      components: {
        Input: async () =>
          import("./rich-text/RichTextInput").then((m) => ({
            // Strapi types the input as prop-less; it passes name, label etc.
            default: m.RichTextInput as unknown as ComponentType,
          })),
      },
    })

    app.widgets.register([
      {
        id: "quick-actions",
        icon: Lightning,
        title: {
          id: "sinaispark.widgets.quick-actions",
          defaultMessage: "Start here",
        },
        component: () =>
          import("./widgets/QuickActionsWidget").then(
            (m) => m.QuickActionsWidget
          ),
      },
      {
        id: "leads",
        icon: Mail,
        title: { id: "sinaispark.widgets.leads", defaultMessage: "Leads" },
        link: {
          label: {
            id: "sinaispark.widgets.leads.link",
            defaultMessage: "Open enquiries",
          },
          href: "/content-manager/collection-types/api::enquiry.enquiry",
        },
        component: () =>
          import("./widgets/LeadsWidget").then((m) => m.LeadsWidget),
      },
      {
        id: "recent-enquiries",
        icon: Message,
        title: {
          id: "sinaispark.widgets.recent-enquiries",
          defaultMessage: "Latest enquiries",
        },
        link: {
          label: {
            id: "sinaispark.widgets.recent-enquiries.link",
            defaultMessage: "See all",
          },
          href: "/content-manager/collection-types/api::enquiry.enquiry?sort=createdAt:DESC",
        },
        component: () =>
          import("./widgets/RecentEnquiriesWidget").then(
            (m) => m.RecentEnquiriesWidget
          ),
      },
      {
        id: "content",
        icon: ChartPie,
        title: {
          id: "sinaispark.widgets.content",
          defaultMessage: "Articles",
        },
        component: () =>
          import("./widgets/ContentWidget").then((m) => m.ContentWidget),
      },
      {
        id: "scheduled",
        icon: Clock,
        title: {
          id: "sinaispark.widgets.scheduled",
          defaultMessage: "Scheduled posts",
        },
        component: () =>
          import("./widgets/ScheduledWidget").then((m) => m.ScheduledWidget),
      },
    ])

    // Ours first in HOME_ORDER, then Strapi's own, minus the profile card.
    app.widgets.register((widgets) => {
      const rank = (id: string) => {
        const i = HOME_ORDER.indexOf(id)
        return i === -1 ? HOME_ORDER.length : i
      }
      return widgets
        .filter((w) => !HOME_HIDDEN.includes(w.id))
        .sort((a, b) => rank(a.id) - rank(b.id))
    })
  },

  bootstrap(app: StrapiApp) {
    applyAdminStyles()

    // "Schedule" sits right under the Publish/Save box.
    const cm = app.getPlugin("content-manager") as unknown as {
      apis: {
        addEditViewSidePanel: (
          reducer: (panels: unknown[]) => unknown[]
        ) => void
      }
    }
    cm.apis.addEditViewSidePanel((panels) => [
      ...panels.slice(0, 1),
      SchedulePanel,
      ...panels.slice(1),
    ])
  },
}
