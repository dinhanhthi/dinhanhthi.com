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

DescriptionDensity-based spatial clustering of applications with noise.

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

- `clustering.labels_`: clusters' labels.

### HDBSCAN

~~~ python
from hdbscan import HDBSCAN
~~~
