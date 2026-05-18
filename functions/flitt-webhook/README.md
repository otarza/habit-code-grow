# Flitt → Postmark webhook (Cloud Function)

Receives Flitt payment callbacks, verifies signatures, sends a Postmark course-access email on approved orders.

## Local dev

```bash
cd functions/flitt-webhook
npm install
FLITT_SECRET_KEY="<flitt-secret>" \
POSTMARK_SERVER_TOKEN="<postmark-token>" \
FROM_EMAIL="hello@bitcamp.ge" \
npm start
# function listens on http://localhost:8081
```

## Deploy

See top-level instructions; uses Cloud Functions Gen2 + Secret Manager.

## Behavior

- POST only. Returns 405 otherwise.
- Verifies `signature` against `SHA1(FLITT_SECRET_KEY + "|" + response_signature_string)`.
- Bails 200 on `order_status !== "approved"` (so Flitt doesn't retry).
- Maps `product_id` → Postmark template via `PRODUCT_MAP` in `index.js` (with fallback).
- Returns 200 even when Postmark send fails — logs are the recovery path. Avoids Flitt's 24h retry storm for our side errors.

## Env vars

| Name | Source | Required |
|------|--------|----------|
| `FLITT_SECRET_KEY` | Flitt merchant dashboard → secret/password | yes |
| `POSTMARK_SERVER_TOKEN` | Postmark → Server → API Tokens | yes |
| `FROM_EMAIL` | Default `hello@bitcamp.ge` | no |
| `POSTMARK_STREAM` | Default `outbound` | no |
