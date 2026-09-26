# Sinai Spark Global — web

The site is a direct build of the approved animation-heavy design. Nineteen
pages: the home page, the services and licences hubs, ten per-service and
per-licence pages, the India landing page, and five company and content pages
— about, contact, FAQs, blog and research.

## Where things live

```
app/                     routes only — each page composes sections, holds no copy
  page.tsx                 home
  services/                hub + [service] detail pages
  licences/                hub + [licence] detail pages
  india/                   India landing page
  about/ contact/          the firm, and how to reach it
  faqs/                    every FAQ from the CMS, grouped by category
  blog/ research/          short regulatory notes, and long-form reports
  globals.css              imports styles/ in order, then re-points the font tokens

content/                 ALL copy. Edit here, not in components.
  site.ts                  nav, mega menu, mobile sheet, footer, clocks, ROUTES
  home.ts                  every home section, in page order
  pages.ts                 hub + detail framing, licence facts, market tiles
  services.ts              the ten services and licences (client-approved, verbatim)
  india.ts                 India copy (client-supplied, verbatim)
  india-page.ts            the framing the design added around it
  licence-finder.ts        the finder's chips and answers
  about.ts contact.ts      the two company pages
  blog.ts  research.ts     posts and reports — both still sample content
  faqs.ts  team.ts  testimonials.ts  newsletter.ts  markets.ts
                           (FAQ, team and testimonial section copy only: the
                           entries, and contact details, live in the CMS;
                           lib/site-content.ts reads them)

components/
  chrome/                  header, mobile sheet, footer, loader, cursor, closing CTA
  home/                    one file per home section
  pages/                   hub pieces: page hero, spy bar, service section, fan, matrix
  detail/                  the detail-page template and its sections
  india/                   India-only sections and the structure picker
  company/                 about, contact, blog and research sections
  ui/                      icons, brand mark, split text, clock, smart link
  assistant/               the website assistant (see below)
  motion/                  PageMotion — starts a page's animations after it mounts

lib/motion/              GSAP. core.ts is shared; home.ts, inner.ts and company.ts
                         are per page kind
styles/                  the design's CSS, split at its own section banners
scripts/shoot-site.mjs   headless render check across routes and widths
scripts/kb-ingest.mjs    rebuild the assistant's search index
```

## Rules that keep it honest

**Copy belongs in `content/`.** A component should read a value, never hold one.
Changing wording or a link should not mean opening a component.

**`styles/` is the design's CSS, unedited.** The six files are imported in a
fixed order in `app/globals.css` because that is the order the design
concatenated them in, and the cascade depends on it. Do not reorder them.

Every file loads on every route, so a bare single-word rule restyles the whole
site. New rules are prefixed per page — `ab-` `ct-` `bl-` `rs-` `nl-` in
`6-company.css` — and a section class that clashes with an earlier file gets
renamed rather than fought with specificity.

**React renders markup, GSAP animates it.** Anything stateful and interactive —
the mobile sheet, the licence finder, the FAQ accordion, the consultation form —
is React state. Anything purely visual — pinning, parallax, draw-on, reveals —
is GSAP, wired up in `lib/motion` against the markup React produced. Word-mask
headings are split on the server by `SplitText` rather than rewritten on the
client.

**GSAP owns transforms it drives.** Never set a CSS `translate` on an element
GSAP positions. Browsers disagree on whether GSAP folds that property into its
own transform, and when one did not, the licence fan lost its centring and slid
off screen.

## The website assistant

The round chat button at the bottom right of every page (on the home page it
waits until the hero has scrolled away). Visitors pick from a menu or type a
question. Before the first answer the assistant asks for their name, email and
phone, one at a time, as part of the conversation; anyone who declines is
offered WhatsApp or the contact form instead, and the form arrives pre-filled
with whatever they did share.

