# Sinai Spark Global — Website

Marketing site for [Sinai Spark Global](https://sinaispark.com), a consultancy handling company formation, MISA registration, licensing and PRO services across Saudi Arabia, the UAE, the UK, India and Bahrain.

Built as a pnpm monorepo managed with Turborepo.

## Tech Stack

- **Framework:** Next.js (App Router) + React 19
- **Styling:** Tailwind CSS 4 + shadcn/ui components (`packages/ui`)
- **Animation:** Framer Motion
- **Testing:** Vitest + React Testing Library
- **Tooling:** TypeScript, ESLint, Prettier, Husky + lint-staged

## Getting Started

Requires Node.js >= 20 and pnpm 10.

```bash
pnpm install
pnpm dev        # start apps/web on http://localhost:3000
```

## Scripts

Run from the repo root via Turbo:

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Start the dev server               |
| `pnpm build`     | Production build                   |
| `pnpm lint`      | Lint all packages                  |
| `pnpm test`      | Run Vitest suites                  |
| `pnpm typecheck` | TypeScript checks (`tsc --noEmit`) |
| `pnpm format`    | Format with Prettier               |

App-level scripts (dev/build/test/watch) also live in `apps/web/package.json`.

## Project Structure

```
├── apps/
│   └── web/                  # Next.js application
│       ├── app/              # Routes (home, about-us, services, blog, ...)
│       ├── components/       # Page sections & motion primitives
│       ├── lib/
│       │   ├── content/      # Page copy (single source of truth)
│       │   ├── images.ts     # Image registry (src, alt, focal, credit)
│       │   └── site-config.ts# Site-wide config, nav and service routes
│       └── tests/            # Vitest suites
└── packages/
    ├── ui/                   # Shared shadcn/ui components (@workspace/ui)
    ├── eslint-config/
    └── typescript-config/
```

## Content Management

All page copy lives in `apps/web/lib/content/` rather than being hardcoded in components — edit there to change headlines, service descriptions, stats or testimonials.

`apps/web/lib/site-config.ts` holds site name, contact details, socials, office locations and navigation/service routes.

> Values marked `PENDING_CLIENT_DATA` are placeholders that must be confirmed before launch — see `PENDING_CLIENT_DATA.md`.

## Adding UI Components

Add shadcn/ui components to the shared UI package from the repo root:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components land in `packages/ui/src/components` and can be imported app-side:

```tsx
import { Button } from "@workspace/ui/components/button"
```
