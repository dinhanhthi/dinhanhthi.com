---
layout: post
title: "K-Means Clustering"
categories: [machine learning]
math: 1
icon-photo: clustering.png
date: 2020-03-05
keywords: k means k-means clustering method sensitive to outliers partitioning clustering cluster k-medoids k medoids PAM oartitioning around medoids handwritten digits data Luis Serrano Andrew NG elbow method number of clusters
---

{% assign img-url = '/img/post/ML/k-means' %}
{% assign file-url = '/files/ml/k-means' %}

{% include toc.html %}

## What's the idea of K-Means?

## How to choose number of clusters?

Using "Elbow" method.

## Discussion

- A type of Partitioning clustering.
- The K-means method is sensitive to outliers ⇒ **K-medoids** clustering or **PAM** (Partitioning Around Medoids) is less sensitive to outliers{% ref https://www.datanovia.com/en/blog/types-of-clustering-methods-overview-and-quick-start-r-code/ %}

## Using K-Means with Scikit-learn

~~~ python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=10, random_state=0) # default k=8
kmeans.fit(X)

kmeans.predict(X)
~~~

Some notable parameters (see [full](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)):

- `max_iter`{:.tpink}: Maximum number of iterations of the k-means algorithm for a single run.

Some notable components:

- `kmeans.labels_`{:.tpink}: show labels of each point.
- `kmeans.cluster_centers_ `{:.tpink}: cluster centroids.


## K-Means in action 

- K-Means clustering on the handwritten digits data.
- Image compression using [K-Means]({{site.url}}{{site.baseurl}}/k-means-clustering) -- [Open in HTML](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/mini-projects/notebook_in_html/K_Means_image_compression.html) -- [Open in Colab](https://colab.research.google.com/github/dinhanhthi/data-science-learning/blob/master/mini-projects/K_Means_image_compression.ipynb).


## K-medois clustering




## References

- **Luis Serrano** -- [Video] [Clustering: K-means and Hierarchical](https://www.youtube.com/watch?v=QXOkPvFM6NU).
- **Andrew NG.** -- [My raw note](https://rawnote.dinhanhthi.com//machine-learning-coursera-8#k-means-algorithm) of the course ["Machine Learning" on Coursera](https://www.coursera.org/learn/machine-learning/).
