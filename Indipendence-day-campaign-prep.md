# BitCamp Independence Day Campaign — Execution Plan v2

**For: any AI coding agent (Claude Code, Codex, Cursor, etc.)**
**Project: bitcamp.ge — new pages at `/ai-bootcamp` and `/ai-architect`**
**Deadline: Flitt compliance items live by end of day May 17, 2026. Bootcamp page live by May 18 evening. Architect page live by May 19. Campaign runs May 19–26.**

---

## 0. Context

BitCamp is launching an emergency 9-day sales campaign tied to Georgian Independence Day (May 26). Two distinct products on two dedicated landing pages — **not tiers of one product**.

**Product A — AI Prompt Engineering Bootcamp** (`/ai-bootcamp`)
- Complete 25-lesson video course already published (Module 1: 18 lessons + Module 2: 7 lessons)
- Standalone product with full curriculum
- ₾149 (Independence Day price; reverts to ₾290 on May 27)
- Includes: 25 lessons, Python + SQL bonus courses, Discord community, 4 weeks group mentorship

**Product B — Full AI Architect Program** (`/ai-architect`)
- Bootcamp + four upcoming specialized expansion courses (Productivity, Visual/Multimodal, Custom GPTs, n8n Automation)
- 8 weeks group mentorship
- ₾249 (Independence Day price; reverts to ₾790 on May 27)

These are **two separate pages with no comparison table and no shared CTA**. Each page sells one product. The Bootcamp page has a single understated link to Architect near the footer for buyers who want more; the Architect page does not mention the Bootcamp.

**Sales flow during fallback** (before Flitt activates): customer clicks Buy → Tally form → manual bank transfer → automated confirmation email via Postmark → manual approval in Airtable → automated course-access email.

**Sales flow once Flitt activates**: customer clicks Buy → Flitt hosted checkout → automated course-access email via Flitt webhook → n8n → Postmark.

---

## 1. Information the User Must Provide Before Starting

Before touching the codebase, the agent should request and confirm these from the user. Halt if any of 1–6 are missing:

1. **LLC legal name** (as registered)
2. **LLC tax identification code** (საიდენტიფიკაციო კოდი)
3. **Registered legal address**
4. **Public-facing phone number**
5. **Bank account details** for manual fallback (bank name, account holder, IBAN) — these go in the auto-reply email only, never on a public page
6. **Confirmation** of the site's framework (`package.json`), router setup, and CSS approach
7. Postmark server token (`.env` variable: `POSTMARK_SERVER_TOKEN`)
8. n8n webhook URL for Tally submissions
9. Tally form IDs (one per product) once forms are built
10. Course delivery details: Google Classroom join links per product, Discord invite URL, Python/SQL course URLs

---

## 2. Phase 1 — Repository Discovery

Before writing any code:

1. Read `package.json` to confirm framework (Vite + React expected based on asset filenames), build tool, and dependencies
2. Read routing configuration — note how routes are registered
3. Locate the existing `/ai` page source file as a structural reference (not a visual one — the new pages diverge stylistically)
4. Locate the global footer component
5. Locate the static asset directory (likely `public/` or `src/assets/`)
6. Check for existing i18n setup
7. Confirm CSS approach (Tailwind suspected; if so, check `tailwind.config.js` for design tokens)
8. Identify deploy target by checking config files (Cloudflare Pages / Netlify / Vercel)

Report findings before proceeding. Do not start work until the user confirms.

---

## 3. Phase 2 — Flitt Compliance (Highest Priority — Ship Today)

### 3.1 Create Terms of Service page

- **Route**: `/terms` (also accessible as `/pirobebi` if routing supports aliases)
- **Content**: Appendix A.1 below — replace `[PLACEHOLDER_*]` tokens with values from Section 1
- **Styling**: follow the new design system (Section 4). Plain reading layout. Constrained width (max 720px). Header and footer present.
- **Meta**: title "მომსახურების პირობები — BitCamp"

### 3.2 Create Privacy Policy page

- **Route**: `/privacy` (alias `/konfidencialuroba` optional)
- **Content**: Appendix A.2
- **Styling**: same as Terms

### 3.3 Update the global footer

Footer appears on every page (existing `/ai`, new `/ai-bootcamp`, `/ai-architect`, `/terms`, `/privacy`, `/thank-you`):

```
შპს [LLC_NAME]
ს/კ: [ID_CODE]
მისამართი: [ADDRESS]
ტელ: [PHONE]
ელ-ფოსტა: hello@bitcamp.ge

[VISA logo] [Mastercard logo] [Apple Pay logo] [Google Pay logo]

[Terms of Service] · [Privacy Policy]
```

### 3.4 Add VISA / Mastercard / Apple Pay / Google Pay logos

- Source **official SVG logos** from each brand's press kit (do not use random PNGs from Google Images):
  - VISA: https://usa.visa.com/run-your-business/small-business-tools/payment-technology/visa-brand-guidelines.html
  - Mastercard: https://brand.mastercard.com/
  - Apple Pay: https://developer.apple.com/apple-pay/marketing/
  - Google Pay: https://developers.google.com/pay/api/web/guides/brand-guidelines
- Place SVGs in `public/assets/payment/`
- Display:
  - In footer at ~24px height, grayscale or monochrome treatment
  - In the payment area of `/ai-bootcamp` and `/ai-architect` at ~32px height, full color

### 3.5 Verify all prices in GEL

Sweep the codebase for prices in any currency other than GEL. Replace with GEL using `₾` symbol.

### 3.6 Acceptance criteria for Phase 2

