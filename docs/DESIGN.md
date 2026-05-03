# Design System — dinhanhthi.com

**Style**: Minimalist Dark-First with micro-interactions — personal blog aesthetic, high confidence

---

## Colors

### Light Mode
| Token | Value | Usage |
|---|---|---|
| `--bg-color` | `white` | Content area background |
| Page outer | `bg-stone-100` | Body/layout background |
| `--bg-button-color` | `slate-200` | Button/badge backgrounds |
| `--bg-hover-color` | `slate-100` | Hover states |
| `--border-muted-color` | `slate-200` | Borders, dividers |
| `--text-color` | `slate-800` | Body text |
| `--text-heading-color` | `slate-700` | Headings |
| `--muted-color` | `slate-500` | Muted/secondary text |
| `--link-color` | `#0080f8` | Links |
| `--link-hover-color` | `pink-600` | Link hover |

### Dark Mode
| Token | Value | Usage |
|---|---|---|
| `--bg-color` | `#2a2d38` | Content area background |
| Page outer | `#23262e` | Body/layout background |
| Nav/footer/header | `#323541` | Always dark (not theme-dependent) |
| `--bg-button-color` | `#23262e` | Button backgrounds |
| `--bg-hover-color` | `#31353f` | Hover states |
| `--border-muted-color` | `#a0a0a01c` | Very subtle borders |
| `--text-color` | `slate-50` | Body text |
| `--text-prose-color` | `slate-300` | Prose/article text |
| `--muted-color` | `slate-400` | Muted text |
| `--link-color` | `#58adfb` | Links |
| `--link-hover-color` | `pink-300` | Link hover |
| Code bg | `#343e4c` | Code blocks |
| Code text | `#ff9293` | Inline code text (pinkish) |

### Accent & Semantic
- **Reading progress bar**: `#ffa541` (warm orange)
- **Rainbow gradient text** (site signature): `from-violet-400 via-pink-400 to-red-300`
- **Semantic colors**: green, yellow, blue, purple, pink, red (mapped from Notion palette)
- **Wave colors**: extensive palette for animated wave cards (11 colors per mode)

---

## Typography

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display/Page titles | `Recoleta` | 500, 600 | Custom serif-display, loaded via @font-face |
| Body | `Open Sans` | 400, 600 | Google Font, CSS var `--font-open-sans` |
| UI/Section headings | `Quicksand` | 600 | Google Font, CSS var `--font-quicksand` |
| Code/mono | System mono | — | Menlo, Monaco, Consolas |

**Size scale:**
- Base: 16px
- `h1` (prose): 1.55rem (mobile: 1.45rem)
- `h2` (prose): 1.45rem (mobile: 1.3rem)
- `h3` (prose): 1.35rem (mobile: 1.2rem)
- Section heading (HeadingPage): 1.5rem, `font-medium`
- Nav brand: `text-lg text-white`
- Badge/meta: `text-xs` to `text-sm`

**Letter spacing:** `--letter-spacing-tighter: -0.04em` (display headings)
**Line height:** `--line-height-tight: 1.2`

---

## Spacing

Base unit: **8px** (Tailwind `gap-2 = 0.5rem`)

Common patterns:
- Section gap (home page): `gap-12` (3rem)
- Card internal: `gap-4` (1rem)
- Inline items: `gap-2` / `gap-3`
- Container padding: `px-5`
- Hero padding: `py-10`

---

## Shape & Shadow

**Border radius:**
- Default cards/sections: `rounded-lg` (0.5rem — `--radius`)
- Badges, chips, tags: `rounded-full`
- Post wave cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` consistently

**Shadows:**
- `shadow-small`: `0 5px 10px rgba(0,0,0,0.12)`
- `shadow-medium`: `0 8px 30px rgba(0,0,0,0.12)`
- Post wave card: `8px 14px 38px #272c310f, 1px 3px 8px #272c3108`

---

