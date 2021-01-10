---
layout: post
title: "Metrics for clustering"
tags: [Machine Learning, Clustering, Metrics, Visualization]
toc: true
icon: /img/header/clustering.png
keywords: "index metrics distances Silhouette intracluster intercluster Single Linkage Distance Complete Linkage Distance Centroid Linkage Distance Average Linkage Distance Ward's method Minimum variance method Silhouette score analysis elbow method number of clusters nearest-cluster distance Silhouette plot Visualization"
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

### Intracluster types

**Intracluster** -- Measuring distance between points in a cluster.

<div class="columns-2 size-2-1" markdown="1">
<div>

🔅 **Complete Diameter Distance**: the ==farthest distance== between two points in a cluster.

$$
\delta (S) = \max_{x, y\in S} d(x,y)
$$
</div>

![Complete Diameter Distance]({{ img-url }}/distance-complete-diameter.png){:.img-100}
</div>

<!--  -->

<div class="columns-2 size-2-1" markdown="1">
<div>

🔅 **Average Diameter Distance**: the ==average distance== between ALL points in a clusters.

$$
\delta (S) = \dfrac{1}{\vert S\vert (\vert S\vert-1)} \sum_{x, y\in S, x\ne y} d(x,y)
$$

where $\vert S\vert$ is the number of points in $S$.
</div>

![Average Diameter Distance]({{ img-url }}/distance-average-diameter.png){:.img-100}
</div>

<!--  -->

<div class="columns-2 size-2-1" markdown="1">
<div>

🔅 **Centroid Diameter Distance**: the double of average distance between points and the center of a cluster.

$$
\delta (S) = 2 \left( \dfrac{\sum_{x\in S}d(x, c_S)}{\vert S\vert} \right)
$$

where $c_S$ (can be calculated as $\frac{\Sigma_{x\in S}x}{\vert S\vert}), \vert S\vert$ are the center and the number of points in $S$.
</div>

![Centroid Diameter Distance]({{ img-url }}/distance-centroid-diameter.png){:.img-100}
</div>

### Intercluster types