- [ ] `/terms` returns 200, renders correctly, linked from footer
- [ ] `/privacy` returns 200, renders correctly, linked from footer
- [ ] Footer shows all required legal elements on every page
- [ ] Card-brand logos render in footer + product page payment areas
- [ ] All prices in GEL
- [ ] All pages still build and deploy successfully

**After Phase 2 deploys to production, the user emails Nitsa at support@flitt.com requesting live activation, attaching live URLs of `/terms` and `/privacy` plus test transaction screenshots. Phase 3 onward proceeds in parallel — do not wait for Flitt's response.**

---

## 4. Phase 3 — Design System

This is critical. The new pages must look measurably more confident, premium, and minimalist than the existing `/ai` page. Reference aesthetic: Linear, Anthropic, Stripe, Vercel. Editorial, dark, generous whitespace, single accent color.

### 4.1 Color tokens

```css
:root {
  /* Surfaces */
  --bg: #0A0A0B;
  --surface: #141416;
  --surface-elevated: #1C1C20;
  --border: #2A2A30;
  --border-strong: #3A3A42;

  /* Text */
  --text-primary: #F5F5F7;
  --text-secondary: #A0A0AB;
  --text-muted: #6B6B75;

  /* Accent — single accent color, used sparingly */
  --accent: #DA291C;         /* Georgian red, for Independence Day campaign */
  --accent-soft: #DA291C20;  /* 12% opacity for backgrounds */
  --accent-text: #FF6B5E;    /* lightened accent for use on dark bg */

  /* Functional */
  --success: #4ADE80;
  --cta-bg: #F5F5F7;         /* white CTA button on dark page */
  --cta-text: #0A0A0B;
}
```

Use the accent color sparingly — countdown numbers, single key word in headlines, the urgency badge. Most of the page is text on dark surfaces. Resist gradients. Resist glows.

### 4.2 Typography

- Single font family: **Inter** loaded from `https://rsms.me/inter/inter.css` or self-hosted. Fallback: `system-ui, -apple-system, sans-serif`.
- Georgian text: verify Inter glyph coverage; if any glyphs are missing, add **Noto Sans Georgian** for Georgian unicode range only.
- Type scale:
  - `--text-xs`: 13px / line-height 1.5
  - `--text-sm`: 15px / 1.55
  - `--text-base`: 17px / 1.6
  - `--text-lg`: 20px / 1.5
  - `--text-xl`: 24px / 1.4
  - `--text-2xl`: 32px / 1.25
  - `--text-3xl`: 44px / 1.15
  - `--text-4xl`: 60px / 1.05 (hero only)
- Weight: 400 (body), 500 (UI elements), 600 (subheads), 700 (headlines)
- Headlines: tight letter-spacing (`-0.02em`)
- Body: default letter-spacing

