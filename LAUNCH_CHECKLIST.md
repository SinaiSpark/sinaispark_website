# Launch Checklist — What's Left Before Go-Live

> **Purpose:** everything still to do between today (site and admin built, running
> locally) and a live site on the VPS. Placeholder content (stats, testimonials,
> team, addresses, fees) is tracked separately in
> [PENDING_CLIENT_DATA.md](PENDING_CLIENT_DATA.md).
>
> **Legend:** 🔴 blocks launch · 🟡 should do before launch · 🟢 can follow launch · ✅ done
> **Who:** 👤 client (an account, a decision, access or content) · 🛠 developer
>
> _Last updated: 2026-09-26._

---

## 0. Where things stand

| Area              | State                                                                                                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Website (Next.js) | All 19 pages built, including the new FAQs page (`/faqs/`). Blog, research, FAQs, team, home page stats, testimonials (incl. the 54 Google reviews) and contact details read from the CMS. More than four team members scroll sideways. |
| Home page         | Slimmed down: the FAQ, India, licence finder and Insights sections are gone. Each has its own page (`/faqs/`, `/india/`, `/licences/`, `/research/`).                                                                                   |
| Admin (Strapi)    | Articles, enquiries, subscribers, FAQs, team, testimonials, contact details, SEO, site switches, preview and scheduling all work. Enquiries and subscribers export to CSV. Notion-style editor.                                         |
| Runs on           | Local machine only: Postgres in Docker, media files on disk.                                                                                                                                                                            |
| Code              | Branch `feat/strapi-cms`, committed and pushed. Pull request into `main` still to open (1.1).                                                                                                                                           |

---

## 1. Code housekeeping

| #   | Task                                                                                                                                                                                                    | Who     | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 1.1 | Commit `feat/strapi-cms` and open a pull request into `main`                                                                                                                                            | 🛠      | 🔴     |
| 1.2 | Run a production build of both apps (`strapi build`, `next build`) and fix anything it finds. Not done yet so the dev server wasn't interrupted                                                         | 🛠      | 🔴     |
| 1.3 | Delete the test draft "misa" and the sample articles (`seed:samples`) before real content goes in                                                                                                       | 👤 / 🛠 | 🔴     |
| 1.4 | Click-test **Export CSV** in the admin on enquiries and subscribers, with and without a filter, and open the file in Excel. The CSV builder is tested; the button has not been clicked in a browser yet | 🛠      | 🟡     |

---

## 2. Email (password reset, invites, enquiry alerts)

Strapi's free edition sends only the password-reset email. It never emails
invites: it shows a sign-up link to copy. We'll add a small hook that emails
invites through the same service. The website's contact form and newsletter
code already expects **Resend**.

| #   | Task                                                                                                                                          | Who | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ |
| 2.1 | Create a Resend account (free: 3,000 emails/month) and an API key                                                                             | 👤  | 🔴     |
| 2.2 | Add Resend's DNS records (SPF, DKIM, DMARC) to **sinaispark.com**, or email lands in spam. Needs whoever controls the domain's DNS            | 👤  | 🔴     |
| 2.3 | Decide the sender and reply-to addresses, e.g. `no-reply@sinaispark.com` and `hello@sinaispark.com`                                           | 👤  | 🔴     |
| 2.4 | Decide which inboxes get new-enquiry alerts (`ENQUIRY_NOTIFY_TO`)                                                                             | 👤  | 🔴     |
| 2.5 | Connect Strapi to Resend (Strapi's nodemailer email provider over Resend's mail server). Replaces the default `sendmail`, which won't deliver | 🛠  | 🔴     |
| 2.6 | Set the reset email's sender and a branded template (`config/admin.ts` → `forgotPassword`)                                                    | 🛠  | 🔴     |
| 2.7 | Email the sign-up link automatically when an admin user is invited                                                                            | 🛠  | 🟡     |
| 2.8 | Put the key in the site too (`RESEND_API_KEY`, `MAIL_FROM`) and test: contact form → alert email, newsletter sign-up, password reset, invite  | 🛠  | 🔴     |
| 2.9 | Newsletter emails need a working unsubscribe link that sets **Unsubscribed at**. Check before the first newsletter goes out                   | 🛠  | 🟡     |

---

## 3. Media → Cloudflare R2

Uploads now sit in `apps/cms/public/uploads` on the machine. On the server they
move to **Cloudflare R2**: no charge for downloads, 10 GB free, then about
$0.015/GB a month. That keeps images off the VPS disk and out of the database
backups.

