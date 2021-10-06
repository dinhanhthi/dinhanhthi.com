# Changelog

This file contains the detail of changelogs. For **release**, [check this](https://github.com/dinhanhthi/dinhanhthi.com/releases).

## Verion `4`

### `4.8.*`

- 🎉 **New**
  - Add `| Note of Thi` in header title (browser's tab) for pages being not home.
  - Add logos for places in About page.
- 🧰 **Fixes**
  - Fix npm command `sample:watch-opt` and `sample:11ty-opt`.
  - Strange anchor link icon appearing on prod version.
  - Bad logic for npm commands in `package.json`.
  - Heading numbering for headings inside other components.
  - Heading inside other components display in TOC.
  - Overfow math equation on mobile.
- 🎨 **Styling**
  - Change copy block icon.
  - Change alert box style.
  - More border-radius for boxes.
  - Add border-box back to TOC & change its style a little bit like the heading!
  - Improve spacing and styling of some components.
  - Add border for TOC (both in posts and index).
  - Progress bar display in white background also.
- 💪🏻 **Enhancement**
  - Upgrade `markdown-it-anchor` to `8.3.1` (previous `5.2.5`).
  - Create 11ty filter `getTech()` for About pages. Now, we only need the `id` of skills in `techs.json`.

### `4.7.2`

- 🎉 **New**
  - New social icon styling on home page.
  - Github's style for anchor link.
  - Copy button (with effects) for code blocks.
- 🧰 **Fixes**
  - Edit on Github work for sample posts by introducing a variable `editSample` in plugin `optimize-html.js`.
- 💪🏻 **Enhancement**
  - Change Github style anchor link to fontello and reduce the javascript codes.
- 🎨 **Styling**
  - Animation for hide/show box.
  - Color (reduce darkness) of active link in TOC.
  - Animation waving effect for "👋" on index.

### `4.7.1`

- 🎉 **New**
  - Code syntax highlight for both dark/light themes.
  - Scrollbar differ in dark/light themes.
  - Styling numbering of heading h2.
- 🧽 **Cleaning**
  - Remove `purgeCSS` because we don't use CSS frameworks in this project (so there aren't unsed css codes here)
  - Minify `fontello.css`.
  - Move all personal informations (`_data`, images for posts, headers,...) to a separated repo.
  - Private-purpose codes (don't make it be so easy for others to modify). I don't have too much time for generalizing the theme 😞.
  - Separate older versions into different repositories.
  - Clean unused keys in `_data`.
- 💪🏻 **Enhancement**
  - Update to `katex@0.13.18` (previous `0.13.0`).
  - Add more weights to font "Recoleta".
  - Minimize fontello css.
  - Make npm command more understandable.
- 🎨 **Styling**
  - "Ligher" font weight for headings.
  - Smaller overall font-size of several things.
  - Add a warning box and backlink to sample posts.
  - Change a little bit for `<a>` tag's style.
  - Add animation on hover for social icons on home page.

## Version `3`

👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).

## Version `2`

👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).

## Version `1`

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).