---
layout: post
title: "K-Means Clustering"
categories: [machine learning]
math: 1
icon-photo: clustering.png
---

{% assign img-url = '/img/post/ML/k-means' %}
{% assign file-url = '/files/ml/k-means' %}

{% include toc.html %}

{% notcomplete %}

## What's the idea of K-Means?



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


## References

- **Luis Serrano** -- [Video] [Clustering: K-means and Hierarchical](https://www.youtube.com/watch?v=QXOkPvFM6NU).
- **Andrew NG.** -- [My raw note](https://rawnote.dinhanhthi.com//machine-learning-coursera-8#k-means-algorithm) of the course ["Machine Learning" on Coursera](https://www.coursera.org/learn/machine-learning/).





