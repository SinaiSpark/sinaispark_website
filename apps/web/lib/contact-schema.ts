import { z } from "zod"

/**
 * Consultation form field set — exactly as specified in the revised content
 * document (§6 Contact Page).
 */
export const SERVICE_OPTIONS = [
  "Company Formation",
  "Licensing",
  "Legal Advisory",
  "PRO & Visa",
  "Compliance",
  "Property Management",
  "India Company Formation",
] as const

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name."),
  companyName: z.string().trim().optional().default(""),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone or WhatsApp number so we can reach you.")
    .max(24, "That number looks too long."),
  country: z.string().trim().min(1, "Please tell us which country you are in."),
  serviceOfInterest: z.enum(SERVICE_OPTIONS, {
    message: "Please choose the service you are interested in.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about your business and goals (10+ characters).")
    .max(2000, "Message is too long — please keep it under 2000 characters."),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