| #   | Task                                                                                                                                                       | Who     | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 3.1 | Create a Cloudflare account (or use the existing one) and add **sinaispark.com** to it. Recommended anyway for DNS, SSL and spam protection                | 👤      | 🔴     |
| 3.2 | Create an R2 bucket (e.g. `sinaispark-media`) and an R2 API token (access key ID and secret) with read/write on that bucket only                           | 👤 / 🛠 | 🔴     |
| 3.3 | Connect a public address to the bucket, e.g. `media.sinaispark.com`                                                                                        | 🛠      | 🔴     |
| 3.4 | Install and configure `@strapi/provider-upload-aws-s3` for R2 (R2 speaks the S3 protocol). The WebP conversion runs before the upload, so it keeps working | 🛠      | 🔴     |
| 3.5 | Allow the media address in the admin's security policy (`config/middlewares.ts` `img-src`/`media-src`) and in the site's image settings                    | 🛠      | 🔴     |
| 3.6 | Move existing uploads to R2 and repoint every entry and article body (script, same approach as `media:webp`)                                               | 🛠      | 🔴     |
| 3.7 | Check the editor, media library, covers and article images on the live site all load from R2                                                               | 🛠      | 🔴     |

---

## 4. Database backups

The database holds every article, enquiry and subscriber, so losing it means
losing leads. Backups go **off the VPS**, to a separate private R2 bucket.

| #   | Task                                                                                                                                   | Who     | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 4.1 | Create a second, **private** R2 bucket for backups (e.g. `sinaispark-backups`) with its own token                                      | 👤 / 🛠 | 🔴     |
| 4.2 | Nightly `pg_dump`, compressed, uploaded to that bucket by a small container or cron job                                                | 🛠      | 🔴     |
| 4.3 | Keep 7 daily, 4 weekly and 6 monthly copies; older ones delete themselves (R2 lifecycle rules)                                         | 🛠      | 🔴     |
| 4.4 | **Test a restore** into a fresh database before launch, then once a month. A backup that was never restored isn't proven               | 🛠      | 🔴     |
| 4.5 | Alert by email if a nightly backup fails                                                                                               | 🛠      | 🟡     |
| 4.6 | Also turn on the VPS provider's own snapshots (Hetzner about 20% of the server price; Hostinger includes weekly backups on some plans) | 👤      | 🟡     |

---

## 5. VPS and deployment

Waiting on the plan: Hetzner CX23 or Hostinger KVM 2.

| #    | Task                                                                                                                                                                                        | Who     | Status |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 5.1  | Buy the VPS and share access (SSH key login)                                                                                                                                                | 👤      | 🔴     |
| 5.2  | Choose the addresses: site `sinaispark.com` (and `www`), admin e.g. `cms.sinaispark.com`                                                                                                    | 👤      | 🔴     |
| 5.3  | Harden the server: updates on, firewall (ports 22, 80, 443 only), key-only SSH, fail2ban                                                                                                    | 🛠      | 🔴     |
| 5.4  | Production Docker Compose: Postgres (not reachable from outside), Strapi, the Next.js site, and **Caddy** for HTTPS (certificates renew themselves)                                         | 🛠      | 🔴     |
| 5.5  | Generate **new** secrets for production. Never reuse the local ones: Strapi app keys, JWT and token salts, `REVALIDATE_SECRET`, `PREVIEW_SECRET`, `READER_COOKIE_SECRET`, database password | 🛠      | 🔴     |
| 5.6  | Set the public addresses: `PUBLIC_URL`, `WEB_URL`, `STRAPI_ADMIN_WEB_URL`, `WEB_REVALIDATE_URL`, `CMS_URL`, `CMS_PUBLIC_URL`                                                                | 🛠      | 🔴     |
| 5.7  | Create the super-admin on the server and a fresh website token (`token:web`)                                                                                                                | 🛠      | 🔴     |
| 5.8  | Point DNS at the VPS (through Cloudflare)                                                                                                                                                   | 👤 / 🛠 | 🔴     |
| 5.9  | One-command deploy (pull, build, restart) so updates are routine; GitHub Actions later if wanted                                                                                            | 🛠      | 🟡     |
| 5.10 | Log rotation, so logs can't fill the disk                                                                                                                                                   | 🛠      | 🟡     |
| 5.11 | Uptime monitoring with alerts (UptimeRobot or Better Stack, both free) for the site and the admin                                                                                           | 🛠      | 🟡     |
| 5.12 | Error tracking (Sentry, in the proposal)                                                                                                                                                    | 🛠      | 🟢     |
| 5.13 | Visitor analytics (**Umami**, in the proposal), self-hosted on the same VPS                                                                                                                 | 🛠      | 🟡     |

---

## 6. Security and admin accounts

| #   | Task                                                                                                                                           | Who     | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 6.1 | Decide who needs admin access. Invite editors with the **Editor** role (write and publish, no settings); keep Super Admin to one or two people | 👤      | 🔴     |
| 6.2 | Spam protection on the contact and newsletter forms: **Cloudflare Turnstile** (free). Needs the Cloudflare account from 3.1                    | 👤 / 🛠 | 🟡     |
| 6.3 | Cloudflare rate-limit rule on the form endpoints. The site's own limiter only counts per server                                                | 🛠      | 🟢     |
| 6.4 | Check the admin's CORS and security headers on the real addresses                                                                              | 🛠      | 🔴     |

---

