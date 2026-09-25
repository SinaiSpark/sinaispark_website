/**
 * The email-capture band shared by the blog and research pages. Only the
 * framing copy differs between the two, so that lives with each page; the form
 * itself always says the same thing.
 */
export const NEWSLETTER = {
  emailLabel: "Email address",
  placeholder: "you@company.com",
  submit: "Notify me",
  disclaimer: "One email per publication. Unsubscribe any time.",
  failure: "We couldn't save your email just now. Please try again shortly.",
  done: "You're on the list. One email per publication, no noise.",
} as const
