# Static Export Guide

This project uses `output: 'export'` in `next.config.mjs` to generate a fully static HTML site. The build output is in the `out/` directory.

## How it works

1. `pnpm run build` runs `next build` which pre-renders all pages to static HTML in `out/`
2. `postbuild` script runs Pagefind to index `out/` and create search index in `out/pagefind/`
3. The `out/` directory contains everything needed for deployment — HTML, CSS, JS, images, search index

## Build locally

```bash
# Full build (clean + build + pagefind indexing)
pnpm run clean-build

# Or just build (incremental)
pnpm run build

# Preview the static site locally
pnpm start
# → http://localhost:3004
```

## Deploy to Vercel (via GitHub Actions)

The current workflow (`.github/workflows/deploy-vercel.yml`) builds and deploys automatically:

- **Trigger**: push to `main`/`dev`, cron every 3 days, or manual `workflow_dispatch`
- **Flow**: GitHub Actions builds → `vercel deploy --prebuilt` pushes the `out/` to Vercel

### Required GitHub Secrets

- `VERCEL_TOKEN` — Vercel API token
- `VERCEL_ORG_ID` — from `.vercel/project.json`
- `VERCEL_PROJECT_ID` — from `.vercel/project.json`
- All Notion env vars configured in Vercel project's Environment Variables

## Deploy to GitHub Pages

You can also deploy to GitHub Pages since the output is pure static HTML.

### Option 1: Manual push

```bash
# Build locally
pnpm run clean-build

# The out/ directory is ready to deploy
# Push it to a gh-pages branch or use any static host
```

### Option 2: GitHub Actions workflow

Create `.github/workflows/deploy-github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 */3 * *'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        env:
          ENV_MODE: prod
          NEXT_PUBLIC_ENV_MODE: prod
          # Add all required Notion env vars here or use secrets
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          # ... other Notion env vars
        run: pnpm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option 3: Deploy anywhere

Since `out/` is pure static HTML, you can deploy it to any static host:

```bash
# Netlify
npx netlify deploy --dir=out --prod

# Cloudflare Pages
npx wrangler pages deploy out

# AWS S3
aws s3 sync out/ s3://your-bucket --delete

# Or just copy the out/ folder to any web server
```

## What changed from dynamic to static export

| Feature | Before | After |
|---------|--------|-------|
| Build output | `.next/` (server + static) | `out/` (pure static HTML) |
| OG images | `/api/og` Edge Function | Default static image |
| Redirects | `redirect()` in pages | Removed (404 for invalid URLs) |
| Image optimization | Server-side | `unoptimized: true` (client-side) |
| Pagefind index | `.next` → `public/pagefind` | `out` → `out/pagefind` |
| Preview | `next start` | `npx serve out` |

## Limitations

- No server-side features at runtime (API routes, middleware, ISR)
- No dynamic OG images (uses default static image)
- Images are not optimized server-side (loaded as-is)
- Content updates require a full rebuild