```
components/assistant/     the launcher and panel (styles/8-assistant.css)
app/api/assistant/        one POST per visitor action, replies stream as NDJSON
  reindex/                  rebuild the search index (REVALIDATE_SECRET)
lib/assistant/
  conversation.ts           the flow: menu → details → answers, sessions, leads
  answer.ts                 how a typed question is answered, cheapest first
  knowledge.ts              the index: site pages, FAQs, menu, uploaded documents
  groq.ts  embed.ts  db.ts  the model API, local embeddings, the assistant schema
  lead.ts                   reading name / email / phone out of free text
  handoff.ts                chat → contact form pre-fill (sessionStorage)
```

**Where answers come from, cheapest first.** A menu option shows the answer
written in the CMS. A typed question is matched against the menu's wordings
and the FAQs, then against answers generated earlier; only then is Groq asked,
with the four most relevant passages of the site. None of the first steps
uses a model, and on a consultancy site most questions are the same dozen, so
the free Groq plan goes a long way. Groq's models each have their own daily
quota, so a rate-limited model hands the question to the next
(`ASSISTANT_MODELS`). With no key, or with every quota used, the assistant
still answers from the menu, FAQs and saved answers, and hands the rest to a
specialist.

**What it knows.** Every page in the sitemap, as rendered, plus the FAQs, the
menu, and the files in the CMS under **Assistant knowledge** (PDF, Word, text).
Embeddings come from a small model that runs inside the site
(bge-small-en-v1.5, downloaded on first use to `.cache/models`), stored with
pgvector in an `assistant` schema of the CMS's Postgres. Documents are cut into
smaller, overlapping passages than pages, so each topic in a file is found on
its own. The seeded sample articles are skipped: over placeholder text, their
titles only invite the model to answer from its own knowledge, which the
prompt forbids (answers may only restate the site and the documents). Publishing anything
in the CMS re-indexes about 15 seconds later; only changed passages are
re-embedded. To rebuild by hand: `pnpm --filter web kb:ingest` (with the site
running; `SITE=https://… pnpm --filter web kb:ingest` for another host).

**What the client edits** (CMS): **Assistant menu** (options, answers, other
wordings, the next options, the button and prefill), **Assistant settings**
(name, greeting, the can't-answer message, on/off) and **Assistant knowledge**.
Leads arrive as **Enquiries** with channel "Assistant", the options they
picked and the whole conversation, which keeps updating while it continues.

**Setup.** `ASSISTANT_DATABASE_URL` and `GROQ_API_KEY` in `.env.local` (see
`.env.example`); without the database URL the button doesn't appear. The
database needs the pgvector extension: locally the repo's `docker-compose.yml`
builds Postgres with it. In production, build the same image
(`docker/postgres/Dockerfile`, still Alpine so the existing data volume stays
valid), then once as a superuser:

```sql
create extension if not exists vector;
create schema if not exists assistant;
create role sinaispark_assistant login password '…';
grant usage, create on schema assistant to sinaispark_assistant;
```

and point `ASSISTANT_DATABASE_URL` at that role. The site creates its tables
on first use. After deploying, run `kb:ingest` once against the live site.
Behind nginx, the chat route sends `X-Accel-Buffering: no` so replies stream.

## Verifying a change

```bash
pnpm build
npx next start -p 3411
node scripts/shoot-site.mjs http://localhost:3411 ./shots \n  / /services/ /licences/ /india/ /about/ /contact/ /blog/ /research/
```

The script reports console errors, failed requests and horizontal overflow at
1440px and 390px, and writes screenshots. It exits non-zero if anything fails.

## Still pending from the client

Tracked in `PENDING_CLIENT_DATA.md`. The page copy says so wherever it applies:
team names and photographs, the regulator and industry lists, the track-record
figures, the testimonials, the India package fees, and the general FAQ answers.
The blog posts and the research catalogue are sample content, the phone number
and office addresses are placeholders, and neither the consultation form nor
the newsletter is connected — see `BACKEND_AND_AI_REQUIREMENTS.md`.
