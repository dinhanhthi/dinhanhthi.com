# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/ace14869-1b28-471b-ad0f-5f1f7defa382/deploy-status)](https://app.netlify.com/sites/inspiring-goldstine-cfc130/deploys)

⭐  __Demo__ (current version): https://dinhanhthi.com/ <br />
🚀  __Performance__: [Google Insight](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fdinhanhthi.com). <br />

⛑  __Dev branch__: [`dev`](https://github.com/dinhanhthi/dinhanhthi.com/tree/dev) (working branch, always up-to-date) <br />
🌐  __Prod branch__: [`_site`](https://github.com/dinhanhthi/dinhanhthi.com/tree/_site) (already-built html files, what you see on [dinhanhthi.com](https://dinhanhthi.com))

## Older versions

There are several "old" versions (mainly built on **Jekyll**) with different themes.

👉 Version 0 (Jekyll): [v0.dinhanhthi.com](https://v0.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v0-jekyll).<br />
👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v1-jekyll).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v2-jekyll).<br />

## Illustrated photos

![Home page](./img/frontpage.png)

![About page](./img/about-page.png)

![Note page](./img/note-page.png)

## Features

1. High performance (customized from [Google's high performance theme](https://github.com/google/eleventy-high-performance-blog)).
2. Flexible on all devices.
3. Support many components for note taking in markdown (my styles 😉)
4. A ustomizable resume page.
5. Optimization images, html, css, javascript files.
6. Support instant search with hightlight (using [elasticlunr](http://elasticlunr.com/))

## Build & dev locally

At the first time after cloning,

``` bash
# install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm install # run once

# If you have any problem with the installation sharp
# Try to change the python path to python2
# Best practice: create a python env containing python just for this task!
```

Because of the weakness of eleventy, we have to do below things to make the dev locally much faster!

``` bash
# Install http-server to make a separated server
# (we don't intend to serve our eleventy site, just build it)
sudo npm install http-server -g

# Go to the main folder and then
mkdir _live

npm run local-build # a folder _site will be created

# Run the serve on folder _live
# (You need to do this everytime you restart the computer)
npm run local-serve

# Each time we want to build, run
npm run local-build
```

### Deploy to Netlify

Check [this note](https://dinhanhthi.com/11ty-nunjucks/#setting-up-with-netlify) to understand below steps.

``` bash
# Merge changes from branch dev to branch _site
# Clone this repo to 2 separated folders
|
|- dinhanhthi.com	# <- branch "dev" for editing notes
|- dat.com		# <- branch "_site" for pushing to netlify

# more details
git clone git@github.com:dinhanhthi/dinhanhthi.com.git # already done in previous section
git clone git@github.com:dinhanhthi/dinhanhthi.com.git dat.com

# On dat.com/, just run
# (It takes time to build the whole site in dinhanhthi.com/)
sh ud_site.sh
```