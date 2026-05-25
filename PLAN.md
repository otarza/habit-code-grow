# BitCamp — Astro Rebuild Plan

Companion: `REQUIREMENTS.md`.

---

## 0. Strategy

**Rebuild on top of the existing Astro scaffolding** (`astro-migration`'s deps + config), but throw away the lift-and-shift component approach. The new model:

- Pages are `.astro` files composing static `.astro` section components
- React only where there's actual state, with the *lightest* hydration directive that works
- Lesson markdown is server-rendered via Astro Content Collections (Shiki for syntax highlighting — zero client JS)
- SEO via Layout props — no `react-helmet-async`, no `mock-helmet`
- Routing via plain `<a>` (Astro is MPA) — no `react-router-dom`, no `mock-router`. Optional `<ClientRouter />` for SPA-feel transitions post-rebuild
- Assets via Astro's `<Image>` / `astro:assets` — no `[object Object]` import bug
- Dynamic features (login link request, lesson comments) stay React islands hitting the existing Cloud Functions; the rebuild does NOT add Firestore client SDK to the bundle

Production stays on `main` (React/Vite) throughout. Cutover is a single squash merge at the end.

---

## 1. Branch & Deployment Strategy

- **`astro-rebuild`** (this branch): all work happens here. Branched off `astro-migration` to keep working Astro deps + config + Layout starting point.
- **Pre-Phase 0**: merge `main` into `astro-rebuild` to pick up the 9 commits diverged on main (login-link flow, entitlements, lesson comments, new lessons, checkout fixes, bootcamp pricing). Conflicts confirmed: only `package.json` + `package-lock.json` (trivial — keep astro deps, regenerate lockfile via `npm install`).
- **`astro-migration`**: kept as reference, not deleted.
- **`main`**: production (React/Vite). CI only deploys from `main`. Untouched until cutover.
- **Local preview**: `npm run dev` and `npm run build && npm run preview` for each phase.
- **Cutover** (end of Phase 7): single squash merge `astro-rebuild → main`. Rollback = `git revert <merge-sha>` → CI redeploys old build in ~3 min.

---

## 2. Repository cleanup (continuous, finalized in Phase 0)

**Delete** (Vite/lift-and-shift residue):
- `src/main.tsx`, `src/App.tsx`, `src/App.css` — Vite SPA entry, dead
- `src/react-pages/` — entire dir of React page components, replaced by `.astro` pages
- `src/lib/mock-helmet.tsx`, `src/lib/mock-router.tsx` — shims, no longer needed
- `src/astro-wrapper.tsx` — only used by the lift-and-shift pattern
- `src/components/ReactProviders.tsx` — Tanstack Query / Tooltip / Toaster providers; reintroduce per-island only where needed
- `src/components/SEO.tsx` — replaced by Astro Layout SEO
- `index.html` at repo root — Vite-era leftover
- `vite.config.ts` — Astro has its own config
- `bun.lockb` — duplicate lockfile (CI uses npm)

**Keep & port** (production code we'll reuse as islands or as references):
- `src/components/campaign/FlittCheckoutModal.tsx` — keep, mount as island in campaign pages
- `src/components/campaign/Countdown.tsx` — keep, mount as island
- `src/components/course/LessonComments.tsx` — keep, mount as island in lesson pages (NEW from main)
- `src/lib/checkout.ts` — keep as-is (Flitt button hashes + `handleBuy` + `flitt:open` event dispatch)
- `src/data/aiPrompts.ts` — keep as-is
- AccessGate logic (currently in `src/pages/LearnCoursePage.tsx`) — port the URL-decode + email-entry form into a new dedicated island

**Trim devDeps**:
- `puppeteer` — not needed (Astro is SSG)
- `lovable-tagger` — Vite-only
- `react-router-dom`, `react-helmet-async` (and their `@types/*`) — gone with the rewrite

**Update**:
- `package.json` `name`: `vite_react_shadcn_ts` → `bitcamp-astro`
- `.github/workflows/deploy.yml`: drop the Puppeteer system-deps install step
- Drop `@astrojs/tailwind` (deprecated) in favor of `@tailwindcss/vite`

---

## 3. Phases

Each phase: goals → deliverables → acceptance criteria → effort → risks. Phases are roughly dependency-ordered; Phase 1 sections can run in parallel with Phase 0 once the Layout exists.

---

### Phase 0 — Foundation

**Goal**: Clean Astro skeleton with a real Layout, real per-page SEO, working asset pipeline, dev/build/deploy loop verified.

**Deliverables**
- `src/layouts/BaseLayout.astro` accepting props: `title`, `description`, `ogImage?`, `canonical?`, `noindex?: boolean`. Renders into real `<head>`. Includes GA + Meta Pixel inline scripts.
- `src/layouts/MarketingLayout.astro` extends BaseLayout: adds Navbar + Footer slots, light theme.
- `src/layouts/LearnLayout.astro` extends BaseLayout: dark theme, no marketing chrome.
- `src/components/Navbar.astro` + `src/components/Footer.astro` — static; mobile menu = vanilla `<script>` (no React).
- `astro.config.mjs` cleaned up: remove unused vite aliases (mock-router/mock-helmet), drop `react-syntax-highlighter` from `optimizeDeps` (no longer used), add `@astrojs/sitemap` integration, set `site: 'https://www.bitcamp.ge'`.
- Switch Tailwind integration from `@astrojs/tailwind` to `@tailwindcss/vite`.
- Asset pipeline: confirm `import logo from '@/assets/bitcamp-logo.png'` returns an `ImageMetadata` and is used via `<Image src={logo} ... />` or `<img src={logo.src}>` — pick one and document.
- Set up `.env.example` documenting `VITE_COURSE_ACCESS_API_URL` and `VITE_COURSE_COMMENTS_API_URL` (both default to the production us-central1-bitcamp-flitt URLs).
- Repo cleanup per §2.

**Acceptance criteria**
- `npm run build` succeeds with no errors
- An empty `/` placeholder renders with correct `<head>`: title, meta description, OG, canonical
- `dist/index.html` `<head>` contains exactly the expected meta tags — no body-leaked tags, no duplicate `<title>`
- Logo renders correctly (no `[object Object]`)
- GA + Meta Pixel scripts fire on page load (verified in DevTools Network)
- `sitemap.xml` generated; `robots.txt` references it

**Effort**: 1–2 days

**Risks**
- Astro 6 + Tailwind v3 migration to `@tailwindcss/vite` may have small breakages — verify with one styled component before deleting the old integration
- Asset import pattern differs from Vite — settle on the pattern before scaling

---

### Phase 1 — Shared static components

**Goal**: All reusable section components ported to `.astro`. No interactivity beyond the mobile menu.

**Deliverables**
- `src/components/marketing/Hero.astro`
- `src/components/marketing/FreeCoursesSection.astro` — reads featured course manifests from the content collection (Phase 3) OR hardcodes 5 featured courses for Phase 1, rewires in Phase 3
- `src/components/marketing/Testimonials.astro`
- `src/components/marketing/ProblemSolution.astro`
- `src/components/marketing/ThreeStepPlan.astro`
- `src/components/marketing/HowItWorks.astro`
- `src/components/marketing/PricingSection.astro`
- `src/components/marketing/SuccessFailureContrast.astro`
- `src/components/marketing/ChallengeTransformation.astro`
- `src/components/marketing/FAQ.astro` — shell static; expand/collapse via `<details>`/`<summary>` (zero JS)
- `src/components/marketing/VideoExplainer.astro`
- `src/components/marketing/StickyCtaBar.astro` — vanilla JS for scroll visibility
- `src/components/marketing/TrustIndicators.astro` (if revived)

**Acceptance criteria**
- Each component renders correctly in isolation
- Visual parity with production (side-by-side check on key sections)
- No React unless documented why

**Effort**: 3–5 days

**Risks**
- Some components have hover/animation states — Tailwind classes should translate cleanly, but spot-check
- Image references — apply Phase 0 pattern uniformly

---

### Phase 2 — Core marketing pages

**Goal**: Live `.astro` pages for routes that don't need campaign chrome or course infrastructure.

**Deliverables**
- `src/pages/index.astro` — composes Phase 1 components in production's order. Passes full SEO props.
- `src/pages/python-sql.astro` (or deprecate per Open Q #2)
- `src/pages/fullstack-ai.astro` (or deprecate per Open Q #2)
- `src/pages/terms.astro` — static legal content
- `src/pages/privacy.astro` — static legal content
- `src/pages/404.astro`
- `src/pages/courses/index.astro` (CoursesIndex) — temporarily hardcodes the 5 featured courses; rewires to content collection in Phase 3

**Acceptance criteria**
- Every page has correct per-page SEO (title, description, canonical, OG image)
- Visual parity with production on desktop + mobile
- All internal links resolve to real routes
- Lighthouse Performance ≥ 90 on mobile for `/`
- No console errors

**Effort**: 3–4 days

**Risks**
- `react-pages/Index.tsx` composes ~17 sections — work front-loaded in Phase 1, this phase is mostly assembly
- Legal pages may have edge formatting; check rendering carefully

---

### Phase 3 — Course content collections + lesson comments island

**Goal**: Lesson markdown rendered server-side. No `react-markdown`, no `react-syntax-highlighter` on client. Real static URLs per lesson. Lesson comments island wired to `course-comments-api`.

**Deliverables**
- `src/content.config.ts` defining two collections:
  - `courses` (free): source `src/content/courses/{slug}/...`
  - `learn` (gated): source `src/content/learn/{slug}/...`
  - Schemas: manifest (z.object matching current shape) + lesson (z.object: `title`, `order`, `videoUrl?`, `videoDuration?`, `isPreview?`)
- **Content migration** from `public/learn-content/*` and `public/courses/*` to `src/content/learn/*` and `src/content/courses/*`. `public/` keeps only static assets. Includes the new `ai-pro/customer-profile/` module (3 lessons).
- Custom remark plugin: converts `{% youtube "url" %}`, `{% vimeo "url" %}`, `{% video "url" %}`, `{% embed "url" %}` shortcodes to iframes at build time.
- `src/components/course/CourseSidebar.astro` — static + native `<details>` for topic collapse, with current-lesson highlighted (set via Astro props, not JS).
- `src/components/course/CourseOverview.astro` — static; lists topics + lessons.
- `src/components/course/LessonView.astro` — renders the lesson body via Astro's built-in markdown rendering (Shiki for code blocks); video frontmatter rendered above body; prev/next nav at bottom; mounts `<LessonComments client:visible ...>` at the very bottom of gated lessons.
- `src/components/course/LessonComments.tsx` — port from main (`src/components/course/LessonComments.tsx`). Reads `VITE_COURSE_COMMENTS_API_URL`. Props: `courseSlug`, `topicSlug`, `lessonSlug`, `lessonTitle`, `courseTitle`, `viewerEmail?`.
- `viewerEmail` propagation: pre-paint vanilla `<script>` reads `localStorage[bitcamp_soft_access_{slug}_email]`, writes it to a `data-viewer-email` attribute on the comments container. The island reads the attribute on mount. (Avoids a flash of "log in to comment" for users who are already authed.)
- `src/pages/courses/[...slug].astro` — `getStaticPaths()` from `getCollection('courses')`, one HTML per course overview and per lesson.
- `src/pages/learn/[...slug].astro` — same for the `learn` collection. Lesson content rendered server-side, then wrapped in an AccessGate island (Phase 6 hardens; for Phase 3 just stub the gate to show content).
- `src/pages/courses/index.astro` rewired to use `getCollection('courses')`.
- `src/components/marketing/FreeCoursesSection.astro` rewired to use `getCollection('courses')`.

**Acceptance criteria**
- Every lesson under both collections has a real static URL (e.g. `dist/learn/ai-bootcamp/fundamentals/intro/index.html`)
- Each lesson's HTML contains the full rendered markdown — no client-side `fetch` of `.md` files
- Code blocks rendered with Shiki syntax highlighting at build time
- `react-markdown` and `react-syntax-highlighter` no longer appear in any client bundle (verify with `grep` in `dist/_astro/`)
- Existing YouTube/Vimeo embeds in all lessons still render
- Lesson nav (prev/next) works in correct order
- Course sidebar shows correct current-lesson highlight
- Lesson counts match the old manifests (script-verify before/after) — including the new `ai-pro/customer-profile/` module
- LessonComments mounts only on `/learn/*` lessons (not on `/courses/*`), GET succeeds against the real `course-comments-api`, and POST succeeds for a user with active entitlement (manual test against a known-eligible email)

**Effort**: 4–6 days

**Risks**
- Content collection migration could miss lessons → write a count-check script (`compare manifest topic.lessons.length vs. files in src/content/{collection}/{slug}/{topic}/`)
- Some lessons may have non-standard frontmatter (multi-line strings, etc.) the current simple parser handled but `gray-matter` doesn't — run a parse-all dry run
- Video shortcode handling needs a custom remark plugin — bounded but new code
- LessonComments uses shadcn `Button` + neutral tokens; verify visual fit in the dark Astro learn layout (per Open Q #8)
- Comments API CORS includes `localhost:5173` and `:8080`; if dev port changes, requests will fail silently

---

### Phase 4 — Campaign pages

**Goal**: `/ai-bootcamp` and `/ai` rebuilt as Astro pages with the Flitt checkout modal as a focused React island.

**Deliverables**
- `src/lib/checkout.ts` — port as-is from production (button hashes, promo codes, `handleBuy`, `flitt:open` CustomEvent dispatch)
- `src/components/campaign/Countdown.tsx` — `client:idle` island (small)
- `src/components/campaign/FlittCheckoutModal.tsx` — reused from production as a React island, mounted once per campaign page with `client:load`. Listens for `flitt:open` CustomEvent. Includes the fix from `0cb1268` that passes checkout email to Flitt sender fields.
- `src/components/campaign/CampaignFooter.astro` — static
- `src/components/campaign/CampaignStickyCta.astro` (or `.tsx` if logic requires) — `client:idle` if React
- FAQ accordion: prefer native `<details>`/`<summary>` (zero JS)
- `src/pages/ai-bootcamp.astro` — composes hero, sections, FAQ, countdown, mounts Flitt modal. Renders regular price alongside promo price (per `f8e8ef1`). Passes `noindex: true` to Layout.
- `src/pages/ai.astro` — same for the mentored version. Noindex decision per Open Q #6.
- Buy buttons: plain `<button data-buy="bootcamp">...</button>` with a tiny `<script>` dispatching `window.dispatchEvent(new CustomEvent('flitt:open', { detail: ... }))`. No React for triggers.

**Acceptance criteria**
- Both campaign pages render full content statically; only Flitt modal + Countdown = islands
- End-to-end: click Buy → modal opens → email entered → promo code (if applicable) → Flitt embed loads → real ₾35 test payment completes → Flitt webhook upserts entitlement to Firestore → redirect to `/thank-you?status=success&...` → magic-link email arrives → magic link opens lesson
- Promo code `bavshvebi` routes to the discounted button hash (verified in modal display + Flitt button-ID used)
- `noindex` confirmed in built HTML head
- Apple Pay button appears in Flitt embed
- JS bundle per campaign page: ≤ 150KB gzip (vs. ~520KB today)

**Effort**: 3–4 days

**Risks**
- `FlittCheckoutModal` must be mounted in DOM before any Buy click — confirm `client:load` works (or use `client:visible` if it can guarantee event handler attachment before user interaction is possible)
- The `handleBuy` function currently directly dispatches the event — verify the event-listener wiring in the new mount pattern
- Test payment cost: use the ₾35 `bavshvebi` promo path to minimize cost; refund post-test

---

### Phase 5 — Prompt library

**Goal**: `/resources/ai-prompts-library` as a fast static page with a minimal interactive shell.

**Deliverables**
- `src/data/aiPrompts.ts` — port unchanged (52 prompts)
- `src/pages/resources/ai-prompts-library.astro` — renders all 52 prompt cards statically into HTML (hero, stats, badges, grid, footer CTA banner)
- Interactive controls (search, category filter pills, language toggle, copy-to-clipboard):
  - **Preferred**: vanilla `<script>` (~50 lines) using `data-*` attributes and CSS `[data-category]` / `[data-lang]` selectors for filtering. Zero React on the page.
  - **Fallback**: small `<PromptLibraryControls client:idle />` React island (~80 lines)
- Pre-render *both* language bodies into the static HTML; CSS toggle reveals one or the other based on a `data-lang` attribute on `<body>` or container. Copy button reads the currently-visible body.

**Acceptance criteria**
- All 52 prompts visible in `view-source` of the static HTML
- Search filters cards in <100ms
- Category pills filter correctly with counts
- Language toggle swaps visible prompt body (Georgian ↔ English)
- Copy button copies the prompt in the currently-selected language with feedback
- JS bundle for this page: ≤ 10KB gzip (vs. ~520KB today)

**Effort**: 1–2 days

**Risks**
- Vanilla JS approach loses ergonomics if filtering logic grows; if it does, switch to React island early in the phase

---

### Phase 6 — ThankYou + AccessGate (URL token + login-link form)

**Goal**: Post-purchase flow end-to-end. AccessGate handles both unlock paths (URL token + email-entry form). Magic-link gating doesn't flash for valid users.

**6a. ThankYou page**

- `src/pages/thank-you.astro` — static page with three template states (success / declined / default). Inline `<script>`:
  - Reads `?status`, `?order_id`, `?amount`, `?currency`, `?product` from URL
  - On `status=success`: fires Meta `Purchase` event (with `eventID` for dedup) and GA4 `purchase` event
  - sessionStorage dedup: key `bitcamp_purchase_fired_{order_id}`
  - Toggles visibility of the success/declined/default content blocks via `data-variant`
  - Renders `{product_label}` and `#{order_id}` into placeholders

**6b. AccessGate — URL token decode**

- `src/components/learn/AccessGate.tsx` — `client:only="react"` island OR pre-paint vanilla script (preferred for no-flash UX):
  - Read URL for `?access={base64}`, decode, validate email shape, set `localStorage[bitcamp_soft_access_{slug}]` + `bitcamp_soft_access_{slug}_email`
  - Strip the query param via `history.replaceState`
  - Read existing localStorage flag
  - If access → render `{children}` (the lesson) OR remove `[data-locked]` attribute
  - If not → render the email-entry form (see 6c)
- `src/pages/learn/[...slug].astro` wraps the lesson content in `<AccessGate slug={courseSlug} client:only="react">...</AccessGate>`
- Use pre-paint script with `[data-locked]` attribute toggling for the no-flash path; only mount the React island when the gate is needed

**6c. AccessGate — email-entry login-link form**

- The AccessGate UI when no localStorage access:
  - Email input + "Send me a login link" button
  - Loading state during fetch
  - Neutral success state ("If this email has access, the link has been sent")
  - Error state ("Try again in a few minutes")
  - Secondary CTA: "haven't bought yet?" linking to buy page
- Fetch implementation:
  - `POST` to `VITE_COURSE_ACCESS_API_URL` (default `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-access-api`)
  - Body `{email, courseSlug}`
  - The API always returns `{ok:true, message:"..."}` regardless of eligibility (no enumeration)
  - Frontend always shows the same neutral confirmation
- Mirror the existing production `AccessGate` JSX from `src/pages/LearnCoursePage.tsx` (lines 64–205); minor adjustments for Astro context

**Acceptance criteria**
- Magic link from a customer email (URL token path) opens the lesson on first load with no visible flash of the lock screen
- Re-opening a lesson later (localStorage flag set) shows lesson immediately
- Email-entry form on a fresh browser: submit a known-eligible email → real login-link email arrives → click magic link → lesson opens
- Email-entry form with unknown email → same neutral confirmation, no email sent
- `/thank-you?status=success&order_id=ABC&product=bootcamp&amount=9900&currency=GEL` fires Meta + GA purchase events with the correct ₾99 value (9900 tetri → 99 GEL handling)
- Page refresh on the same `/thank-you?...` does NOT re-fire events
- Declined and default variants render correct content
- `noindex` on `/thank-you` and `/learn/*`

**Effort**: 2–3 days (was 1–2; split + login-link form added)

**Risks**
- `client:only="react"` ships a small React runtime (~30KB gzip) for the form. Acceptable for `/learn/*` (gated pages, conversion-driven). Alternative: vanilla form + fetch in a `<script>` (no React for the form at all) — smaller bundle, more JS to write.
- The amount-conversion (tetri → GEL) was a real bug in past versions; preserve the existing logic precisely
- CORS: `course-access-api` allows `https://www.bitcamp.ge`, `localhost:8080`, `localhost:5173`. Verify dev port matches one of these.

---

### Phase 7 — QA, parity, cutover

**Goal**: Verify the rebuild matches production behavior before going live.

**Pre-cutover checklist**

*Routes & content*
- [ ] Every production route returns 200 on the new build
- [ ] Every lesson in `ai-bootcamp` (26) and `ai-pro` (incl. new `customer-profile/` module) renders with body + video
- [ ] Every lesson in `python`, `java`, `html-css`, `sql`, `angular` renders
- [ ] Sitemap.xml validates and lists all expected URLs

*SEO*
- [ ] Scripted check: every `dist/**/*.html` `<head>` contains `<title>` (not "BitCamp" default), `<meta name="description">`, `<link rel="canonical">`, `og:image`, `og:title`
- [ ] No body-leaked SEO tags (`grep` for `<title>` inside `<body>`)
- [ ] Facebook Sharing Debugger shows correct OG preview for `/`, `/ai-bootcamp`, `/ai`, `/resources/ai-prompts-library`
- [ ] `robots.txt` references `sitemap.xml`

*Performance*
- [ ] Lighthouse mobile Performance ≥ 90 on `/`, `/ai-bootcamp`, `/ai`, `/resources/ai-prompts-library`
- [ ] Per-page JS gzip size: marketing pages ≤ 100KB, campaign ≤ 150KB, lesson pages ≤ 150KB (with comments island), prompts ≤ 10KB
- [ ] No `react-markdown` / `react-syntax-highlighter` in any client bundle

*Critical flows (manual)*
- [ ] Real test payment: ₾35 via `bavshvebi` promo → Flitt success → entitlement upserted to Firestore (verify via Firebase console) → `/thank-you` → magic-link email arrives → magic link opens `/learn/ai-bootcamp` lesson
- [ ] Repeat with a declined card → `/thank-you?status=declined` → no purchase event fired, no Firestore entitlement created
- [ ] Apple Pay flow on iOS Safari (real device, not simulator)
- [ ] Magic link from an existing customer's email (re-test) → still opens
- [ ] Email-entry login form: submit known-eligible email → login-link email arrives → click → lesson opens
- [ ] Email-entry login form: submit unknown email → neutral response, no email sent
- [ ] Lesson comment: from a logged-in (entitled) browser, post a comment → appears immediately in "own comments" → Telegram moderation message arrives → Approve → comment shows in approved list on next page load
- [ ] Lesson comment from a non-entitled browser → 403 error shown gracefully

*Tracking*
- [ ] GA Realtime shows page views on a manual test session
- [ ] Meta Events Manager Test Events shows `PageView`, `InitiateCheckout`, `Purchase` with correct `eventID`

*Misc*
- [ ] CNAME file present at `public/CNAME` → bitcamp.ge
- [ ] `.well-known/apple-developer-merchantid-domain-association` present in `dist/`
- [ ] CI green on `astro-rebuild`
- [ ] Deploy workflow updated (Puppeteer install step removed)
- [ ] Env vars: `VITE_COURSE_ACCESS_API_URL` and `VITE_COURSE_COMMENTS_API_URL` set correctly (default URLs work; only override if testing against a staging Cloud Function)

**Cutover**
- [ ] Single squash merge `astro-rebuild → main`
- [ ] Watch GA Realtime for 1 hour
- [ ] Watch Postmark + Flitt logs for 1 hour
- [ ] Watch Cloud Function logs (course-access-api, course-comments-api, flitt-webhook) for errors
- [ ] Test one real payment after deploy
- [ ] Post a test comment on one lesson after deploy

**Acceptance criteria**: all checklist items green.

**Effort**: 2–3 days

**Risks**
- Test payment requires real money (₾35 minimum via promo) — budget for it
- Apple Pay can be temperamental — verify on at least one physical iOS device
- CNAME file is in `public/` already; verify it gets copied to `dist/` (it should — Astro copies `public/` verbatim)

---

## 4. Total Effort

Sum of phase ranges: **18–30 days** focused work (up from 17–28 — Phase 6 grew with the login-link form, Phase 3 grew with the comments island). Phases overlap (Phase 1 with Phase 0; Phase 5 with Phase 3). Realistic single-person calendar: **3–4 weeks**.

---

## 5. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Magic-link URLs break for already-paid customers | Low | High | Phase 6 acceptance: `?access={token}` flow end-to-end |
| Email-entry login form fetches break (CORS, env var wrong) | Medium | High | Phase 6 acceptance: real form submission against the live API; document env vars in `.env.example` |
| Lesson comments API returns errors silently in UI | Medium | Medium | LessonComments shows user-friendly fallback; verify in Phase 3 |
| Flitt embed breaks under new mount pattern | Medium | High | Phase 4 acceptance: real test payment end-to-end |
| Shiki differs from `react-syntax-highlighter` for some languages | Low | Low | Spot-check 3 lessons with code blocks in Phase 3 |
| Asset URL changes break images | Medium | Medium | Phase 0 locks the pattern; verify before scaling |
| SEO regression on cutover | Low | High | Pre-cutover scripted check that every dist HTML has title + description + canonical |
| Active ads driving traffic during rebuild see broken pages | N/A | High | Production stays on `main` until cutover; rebuild lives on `astro-rebuild` branch only |
| Cumulative scope creep | Medium | Medium | Out-of-scope list in REQUIREMENTS §9 is enforced; defer changes to post-rebuild |
| Content migration loses lessons (esp. new `customer-profile/`) | Low | High | Phase 3 acceptance: lesson counts match manifests pre/post for both collections |
| `course-access-api` or `course-comments-api` deploys after frontend cutover | Low | High | These APIs already deployed on production via main; no coordination needed — they're the same endpoints |

---

## 6. Rollback Plan

- Production = `main`; rebuild = `astro-rebuild` branch
- Cutover is a single squash merge
- If anything breaks: `git revert <merge-sha> && git push` → CI redeploys the React/Vite version in ~3 minutes
- Magic links are URL-based, no DB state to roll back — instant rollback safe
- GCP Functions, Firestore, and Postmark are untouched by the rebuild → payments + emails + comments unaffected by frontend rollback
- Already-posted comments and granted entitlements persist across rollback (they live in Firestore, not the frontend)

---

## 7. What Stays the Same (zero rebuild work)

Not touched by the rebuild:

**Backend & infrastructure** (all in GCP project `bitcamp-flitt`, region `us-central1`):
- `flittWebhook` Cloud Function (Flitt payment callback → Firestore entitlement + Postmark welcome)
- `flittRedirect` Cloud Function (POST→303 GET to `/thank-you`)
- `bitcampManagerBot` Cloud Function (Telegram bot: `/invite` + comment moderation callbacks)
- `course-access-api` Cloud Function — **the rebuild calls this** at `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-access-api`
- `course-comments-api` Cloud Function — **the rebuild calls this** at `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-comments-api`
- Firestore database (`bitcamp-flitt`, Native mode, `us-central1`) and all its collections
- Flitt dashboard config (button hashes, success/decline URLs, design template)
- DNS (Cloudflare → GitHub Pages)
- Apple Pay merchant verification file (carries through `public/.well-known/`)
- The `CNAME` file at `public/CNAME`
- Tracking IDs (GA4, Meta Pixel)

**Content & templates**:
- All Postmark templates (`course-access-*`, `receipt-confirmation-*`, `course-login-link`)
- Email content (no template changes)
- Email magic-link URL format
- Lesson markdown content (just migrating its filesystem location)
- Prompt library data

---

## 8. Environment Variables

Frontend Vite-exposed (defaults work for production):

| Variable | Default | When to override |
|---|---|---|
| `VITE_COURSE_ACCESS_API_URL` | `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-access-api` | If testing against a staging Cloud Function |
| `VITE_COURSE_COMMENTS_API_URL` | `https://us-central1-bitcamp-flitt.cloudfunctions.net/course-comments-api` | Same |

Both are baked into the bundle at build time. Document in `.env.example` (Phase 0).

CORS allowed origins on both APIs include `https://www.bitcamp.ge`, `http://localhost:8080`, `http://localhost:5173` (and 127.0.0.1 variants). Astro dev server defaults to 4321 — **may need updating** on the API side OR run dev on one of the allowed ports (`npm run dev -- --port 5173`).

---

## 9. Open Questions (decisions needed during the rebuild)

Carried from `REQUIREMENTS.md` §10:

1. Post-campaign state for `/ai-bootcamp` *(before Phase 4)*
2. `/python-sql` and `/fullstack-ai` keep or deprecate *(before Phase 2)*
3. `isPreview` lesson behavior *(before Phase 3)*
4. Trailing slash policy *(in Phase 0)*
5. AB test / scarcity / retargeting providers — drop entirely? *(before Phase 2)*
6. `/ai` indexing post-campaign *(before Phase 4)*
7. AccessGate primary path — email-entry form first vs. buy CTA first? *(before Phase 6)*
8. Comments dark-theme palette pass *(during Phase 3)*
9. Comments on `/courses/*` (free) — keep gated/disabled or open? *(before Phase 3)*
10. Astro dev port: bump course-access-api / course-comments-api CORS to include Astro's default 4321, or run dev on `:5173`? *(in Phase 0)*
11. Hosting target: GitHub Pages vs. Cloudflare Pages — orthogonal; revisit post-rebuild

---

## 10. First Concrete Next Step

Once these docs are reviewed/approved and the Open Questions are answered (at least #4 for Phase 0 and #2/#5 for Phase 2):

1. **Merge `main` into `astro-rebuild`** to pick up the 9 commits with login-link + comments + entitlements + new lessons. Resolve `package.json` and `package-lock.json` conflicts; run `npm install` to regenerate the lockfile; `npm run build` to verify it still builds.
2. Audit the merged tree: confirm `src/components/course/LessonComments.tsx`, the updated `LearnCoursePage.tsx`, and the new lesson markdown files are present.
3. Delete the leftover Vite + lift-and-shift files per §2.
4. Create `src/layouts/BaseLayout.astro` with full SEO prop support.
5. Migrate one page (`/terms` — simplest) end-to-end to validate the new pattern.
6. Lighthouse-check it.
7. Commit, then scale the pattern.

That single migrated page becomes the template for everything else.
