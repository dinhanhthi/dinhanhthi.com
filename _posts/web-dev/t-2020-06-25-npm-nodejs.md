---
layout: post
title: "npm - nodejs"
categories: [web development]
tags: [installation]
icon-photo: "nodejs.svg"
notfull: 1
keywords: "nodejs node npm package manager"
---

{% include toc.html %}


## Install without command line

- For npm and NodeJS, download and install [here](https://nodejs.org/en/).

## Install with command line

Install npm,

<div class="flex-50" markdown='1'>
``` bash
# linux
sudo apt install npm
```

``` bash
# check version
npm -v
```
</div>

Install nodejs,

<div class="flex-50" markdown='1'>
``` bash
# linux
sudo apt install nodejs
```

``` bash
# update
sudo npm install n -g
sudo n stable
```

``` bash
# if there are more than 2 versions
# refresh to the newest
PATH="$PATH"
```

``` bash
# check version
node -v
```
</div>