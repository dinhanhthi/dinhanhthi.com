# dinhanhthi.com

Next.js 15+ 🤝 Tailwind CSS v4 🤝 pnpm 🤝 Notion as CMS 🤝 Custom Notion Renderer 🤝 Redis Cache (Upstash).

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

# build
pnpm run build
# If you have .env.production.local, it will be used for production build
# Use below to get the latest .env.production.local
vercel env pull .env.production.local --environment=production

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

# cache management (requires Redis setup)
pnpm run warm-cache         				# Populate Redis cache
pnpm run warm-cache --force 				# Force refresh cache (get latest data from Notion API)
pnpm run warm-cache --home --force 	# Force refresh cache for home page
# There are other options: --notes, --tags, --tools, --single
pnpm run clear-cache --all  				# Clear all cache
```

## Redis Cache Setup

This project uses **[Upstash Redis](https://upstash.com/)** with **Refresh-Ahead Pattern** for caching Notion API responses (Disable it with `DISABLE_REDIS_CACHE="false"`). It makes sure that users always reach the content even when there are errors fetching from Notion API. **Cache Strategy**:

- **Soft TTL**: When to refresh cache (background, non-blocking). The content will be updated when this time passes.
- **Hard TTL**: When Redis deletes cache (X days = safety net). The content on the site wil always be alive within this time. We have TTL time to fix the problem with Notion API.

```bash
UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Optional: Disable Redis cache completely (useful for testing/development)
DISABLE_REDIS_CACHE="false"

DISABLE_REDIS_CACHE="your-deploy-hook-secret"
```

**Remark**: On Vercel, there is a deploy hook (need variable `DEPLOY_HOOK_SECRET`) to automatically run the things in `warm-cache` after each successfull deployment. You also need to add these variables in the Github Repository Secrets: `SITE_URL` (`https://dinhanhthi.com` for example) and `DEPLOY_HOOK_SECRET`

**Useful commands**:

```bash
pnpm run warm-cache         				# Populate Redis cache
pnpm run warm-cache --force 				# Force refresh cache (get latest data from Notion API)
pnpm run warm-cache --home --force 	# Force refresh cache for home page 
# There are other options: --notes, --tags, --tools, --single
pnpm run clear-cache --all  				# Clear all cache
pnpm run warm-cache --slug=my-note-slug           # Warm single note by slug
pnpm run warm-cache --slug=my-note-slug --force   # Force refresh single note
```

## Error Email Notifications (Resend)

This project uses **Resend** for email notifications when Notion API errors occur (Disable it with `DISABLE_ERROR_EMAILS="false"`).

```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="your-email@domain.com"

# Optional: Enable error emails in dev (default: disabled)
SEND_ERROR_EMAILS_IN_DEV="false"

# Optional: Disable error emails completely (overrides all other settings)
DISABLE_ERROR_EMAILS="false"
```

## Vercel Setup

The project uses pnpm as the package manager. Vercel automatically detects this via the `packageManager` field in `package.json`. No additional configuration needed.

You have to add `ENABLE_EXPERIMENTAL_COREPACK` to `1` on Vercel.

```bash
vercel dev # like pnpm run dev

vercel build

vercel build --prod

# preview only
vercel deploy

# production
vercel --prod
```
