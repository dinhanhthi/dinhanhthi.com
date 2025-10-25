# Error Email Notifications

Automatic email notification system for Notion API errors (official and unofficial).

## 🎯 Features

- ✅ **Email notification** for Notion API, unofficial Notion API, and cache fetch errors
- ✅ **Rate limiting**: Maximum 1 email per 5 minutes per error type (prevents spam)
- ✅ **Silent failure**: Doesn't impact user experience if email sending fails
- ✅ **Environment-aware**: Only sends in production (unless explicitly enabled in dev)
- ✅ **Rich error context**: Includes error message, stack trace, metadata, timestamp
- ✅ **Free tier**: Resend provides 3,000 emails/month (100/day) for free

## 📦 Tech Stack

- **Email Service**: [Resend](https://resend.com/) - Developer-friendly email API
- **Integration**: Next.js + Vercel
- **Cache Layer**: Upstash Redis (optional but recommended)

## 🚀 Setup Instructions

### 1. Create Resend Account

1. Visit [https://resend.com/](https://resend.com/)
2. Sign up for free (you can use GitHub login)
3. Verify email address

### 2. Get API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Name it (e.g., `dinhanhthi.com-errors`)
4. Choose permissions: **Full Access** or **Send emails**
5. Copy API key (format: `re_xxxxxxxxxx`)

### 3. Configure Environment Variables

#### Development (`.env.local`):

```bash
# ---- ERROR NOTIFICATIONS (RESEND)
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="contact@domain.com"

# Optional: Enable error emails in dev (default: disabled)
SEND_ERROR_EMAILS_IN_DEV="false"
```

#### Production (Vercel):

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add 2 variables:
   - `RESEND_API_KEY` = `re_xxxxxxxxxxxx`
   - `ADMIN_EMAIL` = `contact@domain.com`
3. Apply to **Production** and **Preview** (if you want to test on preview deployments)
4. Redeploy to apply changes

### 4. (Optional) Verify Domain

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. Go to Resend Dashboard → Domains
2. Add domain (e.g., `dinhanhthi.com`)
3. Add DNS records (SPF, DKIM, DMARC) to your DNS provider
4. Verify domain
5. Update email sender in `src/lib/send-error-email.ts`:

```typescript
from: 'errors@dinhanhthi.com', // Instead of 'onboarding@resend.dev'
```

## 📧 Email Format

When an error occurs, you'll receive an email with this format:

```
Subject: 🚨 [dinhanhthi.com] Error Alert: notion-api

Body:
🚨 Error Alert
Site: dinhanhthi.com
Type: notion-api
Time: 2025-10-24T10:30:00.000Z

❌ Error Message
Failed to query Notion database

Context: Failed to query Notion database: xxx-xxx-xxx

📊 Metadata
{
  "dbId": "xxx-xxx-xxx",
  "filter": {...},
  "status": 502
}

📚 Stack Trace
Error: Failed to query Notion database
    at queryDatabaseImpl (db.ts:159)
    ...
```

## 🔧 Error Types

The system detects and notifies the following error types:

| Error Type           | Trigger Point                                    | Description                          |
| -------------------- | ------------------------------------------------ | ------------------------------------ |
| `notion-api`         | `src/lib/notion/db.ts` → `queryDatabaseImpl`     | Official Notion API errors           |
| `unofficial-notion`  | `src/lib/notion/db.ts` → `getUnofficialDatabase` | Unofficial Notion API errors         |
| `cache-fetch`        | `src/lib/redis-cache.ts` → `withRedisCache`      | Cache fetch failures (with fallback) |
| `redis`              | Future - Redis connection errors                 | Redis connection/operation errors    |
| `other`              | Future - General errors                          | Other application errors             |

## 🎛️ Configuration

### Rate Limiting

Default: **1 email per 5 minutes per error type**

Prevents spam if multiple errors occur consecutively. To change, edit `src/lib/send-error-email.ts`:

```typescript
const rateLimitMs = 5 * 60 * 1000 // 5 minutes
```

### Development Mode

Default: **Disabled in development**

Reason: Saves quota and prevents spam during development.

To enable in dev:

```bash
SEND_ERROR_EMAILS_IN_DEV="true"
```

### Production Mode

Default: **Enabled automatically**

When `ENV_MODE=prod` (Vercel production), emails are sent automatically.

## 🧪 Testing

### Test Local (Development):

```bash
# 1. Enable error emails in dev
echo 'SEND_ERROR_EMAILS_IN_DEV="true"' >> .env.local

# 2. Temporarily break Notion token in .env.local
NOTION_TOKEN="invalid-token-xxx"

# 3. Run dev server
pnpm run dev

# 4. Visit homepage or any page that fetches Notion data
# 5. Check console for error logs
# 6. Check email inbox for notification
```

### Test Production (Vercel):

1. Deploy with correct `RESEND_API_KEY` and `ADMIN_EMAIL`
2. Temporarily break Notion token in Vercel env vars
3. Trigger a page load
4. Check email inbox
5. Restore Notion token

## 📊 Monitoring

### Development Logs:

```bash
⚠️ Resend not configured - skipping error email notification
ℹ️ Skipping error email in development mode
⏰ Rate limit: Skipping email for notion-api (sent 120s ago)
✅ Error email sent successfully (ID: xxx-xxx-xxx)
❌ Failed to send error email: Error: ...
```

### Production Monitoring:

1. **Vercel Logs**: Functions → Filter by timeframe
2. **Resend Dashboard**: Logs → View sent emails, delivery status
3. **Email Inbox**: Actual error notifications

## 🔒 Security & Privacy

- ✅ API keys stored securely in Vercel Environment Variables
- ✅ Emails only sent to admin address (not exposed to users)
- ✅ Stack traces and metadata only in emails (not logged publicly)
- ✅ Rate limiting prevents email spam
- ✅ Silent failure ensures user experience not impacted

## 💰 Cost & Quota

**Resend Free Tier:**

- 3,000 emails/month
- 100 emails/day
- No credit card required

**Typical Usage Estimate:**

- Normal operation: 0 emails (no errors)
- Minor outage (5 min): 1-5 emails (rate limited)
- Major outage (1 hour): ~10-12 emails (rate limited per error type)
- Monthly: < 100 emails (well within free tier)

**Upgrade Options:**

- Pro Plan: $20/month → 50,000 emails
- Business Plan: $80/month → 500,000 emails

## 🛠️ Troubleshooting

### Emails not being sent

**Check 1: API Key configured?**

```bash
# Local
echo $RESEND_API_KEY

# Vercel
# Check Vercel Dashboard → Settings → Environment Variables
```

**Check 2: Environment mode**

```bash
# Dev mode is disabled by default
# Check console logs:
ℹ️ Skipping error email in development mode

# Fix: Set SEND_ERROR_EMAILS_IN_DEV="true"
```

**Check 3: Rate limit**

```bash
# Check console logs:
⏰ Rate limit: Skipping email for notion-api (sent 120s ago)

# Wait 5 minutes or clear cache
```

**Check 4: Resend quota**

Visit [https://resend.com/emails](https://resend.com/emails) → Check remaining quota

**Check 5: Email spam folder**

Resend emails may go to spam if domain is not verified.

### Email format not displaying correctly

Default format is responsive HTML. If email client doesn't display well, add plain text fallback in `src/lib/send-error-email.ts`:

```typescript
await resend.emails.send({
  // ...existing fields
  text: `Error: ${errorMessage}\nContext: ${context}\nTime: ${timestamp}`
})
```

## 📝 Examples

### Example 1: Notion API Rate Limit

```
Subject: 🚨 [dinhanhthi.com] Error Alert: notion-api

Error Message: Notion API error: 429 Too Many Requests
Context: Failed to query Notion database: xxx-xxx-xxx
Metadata: { "status": 429, "dbId": "xxx" }
```

### Example 2: Unofficial API Down

```
Subject: 🚨 [dinhanhthi.com] Error Alert: unofficial-notion

Error Message: Unofficial Notion API error: 503 Service Unavailable
Context: Failed to query unofficial Notion database: xxx-xxx-xxx
```

### Example 3: Cache Fetch Error (Redis Fallback)

```
Subject: 🚨 [dinhanhthi.com] Error Alert: cache-fetch

Error Message: Failed to fetch data for cache key: topics
Context: Failed to fetch data for cache key: topics
Metadata: { "cacheKey": "topics", "softTTL": 7200, "hardTTL": 1209600 }
```

## 🔗 Related Documentation

- [Redis Cache Setup](./REDIS_QUICK_START.md)
- [Notion Integration](../README.md#notion-integration)
- [Vercel Deployment](../README.md#deployment)
- [Resend Documentation](https://resend.com/docs)

## 🙋 FAQ

**Q: Is Redis required to use error notifications?**
A: No. Error notifications work independently from Redis. However, Redis cache helps reduce errors by serving stale content when Notion API fails.

**Q: Can emails spam the inbox?**
A: No. Rate limiting (1 email/5min/error type) prevents spam.

**Q: Is the free tier sufficient for production?**
A: Yes. With rate limiting, estimated < 100 emails/month (free tier: 3,000/month).

**Q: Can I send to multiple email addresses?**
A: Yes. Update `ADMIN_EMAIL` to a comma-separated list or modify the code to support multiple recipients.

**Q: Can I customize the email template?**
A: Yes. Edit the `buildErrorEmailHTML()` function in `src/lib/send-error-email.ts`.

---

**Last Updated**: October 24, 2025
**Version**: 1.0.0

