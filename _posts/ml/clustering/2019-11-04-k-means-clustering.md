---
layout: post
title: "K-Means Clustering"
categories: [machine learning]
tags: ['clustering', 'popular method', 'partitioning clustering']
katex: 1
icon-photo: clustering.png
date: 2020-03-05
keywords: "k means k-means clustering method sensitive to outliers partitioning clustering cluster k-medoids k medoids PAM oartitioning around medoids handwritten digits data Luis Serrano Andrew NG elbow method number of clusters k-medoids k modes k-modes k-medians k median kmean kmeans distance between points"
---

{% assign img-url = '/img/post/ML/clustering' %}
{% assign file-url = '/files/ml/k-means' %}

{% include toc.html %}

{% katexmm %}

K-Means is the most popular clustering method any learner should know. In this note, we will understand the idea of KMeans and how to use it with Scikit-learn. Besides that, we also learn about its variants (K-medois, K-modes, K-medians).

## What's the idea of K-Means?

1. Randomly choose centroids ($k$).
2. Go through each example and assign them to the nearest centroid (assign class of that centroid).
3. Move each centroid (of each class) to the average of data points having the same class with the centroid.
4. Repeat 2 and 3 until convergence.

{:.img-full-80.pop}
![KMeans idea]({{img-url}}/kmeans-idea.png)

## How to choose number of clusters?

Using "Elbow" method.

{:.img-full-50.pop}
![KMeans idea]({{img-url}}/kmeans-elbow.png)

## Discussion

- A type of **Partitioning clustering**.
- Not good if there are outliers, noise.
- The K-means method is sensitive to outliers ⇒ **K-medoids** clustering or **PAM** (Partitioning Around Medoids) is less sensitive to outliers{% ref https://www.datanovia.com/en/blog/types-of-clustering-methods-overview-and-quick-start-r-code/ %}

## Using K-Means with Scikit-learn

~~~ python
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=10, random_state=0) # default k=8
~~~

<div class="flex-auto-equal-2" markdown="1">
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

- `max_iter`{:.tpink}: Maximum number of iterations of the k-means algorithm for a single run.
- `kmeans.labels_`{:.tpink}: show labels of each point.
- `kmeans.cluster_centers_ `{:.tpink}: cluster centroids.


## K-Means in action 

- K-Means clustering on the handwritten digits data.
- Image compression using [K-Means]({{site.url}}{{site.baseurl}}/k-means-clustering) -- [Open in HTML](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/mini-projects/notebook_in_html/K_Means_image_compression.html) -- [Open in Colab](https://colab.research.google.com/github/dinhanhthi/data-science-learning/blob/master/mini-projects/K_Means_image_compression.ipynb).


## K-medois clustering



## References

- **Luis Serrano** -- [Video] [Clustering: K-means and Hierarchical](https://www.youtube.com/watch?v=QXOkPvFM6NU).
- **Andrew NG.** -- [My raw note](https://rawnote.dinhanhthi.com//machine-learning-coursera-8#k-means-algorithm) of the course ["Machine Learning" on Coursera](https://www.coursera.org/learn/machine-learning/).

{% endkatexmm %}
