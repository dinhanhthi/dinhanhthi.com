---
layout: post
title: "Mean Shift clustering"
tags: [Machine Learning, Clustering]
toc: true
icon: clustering.png
keywords: "distance between points Mode-seeking algorithm Non-Parametric Density Estimation PDF Search Results Web results Probability density function Kernel Density Estimation"
notfull: 1
---

{% assign img-url = '/img/post/ML/clustering' %}

## What?

- Mean-Shift assigns the data points to the clusters iteratively by shifting points towards the mode (mode is the highest density of data points in the region, in the context of the Meanshift)
- Non-Parametric Density Estimation.
- The data points are sampled from an underlying PDF (Probability density function){% ref "http://www.cse.psu.edu/~rtc12/CSE598G/introMeanShift_6pp.pdf" %}.

  ![Data point density implies PDF]({{img-url}}/mean-shift-1.jpg){:.img-full-70}
  _Data point density implies PDF._
- Mean-shift built based on the idea of _Kernel Density Estimation_.
- Mean shift exploits this KDE idea by imagining what the points would do if they all climbed up hill to the nearest peak on the KDE surface. It does so by iteratively shifting each point uphill until it reaches a peak{% ref "https://spin.atomicobject.com/2015/05/26/mean-shift-clustering/" %}.

    <div class="columns-2" markdown="1">

    ![Points climb to the nearest hill.]({{img-url}}/mean-shift-2.gif)
    _Points climb to the nearest hill._

    ![Points climb to the nearest hill.]({{img-url}}/mean-shift-3.gif)
    _Points climb to the nearest hill._
    </div>

## When?

- Image processing and computer vision.
- Image Segmentation Application{% ref "https://spin.atomicobject.com/2015/05/26/mean-shift-clustering/" %}.

## Pros & Cons

- **Pros**: Non-Parametric Density Estimation.
- **Cons**: It's computationally expensive O(n²) {% ref "https://www.geeksforgeeks.org/ml-mean-shift-clustering/" %}.

## Code?

~~~ python
from sklearn.cluster import MeanShift
clustering = MeanShift(bandwidth=2).fit(X)
~~~

<div class="flex-auto-equal-2" markdown="1">

~~~ python
clustering.fit(X)
clustering.predict(X)
~~~

~~~ python
# or
clustering.fit_predict(X)
~~~
</div>

Components:

- `clustering.labels_`: clusters' labels.

## Usage example

- Used to [determined windows of time](/time-series-tips#find-the-windows-of-time-series) in time series data.


## References

- **Saravanan Thirumuruganathan** -- [Introduction To Mean Shift Algorithm](https://saravananthirumuruganathan.wordpress.com/2010/04/01/introduction-to-mean-shift-algorithm/).
- **Geeksforgeeks** -- [Mean-Shift clustering](https://www.geeksforgeeks.org/ml-mean-shift-clustering/).
- **R.Collins** -- [Mean-Shift tracking](http://www.cse.psu.edu/~rtc12/CSE598G/introMeanShift_6pp.pdf).
- **Matt Nedrich** -- [Mean Shift Clustering](https://spin.atomicobject.com/2015/05/26/mean-shift-clustering/).

