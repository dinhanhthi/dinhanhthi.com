---
layout: post
title: "NodeJS & NPM"
tags: [JavaScript]
toc: true
icon: /img_src/header/nodejs.png
notefull: 1
keywords: js javascript package management Node Package Manager
---

{% assign img-url = '/img/post/js/gatsby' %}

## Install NodeJS & NPM

### Install multiple versions

First, need to [install nvm](https://github.com/nvm-sh/nvm).

::: warning
Below commands are mostly for Linux/MacOS users.
:::

::: col-2-equal
``` bash
# install a specific version
nvm install 12.13.0
```

``` bash
# install latest version
nvm install node
```

``` bash
# install the most recent lts release
nvm install --lts
```

``` bash
# list all installed versions
nvm ls
```

``` bash
# set default version of node
nvm alias default 12.13.0
```

``` bash
# full list of available versions
# be careful, it's too long!!!
nvm ls-remote
```

``` bash
# switch between versions
nvm use 12.13.0
# or (more quickly)
nvm use v15
```

``` bash
# uninstall some version
nvm uninstall 12.13.0
```
:::



### Single version

:point_right: Install NodeJS and NPM: [Windows & MacOS](https://nodejs.org/en/download), [Linux](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

::: col-2-equal
``` bash
# UPDATE npm
npm cache clean -f # clear the cache first
sudo npm install -g npm
```

``` bash
# UPDATE node
sudo npm install -g n
sudo n stable
# refresh the shell
source ~/.zshrc # if using zsh
source ~/.bashrc # is using bash
```

``` bash
# Check version
npm -v
node -v
```
:::

### Shorthand CLI options

<div class="two-columns-list" markdown="1">

- `i`: `install`
- `-D`: `--save-dev` (`devDependencies`)
- `-P`: `--save-prod` (default), `--save`
- `-g`: `--global`
- `-f`: `--force`
- `ls`: `list`
</div>

## Install package

👉 [Official documentation](https://docs.npmjs.com/cli/install#:~:text=Install%20the%20dependencies%20in%20the,json%20.).

``` bash
npm install package_name # if it's in package.json, the indicated version will be installed
                         # otherwise, the newsest version will be installed
npm install --global package_name # global package
```

``` bash
# install all package in package.json
npm install
```

``` bash
# install + save to package.json
npm install --save package_name # save to package.json
npm install --save-dev package_name # save to package.json, in devDependencies
npm install --no-save package_name # don't save
```

``` bash
# install with version
npm install express@4.16.1
```

``` bash
# install a local package
npm install /path/to/package
```

``` bash
# from github repository
npm i git+https://github.com/abc/xyz.git # https
# or
npm i git+ssh://git@github.com/abc/xyz.git # ssh
```

``` bash
# list all installed packages (current project only)
ls node_modules
```

``` bash
# list all local (installed) packages
npm list # -g for globel # or use "ls"
npm list --depth=0 # without dependencies

# Check the current version of a (installed) package
npm list package_name # with "-g" for global

# Check the latest (not current) version of a package
npm view package_name version
```

``` bash
# Set python2 by default when installing npm packages
npm config set python python2
```

## Update package

::: col-2-equal
``` bash
# which global packages need to be updated?
npm outdated -g --depth=0

# update all global packages
npm update -g
```

``` bash
# update a package
npm update package_name # -g for global
```
:::

## Remove package

``` bash
npm uninstall package
```

## Run scritps

``` bash
# Install first
npm i --save npm-run-all
```

::: col-2-equal

``` json
// Run sequentially,
// package.json
"scripts": {
	"build": "run-s prod:*", // "run-s" = "npm-run-all -s"
	"prod:eleventy": "eleventy",
	"prod:parcel": "parcel build ./ -o ./",
}
```

``` json
// Run parallely,
// package.json
"scripts": {
	"start": "npm-run-all --parallel dev:*",
	"dev:eleventy": "eleventy --serve",
	"dev:parcel": "parcel watch ./ -o ./",
}
```
:::