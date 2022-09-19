# dinhanhthi.com [![Netlify Status](https://api.netlify.com/api/v1/badges/ace14869-1b28-471b-ad0f-5f1f7defa382/deploy-status)](https://app.netlify.com/sites/inspiring-goldstine-cfc130/deploys)

👋 Thi's personal website running on 11ty.

❗ **Note** : This repo is for my purposes ONLY. I actually wanted make it into an 11ty theme that could be used by others, but the complexity and my free time prevent me from continuing. If you figure out how to use it yourself that's great, otherwise just ask me but I can not promise I'll answer (soon) 🙁. Anyway, if you find something useful for me to improve this theme, just let me know, thanks a lot.

XXX

📚 Markdown notes are stored in [a separated repo](https://github.com/dinhanhthi/notes).

## Older versions

There are several "old" versions (mainly built on **Jekyll**) with different themes.

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).<br />
👉 Version 4 (Gatsby, canceled at 60%): [demo of what I did](https://dinhanhthi-com-v4-gatsby.netlify.app/) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby).

## Useful commands

<details>
<summary>On MacOS (for me only)</summary>

```bash
# Install Python first!
cd scripts/
pip install -r requirements.txt
```

```bash
dat # go to dinhanhthi.com/
ud_dat # build & deploy to netlify
notes:update # git update notes/
touch_css # to run npm css:touch anywhere
touch_all # build whole site

# Reading notes
change_img_url ydkjsy-1 # change url to {{ img-url }}
# Images must be stored in dat.com/notes/img_tmp/
```
</details>

## Dev

**TL;DR;**

- Watch mode (no image optimization, all posts): `npm run watch`.
- Theming mode (for customizing themes + display all blog posts): `npm run theming`.
- Mimic prod version locally: `npm run preprod` (port `8081`).
- Temporary blog posts: put in **notes/blog_wip/**.
- Temporary note posts: put in **notes/posts_wip/**.
- For working with Typora + VSCode ([this blog post](https://dinhanhthi.com/images-11ty-markdown/)):
  - Blog posts must be store in **notes/blog/name-of-blog.md** (no sub folder).
  - Note posts must be store in **notes/posts/name-of-note.md** (no sub folder).

<details>
<summary>More details (a little old)</summary>

Let us assume that the installation step is complete.

- **Update data** : in `notes/_data/`. There are also `csp.js` in `src/_data`.
- **Header icon** (frontmatter):
  - `icon: aio.svg`: icon has to be stored in `notes/img/header/`.
  - `icon: /src/img_src/aio.svg`: icon has to be stored in `/src/img/header/` (Yes, it's `img_src`!!!). It's useful for sample posts (we don't have to store icons in `/notes/`)
- **Update site**: `npm run site:update` (On Mac/Linux, use `ud_dat`)

For modifying theme (parse only posts in `sample_posts/`)

```bash
npm run theming # (--incremental is turned off)
```

Without image optimization (**Note**: If there is any propblem with the style, run `npm run css:touch`),

```bash
# Real posts (/notes/posts/)
npm run full:watch-no-opt # localhost:8080, built to "_built"
# or
npm run watch

# Build whole site locally (to "_built")
npm run build-local
```

Without image optimization (**Note**: If there is any propblem with the style, run `npm run css:touch`),

```bash
# Real posts (/notes/posts/)
npm run build # built to "_site"
npm run full:http-serve-opt # localhost:8081 over "_live" (a copy of "_site")

# Build and http serve real posts
npm run full:build-http-serve-opt
```

```bash
# Build & update & deploy
npm run site:build-update

# Just build
npm run build # _site

# Just update & deploy what built in _site
npm run site:update
```

</details>

### Download SVG from flaticon

Normally, you can not download the SVG format from flaticon. Just click Edit > Open Inspect Element > Copy SVG HTML element > Create a new file + paste this + save as `.svg`.

### Update Fontello icons?

Upload the configuration file in `/src/fontello/config.json` to [fontello.com](https://fontello.com/) (by clicking on the spanner symbol). Add any other icons you want. Once selected, click on "**Get config only**".

```bash
# Install fontello-cli
npm install -g fontello-cli

# Run
npm run ud-fontello

# Check code in src/fontello/config.json, field "css"
```

```html
<!-- How to use? -->
<i class="fontello-icon icon-ng"></i>
```

**Note**: Sometimes, there are duplicates of hex/decimal codes (although the names are different). Navigate to the "Customize Codes" tab on the fontello website, find the duplicates, and change them. Note that,  this tab, the codes in hexa-base, the downlowded configuration displays them in decimal-base (`"code"` field). On [this site](https://www.rapidtables.com/convert/number/decimal-to-hex.html) you can convert the two formats.

<details>
<summary>Add a custom icon?</summary>

1. Search for an icon (eg. svg images) + download to local.
   1. Free SVG icon: [site](https://uxwing.com/).
   2. If you need to crop some images? Use [this site](https://www.iloveimg.com/crop-image).
   3. Need to convert to svg? Use [this site](https://www.pngtosvg.com/).
2. Drag and drop this icon to fontello site.
</details>

## Installation

<details>
<summary>Click to show (a little long)!</summary>

At the first time after cloning,

```bash
# Install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm i # Run once

sh scripts/getting_start.sh # Run once
```

```bash
# Any problem with sharp?
# Try to change the python path to python2
# Best practice: create a python env containing python just for this task!

# In case, python2 installed but it's not currently default
# Choose python version in npm with
npm config set python python2
```

```bash
# Problems with libvips (MacOS??)? => install it first
brew install vips
# Then again,
npm i
```

```bash
npm i -g kill-port
```

Dev mode,

```bash
# Install before
sudo npm install http-server -g

# Create \_live & Clone dat.com/\_site
sh getting_started.sh
```

Check section [Dev](#dev) for more.

```bash
# Make a shortcut on the system?
update_dat='cd ~/git/dinhanhthi.com && sh ud_site.sh && cd -1'
```

</details>

### Re-install?

In case have some problems and need to re-install everything,

```bash
npm run re-install
```

It will remove `node_modules/`, `package-lock.json` and re-run `npm i`.

## Errors?

```bash
# 'darwin-arm64v8' binaries cannot be used on the 'darwin-x64' platform
rm -rf node_modules/sharp
npm  i
# or: https://bit.ly/3kyzXiL
# npm install --arch=x64 --platform=darwin sharp
```

```bash
# connect EADDRNOTAVAIL 127.0.0.1:8080 - Local (192.168.1.109:50781)
# (Usually after install WARP on MacOS)
sudo ifconfig lo0 -alias 192.0.2.2
```
