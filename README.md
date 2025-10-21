# dinhanhthi.com

Next.js 15+ 🤝 Tailwind CSS v4 🤝 pnpm 🤝 Notion as CMS 🤝 Custom Notion Renderer 🤝 Redis Cache (Upstash).

🎉 You can read [this post](https://dinhanhthi.com/note/how-i-create-this-site/) to understand the ideas behind and create your own a site like mine.

🎊 What's new in v7?

🧡 If what I do is helpful to you for some reason, please consider [supporting me](https://dinhanhthi.com/support-me/). Thank you!

## Previous versions

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).<br />
👉 Version 4 (Gatsby, canceled at 60%): [demo of what I did](https://v4.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby).<br />
👉 Version 5 (11ty): [v5.dinhanhthi.com](https://v5.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v5).<br />
👉 Version 6 (use separated [notion-x](https://github.com/dinhanhthi/notion-x) repo): [source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v6.8.0).

## Redis Cache Setup

This project uses **Upstash Redis** with **Refresh-Ahead Pattern** for caching Notion API responses:
- ✅ Users always see content instantly (even when Notion API fails)
- ✅ Stale cache served immediately while refreshing in background
- ✅ 14-day safety net (cache persists during long outages)
- ✅ Reduced API calls and costs
- ✅ Error logging for monitoring (errors hidden from users)

**Cache Strategy**:
- **Soft TTL**: When to refresh cache (background, non-blocking)
- **Hard TTL**: When Redis deletes cache (14 days = safety net)

**TL;DR**:
1. Sign up at [Upstash Console](https://console.upstash.com/) (free tier available)
2. Create a Redis database
3. Add credentials to `.env.local`:
   ```bash
   UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your-token"
   SKIP_REDIS_CACHE_IN_DEV="true" # Skip Redis cache in development to save quota
   ```
4. For production: Add same credentials to Vercel Environment Variables

**Note**: Redis is optional. Without it, the site works normally but without caching.

## Dev

🚨 You have to install **globally** [Nodejs >=20](https://nodejs.org/en) (recommend using [nvm](https://github.com/nvm-sh/nvm)) first.

```bash
# install
pnpm install

# dev
pnpm run dev # port 3004

# build
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

# cache management (requires Redis setup)
pnpm run warm-cache        # Populate Redis cache
pnpm run clear-cache --all # Clear all cache
```

## Vercel

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