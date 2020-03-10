---
layout: post
title: "Time Series tips"
categories: [time series]
keywords: "find the common time invervals timestamps burst detection bursting burst firing term terminology"
---

{% include toc.html %}

{% assign img-url = '/img/post/time-series' %}

## Terminology

- **Burst detection**: An unexpectedly large number of events occurring within some certain temporal or spatial region is called
a burst, suggesting unusual behaviors or activities.

## Find the common interval

Suppose we have data like in below, we wanna find the common length interval of all groups.

{:.img-full-100}
![Group of time series intervals]({{img-url}}/ts-interval-example.png)

~~~ python
# Find the biggest gap
df['date'].diff().value_counts().index.max()
~~~