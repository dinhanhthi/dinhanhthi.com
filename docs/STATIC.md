# Deployment Guide: GitHub Pages + GitHub Actions

## Architecture

```
Notion (CMS) ── build time ──> Next.js static export (out/) ── deploy ──> GitHub Pages
                                    │
                          GitHub Actions (daily cron)
```

- All pages pre-rendered at build time (`generateStaticParams` + `dynamicParams: false`)
- `next.config.mjs` uses `output: 'export'` (+ `images.unoptimized: true`), build output is `out/`
- No Redis, no runtime Notion API calls for page rendering
- Search: Pagefind indexes HTML at build time, runs client-side
- OG images: every page uses the static `/og-image.jpg` (via `getOgImage()` in `src/lib/helpers.ts`)
- Build failure: GitHub sends email, the previous GitHub Pages deployment stays live

The site moved from Vercel to GitHub Pages.

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
2. Pre-render every page (note, tag, blogs, etc.) and export the static site to `out/`
3. Run Pagefind to index HTML and create search index in `out/pagefind/`

Build takes ~15-30 minutes depending on number of posts and Notion API speed.

Preview the exported site locally:

```bash
pnpm run build && pnpm start  # serves out/ on http://localhost:3004
```

### Useful commands

```bash
pnpm run dev          # Dev server (port 3004)
pnpm run build        # Full build + Pagefind indexing
pnpm start            # Serve the exported out/ (port 3004)
pnpm run lint         # ESLint
pnpm run prettier     # Format code
pnpm run clean        # Remove .next/ and out/
pnpm run clean-build  # Clean + build
pnpm run reinstall    # Remove node_modules + reinstall
```

## Deploy to GitHub Pages (First Time Setup)

### Step 1: Add the `ENV_FILE` secret

The workflow uses ONE secret, `ENV_FILE`: the full content of the production `.env.local`. It must
contain `NEXT_PUBLIC_SITE_DOMAIN=https://dinhanhthi.com`.
CI writes it to `.env.local` before the build. `ENV_MODE` / `NEXT_PUBLIC_ENV_MODE` are set by the
workflow (`prod` on `main`, `dev` otherwise), so they don't need to be in the secret.

```bash
gh secret set ENV_FILE < .env.production.local
```

### Step 2: Set the Pages source to GitHub Actions

Repo → **Settings** → **Pages** → **Source**: "GitHub Actions", or:

```bash
gh api -X POST repos/dinhanhthi/dinhanhthi.com/pages -f build_type=workflow
```

### Step 3: Configure the custom domain

Set it via the API (a `CNAME` file is ignored for Actions deploys):

```bash
gh api -X PUT repos/dinhanhthi/dinhanhthi.com/pages -f cname=dinhanhthi.com
```

Cloudflare DNS (DNS only, not proxied):

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `dinhanhthi.github.io` |

Then enable **Enforce HTTPS** in Settings → Pages.

### Step 4: First deploy

```bash
git push origin main
```

GitHub Actions will automatically:
1. Install dependencies
2. Write the `ENV_FILE` secret to `.env.local`
3. Build the site with `pnpm run build` (static export to `out/` + Pagefind)
4. Upload `out/` as the Pages artifact and deploy it to GitHub Pages

Monitor progress: repo → **Actions** tab → "Build and Deploy to GitHub Pages"

### Step 5: Verify Deployment

1. Browse the site — all pages should load instantly (pre-rendered)
2. Test search (Cmd+K / Ctrl+K) — Pagefind should return results
3. Test a 404 page (e.g., `/note/nonexistent-slug/`)
4. Test OG images (share a link on social media or open `/og-image.jpg`)

## Branches

| Branch | ENV_MODE | What happens |
|--------|----------|--------------|
| `main` | `prod` | Build + deploy to GitHub Pages (published posts only) |
| `dev` | `dev` | Build only, no deploy (checks that the export still works) |

GitHub Pages has one site per repo, so there is no dev site. Preview drafts locally with
`ENV_MODE=dev`.

## Build Schedule

GitHub Actions builds automatically:

| Trigger | When | Branch |
|---------|------|--------|
| **Cron** | Daily (`0 0 * * *`) | `main` (default branch) → deploy |
| **Push** | On every push | `main` → deploy, `dev` → build only |
| **Manual** | Anytime via "Run workflow" | Selectable (deploys only on `main`) |

Scheduled workflows get disabled after 60 days without repo activity. Re-enable them in the
**Actions** tab.

### Trigger a manual build

1. Go to repo → **Actions** → "Build and Deploy to GitHub Pages"
2. Click **"Run workflow"**
3. Select the branch
4. Click **"Run workflow"** again

Useful for urgent content updates that can't wait for the next cron build.

### No `.next/cache` in CI

The workflow deliberately does NOT cache `.next/cache`. With `output: 'export'`, every Notion fetch
goes through Next's data cache, so a restored cache would rebuild stale Notion content. Locally, a
stale cache entry can break a build too: `pnpm run clean-build` fixes it.

## Build Failure Handling

- **GitHub Actions** sends email notification to the repo owner on failure (built-in, no config needed)
- **GitHub Pages** keeps the previous successful deployment live — users are never affected by a failed build
- **Common failure causes**:
  - Notion API rate limiting → build will retry (existing retry logic in `db.ts`), increase timeout if needed
  - Missing environment variables → check the `ENV_FILE` secret
  - Notion API downtime → wait and trigger manual build later

## Limits

- Published site ≤ 1 GB (currently ~170 MB, the workflow prints `du -sh out`)
- ~100 GB/month bandwidth (soft limit)

## Troubleshooting

### Build succeeds but pages are empty

Notion env vars are missing or incorrect in the `ENV_FILE` secret. Check:
```
NOTION_TOKEN, NOTION_API_PUBLISHED, NOTION_DB_POSTS,
SPACE_ID, SOURCE_ID, COLLECTION_VIEW_ID
```

### Build shows stale Notion content (or fails locally after content changes)

A stale `.next/cache` entry is being reused. Run `pnpm run clean-build`.

### Pagefind search returns no results

Check that `out/pagefind/` exists after the build. The postbuild script must index the exported
site:
```json
"postbuild": "npx pagefind --site out --output-path out/pagefind"
```

### Build times out (> 60 min)

- Notion API may be slow — check [status.notion.so](https://status.notion.so)
- Reduce `staticPageGenerationTimeout` if some pages are hanging
- Check GitHub Actions logs for which page is slow

### Custom domain or HTTPS not working

- Check the custom domain in Settings → Pages (set via `gh api ... -f cname=dinhanhthi.com`)
- Check the Cloudflare records are DNS only (not proxied) and match the table above
- Check that **Enforce HTTPS** is enabled in Settings → Pages

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-pages.yml` | GitHub Actions build + deploy workflow |
| `next.config.mjs` | Next.js config (`output: 'export'`, timeout, image settings) |
| `package.json` → `postbuild` | Pagefind indexing script |
| `public/og-image.jpg` | Static OG image used by every page |
| `src/app/note/[slug]/page.tsx` | `generateStaticParams` for notes |
| `src/app/tag/[[...slug]]/page.tsx` | `generateStaticParams` for tags (with pagination) |
| `src/app/(single-page)/blogs/[[...slug]]/page.tsx` | `generateStaticParams` for blogs (with pagination) |
| `src/app/components/nav/NavSearch.tsx` | Pagefind search UI |
