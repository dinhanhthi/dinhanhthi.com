---
layout: post
title: "Computer & Internet Tips"
categories: [others]
---

{% assign img-url = '/img/post/others' %}

{% include toc.html %}

{% updfreq %}

## Download flash video

In most case, you can use [Flash Video Downloader](https://chrome.google.com/webstore/detail/flash-video-downloader/aiimdkdngfcipjohbjenkahhlhccpdbc?hl=en) (for Chrome) or other extensions to detect the video url.

In the case browser extensions cannot capture the url, you can open the **Developer Tools** (in Chrome, press <kbd>F12</kbd>) > Reload the page and click to play again the video > **Network** tab > **Media** tab > click on any sources on the left column (`videoplayback?expire...`) > On the right column, in tab **Headers** > **General** > Copy the content in **Request URL**, something like below,

{:.bg-gray}
~~~
https://r4---sn-25ge7ns7.googlevideo.com/videoplayback?expire=1568040368&ei=kEl2Xb...f_cW7qE=
~~~ 

Open a new tab in your browser, <kbd>Ctrl</kbd> + <kbd>S</kbd> to save the video. You can also open the Downloads manager in your browser (<kbd>Ctrl</kbd> + <kbd>J</kbd>) to copy the download link and use other Download Manager tools to download this video without using the browser!