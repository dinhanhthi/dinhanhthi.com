# Deployment Guide: Vercel + GitHub Actions

## Architecture

```
Notion (CMS) ── build time ──> Next.js SSG ── deploy ──> Vercel CDN
                                    │
                          GitHub Actions (cron 3 days)
```

- All pages pre-rendered at build time (`generateStaticParams` + `dynamicParams: false`)
- No Redis, no runtime Notion API calls for page rendering
- Search: Pagefind indexes HTML at build time, runs client-side
- OG images: `/api/og` Vercel Edge Function (free)
- Build failure: GitHub sends email, Vercel keeps previous deployment

## Local Development

### Prerequisites

- Node.js >= 22 (recommend [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/installation) installed globally

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd dinhanhthi.com
pnpm install

# 2. Create env file
cp example.env.local .env.local
# Fill in all Notion variables (tokens, database IDs, property keys)
# Set ENV_MODE=dev and NEXT_PUBLIC_ENV_MODE=dev

# 3. Disable telemetry (optional)
pnpm next telemetry disable

# 4. Run dev server
pnpm run dev  # http://localhost:3004
```

### Build locally

```bash
pnpm run build
```

This will:
1. Fetch all content from Notion API
2. Pre-render every page (note, tag, blogs, etc.)
3. Run Pagefind to index HTML and create search index in `public/pagefind/`

Build takes ~15-30 minutes depending on number of posts and Notion API speed.

### Useful commands

```bash
pnpm run dev          # Dev server (port 3004)
pnpm run build        # Full build + Pagefind indexing
pnpm start            # Serve built site (port 3004)
pnpm run lint         # ESLint
pnpm run prettier     # Format code
pnpm run clean        # Remove .next/
pnpm run clean-build  # Clean + build
pnpm run reinstall    # Remove node_modules + reinstall
```

## Deploy to Vercel (First Time Setup)

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → "Add New Project"
2. Import the GitHub repo `dinhanhthi/dinhanhthi.com`
3. **DO NOT click Deploy yet** — we need to configure settings first

### Step 2: Disable Vercel Auto-Build

In the Vercel project:
1. Go to **Settings > General**, scroll down to **Ignored Build Step**
2. Under **Project Settings**, set Behavior to **"Don't build anything"** (Command: `exit 0`)
3. Ensure **Production Overrides** is either empty (inherits from Project Settings) or also set to the same — otherwise production pushes may still trigger Vercel builds

### Step 3: Add Environment Variables to Vercel

In **Settings > Environment Variables**, add ALL variables from `example.env.local`.

For **Production** environment:
```
ENV_MODE=prod
NEXT_PUBLIC_ENV_MODE=prod
```

For **Preview** environment:
```
ENV_MODE=dev
NEXT_PUBLIC_ENV_MODE=dev
```

Variables to add (all required):
- `NOTION_TOKEN`, `NOTION_VERSION`
- `NOTION_API_PUBLISHED`, `NOTION_DB_POSTS`
- `SPACE_ID`, `SOURCE_ID`, `COLLECTION_VIEW_ID`
- All `NEXT_PUBLIC_*` variables (ID_TAGS, ID_SLUG, ID_PUBLISHED, etc.)
- All `TOOLS_*` variables
- All `READING_*` variables
- All `TOPICS_*` variables
- `SUPPORT_ME`
- `NEXT_PUBLIC_GOOGLE_ANALYTICS`

### Step 4: Get Vercel Credentials

```bash
# Install Vercel CLI and link to the project
pnpm add -g vercel
vercel link
# Select the project you just created
```

This creates `.vercel/project.json`. Open it and note:
- `orgId` → you'll need this as `VERCEL_ORG_ID`
- `projectId` → you'll need this as `VERCEL_PROJECT_ID`

Create an API token at [vercel.com/account/tokens](https://vercel.com/account/tokens).

### Step 5: Add GitHub Repository Secrets

Go to the GitHub repo → **Settings** → **Secrets and variables** → **Actions** → "New repository secret":

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel account tokens page |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` |

### Step 6: Push and Deploy

```bash
git push origin main
```

GitHub Actions will automatically:
1. Install dependencies
2. Pull Vercel environment (including all Notion vars you configured)
3. Build the site with `vercel build --prod`
4. Deploy with `vercel deploy --prebuilt --prod`

Monitor progress: repo → **Actions** tab → "Build and Deploy to Vercel"

### Step 7: Verify Deployment

1. Check Vercel dashboard for the deployment URL
2. Browse the site — all pages should load instantly (pre-rendered)
3. Test search (Cmd+K / Ctrl+K) — Pagefind should return results
4. Test a 404 page (e.g., `/note/nonexistent-slug/`)
5. Test OG images (share a link on social media or check `/api/og?title=Test`)

### Step 8: Configure Custom Domain

1. Vercel project → **Settings** → **Domains** → Add `dinhanhthi.com`
2. Vercel provides DNS records (CNAME or A record)
3. Update DNS at your domain provider
4. Wait for DNS propagation (usually < 1 hour)
5. Vercel auto-provisions SSL certificate

### Step 9: Decommission AWS Amplify

After confirming Vercel works with the custom domain:
1. Remove or disable the AWS Amplify app
2. Remove any leftover AWS resources (CloudFront distributions, S3 buckets if applicable)

## Dual Deployment (Prod + Dev)

| Branch | ENV_MODE | Vercel Environment | Content |
|--------|----------|-------------------|---------|
| `main` | `prod` | Production | Published posts only |
| `dev` | `dev` | Preview | All posts (including drafts) |

Both branches are built by the same GitHub Actions workflow. The workflow detects the branch and sets `ENV_MODE` accordingly.

## Build Schedule

GitHub Actions builds automatically:

| Trigger | When | Branch |
|---------|------|--------|
| **Cron** | Every 3 days (`0 0 */3 * *`) | Both `main` and `dev` |
| **Push** | On every push | The pushed branch |
| **Manual** | Anytime via "Run workflow" | Selectable |

### Trigger a manual build

1. Go to repo → **Actions** → "Build and Deploy to Vercel"
2. Click **"Run workflow"**
3. Select the branch
4. Click **"Run workflow"** again

Useful for urgent content updates that can't wait for the next cron build.

## Build Failure Handling

- **GitHub Actions** sends email notification to the repo owner on failure (built-in, no config needed)
- **Vercel** keeps the previous successful deployment live — users are never affected by a failed build
- **Common failure causes**:
  - Notion API rate limiting → build will retry (existing retry logic in `db.ts`), increase timeout if needed
  - Missing environment variables → check Vercel dashboard env vars
  - Notion API downtime → wait and trigger manual build later

## Troubleshooting

### Build succeeds but pages are empty

Notion env vars are not set or incorrect in Vercel dashboard. Check:
```
NOTION_TOKEN, NOTION_API_PUBLISHED, NOTION_DB_POSTS,
SPACE_ID, SOURCE_ID, COLLECTION_VIEW_ID
```

### Pagefind search returns no results

The postbuild Pagefind indexing may not find HTML files. Try changing the postbuild script:
```json
"postbuild": "npx pagefind --site .next/server/app --output-path public/pagefind"
```

### Build times out (> 45 min)

- Notion API may be slow — check [status.notion.so](https://status.notion.so)
- Reduce `staticPageGenerationTimeout` if some pages are hanging
- Check GitHub Actions logs for which page is slow

### OG images not working

The `/api/og` route runs as a Vercel Edge Function. Ensure:
- `src/app/api/og/route.tsx` exists
- `export const runtime = 'edge'` is set
- Vercel Edge Functions are enabled (free tier includes this)

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-vercel.yml` | GitHub Actions build + deploy workflow |
| `vercel.json` | Vercel project configuration |
| `next.config.mjs` | Next.js config (timeout, image settings) |
| `package.json` → `postbuild` | Pagefind indexing script |
| `src/app/note/[slug]/page.tsx` | `generateStaticParams` for notes |
| `src/app/tag/[[...slug]]/page.tsx` | `generateStaticParams` for tags (with pagination) |
| `src/app/(single-page)/blogs/[[...slug]]/page.tsx` | `generateStaticParams` for blogs (with pagination) |
| `src/app/components/nav/NavSearch.tsx` | Pagefind search UI |
| `src/app/api/og/route.tsx` | OG image Edge Function |
