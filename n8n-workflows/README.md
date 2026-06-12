# AI Course Registration - n8n Workflows

## Overview

Workflows to handle AI course registration, payment confirmation, and free-lesson subscribers:

1. **ai-course-registration.json** - Handles new registrations
2. **ai-course-payment-confirmation.json** - Handles payment confirmations
3. **free-lesson-listmonk-subscribe.json** - Adds `/ai/free-lesson` and `/ai-bootcamp/free-lesson` modal emails to Listmonk

---

## Setup Guide

### Step 1: Create Tally Forms

#### Form 1: Registration Form
Create at [tally.so](https://tally.so) with fields:
- `name` (სახელი) - Short text, required
- `email` (ელფოსტა) - Email, required
- `phone` (ტელეფონი) - Phone, required

#### Form 2: Payment Confirmation Form
- `email` (ელფოსტა) - Email, required
- `name` (სახელი) - Short text
- `screenshot` (ჩარიცხვის სქრინშოტი) - File upload

---

### Step 2: Create Google Sheet

Create a Google Sheet with these columns:

| Column | Description |
|--------|-------------|
| Timestamp | Auto-filled by n8n |
| Name | Student name |
| Email | Student email |
| Phone | Phone number |
| Status | `pending` or `paid` |
| Source | `landing-page` |
| Payment_Date | When payment confirmed |
| Payment_Proof | Screenshot URL or status |

---

### Step 3: Import Workflows to n8n

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Import both JSON files
4. Update these placeholders in each workflow:
   - `YOUR_GOOGLE_SHEET_ID` - Your Google Sheet document ID
   - `YOUR_GOOGLE_CREDENTIALS_ID` - n8n Google Sheets credentials
   - `YOUR_POSTMARK_CREDENTIALS_ID` - n8n Postmark credentials
   - `PAYMENT_CONFIRMATION_FORM_ID` - Tally payment form ID

---

### Step 4: Connect Tally to n8n

#### For Registration Form:
1. In Tally, go to your form → **Integrations** → **Webhooks**
2. Add webhook URL: `https://your-n8n-domain.com/webhook/ai-course-register`
3. Method: POST

#### For Payment Confirmation Form:
1. Add webhook URL: `https://your-n8n-domain.com/webhook/ai-course-payment`
2. Method: POST

---

### Step 5: Set up Postmark

1. Create account at [postmarkapp.com](https://postmarkapp.com)
2. Verify your sending domain (bitcamp.ge)
3. Get API token from **Account** → **API Tokens**
4. Add credentials in n8n: **Credentials** → **New** → **Postmark API**

---

### Step 6: Activate Workflows

1. Open each workflow in n8n
2. Click **Active** toggle (top right)
3. Test with a form submission

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     REGISTRATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Landing Page /ai]                                             │
│          │                                                       │
│          ▼                                                       │
│   [Tally Registration Form]                                      │
│          │                                                       │
│          ▼                                                       │
│   [n8n Webhook] ──► [Google Sheets] ──► [Postmark Welcome Email] │
│                           │                                      │
│                           ▼                                      │
│                    [Wait 31 min]                                 │
│                           │                                      │
│                           ▼                                      │
│                  [Check if Paid?]                                │
│                     │        │                                   │
│                    YES      NO                                   │
│                     │        │                                   │
│                     ▼        ▼                                   │
│                  [Stop]  [Send Reminder]                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  PAYMENT CONFIRMATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Payment Confirmation Form]                                    │
│          │                                                       │
│          ▼                                                       │
│   [n8n Webhook] ──► [Update Sheet: paid] ──► [Send Access Email] │
│                                                       │          │
│                                                       ▼          │
│                                              [Slack Notify]      │
│                                               (optional)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Customization

### Email Templates
Edit the HTML in each Postmark node to customize:
- Colors and branding
- Bank account details
- Course access instructions
- Discord links

### Timing
Change the Wait node duration (default: 31 minutes) in the registration workflow.

### Additional Reminders
Duplicate the reminder section to add 24h and 48h follow-ups.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not receiving data | Check Tally webhook URL matches n8n |
| Email not sending | Verify Postmark domain and credentials |
| Google Sheets error | Re-authorize Google Sheets connection |
| Wait node stuck | Check n8n execution mode (queue vs main) |

---

## Support

Questions? Contact hello@bitcamp.ge

---

## Free Lesson Listmonk Subscribe

Import `free-lesson-listmonk-subscribe.json` into n8n and create an HTTP Basic Auth credential for Listmonk:

- Base URL used by workflow: `https://news.bitcamp.ge`
- `/ai/free-lesson` sends `listId=4`
- `/ai-bootcamp/free-lesson` sends `listId=5`
- Production webhook URL expected by the site: `https://n8n.bitcamp.ge/webhook/free-lesson-subscribe`

The workflow response node includes `Access-Control-Allow-Origin: *` because this public webhook does not use cookies or browser credentials. If your n8n instance overrides CORS globally, allow `https://www.bitcamp.ge` and `https://bitcamp.ge`.

### Create via n8n API

The repo includes a helper script that creates the workflow through the n8n public API:

```bash
N8N_API_TOKEN_FILE=/tmp/n8n_api_token \
N8N_LISTMONK_CREDENTIAL_ID="your-n8n-http-basic-auth-credential-id" \
N8N_ACTIVATE_WORKFLOW=true \
node scripts/create-n8n-free-lesson-workflow.js
```

If you omit `N8N_LISTMONK_CREDENTIAL_ID`, the script still creates the workflow, but leaves it inactive so you can bind the Listmonk credential in the n8n UI before activating.
