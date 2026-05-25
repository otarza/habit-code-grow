# BitCamp — Astro Rebuild Requirements

Source of truth for what the BitCamp site must do once rebuilt on Astro. Derived from a deep audit of the current production site on `main` (React/Vite + Puppeteer prerender) and the partial Astro migration on `astro-migration`.

Companion: `PLAN.md` — phased action plan to deliver this.

---

## 1. Overview

BitCamp (https://www.bitcamp.ge) is a Georgian-language programming education platform run by Otar Zakalashvili. The site combines marketing for paid AI courses with free programming course content. Production today is a React/Vite SPA hosted on GitHub Pages.

**Why rebuild on Astro:**
- Ship dramatically less JS per page (today: ~1.6MB raw / ~520KB gzip, hydrating on every page)
- Render markdown course content at build time, not client-side (kill `react-markdown` + `react-syntax-highlighter` from the client bundle)
- Real per-page SEO meta in `<head>` (currently broken in `astro-migration` due to mock-helmet)
- Real static URLs per lesson (no SPA fallback)
- Lighter, simpler mental model going forward

**Why NOT a complete teardown:**
- Live business with active ads — checkout, magic links, comments, and tracking must keep working
- Existing GCP Cloud Functions (5 of them), Postmark templates, Flitt dashboard config, and the Firestore entitlements store stay 100% as-is
- Magic-link URLs in already-sent customer emails must keep resolving (`/learn/{slug}?access={token}`)

**Stack reality check:** The site is now a *hybrid*: static marketing + statically rendered course content + dynamic enrollment (Firestore-backed) + user-generated comments (moderated via Telegram). The Astro rebuild must accommodate the dynamic layers as small client islands talking to existing HTTP APIs — it can't be pure SSG everywhere.

---

## 2. Hard Constraints (non-negotiable)

These cannot change as part of the rebuild:

- **Magic-link URL pattern**: `https://www.bitcamp.ge/learn/{course-slug}?access={base64url_email}` — already in customers' inboxes; must keep working forever
- **Flitt button hashes** in `src/lib/checkout.ts` — configured in Flitt dashboard, cannot change:
  - `74de94a0a998fdf3f37f433e90448cd5dd11ee97` → bootcamp (₾99)
  - `811bb88862b6e4eb4b1a1bfdb86ba16cac23d8f8` → pro (₾249)
  - `712f14e9fe23dd46c2693b292afd3aed99271a51` → `bavshvebi` promo (discounted bootcamp)
- **GCP Cloud Functions (5)** stay deployed unchanged, all in project `bitcamp-flitt`, region `us-central1`:
  - `flittWebhook` — Flitt payment callback (writes entitlements to Firestore + sends Postmark welcome)
  - `flittRedirect` — Flitt POST→303 GET bouncer to `/thank-you`
  - `bitcampManagerBot` — Telegram bot (handles `/invite` + comment moderation callbacks)
  - `course-access-api` — issues login-link emails (`https://us-central1-bitcamp-flitt.cloudfunctions.net/course-access-api`)
  - `course-comments-api` — lesson comments CRUD with rate limiting (`https://us-central1-bitcamp-flitt.cloudfunctions.net/course-comments-api`)
- **Firestore database** in `bitcamp-flitt` (Native mode, `us-central1`) is the source of truth for course entitlements and lesson comments. Collections: `course_access`, `course_access_events`, `lesson_comments`, `lesson_comment_summaries`, `lesson_comment_rate_limits`, `lesson_comment_user_views`.
- **Postmark template aliases** stay unchanged:
  - `course-access-ai-bootcamp`, `course-access-ai-pro`, `course-access-architect` — purchase/welcome
  - `receipt-confirmation-architect`, `receipt-confirmation-bootcamp` — receipts
  - `course-login-link` — login-link request via course-access-api
- **Apple Pay merchant verification** file at `/.well-known/apple-developer-merchantid-domain-association`
- **Tracking IDs**: GA4 `G-DG50GBH71S`, Meta Pixel `4105632136386341`
- **CNAME**: `bitcamp.ge` / `www.bitcamp.ge` (GitHub Pages — moving hosting is out of scope for the rebuild itself)

---

## 3. Routes & Pages

All routes statically generated at build time.

### 3.1 Marketing (public, indexable)

| Route | Purpose | Indexed |
|---|---|---|
| `/` | Homepage — leads with free, converts to paid | yes |
| `/courses` | Free courses index | yes |
| `/courses/{slug}` | Free course overview | yes |
| `/courses/{slug}/{topic}/{lesson}` | Free lesson viewer | yes |
| `/python-sql` | Marketing for Python/SQL course | yes |
| `/fullstack-ai` | Marketing for Full-Stack AI program | yes |
| `/resources/ai-prompts-library` | Public AI prompts library (52 prompts, bilingual) | yes |
| `/terms` | Legal — service terms (Flitt compliance) | yes |
| `/privacy` | Legal — privacy policy | yes |
| `/404` | Not found | n/a |

### 3.2 Campaign (public, NOINDEX)

| Route | Product | Price | Notes |
|---|---|---|---|
| `/ai-bootcamp` | Self-paced AI Prompt Engineering Bootcamp | ₾99 | `<meta robots="noindex">` |
| `/ai` | Mentored 6-module AI program | ₾249 | Currently `<SEO>` indexed; can flip noindex if treated as campaign |

### 3.3 Post-purchase & gated (NOINDEX)

| Route | Purpose |
|---|---|
| `/thank-you` | Post-Flitt redirect destination. Reads `?status`, `?order_id`, `?amount`, `?currency`, `?product`. Fires Meta `Purchase` + GA4 `purchase` events (with sessionStorage dedup) on `status=success`. |
| `/learn/{slug}` + `/learn/{slug}/{topic}/{lesson}` | Gated course content for `ai-bootcamp` (26 lessons / 2 modules + customer-profile module) and `ai-pro`. Magic-link soft paywall with two unlock paths (see §3.4). Each lesson page renders a moderated comments section at the bottom (see §3.5). |

### 3.4 Magic-Link AccessGate (dual unlock paths)

The `/learn/{slug}` AccessGate has **two ways to unlock**:

1. **URL token path (existing)**: visitor lands with `?access={base64url_email}` → client decodes → writes localStorage `bitcamp_soft_access_{slug}` = `"true"` + `bitcamp_soft_access_{slug}_email` = email → strips query param → renders course content
2. **Email-entry form path (new, post-`feat: add course access login link flow`)**: visitor lands without a token → form shows asking for email → on submit, POSTs `{email, courseSlug}` to `course-access-api` → API silently checks Firestore for active entitlement → if active, sends `course-login-link` Postmark email → frontend shows neutral confirmation ("if this email has access, we sent a link"). The same response is returned whether the email is in the access list or not — no enumeration.

Both paths converge on the same localStorage state. Logout (`bitcamp_soft_access_{slug}` removed) returns the user to the gate.

The gate UI also includes a secondary "haven't bought yet?" CTA linking to the relevant buy page (`/ai-bootcamp` or `/ai`).

### 3.5 Lesson comments (new feature)

Each lesson page under `/learn/{slug}/{topic}/{lesson}` renders a moderated comments section at the bottom. Details:

- Visitors with an active localStorage email can post comments (≤2000 chars, ≥2 chars, 20s rate limit per user per lesson)
- Comments are submitted as `pending` to Firestore, immediately visible to the author (under "own comments"), and trigger a Telegram message to moderators with Approve/Decline inline buttons
- Approved comments appear in `lesson_comment_summaries` and are shown to all visitors
- Display name = email local part (`alice` from `alice@example.com`)
- Server-side entitlement re-check before accepting POST — client trust is not sufficient

---

## 4. Content

### 4.1 Course manifests + lessons

Currently at `public/courses/{slug}/` (free) and `public/learn-content/{slug}/` (gated). The rebuild moves these into Astro content collections under `src/content/`.

**Manifest shape** (`manifest.json`):
```json
{
  "id": "...", "title": "...", "slug": "...", "description": "...",
  "thumbnail": "/path.png", "exportedAt": "ISO date",
  "topics": [
    { "slug": "...", "title": "...", "order": N,
      "lessons": [
        { "slug": "...", "title": "...", "order": N,
          "videoUrl": "https://youtube/...",
          "videoDuration": "12:34",
          "isPreview": true }
      ]
    }
  ]
}
```

**Lesson `.md` shape**:
```markdown
---
title: "AI კურსის შესავალი"
order: 102
videoUrl: "https://www.youtube.com/watch?v=K3uu30qJFmo"
videoDuration: "12:34"
---

Body markdown. Supports shortcodes:
{% youtube "https://youtu.be/..." %}
{% vimeo "..." %}
{% video "..." %}
{% embed "..." %}
```

**Free courses** (`public/courses/`): `python`, `java`, `html-css`, `sql`, `angular`.
**Gated courses** (`public/learn-content/`):
- `ai-bootcamp` (26 lessons in 2 modules: `fundamentals`, `practice`)
- `ai-pro` (mirrors ai-bootcamp + new `customer-profile/` module with 3 lessons: `brand-voice-guide`, `ideal-customer-persona`, `synthesis-audience-brand-voice`)

### 4.2 Prompt library data

File: `src/data/aiPrompts.ts`. Exports `PROMPT_CATEGORIES` (8 categories) and `AI_PROMPTS` (52 prompts).

Each prompt: `{ id, category, title (ka), description (ka), tags, prompt: { ka, en } }`.

UI is Georgian; the prompt *body* is bilingual via a toggle.

### 4.3 Static assets

`public/`: course thumbnails (PNG), hero/OG images, payment provider SVGs at `/assets/payment/*.svg`, media at `public/media/`, `.well-known/` Apple Pay verification, `CNAME`, `favicon.*`, `robots.txt`.

`src/assets/`: logos and design images that need build-time optimization (`bitcamp-logo.png`, `hero-coding.jpg`, etc.). The rebuild must use Astro's `<Image>` / `astro:assets` to avoid the `[object Object]` import bug observed in `astro-migration`.

### 4.4 Firestore data model (read-only for the website)

The website does NOT write directly to Firestore. It calls the HTTP APIs (`course-access-api`, `course-comments-api`) which handle Firestore I/O server-side. For reference:

- `course_access/{sha256(email)}` — entitlements per email; the document holds a `courses` map keyed by course slug with `status` (`active`/`inactive`), `source` (`flitt_purchase`/`telegram_invite`/`google_classroom_import`/etc.), `grantedAt`, `updatedAt`, and source-specific metadata
- `course_access_events/{autoId}` — audit log
- `lesson_comments/{autoId}` — pending/approved/rejected comments with author email + lesson coordinates
- `lesson_comment_summaries/{lessonHash}` — denormalized array of approved comments per lesson, for fast list reads
- `lesson_comment_rate_limits/{lessonHash|authorEmailHash}` — last comment timestamp for the 20s throttle
- `lesson_comment_user_views/{lessonHash|authorEmailHash}` — denormalized array of the author's own pending+approved comments

The implementation plan for course access lives in the main repo at `COURSE-ACCESS-IMPLEMENTATION-PLAN.md`. Worth re-reading before Phase 6.

---

## 5. Interactive Features (where actual JS is required)

These are the *only* things that need to run in the browser. Everything else is static HTML.

| Feature | Where | Hydration strategy |
|---|---|---|
| Flitt checkout modal | All Buy buttons | `client:load` — must be ready when user clicks Buy |
| Email + promo code form (inside modal) | Inside Flitt modal | Same |
| Countdown timer (campaign deadline) | `/ai-bootcamp` hero + final CTA | `client:idle` |
| FAQ accordion | Marketing pages | Native `<details>`/`<summary>` (zero JS) OR `client:visible` |
| Mobile menu toggle | Navbar (every public page) | Vanilla `<script>` (zero React) |
| Course sidebar (collapse topics, mobile drawer) | `/courses/*`, `/learn/*` | Mostly static + tiny `<script>` |
| AccessGate — URL token decode | `/learn/*` only | Pre-paint vanilla `<script>` OR `client:only="react"` |
| AccessGate — email-entry form (login-link request) | `/learn/*` only when no token | `client:only="react"` — needs form state + fetch to course-access-api |
| Lesson comments (list + post form) | `/learn/{slug}/{topic}/{lesson}` only | `client:visible` — bottom of page, loads when scrolled into view |
| Prompts library filter/search/lang toggle/copy | `/resources/ai-prompts-library` | `client:idle` island OR vanilla `<script>` |
| ThankYou purchase pixel firing | `/thank-you` only | Inline `<script>` reading URL params + sessionStorage dedup |
| GA + Meta Pixel page-view tracking | All pages | Inline `<script>` in Layout |
| Sticky CTA bar | Homepage | Vanilla `<script>` for scroll visibility |

**Out of scope** (currently dead/commented in production):
- `FloatingSocialProof` (commented out)
- `LeadMagnet` (commented out)
- `ABTestProvider`, `ScarcityProvider`, `RetargetingProvider` — currently no-op wrappers; drop unless revived
- Exit-intent popup
- Tally widget script on `/ai` (legacy, Flitt-direct replaced it)

---

## 6. Integrations

### 6.1 Flitt (payments) — unchanged

- Embed mode: pre-collect email in our modal, pass via `customer_data.email`
- Two-step UX: email + promo step → Flitt embed step
- Promo code `bavshvebi` swaps to the discounted button hash (case-insensitive lookup)
- Apple Pay supported (requires verified domain file)
- Vue checkout SDK loaded from `https://pay.flitt.com/latest/checkout-vue/checkout.js`
- Visual customization via CSS variables passed to Flitt config

### 6.2 GCP Cloud Functions — five total, all unchanged

All in project `bitcamp-flitt`, region `us-central1`.

**Server-only (no frontend call):**
- **`flittWebhook`**: SHA1-verified Flitt callback. Maps `product_id` → product slug, extracts email (prefers checkout email over payment-method email), upserts entitlement to Firestore `course_access`, sends Postmark welcome (`course-access-{product}`) template with `base64_email`. Returns 200 on most failures to avoid retry storms.
- **`flittRedirect`**: Accepts POST from Flitt, 303-redirects browser (forces GET) to `/thank-you?status=...&order_id=...&amount=...&currency=...&product=...`. Required because GitHub Pages only serves GET.
- **`bitcampManagerBot`**: Telegram bot. Handles `/invite {email} {course} {note}` (upserts entitlement + sends invite email) and comment moderation callback queries (`comment:approve:{id}` / `comment:decline:{id}` from inline keyboards posted by course-comments-api).

**Called from the website (CORS-enabled):**
- **`course-access-api`** at `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-access-api`
  - `POST` with `{email, courseSlug}` → returns the same neutral response always (`{ok:true, message:"If this email has access, we sent a login link."}`)
  - Internally: SHA-256 hashes email, queries Firestore for active entitlement, sends `course-login-link` Postmark template with magic-link URL if eligible
  - Rate-limited per email/course: 5 minutes between sends
  - Audit-logs every request to `course_access_events`
  - CORS origins: `https://www.bitcamp.ge`, `localhost:8080`, `localhost:5173`
  - Env var on frontend: `VITE_COURSE_ACCESS_API_URL`
- **`course-comments-api`** at `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-comments-api`
  - `GET ?courseSlug=&topicSlug=&lessonSlug=&authorEmail=` → `{ok:true, approvedComments, ownComments}` (own comments require valid entitlement check)
  - `POST {courseSlug, topicSlug, lessonSlug, lessonTitle?, courseTitle?, authorEmail, text}` → `{ok:true, comment}` (rate-limited 20s/user/lesson; 403 if no entitlement; 429 if rate-limited; 400 if invalid)
  - Writes pending comment to Firestore + notifies Telegram moderators with Approve/Decline inline keyboard
  - CORS origins: same as above
  - Env var on frontend: `VITE_COURSE_COMMENTS_API_URL`

### 6.3 Postmark templates

Transactional emails via template aliases. Magic-link URLs hardcoded in templates point to `https://www.bitcamp.ge/learn/{slug}?access={base64_email}`.

- Purchase/welcome: `course-access-ai-bootcamp`, `course-access-ai-pro`, `course-access-architect`
- Receipts: `receipt-confirmation-bootcamp`, `receipt-confirmation-architect`
- Login link (NEW, used by `course-access-api`): `course-login-link` — variables: `product_name`, `course_title`, `magic_link`, `base64_email`

### 6.4 Tracking

- **GA4** (`G-DG50GBH71S`): auto page views; custom events `begin_checkout` and `purchase` fired from JS
- **Meta Pixel** (`4105632136386341`): auto page views; custom events `InitiateCheckout` and `Purchase` (with `eventID` keyed on `order_id` for server-side dedup)
- Inline scripts in `Layout.astro` — already correctly placed in `astro-migration`, reuse

### 6.5 YouTube + Vimeo embeds

Two patterns in current content:
1. Lesson frontmatter `videoUrl` → embed iframe above the markdown body
2. Inline shortcodes in markdown body: `{% youtube "url" %}`, `{% vimeo "url" %}`, `{% video "url" %}`, `{% embed "url" %}`

Both must continue to work.

### 6.6 Firestore

Read-only for the website (via the two HTTP APIs above). The rebuild does NOT add direct Firestore client SDK to the bundle. All Firestore interaction goes through the existing Cloud Functions.

---

## 7. SEO Requirements

Every public page MUST have, in the actual `<head>` (not body):
- `<title>` — per-page, not the site default
- `<meta name="description">` — per-page
- `<link rel="canonical">` — per-page (absolute URL)
- OpenGraph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`

Pages explicitly noindex: `/ai-bootcamp`, `/thank-you`, `/learn/*` (gated). Optional noindex review for `/ai` post-campaign.

`react-helmet-async` and the `mock-helmet` shim are forbidden in the rebuild. All SEO flows through Astro layout props.

A sitemap.xml must be generated and referenced from `robots.txt`.

---

## 8. Non-functional Requirements

- **Performance** (mobile Lighthouse): Performance ≥ 90 on `/`, `/ai-bootcamp`, `/ai`, `/resources/ai-prompts-library`. LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms. Per-page JS ≤ 100KB gzip on marketing pages. Lesson pages allowed up to ~150KB gzip (comments island + AccessGate).
- **Browser support**: latest 2 versions of Chrome, Safari, Firefox, Edge. iOS Safari + Android Chrome.
- **Accessibility**: WCAG 2.1 AA. Keyboard navigable. AA color contrast. ARIA labels on icon-only buttons.
- **Language**: site UI in Georgian (`<html lang="ka">`). Prompt library has bilingual prompt bodies (Georgian UI; per-prompt KA/EN toggle). Comment date formatting uses `Intl.DateTimeFormat('ka-GE', ...)`.
- **Fonts**: FiraGO (Georgian primary), Fira Code (mono/code), Orbitron (display, sparingly). Audit and drop the BPG Nino Mtavruli + Glaho loaded by `astro-migration`'s Layout but never used.
- **Theme**: marketing pages light by default; `/learn/*` and `/resources/ai-prompts-library` are dark. LessonComments uses neutral tokens (`border`, `bg-card`, `text-foreground`) — works in both themes.

---

## 9. Out of Scope

- Modifying GCP Functions, Postmark templates, Flitt dashboard config, or the Firestore schema
- Comment moderation tooling (moderation happens in Telegram via `bitcampManagerBot`; nothing on the website)
- Comments admin / analytics dashboard
- Hosting migration off GitHub Pages (track separately; revisit post-rebuild)
- View Transitions / fancy page transitions (defer)
- Visual redesign — this is a re-platforming, not a redesign
- Re-writing course content or prompts — content is locked
- Internationalization beyond Georgian + the bilingual prompt library
- Translating email templates
- Adding new Cloud Functions or new Firestore collections as part of the rebuild

---

## 10. Open Questions (decisions needed during the rebuild)

1. **Post-campaign state for `/ai-bootcamp`**: After 2026-05-26 23:59 the countdown ends. Does the page stay live with adjusted copy/price, get hidden, or become evergreen? *(Decide before Phase 4.)*
2. **`/python-sql` and `/fullstack-ai`**: Still actively promoted, or candidates to deprecate? *(Decide before Phase 2.)*
3. **`isPreview: true` on lessons**: Should visitors view preview lessons of paid `/learn/*` courses without a magic link? *(Decide before Phase 3.)*
4. **Trailing slash policy**: Pick `/foo` or `/foo/` for canonical URLs. *(Decide in Phase 0.)*
5. **AB test / scarcity / retargeting providers**: drop entirely or keep as scaffolding for future use? *(Decide before Phase 2.)*
6. **`/ai` indexing**: keep indexed or noindex like `/ai-bootcamp`? *(Decide before Phase 4.)*
7. **AccessGate primary path**: The current production AccessGate shows the email-entry form first, with the "haven't bought yet" CTA secondary. Confirm we keep that order (vs. surfacing the buy CTA first)? *(Decide before Phase 6.)*
8. **Comments theme**: Lesson pages are dark; LessonComments uses neutral shadcn tokens that need verifying in the dark Astro layout. Want a dark-specific palette pass during Phase 3, or accept defaults? *(Decide during Phase 3.)*
9. **Comments availability on lessons under `/courses/*` (free)**: Currently comments only render on `/learn/*` (gated) per the entitlement check. Confirm we keep free courses comment-free? *(Decide before Phase 3.)*
