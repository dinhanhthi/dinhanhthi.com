# Environment Variables - Quick Reference

## 🚀 Quick Start: Minimal Setup (10 variables)

Chỉ cần 10 variables này để deploy được, add thêm sau nếu cần!

### 1. Notion API (3 vars)
```bash
NOTION_TOKEN=secret_xxxxx
NOTION_VERSION=2022-06-28
NOTION_DB_POSTS=xxxxx
```

**Cách lấy:**
```
1. https://www.notion.so/my-integrations
2. Create new integration
3. Copy "Internal Integration Token" → NOTION_TOKEN
4. Share Notion database with integration
5. Open database URL: https://notion.so/xxxxx?v=yyy
   → xxxxx = NOTION_DB_POSTS
```

### 2. Upstash Redis (2 vars)
```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=Axxx
```

**Cách lấy:**
```
1. https://console.upstash.com/
2. Select your Redis database
3. "REST API" tab
4. Copy "UPSTASH_REDIS_REST_URL"
5. Copy "UPSTASH_REDIS_REST_TOKEN"
```

### 3. Deployment (5 vars)
```bash
DEPLOY_HOOK_SECRET=random-secret-here
NEXT_PUBLIC_SITE_DOMAIN=https://dinhanhthi.com
NEXT_PUBLIC_ENV_MODE=prod
ENV_MODE=prod
DISABLE_REDIS_CACHE=false
```

**Cách lấy:**
```bash
# Generate DEPLOY_HOOK_SECRET
openssl rand -base64 32

# Others: Use values above as-is
```

---

## ✅ Scope Settings trong AWS Amplify

**QUAN TRỌNG:** Khi add variables, set đúng scope!

### Build + Runtime (cho NEXT_PUBLIC_* variables)
```
NEXT_PUBLIC_SITE_DOMAIN     → ✅ "Available to builds and functions"
NEXT_PUBLIC_ENV_MODE        → ✅ "Available to builds and functions"
NEXT_PUBLIC_GOOGLE_ANALYTICS → ✅ "Available to builds and functions"
```

### Runtime Only (cho server-side variables)
```
NOTION_TOKEN                → ✅ "Available to functions only"
UPSTASH_REDIS_REST_URL      → ✅ "Available to functions only"
UPSTASH_REDIS_REST_TOKEN    → ✅ "Available to functions only"
DEPLOY_HOOK_SECRET          → ✅ "Available to functions only"
ENV_MODE                    → ✅ "Available to functions only"
... (all other non-NEXT_PUBLIC_*)
```

---

## 📋 Full List (Optional - Add Later)

Nếu sau khi deploy với 10 variables ở trên mà có features không work, add thêm các variables sau:

### Notion Unofficial API (5 vars)
```bash
NOTION_API_PUBLISHED=https://www.notion.so/api/v3
SPACE_ID=xxxxx
SOURCE_ID=xxxxx
COLLECTION_VIEW_ID=xxxxx
```

### Reading Collection (~11 vars)
```bash
READING_SOURCE_ID=xxxxx
READING_COLLECTION_VIEW_ID=xxxxx
READING_COVER_KEY=Cover
READING_AUTHOR_KEY=Author
READING_DESC_KEY=Description
READING_STAR_KEY=Star
READING_IS_READING_KEY=IsReading
READING_TAG_KEY=Tag
READING_GOODREADS_KEY=Goodreads
READING_KEYSEARCH_KEY=KeySearch
READING_READ_DATE_KEY=ReadDate
```

### Tools Collection (~10 vars)
```bash
TOOLS_SOURCE_ID=xxxxx
TOOLS_COLLECTION_VIEW_ID=xxxxx
TOOLS_TAG_KEY=Tag
TOOLS_CATEGORY_KEY=Category
TOOLS_ICON_KEY=Icon
TOOLS_DESC_KEY=Description
TOOLS_SHORT_DESC_KEY=ShortDescription
TOOLS_FREE_KEY=Free
TOOLS_URL_KEY=URL
TOOLS_KEYSEARCH_KEY=KeySearch
```

### Topics Collection (~6 vars)
```bash
TOPICS_SOURCE_ID=xxxxx
TOPICS_COLLECTION_VIEW_ID=xxxxx
TOPICS_ICON_KEY=Icon
TOPICS_DESC_KEY=Description
TOPICS_PINNED_KEY=Pinned
TOPICS_HIDE_KEY=Hide
```

### Post Properties (~17 vars)
```bash
NEXT_PUBLIC_ID_SLUG=slug
NEXT_PUBLIC_ID_PUBLISHED=published
NEXT_PUBLIC_ID_HIDE=hide
NEXT_PUBLIC_ID_DESC=description
NEXT_PUBLIC_ID_LAST_MODIFIED=last_modified
NEXT_PUBLIC_ID_CREATED_DATE=created_date
NEXT_PUBLIC_ID_TAGS=tags
NEXT_PUBLIC_ID_IS_PAGE=is_page
NEXT_PUBLIC_ID_DRAFT=draft
NEXT_PUBLIC_ID_PINNED=pinned
NEXT_PUBLIC_ID_DISCRETE=discrete
NEXT_PUBLIC_ID_BLOG=blog
NEXT_PUBLIC_ID_LANGUAGE=language
NEXT_PUBLIC_ID_VI=vi
NEXT_PUBLIC_ID_EN=en
NEXT_PUBLIC_ID_FR=fr
NEXT_PUBLIC_NOTION_PUBLISHED_URL=https://dinhanhthi.notion.site/
```

### Email Notifications (3 vars - Optional)
```bash
RESEND_API_KEY=re_xxx
ADMIN_EMAIL=your-email@example.com
DISABLE_ERROR_EMAILS=false
```

### Analytics (1 var - Optional)
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

---

## 🔧 How to Get Values from Vercel

Nếu đã có project trên Vercel:

### Via UI (Easy)
```
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Click "Show" on each variable
4. Copy value
5. Paste into AWS Amplify
```

### Via CLI (Fast)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Pull env vars
vercel env pull .env.vercel

# View file
cat .env.vercel
```

### From Local .env.local
```bash
# If you have .env.local file
cat .env.local

# Or .env
cat .env
```

---

## 🎯 Deployment Strategy

### Approach 1: Start Minimal (Recommended)
```
1. Add 10 REQUIRED variables
2. Deploy & test
3. If errors → check logs → add missing vars
4. Iterate until working
```

### Approach 2: Copy All from Vercel
```
1. Copy all ~60 variables from Vercel
2. Deploy once
3. Should work immediately
4. Time-consuming but safe
```

**Khuyến nghị:** Dùng Approach 1 - nhanh hơn và learn được variables nào thực sự cần!

---

## ✅ Verification Checklist

After adding variables:

- [ ] Total variables: At least 10 (minimal) or ~60 (full)
- [ ] All `NEXT_PUBLIC_*` have scope: "Available to builds and functions"
- [ ] All server vars have scope: "Available to functions only"
- [ ] NOTION_TOKEN starts with `secret_`
- [ ] UPSTASH URLs start with `https://`
- [ ] DEPLOY_HOOK_SECRET is random (not "your-secret")

---

**Quick Reference Created:** 2026-02-04
**Use this when:** Adding environment variables to AWS Amplify