## Motion

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| `fadeIn` | 500ms | linear | Page load |
| `wave` | 2s | linear | Hand wave emoji |
| `toTop` | 300ms | ease | Bounce up effect |
| Dialog show/hide | 200ms | `cubic-bezier(0.16,1,0.3,1)` | Modal open/close |
| Hover translate | — | ease | `hover:-translate-y-0.5` on topic chips/cards |
| Nav progress bar | CSS translate | — | Scroll position |
| Nav loading | 150ms | ease-out | Route change overlay |

Standard transition: `transition duration-200 ease-in-out`

---

## Layout

**Container:** `container mx-auto px-5 xl:max-w-6xl`

**Grids:**
- Books/tools: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`
- Topics (flex wrap): `flex flex-wrap gap-4`

**Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

---

## Component Patterns

### Buttons (shadcn/ui-style, cva)
- Base: `inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium`
- Variants: `default` (dark bg), `outline` (border only), `secondary` (slate bg), `ghost` (no bg), `link` (underline), `icon`/`iconBig`
- Sizes: `xs` (h-7), `sm` (h-9), `default` (h-10), `lg` (h-11)

### Badges/Chips
- Base: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium`
- Variants: `default`, `secondary` (uses `bg-bg-button`), `destructive`, `outline`

### Section/Card wrapper
```
border-border-muted bg-bg overflow-hidden rounded-lg border
```
(defined as `sectionOuterClass` in `src/lib/config.ts:31`)

### Post list container
```
divide-border-muted flex flex-col divide-y overflow-hidden + sectionOuterClass
```

### Topic chips (simple)
```
flex items-center gap-1 px-4 py-2 + sectionOuterClass + hover:-translate-y-0.5 transition duration-200
```

### Nav
- Sticky top-0, `h-14`, `bg-nav-dark-bg (#323541)`, `text-gray-300`
- Orange reading progress bar (`#ffa541`) at bottom, 3px height
- Always dark regardless of user theme

### Hero header (`Header.tsx`)
- `data-theme="dark"` forced — always renders in dark mode
- bg `#2A2D38`, padded `py-10`, white text children

### Footer
- Same dark bg as nav (`bg-nav-dark-bg`), `text-gray-300`

### Scrollbar
- Custom class `.thi-scrollbar`: 10px wide, `#aab5c9b0` thumb, transparent track

---

## Dark/Light Mode Implementation

- **Method**: `data-theme` attribute (NOT `class="dark"`)
- **Selector**: `[data-theme=dark]` in CSS
- **Provider**: `ThemeProvider` with `attribute="data-theme"`, `defaultTheme="dark"`
- **Key constraint**: Nav, Footer, and Hero header are ALWAYS dark, regardless of user preference
- **CSS vars**: All semantic colors defined as CSS custom properties, overridden in `[data-theme='dark']`

---

## Tech Stack Notes

- **CSS framework**: Tailwind CSS v4 (`@import 'tailwindcss'`)
- **Component system**: shadcn/ui-style (cva + `class-variance-authority` + `@radix-ui`)
- **Icons**: `lucide-react`
- **Code highlighting**: `prism-tomorrow.css` (dark theme)
- **Math**: KaTeX
- **Utility**: `classnames` (cn) for class merging, also `@/src/lib/utils` `cn`
- **Notion colors**: Full Notion background/text color palette mapped to Tailwind

---

## Signature Patterns

1. **Rainbow gradient heading**: `.thi-text-rainbow` — `bg-gradient-to-r from-violet-400 via-pink-400 to-red-300 bg-clip-text text-transparent`
2. **Post wave cards**: Custom animated wave at card bottom, colorful per-tag
3. **Always-dark chrome**: Nav + footer + hero always dark, creates strong visual framing
4. **Skeleton loading states**: Every component has `Skeleton*` variant with `animate-pulse`
5. **Recoleta headings**: Display font for page/section titles gives distinctive character