### 4.3 Spacing scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;
```

Use generously. Section vertical padding: `--space-24` mobile, `--space-32` desktop. Between elements within a section: `--space-6` to `--space-12`.

### 4.4 Layout

- Single column. Max content width: 680px for text-heavy pages, 920px for landing pages with two-column blocks.
- Center-aligned container; padding `--space-6` on mobile, `--space-12` on desktop.
- No top navigation on Bootcamp/ai-architect pages. Just a small BitCamp wordmark in the top-left as the only header element.
- No sidebar.

### 4.5 Components

**Primary CTA button**
- Background: `--cta-bg` (white)
- Text: `--cta-text` (near-black)
- Font weight: 600, size: 17px
- Padding: 16px 32px
- Border radius: 12px
- Hover: scale to 1.02, no color change
- Active: scale to 0.98
- Full-width on mobile, intrinsic width on desktop
- Single button per visible viewport — do not place two CTAs side by side

**Secondary text link**
- Color: `--text-secondary`
- Underline on hover only
- Used for footer links, the single Architect mention on Bootcamp page

**Card / surface block**
- Background: `--surface`
- Border: 1px solid `--border`
- Border radius: 16px
- Padding: `--space-8`
- No shadows. No gradients.

**Countdown display**
- Numbers in `--text-4xl`, weight 700, color `--accent-text`
- Separator (`:`) in `--text-muted`
- Labels (დღე / საათი / წუთი / წამი) below in `--text-xs`, uppercase, `--text-muted`
- Monospace tabular figures for stable layout: `font-variant-numeric: tabular-nums`

**Price display**
- Old price: `--text-lg`, `--text-muted`, strikethrough
- New price: `--text-3xl`, weight 700, `--text-primary`
- "Independence Day" badge above price: small uppercase text in `--accent-text`

### 4.6 Motion

- Subtle only. No carousels, no parallax, no animated gradients.
- Allowed: fade-in-up on scroll for sections (20px translate, 400ms ease-out, IntersectionObserver-triggered, once)
- Button hover: 150ms scale
- Countdown: tick instantly, no animation per digit change

### 4.7 What NOT to do

- No emoji as headline decoration
- No gradient backgrounds
- No animated borders or glows
- No "trust badges" stack at the bottom (the legal block is enough)
- No "Limited time!" stickers or pulsing badges
- No live "X people viewing" counters
- No chat widget popup
- No exit-intent modal
- The countdown alone provides urgency — do not stack additional pressure devices on top of it

---

## 5. Phase 4 — Bootcamp Landing Page (`/ai-bootcamp`)

### 5.1 Page settings

- Route: `/ai-bootcamp` (alias `/ai-bootcamp-149` for shareable URL with implicit price signal — optional)
- `<meta name="robots" content="noindex">` — paid traffic page only
- No link from main site nav
- Page contains exactly ONE buy CTA repeated in three positions (hero, mid-page, final). All three buttons trigger the same Tally form.

### 5.2 Page structure (top to bottom)

**Section A — Minimal header**
- BitCamp wordmark, top-left, 32px tall
- No menu, no other elements

**Section B — Hero**

Hero copy (Georgian, drop in directly):

> [Independence Day badge — small uppercase, accent color]
> **დამოუკიდებლობის შეთავაზება • იწურება 26 მაისს**
>
> [H1 — `--text-4xl` desktop, `--text-3xl` mobile, weight 700]
> **გადადი AI-სთან "ცდისა და შეცდომის" ეტაპიდან — ზუსტი შედეგების მიღების ეტაპზე.**
>
> [Subhead — `--text-lg`, `--text-secondary`]
> 25 ვიდეო გაკვეთილი. T.C.R.E.I. ფორმულა. რეალური პრაქტიკული გადაწყვეტები. სამუდამო წვდომა.
>
> [Countdown component — large, centered]
>
> [CTA button: `ვიწყებ — ₾149`]
>
> [Small line below CTA, `--text-xs`, `--text-muted`]
> 🔒 უსაფრთხო გადახდა • VISA · Mastercard · Apple Pay · Google Pay

**Section C — The three outcomes (the core conversion section)**

Three blocks stacked vertically (not side-by-side cards). Each: small label, headline, 2-sentence description. No icons.

Block 1:
> **შედეგი #1 — კონტექსტისა და სტრატეგიის ოსტატობა**
>
> ისწავლე T.C.R.E.I. ფორმულა — ჩვენი ექსკლუზიური ჩარჩო, რომელიც AI-ს ეუბნება ზუსტად რა გინდა, პირველივე ცდაზე. აღარ დახარჯავ საათებს იმავე კითხვის სხვადასხვა გადაფორმულირებაში.

Block 2:
> **შედეგი #2 — მონაცემთა გაფართოებული დამუშავება**
>
> გასცდი მარტივ ტექსტს. ისწავლე ცხრილური მონაცემების (CSV) დამუშავება, სტრუქტურირებული გამოსავლის (JSON) გენერაცია და AI-ის გამოყენება რეალური ანალიტიკური ამოცანებისთვის.

Block 3:
> **შედეგი #3 — პრაქტიკული გამოყენება**
>
> ააწყვე კომპლექსური პრომპტ-ჯაჭვები და ავტომატიზაცია გაუკეთე რუტინულ დავალებებს. დაზოგე საათები ყოველ კვირას — არა იმიტომ რომ AI-ს ხმარობ, არამედ იმიტომ რომ სწორად იყენებ.

**Section D — Curriculum snapshot**

Heading: `25 გაკვეთილი • 2 მოდული • სრული პროგრამა`

A condensed list — show ONLY 6–7 of the most powerful lesson titles, not all 25. Each is plain text, one per line, slightly indented, lesson number in `--text-muted`:

> 03 — რა არის Prompting?
> 07 — კონტექსტი
> 14 — [პრაქტიკული] T.C.R.E.I. მოდელი
> 20 — პრომპტების ჯაჭვი (Prompt Chaining)
> 22 — ცხრილური მონაცემების დამუშავება
> 25 — JSON — ფორმატების მეფე
> და კიდევ 19 გაკვეთილი

Below: small text in `--text-muted`: `სრულ სილაბუსს იხილავ კურსში დარეგისტრირების შემდეგ.`

**Section E — What's included (the stack)**

Plain list. No icons. No checkmarks. Just text, one per line:

> 25 ვიდეო გაკვეთილი • სამუდამო წვდომა
> 🎁 Python კურსი (უფასო ბონუსი — ცალკე ₾290 ღირებულების)
> 🎁 SQL კურსი (უფასო ბონუსი)
> 🎁 50+ მზა პრომპტის ბიბლიოთეკა
> 4 კვირის ჯგუფური მენტორშიფი (ცოცხალი სესიები ხუთშაბათობით)
> Discord ქომიუნითი — სადაც პასუხს ვცემთ კითხვებზე ყოველდღე

**Section F — Mid-page CTA**

Just the price block + button, centered. Same button as hero.

**Section G — Social proof**

Heading: `400+ სტუდენტი უკვე სწავლობს`

Display 4 testimonials — pick the strongest from the existing `/ai` page. Layout: vertical, one per row, quote in `--text-lg`, attribution in `--text-sm --text-muted`. No avatars, no card chrome.

**Section H — Compressed FAQ**

4 questions max. Use a clean accordion (closed by default, single-column).

1. რა მოხდება 26 მაისის შემდეგ?
   → 26 მაისს 23:59 საათზე შეთავაზება იხურება. შემდეგი დღიდან ფასი ბრუნდება ₾290-ზე.

2. რა მოწყობილობებზე შემიძლია სწავლა?
   → ნებისმიერ მოწყობილობაზე — სმარტფონი, ლეპტოპი, ტაბლეტი. გაკვეთილები ვიდეო ფორმატშია, წვდომა სამუდამოა.

3. რა ხდება გადახდის შემდეგ?
   → 1 საათში მიიღებ ელფოსტას კურსზე წვდომის ბმულითა და Discord-ის მოწვევით.

4. შესაძლებელია თუ არა თანხის დაბრუნება?
   → დიახ — 14 დღის განმავლობაში, თუ ჯერ არ დაგიწყია კურსი. [სრული პირობები](/terms)

**Section I — Final CTA**

Repeat countdown. Repeat CTA button. Below button, one understated line in `--text-sm --text-muted`:

> ეძებ უფრო ღრმა ტრანსფორმაციას — სრულ AI არქიტექტორის პროგრამას მენტორშიფითა და 4 დამატებითი სპეციალიზაციით? [იხილე აქ →](/ai-architect)

This is the ONLY mention of Architect on the Bootcamp page.

**Section J — Footer**
- Legal block per 3.3
- Card brand logos
- Terms + Privacy links

### 5.3 Countdown component (shared between both pages)

```jsx
function Countdown() {
  const target = new Date('2026-05-26T23:59:59+04:00').getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  if (diff === 0) return <div className="countdown-ended">შეთავაზება დასრულდა</div>;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div className="countdown">
      <Cell n={days} label="დღე" />
      <Cell n={hours} label="საათი" />
      <Cell n={minutes} label="წუთი" />
      <Cell n={seconds} label="წამი" />
    </div>
  );
}
```

Target is a fixed datetime in Asia/Tbilisi (UTC+4). Do NOT reset per visit. Do NOT use localStorage. Same value shows to every visitor at the same moment.

### 5.4 Tally / Flitt swap mechanism

CTA button onClick handler reads from a config flag:

```js
const CHECKOUT = {
  provider: 'tally',  // change to 'flitt' once Flitt activates
  tally: {
    bootcamp: '[TALLY_FORM_ID_BOOTCAMP]',
    architect: '[TALLY_FORM_ID_ARCHITECT]'
  },
  flitt: {
    bootcamp: '[FLITT_URL_BOOTCAMP]',
    architect: '[FLITT_URL_ARCHITECT]'
  }
};

