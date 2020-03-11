---
layout: post
title: "Time Series tips"
categories: [time series]
keywords: "find the common time invervals timestamps burst detection bursting burst firing term terminology gaps biggest gaps spaces algorithm starting and ending of each window average moyenne size max min"
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
# find the biggest gap
df['date'].diff().max()

# 4 biggest gaps
df['date'].diff().sort_values().iloc[-5:]

# count the number of windows
df['date'].shape[0] - df.['date'].diff().sort_values().diff().abs().reset_index().timestamp.idxmax()

# starting of each window (the gap used to separate windows is '1D')
w_starts = df.reset_index()[~(df['date'].diff() < pd.to_timedelta('1D'))].index

# ending of each window
w_ends = (w_starts[1:] - 1).append(pd.Index([df.shape[0]-1]))

# the biggest/average window size (in points)
(w_ends - w_starts).max()
(w_ends - w_starts).values.mean()

# the biggest window size (in time range)
pd.Timedelta((df.iloc[w_ends]['date'] - df.iloc[w_starts]['date']).max(), unit='ns')
~~~

If you wanna add a `window` column to the original dataframe,

~~~ python
df_tmp = df.copy()
w_idx = 0
for i in range(w_starts.shape[0]):
    df_tmp.loc[w_starts[i]:(w_ends[i]+1), 'window'] = w_idx
    w_idx += 1
df_tmp.window = df_tmp.window.astype(int) # convert dtype to int64
~~~