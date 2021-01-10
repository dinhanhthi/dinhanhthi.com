---
layout: post
title: "K-Means & K-Medoids Clustering"
tags: [Machine Learning, Clustering]
toc: true
icon: /img/header/clustering.png
keywords: "k means k-means clustering method sensitive to outliers partitioning clustering cluster k-medoids k medoids PAM partitioning around medoids handwritten digits data Luis Serrano Andrew NG elbow method number of clusters k-medoids k modes k-modes k-medians k median kmean kmeans distance between points Silhouette"
notfull: 1
---

{% assign img-url = '/img/post/ML/clustering' %}

K-Means is ==the most popular clustering method== any learner should know. In this note, we will understand the idea of KMeans and how to use it with Scikit-learn. Besides that, we also learn about its variants (K-medois, K-modes, K-medians).

👉 [Metrics for clustering methods](/metrics-for-clustering/).

## K-Means

### Idea?

1. Randomly choose centroids ($k$).
2. Go through each example and assign them to the nearest centroid (assign class of that centroid).
3. Move each centroid (of each class) to the average of data points having the same class with the centroid.
4. Repeat 2 and 3 until convergence.

![KMeans idea]({{img-url}}/kmeans-idea.png){:.img-100}
_A simply basic steps of K-Means._

![KMeans idea]({{img-url}}/K-means_convergence.gif){:.img-50}
_A gif illustrating the idea of K-Means algorithm. [Source](https://en.wikipedia.org/wiki/K-means_clustering#/media/File:K-means_convergence.gif)._

### How to choose k?

Using "Elbow" method to choose the number of clusters $k$.

![KMeans idea]({{img-url}}/kmeans-elbow.png){:.img-full-50}

### Discussion

- A type of **Partitioning clustering**.
- ==K-means is sensitive to outliers== ⇒ **K-medoids** clustering or **PAM** (Partitioning Around Medoids) is less sensitive to outliers{% ref "https://www.datanovia.com/en/blog/types-of-clustering-methods-overview-and-quick-start-r-code" %}

### K-Means in code

~~~ python
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=10, random_state=0) # default k=8
~~~

<div class="col-2-equal">

~~~ python
kmeans.fit(X)
kmeans.predict(X)
~~~

~~~ python
# or
kmeans.fit_predict(X)
~~~
</div>

Some notable parameters (see [full](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)):

{:.indent}
- `max_iter`: Maximum number of iterations of the k-means algorithm for a single run.
- `kmeans.labels_`: show labels of each point.
- `kmeans.cluster_centers_ `: cluster centroids.


### K-Means in action

- K-Means clustering on the handwritten digits data.
- Image compression using [K-Means]({{site.url}}{{site.baseurl}}/k-means-clustering) -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/K_Means_image_compression.html) -- [Open in Colab](https://colab.research.google.com/github/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/K_Means_image_compression.ipynb).


## K-medoids clustering

- **Advantages**:{% ref "https://www.geeksforgeeks.org/ml-k-medoids-clustering-with-example/" %}
  - It is simple to understand and easy to implement.
  - K-Medoid Algorithm is ==fast== and converges in a fixed number of steps.
  - PAM is ==less sensitive to outliers== than other partitioning algorithms.
- **Disavdvantages**:{% ref "https://www.geeksforgeeks.org/ml-k-medoids-clustering-with-example/" %}
  - The main disadvantage of K-Medoid algorithms is that it is ==not suitable for clustering non-spherical== (arbitrary shaped) groups of objects. This is because it relies on minimizing the distances between the non-medoid objects and the medoid (the cluster centre) – briefly, ==it uses compactness as clustering criteria instead of connectivity==.
  - It may obtain different results for different runs on the same dataset because the first k medoids are chosen randomly.
- **Different from K-Means**:
  - *K-Means*:
    - Final centers no need to be points in data.
    - Measure generally requires Euclidean distance.
    - Sensitive to outliers.
  - *K-Medoids*:
    - Final Centers is actual points in data. They're called _medoids_ or _exemplars_.
    - Measures can be arbitrarily dissimilar.
    - ==Robust to outliers.==

**The idea**:

1. (Like KMeans'): choose randomly points (no need to be a point in data)
2. (Like KMeans'): assign labels to points based on chosen points in step 1.
3. (Different from KMeans):
4. (Like KMeans'): repeat the steps.

## Choose k by Silhouette

It's [better than Elbow method](https://towardsdatascience.com/silhouette-method-better-than-elbow-method-to-find-optimal-clusters-378d62ff6891) to choose the number of clusters $k$.

👉 Check [this note](/metrics-for-clustering/#silhouette-analysis).

## References

- **Luis Serrano** -- [Video] [Clustering: K-means and Hierarchical](https://www.youtube.com/watch?v=QXOkPvFM6NU).
- **Andrew NG.** -- [My raw note](https://rawnote.dinhanhthi.com//machine-learning-coursera-8#k-means-algorithm) of the course ["Machine Learning" on Coursera](https://www.coursera.org/learn/machine-learning/).