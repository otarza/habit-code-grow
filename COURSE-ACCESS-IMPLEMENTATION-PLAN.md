# Generic Course Access System Implementation Plan

## Goal

Move paid students from Google Classroom to BitCamp's website without sending bulk magic-link emails upfront.

Students should be able to open a course page, enter the email they used to buy or join the course, and receive a fresh login link if that email has active access.

This should work generically for every current and future paid course.

## Current Starting Point

- Course pages already exist under `/learn/:courseSlug`.
- Current access is a soft paywall:
  - `?access=<base64url email>` unlocks the course.
  - The decoded email is stored in `localStorage`.
  - The email is shown in the course shell.
  - Logout clears the stored access.
- Flitt payment callback already sends Postmark welcome/access emails.
- Telegram manager bot can manually send invite emails.
- Existing Postmark purchase templates should not be changed for this feature.

## Implementation Status

- Phase 1 backend function: implemented and deployed as `course-access-api`.
- Firestore: enabled in `bitcamp-flitt`, default database created in `us-central1`.
- Postmark login template: `course-login-link` created.
- Frontend learning gate: email request form implemented for `/learn/:courseSlug`.
- Import tooling: `scripts/import-course-access.js` added with dry-run and apply modes.
- Phase 2 integrations: implemented for `flitt-webhook`, Telegram manager bot, and local invite script.

## Target Architecture

Use one entitlement store as the source of truth:

```txt
Google Classroom import
Flitt purchases
Telegram/manual invites
        |
        v
Firestore course_access collection
        |
        v
Course login-link request API
        |
        v
Postmark login-link email
        |
        v
/learn/:courseSlug?access=<base64url email>
```

## Firestore Data Model

Collection:

```txt
course_access/{emailHash}
```

Document shape:

```js
{
  email: "student@example.com",
  emailNormalized: "student@example.com",
  courses: {
    "ai-bootcamp": {
      status: "active",
      source: "google_classroom_import",
      grantedAt: Timestamp,
      updatedAt: Timestamp,
      externalId: "classroom-ai-bootcamp-2024",
      note: "Imported from Google Classroom"
    },
    "ai-pro": {
      status: "active",
      source: "flitt_purchase",
      orderId: "ORDER_ID",
      amount: "249.00",
      currency: "GEL",
      grantedAt: Timestamp,
      updatedAt: Timestamp
    }
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastMagicLinkSentAt: Timestamp
}
```

Document ID:

```txt
sha256(normalizedEmail)
```

Optional audit collection:

```txt
course_access_events/{autoId}
```

Event shape:

```js
{
  emailHash,
  courseSlug,
  type: "imported" | "purchased" | "login_link_sent" | "login_link_denied" | "telegram_invite",
  createdAt: Timestamp,
  metadata: {}
}
```

## Shared Course Catalog

Create a shared catalog used by functions and scripts:

```js
{
  "ai-bootcamp": {
    title: "AI Prompt Engineering Bootcamp",
    productName: "AI Bootcamp Self-Paced",
    learnPath: "/learn/ai-bootcamp",
    buyPath: "/ai-bootcamp",
    loginTemplateAlias: "course-login-link"
  },
  "ai-pro": {
    title: "AI Bootcamp Mentored",
    productName: "AI Bootcamp Mentored",
    learnPath: "/learn/ai-pro",
    buyPath: "/ai",
    loginTemplateAlias: "course-login-link"
  }
}
```

This keeps the system generic when more paid courses are added.

## Phase 1: Migration Login Flow

Primary purpose: let existing Google Classroom students self-serve access from the new website.

### 1. Create Firestore Database

- Create or confirm Firestore is enabled in project `bitcamp-flitt`.
- Use Native mode.
- Use a low-cost region compatible with the current GCP setup.
- Confirm the default compute service account can read/write `course_access`.

### 2. Create Login-Link Postmark Template

Create a new Postmark template alias:

```txt
course-login-link
```

Template variables:

```txt
product_name
magic_link
base64_email
```