function handleBuy(product) {
  if (CHECKOUT.provider === 'tally') {
    window.Tally.openPopup(CHECKOUT.tally[product]);
  } else {
    window.location.href = CHECKOUT.flitt[product];
  }
}
```

Load Tally popup script in `<head>`: `<script async src="https://tally.so/widgets/embed.js"></script>`

### 5.5 Acceptance criteria for Bootcamp page

- [ ] Renders cleanly on iPhone Safari, Android Chrome, desktop Chrome, desktop Firefox
- [ ] Countdown shows correct remaining time, ticks every second
- [ ] All 3 CTA buttons open the Bootcamp Tally form
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- [ ] Total page weight under 200KB excluding images (use SVG logos, system fonts or Inter via CSS)
- [ ] First Contentful Paint under 1.5s on simulated 4G
- [ ] No console errors
- [ ] `noindex` meta tag present
- [ ] Visual: dark theme, single accent color, minimalist — passes the "Linear / Anthropic / Stripe" eyeball test

---

## 6. Phase 5 — Architect Landing Page (`/ai-architect`)

### 6.1 Page settings

Same as Bootcamp: noindex, no nav link, single product focus. Three CTAs, all → Architect Tally form.

### 6.2 Page structure

Same scaffolding as Bootcamp, with these content differences:

**Hero** (Georgian):
> **დამოუკიდებლობის შეთავაზება • იწურება 26 მაისს**
>
> **გახდი სრული AI არქიტექტორი — არა AI-ის მომხმარებელი.**
>
> სრული პროგრამა: 25-გაკვეთილიანი Bootcamp + 4 სპეციალიზებული გაფართოება + 8 კვირის ცოცხალი მენტორშიფი.
>
> [Countdown]
>
> [CTA: `ვიწყებ — ₾249`]

**The three outcomes section** (transformation-focused, not just skill-focused):

Block 1:
> **შედეგი #1 — ფუნდამენტი (Bootcamp)**
>
> სრული პრომპტ ინჟინერიის სისტემა — T.C.R.E.I., კონტექსტი, მონაცემთა დამუშავება, JSON, პრომპტ-ჯაჭვები. 25 ვიდეო გაკვეთილი.

Block 2:
> **შედეგი #2 — სპეციალიზაცია (4 დამატებითი კურსი)**
>
> შემდეგი 2 თვის განმავლობაში მიიღებ:
> • ბიზნეს პროდუქტიულობა — AI რეალურ workflow-ში
> • ვიზუალური AI (Multimodal) — DALL-E, Vision, სურათების გენერაცია
> • პერსონალური AI აგენტები (Custom GPTs, Gems)
> • n8n ავტომატიზაცია — სრული workflow სისტემები

Block 3:
> **შედეგი #3 — ცოცხალი თანამშრომლობა**
>
> 8 კვირის ჯგუფური მენტორშიფი — ყოველკვირეული ცოცხალი სესია. შენი კითხვები, შენი პროექტები, რეალური უკუკავშირი. ეს არ არის უბრალოდ ვიდეო კურსი — ეს არის გადასვლა.

**What's included stack**:
> სრული 25-გაკვეთილიანი Bootcamp
> 4 სპეციალიზებული გაფართოება (გამოდის ეტაპობრივად 2 თვის განმავლობაში)
> 8 კვირის ცოცხალი ჯგუფური მენტორშიფი
> 🎁 Python კურსი + SQL კურსი
> 🎁 50+ პრომპტი + n8n workflow შაბლონები
> 🎁 სერთიფიკატი პროგრამის დასრულების შემდეგ
> Discord ქომიუნითი • სამუდამო წვდომა • ყველა მომავალი განახლება

**Final CTA section**: Same as Bootcamp's final CTA, BUT without any link to Bootcamp. The Architect buyer doesn't need to see a cheaper option.

### 6.3 Acceptance criteria for Architect page

Same as Bootcamp, plus:
- [ ] Page does not mention or link to `/ai-bootcamp` anywhere
- [ ] Hero clearly signals "full program" vs "course" — the framing should feel premium

---

## 7. Phase 6 — Tally + n8n + Postmark Pipeline

Two Tally forms (one per product), one n8n workflow with branching, two Postmark templates per product (confirmation + access).

### 7.1 Tally form spec (user builds these in Tally UI — two forms)

**Bootcamp form fields:**
1. Full name (text, required)
2. Email (email, required)
3. Phone (text, optional)
4. Bank transfer receipt (file upload, required, image/PDF) — helper text: "ატვირთეთ გადარიცხვის სკრინშოტი TBC ან BOG-დან"
5. Hidden field `product` = `bootcamp`
6. Hidden field `amount` = `149`

**Architect form fields:** same as Bootcamp except `product` = `architect`, `amount` = `249`.

Tally settings (both forms):
- Submission webhook → n8n endpoint
- Disable Tally's built-in auto-reply (Postmark handles this for deliverability)
- Redirect after submission → `/thank-you?product={product}`

### 7.2 n8n workflow spec (user imports — agent documents in `docs/n8n-workflows.md`)

Workflow 1 — `Tally Submission Handler`:
```
[Webhook trigger]
  ↓
