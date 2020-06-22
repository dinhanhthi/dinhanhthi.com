---
layout: post
title: "DBSCAN / HDBSCAN Clustering"
categories: [machine learning]
tags: ['clustering', 'density based clustering']
icon-photo: clustering.png
notfull: 1
keywords: "cluster clustering dbscan hdbscan density based spatial clustering of application with noise high varying shapes sort data points neighborhood min point core points border noise phase discover number of clusters automatically ignoire outliers detect outliers Scikit-learn density based clustering"
katex: 1
---

{% include toc.html %}

{% katexmm %}

## What?

The key idea is that for each point of a cluster, the neighborhood of a given radius has to contain at least a minimum number of points.

### DBSCAN

- "DBSCAN" = Density-based-spatial clustering of application with noise.
- Separate clusters of <mark>high density from ones of low density</mark>.
- Can sort data into clusters of varying shapes.
- **Input**: set of points & neighborhood N & minpts (density)
- **Output**: clusters with density (+ noises)
- Each point is either:
  - core point: has at least minpts points in its neighborhood.
  - border point: not a core but has at least 1 core point in its neighborhoods.
  - noise point: not a core or border point.
- **Phase**:
  1. Choose a point → it's a core point?
     1. If yes → expand → check core / check border
     2. If no → form a cluster
  2. Repeat to form other clusters
  3. Eliminate noise points.
- **Pros**:
  - Discover any number of clusters (different from [K-Means](/k-means-clustering) which need an input of number of clusters).
  - Cluster of varying sizes and shapes.
  - Detect and ignore outliers.
- **Cons**:
  - Sensitive → choice of neighborhood parameters (eg. If minpts is too small → wrong noises)
  - Produce noise: unclear → how to calculate metric indexes when there is noise.

### HDBSCAN

High DBSCAN.

## When?

- We are not sure the number of clusters (like in [KMeans](/k-means-clustering))
- There are outliers or noises in data.
- Arbitrary cluster's shape.

## In Code

### DBSCAN with Scikit-learn

~~~ python
from sklearn.cluster import DBSCAN
clr = DBSCAN(eps=3, min_samples=2)
~~~

<div class="flex-auto-equal-2" markdown="1">
~~~ python
clr.fit(X)
clr.predict(X)
~~~

~~~ python
# or
clr.fit_predict(X)
~~~
</div>

**Parameters** ([others](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html)):

- `min_samples`: min number of samples to be called "dense"
- `eps`: max distance between 2 samples to be in the same cluster. Its unit/value based on the unit of data.
- Higher `min_samples` + lower `eps` indicates higher density necessary to form a cluster.

**Attributes**:

- `clr.labels_`: clusters' labels.

### HDBSCAN

For a ref of paramaters, check [here](https://hdbscan.readthedocs.io/en/latest/api.html).

~~~ python
from hdbscan import HDBSCAN
clr = DBSCAN(eps=3, min_cluster_size=3, metric='euclidean')
~~~

**Parameters**:

- `min_cluster_size`: {% ref https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#selecting-min-cluster-size %} the smallest size grouping that you wish to consider a cluster.
- `min_samples`: {% ref https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#selecting-min-samples %} The number of samples in a neighbourhood for a point to be considered a core point. The larger value $\to$ the more points will be declared as noise & clusters will be restricted to progressively more dense areas.

{% hsbox Examples to understand `min_cluster_size` and `min_samples` %}
Box's content.
{% endhsbox %}

**Attributes**:

- Label `-1` means that this sample is not assigned to any cluster, or noise!
- `clt.labels_`: labels of clusters (including `-1`)
- `clt.probabilities_`: scores (between 0 and 1). `0` means sample is not in cluster at all (noise), `1` means the heart of cluster.


#### HDBSCAN and scikit-learn

Note that, HDBSCAN [is built based on scikit-learn](https://github.com/scikit-learn-contrib/hdbscan/blob/master/hdbscan/hdbscan_.py#L642) but it doesn't have an `.predict()` method as other clustering methods does on scikit-learn. Below code gives you a new version of HDBSCAN (`WrapperHDBSCAN`) which has an additional `.predict()` method.

``` python
from hdbscan import HDBSCAN

class WrapperHDBSCAN(HDBSCAN):
    def predict(self, X):
        self.fit(X)
        return self.labels_
```

## Reference

- **Official doc** -- [How HDBSCAN works?](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html)

{% endkatexmm %}