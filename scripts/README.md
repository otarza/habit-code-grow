# Scripts Directory

⚠️ **SECURITY WARNING**: This directory contains scripts that may have credentials.

## Security Rules

1. **NEVER commit files with real credentials to git**
2. Use `.example.js` files as templates
3. Copy `.example.js` to the real filename and add your credentials
4. Real credential files are in `.gitignore` and won't be committed

## Available Scripts

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