## 7. Admin features still to build

| #   | Task                                                                                                                                                                                                                                                                                                            | Who | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ |
| 7.1 | Move FAQs, team, testimonials, office addresses and contact details into Strapi, so they can be edited without a developer. Done: **FAQ**, **Team member**, **Testimonial** and **Contact details**, filled with the current copy. Office opening hours and the live clocks stay in code (`content/contact.ts`) | 🛠  | ✅     |
| 7.2 | Home page "Insights" section to read its articles from the CMS. No longer needed: the section was removed from the home page                                                                                                                                                                                    | 🛠  | ✅     |
| 7.3 | Export enquiries and subscribers to CSV from the admin. Done: **Export CSV** on both lists exports every row matching the current filters. Click-test pending (1.4)                                                                                                                                             | 🛠  | ✅     |
| 7.4 | Decide how newsletters are sent. Resend Broadcasts is free up to 1,000 subscribers (no limit on sends), then $40/month for 5,000; or export the list to another tool                                                                                                                                            | 👤  | 🟢     |

---

## 8. Content (client)

| #   | Task                                                                                                                                                                                                                                       | Who | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------ |
| 8.1 | Everything in [PENDING_CLIENT_DATA.md](PENDING_CLIENT_DATA.md): real stats, testimonials, team, office addresses, phone, socials, India fees. Stats, testimonials, team, FAQs and contact details can now be entered directly in the admin | 👤  | 🔴     |
| 8.5 | Review and approve the FAQs (8 general, drafted from service copy; 7 India, client-supplied) in **FAQ**, and pick which pages each one appears on                                                                                          | 👤  | 🔴     |
| 8.6 | Once the real phone and addresses are in, switch off **Contact details → Still placeholder details** so the contact page stops marking them as pending                                                                                     | 👤  | 🔴     |
| 8.7 | Choose which of the 54 Google reviews (in **Testimonial**, as drafts) to show and publish them. The home page shows no testimonial section until one is published. (The 3 mock testimonials are deleted.)                                  | 👤  | 🔴     |
| 8.8 | Confirm the phone and Dammam address: the Google listing shows +966 51 180 1991 and AZD Business Centre, Al Khobar, not what the site has                                                                                                  | 👤  | 🔴     |
| 8.2 | Replace the services hero photo: it has a fake "RIYADH ADVISORY GROUP" logo baked in (`service-business-setup.jpg`)                                                                                                                        | 👤  | 🔴     |
| 8.3 | Replace or license the placeholder photos (`apps/web/lib/images.ts` marks each one's status)                                                                                                                                               | 👤  | 🟡     |
| 8.4 | Write the first real blog posts and research articles                                                                                                                                                                                      | 👤  | 🟡     |

---

## 9. Launch day

| #   | Task                                                                                                                                                                         | Who     | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| 9.1 | Fill in **SEO settings** (site name, description, share image, company details) and check **Page SEO** for the key pages                                                     | 👤 / 🛠 | 🔴     |
| 9.2 | Verify the site in Google Search Console and Bing Webmaster (the codes go in SEO settings)                                                                                   | 👤 / 🛠 | 🔴     |
| 9.3 | Switch on **SEO settings → Allow search engines** (off until now, so nothing is indexed early)                                                                               | 👤      | 🔴     |
| 9.4 | Switch on **Site settings → Show Insights** once there are real articles                                                                                                     | 👤      | 🟡     |
| 9.5 | Submit the sitemap (`/sitemap.xml`) in Search Console                                                                                                                        | 🛠      | 🔴     |
| 9.6 | If an old site exists at this domain, redirect its old page addresses to the new ones                                                                                        | 👤 / 🛠 | 🟡     |
| 9.7 | Live test: every form, an email of each kind, preview, a scheduled post, image upload, a gated research article, a CSV export, and an FAQ/testimonial edit reaching the site | 🛠      | 🔴     |
| 9.8 | Speed and accessibility check (Lighthouse) on the live site                                                                                                                  | 🛠      | 🟡     |

---

## 10. After launch (routine)

- **Monthly:** update Strapi and the site's packages, test a backup restore, check uptime and error reports.
- **Yearly:** renew the domain. HTTPS certificates renew themselves.
- **When staff change:** remove their admin account the same day.

---

## What the developer needs from the client, in one list

1. **VPS** access (Hetzner or Hostinger) — 5.1
2. **Domain DNS** control for sinaispark.com, ideally moved to Cloudflare — 2.2, 3.1, 5.8
3. **Resend** account + API key — 2.1
4. **Cloudflare** account, R2 enabled (a card is needed even on the free plan) — 3.1, 3.2, 4.1
5. **Addresses:** site and admin domains, sender/reply-to email, enquiry alert inboxes — 2.3, 2.4, 5.2
6. **People:** who gets admin accounts — 6.1
7. **Content:** [PENDING_CLIENT_DATA.md](PENDING_CLIENT_DATA.md), the hero photo, the first articles, FAQ approval — section 8
