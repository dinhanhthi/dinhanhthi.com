---
layout: post
title: "Dynamic Time Warping (DTW)"
tags: [Time Series]
toc: true
icon: ts.png
notfull: 1
keywords: "dtw analysis multiple time series distance compare two ts"
---

{% assign img-url = '/img/post/time-series' %}

## What (idea)?

Suppose that we need to compare 2 time series (quite _look-alike_),

![An example of 2 time series to be compared using DTW]({{img-url}}/dtw-example.png){:.img-75}
_An example of 2 time series to be compared using DTW. [Source of the idea](https://www.youtube.com/watch?v=v_WLX0fu_UE)._

- They're quite look-alike but if we compare point-to-point, they're clearly very different!
- With **DTW**, we compare:
  - hollows of series 1 with ones of series 2.
  - cambers of series 1 with ones of series 2.
- **Dynamic Time Warping** is used to ==compare the similarity== or ==calculate the distance== between two arrays or time series with different length.

![Difference between DTW and Euclidian distance.]({{img-url}}/Euclidean-distance-vs-DTW.png){:.img-80}
_Difference between DTW and Euclidian distance. [Source](https://www.researchgate.net/figure/Euclidean-distance-vs-DTW_fig7_223966685)._

## How (idea)?

![An example of 2 time series to be compared using DTW]({{img-url}}/dtw-example-how.jpg){:.img-80}
_By using a **distance matrix**, we can find a good distance between 2 timeseries using DTW. Here, $8=3^2-1^2$ and we choose the smallest distance in the nearest position. [Source](https://www.youtube.com/watch?v=v_WLX0fu_UE)._

![More detailed of calculating the distance matrix using DTW]({{img-url}}/dtw-example-distance-matrix.png){:.img-60}
_More detailed of calculating the distance matrix using DTW. `Ai`: element `i`th of `A`; `D[i-1, j-1]`: The DTW between element `i-1`th and `j-1`th. [Source](https://www.youtube.com/watch?v=_K1OsqCicBY)._

## When to use?

1. **An example**: Voice of a man. He can speak fast. He can speak slowly. However, the both voices are his. If we don't use DTW but Euclidian distance, the distance is very large $\Rightarrow$ there are 2 voices $\Rightarrow$ wrong prediction!
2. **Sound Pattern Recognition**: detect the same kind of sound pattern (like the above example).
3. **Stock Market**:

## Algorithm

1. Divide 2 time series into equal points.
2. Calculate distance between 1st point in TS1 with all points in TS2 and then _store the min_.
3. Move to 2nd point.
4. Repeat step 2 & 3 but with 2nd point as a reference point.
5. Add up all stored distances. ==This is a true measure between 2 time series==.

👉 Check [this video](https://www.youtube.com/watch?v=_K1OsqCicBY) fore a more explanation.

## Code

👉 [dtaidistance](https://dtaidistance.readthedocs.io/en/latest/usage/installation.html)

``` bash
pip install dtaidistance
```

``` python
from dtaidistance import dtw
s1 = [0, 0, 1, 2, 1, 0, 1, 0, 0]
s2 = [0, 1, 2, 0, 0, 0, 0, 0, 0]
distance = dtw.distance(s1, s2)

# plot
from dtaidistance import dtw_visualisation as dtwvis
import numpy as np
path = dtw.warping_path(s1, s2)
dtwvis.plot_warping(s1, s2, path, filename="warp.png")
```

👉 Another option: [dtw-python](https://dynamictimewarping.github.io/python/)

👉 [fastdtw](https://github.com/slaypni/fastdtw) (an approximate Dynamic Time Warping (DTW) algorithm that provides optimal or near-optimal alignments with an O(N) time and memory complexity)

``` bash
pip install fastdtw
```

``` python
import numpy as np
from scipy.spatial.distance import euclidean

from fastdtw import fastdtw

x = np.array([[1,1], [2,2], [3,3], [4,4], [5,5]])
y = np.array([[2,2], [3,3], [4,4]])
distance, path = fastdtw(x, y, dist=euclidean)
print(distance)
```