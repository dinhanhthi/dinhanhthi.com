# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/ace14869-1b28-471b-ad0f-5f1f7defa382/deploy-status)](https://app.netlify.com/sites/inspiring-goldstine-cfc130/deploys)

👋 Thi's personal website running on 11ty.

❗ **Note** : This repo is for my personal purpose ONLY. I don't intend to make it be a template (although I used to want to do this). If you wanna use it and have troubles, send me an email if you like but I'm not sure I'll have time to help you. Sorry about that. Anyway, if you find something useful for me to enhance this theme, just let me know, thanks.

📚 Markdown notes are stored in [a separated repo](https://github.com/dinhanhthi/notes).

## Changelog

Read this [changelog](./CHANGELOG.md).

## Older versions

There are several "old" versions (mainly built on **Jekyll**) with different themes.

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).

## Dev

Suppose that the installation step is done completely.

- **Update data** : modify files in `notes/_data/`. If wanna see them on local when dev, overwrite these files to `src/_data/`,
- **Update posts** : just modify things in `notes/`.

Without image processing,

``` bash
# Sample posts (sample_posts/)
npm run sample:watch-no-opt # localhost:8080

# Real posts (/notes/posts/)
npm run full:watch-no-opt # localhost:8080
```

With image processing,

``` bash
# Sample posts (sample_posts/)
npm run sample:watch-opt # localhost:8080

# Just build sample_post
npm run sample:build-opt

# Real posts (/notes/posts/)
npm run build
npm run full:http-serve-opt # localhost:8081

# Build and http serve real posts
npm run full:build-http-serve-opt
```

``` bash
# Build & update & deploy
npm run site:build-update

# Just build
npm run build # _site

# Just update & deploy what built in _site
npm run site:update
```

<details><summary>More about update data</summary>

Informations must be duplicated both in `src/_data/` and `notes/_data` : `csp.js`, `env.js`, `googleanalytics.js`, `helpers.js`, `settings.json`. Other words: add something in these files, must add in both places. Other files, just modify in `notes/_data` except that we need some info for the sample theme.
</details>

### Update Fontello icons?

Upload the config file in `/src/fontello/config.json` to [fontello.com](https://fontello.com/) (by clicking on the spanner symbol). Add more icons you want. After choosing, click to "**Get config only**".

```bash
# Install fontello-cli
npm install -g fontello-cli

# Install / update new icon
fontello-cli --config src/fontello/config.json --css src/fontello/css --font src/fontello/font install

# Check code in src/fontello/config.json
```

**Add a custom icon**?

1. Search for an icon (eg. svg images) + download to local.
   1. Free SVG icon: [site](https://uxwing.com/).
   2. If you need to crop some images? Use [this site](https://www.iloveimg.com/crop-image).
   3. Need to convert to svg? Use [this site](https://www.pngtosvg.com/).
2. Drag and drop this icon to fontello site.

## Installation

<details>
<summary>Click to show (a little long)!</summary>

At the first time after cloning,

```bash
# Install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm i # Run once

sh getting_start.sh # Run once
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

Dev mode,

```bash
# Install before
sudo npm install http-server -g

# Create \_live & Clone dat.com/\_site
sh getting_started.sh
````

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
