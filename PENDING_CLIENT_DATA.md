# Pending Client Data — BD Confirmation Tracker

> **Purpose:** Every figure, quote and address currently shown on the site is
> **MOCK placeholder data** so the site renders complete for review. Each item
> below must be confirmed or replaced by the BDM / sales team **before go-live**
> (per `website content reviswd.pdf` §10: "Confirm the real figures with the BDM
> and sales team before anything goes live").
>
> **Legend:** 🔴 blocks launch · 🟡 should confirm · ✅ confirmed

---

## 1. Home — Snapshot Stats (`lib/content/home.ts` → HOME.stats)

| Stat                  | Mock value shown | Real value    | Status |
| --------------------- | ---------------- | ------------- | ------ |
| Years of Experience   | 12+              | ☐             | 🔴     |
| Happy Clients         | 250+             | ☐             | 🔴     |
| Countries Served      | 5                | ☐ (5 per PDF) | 🟡     |
| Skilled Professionals | 40+              | ☐             | 🔴     |

## 2. Home — Testimonials (`HOME.testimonials.items`)

⚠️ Client PDF forbids publishing invented quotes. These three are **mock** and
must be replaced with verified client quotes (name + company/title + market +
photo ideally) before launch.

| #   | Mock quote shown for                      | Real testimonial | Status |
| --- | ----------------------------------------- | ---------------- | ------ |
| 1   | Ahmed K. — Industrial Group, Saudi Arabia | ☐                | 🔴     |
| 2   | Sarah M. — Tech Consultancy, UAE          | ☐                | 🔴     |
| 3   | Rajesh P. — Trading Company, India        | ☐                | 🔴     |

## 3. India Landing Page — Package Fees (`lib/content/india.ts` → INDIA.pricing)

PDF: "Insert current fees per package before publishing. The site should quote
actual pricing."

| Package                        | Mock fee shown | Real fee | Status |
| ------------------------------ | -------------- | -------- | ------ |
| Starter (OPC / Sole Prop.)     | ₹9,999         | ☐        | 🔴     |
| Professional (Private Limited) | ₹18,999        | ☐        | 🔴     |
| Partnership (LLP Formation)    | ₹14,999        | ☐        | 🔴     |

Also confirm: are fees one-time? Do they include government fees?

## 4. Contact Details (`lib/site-config.ts` → SITE)

| Field                  | Value shown                       | Source                          | Status           |
| ---------------------- | --------------------------------- | ------------------------------- | ---------------- |
| Email                  | info@sinaispark.com               | PDF                             | 🟡 confirm       |
| Phone (displayed)      | +966 51 001 3160                  | Old live site — may be outdated | 🔴               |
| WhatsApp click-to-chat | 966510013160 (derived from phone) | Derived                         | 🔴 same as phone |
| Instagram URL          | instagram.com/sinaispark          | Guessed handle                  | 🔴               |
| LinkedIn URL           | linkedin.com/company/sinaispark   | Guessed handle                  | 🔴               |
| YouTube URL            | youtube.com/@sinaispark           | Guessed handle                  | 🔴               |

## 5. Office Addresses (`SITE.offices`)

Street addresses are **mock**:

| Office | Mock address shown                | Real address | Status |
| ------ | --------------------------------- | ------------ | ------ |
| Riyadh | King Fahd Road, Olaya District    | ☐            | 🔴     |
| Jeddah | Tahlia Street, Al Ruwais District | ☐            | 🔴     |
| Dammam | Corniche Road, Al Shati District  | ☐            | 🔴     |

(Used on Contact page, footer, and LocalBusiness schema.)

## 6. Copy Decisions to Confirm

| Item                            | Current implementation              | PDF original                          | Status                                |
| ------------------------------- | ----------------------------------- | ------------------------------------- | ------------------------------------- |
| Contact H1                      | "Let's Start Your Market Entry"     | "Let's Start Your Saudi Market Entry" | 🟡 deliberate globalization — confirm |
| Business Setup meta description | "handled end to end"                | PDF has typo "end to start"           | 🟡 treated as typo — confirm          |
| General FAQs page               | 7 FAQs drafted from service copy    | PDF supplies only India FAQs          | 🔴 client must review/approve set     |
| Blog posts                      | None published (honest empty state) | —                                     | 🟡 content owner TBD                  |

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

---

**Sign-off:** once every 🔴 row above is answered, this file becomes the record
of approved launch data. Update values in code and tick ☑ here.
