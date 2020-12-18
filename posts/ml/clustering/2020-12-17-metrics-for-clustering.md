---
layout: post
title: "Metrics for clustering"
tags: [Machine Learning, Clustering, Metrics]
toc: true
icon: /img/header/clustering.png
keywords: "index metrics distances Silhouette intracluster intercluster"
notfull: 1
---

{% assign img-url = '/img/post/ML/clustering' %}

In order to group points into clusters, we need to know about their distance between each other.

## Intercluster & intracluster

- **Intracluster distance**: Distance between two point in the same cluster.
- **Intercluster distance**: Distance between two points in the different clusters.

![Intercluster & intracluster distance](/img/post/ML/clustering/intercluster-intracluster.png){:.img-60}
_An illustraction of intercluster and intracluster distance._

::: success
Best clustering $\Rightarrow$ min intracluster & max intercluster.
:::


## Distances used

### Intercluster

<div class="columns-2" markdown="1">
<div>

**Single Linkage Distance**: the ==closest distance== between two objects in 2 clusters.

$$
\delta (S, T) = \min_{x\in S, y\in T} d(x,y)
$$
</div>

![Single linkage distance]({{ img-url }}/distance-single-linkage.png){:.img-100}
</div>

<div class="columns-2" markdown="1">
<div>

**Complete Linkage Distance**: the ==farthest distance== between two objects in 2 clusters.

$$
\delta (S, T) = \max_{x\in S, y\in T} d(x,y)
$$
</div>

![Complete linkage distance]({{ img-url }}/distance-complete-linkage.png){:.img-100}
</div>

<div class="columns-2" markdown="1">
<div>

**Centroid Linkage Distance**: the distance ==between 2 centers== of 2 clusters.

$$
\delta (S, T) = d\left( \dfrac{1}{\vert S\vert}\sum_{x\in S}x, \dfrac{1}{\vert T\vert}\sum_{y\in T}y \right)
$$

{% hsbox "More about _centroid_ and _center_" %}

Don't be confused between these two. **Center** means the point in the interior of a circle that is equidistant from all points on the circumference, whereas **centroid** means the point at the centre of any shape.

{% endhsbox %}

</div>

![Centroid linkage distance]({{ img-url }}/distance-centroid-linkage.png){:.img-100}
</div>

<div class="columns-2" markdown="1">
<div>

**Average Linkage Distance**: the ==average distance== between ALL objects in 2 clusters.

$$
\delta (S, T) = \dfrac{1}{\vert S\vert \vert T\vert} \sum_{x\in S, y\in T} d(x,y)
$$
</div>

![Average linkage distance]({{ img-url }}/distance-average-linkage.png){:.img-100}
</div>

<div class="columns-2" markdown="1">
<div>

**Ward's method**: consider joining 2 clusters, how does it change the total distance from centroids?

$$
\delta (S, T) = \dfrac{1}{\vert S\vert \vert T\vert} \sum_{x\in S, y\in T} d(x,y)
$$
</div>

![Average linkage distance]({{ img-url }}/distance-average-linkage.png){:.img-100}
</div>

### Intracluster

## Silhouette analysis