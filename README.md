# dinhanhthi.com

Next.js 15+ 🤝 Tailwind CSS v4 🤝 pnpm 🤝 Notion as CMS 🤝 Custom Notion Renderer 🤝 Pagefind Search 🤝 Vercel + GitHub Actions.

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
- **Deploy**: Vercel — deployed via GitHub Actions (not Vercel's auto-build)
- **Schedule**: GitHub Actions cron builds every 3 days to pull latest Notion content
- **OG Images**: `/api/og` Edge Function on Vercel (free, no server needed)

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

1. **GitHub Actions** builds the site on a schedule (every 3 days) or on push to `main`/`dev`
2. During build, Next.js calls Notion API to fetch all content and pre-render every page
3. Pagefind indexes the generated HTML to create a client-side search index
4. The pre-built output is deployed to Vercel via `vercel deploy --prebuilt`
5. If build fails, GitHub sends email notification and Vercel keeps the previous deployment

### Setup Vercel + GitHub Actions

1. **Create Vercel project**: Go to [vercel.com](https://vercel.com), import repo, link to your GitHub repo
2. **Disable auto-build**: In Vercel project settings > Git, disable "Auto Deploy" (builds happen via GitHub Actions, not Vercel)
3. **Get Vercel credentials**: Run `vercel link` locally to create `.vercel/project.json`, then note `orgId` and `projectId`
4. **Create Vercel token**: Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) and create a token
5. **Add Notion env vars to Vercel**: In Vercel project > Settings > Environment Variables, add ALL variables from `example.env.local` (Notion tokens, database IDs, property keys, etc.)
   - For **Production** environment: set `ENV_MODE=prod` and `NEXT_PUBLIC_ENV_MODE=prod`
   - For **Preview** environment: set `ENV_MODE=dev` and `NEXT_PUBLIC_ENV_MODE=dev`
6. **Add GitHub secrets**: In repo Settings > Secrets and variables > Actions, add:
   - `VERCEL_TOKEN` — from step 4
   - `VERCEL_ORG_ID` — from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — from `.vercel/project.json`
7. **Push to main** — GitHub Actions will build and deploy automatically

### Dual deployment (prod + dev)

- `main` branch → production deployment (`ENV_MODE=prod`, only published posts)
- `dev` branch → preview deployment (`ENV_MODE=dev`, all posts including drafts)

### Manual deploy

Trigger a manual build from GitHub Actions > "Build and Deploy to Vercel" > "Run workflow".

### Local build test

```bash
# Set ENV_MODE in .env.local, then:
pnpm run build

# Check build output — you should see all pages being generated
# Pagefind index will be created in public/pagefind/
```
