# Changelog

This file contains the detail of changelogs. For **release**, [check this](https://github.com/dinhanhthi/dinhanhthi.com/releases).

## Verion `3`

### `3.7.0`

1. Remove `purgeCSS` because we don't use CSS frameworks in this project (so there aren't unsed css codes here).
2. Minify `fontello.css`.
3. Update to `katex@0.13.18` (previous `0.13.0`).

### `3.6.2` ([source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v3.6.2))

- The same as `3.6.1`, created for the very new branch `dev` (after cleaning up).

### `3.6.1` (tag has been removed)

- **Update**:
  - Add angular category (personal purpose).
  - Update `eleventy-plugin-syntaxhighlight` and `node-sass` to the newest version.
  - ⚙ Changing from `metadata.json` to `settings.json`. From here, whenever we have some setting variables for my site, we put them in `_data/settings.json` file.
  - 🎉 Add toggle draft/private/outside posts button on index and tag pages. The default setting can be changed in `_data/settings.json` with field `hideDraftPostsByDefault`.
  - Add option in `package.json` to run locally with full of posts.
- **Fixes**:
  - Fix commands for serving and watching the site locally.
  - Fix commands for generating `main.css` (watching it and adding path comments).
  - Fix position of toc on index.
- **Changes**:
  - Aligning TOC on index (a little bit).
  - Move `postslists` to `/components/`.

### `3.5.2` (tag has been removed)

- Cleaning.
- **Fixes**:
  - Wrong display TOC on index.
  - Fix "Invalid Date" in post and replace a new way to display the last modifed date.

### `3.5.1` (tag has been removed)

1. Remove unnecessary image files from `/src/img/` and keep only the files (and directories) which are used in `sample_posts/`'s posts.
2. Change static images url (ones used by the theme, not the posts) to `img_src` (before is `img`). You can check this in `.eleventy.js`.
3. Create this changelog.
4. (For me only) Default built directory is back to `_site` and change output directory of `local:watch` to `_built`.
5. **Fix**: flash load if using animation => removing all transition for background!

## Version `2` ([source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v2.0))

👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v2-jekyll).

## Version `1` ([source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v1.0))

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v1-jekyll).

## Version `0` ([source](https://github.com/dinhanhthi/dinhanhthi.com/releases/tag/v0.0))

👉 Version 0 (Jekyll): [v0.dinhanhthi.com](https://v0.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v0-jekyll).