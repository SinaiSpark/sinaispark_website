# Pending Client Data — BD Confirmation Tracker

> **Purpose:** Every figure, quote and address currently shown on the site is
> **MOCK placeholder data** so the site renders complete for review. Each item
> below must be confirmed or replaced by the BDM / sales team **before go-live**
> (per `website content reviswd.pdf` §10: "Confirm the real figures with the BDM
> and sales team before anything goes live").
>
> **Legend:** 🔴 blocks launch · 🟡 should confirm · ✅ confirmed

---

## 1. Home — Snapshot Stats (CMS → **Home page → Track record stats**)

Editable in the admin: number, suffix (e.g. +) and label, up to four.

| Stat                  | Mock value shown | Real value    | Status |
| --------------------- | ---------------- | ------------- | ------ |
| Years of Experience   | 12+              | ☐             | 🔴     |
| Happy Clients         | 250+             | ☐             | 🔴     |
| Countries Served      | 5                | ☐ (5 per PDF) | 🟡     |
| Skilled Professionals | 40+              | ☐             | 🔴     |

## 2. Home — Testimonials (CMS → **Testimonial**)

The three mock quotes (Ahmed K., Sarah M., Rajesh P.) have been deleted.

The 54 real Google reviews (Dammam listing, 4.9★) are in the admin as
**drafts**. Pick the ones to show and publish them; each card links to the
review on Google. Until at least one is published, the home page has no
testimonial section. Reviews added later on Google are added by hand.

| Item                              | Status |
| --------------------------------- | ------ |
| Publish the chosen Google reviews | 🔴     |

## 3. India Landing Page — Package Fees (`lib/content/india.ts` → INDIA.pricing)

PDF: "Insert current fees per package before publishing. The site should quote
actual pricing."

| Package                        | Mock fee shown | Real fee | Status |
| ------------------------------ | -------------- | -------- | ------ |
| Starter (OPC / Sole Prop.)     | ₹9,999         | ☐        | 🔴     |
| Professional (Private Limited) | ₹18,999        | ☐        | 🔴     |
| Partnership (LLP Formation)    | ₹14,999        | ☐        | 🔴     |

Also confirm: are fees one-time? Do they include government fees?

## 4. Contact Details (CMS → **Contact details**)

| Field                  | Value shown                       | Source                                                                         | Status           |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------ | ---------------- |
| Email                  | info@sinaispark.com               | PDF                                                                            | 🟡 confirm       |
| Phone (displayed)      | +966 51 001 3160                  | Old live site — may be outdated. The Google listing shows **+966 51 180 1991** | 🔴               |
| WhatsApp click-to-chat | 966510013160 (derived from phone) | Derived                                                                        | 🔴 same as phone |
| Instagram URL          | instagram.com/sinaispark          | Guessed handle                                                                 | 🔴               |
| LinkedIn URL           | linkedin.com/company/sinaispark   | Guessed handle                                                                 | 🔴               |
| YouTube URL            | youtube.com/@sinaispark           | Guessed handle                                                                 | 🔴               |

## 5. Office Addresses (CMS → **Contact details → Offices**)

The Google listing gives the Dammam office as **402, AZD Business Centre, Al
Rakah Al Junubiyah 34226, Al Khobar**. Confirm with the client.

Street addresses are **mock**:

| Office | Mock address shown                | Real address | Status |
| ------ | --------------------------------- | ------------ | ------ |
| Riyadh | King Fahd Road, Olaya District    | ☐            | 🔴     |
| Jeddah | Tahlia Street, Al Ruwais District | ☐            | 🔴     |
| Dammam | Corniche Road, Al Shati District  | ☐            | 🔴     |

(Used on the contact page. Once the real phone and addresses are in, switch
off **Still placeholder details** so the page stops marking them as pending.)

## 5b. Team (CMS → **Team member**)

Names, photos, LinkedIn links and bios for the four roles shown. A card
without a name or photo shows "pending". Status: 🔴

## 6. Copy Decisions to Confirm

| Item                               | Current implementation              | PDF original                          | Status                                |
| ---------------------------------- | ----------------------------------- | ------------------------------------- | ------------------------------------- |
| Contact H1                         | "Let's Start Your Market Entry"     | "Let's Start Your Saudi Market Entry" | 🟡 deliberate globalization — confirm |
| Business Setup meta description    | "handled end to end"                | PDF has typo "end to start"           | 🟡 treated as typo — confirm          |
| General FAQs (`/faqs/`, CMS → FAQ) | 8 FAQs drafted from service copy    | PDF supplies only India FAQs          | 🔴 client must review/approve set     |
| Blog posts                         | None published (honest empty state) | —                                     | 🟡 content owner TBD                  |

## 7. Legal Pages

| Page               | Status         | Text source            | Status |
| ------------------ | -------------- | ---------------------- | ------ |
| Privacy Policy     | Stub paragraph | Client/legal to supply | 🔴     |
| Terms & Conditions | Stub paragraph | Client/legal to supply | 🔴     |

## 8. Imagery

All photography is CC-licensed Wikimedia Commons placeholders (credits in
`apps/web/lib/images.ts`). Replace with client-provided or purchased imagery,
especially: hero skyline, team/meeting shots, and any imagery representing
Sinai Spark offices/people. Two slots have no image yet:
`services/compliance-planning`, `research/reports-analysis-desk`.

Status: 🟡 acceptable for launch if approved; replacement recommended.

## 9. Research Page Content

One placeholder report ("Saudi Market Entry Report 2026", gated). Confirm:
first real publication, gating policy per report, newsletter tooling
(Resend provisional).

Status: 🔴 at least one real report or explicit launch-with-empty decision.

## 10. Website Assistant (CMS → **Assistant settings / menu / knowledge**)

The chat assistant is built and trained on the website's own content. Before
launch:

| Item                                                                    | Status |
| ----------------------------------------------------------------------- | ------ |
| The assistant's name (placeholder: "Spark Assistant")                   | 🔴     |
| Knowledge documents to add under **Assistant knowledge**                | 🔴     |
| Review the menu answers drafted from the site copy (**Assistant menu**) | 🟡     |
| WhatsApp number for the handoff button (same as §4)                     | 🔴     |
| Groq API key (free plan) in the site's environment                      | 🔴     |

While the India fees above are placeholders, the assistant is told never to
quote prices.

---

**Sign-off:** once every 🔴 row above is answered, this file becomes the record
of approved launch data. Update values in the CMS (or code, for sections 1
and 3) and tick ☑ here.
