---
layout: post
title: "Data Visualization"
tags: [Data Science]
toc: false
icon: /img/header/data_viz.svg
notfull: 1
keywords: 'dtw dynamic time warping graph C library'
---

{% assign img-url = '/img/post/data/data-viz' %}

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

If meet err `The compiled dtaidistance C library is not available.`,
- Try to reinstall the lib [from source](https://dtaidistance.readthedocs.io/en/latest/usage/installation.html#from-source).
- Or

    ``` bash
    pip install -v --force-reinstall --no-deps --no-binary dtaidistance dtaidistance
    ```
- If you are running notebook, you have to restart the kernel!

