---
layout: post
title: "NodeJS & NPM"
categories: [JavaScript]
tags: [react, static site, installation, '101']
icon-photo: nodejs.png
keywords: js javascript package management Node Package Manager
---

{% assign img-url = '/img/post/js/gatsby' %}

{% include toc.html %}

## Install NodeJS & NPM

Install NodeJS and NPM.

- **Windows** & **MacOS**: download [installer](https://nodejs.org/en/download/).
- **Linux**: [this guide](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

Update to latest version?

``` bash
# npm
npm cache clean -f # clear the cache first
sudo npm install -g npm
```

``` bash
# node
sudo npm install -g n
sudo n stable
# refresh the shell
source ~/.zshrc # if using zsh
source ~/.bashrc # is using bash
```

Check version?

``` bash
npm -v
node -v
```

### Shorthand

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

## Update package

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

## Remove package

``` bash
npm uninstall package
```