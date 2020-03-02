---
layout: post
title: "Data Aggregation"
categories: [data science]
icon-photo: aggregation.png
keywords: dataframe groupby group agg apply pivot table melt tables 
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

In this note, I use `df` as `DataFrame`, `s` as `Series`.

## Libraries

~~~ python
import pandas as pd # import pandas package
import numpy as np
~~~

## Group dataset using `groupby()`

Group `df` by column `Region` and then selct the column `Paris`,

~~~ python
df.groupby('Region').get_group('Paris') # returns a df
~~~

Select just the `GDP` column and then find the `mean`,

~~~ python
df.groupby('Region')['GDP'].mean()
# other methods: size, max, min, count
~~~

Apply multiple/custom functions,

~~~ python
df.groupby(['Region', 'City']).agg([np.mean, np.max]) # return a df
df.groupby(['Region', 'City']).agg(func) # custom function
~~~

Or using `apply` and `lambda` function,

~~~ python
orders.groupby('shoes').price.apply(lambda x: np.min(x, 25)).reset_index()
~~~

## Group using `pivot_table()`

Group by `Region` (as an index) and choosing `GDP` and `City` columns,{% ref https://github.com/dinhanhthi/data-science-learning/blob/master/codecademy-data-science/course-10%20Data%20Analysis%20with%20Pandas/Aggregates%20in%20Pandas.ipynb %}

~~~ python
df.pivot_table(values=['GDP', 'City'], index='Region') # returns df
~~~

Apply some functions,

~~~ python
df.pivot_table(['GDP', 'City'], 'Region', aggfunc=[np.mean, np.max], margins=True)
# margins shows the "All" row
~~~

## Reorganizing df using `pivot()`

Make values in one columns be columns in a new "pivot" table,{% ref https://github.com/dinhanhthi/data-science-learning/blob/master/codecademy-data-science/course-10%20Data%20Analysis%20with%20Pandas/Aggregates%20in%20Pandas.ipynb %}

~~~ python
pivot_1 = df.pivot(index='foo', columns='bar', values='baz')
pivot_2 = df.pivot(index='foo', columns='bar')['baz']
pivot_3 = df.pivot(index='foo', columns='bar', values=['baz', 'zoo'])
~~~

{:.img-full-85.pop}
![Pivot table]({{img-url}}/pivot.jpg)

## Change shape of df with `melt()`

Contrary to `pivot`, we now want to transform several columns into values of a single column,{% ref https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/dataquest-aio/blob/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis/notebooks_in_html/task-3-transforming-data-with-pandas.html %}

~~~ python
# before: 6 columns

main_cols = ['A', 'B', 'C'] # columns will be kept (they are fix as ids)
factors = ['D', 'E', 'F'] # columns will be melt
pd.melt(df, id_vars = main_cols, value_vars = factors) # new df

# after melting: new df with 5 columns 
# (1 columns containg D, E, F and 1 column containing their values)
~~~

## References

- [Data Cleaning and Analysis](https://github.com/dinhanhthi/dataquest-aio/tree/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis) on Dataquest.
- [Transforming data with pandas](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/dataquest-aio/blob/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis/notebooks_in_html/task-3-transforming-data-with-pandas.html) on Dataquest.


