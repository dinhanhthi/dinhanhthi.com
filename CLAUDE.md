# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **CMS**: Notion (using custom Notion renderer integrated into the project)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Development Commands

```bash
# Development server (port 3004)
pnpm run dev

# Build
pnpm run build

# Production server (port 3004)
pnpm start

# Linting
pnpm run lint

# Format code
pnpm run prettier

# Clean build artifacts
pnpm run clean

# Full rebuild
pnpm run clean-build

# Reinstall dependencies
pnpm run reinstall
```

## Architecture Overview

### Notion Renderer Components

This project uses a **custom Notion renderer** integrated directly into the codebase (previously a git submodule, now fully migrated):

- **Location**:
  - Components: `src/components/notion/` - React components for rendering Notion blocks
  - Icons: `src/app/icons/` - Custom icon components
  - Utilities: `src/lib/notion/` - Notion-specific helper functions, hooks, context, and database utilities
  - Shared utilities: `src/lib/` - General utilities (config, fetcher, helpers, fonts, utils)
  - Styles: `src/components/notion/styles/` - SCSS styles for Notion rendering
- **Import pattern**:
  - Notion utilities: `@/src/lib/notion/*`
  - General utilities: `@/src/lib/*` (e.g., `@/src/lib/config`, `@/src/lib/utils`)
  - Components: `@/src/app/components/*` or `@/src/app/icons/*`
- **Architecture principle**: All utilities live in `src/lib/`, NOT in `src/app/lib/`

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (single-page)/       # Route group for static pages (about, tools, reading, etc.)
│   ├── api/                 # API routes (og, search-notion)
│   ├── components/          # App-specific React components
│   ├── hooks/               # Custom React hooks
│   ├── icons/               # Icon components
│   ├── note/[slug]/        # Dynamic note pages
│   ├── tag/[[...slug]]/    # Tag pages with optional catch-all
│   └── templates/           # Page templates
├── components/              # Shared components
│   └── notion/             # Notion renderer components
│       ├── post-types/     # Post card component variants
│       └── styles/         # Notion rendering styles
├── lib/                     # All utilities and business logic
│   ├── notion/             # Notion-specific utilities
│   │   ├── context.tsx     # Notion context provider
│   │   ├── db.ts          # Notion database utilities
│   │   ├── helpers.ts     # Notion helper functions
│   │   ├── hooks.ts       # Notion custom hooks
│   │   ├── interface.ts   # TypeScript interfaces
│   │   ├── renderer.tsx   # Main renderer component
│   │   └── ...            # Other Notion utilities
│   ├── config.ts           # Site-wide constants and settings
│   ├── fetcher.ts          # Data fetching utilities
│   ├── helpers.ts          # General helper functions
│   ├── fonts.ts            # Font configurations
│   └── utils.ts            # General utilities (cn, etc.)
├── data/                    # Static data files (menus, skills, topics, etc.)
└── fontello/                # Custom icon fonts
```

### Data Flow & Notion Integration

This site uses **Notion as a headless CMS**. Content is fetched from multiple Notion databases:

- **Posts DB**: Main content (notes/blog posts) with properties like tags, slug, published status, language
- **Tools DB**: Curated tools collection
- **Reading DB**: Books and reading list
- **Topics DB**: Topic taxonomy with icons and metadata

Environment variables (see `example.env.local`) define:

- Notion API credentials (`NOTION_TOKEN`)
- Database IDs and property keys (e.g., `NEXT_PUBLIC_ID_TAGS`, `NEXT_PUBLIC_ID_SLUG`)
- Feature flags (`ENV_MODE`, `NEXT_PUBLIC_ENV_MODE`)

### TypeScript Configuration

- Path alias: `@/*` (root - maps to project root)
- Strict mode enabled with unused variable checks
- Custom type declarations in `src/interface.d.ts` and `src/lib/notion/react-copy-to-clipboard.d.ts`

## Special Scripts

```bash
# Update Notion page cover images
pnpm run ud-cover --pid <page-id>    # Single page
pnpm run ud-cover-all                # All pages

# Update Notion page icons
pnpm run ud-icon --pid <page-id>     # Single page
pnpm run ud-icon-all                 # All pages

# Update images within posts
pnpm run ud-images-post --pid <page-id>

# Update custom icon font
pnpm run ud-fontello
```

## Environment Setup

1. Copy `example.env.local` to `.env.local`
2. Configure Notion credentials and database IDs
3. Set `ENV_MODE=dev` for local development

## Code Style

- ESLint configured with Next.js, React, TypeScript, Tailwind, and Unicorn plugins
- Prettier with import sorting and Tailwind class ordering
- Max line length: 100 characters
- Warnings for unused imports and variables

## Deployment Notes

- Deployed on Vercel with pnpm (automatically detected via `packageManager` field)
- pnpm configuration in `.npmrc` handles peer dependencies and hoisting
- Build script warnings for native packages (sharp, @tailwindcss/oxide) are expected and non-breaking
- Static page generation timeout: 180 seconds
- Preview deployments have `X-Robots-Tag: noindex` header
- Sitemap auto-generated with `next-sitemap` in postbuild step

## Important Constraints

- **Git operations**: NEVER use git commands in this project - user handles all git operations manually
- **Answer in Vietnamese** but keep the code and terminology in English.
<!-- - **Always run `pnpm run build`** to make sure the modifications are good to go -->
