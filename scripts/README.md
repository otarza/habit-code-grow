# Scripts Directory

⚠️ **SECURITY WARNING**: This directory contains scripts that may have credentials.

## Security Rules

1. **NEVER commit files with real credentials to git**
2. Use `.example.js` files as templates
3. Copy `.example.js` to the real filename and add your credentials
4. Real credential files are in `.gitignore` and won't be committed

## Available Scripts

### campaign-dashboard.js
Local-only dashboard for campaign monitoring. It reads Firestore from Google Cloud and Postmark through the Postmark API, then serves a private dashboard on localhost.

**Usage:**
```bash
npm run dashboard
# open http://127.0.0.1:8787
```

Optional configuration:
```bash
CAMPAIGN_DASHBOARD_PORT=8790 npm run dashboard
GOOGLE_CLOUD_PROJECT=bitcamp-flitt npm run dashboard
POSTMARK_SERVER_TOKEN=... npm run dashboard
```

Credentials:
- Recommended: use a local service account key so the dashboard does not require daily Google re-auth.
  ```bash
  gcloud iam service-accounts create campaign-dashboard-local \
    --display-name="Local campaign dashboard" \
    --project=bitcamp-flitt

  gcloud projects add-iam-policy-binding bitcamp-flitt \
    --member="serviceAccount:campaign-dashboard-local@bitcamp-flitt.iam.gserviceaccount.com" \
    --role="roles/datastore.viewer"

  gcloud secrets add-iam-policy-binding postmark-token \
    --project=bitcamp-flitt \
    --member="serviceAccount:campaign-dashboard-local@bitcamp-flitt.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

  mkdir -p ~/.config/bitcamp
  gcloud iam service-accounts keys create ~/.config/bitcamp/campaign-dashboard-local.json \
    --iam-account=campaign-dashboard-local@bitcamp-flitt.iam.gserviceaccount.com \
    --project=bitcamp-flitt

  export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/bitcamp/campaign-dashboard-local.json"
  npm run dashboard
  ```
- Temporary fallback: if `GOOGLE_APPLICATION_CREDENTIALS` is not set, the dashboard uses `gcloud auth print-access-token`, which may require repeated human re-auth.
- Postmark uses `POSTMARK_SERVER_TOKEN`, `POSTMARK_TOKEN`, or the Secret Manager secret `postmark-token` in project `bitcamp-flitt`.
- Never store the service account JSON key inside the repo.

Dashboard tabs:
- Overview: guide leads, masterclass registrations, conversion rates, source/event breakdowns.
- Teacher Funnel: lead and masterclass registration tables with name, phone, subject, UTM/source fields.
- Postmark: outbound message list plus stats API responses.
- Firestore Explorer: all top-level Firestore collections with counts and sample documents.

### check-wp-api.example.js
Template for WordPress API diagnostic tool.

**Usage:**
```bash
# Option 1: Use environment variables (recommended)
WP_USERNAME=your_user WP_APP_PASSWORD="your pass" node scripts/check-wp-api.example.js

# Option 2: Copy and edit (not recommended for git repos)
cp scripts/check-wp-api.example.js scripts/check-wp-api.js
# Edit check-wp-api.js with your credentials
node scripts/check-wp-api.js
```

### export-tutor-lms.js / test-tutor-api.js
⚠️ These files contain hardcoded credentials and are gitignored.
Do NOT commit them to any public repository.

## Best Practices

1. **Use environment variables** when possible
2. **Use .env files** for local development (also gitignored)
3. **Create .example files** as templates without real credentials
4. **Document** which environment variables are needed

## If Credentials Are Exposed

If you accidentally commit credentials:

1. **Immediately revoke** the credentials in WordPress/TutorLMS
2. **Generate new ones**
3. **Remove from git history**: Use git-filter-branch or BFG Repo-Cleaner
4. **Force push** to overwrite history (if not shared yet)
