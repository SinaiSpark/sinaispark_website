/**
 * The email-capture band shared by the blog and research pages. Only the
 * framing copy differs between the two, so that lives with each page; the form
 * itself always says the same thing.
 *
 * FRONTEND ONLY: no provider is connected, nothing is stored, and the form
 * says so under the field.
 */
export const NEWSLETTER = {
  emailLabel: "Email address",
  placeholder: "you@company.com",
  submit: "Notify me",
  disclaimer: "Prototype — not connected yet. Provider to be confirmed.",
  done: "You're on the list. One email per publication, no noise.",
} as const
