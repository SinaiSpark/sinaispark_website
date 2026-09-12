# Sinai Spark Global — web

The site is a direct build of the approved animation-heavy design. Fourteen
pages: the home page, the services and licences hubs, ten per-service and
per-licence pages, and the India landing page.

## Where things live

```
app/                     routes only — each page composes sections, holds no copy
  page.tsx                 home
  services/                hub + [service] detail pages
  licences/                hub + [licence] detail pages
  india/                   India landing page
  globals.css              imports styles/ in order, then re-points the font tokens

content/                 ALL copy. Edit here, not in components.
  site.ts                  nav, mega menu, mobile sheet, footer, clocks, ROUTES
  home.ts                  every home section, in page order
  pages.ts                 hub + detail framing, licence facts, market tiles, FAQ picks
  services.ts              the ten services and licences (client-approved, verbatim)
  india.ts                 India copy (client-supplied, verbatim)
  india-page.ts            the framing the design added around it
  licence-finder.ts        the finder's chips and answers
  faqs.ts  team.ts  testimonials.ts  insights.ts  markets.ts  research.ts

components/
  chrome/                  header, mobile sheet, footer, loader, cursor, closing CTA
  home/                    one file per home section
  pages/                   hub pieces: page hero, spy bar, service section, fan, matrix
  detail/                  the detail-page template and its sections
  india/                   India-only sections and the structure picker
  ui/                      icons, brand mark, split text, clock, smart link
  motion/                  PageMotion — starts a page's animations after it mounts

lib/motion/              GSAP. core.ts is shared, home.ts and inner.ts are per page kind
styles/                  the design's CSS, split at its own section banners
scripts/shoot-site.mjs   headless render check across routes and widths
```

## Rules that keep it honest

**Copy belongs in `content/`.** A component should read a value, never hold one.
Changing wording or a link should not mean opening a component.

**`styles/` is the design's CSS, unedited.** The five files are imported in a
fixed order in `app/globals.css` because that is the order the design
concatenated them in, and the cascade depends on it. Do not reorder them.

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

## Verifying a change

```bash
pnpm build
npx next start -p 3411
node scripts/shoot-site.mjs http://localhost:3411 ./shots / /services/ /licences/ /india/
```

The script reports console errors, failed requests and horizontal overflow at
1440px and 390px, and writes screenshots. It exits non-zero if anything fails.

## Still pending from the client

Tracked in `PENDING_CLIENT_DATA.md`. The page copy says so wherever it applies:
team names and photographs, the regulator and industry lists, the track-record
figures, the testimonials, the India package fees, and the general FAQ answers.
The consultation form has no backend — see `BACKEND_AND_AI_REQUIREMENTS.md`.
