---
layout: post
title: "Computer & Internet tips"
categories: [others]
tags: ['online tool', collection]
notfull: 1
icon-photo: tips.svg
notfull: 1
keywords: "download flash video browser extension video url google video download manager videoplay developer tools exclude files folders search technique skills patterns preference settings confige configure options remove apps google apps bit.ly cortana uses chrome instead of edge default browser windows 10 change default directory powershell cmder"
---

{% assign img-url = '/img/post/others' %}

{% include toc.html %}

## General

## Applications

🔅  Change default directory in [cmder](https://cmder.net/)

1. Go to settings
1. Then, Startup > Tasks
1. Choose `{cmd::Cmder}`
1. Choose the below-right box, let the cursor at the end of the text
1. Click on "Startup dir…"
1. Choose your desired directory > OK
1. Remove the current line with the new appearing one (`new_console:d:%USERPROFILE%`)
1. Click on Save settings

## Windows

### Cortana uses Chrome instead of Edge

- Download and install [this app](https://github.com/da2x/EdgeDeflector/releases) (reinstall it after every update of Windows).
- Choose **EdgeDeflector** as the default web browser if it asks.
- Install [this extension](https://chrome.google.com/webstore/detail/chrometana-redirect-bing/) in Chrome to force to redirect from **Bing** to **Google Search Engine**.

### Change default directory in PowerShell

- Create a folder in your **Documents** folder called **WindowsPowerShell**
- Create a file called `profile.ps1` inside this folder
- Add following command `Set-Location c:\abc`
- Every time you launch PowerShell, the profile script will be executed

## Internet

🔅  Remove apps permission from Google Apps (Youtube, Google Play Music, …) ⇾ [here](https://myaccount.google.com/permissions).

### Problem of hsts

Cannot open a page with security problem.

1. Go to [chrome://net-internals/#hsts](chrome://net-internals/#hsts)
2. "Query HSTS/PKP domain", fill domain, e.g. `gitlab.powerop.io`.
3. "Delete domain security policies", fill domain and click on __Delete__.
4. Try again > Click on "Advanced" > Click on ...unsafe....


### Download flash video

In most case, you can use [Flash Video Downloader](https://chrome.google.com/webstore/detail/flash-video-downloader/aiimdkdngfcipjohbjenkahhlhccpdbc?hl=en) (for Chrome) or other extensions to detect the video url.

In the case browser extensions cannot capture the url, you can open the **Developer Tools** (in Chrome, press <kbd>F12</kbd>) > Reload the page and click to play again the video > **Network** tab > **Media** tab > click on any sources on the left column (`videoplayback?expire...`) > On the right column, in tab **Headers** > **General** > Copy the content in **Request URL**, something like below,

{:.bg-gray}
~~~
https://r4---sn-25ge7ns7.googlevideo.com/videoplayback?expire=1568040368&ei=kEl2Xb...f_cW7qE=
~~~

Open a new tab in your browser, <kbd>Ctrl</kbd> + <kbd>S</kbd> to save the video. You can also open the Downloads manager in your browser (<kbd>Ctrl</kbd> + <kbd>J</kbd>) to copy the download link and use other Download Manager tools to download this video without using the browser!

### Github README.md on localhost

In stall [grip](https://github.com/joeyespo/grip).

``` bash
# go to the file's directory
grip # if file is README.md
grip file.md
```
