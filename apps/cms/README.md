# Sinai Spark CMS

Strapi 5. This is the admin for the website: blog posts, research articles, enquiries from the contact forms, and the email list.

## Run it locally

```bash
docker compose up -d          # from the repo root: Postgres on localhost:55432
cp .env.example .env          # then generate the secrets (see the comment in the file)
pnpm --filter cms develop     # admin at http://localhost:1337/admin
pnpm --filter cms token:web   # prints CMS_API_TOKEN for apps/web/.env.local
pnpm --filter cms seed:samples  # optional: the sample posts and research, clearly marked as samples
```

The first visit to `/admin` asks you to create the super-admin account.

## Content types

| Type                | What it is                                                                                                                                                                                                                                                                            | Who writes it                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Blog post           | Short notes: regulatory updates, guides, market news                                                                                                                                                                                                                                  | Editors                                                  |
| Research article    | Long-form research. `emailGate` (off by default) asks for an email before the full text; `previewBlocks` sets how much shows first                                                                                                                                                    | Editors                                                  |
| Enquiry             | Consultation requests from the site's form and its assistant (**Channel**). An assistant lead carries the options picked and the whole conversation, kept up to date; the form sent after a chat updates the same entry (`PUT /api/enquiries/chat`)                                   | The website creates them; the team sets status and notes |
| Subscriber          | The email list: newsletter sign-ups and research unlocks                                                                                                                                                                                                                              | The website; one row per email address                   |
| FAQ                 | Every published question is on `/faqs/` under its category; **Also show on** repeats it on service, licence, India or contact pages                                                                                                                                                   | Editors                                                  |
| Team member         | The team section on the home and about pages. A card without a name or photo shows "pending"                                                                                                                                                                                          | Editors                                                  |
| Testimonial         | The review band on the home page: star rating, text, and a link that opens the review on Google. Holds the 54 Google reviews (imported as drafts) and any added by hand; only published ones with text show                                                                           | Editors                                                  |
| Contact details     | Single type: email, phone, WhatsApp, social links and the office tiles on the contact page, plus a "still placeholder" switch                                                                                                                                                         | Editors                                                  |
| Home page           | Single type: the track record stats on the home page (number, suffix, label; up to four). Saves go live straight away                                                                                                                                                                 | Editors                                                  |
| Assistant menu      | The website assistant's options and written answers. Topics without **Shown after** are the first menu; the rest appear after their parent's answer. **Also asked as** lists other wordings a typed question is matched against. **Service** and **Market** pre-fill the contact form | Editors                                                  |
| Assistant settings  | Single type: the assistant's name, greeting, the message when it can't answer, the WhatsApp button text, and an on/off switch                                                                                                                                                         | Editors                                                  |
| Assistant knowledge | Documents the assistant searches on top of the website: a PDF, Word or text file, or pasted text. Only published ones are used; publishing re-indexes within about 15 seconds                                                                                                         | Editors                                                  |

The Google reviews come from the Dammam listing (4.9, 54 reviews), collected once on 2026-09-26 into `scripts/google-reviews.json` and imported as drafts on the next boot (`importGoogleReviews` in `src/lib/site-content.ts`, once, skipping any Google ID already present). There is no automatic re-fetch: a new review is added by hand in the admin, with its Google link. Imported dates are approximate, because Google only shows "4 months ago".

FAQs, team members, the home page stats and contact details start filled with the copy the site shipped with (`scripts/site-content.json`, loaded by `src/lib/site-content.ts` on boot). Each type is filled once, ever, so deleting entries never brings them back. **Order** fields sort lowest first.

## Editing, SEO, preview

- **Editor:** blog and research bodies use our own Notion-style editor, built on Tiptap (MIT) as the `global::rich-text` custom field (`src/admin/rich-text/`). Type `/` (or use **Insert**, or the `+` beside a block) for headings, lists, quotes, dividers, images from the media library, tables and YouTube/Vimeo. Selecting text shows a formatting toolbar; blocks drag by their grip; pasting or dropping an image uploads it. It also has word count, an HTML view and a full-screen focus mode. Bodies are stored as HTML in the same shapes CKEditor used (`src/admin/rich-text/html.ts` explains them), so older bodies open unchanged. The site cleans them with `apps/web/lib/article-html.ts`, so **a block added to the editor must also be allowed there**.
- **SEO:** `@strapi-community/plugin-seo` adds the SEO panel (Google-result and social previews, analysis) to any entry whose **SEO** section has been added. `shared.seo` matches the plugin's component exactly; don't rename its fields.
  - **SEO settings** (single type): site name, title template, default description and share image, the **Allow search engines** switch (off until launch; it overrides everything), robots.txt extras, Google/Bing verification codes, and company details for structured data.
  - **Page SEO**: one entry per website page, created automatically from `scripts/site-pages.json`, a copy of `apps/web/lib/site-pages.ts` that a test keeps in sync.
  - A meta title an editor writes is used exactly as written, without the title template.
