# Checkpoint: AI Course Registration Automation

**Created:** 2026-01-25
**Status:** In Progress

---

## Overview

Implementing Tally + n8n registration flow for the AI Prompt Engineering course at `/ai`.

### Tech Stack
- **Form:** Tally.so (embedded on page)
- **Automation:** n8n (self-hosted on DigitalOcean)
- **Email:** Postmark
- **Database:** Google Sheets
- **Payment:** Bank Transfer (manual confirmation)

---

## Completed Tasks

- [x] Create landing page at `/ai` with all sections
- [x] Create `AIRegistrationForm` component with inline Tally embed
- [x] Update `AIPricing` CTA to scroll to registration form
- [x] Create n8n workflow JSON templates:
  - `n8n-workflows/ai-course-registration.json`
  - `n8n-workflows/ai-course-payment-confirmation.json`
- [x] Create n8n setup guide: `n8n-workflows/README.md`

---

## Pending Tasks

### 1. DigitalOcean n8n Setup
- [ ] Spin up n8n droplet on DigitalOcean
- [ ] Configure domain: `n8n.bitcamp.ge` (or similar)
- [ ] Set up SSL with Caddy or nginx
- [ ] Import workflow JSON files
- [ ] Add credentials:
  - [ ] Google Sheets OAuth
  - [ ] Postmark API token

### 2. Tally Forms Setup
- [ ] Create Registration Form with fields:
  - სახელი (name) - required
  - ელფოსტა (email) - required
  - ტელეფონი (phone) - required
- [ ] Create Payment Confirmation Form with fields:
  - ელფოსტა (email) - required
  - სახელი (name) - optional
  - ჩარიცხვის სქრინშოტი (file upload) - required
- [ ] Get form IDs and update:
  - `AIRegistrationForm.tsx` - line with `tallyFormId`
  - `AIPromptEngineering.tsx` - prop value
  - n8n workflow email templates (payment confirmation link)

### 3. Google Sheets Setup
- [ ] Create Google Sheet with columns:
  ```
  Timestamp | Name | Email | Phone | Status | Source | Payment_Date | Payment_Proof
  ```
- [ ] Share sheet with n8n service account
- [ ] Get Sheet ID and update workflow JSON

### 4. Connect Everything
- [ ] Connect Tally Registration Form webhook → n8n
  - URL: `https://n8n.bitcamp.ge/webhook/ai-course-register`
- [ ] Connect Tally Payment Form webhook → n8n
  - URL: `https://n8n.bitcamp.ge/webhook/ai-course-payment`
- [ ] Test full flow:
  - [ ] Submit registration → receive welcome email
  - [ ] Wait 31 min → receive reminder (if not paid)
  - [ ] Submit payment confirmation → receive course access email

### 5. Final Polish
- [ ] Update email templates with correct:
  - Bank account details
  - Discord invite link
  - Course access instructions
- [ ] Update landing page with real Tally form ID
- [ ] Test on mobile devices
- [ ] Deploy to production

---

## File Locations

```
/ai Landing Page:
├── src/pages/AIPromptEngineering.tsx
└── src/components/ai-course/
    ├── AIHero.tsx
    ├── AIWhoIsThisFor.tsx
    ├── AICurriculumModules.tsx
    ├── AITestimonials.tsx
    ├── AIFinalProject.tsx
    ├── AITransformationPath.tsx
    ├── AIPricing.tsx
    ├── AIRegistrationForm.tsx    ← Tally embed
    └── AIFAQ.tsx

n8n Workflows:
└── n8n-workflows/
    ├── ai-course-registration.json
    ├── ai-course-payment-confirmation.json
    └── README.md
```

---

## Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [1] User visits bitcamp.ge/ai                                      │
│           │                                                         │
│           ▼                                                         │
│  [2] Scrolls through landing page                                   │
│           │                                                         │
│           ▼                                                         │
│  [3] Fills inline registration form (Tally)                         │
│           │                                                         │
│           ▼                                                         │
│  [4] n8n receives webhook                                           │
│       ├── Logs to Google Sheets (status: pending)                   │
│       └── Sends welcome email with bank details                     │
│           │                                                         │
│           ▼                                                         │
│  [5] User pays via bank transfer                                    │
│           │                                                         │
│           ▼                                                         │
│  [6] User clicks link in email → Payment confirmation form          │
│       └── Uploads screenshot                                        │
│           │                                                         │
│           ▼                                                         │
│  [7] n8n receives payment webhook                                   │
│       ├── Updates Google Sheets (status: paid)                      │
│       └── Sends course access email with Discord link               │
│           │                                                         │
│           ▼                                                         │
│  [8] User joins Discord and accesses course                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      REMINDER SEQUENCE                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  After registration, if not paid:                                   │
│                                                                     │
│  [Wait 31 min] → Check status → If pending → Send reminder #1       │
│                                                                     │
│  (Optional: Add more reminders at 24h, 48h)                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Credentials Needed

| Service | What to Get | Where to Add |
|---------|-------------|--------------|
| **Tally** | Form IDs | `AIRegistrationForm.tsx`, n8n emails |
| **n8n** | Webhook URLs | Tally form integrations |
| **Google** | OAuth credentials | n8n credentials |
| **Google** | Sheet ID | n8n workflow nodes |
| **Postmark** | API token | n8n credentials |
| **Postmark** | Verified domain | Postmark dashboard |

---

## Bank Details for Emails

Update in n8n workflow email templates:

```
თანხა: 99 ლარი

საქართველოს ბანკი:
GE75TB7003815365100012

საქართველოს ბანკი (სახელმწიფო):
GE58BG0000000610012590

მიმღები: ოთარ ზაქალაშვილი
დანიშნულება: AI კურსი - [სახელი]
```

---

## Quick Resume Commands

```bash
# Start dev server
cd /Users/otar/Projects/habit-code-grow
npm run dev

# View landing page
open http://localhost:5173/ai

# Deploy to GitHub Pages
git add . && git commit -m "Update registration flow" && git push
```

---

## Notes

- Using 2 separate Tally forms (registration + payment confirmation) for simplicity
- Payment confirmation form link is sent via email with pre-filled email parameter
- n8n Wait nodes require proper execution mode for production (queue recommended)
- Consider adding Slack/Telegram notification for new sales

---

## Next Session TODO

1. Finish n8n DigitalOcean setup
2. Create both Tally forms
3. Update form IDs in code
4. Test complete flow
5. Deploy
