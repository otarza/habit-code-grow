# Independence Day Campaign — Agent Progress Tracker

**Campaign**: Georgian Independence Day (May 26, 2026) sales campaign
**Products**: AI Prompt Engineering Bootcamp (₾149) + Full AI Architect Program (₾249)
**Campaign runs**: May 19–26, 2026
**Campaign ends**: 2026-05-26T23:59:59+04:00 (Asia/Tbilisi)
**Repo host**: GitHub Pages — push to `main` → CI builds → deploys `dist/`

---

## Legal & Payment Details (pre-filled)

| Field | Value |
|-------|-------|
| Legal name | Otar Zakalashvili (PE — physical person, not LLC) |
| Personal ID / Tax ID | 01001071740 |
| Registered address | მირიან მეფის ქუჩა, 11გ, ბინა #39 |
| Public phone | +995 557 15 12 90 |
| Public email | hello@bitcamp.ge |
| Bank 1 | TBC Bank — Otar Zakalashvili — GE75TB7003815365100012 |
| Bank 2 | Bank of Georgia — Otar Zakalashvili — GE58BG0000000610012590 |

**Replace in templates**: `[LLC_NAME]` → `ო. ზაკალაშვილი (ი/მ)`, `[ID_CODE]` → `01001071740`, `[ADDRESS]` → `მირიან მეფის ქუჩა, 11გ, ბინა #39`, `[PHONE]` → `+995 557 15 12 90`

> Note: Bank details go only in confirmation emails (receipt-confirmation-*.html), never on public pages.

---

## Still Needed from Otar (blockers noted inline)

| # | Item | Blocks |
|---|------|--------|
| 7 | Postmark server token → `POSTMARK_SERVER_TOKEN` | Phase 6 email send |
| 8 | n8n webhook URL → `N8N_WEBHOOK_URL` | Phase 6 pipeline |
| 9 | Tally form ID — Bootcamp | CTA button on /ai-bootcamp |
| 9 | Tally form ID — Architect | CTA button on /ai-architect |
| 10 | Google Classroom join link — Bootcamp | course-access-bootcamp.html |
| 10 | Google Classroom join link — Architect | course-access-architect.html |
| 10 | Discord invite URL | Both access emails |
| 10 | Python course URL | Bootcamp access email |
| 10 | SQL course URL | Bootcamp access email |
| — | Flitt product URLs (after Flitt activates) | CHECKOUT config swap |

---

## Codebase Snapshot

- **Framework**: Vite 5 + React 18 + TypeScript
- **Router**: react-router-dom v6, BrowserRouter, routes in `src/App.tsx`
- **CSS**: Tailwind CSS (`tailwind.config.ts`) + shadcn/ui components
- **Current font**: FiraGO — new pages need Inter added
- **Footer**: `src/components/Footer.tsx` — needs legal/payment overhaul
- **Static assets**: `public/` (served at root), `src/assets/` (bundled)
- **Deploy**: Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages
- **Existing /ai page**: `src/pages/AIPromptEngineering.tsx` — has fake urgency tools
  (EvergreenTimer, live viewer counter, EpicPixelBackground, ScarcityProvider) —
  reference for structure only, not for aesthetics
- **Best testimonials for new pages** (pick 4 from AITestimonials.tsx):
  - მიხეილ ჯერიაშვილი — systemic approach, detailed
  - Ia Kiknadze — accessibility, emigrant with busy schedule
  - Maia Pavliashvili — sequential and interesting
  - George Gegelia — short video format praise

---

## Design System (apply to new pages only — do not break /ai)

```css
:root {
  --bg: #0A0A0B;
  --surface: #141416;
  --surface-elevated: #1C1C20;
  --border: #2A2A30;
  --border-strong: #3A3A42;
  --text-primary: #F5F5F7;
  --text-secondary: #A0A0AB;
  --text-muted: #6B6B75;
  --accent: #DA291C;
  --accent-soft: rgba(218,41,28,0.12);
  --accent-text: #FF6B5E;
  --success: #4ADE80;
  --cta-bg: #F5F5F7;
  --cta-text: #0A0A0B;
}
```

Type scale: Inter font. Text sizes: 13/15/17/20/24/32/44/60px.
Spacing: 4/8/12/16/24/32/48/64/96/128px.
Max content width: 680px (text pages), 920px (landing pages).
No Navbar on new pages — only BitCamp wordmark top-left.
**DO NOT**: gradient backgrounds, emoji headlines, animated borders, live viewer counters,
exit-intent modals, pulsing badges, trust-badge stacks. Countdown alone provides urgency.

---

## Checkout Config (shared between both pages)

```js
// src/lib/checkout.ts
export const CHECKOUT = {
  provider: 'tally',  // change to 'flitt' once Flitt activates
  tally: {
    bootcamp: '[TALLY_FORM_ID_BOOTCAMP]',   // fill in after Otar creates form
    architect: '[TALLY_FORM_ID_ARCHITECT]'  // fill in after Otar creates form
  },
  flitt: {
    bootcamp: '[FLITT_URL_BOOTCAMP]',
    architect: '[FLITT_URL_ARCHITECT]'
  }
};
```

---

## Phase Checklist

### Phase 2 — Flitt Compliance ✅ PRIORITY: Ship May 17
> After deploying, Otar emails Nitsa at support@flitt.com requesting live activation.
> Attach live URLs of /terms and /privacy plus test transaction screenshots.

- [x] **2.1** Create `src/pages/Terms.tsx` — route `/terms`
- [x] **2.2** Create `src/pages/Privacy.tsx` — route `/privacy`
- [x] **2.3** Register `/terms` and `/privacy` routes in `src/App.tsx`
  - `/thank-you`, `/ai-bootcamp`, `/ai-architect` routes will be added when those pages are built
