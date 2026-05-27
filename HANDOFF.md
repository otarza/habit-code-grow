# HANDOFF — Astro Rebuild

Single-page cheat sheet for resuming this work in a fresh session.
For the full contract, read [REQUIREMENTS.md](./REQUIREMENTS.md) and [PLAN.md](./PLAN.md) (in that order).

---

## You are here

- **Branch:** `astro-rebuild` (in worktree at `/Users/otar/Projects/habit-code-grow-astro`)
- **Latest commit:** `6b10669` — icon swap + dark mode for /learn
- **Pushed to GitHub:** yes — https://github.com/otarza/habit-code-grow/tree/astro-rebuild
- **Build:** green, **780 static pages** in ~5s (`npm run build`)
- **Production untouched:** `main` still serves the React/Vite version. Deploy workflow only fires on push to `main`, not `astro-rebuild`.

---

## What's done

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | ✅ | BaseLayout w/ full SEO, sitemap, robots, `trailingSlash:'never'`, deploy workflow cleaned |
| 1 — Marketing components | ✅ | 13 sections ported (Navbar, Footer, Hero, FAQ, FreeCourses, Pricing, Testimonials, ProblemSolution, ThreeStepPlan, HowItWorks, SuccessFailureContrast, ChallengeTransformation, StickyCtaBar, VideoExplainer) |
| 2 — Marketing pages | partial | `/`, `/terms`, `/privacy`, `/404`, `/courses` index done. `/python-sql` + `/fullstack-ai` deferred (Open Q #2) |
| 3 — Content collections | ✅ | The headline perf win. 770+ lesson pages server-rendered with Shiki, sidebar, prev/next, LessonComments island wired to course-comments-api. `/courses/*` + `/learn/*` + their overviews. |
| 4 — Campaign pages | ✅ | `/ai-bootcamp` + `/ai` with Flitt modal island, Countdown island, vanilla-JS buy buttons dispatching `flitt:open`. Icons all Lucide-style SVGs (no emojis). |
| 5 — Prompts library | ✅ | `/resources/ai-prompts-library` zero-React (vanilla JS controls, 52 prompts × 2 languages pre-rendered) |
| 6 — ThankYou + AccessGate | partial | ThankYou ✅ with Meta+GA Purchase pixel firing. AccessGate hardening (lock-screen overlay) deferred — current state matches production's soft gate. |
| 7 — QA + cutover | ❌ | Pre-cutover checklist below |

---

## What's left (priority order)

### Must-do before cutover

1. **End-to-end test payment** on `/ai-bootcamp`. ₾35 via `bavshvebi` promo. Verify: Flitt modal opens → email + promo → Flitt embed → payment → `/thank-you?status=success` redirect → Postmark email → magic link opens `/learn/ai-bootcamp/...` with localStorage set + comments island calls `course-comments-api` successfully.
2. **Lighthouse mobile** ≥ 90 on `/ai-bootcamp`, `/ai`, `/resources/ai-prompts-library`, one lesson page.
3. **FB Sharing Debugger** OG preview check on each indexable route.
4. **SEO scan:** `grep` `dist/**/*.html` to confirm every page has unique `<title>` (not "BitCamp" default) + canonical + OG image, and no body-leaked meta tags.
5. **Homepage redesign** (user explicitly said they'll do this themselves before merge — treat current `/` as throwaway).

### Should-do polish

6. **AccessGate lock-screen overlay** on `/learn/*` (Phase 6 hardening). Currently lesson content is publicly accessible — matches production's soft-gate parity but is UX-incomplete. Add the email-entry form + URL-token decode component when ready.
7. **Visual review of /ai and /ai-bootcamp** — user confirmed icons are fixed; verify dark mode on /learn pages renders correctly.

### Defer / decide

8. **`/python-sql` + `/fullstack-ai`** — Open Q #2 (keep or deprecate?). If keep, port as static .astro using existing Phase 1 components.
9. **`@astrojs/tailwind` → `@tailwindcss/vite`** — deferred; current setup uses `--legacy-peer-deps`. Real Tailwind v4 migration is its own task.

---

## Resume in 60 seconds

```bash
cd /Users/otar/Projects/habit-code-grow-astro
git status                                  # should be clean
git log --oneline -5                        # confirm at 6b10669
npm run build                               # should produce 780 pages in ~5s
npm run dev -- --port 5173 --host           # local preview (port 5173 matches course-* API CORS)
```

Then open http://localhost:5173 and walk through `/`, `/ai-bootcamp`, `/ai`, `/learn/ai-bootcamp`, `/learn/ai-bootcamp/fundamentals/intro`, `/resources/ai-prompts-library`.

---

## Open decisions (carried from REQUIREMENTS §10 + PLAN §9)

| # | Question | Gates |
|---|---|---|
| 1 | Post-campaign `/ai-bootcamp` state — keep evergreen or hide? | Decided: keep live, will adjust copy when campaign ends |
| 2 | Deprecate `/python-sql` + `/fullstack-ai`? | Phase 2 completion |
| 3 | `isPreview` lesson behavior — open preview lessons on `/learn/*`? | Phase 3 polish |
| 4 | Trailing slash | Decided: `never` |
| 5 | Drop AB-test / scarcity / retargeting React providers? | Decided: yes, dropped in Phase 0 |
| 6 | `/ai` indexing — keep indexed? | Decided: yes |
| 7 | AccessGate primary path — email-form first vs buy CTA first? | Phase 6 hardening |
| 8 | Comments dark-theme palette pass | Phase 3 polish |
| 9 | Comments on `/courses/*` (free) — keep off? | Decided: off (current behavior) |
| 10 | Dev port matching API CORS | Decided: 5173 |

Remaining open: **#2, #3, #7, #8.**

---

## Architecture reminders (gotchas that bit us)

- **Image paths in lesson markdown** were broken by the `public/courses/* → src/content/courses/*` migration. Fixed at remark-plugin level (`src/lib/remark-absolute-assets.mjs`) — rewrites `../../../media/*` to `/media/*` in image+link AST nodes at build time. **Do NOT mass-edit the .md files**; the plugin handles it.
- **Flitt modal mount**: `client:load` directive on `<FlittCheckoutModal>` is required so the `flitt:open` event listener attaches before the user clicks Buy. Don't change to `client:visible`.
- **Buy buttons**: `<button data-buy="bootcamp">` or `data-buy="pro"`. An inline `<script>` in the page imports `handleBuy` from `@/lib/checkout.ts` and wires the click — keeps the GA + Meta Pixel tracking firing.
- **Dark mode on /learn**: `body.dark` selector in `src/layouts/BaseLayout.astro` overrides `--cp-*` CSS variables. Components use `var(--cp-foo, light-fallback)` — they automatically pick up dark when `bodyClass="dark"` is passed.
- **`--legacy-peer-deps`** required for `npm install` and `npm ci` because `@astrojs/tailwind@6` doesn't declare Astro 6 compatibility. Documented in PLAN; cleanup deferred.
- **Sitemap/robots**: auto-generated by `@astrojs/sitemap`. URLs use no trailing slash (matches canonicals).
- **CourseSidebar + manifest**: built-time read of `src/content/{collection}/{slug}/manifest.json` via `src/lib/course-manifest.ts`. NOT a content-collection entry — it's separate file-system loading.

---

## Key files quick-reference

| Path | Purpose |
|---|---|
| `astro.config.mjs` | Site URL, integrations, markdown config (remark plugins + Shiki theme), Vite aliases |
| `src/layouts/BaseLayout.astro` | The ONE layout. Accepts `title/description/ogImage/canonical/noindex/bodyClass`. Holds GA + Meta Pixel inline scripts. Dark CSS variables under `body.dark`. |
| `src/components/Icon.astro` | 14 Lucide-style icons. Add new ones by extending the union + a conditional block. |
| `src/lib/checkout.ts` | Flitt button hashes + `handleBuy` + `flitt:open` event dispatch. Unchanged from production. |
| `src/lib/course-manifest.ts` | Build-time manifest loader for /learn + /courses |
| `src/lib/remark-video-shortcodes.mjs` | `{% youtube/vimeo/video/embed "url" %}` → iframes at build time |
| `src/lib/remark-absolute-assets.mjs` | Rewrites `../../*` paths in markdown to absolute `/*` |
| `src/content/learn/*`, `src/content/courses/*` | Content collections (markdown + manifest.json per course) |
| `src/data/aiPrompts.ts` | 52 prompts for the library |
| `.github/workflows/deploy.yml` | GitHub Pages deploy — only fires on `main` push |

---

## Cutover plan (when ready)

1. Resolve remaining open questions (#2, #3, #7, #8).
2. Homepage redesign in `/` (user has explicit plans).
3. Run the must-do QA checklist above. Real test payment required.
4. Merge `astro-rebuild` → `main` as a **single squash commit** for clean rollback.
5. Watch GA Realtime, Postmark logs, Flitt logs, and Cloud Function logs for 1 hour.
6. **Rollback if needed:** `git revert <merge-sha> && git push` — ~3 min to redeploy the React/Vite version. GCP Functions, Firestore, Postmark, Flitt are all untouched by the rebuild, so payments/magic-links/comments are unaffected by any frontend rollback.
