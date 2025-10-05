# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v3
- **CMS**: Notion (using custom [notion-x](https://github.com/dinhanhthi/notion-x) submodule)
- **Language**: TypeScript
- **Package Manager**: Yarn v4 (Plug'n'Play mode)
- **Deployment**: Vercel

## Development Commands

```bash
# Development server (port 3004)
yarn dev

# Build
yarn build

# Production server (port 3004)
yarn start

# Linting
yarn lint

# Format code
yarn prettier

# Clean build artifacts
yarn clean

# Full rebuild
yarn clean-build

# Reinstall dependencies
yarn reinstall

# Update notion-x submodule
yarn getlib
# or: git submodule update --recursive --remote
```

## Architecture Overview

### notion-x Submodule

This project uses a **custom fork of react-notion-x as a Git submodule** located in `/notion-x`. This is a custom Notion renderer with project-specific modifications.

- **Key principle**: Modify notion-x components directly in this repo, but DO NOT commit them to the submodule
- To discard changes: `cd notion-x && git checkout <file-path>`
- The submodule must be initialized on first clone: `git submodule update --init --recursive`
- Components from notion-x are imported using the `@notion-x/*` alias
- Tailwind must scan notion-x files: `./notion-x/**/*.{js,ts,jsx,tsx,mdx,css,scss}`

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (single-page)/       # Route group for static pages (about, tools, reading, etc.)
│   ├── api/                 # API routes (og, search-notion)
│   ├── components/          # Shared React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configuration
│   │   ├── config.ts       # Site-wide constants and settings
│   │   ├── fetcher.ts      # Data fetching utilities
│   │   ├── helpers.ts      # Helper functions
│   │   ├── fonts.ts        # Font configurations
│   │   └── utils.ts        # General utilities
│   ├── note/[slug]/        # Dynamic note pages
│   ├── tag/[[...slug]]/    # Tag pages with optional catch-all
│   └── templates/           # Page templates
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
- Notion API credentials (`NOTION_TOKEN`, `NOTION_TOKEN_V2`, `NOTION_ACTIVE_USER`)
- Database IDs and property keys (e.g., `NEXT_PUBLIC_ID_TAGS`, `NEXT_PUBLIC_ID_SLUG`)
- Feature flags (`ENV_MODE`, `NEXT_PUBLIC_ENV_MODE`)

### TypeScript Configuration

- Path aliases: `@/*` (root), `@notion-x/*` (submodule)
- Strict mode enabled with unused variable checks
- Custom type declarations in `src/interface.d.ts` and `src/react-copy-to-clipboard.d.ts`

## Special Scripts

```bash
# Update Notion page cover images
yarn ud-cover --pid <page-id>       # Single page
yarn ud-cover-all                   # All pages

# Update Notion page icons
yarn ud-icon --pid <page-id>        # Single page
yarn ud-icon-all                    # All pages

# Update images within posts
yarn ud-images-post --pid <page-id>

# Update custom icon font
yarn ud-fontello
```

## Environment Setup

1. Copy `example.env.local` to `.env.local`
2. Configure Notion credentials and database IDs
3. Set `ENV_MODE=dev` for local development
4. Update `NOTION_TOKEN_V2` if search functionality breaks

## Code Style

- ESLint configured with Next.js, React, TypeScript, Tailwind, and Unicorn plugins
- Prettier with import sorting and Tailwind class ordering
- Max line length: 100 characters
- Warnings for unused imports and variables

## Deployment Notes

- Deployed on Vercel with [corepack enabled](https://vercel.com/docs/deployments/configure-a-build#corepack) for Yarn v4
- Static page generation timeout: 180 seconds
- Preview deployments have `X-Robots-Tag: noindex` header
- Sitemap auto-generated with `next-sitemap` in postbuild step

## Important Constraints

- **Branch merging with submodule**: If notion-x has changes, cannot merge between branches normally - must force reset one branch to another
- **VSCode Yarn PnP setup**: Follow [official guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) for editor SDK support
- **Search issues**: Usually caused by expired `NOTION_TOKEN_V2` - update and redeploy