This is separate from purchase/welcome templates.

Tone:

- "Here is your course login link."
- Not a receipt.
- Not a purchase confirmation.

### 3. Add `course-access-api` Cloud Function

New folder:

```txt
functions/course-access-api/
```

Endpoint:

```txt
POST /request-magic-link
```

Request body:

```js
{
  email: "student@example.com",
  courseSlug: "ai-bootcamp"
}
```

Behavior:

1. Normalize email with `trim().toLowerCase()`.
2. Validate email format.
3. Validate `courseSlug` exists in the shared catalog.
4. Hash normalized email with SHA-256.
5. Read `course_access/{emailHash}` from Firestore.
6. Check `courses[courseSlug].status === "active"`.
7. If active, send `course-login-link` via Postmark.
8. If inactive or missing, do not send.
9. Always return the same public response:

```js
{
  ok: true,
  message: "If this email has access, we sent a login link."
}
```

This prevents people from checking whether an email is in the buyer list.

### 4. Add Basic Abuse Protection

Minimum first version:

- Store `lastMagicLinkSentAt` per email.
- Do not send another link for the same email/course within 5 minutes.
- Still return the same public success message.

Optional later:

- IP-based rate limiting.
- Cloudflare Turnstile.
- Audit event logging for denied requests.

### 5. Update `/learn/:courseSlug` Gate

Replace the current "check your email" only gate with:

- Email input.
- Submit button.
- Loading state.
- Success state with neutral message.
- Link to buy page for new students.

Suggested copy:

```txt
შეიყვანე ის ელფოსტა, რომლითაც კურსზე დარეგისტრირდი ან შეიძინე.
თუ ამ ელფოსტას აქვს წვდომა, შესვლის ბმული გამოგიგზავნით.
```

Keep existing behavior:

- `?access=<base64url email>` unlocks.
- Store access in `localStorage`.
- Show profile email in course UI.
- Logout clears access.

### 6. Add Google Classroom Import Script

New script:

```txt
scripts/import-course-access.js
```

Input CSV:

```csv
email,course_slug,source,note
student@example.com,ai-bootcamp,google_classroom,old AI classroom
```

CLI examples:

```bash
gcloud auth application-default login

node scripts/import-course-access.js \
  --file "AI Bootcamp.csv" \
  --course ai-bootcamp \
  --source google_classroom \
  --dry-run
```

```bash
node scripts/import-course-access.js \
  --file "AI Bootcamp.csv" \
  --course ai-bootcamp \
  --source google_classroom \
  --apply
```

Script requirements:

- Parse CSV safely.
- Normalize emails.
- Validate email format.
- Dedupe emails.
- Print counts before writing:
  - total rows
  - valid emails
  - invalid rows
  - duplicates skipped
  - records to upsert
- Batch-write to Firestore.
- Never send emails.

### 7. Phase 1 Verification

Use one test email from the Google Classroom list.

Checklist:

- Import dry-run looks correct.
- Import apply writes Firestore record.
- `/learn/ai-bootcamp` shows email gate.
- Known eligible email receives login-link email.
- Unknown email receives same public message but no email.
- Magic link unlocks the course.
- Logout clears access.
- Direct lesson URL still works after magic-link login.

### 8. Google Classroom Announcement

After Phase 1 works, post this style of announcement:

```txt
კურსი გადავიტანეთ ახალ სასწავლო პორტალზე:
https://www.bitcamp.ge/learn/ai-bootcamp

შეიყვანეთ ის ელფოსტა, რომლითაც კურსზე იყავით დარეგისტრირებული.
თუ ელფოსტას აქვს წვდომა, შესვლის ბმულს მიიღებთ inbox-ში.
```

## Phase 2: Make Entitlements Permanent

Primary purpose: every new purchase or manual invite automatically gets stored in the same access system.

### 1. Update Flitt Webhook

File:

```txt
functions/flitt-webhook/index.js
```

After verified approved payment and email extraction:

