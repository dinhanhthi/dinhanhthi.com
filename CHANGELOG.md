# Changelog

This file contains the detail of changelogs. For **release**, [check this](https://github.com/dinhanhthi/dinhanhthi.com/releases).

## Verion `4`

### `4.6.2`

- The same as `4.6.1`, created for the very new branch `dev` (after cleaning up).

### `4.6.1`

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

### `4.5.2`

- Cleaning.
- **Fixes**:
  - Wrong display TOC on index.
  - Fix "Invalid Date" in post and replace a new way to display the last modifed date.

### `4.5.1`

1. Remove unnecessary image files from `/src/img/` and keep only the files (and directories) which are used in `sample_posts/`'s posts.
2. Change static images url (ones used by the theme, not the posts) to `img_src` (before is `img`). You can check this in `.eleventy.js`.
3. Create this changelog.
4. (For me only) Default built directory is back to `_site` and change output directory of `local:watch` to `_built`.
5. **Fix**: flash load if using animation => removing all transition for background!