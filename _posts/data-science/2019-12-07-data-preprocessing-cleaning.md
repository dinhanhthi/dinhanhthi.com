---
layout: post
title: "Data Preprocessing & Cleaning"
categories: [data science]
icon-photo: data-processing.png
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

{% updfreq %}


In this note, I use `df` as `DataFrame`, `s` as `Series`.

## Libraries

~~~ python
import pandas as pd # import pandas package
import numpy as np
~~~

## Other tasks

<div class="two-columns-list" markdown="1">
- [Data Overview]({{site.url}}{{site.baseurl}}/dataframe-overview)
- [Data Aggregation]({{site.url}}{{site.baseurl}}/data-aggregation)
- [Data Combining]({{site.url}}{{site.baseurl}}/data-combining)
</div>

## Deal with unnecessary columns

Removing columns,

~~~ python
df.drop('New', axis=1, inplace=True) # drop column 'New'
df.drop(['col1', 'col2'], axis=1, inplace=True)
~~~

Only keep some,

~~~ python
kept_cols = ['col1', 'col2', ...]
df = df[kept_cols]
~~~

## Make index

Check if a column has unique values (so that it can be an index)

~~~ python
df['col'].is_unique # True if yes
~~~

Transform an index to column to a normal column,

~~~ python 
df.reset_index(inplace=True)
~~~

Make a column be an index,{% ref https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.set_index.html %}

~~~ python
df.set_index('column')
df.set_index(['col1', 'col2'])
~~~

## Deal with `NaN`

### Drop if `NaN`

~~~ python
# Drop any rows which have any nans
df.dropna()

# Drop columns that have any nans
df.dropna(axis=1)

# Only drop columns which have at least 90% non-NaNs
df.dropna(thresh=int(df.shape[0] * .9), axis=1)
~~~

### Fill `NaN` with others

Check other methods of `fillna` [here](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.fillna.html).

~~~ python
# Fill NaN with ' '
df['col'] = df['col'].fillna(' ')

# Fill NaN with 99
df['col'] = df['col'].fillna(99)

# Fill NaN with the mean of the column
df['col'] = df['col'].fillna(df['col'].mean())
~~~

## Do with condition

~~~ python
np.where(if_this_condition_is_true, do_this, else_this)

df['new_column'] = np.where(df[i] > 10, 'foo', 'bar) # example
~~~