**Intercluster** -- Measuring distance between 2 clusters. They can be used in [Agglomerative clustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html#sklearn.cluster.AgglomerativeClustering).

<div class="columns-2" markdown="1">
<div>

🔅 **Single Linkage Distance**: the ==closest distance== between two objects in 2 clusters.

$$
\delta (S, T) = \min_{x\in S, y\in T} d(x,y)
$$
</div>

![Single linkage distance]({{ img-url }}/distance-single-linkage.png){:.img-100}
</div>

<!--  -->

<div class="columns-2" markdown="1">
<div>

🔅 **Complete (maximum) Linkage Distance**: the ==farthest distance== between two objects in 2 clusters.

$$
\delta (S, T) = \max_{x\in S, y\in T} d(x,y)
$$
</div>

![Complete linkage distance]({{ img-url }}/distance-complete-linkage.png){:.img-100}
</div>

<!--  -->

<div class="columns-2" markdown="1">
<div>

🔅 **Centroid Linkage Distance**: the distance ==between 2 centers== of 2 clusters.

$$
\delta (S, T) = d\left( c_S, c_T \right)
$$

where $c_S, c_T$ are centers of $S, T$. They can be calculated as $\frac{\Sigma_{x\in S} x}{\vert S\vert}$ and $\frac{\Sigma_{x\in T} x}{\vert T\vert}$ where $\vert S\vert, \vert T\vert$ is the number of elements in $S, T$.

{% hsbox "More about _centroid_ and _center_" %}

Don't be confused between these two. **Center** means the point in the interior of a circle that is equidistant from all points on the circumference, whereas **centroid** means the point at the centre of any shape.

{% endhsbox %}

</div>

![Centroid linkage distance]({{ img-url }}/distance-centroid-linkage.png){:.img-100}
</div>

<!--  -->

<div class="columns-2" markdown="1">
<div>

🔅 **Average Linkage Distance**: the ==average distance== between ALL objects in 2 clusters.

$$
\delta (S, T) = \dfrac{1}{\vert S\vert \vert T\vert} \sum_{x\in S, y\in T} d(x,y)
$$
</div>

![Average linkage distance]({{ img-url }}/distance-average-linkage.png){:.img-100}
</div>

where $\vert S\vert, \vert T\vert$ is the number of elements in $S, T$.

<!--  -->

<div class="columns-2" markdown="1">
<div>

🔅 **Ward's method** (_Minimum variance method_): the ==different deviation== between a group of 2 considered clusters and a "reputed" cluster joining those 2 clusters.

$$
\begin{aligned}
\delta (S, T) &= \sum_{x\in S\cup T} \Vert x - c_{S\cup T} \Vert^2 - \left( \sum_{x\in S} \Vert x - c_S \Vert^2 + \sum_{x\in T} \Vert x - c_T \Vert^2 \right) \\
&= \dfrac{\vert S\vert \vert T\vert}{\vert S\vert + \vert T\vert}\Vert c_S - c_T \Vert^2
\end{aligned}
$$

where $c_S, c_T$ are centers of $S, T$ and $\vert S\vert, \vert T\vert$ is the number of elements in $S, T$.
</div>

![Ward's method]({{ img-url }}/distance-ward.png){:.img-100}
</div>

#### Difference

👉 [Different linkage type: Ward, complete, average, and single linkage](https://scikit-learn.org/stable/modules/clustering.html#different-linkage-type-ward-complete-average-and-single-linkage)

![]({{img-url}}/sphx_glr_plot_linkage_comparison_0011.png){:.img-100}
_Different clustering results using different linkages on some special datasets. [Source of image](https://scikit-learn.org/stable/modules/clustering.html#different-linkage-type-ward-complete-average-and-single-linkage)._

#### Code

Linkages can be called via `linkage` parameter from sklearn's [AgglomerativeClustering](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html#sklearn.cluster.AgglomerativeClustering)

``` python
from sklearn.cluster import AgglomerativeClustering
clustering = AgglomerativeClustering(linkage="ward").fit(X)
# There are others: "ward" (default), "complete", "average", "single"
```

## Silhouette analysis

Silhouette analysys (SA) is used to determine the ==degree of separation between clusters==. It measure how close each point in one cluster is to points in the neighboring clusters and thus ==gives an idea of number of clusters== visually.

$$
SA_i = \dfrac{b_i-a_i}{\max (a_i, b_i)}
$$

![Illustration of $a$ and $b$]({{img-url}}/silhouette-score.png){:.img-50}
_Illustration of mean ==intra-cluster distance== $a$ (average distance between considered sample to all its neighboring in the same cluster) and ==nearest-cluster distance== $b$ (average distance between considered sample to all samples in the closest cluster of its cluster)._

- SA = **+1** : a sample is far away from its neighboring clusters. (For clustering algorithm) Clusters are **dense & well-separated**.
- SA = **0** : a sample is near decision boundary. (For clustering algorithm) There are **overlapped clusters**.
- SA = **-1** : a sample is assigned to a **wrong cluster**.

### Used for?

- Better than [Elbow method](/k-means-clustering/#how-to-choose-k%3F) to find ==the number of clusters==.{% ref "https://towardsdatascience.com/silhouette-method-better-than-elbow-method-to-find-optimal-clusters-378d62ff6891" %}
- Check if a clustering algorithm is well performed.
- Can be used to find outliers (-1 scores)

### Silhouette plot

👉 [Selecting the number of clusters with silhouette analysis on KMeans clustering](https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html)

![Silhouette plot with `n_clusters=2`]({{img-url}}/sphx_glr_plot_kmeans_silhouette_analysis_001.png){:.img-100}
_Silhouette plot with `n_clusters=2`. $Oy$: all samples in the dataset sorted in a given cluster. $Ox$: The Silhouette scores w.r.t. these samples. The red dotted line is the mean $SA$._

==What we wanna== see for a good number of clusters?

1. Red dotted lines **approaches 1**.
2. Plot of each cluster should be **above red dotted** line as much as possible.
3. The width of plot of each cluster should be as **uniform** as possible.

``` python
from yellowbrick.cluster import SilhouetteVisualizer

model = KMeans(5, random_state=42)
visualizer = SilhouetteVisualizer(model, colors='yellowbrick')

visualizer.fit(X)        # Fit the data to the visualizer
visualizer.show()        # Finalize and render the figure
```

For original scikit-learn's functions, check [this example](https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html).

### Code

👉 Ref to [silhouette_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html#sklearn-metrics-silhouette-score), [silhouette_samples](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html#sklearn-metrics-silhouette-score).

``` python
# MEAN Silhouette Coefficient over all samples
from sklearn.metrics import silhouette_score
silhouette_score(X, labels)
```

``` python
# Silhouette Coefficient of EACH SAMPLE
from sklearn.metrics import silhouette_samples
scores = silhouette_samples(X, cluster_labels)
for i in range(n_clusters):
	ith_cluster_silhouette_values = scores[cluster_labels == i]
```