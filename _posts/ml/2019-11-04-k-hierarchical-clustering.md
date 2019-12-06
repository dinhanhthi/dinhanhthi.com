---
layout: post
title: "Hierarchical Clustering"
categories: [machine learning]
math: 1
icon-photo: clustering.png
---

{% assign img-url = '/img/post/ML/k-means' %}
{% assign file-url = '/files/ml/k-means' %}

{% include toc.html %}

{% notcomplete %}

## What's the idea of Hierarchical Clustering?



## Using Hierarchical Clustering with Python

~~~ python
# Agglomerative Clustering
from sklearn.cluster import AgglomerativeClustering
agglom = AgglomerativeClustering(n_clusters = 4, linkage = 'average')
agglom.fit(X,y)

# Find the distance matrix
from scipy.spatial import distance_matrix
dist_matrix = distance_matrix(X,X)

# Hierarchical clustering
from scipy.cluster import hierarchy
Z = hierarchy.linkage(dist_matrix, 'complete')

# Dendrogram
dendro = hierarchy.dendrogram(Z)
~~~

Some notable parameters (see [full](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html)):

- Choose between `n_clusters` and `distance_threshold`: one of them must be `None`!



Some notable components:





## Hierarchical Clustering in action 



## References

- **Luis Serrano** -- [Video] [Clustering: K-means and Hierarchical](https://www.youtube.com/watch?v=QXOkPvFM6NU).
- **IBM** -- [My raw note](https://rawnote.dinhanhthi.com/ibm-data-professional-certificate-9#hierarchical-clustering) of the course ["Machine Learning with Python" on Coursera](https://www.coursera.org/specializations/ibm-data-science-professional-certificate).





