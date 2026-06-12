# Agent Handoff Notes

These notes are for coding agents working in this repository. Keep secrets out of git, shell history, docs, and committed artifacts.

## n8n And Listmonk

Use self-hosted n8n as middleware for public frontend forms instead of creating Google Cloud Functions, unless the user explicitly asks for Google Cloud.

### n8n

- Base URL: `https://n8n.bitcamp.ge`
- Public API base: `https://n8n.bitcamp.ge/api/v1`
- API auth header: `X-N8N-API-KEY`
- Ask the user for an n8n API key when creating, updating, or activating workflows through the API.
- Do not write API keys into repo files, scripts, shell history, docs, or committed artifacts.
- Read existing workflows first through the API when possible so new workflows match live conventions.
- Useful existing workflow reference: `Tally > Listmonk`
- Existing Listmonk Basic Auth credential in n8n:
  - Name: `Listmonk API User - n8n`
  - ID: `zLi3G9eMUcRNm5tn`
  - Type: `httpBasicAuth`
- Public webhook workflows should generally use `Webhook` and `Respond to Webhook` nodes.
- Browser-submitted webhooks should return JSON and include CORS-safe responses.
- Production webhook URLs use: `https://n8n.bitcamp.ge/webhook/{path}`

### Listmonk

- Listmonk API host that works from n8n and local testing: `https://news.bitcamp.ge`
- API base: `https://news.bitcamp.ge/api`
- Use Listmonk through n8n HTTP Request nodes with the existing n8n credential above.
- Do not expose Listmonk API credentials in frontend code.
- Subscriber operations:
  - Create: `POST https://news.bitcamp.ge/api/subscribers`
  - Find existing: `GET https://news.bitcamp.ge/api/subscribers?query=subscribers.email = 'email@example.com'`
  - Update existing: `PATCH https://news.bitcamp.ge/api/subscribers/{subscriber_id}`
- Prefer finding an existing subscriber first. If one exists, patch it with merged list IDs instead of blindly posting and hitting duplicate-email conflicts.
- Use `preconfirm_subscriptions: true` when direct confirmed subscriptions are intended.
- Store useful metadata in `attribs`, for example: `source`, `path`, `utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `subscribed_from`.

### Current Example

- Frontend modal component: `src/components/FreeLessonEmailGate.tsx`
- n8n workflow template: `n8n-workflows/free-lesson-listmonk-subscribe.json`
- n8n API helper script: `scripts/create-n8n-free-lesson-workflow.js`
- Active n8n workflow: `https://n8n.bitcamp.ge/workflow/bKKlWUD51RDEj1fU`
- Active webhook: `https://n8n.bitcamp.ge/webhook/free-lesson-subscribe`
- Current list routing:
  - `/ai/free-lesson` -> Listmonk list ID `4`
  - `/ai-bootcamp/free-lesson` -> Listmonk list ID `5`

### Future Workflow Pattern

1. Add or update the frontend form, modal, or page.
2. Submit public frontend data to an n8n webhook, not directly to Listmonk.
3. Add an importable workflow JSON under `n8n-workflows/`.
4. If useful, add a small script under `scripts/` to create or update the workflow through the n8n API.
5. Use n8n credential ID `zLi3G9eMUcRNm5tn` for Listmonk HTTP Request nodes.
6. Activate workflows through the n8n API only after credentials are bound.
7. Smoke test the production webhook with disposable data.
8. Verify the result in Listmonk.
9. Clean up disposable test subscribers.
10. Run relevant frontend checks or builds.
11. Before committing, scan the repo for any pasted tokens or secrets.

### Important

- `new.bitamp.ge` did not resolve during local testing. Use `news.bitcamp.ge` for the Listmonk API unless the user says otherwise.
- If the user pastes tokens in chat, use them only for immediate API calls and recommend rotation afterward.
