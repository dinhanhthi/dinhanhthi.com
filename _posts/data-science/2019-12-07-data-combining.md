---
layout: post
title: "Data Combining"
categories: [data science]
icon-photo: coupling.png
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

{% updfreq %}


Sometimes, we wanna couple multiple dataframes together. In this note, I use `df` as `DataFrame`, `s` as `Series`.

## Libraries

~~~ python
import pandas as pd
import numpy as np
~~~

## Coupling dfs with `merge()`

There are 4 types of merging, like in [SQL](https://www.w3schools.com/sql/sql_join.asp).

- **Inner**: only includes elements that appear in both dataframes with a common key.
- **Outer**: includes all data from both dataframes.
- **Left**: includes all of the rows from the "left" dataframe along with any rows from the "right" dataframe with a common key; the result retains all columns from both of the original dataframes.
- **Right**: includes all of the rows from the "right" dataframe along with any rows from the "left" dataframe with a common key; the result retains all columns from both of the original dataframes.

~~~ python
# on the same column name
pd.merge(left=df1, right=df2, how='left', on='Country', suffixes=('_df1', '_df2'))

# on different columns,
pd.merge(left=df1, right=df2, how='left', left_on='Country', right_on="Region" suffixes=('_df1', '_df2'))
~~~

## Concatenate dfs with `concat()`

Combining multiples dfs with **the same columns** (`axis=0`),{% ref https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/dataquest-aio/blob/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis/notebooks_in_html/task-2-combining-data-with-pandas.html %}

~~~ python
pd.concat([head_2015, head_2016], ignore_index=True) # default: axis=0
# ignore_index=True prevent duplicating indexes 
~~~

Combining multiples dfs with **the same indexes** (rows) (`axis=1`),

~~~ python
pd.concat([head_2015, head_2016], axis=1)
~~~