- [x] **2.4** Update `src/components/Footer.tsx` — legal block + payment logos + links added
- [x] **2.5** Payment SVGs added to `public/assets/payment/` (visa, mastercard, apple-pay, google-pay)
  - Also added `src/components/campaign/CampaignFooter.tsx` for campaign pages
  - Also added campaign CSS vars to `src/index.css` (.campaign-page scope) + Inter font
- [x] **2.6** Price sweep — fixed `$97/$197/$497` in ChallengeSection (dead code), `$20` in AIFAQ → ₾55

### Phase 3 — Design System (May 18)

- [x] **3.1** Campaign CSS vars added to `src/index.css` under `.campaign-page` scope
- [x] **3.2** Inter font loaded via rsms.me CDN in `src/index.css`. Georgian glyphs handled by FiraGO fallback (already loaded, full Georgian support).

### Phase 4 — Bootcamp Landing Page `/ai-bootcamp` (May 18)

- [x] **4.1** Created `src/pages/AIBootcamp.tsx`
- [x] **4.2** Created `src/components/campaign/Countdown.tsx` — target 2026-05-26T23:59:59+04:00, no localStorage, ticks every second
- [x] **4.3** Created `src/lib/checkout.ts` — CHECKOUT config + handleBuy(), Tally script loaded via Helmet
- [x] **4.4** All 10 sections built (A–J): hero, outcomes, curriculum, included, mid CTA, testimonials, FAQ, final CTA, footer
- [x] **4.5** noindex meta tag present
- [x] **4.6** Build passes clean — ✓ built in 4.23s
  - ⚠ Tally form IDs still placeholder `[TALLY_FORM_ID_BOOTCAMP]` — update `src/lib/checkout.ts` once Otar creates form

### Phase 5 — Architect Landing Page `/ai-architect` (May 19)

- [x] **5.1** Created `src/pages/AIArchitect.tsx` — all sections, ₾249 price (was ₾790, save 68%)
- [x] **5.2** noindex meta present
- [x] **5.3** grep confirms zero references to /ai-bootcamp or "bootcamp" in the page

### Phase 6 — Pipeline + Thank-You Page (May 18–19)

- [ ] **6.1** Create `src/pages/ThankYou.tsx` — route `/thank-you`
  - Reads `?product=` query param
  - Georgian confirmation message per campaign spec 7.4
  - No CTAs
- [ ] **6.2** Create email templates in `email-templates/`:
  - `receipt-confirmation-bootcamp.html` — Appendix A.3 (fill bank details)
  - `receipt-confirmation-architect.html` — Appendix A.4
  - `course-access-bootcamp.html` — Appendix A.5 (⚠ needs course links from Otar)
  - `course-access-architect.html` — Appendix A.6 (⚠ needs course links from Otar)
- [ ] **6.3** Create `docs/tally-form-specs.md` — form fields spec for Otar to build
- [ ] **6.4** Create `docs/n8n-workflows.md` — workflow JSON spec for Otar to import
- [ ] **6.5** Create `TODO_FOR_OTAR.md` in repo root — all manual tasks for Otar

### Phase 7 — Go-Live (May 19)

- [ ] **7.1** Confirm Flitt live (email from Nitsa)
- [ ] **7.2** Change `CHECKOUT.provider = 'flitt'` in `src/lib/checkout.ts`, deploy
- [ ] **7.3** Smoke test both product pages with real purchase + refund

---

## Progress Log

| Date | What was done |
|------|---------------|
| 2026-05-17 | Discovery complete. Legal details confirmed. Progress tracker created. |
| 2026-05-17 | Phase 2 complete: /terms, /privacy, footer legal block, 4 payment SVGs, campaign CSS vars, Inter font, price sweep. Build passes. |
| 2026-05-17 | Phase 3+4 complete: design system CSS vars, Countdown component, checkout lib, /ai-bootcamp page (all 10 sections). Build clean. |
| 2026-05-17 | Phase 5 complete: /ai-architect page (all sections, ₾249, no Bootcamp link). Build clean ✓ |

---

## Key Files to Create / Modify

| File | Action | Phase |
|------|--------|-------|
| `src/App.tsx` | Add 5 new routes | 2.3 |
| `src/pages/Terms.tsx` | Create | 2.1 |
| `src/pages/Privacy.tsx` | Create | 2.2 |
| `src/components/Footer.tsx` | Update legal block + payment logos | 2.4 |
| `public/assets/payment/*.svg` | Add 4 payment SVGs | 2.5 |
| `src/index.css` | Add campaign CSS vars | 3.1 |
| `src/pages/AIBootcamp.tsx` | Create | 4.1 |
| `src/components/campaign/Countdown.tsx` | Create | 4.2 |
| `src/lib/checkout.ts` | Create | 4.3 |
| `src/pages/AIArchitect.tsx` | Create | 5.1 |
| `src/pages/ThankYou.tsx` | Create | 6.1 |
| `email-templates/*.html` | Create 4 files | 6.2 |
| `docs/tally-form-specs.md` | Create | 6.3 |
| `docs/n8n-workflows.md` | Create | 6.4 |
| `TODO_FOR_OTAR.md` | Create | 6.5 |

---

## Resuming Work

When picking this up after an interruption:
1. Read this file top to bottom — check which Phase tasks are ticked
2. Read `src/App.tsx` for current routes
3. The first unchecked task in the earliest incomplete Phase is where to continue
4. All content copy is in `Indipendence-day-campaign-prep.md` (Appendix A + Section 5/6)
5. Legal placeholders are pre-filled in the table at the top of this file
6. Bank details for emails: TBC GE75TB7003815365100012 or BOG GE58BG0000000610012590
