---
layout: post
title: "Dynamic Time Warping (DTW)"
tags: [Time Series]
toc: true
icon: datetime.svg
notfull: 1
keywords: "dtw analysis multiple time series distance compare two ts"
---

{% assign img-url = '/img/post/time-series' %}

## What (idea)?

Suppose that we need to compare 2 time series (quite _look-alike_),

![An example of 2 time series to be compared using DTW]({{img-url}}/dtw-example.png){:.img-100}
_An example of 2 time series to be compared using DTW_

- They're quite look-alike but it we compare point-to-point, they're clearly very different!
- With **DTW**, we compare:
  - hollows of series 1 with ones of series 2.
  - cambers of series 1 with ones of series 2.
- **Dynamic Time Warping** is used to ==compare the similarity== or calculate the distance between two arrays or time series with different length.