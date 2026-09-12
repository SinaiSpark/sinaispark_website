import type { ImageKey } from "@/lib/images"

/**
 * "The minds behind Sinai Spark" — the home page team section.
 *
 * PENDING_CLIENT_DATA: names, photographs and biographies have not been
 * supplied. Roles are illustrative and the cards render a placeholder mark
 * until real people are provided. Give a member a `name` and `photo` and the
 * card switches to the real treatment automatically.
 */

export interface TeamMember {
  /** Null until the client supplies the real name. */
  name: string | null
  role: string
  bio: string
  /** Null until a portrait is supplied; falls back to the brand mark. */
  photo: ImageKey | string | null
  linkedin: string | null
}

export const TEAM = {
  eyebrow: "The minds behind Sinai Spark",
  headline: "Advisors who have sat on both sides of the ministry desk.",
  lede: "Licensing specialists, in-house counsel and government-relations officers, now working as one team on your market entry.",
  placeholderName: "Name pending",
  placeholderPhoto: "Photo pending",
  note: "Pending client data — names, photographs and biographies to be supplied. Roles shown are illustrative.",
  members: [
    {
      name: null,
      role: "Founder & Managing Director",
      bio: "Sets the strategy for every engagement and leads the Saudi practice from Riyadh.",
      photo: null,
      linkedin: null,
    },
    {
      name: null,
      role: "Head of Legal & Regulatory",
      bio: "Reads the regulation in its own language and turns it into a structure that holds.",
      photo: null,
      linkedin: null,
    },
    {
      name: null,
      role: "Head of PRO & Government Relations",
      bio: "Owns the daily relationship with MISA, the ministries and the labour offices.",
      photo: null,
      linkedin: null,
    },
    {
      name: null,
      role: "Head of India Desk",
      bio: "Cross-border structuring and FEMA for NRI founders registering in India.",
      photo: null,
      linkedin: null,
    },
  ] satisfies TeamMember[],
}