- **Insights switch:** **Site settings → Show Insights** (off by default) makes research live: its pages, nav/footer links, the blog's research buttons, sitemap. The blog is always public. Previews still work while it is off.
- **Preview:** "Open preview" on blog posts and research articles opens the draft on the real site (`config/admin.ts` → the site's `/api/preview/`). Needs `WEB_URL` and `PREVIEW_SECRET` here and the same `PREVIEW_SECRET` on the site. A preview covers only the article it was opened for, for an hour (`apps/web/lib/preview.ts`); the rest of the site stays exactly as the public sees it, Insights switch included.
- **Scheduling:** the **Schedule** box under Publish/Save (`src/admin/panels/SchedulePanel.tsx`) picks a date and time. It checks the draft as Publish would first, then saves **Publish at**; a scheduled draft shows Change and Unschedule. Setting **Publish at** by hand works too. The home screen's **Scheduled posts** widget lists what is queued and flags any that missed their time, which almost always means a required field is empty.
- **Field labels** and help text are set on boot (`src/lib/admin-labels.ts`), only on fields still showing their raw name.

## How it connects to the site

- **The site reads content** with the scoped "Website" API token (`scripts/create-web-token.js`). The token can read blog, research, settings, page SEO, FAQs, team, testimonials and contact details, create enquiries and add subscribers. It can do nothing else. After adding a content type the site reads, run `token:web` again: it updates the permissions and keeps the key.
- **Publishing refreshes the site.** Publishing, unpublishing or deleting anything the site shows (articles, FAQs, team, testimonials; saving settings or contact details) calls the site's `/api/revalidate/` (`src/lib/revalidate.ts`). Set `WEB_REVALIDATE_URL` and `WEB_REVALIDATE_SECRET` to match the site.
- **Scheduled publishing:** Strapi's own Releases feature is paid, so blog posts and research articles have a **Publish at** field instead. A job running every minute (`config/cron-tasks.ts`) publishes drafts whose time has passed. It only handles the first publish; an article that is already live is never republished automatically.
- **The research email gate is enforced on the server.** A gated article shows its first `previewBlocks` blocks and an email form, and the rest of the text never reaches the browser. Giving an email sets a signed cookie (`apps/web/lib/reader.ts`) that opens every gated article. Each article that reader opens is recorded on their subscriber row. Ungated articles are static pages; gated ones render per request.
- **Images are stored as WebP.** JPEG and PNG uploads are converted before Strapi saves them (`src/middlewares/webp-uploads.ts`, quality 80), so the original and its thumbnail/small/medium/large sizes are all WebP. This covers the media library, the uploader inside entries, the API, and "replace file" (a WebP is only ever replaced by a WebP). GIFs are left alone. `pnpm --filter cms media:webp` converts images already in the library and repoints every entry that uses them; add `--dry-run` to preview. `strapi-plugin-webp-converter` was tried and dropped: it only catches `POST /upload`, so it missed the default media library (`/upload/files`), and it returned a 500 on multi-file uploads.
- **Slugs** are filled in from the title if a draft arrives without one, for example from an import (`src/lib/slugs.ts`).
- **The home screen** (`src/admin/widgets/`, order set in `src/admin/app.tsx`): Start here (new post buttons, and whether Insights and search engines are on), Leads, Latest enquiries, Articles (published and draft counts), Scheduled posts, then Strapi's own cards. `STRAPI_ADMIN_WEB_URL` enables the "View site" button.
- **Export CSV:** the enquiry and subscriber lists have an **Export CSV** button beside the list settings (`src/admin/export/`). It exports every row matching the current filters, search and sort, not just the page on screen, through the admin's own API, so only people who can see the list can export it. Cells a spreadsheet would run as a formula are prefixed with `'`.
- **List screens** show a cover thumbnail and the useful columns, newest first (`src/lib/admin-layouts.ts`). Applied once; later changes made in "Configure the view" stay. Bump `LAYOUT_VERSION` to re-apply.
- **Brand fonts** (Manrope, Schibsted Grotesk) are self-hosted from `@fontsource-variable` and set on plain elements only (`src/admin/admin-styles.ts`), never on Strapi's generated class names.

## Gotchas

- **Stop `pnpm develop` before editing anything in this app.** Each edit restarts it, and on Windows the restart can fail to clean `dist` (EPERM). Strapi then boots with some content types missing and **drops their tables**. This wiped the local database once (2026-09-26). Take a `pg_dump` before schema changes, and if a boot log shows "Error cleaning dist dir", stop at once and delete `dist` before starting again.
- The assistant menu and settings are seeded from `scripts/assistant-content.json`, once, like the other seeds (`src/lib/assistant-content.ts`).

- `apps/cms/.prettierrc` must stay. Without it, Strapi's type generator picks up the repo-root Prettier config, whose Tailwind plugin crashes it (`e.charAt is not a function`).
- Strapi 5 needs React 18 and the site uses React 19. The root `.npmrc` keeps `@types/react` out of pnpm's shared hoist so the two don't collide.
- Change content types in development only. In production the content-type builder is read-only by design.
