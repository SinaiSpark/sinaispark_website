# Sinai Spark Website — Proposal vs. Revised Content: Gap Analysis & Implementation Plan

> **Status:** Plan v3 — client decisions locked · Design system & visual direction added (§11–17) · Ready for implementation
> **Sources:** `Sinai_Spark_Proposal-4 (1).pdf` (committed scope) · `website content reviswd.pdf` (client's latest expectations) · Visual references: misa.gov.sa (quality inspiration only), sinaispark-demo.vercel.app (superseded), sinaispark.com (structure reference)
> **Prepared:** August 2026 · **Updated:** August 2026 (open questions resolved; design direction incorporated)

---

## Decisions Locked (v2)

| # | Question | Decision | Impact |
|---|---|---|---|
| 1 | Products / Industries / Careers pages | **Descoped** (client confirmed) | Removed from sitemap and phases |
| 2 | Licenses architecture | **Per-license URLs** (5 separate pages) | `/commercial-license/`, `/industrial-license/`, `/entrepreneurial-license/`, `/service-license/`, `/real-estate-license/`; Services hub links directly to each; breadcrumb: Home › Services › License |
| 3 | Slugs | **Keep all as-is, minus "-3"** | `/administrative-solutions/` unchanged; `/property-management-3/` → `/property-management/` |
| 4 | Real content (stats/prices/contacts) | Provided later; use content PDF for now | Content modules seeded from PDF values, flagged `PENDING_CLIENT_DATA`; launch-hidden until replaced |
| 5 | Testimonials | Use what's provided for now | Structure built per PDF spec; ships **hidden** until BDM-verified quotes arrive (PDF forbids invented quotes) |
| 6 | Country tiles | **Placeholder country pages** | `/where-we-work/{saudi-arabia,uae,uk,bahrain}/` created; India tile → `/sinai-spark-india/` |
| 7 | Research gating/newsletter | As planned; **discussion ongoing** | Filterable grid + featured pin + newsletter capture; Resend provisional, marked `TBD` |
| 8 | Dark mode | **Light-only navy/gold** | Drop `next-themes`/ThemeProvider toggle and `.dark` variants; single light palette enforced |

Defaults assumed (unopposed): Privacy Policy & T&C **retained**; **no** separate `/licenses/` overview page.

---

## 1. Executive Summary

The **proposal** commits to a full-stack platform (Next.js 16 + Express/PostgreSQL/Drizzle + Strapi CMS + admin dashboard + AI chatbot + analytics + SEO + Vercel/VPS deployment) over 7–8 weeks at INR 90,000, with pages: Home, About, Services, Products, Industries, Careers, Contact, Blog, FAQ, Privacy, Terms.

The **revised content document** rebrands the company to **"Sinai Spark Global"** (5-market firm, KSA flagship), delivers final copy/meta/keywords for most pages, **adds two major new pages (India Landing Page, Research)**, restructures the Home page, mandates **navy/gold identity**, and scopes dispute-support copy to the Saudi page only.

The existing repo is a **bare template** — monorepo scaffolding, theming, fonts, and one `Button`. ~15% reusable; zero business functionality exists. Work is phased to match the proposal's payment milestones and flags every item that extends the original scope.

---

## 2. Original Proposal Scope (Committed)

*Historical record — see §Decisions Locked and §Gap Analysis for current state.*

| Area | Commitment |
|---|---|
| **Pages** | Home, About Us, Services, ~~Products~~, ~~Industries~~, ~~Careers~~, Contact, Blog, FAQ, Privacy Policy, Terms & Conditions |
| **Design** | Full redesign, responsive, animations, interactive sections, professional typography |
| **CMS** | Strapi: blogs, images, FAQs, home content, services, team members, testimonials, news & announcements; draft/scheduled publishing |
| **Admin Dashboard** | Better Auth RBAC (Admin/Sub-Admin): dashboard, blog/content/FAQ mgmt, contact submissions, users, image library, analytics view, permissions |
| **Backend** | Express.js, PostgreSQL, Drizzle ORM; validation, rate limiting, security headers, CSRF/XSS/SQLi protection |
| **AI Chatbot** | OpenAI/Gemini: FAQ answers, lead capture, page redirection |
| **Analytics** | Umami preferred (GA4 + Clarity alternative), analytics dashboard |
| **SEO** | Metadata API, dynamic meta, sitemap.xml, robots.txt, Schema.org, OG/Twitter cards, canonicals, Core Web Vitals |
| **Ops** | Sentry; Vercel frontend + Ubuntu VPS/Nginx/PM2 backend; SSL; daily backups; deployment pipeline; documentation |
| **Commercials** | INR 90,000 · Milestones: 30% advance / 30% after frontend completion / 20% after CMS+admin+backend / 20% at go-live |

---

## 3. Client Revised Requirements

### Brand / Global Positioning
- Name is **"Sinai Spark Global"** everywhere; global firm across **KSA (flagship), UAE, UK, India, Bahrain** — not a Saudi-only firm
- Tagline **"Your Vision, Our Mission"** — header on every page + under hero headline; never paraphrased competitively
- Copy tone: plain, specific, reassuring — say what the firm does, not how good it is
- **Navy and gold** visual identity, consistent across all pages *(now light-only — Decision #8)*
- Service boundaries locked: formation, licensing, legal/regulatory advisory, PRO & visa, compliance, property management. No invented adjacent services (e.g., investment matchmaking)

### Site Map Changes
- Services becomes a **hub + sub-pages** with fixed URLs (now 10 child pages incl. 5 license pages)
- Adds **India Landing Page** (`/sinai-spark-india/`) and **Research** (`/research/`)
- Products, Industries, Careers descoped (Decision #1); Privacy/T&C retained

### Home Page (full section-by-section spec)
Hero → **Global Presence country tiles immediately beneath hero** (India→India LP, others→placeholder country pages per Decision #6; no duplicate lower placement) → Who We Are → Mission/Vision → stat counters (PDF figures now; real figures before launch) → What We Do (6 tiles) → Why Choose Us (6 points) → How It Works (4 steps) → **Testimonials (placeholder structure only — ships hidden until BDM verifies)** → Regional Coverage (Riyadh/Jeddah/Dammam) → Closing CTA

### Service Pages
10 pages total (5 core services + 5 license types) with exact copy, URLs, titles, metas, priority keywords from the PDF. **Dispute support lives ONLY on Business Setup KSA** (`/administrative-solutions/`)

### Contact Page
Headline, defined form fields (name, company opt., email, phone/**WhatsApp**, country, **service-of-interest dropdown incl. "India Company Formation"**, message); display phone/WhatsApp, info@sinaispark.com, Instagram/LinkedIn/YouTube, Riyadh/Jeddah/Dammam offices

### India Landing Page (standalone, paid-traffic-ready)
Hero + trust strips, audiences, structure comparison table (Pvt Ltd/LLP/OPC/Sole Prop), services list (incl. GST, trademark, IEC, ROC), process, NRI/FEMA section, why-us, **3 pricing packages (actual fees required pre-launch)**, 7 FAQs, dual CTAs incl. **WhatsApp chat**

### Research Page (new)
Featured report pinned, **filterable by market & topic**, report detail pages or **PDF downloads (gated or ungated)**, **newsletter/email capture**; visually distinct from Blog. Gating/newsletter tooling still under discussion — Resend provisional (`TBD`)

### Technical SEO Checklist
One H1/page, keyword placement rules, alt-text rules, internal-linking rules (every page ≤2 clicks from Home), **LocalBusiness schema w/ 3 city entries**, **FAQPage schema** (FAQs + India), **BreadcrumbList** on service pages (incl. all license pages), Review/AggregateRating *after* real testimonials, Google Business Profiles, image compression, mobile testing of India/Research/Contact

### Other
- **WhatsApp click-to-chat** on Contact, India, and Research pages
- Flag unclear items rather than guess

---

## 4. Gap Analysis

| Status | Items |
|---|---|
| ✅ Already covered by proposal | Home/About/Services/Blog/FAQ/Contact pages; testimonials & FAQs as CMS content; contact forms; SEO foundations; responsive/perf work; animations |
| 🔧 Covered but requires modification | Rebrand to "Sinai Spark Global"; global-not-Saudi framing; home page reorder + new sections; Services → hub + 10 sub-pages; contact form field set; navy/gold light-only design; schema specifics |
| ➕ New (not in proposal) | **India Landing Page**; **Research page** (filtering, gated PDFs, newsletter capture); placeholder country pages ×4; WhatsApp click-to-chat; email-newsletter capability |
| ⚠️ Descoped (client-confirmed) | ~~Products, Industries, Careers pages~~ |

### Conflict Resolution Log
*(all previously-flagged conflicts now resolved)*

1. **Products/Industries/Careers** → descoped, client-confirmed (Decision #1)
2. **Privacy/T&C** → retained per proposal (assumption unopposed)
3. **Team members** → CMS collection kept; page section omitted unless requested
4. **Slugs** → `/administrative-solutions/` kept; `/property-management/` fixed (Decision #3)

---

## 5. Final Sitemap

```
/                                Home (revised section order)
/services/                       Hub linking to all service pages
  /administrative-solutions/     Business Setup KSA (incl. dispute support)
  /legal-services/               Legal & Regulatory Advisory (no dispute content)
  /commercial-license/
  /industrial-license/
  /entrepreneurial-license/
  /service-license/
  /real-estate-license/
  /pro-visa-services/
  /compliance/
  /property-management/
/about-us/
/sinai-spark-india/              Standalone landing page
/research/                       New; + /research/[slug] report pages
/blog/                           + /blog/[slug]
/faqs/
/contact/
/privacy-policy/  /terms/
/where-we-work/saudi-arabia/     Placeholder country page (tile target)
/where-we-work/uae/              Placeholder country page (tile target)
/where-we-work/uk/               Placeholder country page (tile target)
/where-we-work/bahrain/          Placeholder country page (tile target)
sitemap.xml · robots.txt         Generated
```

---

## 6. Implementation Phases

### Phase 0 — Foundation & Design System *(frontend)*
- **Build:** navy/gold token set in `packages/ui/src/styles/globals.css` (**light-only** — remove dark-mode variant, drop `next-themes`/ThemeProvider toggle); Header (logo + tagline + nav + CTA) and Footer (contact details, socials, offices, sitemap links); shared primitives (Card, Accordion, Input, Select, Textarea, Badge, Container, SectionHeading); `WhatsAppButton`; JSON-LD schema components
- **Content:** brand assets (logo variants), final nav labels
- **UX:** mobile-first nav, sticky header, reduced-motion-respecting animations
- **Also:** implement §11 design tokens & type scale, §15 motion tokens + `framer-motion` dependency, §12 image directory scaffold + ASSET_MANIFEST
- **Risks:** logo/tagline asset availability

### Phase 1 — Core Frontend Pages *(milestone: "frontend completion" = 30% payment gate)*
1. **Home** — all 11 sections in revised order; stat counters seeded from PDF figures flagged `PENDING_CLIENT_DATA` (launch-hidden until real numbers arrive); testimonials render from CMS-shaped data but ship **hidden/disabled** until verified; country tiles → placeholder country pages + India LP; regional coverage cards
2. **Services hub + 10 child pages** (5 core + 5 license pages) — typed TS content modules seeded from the revised PDF; breadcrumbs + BreadcrumbList schema on every child
3. **Placeholder country pages** ×4 (`/where-we-work/*`) — minimal "coming soon" template with market summary + CTA
4. **About Us**, **FAQs** (accordion + FAQPage schema), **Contact** (form UI + fields exactly as specified; zod validation; submit → API when Phase 4 lands; mailto/WhatsApp fallback meanwhile)
5. **Blog** shell + listing/detail templates (CMS-ready)
6. **Privacy/T&C** stubs
- **Dependencies:** Phase 0 · All pages follow §13 compositions & §14 components · **Risks:** missing imagery; copy gaps (FAQs content, blog posts)

### Phase 2 — India Landing Page
Standalone, own layout accents, WhatsApp chat, pricing table seeded from PDF package names with fee placeholders clearly marked NOT-FOR-LAUNCH (`PENDING_CLIENT_DATA`), FAQPage schema, its own meta set. Follows §13 India LP direction.
- **Risk:** pricing fees and NRI documentation details must be client-verified before publish

### Phase 3 — Research Page
Filterable grid (client-side filter OK pre-CMS), featured report pin, `/research/[slug]` template, gated-download form + newsletter capture (Resend provisional — `TBD`, discussion ongoing). Follows §13 Research direction.
- **Risks:** gating flow = mild scope addition; no reports content exists yet; newsletter tooling undecided

### Phase 4 — Backend & Forms *(Express + PostgreSQL + Drizzle on VPS)*
Contact-submission endpoint (validation, rate limiting, spam protection, email notification + auto-reply), newsletter subscribers, research lead-gating endpoints, storage (R2/S3) for report PDFs.
- Milestone alignment: backend APIs (proposal timeline)

### Phase 5 — Strapi CMS Integration
Collections: services, blog posts, FAQs, testimonials, research reports, home content, media library; draft/publish; replace Phase 1 content modules with CMS fetches (SSG/ISR)

### Phase 6 — Admin Dashboard
Better Auth RBAC (Admin/Sub-Admin); submissions inbox, content mgmt, users, image library

### Phase 7 — AI Chatbot
Site-scoped RAG over FAQs/services, lead capture

### Phase 8 — Analytics & Monitoring
Umami + Sentry wiring

### Phase 9 — Technical SEO Audit & QA
Schema validation, sitemap/robots, OG images, Core Web Vitals budget, mobile pass on India/Research/Contact

### Phase 10 — Deployment & Handover
Vercel + VPS, SSL, backups, docs, 30-day warranty clock

---

## 7. File/Component-Level Plan (Current Repo)

**Reuse as-is:** turbo/workspace config, ts/eslint packages, `cn`, `Button`, Geist fonts, `transpilePackages`.

**Remove/Modify:** `ThemeProvider` + dark-mode toggle (light-only per Decision #8); `globals.css` (navy/gold tokens, delete `.dark` block); `app/layout.tsx` (metadata base, header/footer, remove template quirks/semicolons); `app/page.tsx` (full rebuild).

**Create (apps/web):**
```
app/{services,services/[service],about-us,sinai-spark-india,research,research/[slug],
     blog,blog/[slug],faqs,contact,privacy-policy,terms,
     where-we-work/[country]}/page.tsx
app/sitemap.ts · app/robots.ts
components/site/{header,footer,whatsapp-button}.tsx
components/home/{hero,country-tiles,who-we-are,stats-counter,service-tiles,why-us,
                 process-steps,testimonials,regional-coverage,cta}.tsx
components/forms/{contact-form,newsletter-form}.tsx
components/seo/{jsonld,breadcrumbs}.tsx
components/motion/{reveal,count-up,motion-provider}.tsx   ← shared framer-motion wrappers
lib/transitions.ts        ← motion tokens (§15)
lib/images.ts             ← ASSET_MANIFEST: src/alt/focal/sizes/license status
public/images/{home,services,licenses,india,research,about,countries}/
lib/content/{home,services,licenses,india,research,faqs,countries,
             site-config}.ts   ← typed content seeded from revised PDF;
                                 PENDING_CLIENT_DATA flags where real values required
```
Service/license pages served via `services/[service]/page.tsx` static params (single template, per-page metadata + schema).

**Extend (packages/ui):** card, accordion, input, textarea, select, badge, tabs (Research filters), table (India comparison/pricing), separator, sheet (mobile nav), skeleton, alert.

---

## 8. Scope-Creep Flags

| Item | Status |
|---|---|
| India Landing Page | Client-requested via revised doc; accepted into plan |
| Research page (filtering, gated downloads, newsletter) | Accepted into plan; **gating/newsletter tooling discussion ongoing** |
| Placeholder country pages ×4 | Accepted into plan (Decision #6) |
| WhatsApp click-to-chat | Accepted into plan |
| Navy/gold light-only design system | Direction fixed by client (Decision #8) |

Commercial impact of items above vs. the INR 90,000 scope description should still be acknowledged in the next milestone conversation.

---

## 9. Remaining Open Items

1. Real **stat figures, pricing fees, KSA phone/WhatsApp number, office addresses, social URLs** — client will provide later; PDF values used meanwhile (launch-hidden where flagged)
2. **Verified testimonials** from BDM/sales — section stays hidden without them
3. **Research gating + newsletter tooling** — discussion ongoing (Resend provisional)
4. Domain/migration: replacing an existing sinaispark.com? Redirect map needed?
5. Initial **blog/FAQ content owner**; language = EN-only?
6. Brand assets: navy/gold palette refs, logo files (SVG), favicon/social images

---

## 10. Recommended Implementation Order

Phase 0 → Home → Services hub + 10 child pages → About/FAQs/Contact → placeholder country pages → Blog shells → Legal stubs → **(frontend milestone)** → India LP → Research → technical SEO pass → backend/forms → CMS swap → admin → chatbot → analytics/monitoring → QA/deploy/handover.

**Rationale:** hits the 30% payment gate early, front-loads client-visible value, defers CMS-dependent plumbing until static structure is approved.

---

## 11. Design System & Visual Direction

**Positioning:** A premium global business consultancy / market-entry firm operating across Saudi Arabia and the GCC. Communicates trust, credibility, corporate maturity, Saudi/GCC expertise, global presence, clarity, confidence. Closer to a **premium corporate/institutional website** than a generic SaaS landing page.

**References:** MISA (misa.gov.sa) studied for institutional quality — editorial hero statements, restrained palette discipline, strong photography, mega-menu information architecture, quote/editorial blocks, metadata-rich news cards. **Inspiration only** — no copying of branding, layouts, colors, or imagery. The demo site (sinaispark-demo.vercel.app) is superseded; the new build must be significantly more polished. Live sinaispark.com used only as business-structure reference.

### 11.1 Design Principles
1. **Hero is a thesis** — each page opens with its most characteristic element (imagery-led statement, not a generic gradient banner)
2. **One signature, quiet discipline** — the Global Presence band is the site's signature moment; everything else stays restrained
3. **Structure encodes meaning** — numbering only where sequence is real (How It Works); eyebrows/dividers carry hierarchy, not decoration
4. **Photography over decoration** — real imagery carries storytelling (see §12); no blob/gradient filler
5. **Copy is design material** — plain-English, active voice per revised PDF tone; no "elite/premium/bespoke" puffery
6. **Quality floor everywhere** — responsive, visible keyboard focus, reduced-motion respected, AA contrast (4.5:1 body)

### 11.2 Color System (light-only — Decision #8)

Mapped onto existing shadcn token architecture in `packages/ui/src/styles/globals.css` (keep CSS-var structure, replace values, delete `.dark` block):

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(1 0 0)` (#FFFFFF) | Default surface (~55% of page area) |
| `--background-alt` | `oklch(0.975 0.004 95)` warm paper | Alternating sections |
| `--foreground` | `oklch(0.22 0.03 260)` ink navy-black | Body text |
| `--primary` | `oklch(0.28 0.06 262)` deep navy #16294B | Header band, headings, primary buttons, navy bands (~25%) |
| `--primary-deep` | `oklch(0.23 0.055 262)` | Footer, CTA bands, hover state |
| `--secondary` / `--muted` | `oklch(0.96 0.006 250)` cool mist | Tiles, chips, icon containers |
| `--accent` (gold) | `oklch(0.72 0.11 82)` muted brass #C6A24B | **Accent only ≤10%**: eyebrows, keyline dividers, active states, stat highlights, CTA on navy |
| gold-strong | `oklch(0.55 0.10 78)` | Gold text on white (AA-safe) |
| `--border` | hairline `oklch(0.92 0.01 255)` | Default card/tile edges |
| `--ring` | navy (gold on navy surfaces) | Focus rings — always visible |

Rules: semantic tokens only (`bg-primary`, `text-muted-foreground`) — never raw hex in components (shadcn rule). Body contrast ≥4.5:1. Gold is never a large fill; navy never neon.

### 11.3 Typography
- **Geist Sans retained** (already approved): display weight 600, tracking `-0.02em`; H1 `clamp(2.25rem→3.5rem)`; H2 `clamp(1.75rem→2.5rem)`
- Eyebrow pattern: uppercase, `text-xs`, tracking `+0.14em`, gold-strong or navy — precedes every section H2
- Body 16–18px / lh 1.65, `max-w-prose` for long-form; ledes at 18–20px regular muted
- Stats/dates/metadata: Geist Mono, `tabular-nums`
- One H1 per page (SEO checklist); section heads H2, sub-points H3

### 11.4 Layout & Spacing
- Container `max-w-7xl` (`px-4 sm:px-6 lg:px-8`); long-form prose capped `max-w-3xl`
- Section rhythm `py-16 md:py-24 lg:py-28`; generous whitespace, low density (marketing dials: variance mid, motion subtle, density spacious)
- 12-col grid desktop; asymmetric editorial splits (7/5 alternating sides); mobile single-column stack
- No fixed px widths; fluid type via clamp; no horizontal scroll anywhere (§16)

### 11.5 Surfaces — Borders, Radii, Shadows
- Hairline borders default; elevation primarily via surface shifts (white → paper → mist), not shadows
- Radii conservative: keep `--radius: 0.625rem` tokens; cards `rounded-lg` max; buttons `rounded-md`; **no pill-everything**
- Shadows rare and soft (`shadow-sm/md` only); no glassmorphism, no glows, no gradient meshes

### 11.6 Buttons & Interactive States
- Primary: navy fill/white text; hover deepen + `translate-y-[-1px]`; focus-visible ring offset
- Secondary: outline navy on light / outline white on navy
- **Gold button reserved** for the single most important CTA per context (e.g., "Book a Free Consultation" on navy band)
- Text-link w/ arrow for tertiary actions; min touch target 44×44 (`h-11`); loading = spinner + disabled (shadcn pattern)

### 11.7 Section Treatments
Alternating rhythm: white → paper → white → **navy full-bleed** (stats or CTA) → imagery break → paper … Hairline separators between same-surface sections; full-bleed navy bands reserved for Snapshot Stats and Closing CTAs so they punctuate the scroll.

---

## 12. Image & Visual Asset Strategy

**Principle: photography-first.** Real, high-quality imagery throughout — the site must not read as text-cards-icons-gradients.

### 12.1 Themes
Riyadh skyline (KAFD/King Abdullah Financial District), Jeddah corniche/Al-Balad architecture, Dammam industrial port, Saudi business districts, Majalis-style architecture details, GCC office environments, professional meetings/handshakes (candid, not stocky), entrepreneurs at work, international business/travel cues (airports, skylines), India: Mumbai/Bengaluru business districts, NRI-relevant Gulf-India connectors.

### 12.2 Sourcing Policy (no fabricated company/team photos)
1. Client-provided photography (preferred — request list issued at Phase 0 kickoff)
2. Licensed stock: Unsplash+ / Pexels+ / Adobe Stock — license recorded per asset in manifest
3. Temporary placeholders: tasteful duotone-navy treated stock with correct subject matter + entry in `ASSET_MANIFEST` flagged `PENDING_CLIENT_DATA`; **never invent Sinai Spark staff/client faces or testimonials**

### 12.3 Technical Rules
- Location: `apps/web/public/images/{home,services,licenses,india,research,about,countries}/`
- Naming: kebab-case descriptive — `riyadh-skyline-kafd-dusk.avif`, `jeddah-albalad-architecture.webp` (no IMG_2031)
- Always Next.js `<Image>`; mandatory `sizes`; quality 80–85; AVIF/WebP automatic
- `priority` ONLY on LCP heroes; everything else lazy; aspect-ratio wrappers reserve space (CLS < 0.1)
- Focal points via `object-position` documented in ASSET_MANIFEST; mobile crops via art-directed `<picture>`/media `sizes` where composition demands
- Alt text per SEO checklist: descriptive, natural keyword use, no stuffing; decorative images `alt=""`

---

## 13. Page-Level Visual Direction

**Home — approved order kept, rhythm varied (no two adjacent card-grid sections):**

| # | Section | Composition |
|---|---|---|
| 1 | Hero | Full-bleed Riyadh skyline, navy scrim L→R; left-aligned eyebrow "Welcome to Sinai Spark Global", H1, subheadline, tagline line, dual CTAs; slow scale-settle on load only |
| 2 | Global Presence ★signature | Horizontal five-market band directly under hero: photo tile per country + name + one-liner; India visually linked to India LP; asymmetric emphasis on KSA |
| 3 | Who We Are | Editorial split 7/5: text + pull-quote, portrait-format office image |
| 4 | Mission / Vision | Quiet paper band, two columns, thin gold top-keylines, no icons |
| 5 | Snapshot Stats | Navy full-bleed; four count-up tabular numerals, gold accents; real figures before launch |
| 6 | What We Do | **Editorial index rows** (numbered service list, divider-separated, hover reveals supporting image) — deliberately NOT a card grid |
| 7 | Why Choose Us | Minimal 3×2 tiles, mist surface, small line icons, thin dividers |
| 8 | How It Works | Horizontal 4-step timeline, connecting gold line (numbering justified: real sequence) |
| 9 | Testimonials | Single large-quote slider; **hidden until verified data arrives** |
| 10 | Regional Coverage | Three image cards (Riyadh/Jeddah/Dammam) overlay captions + city stats |
| 11 | Closing CTA | Navy band: "Still Have Questions?" + View FAQs / Contact Us |

**Services hub:** editorial index of 10 services with per-service thumbnail + one-line description; sticky in-page nav on detail pages.
**Service/license detail template:** ImageHero (market-appropriate photo + breadcrumb overlay) → intro prose → styled bullet services checklist → process/callout panel → related services strip → CTA band. License pages share one template, differentiated imagery. Dispute-support block renders only on `/administrative-solutions/`.
**India LP:** own hero (India imagery + bilingual trust strip chips), audience segments as compact tiles, comparison table (responsive stacked cards on mobile), pricing tiers flagged `PENDING_CLIENT_DATA`, vertical process timeline, FEMA/NRI callout panel (Alert primitive), FAQPage schema, persistent WhatsApp CTA.
**Research:** institutional editorial distinct from Blog — FeaturedReport hero card, filter chip bar (market/topic), ResearchCards with cover treatment + publication metadata (date/type/read-time/download CTA), newsletter band (provider `TBD`). Blog stays utilitarian article-list by contrast.
**Global chrome:** header = logo + tagline lockup, grouped nav w/ Services dropdown (10 children), prominent consultation CTA; footer = navy-deep, 4-column (brand+socials / Services / Company / Contact+offices), legal row. WhatsApp button floats on Contact/India/Research per spec.
**Country placeholders:** ImageHero + market summary paragraph + contact CTA; clearly expandable to full landing pages later.

---

## 14. Component Architecture

Composites live in `packages/ui` (reusable primitives) or `components/site|home` (page-level). Extend ShadCN foundation — do not force generic cards:

| Composite | Built from | Notes |
|---|---|---|
| `ImageHero` / `Hero` | next/image + scrim + slots | priority flag, eyebrow/H1/CTA props |
| `SectionHeading` | eyebrow + H2 + lede | consistent rhythm device |
| `SplitImageSection` | grid 7/5 | reversible |
| `EditorialSection` | wrapper | paper/navy variant |
| `ImageCard` | Card + Image + overlay caption | regional coverage, countries |
| `StatBlock` | mono numerals + count-up | navy band usage |
| `ServiceFeature` | index row + hover image reveal | What We Do, hub |
| `CountryFeature` | tile + monogram/photo | Global Presence |
| `ProcessTimeline` | ordered steps + connector | How It Works, India process |
| `TestimonialSection` | quote slider | hidden-until-verified logic |
| `CTASection` | navy band variant | reusable closer |
| `ResearchCard` / `FeaturedReport` | cover + metadata + tags | §13 Research |
| `Newsletter` | Input + Button + consent note | provider TBD |
| `Breadcrumbs` | breadcrumb primitive + JSON-LD | all child pages |

ShadCN usage rules (enforced): existing components first, built-in variants before custom styles; full Card composition; forms via Field/FieldGroup with visible labels + near-field errors + `data-invalid`/`aria-invalid`; Dialog/Sheet require Title; Separator/Skeleton/Badge/Alert/Empty primitives instead of custom divs; icons via `data-icon`, no ad-hoc sizing; `gap-*` not `space-y-*`; `cn()` for conditionals. New UI-package primitives to add: accordion, input, textarea, select, badge, tabs, table, separator, sheet (mobile nav), skeleton, alert.

---

## 15. Motion & Interaction Strategy (framer-motion)

Add dependency `framer-motion` (Phase 0). Principles: subtle, premium, purposeful — one orchestrated hero moment; otherwise quiet support.

**Tokens (lib/transitions.ts):** `smooth` tween .3s easeInOut (UI states) · `reveal` tween .5–.6s `[0.22,1,0.36,1]` (section entrances) · `spring` stiffness 300 / damping 24 (interactive) · stagger 60–80ms, max 4 items deep.

**Patterns:**
- Reveal-on-scroll: fade + rise 16px, once only (`whileInView` `viewport={{once:true}}`)
- Hero: single orchestrated entrance sequence (eyebrow→H1→sub→CTAs staggered ~90ms); optional 4% image scale-settle
- Count-up stats on viewport enter (renders final value immediately under reduced motion)
- Hover: buttons lift 1px + color shift; cards raise shadow-sm→md; index rows slide gold indicator; images scale 1.03 inside overflow-hidden
- Nav: underline slide-in; dropdown fade/slide 150ms; mobile Sheet slide
- AnimatePresence for exits (dropdowns, filters); `layoutId` for Research filter indicator
- GPU-only properties (opacity/transform); never animate width/height/top/left

**Accessibility/perf:** `useReducedMotion()` gates ALL transforms (opacity-only fallback or none); animations ≤600ms; no parallax; no autoplay carousels; CLS-safe (no layout-shifting entrances).

---

## 16. Responsive Requirements

Breakpoints: base 360 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Mobile-first.

- **Navigation:** ≥lg horizontal nav + dropdown; <lg Sheet drawer (title required, focus-trapped); CTA always reachable
- **Hero:** min-h 70svh mobile / 85svh desktop; headline clamp scales; CTAs full-width stack <sm
- **Images:** art-directed crops (landscape→portrait swap where focal point demands); heroes `sizes="100vw"`; cards explicit aspect ratios
- **Services:** hub index rows collapse gracefully; detail sticky aside becomes inline block <lg
- **Pricing/comparison tables:** → stacked cards <md (table only ≥md)
- **Forms:** single column mobile; labels above inputs always; errors near fields; 44px targets
- **Research filters:** horizontally scrollable chip bar on mobile (snap, edge-fade affordance)
- **Country/global presence:** 5-tile band → 2-col grid tablet → swipeable snap-row mobile (KSA pinned first)
- **Footer:** 4-col → 2-col → accordion groups mobile
- Zero accidental horizontal scroll: no fixed-width elements, `overflow-x: clip` safety, test at 320px

## 17. Frontend Quality Bar

**Must NOT look AI-generated. Avoid:** excessive rounded cards · decorative gradients · glassmorphism · random blobs · repetitive card-grid rhythm · meaningless icon soup · animation overload · generic SaaS layout patterns.

**Must achieve (MISA-inspired, original identity):** institutional composure — restrained navy/gold discipline, photography-led storytelling, editorial typography, deliberate whitespace, meaningful structure, consistent eyebrow/keyline system, flawless responsive behavior.

**Definition of done (every page):** Lighthouse ≥90 perf/a11y/BP/SEO · keyboard-navigable end-to-end with visible focus · reduced-motion safe · zero horizontal scroll 320–2560px · alt text complete · semantic landmarks + one H1 · CWV within budget (LCP <2.5s, CLS <0.1, INP <200ms) · passes ESLint/Prettier/tsc.

**Reference-site findings documented during research:** live sinaispark.com lists "Corporate Events" (not an approved service → excluded per revised PDF); demo contains invented testimonials, duplicated country blocks ×3 and lorem ipsum (discarded); live stat counters render "0+" (confirms placeholder state); MISA is bilingual while scope is EN-only (open item #5).

---

## ✅ Ready-for-Implementation Checklist

- [x] Products / Industries / Careers descoping confirmed; Privacy & T&C retained
- [x] License-page architecture decided (5 per-license URLs)
- [x] Slugs approved (`/administrative-solutions/`, `/property-management/`)
- [x] Placeholder-content policy agreed (PDF values, `PENDING_CLIENT_DATA`, launch-hidden where required)
- [x] Testimonials policy agreed (hidden until verified)
- [x] Country-tile link strategy chosen (placeholder country pages)
- [x] Dark-mode decision made (light-only navy/gold)
- [ ] Brand assets received: palette refs, logo SVGs, favicon/social images
- [ ] Photography sourced or placeholder-manifest agreed (client shot list issued, licenses recorded)
- [ ] Research gating/newsletter tooling finalized
- [ ] Real content received (stats, fees, contacts) or launch-hidden sign-off
