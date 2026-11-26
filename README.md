# dinhanhthi.com

Next.js 15+ 🤝 Tailwind CSS v4 🤝 pnpm 🤝 Notion as CMS 🤝 Custom Notion Renderer 🤝 Pagefind Search 🤝 GitHub Pages + GitHub Actions.

🎉 You can read [this post](https://dinhanhthi.com/note/how-i-create-this-site/) to understand the ideas behind and create your own a site like mine.

🎊 What's new in v7? Check [this post](https://dinhanhthi.com/note/this-site-gets-updates).

🧡 If what I do is helpful to you for some reason, please consider [supporting me](https://dinhanhthi.com/note/support-thi/). Thank you!

## Previous versions

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).<br />
👉 Version 4 (Gatsby, canceled at 60%): [demo of what I did](https://v4.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby).<br />
👉 Version 5 (11ty): [v5.dinhanhthi.com](https://v5.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v5).<br />
👉 Version 6 (use separated [notion-x](https://github.com/dinhanhthi/notion-x) repo): [source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v6.8.0).

## Architecture

- **CMS**: Notion — all content lives in Notion databases
- **Build**: All pages pre-rendered at build time via `generateStaticParams` (full SSG)
- **Search**: [Pagefind](https://pagefind.app/) — client-side search, indexes HTML at build time
- **Deploy**: GitHub Pages — static export (`output: 'export'`, `out/`) deployed via GitHub Actions
- **Schedule**: GitHub Actions cron builds daily to pull latest Notion content
- **OG Images**: static `/og-image.jpg` for every page

## Dev

You have to install **globally** [Nodejs >=22](https://nodejs.org/en) (recommend using [nvm](https://github.com/nvm-sh/nvm)) and [`pnpm`](https://pnpm.io/installation) first. Then

```bash
# Copy and fill all variables (1st time only)
cp example.env.local .env.local

# install (1st time only)
pnpm install

# Turn off being collected data via Telemetry program
# https://nextjs.org/telemetry
pnpm next telemetry disable

# dev
pnpm run dev # port 3004

# build (includes Pagefind indexing via postbuild)
pnpm run build

# serve (need to build first)
pnpm start # port 3004

# reinstall all
pnpm run reinstall

# clean
pnpm run clean

# prettier
pnpm run prettier

# clear pnpm cache (helpful sometimes)
pnpm store prune
```

## Deployment

### How it works

1. **GitHub Actions** (`.github/workflows/deploy-pages.yml`) builds the site daily (cron) or on push to `main`/`dev`
2. During build, Next.js calls Notion API to fetch all content and exports every page as static HTML to `out/`
3. Pagefind indexes the generated HTML to create a client-side search index
4. On `main`, `out/` is deployed to GitHub Pages
5. If build fails, GitHub sends email notification and the previous Pages deployment stays live

### Setup GitHub Pages + GitHub Actions

1. **Add the `ENV_FILE` secret**: the full production `.env.local` content (must contain `NEXT_PUBLIC_SITE_DOMAIN=https://dinhanhthi.com`): `gh secret set ENV_FILE < .env.production.local`. `ENV_MODE`/`NEXT_PUBLIC_ENV_MODE` are set by the workflow.
2. **Pages source**: Settings > Pages > Source "GitHub Actions" (or `gh api -X POST repos/dinhanhthi/dinhanhthi.com/pages -f build_type=workflow`)
3. **Custom domain**: `gh api -X PUT repos/dinhanhthi/dinhanhthi.com/pages -f cname=dinhanhthi.com` (a `CNAME` file is ignored for Actions deploys), then DNS (Cloudflare, DNS only): apex `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` `CNAME` → `dinhanhthi.github.io`. Then enforce HTTPS.
4. **Push to main** — GitHub Actions will build and deploy automatically

See [docs/STATIC.md](docs/STATIC.md) for details.

### Branches

- `main` branch → build + deploy to GitHub Pages (`ENV_MODE=prod`, only published posts)
- `dev` branch → build only, no deploy (`ENV_MODE=dev`); GitHub Pages has one site per repo

### Manual deploy

Trigger a manual build from GitHub Actions > "Build and Deploy to GitHub Pages" > "Run workflow".

### Local build test

```bash
# Set ENV_MODE in .env.local, then:
pnpm run build

# Check build output — you should see all pages being generated
# Pagefind index will be created in out/pagefind/
```