1. Map Flitt product to course slug.
2. Upsert entitlement in Firestore.
3. Send existing purchase/welcome email.

Important behavior:

- Entitlement should be written even if Postmark welcome email fails.
- Do not change signature verification.
- Do not redeploy unrelated functions.
- Keep existing templates:
  - `course-access-ai-bootcamp`
  - `course-access-ai-pro`

Recommended event type:

```txt
purchased
```

Metadata:

```js
{
  orderId,
  paymentId,
  productId,
  amount,
  currency,
  source: "flitt_purchase"
}
```

### 2. Update Telegram Manager Bot

File:

```txt
functions/bitcamp-manager-bot/index.js
```

Current `/invite` sends email. Update it to:

1. Upsert entitlement in Firestore.
2. Send invite/welcome email.
3. Reply with Postmark MessageID and course access status.

Recommended event type:

```txt
telegram_invite
```

This lets invited students later use the normal "send me a login link" gate.

### 3. Update Local Invite Script

File:

```txt
scripts/invite-to-course.js
```

Update it to:

1. Upsert entitlement in Firestore.
2. Send invite/welcome email.
3. Support `--dry-run`.

This keeps command-line invites consistent with the bot and payments.

### 4. Add Shared Entitlement Helper

Avoid duplicating Firestore logic across functions/scripts.

Possible shared files:

```txt
functions/_shared/courseCatalog.js
functions/_shared/entitlements.js
```

Helpers:

```js
normalizeEmail(email)
emailHash(email)
toBase64Url(email)
buildMagicLink(courseSlug, email)
upsertCourseAccess({ email, courseSlug, source, metadata })
canRequestMagicLink({ email, courseSlug })
recordAccessEvent(event)
```

Keep the helper small and CommonJS-compatible for Cloud Functions.

### 5. Phase 2 Verification

Flitt:

- Use test payment or known callback fixture.
- Confirm Firestore entitlement is created.
- Confirm welcome email still sends.
- Confirm login-link request works after purchase.

Telegram:

- Send `/invite oto@bitcamp.ge bootcamp test`.
- Confirm Firestore entitlement exists.
- Confirm invite email sends.
- Confirm `/learn/ai-bootcamp` email gate can send a new login link for that email.

Script:

- Run dry-run.
- Run apply for a test email.
- Confirm Firestore record.

## Deployment Plan

Phase 1 deploy order:

1. Create Postmark `course-login-link` template.
2. Enable Firestore.
3. Deploy `course-access-api`.
4. Update frontend gate.
5. Build and deploy website.
6. Import Google Classroom CSV.
7. Verify with test email.
8. Announce in Google Classroom.

Phase 2 deploy order:

1. Update shared entitlement helpers.
2. Update `flitt-webhook`.
3. Deploy only `flitt-webhook`.
4. Update `bitcamp-manager-bot`.
5. Deploy only `bitcamp-manager-bot`.
6. Update local invite script.
7. Run end-to-end checks.

## Security And Privacy Notes

- This is still a soft gate, not true content security.
- Do not expose eligibility in API responses.
- Do not put raw emails in Firestore document IDs.
- Do not log full magic links unless needed for debugging.
- Do not send bulk login emails unless there is a deliberate campaign reason.
- Use Secret Manager for Postmark token.
- Restrict CORS to `https://www.bitcamp.ge` when possible.

## Open Decisions

- Firestore region.
- Exact Postmark copy for `course-login-link`.
- Whether to add Cloudflare Turnstile in Phase 1 or defer.
- Whether `ai-pro` learn content exists now or should show a "coming soon" course shell.
- Whether imported Google Classroom users should get access only to specific courses or to bundles.

## Success Definition

Phase 1 is complete when an old Google Classroom student can:

1. Open the public course link.
2. Enter their email.
3. Receive a login-link email.
4. Click it.
5. Access the course on the website.

Phase 2 is complete when every new paid purchase, Telegram invite, or manual import writes to the same entitlement store and can use the same login-link recovery flow.
