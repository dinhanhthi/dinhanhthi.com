---
layout: post
title: "Data Visualization"
categories: [data science]
tags: ['data visualization']
notfull: 1
icon-photo: data_viz.svg
keywords: 'dtw dynamic time warping graph'
---

{% assign img-url = '/img/post/data/data-viz' %}

{% include toc.html %}

👉 Note of [Matplotlib extra](/python-matplotlib-tips)

## Dynamic Time Warping (DTW)

Ref [here](https://dtaidistance.readthedocs.io/en/latest/usage/dtw.html),

``` python
from dtaidistance import dtw
from dtaidistance import dtw_visualisation as dtwvis
import numpy as np
s1 = np.array([0., 0, 1, 2, 1, 0, 1, 0, 0, 2, 1, 0, 0])
s2 = np.array([0., 1, 2, 3, 1, 0, 0, 0, 2, 1, 0, 0, 0])
path = dtw.warping_path(s1, s2)
dtwvis.plot_warping(s1, s2, path, filename="warp.png")
```