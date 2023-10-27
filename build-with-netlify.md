# In case building with netlify?

1. Check [this commit](https://github.com/dinhanhthi/dinhanhthi.com/commit/a820ac5c5d31f8b47b4c5a23e6d69637cfe4ab07) if there is something wrong.
2. Modify `.zshrc`
   ```bash
   alias ud_dat="cd ~/git/dinhanhthi.com && npm run site:update && cd -"
   ```

   Make sure `site:update` in `package.json` uses `scripts/ud_site.sh`!
3. Add submodule (make sure "notes" is removed from `.gitignore`)
   ```bash
   git submodule add https://github.com/dinhanhthi/notes.git
   ```
4. Clone notes to `dinhanhthi.com/nodesData` (make sure "notesData" is added to `.gitignore`),
   ```bash
   git clone https://github.com/dinhanhthi/notes.git notesData
   ```
5. Make sure in `.eleventy` has case `case "netlify":` for the building process!
6. Change "full-no-opt" and "theming" from "notes" to "notesData".
7. Start using branch "prod".
8. On Netlify, use `npm run build-netlify` for the build command and from "prod" branch!
