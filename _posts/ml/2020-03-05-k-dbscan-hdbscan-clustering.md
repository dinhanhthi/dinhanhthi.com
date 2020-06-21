---
layout: post
title: "DBSCAN / HDBSCAN Clustering"
categories: [machine learning]
tags: ['clustering', 'density based clustering']
icon-photo: clustering.png
notfull: 1
keywords: "cluster clustering dbscan hdbscan density based spatial clustering of application with noise high varying shapes sort data points neighborhood min point core points border noise phase discover number of clusters automatically ignoire outliers detect outliers Scikit-learn density based clustering"
---

{% include toc.html %}

## What?

The key idea is that for each point of a cluster, the neighborhood of a given radius has to contain at least a minimum number of points.

### DBSCAN

Description Density-based spatial clustering of applications with noise.

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

Parameters ([others](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html)):

- `min_samples`: min number of samples to be called "dense"
- `eps`: max distance between 2 samples to be in the same cluster. Its unit/value based on the unit of data.
- Higher `min_samples` + lower `eps` indicates higher density necessary to form a cluster.

Components:

- `clr.labels_`: clusters' labels.

### HDBSCAN

For a ref of paramaters, check [here](https://hdbscan.readthedocs.io/en/latest/api.html).

~~~ python
from hdbscan import HDBSCAN
clr = DBSCAN(eps=3, min_cluster_size=3, metric='euclidean')
~~~

Parameters:

- `min_cluster_size` {% ref https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#selecting-min-cluster-size %} the smallest size grouping that you wish to consider a cluster.
- `min_samples`{% ref https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#selecting-min-samples %}: The number of samples in a neighbourhood for a point to be considered a core point. The larger value $\to$ the more points will be declared as noise & clusters will be restricted to progressively more dense areas.

Results:

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
