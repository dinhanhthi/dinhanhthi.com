# Resend Error Notifications - Quick Start (5 minutes)

Quick guide to setup email notifications for Notion API errors.

## 🎯 Purpose

Receive email notifications when errors occur with:
- ✅ Official Notion API (rate limit, timeout, invalid token, etc.)
- ✅ Unofficial Notion API (API down, network errors, etc.)
- ✅ Cache fetch failures (when no stale cache is available)

## 🚀 Setup (3 steps, 5 minutes)

### Step 1: Create Resend Account & Get API Key

1. Visit: [https://resend.com/](https://resend.com/)
2. Sign up for free (you can use GitHub login)
3. Go to [API Keys](https://resend.com/api-keys) → **Create API Key**
4. Copy the key (format: `re_xxxxxxxxxx`)

**Free tier**: 3,000 emails/month (100/day) - More than enough!

### Step 2: Add Environment Variables

#### Development (`.env.local`):
```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="contact@domain.com"
```

#### Production (Vercel):
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `RESEND_API_KEY` = `re_xxxxxxxxxxxx`
   - `ADMIN_EMAIL` = `contact@domain.com`
3. Redeploy

### Step 3: Install Package (Done! ✅)

The `resend` package has already been installed in `package.json`.

## ✅ Done!

Now when Notion API errors occur, you'll receive emails with this format:

```
Subject: 🚨 [your-site.com] Error Alert: notion-api

Body:
- Error message
- Context (database ID, cache key, etc.)
- Stack trace
- Metadata (status code, filters, etc.)
- Timestamp
```

## 🧪 Test (Optional)

Test in dev mode:

```bash
# 1. Enable in dev
echo 'SEND_ERROR_EMAILS_IN_DEV="true"' >> .env.local

# 2. Break Notion token
# Temporarily set NOTION_TOKEN="invalid-xxx" in .env.local

# 3. Run dev server
pnpm run dev

# 4. Visit homepage
# 5. Check email inbox
```

## 🎛️ Features

- **Rate limiting**: Max 1 email per 5 minutes per error type (prevents spam)
- **Silent failure**: Doesn't impact user experience
- **Environment-aware**: Auto disabled in dev (unless explicitly enabled)
- **Rich context**: Stack trace, metadata, timestamp

## 📁 Implementation Files

- `src/lib/send-error-email.ts` - Core email sending logic
- `src/lib/redis-cache.ts` - Email on cache fetch errors
- `src/lib/notion/db.ts` - Email on Notion API errors

## 📖 Details

See full documentation: [docs/ERROR_NOTIFICATIONS.md](./docs/ERROR_NOTIFICATIONS.md)

---

**Total setup time**: ~5 minutes
**Cost**: Free (Resend free tier)
**Maintenance**: Zero (automatic emails on errors)

