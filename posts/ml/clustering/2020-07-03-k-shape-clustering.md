---
layout: post
title: "K-Shape clustering"
tags: [Machine Learning, Clustering]
toc: true
icon: clustering.png
notfull: 1
keywords: "clustering time series"
---

{% assign img-url = '/img/post/ML/clustering' %}

## What?

K-Shape clustering method is a method for <mark>clustering time series</mark>.

The main ideas of this algorithms are:

{:.indent}
- The distance measure is based on the cross-correlation of two time series.
- The clustering process uses iterative approaches.
- It is a raw-based method. It is fundamentally a variant of k-means with some interesting modification.
  - Define a distance between 2 time series.
  - How to average multiple time series.


## References

- (article) [k-Shape: Efficient and Accurate Clustering of Time Series](http://people.cs.uchicago.edu/~jopa/Papers/PaparrizosSIGMOD2015.pdf)
- **Ryan's blog** -- [K-Shape Clustering Algorithm](http://ryansiroiro.blogspot.com/2018/07/k-shape-clustering-algorithm.html)