[Function: parse Tally payload, extract product/name/email/amount/receipt_url]
  ↓
[Airtable: insert row in "Pending Orders" base]
    Fields: order_id (auto), product, name, email, phone, amount, receipt_url,
            status="pending", created_at=now()
  ↓
[Postmark: send "receipt-confirmation-{product}" template]
    To: customer email
    Variables: name, product_name, amount, order_id, bank_details, llc_name, id_code, address
  ↓
[End]
```

Workflow 2 — `Order Approval Handler`:
```
[Airtable trigger: row updated, status changed to "approved"]
  ↓
[Switch on product]
  ├─ bootcamp → [Postmark: send "course-access-bootcamp" template]
  └─ architect → [Postmark: send "course-access-architect" template]
  ↓
[Airtable: update row, set status="delivered", delivered_at=now()]
```

### 7.3 Postmark templates (agent creates files in `email-templates/`)

Four templates total. User uploads to Postmark UI.

- `receipt-confirmation-bootcamp.html` — Appendix A.3
- `receipt-confirmation-architect.html` — Appendix A.4 (variant of A.3 with Architect product details)
- `course-access-bootcamp.html` — Appendix A.5
- `course-access-architect.html` — Appendix A.6 (adds mentorship schedule + expansion course rollout)

### 7.4 Build `/thank-you` page

Reads `?product=` query param. Content (Georgian):

> ✅ **მადლობა! მივიღეთ თქვენი განცხადება.**
>
> შემდეგი ნაბიჯი: შეამოწმე შენი ელ-ფოსტა — გამოგიგზავნეთ გადარიცხვის დეტალები.
>
> გადარიცხვის შემდეგ, კურსზე წვდომას მიიღებ 1 საათში (სამუშაო საათებში).
>
> კითხვები? hello@bitcamp.ge

Single message. No CTAs. Same design system.

### 7.5 Acceptance criteria for Phase 6

- [ ] Two Tally forms documented in `docs/tally-form-specs.md`
- [ ] n8n workflow JSON in `docs/n8n-workflows.md`
- [ ] Four Postmark HTML templates in `email-templates/`
- [ ] `/thank-you` page renders correctly with both `?product=bootcamp` and `?product=architect`
- [ ] End-to-end test: submit Bootcamp form → receive confirmation → approve in Airtable → receive Bootcamp access email
- [ ] Same E2E test for Architect

---

## 8. Phase 7 — Parallel Tasks for Otar (NOT for the coding agent)

Output as `TODO_FOR_OTAR.md` in repo root so nothing is missed:

1. Create two Tally forms per spec in 7.1
2. Create Airtable base "Pending Orders" with columns: order_id, product, name, email, phone, amount, receipt_url, status (pending/approved/delivered/refunded), created_at, delivered_at, notes
3. Import n8n workflows from spec
4. Upload Postmark templates and verify sending domain DKIM/SPF
5. Email Nitsa Kirvalidze (support@flitt.com) requesting live activation, attaching live URLs of `/terms`, `/privacy`, and test transaction screenshots
6. Test the full pipeline end-to-end with a fake submission for each product
7. Prepare welcome content: Bootcamp Google Classroom join link, Architect Google Classroom join link (separate class), Discord invite URL, Python/SQL course URLs
8. Record two 15-second ad creatives — reuse Easter format:
   - **Bootcamp ad**: "25 გაკვეთილი, T.C.R.E.I. ფორმულა, ₾149-ად 26 მაისამდე. დააწექი ბმულს."
   - **Architect ad**: "სრული AI არქიტექტორის პროგრამა — Bootcamp + 4 სპეციალიზაცია + 8 კვირის მენტორშიფი. ₾249-ად დამოუკიდებლობის დღემდე."
9. Once Flitt activates: change `CHECKOUT.provider` from `'tally'` to `'flitt'` in the config, deploy
10. Day-0 launch sequence:
    - Send Messenger broadcast to 200 warm leads with the appropriate page link
    - Post to BitCamp Facebook group + YouTube community tab
    - Activate Facebook ads (two ad sets, one per product)
    - Monitor Airtable + Postmark activity logs hourly for first 6 hours

---

## 9. Phase 8 — Pre-launch Testing Checklist

- [ ] Both product pages render cleanly on iPhone Safari, Android Chrome, desktop Chrome, desktop Firefox
- [ ] Countdown shows correct time on both pages, matching Asia/Tbilisi
- [ ] Both Bootcamp and Architect CTAs trigger correct Tally forms
- [ ] Test submissions produce:
  - [ ] Airtable rows with correct product field
  - [ ] Confirmation emails arrive within 60 seconds, in inbox (not spam)
  - [ ] Bank details in email match the product amount (149 / 249)
- [ ] Manually setting Airtable status to "approved" triggers:
  - [ ] Correct access email per product
  - [ ] Course links and Discord invite work
- [ ] `/terms` and `/privacy` accessible from every page footer
- [ ] Legal block visible on every page
- [ ] Card brand logos render correctly
- [ ] No console errors anywhere
- [ ] Lighthouse mobile Performance ≥ 90 on both product pages

---

## 10. Phase 9 — Go-Live Sequence (May 19)

1. Confirm Flitt has switched to live mode (email from Nitsa)
2. Set `CHECKOUT.provider = 'flitt'` in config, deploy
3. Smoke test: real ₾149 purchase via Flitt with own card on `/ai-bootcamp`
4. Verify Flitt webhook fires → access email arrives
5. Refund the test purchase via Flitt portal
6. Same smoke test on `/ai-architect` at ₾249
7. Send Messenger broadcast to 200 warm leads (split: half get Bootcamp link, half get Architect link — measure conversion)
8. Post to BitCamp Facebook group + YouTube community tab
9. Activate Facebook ad sets
10. Monitor Airtable + email logs hourly for first 6 hours; daily after that

---

# Appendix A — Georgian Content

## A.1 Terms of Service (მომსახურების პირობები)

```markdown
# მომსახურების პირობები

