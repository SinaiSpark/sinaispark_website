import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"

import { CONSULT } from "@/content/home"

/**
 * What the consultation form (components/home/consult-form.tsx) sends to
 * /api/enquiry. The market and service options are read from the form's own
 * copy, so the dropdowns and the validation can never drift apart.
 */
export const MARKET_OPTIONS = CONSULT.markets.map((m) => m.label)
export const SERVICE_OPTIONS = CONSULT.services

const optional = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().default("")

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "That name looks too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  /** Full international number from the phone field ("+966 50 123 4567"). */
  phone: optional(32, "That number looks too long.").refine(
    (phone) => !phone || isValidPhoneNumber(phone),
    "Please check the phone number."
  ),
  market: z.enum(MARKET_OPTIONS as [string, ...string[]], {
    message: "Please choose a market.",
  }),
  service: z.enum(SERVICE_OPTIONS as unknown as [string, ...string[]], {
    message: "Please choose what you need.",
  }),
  message: optional(2000, "Please keep the message under 2000 characters."),
  /**
   * The page the visitor was on before the contact form (a site path), or
   * null when they opened the contact page directly. The API route turns it
   * into the "Came from" label (lib/enquiry-label.ts).
   */
  from: z
    .string()
    .trim()
    .max(200)
    .regex(/^\/[\w\-./]*$/)
    .nullish()
    .catch(null),
  /** Honeypot: hidden from people, filled in by bots. Must stay empty. */
  website: z.string().max(0).optional().default(""),
})

export type Enquiry = z.infer<typeof enquirySchema>

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  source: z.enum(["Newsletter", "Research gate"]).default("Newsletter"),
  /** documentId of the research article being unlocked. */
  research: z.string().trim().max(64).optional(),
  /** Research readers can also opt in to the newsletter. */
  newsletter: z.boolean().optional().default(false),
  website: z.string().max(0).optional().default(""),
})

export type Subscribe = z.infer<typeof subscribeSchema>
