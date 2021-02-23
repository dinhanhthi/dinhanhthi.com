---
layout: post
title: "Type of Time Series"
icon: ts.png
tags: [Time Series]
toc: false
notfull: 1
keywords: "univariate time series multivariate time series"
---

{% assign img-url = '/img/post/time-series' %}

## Univariate vs Multivariate TS

**Univariate time series**: Only one variable is varying over time.

``` bash
# example of univariate dataset
index    Time                   value
0        2016-04-01 06:00:10    1
1        2016-04-01 06:00:20    2
2        2016-04-01 06:00:30    3
```

**Multivariate time series**: Multiple variables are varying over time.

``` bash
# example of multivariate dataset
index    Time                   value_1   value_2   value_3
0        2016-04-01 06:00:10    1         5         2
1        2016-04-01 06:00:20    2         9         8
2        2016-04-01 06:00:30    3         5         1
```