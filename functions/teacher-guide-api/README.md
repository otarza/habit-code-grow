# Teacher Guide API

Cloud Function for the teacher AI guide funnel. It stores email-only leads in Firestore, sends the PDF link through Postmark, tracks download/masterclass clicks through redirect URLs, and lets the confirmation page enrich masterclass registrations with name, phone, and teaching subject.

## Local Dev

```bash
cd functions/teacher-guide-api
npm install
POSTMARK_SERVER_TOKEN="<postmark-token>" \
FROM_EMAIL="BitCamp <hello@bitcamp.ge>" \
SITE_ORIGIN="http://localhost:5173" \
FUNCTION_PUBLIC_URL="http://localhost:8084" \
npm run dev
```

Local endpoints:

- `POST http://localhost:8084/lead`
- `POST http://localhost:8084/masterclass-details`
- `GET http://localhost:8084/registration?token=...`
- `GET http://localhost:8084/calendar?token=...`
- `GET http://localhost:8084/download?token=...`
- `GET http://localhost:8084/masterclass?token=...`

## Deploy

Use Gen2 with zero warm instances to avoid always-on cost:

```bash
gcloud functions deploy teacher-guide-api \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --source=functions/teacher-guide-api \
  --entry-point=teacherGuideApi \
  --trigger-http \
  --allow-unauthenticated \
  --memory=256Mi \
  --timeout=30s \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars='^|^SITE_ORIGIN=https://www.bitcamp.ge|FUNCTION_PUBLIC_URL=https://us-central1-bitcamp-flitt.cloudfunctions.net/teacher-guide-api|PDF_PUBLIC_PATH=/resources/teacher-ai-guide-placeholder.pdf|MASTERCLASS_CONFIRM_PATH=/teachers-ai-masterclass/confirmed|FROM_EMAIL=BitCamp <oto@bitcamp.ge>|POSTMARK_STREAM=flitt-payments-transactional|ALLOWED_ORIGINS=https://www.bitcamp.ge,https://bitcamp.ge'
```

Set `POSTMARK_SERVER_TOKEN` from Secret Manager or with a protected env var in your deployment workflow.

## Firestore

- `teacher_guide_leads`: one document per normalized email hash.
- `teacher_guide_events`: append-only event records for lead creation, email delivery, PDF clicks, masterclass registration, and enrichment details.

The function does no polling or scheduled work. Reads and writes happen only on form submit and tracked link clicks.