ბოლო განახლება: 2026 წლის 17 მაისი

## 1. ზოგადი დებულებები

წინამდებარე პირობები არეგულირებს ურთიერთობას შპს [LLC_NAME]-სა (ს/კ: [ID_CODE], მისამართი: [ADDRESS], შემდგომში „კომპანია") და ვებგვერდის bitcamp.ge მომხმარებელს შორის.

ვებგვერდით სარგებლობით, თქვენ ეთანხმებით ამ პირობებს. თუ არ ეთანხმებით, გთხოვთ, არ გამოიყენოთ ვებგვერდი.

## 2. მომსახურების აღწერა

კომპანია გთავაზობთ ონლაინ საგანმანათლებლო კურსებს ხელოვნური ინტელექტის, პროგრამირებისა და ციფრული უნარების მიმართულებით. კურსები ხელმისაწვდომია ვიდეო ფორმატში, შესაბამისი მასალებითა და დახმარებით.

## 3. ფასი და გადახდა

- ყველა ფასი მითითებულია ქართულ ლარში (₾) დღგ-ს ჩათვლით.
- გადახდა ხდება ბანკის ბარათით (VISA, Mastercard), Google Pay-ით, Apple Pay-ით ან საბანკო გადარიცხვით.
- გადახდის შემდეგ მომხმარებელი იღებს წვდომას შესყიდულ კურსზე ელექტრონული ფოსტის მეშვეობით 1 საათში (სამუშაო საათებში).

## 4. დაბრუნების და გაუქმების პოლიტიკა

- მომხმარებელს უფლება აქვს მოითხოვოს თანხის სრული დაბრუნება შესყიდვიდან 14 დღის განმავლობაში, თუ მან არ დაიწყო კურსის გავლა.
- კურსის გავლის დაწყების შემდეგ (პირველი მოდულის გახსნა) თანხის დაბრუნება არ ხდება.
- დაბრუნების მოთხოვნა იგზავნება ელფოსტაზე: hello@bitcamp.ge
- დაბრუნება ხდება იმავე გადახდის მეთოდით, რომლითაც განხორციელდა შესყიდვა, 7 სამუშაო დღის განმავლობაში.

## 5. ინტელექტუალური საკუთრება

ვებგვერდზე და კურსებში წარმოდგენილი ყველა მასალა (ვიდეო, ტექსტი, კოდი, გრაფიკა) წარმოადგენს კომპანიის ან მისი ლიცენზიის მფლობელების საკუთრებას. მათი კოპირება, გავრცელება ან გასაჯაროება დაუშვებელია.

## 6. მომხმარებლის ვალდებულებები

- მომხმარებელი ვალდებულია მიაწოდოს ნამდვილი და სრული ინფორმაცია.
- კურსის წვდომა პერსონალურია — სხვა პირისთვის გადაცემა აკრძალულია.

## 7. პასუხისმგებლობის შეზღუდვა

კომპანია არ აგებს პასუხს მომხმარებლის მიერ კურსის გავლის შედეგად მიღებულ ან გამოტოვებულ შემოსავალზე. კურსები წარმოადგენს საგანმანათლებლო რესურსს და არ წარმოადგენს გარანტიას კონკრეტული შედეგისთვის.

## 8. პერსონალური მონაცემები

პერსონალური მონაცემების დამუშავება რეგულირდება ცალკე დოკუმენტით — [კონფიდენციალურობის პოლიტიკა](/privacy).

## 9. პირობების ცვლილება

კომპანია იტოვებს უფლებას, ცალმხრივად შეიტანოს ცვლილებები ამ პირობებში. ცვლილებები ძალაში შედის ვებგვერდზე გამოქვეყნებისთანავე.

## 10. საკონტაქტო ინფორმაცია

- შპს [LLC_NAME]
- ს/კ: [ID_CODE]
- მისამართი: [ADDRESS]
- ტელ: [PHONE]
- ელ-ფოსტა: hello@bitcamp.ge
```

## A.2 Privacy Policy (კონფიდენციალურობის პოლიტიკა)

```markdown
# კონფიდენციალურობის პოლიტიკა

ბოლო განახლება: 2026 წლის 17 მაისი

## 1. ვინ ვართ

შპს [LLC_NAME] (ს/კ: [ID_CODE], მისამართი: [ADDRESS]) არის ვებგვერდის bitcamp.ge მფლობელი და თქვენი პერსონალური მონაცემების ადმინისტრატორი.

## 2. რა მონაცემებს ვაგროვებთ

- სახელი და გვარი
- ელ-ფოსტის მისამართი
- ტელეფონის ნომერი (არასავალდებულო)
- ინფორმაცია გადახდის შესახებ (გადახდის ოპერატორ Flitt-ის მეშვეობით — ჩვენ ბარათის სრულ მონაცემებს არ ვინახავთ)
- ინფორმაცია კურსზე აქტივობის შესახებ
- IP მისამართი და ბრაუზერის ინფორმაცია (ანალიტიკისთვის)

## 3. რატომ ვაგროვებთ

- მომსახურების მისაწოდებლად (კურსზე წვდომის უზრუნველყოფა)
- გადახდის დასამუშავებლად
- მომხმარებლის მხარდასაჭერად
- მომსახურების გასაუმჯობესებლად
- მარკეტინგული შეტყობინებებისთვის (მხოლოდ თქვენი თანხმობით)

## 4. ვის გადავცემთ თქვენს მონაცემებს

- გადახდის ოპერატორი: Flitt
- ელფოსტის სერვისი: Postmark
- ანალიტიკა: Google Analytics, Meta Pixel
- ვებჰოსტინგი: Cloudflare

არ ვყიდით თქვენს ინფორმაციას მესამე მხარეებზე მარკეტინგული მიზნებისთვის.

## 5. რამდენ ხანს ვინახავთ

თქვენი მონაცემები ინახება მანამ, სანამ თქვენ გაქვთ ანგარიში ჩვენთან, ან გადახდის შემდეგ 7 წლის განმავლობაში — საქართველოს კანონმდებლობით საგადასახადო ვალდებულებების შესაბამისად.

## 6. თქვენი უფლებები

თქვენ გაქვთ უფლება:
- მოითხოვოთ თქვენი მონაცემების ასლი
- მოითხოვოთ შესწორება
- მოითხოვოთ წაშლა (გარდა კანონით სავალდებულო შემთხვევებისა)
- გააუქმოთ თანხმობა მარკეტინგულ შეტყობინებებზე
- შემოგვტანოთ პრეტენზია საქართველოს პერსონალურ მონაცემთა დაცვის ინსპექტორთან

## 7. Cookies

ვებგვერდი იყენებს cookies-ებს მომსახურების გასაუმჯობესებლად. ბრაუზერის პარამეტრებში შეგიძლიათ მათი გათიშვა.

## 8. უსაფრთხოება

თქვენი მონაცემები ინახება დაცული სერვერებზე SSL დაშიფვრით. გადახდის ბარათის მონაცემები არასოდეს ხვდება ჩვენს სერვერებზე — ისინი მუშავდება უშუალოდ Flitt-ის მიერ.

## 9. ცვლილებები

პოლიტიკის ცვლილების შემთხვევაში, ვაცნობებთ ვებგვერდზე ან ელფოსტით.

## 10. კონტაქტი

კონფიდენციალურობასთან დაკავშირებული ნებისმიერი კითხვისთვის: hello@bitcamp.ge
```

## A.3 receipt-confirmation-bootcamp.html

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #ffffff;">

<h2>გამარჯობა {{name}},</h2>

<p>მადლობა <strong>AI Prompt Engineering Bootcamp</strong>-ზე განცხადებისთვის. მივიღეთ თქვენი მონაცემები.</p>

<p><strong>თქვენი არჩევანი:</strong> AI Prompt Engineering Bootcamp — ₾149</p>

<h3>შემდეგი ნაბიჯი — გადახდა საბანკო გადარიცხვით:</h3>

<div style="background:#f5f5f5; padding:16px; border-radius:8px; margin: 16px 0;">
<p style="margin: 4px 0;"><strong>ბანკი:</strong> {{bank_name}}</p>
<p style="margin: 4px 0;"><strong>მიმღები:</strong> {{account_holder}}</p>
<p style="margin: 4px 0;"><strong>ანგარიში (IBAN):</strong> {{iban}}</p>
<p style="margin: 4px 0;"><strong>თანხა:</strong> ₾149</p>
<p style="margin: 4px 0;"><strong>დანიშნულება:</strong> Bootcamp — {{order_id}}</p>
</div>

<p><strong>მნიშვნელოვანი:</strong> დანიშნულებაში აუცილებლად მიუთითეთ შეკვეთის ნომერი <code>{{order_id}}</code> — ეს გვეხმარება სწრაფ იდენტიფიკაციაში.</p>

<p>გადარიცხვის შემდეგ კურსზე წვდომას მიიღებთ ამავე ელ-ფოსტაზე <strong>1 საათში</strong> (სამუშაო საათებში).</p>

<p>კითხვები? უპასუხეთ ამ ელფოსტას ან მოგვწერეთ hello@bitcamp.ge.</p>

<p>პატივისცემით,<br>
ოთარი • BitCamp</p>

<hr style="border:none; border-top:1px solid #ddd; margin: 24px 0;">
<p style="font-size:12px; color:#666;">
შპს {{llc_name}} • ს/კ: {{id_code}} • {{address}}
</p>

</body>
</html>
```

## A.4 receipt-confirmation-architect.html

Same as A.3 with these substitutions:
- "AI Prompt Engineering Bootcamp" → "Full AI Architect Program"
- "₾149" → "₾249" (in both places)
- "Bootcamp — {{order_id}}" → "Architect — {{order_id}}"

## A.5 course-access-bootcamp.html

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #ffffff;">

<h2>🎉 გილოცავთ, {{name}}!</h2>

<p>თქვენი გადარიცხვა მივიღეთ. <strong>AI Prompt Engineering Bootcamp</strong>-ზე წვდომა გააქტიურებულია.</p>

<h3>თქვენი წვდომა:</h3>

<p>
🎓 <strong>კურსი (Google Classroom):</strong> <a href="{{bootcamp_classroom_url}}">გახსენი კურსი აქ</a><br>
💬 <strong>Discord ქომიუნითი:</strong> <a href="{{discord_invite}}">შემოუერთდი Discord-ს</a>
</p>

<h3>🎁 შენი ბონუსები:</h3>
<p>
• <a href="{{python_course_url}}">Python კურსი</a> — სამუდამოდ უფასოდ<br>
• <a href="{{sql_course_url}}">SQL კურსი</a> — სამუდამოდ უფასოდ<br>
• 50+ მზა პრომპტის ბიბლიოთეკა — Discord-ში
</p>

<h3>👥 ჯგუფური მენტორშიფი (4 კვირა):</h3>
<p>ყოველ ხუთშაბათს, 20:00 საათზე. პირველი სესია: <strong>{{first_session_date}}</strong>. შეხვედრის ბმული გამოგზავნილია Discord-ში.</p>

<h3>როგორ დავიწყო?</h3>
<ol>
<li>გახსენი კურსის ბმული ზემოთ</li>
<li>დაიწყე გაკვეთილი 1 — შესავალი</li>
<li>შემოუერთდი Discord-ს</li>
<li>დააფიქსირე პირველი ჯგუფური სესია კალენდარში</li>
</ol>

<p>კითხვები? უპასუხე ამ ელფოსტას.</p>

<p>კარგი მოგზაურობა,<br>
ოთარი • BitCamp</p>

<hr style="border:none; border-top:1px solid #ddd; margin: 24px 0;">
<p style="font-size:12px; color:#666;">
შპს {{llc_name}} • ს/კ: {{id_code}} • {{address}}
</p>

</body>
</html>
```

## A.6 course-access-architect.html

Same as A.5 with these changes:
- "AI Prompt Engineering Bootcamp" → "Full AI Architect Program"
- "კურსი (Google Classroom)" → "Architect Program (Google Classroom)" with `{{architect_classroom_url}}`
- "ჯგუფური მენტორშიფი (4 კვირა)" → "ჯგუფური მენტორშიფი (8 კვირა)"
- Add this section before "როგორ დავიწყო":

```html
<h3>📚 სპეციალიზებული გაფართოებები (გამოდის ეტაპობრივად):</h3>
<p>
• <strong>კვირა 3</strong> — ბიზნეს პროდუქტიულობა<br>
• <strong>კვირა 5</strong> — ვიზუალური AI (Multimodal)<br>
• <strong>კვირა 7</strong> — პერსონალური AI აგენტები<br>
• <strong>კვირა 9</strong> — n8n ავტომატიზაცია<br>
ყოველი ახალი მოდულის გამოშვების შესახებ შეტყობინებას მიიღებ ელფოსტითა და Discord-ში.
</p>
```

---

# Appendix B — Quick Reference

## Environment variables

```bash
POSTMARK_SERVER_TOKEN=...
N8N_WEBHOOK_URL=...
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
TALLY_FORM_ID_BOOTCAMP=...
TALLY_FORM_ID_ARCHITECT=...
FLITT_MERCHANT_ID=...
FLITT_PRODUCT_ID_BOOTCAMP=...
FLITT_PRODUCT_ID_ARCHITECT=...
CHECKOUT_PROVIDER=tally  # change to "flitt" once live
```

## Key dates

- **May 17 (today)** — Ship Phase 2 (Flitt compliance). Email Flitt requesting live mode.
- **May 18** — Build Phases 3, 4, 6 (design system, Bootcamp page, Tally/Postmark pipeline). End-to-end test for Bootcamp.
- **May 19** — Build Phase 5 (Architect page). Flitt expected live. Swap checkout provider. Soft launch to warm leads with Bootcamp link.
- **May 20–25** — Active campaign. Daily monitoring. Iterate ad creative based on conversion data.
- **May 26, 23:59 Asia/Tbilisi** — Campaign ends. Countdown hits zero.
- **May 27 onward** — Inertia window. Prices revert. Begin pivot to next campaign (8-week transformation program).

## Out of scope for the coding agent

- Tally form creation (user does this in Tally UI)
- Postmark template upload (user uploads via Postmark UI)
- Airtable base setup
- n8n workflow import
- Flitt merchant configuration
- Facebook ad campaign setup
- Google Classroom course setup
- Discord invite generation
- Final review/polish of Georgian text (user is the native speaker)

---

**End of plan. Begin with Phase 1 (Discovery) and report findings before proceeding to Phase 2.**
