---
layout: post
title: "Data Overview"
tags: [Data Science]
toc: true
icon: data-overview.png
keywords: "dataframe dataset import csv pandas numpy describe shape dtype list of columns counting missing values NaNs null heatmap seaborn check duplicate show all deal handle processing KDE Kernel Density Estimation values distribution bar plot visuzlize visualization null values percentage features"
---

{% assign img-url = '/img/post/data/data-cleaning' %}

In this note, I use `df` as `DataFrame`, `s` as `Series`.

## Libraries

~~~ python
import pandas as pd # import pandas package
import numpy as np
~~~

## Import and have a look

~~~ python
df = pd.read_csv('filename.csv', na_values=['none']) # "none" is missing data
df.head() # read first 5 rows
df.tail() # last 5 rows
df.head(10) # first 10 rows
~~~

## Get general infos

~~~ python
df.info() # show dtype of dataframe
df.describe() # numerical features
df.describe(include=['O']) # categorical features
df.describe(include='all') # all types

df.shape # dataframe's shape
df.dtypes # type of each column

df.get_dtype_counts() # count the number of data types
~~~

Check distribution of values using **KDE** (Kernel Density Estimation),

~~~ python
plt.figure(figsize=(20, 5))
df['value'].plot.kde()
~~~

## Get columns' info

<div class="col-2-equal">

~~~ python
# LIST OF COLUMNS
df.columns
len(df.columns) # #cols?
~~~

~~~ python
# UNIQUE VALUES IN COL
df['col'].unique()
df['col'].unique().size #unique vals
df['col'].nunique() # number of unique vals
~~~
</div>

## Counting

~~~ python
# Counting #elements of each class in df
df.Classes.value_counts() # give number of each 0 and 1
~~~

``` python
# count #elements each unique values in a col/series
df[col].value_counts()
```

## Missing values

👉 [Handle missing values](/data-preprocessing-cleaning#deal-with-missing-values-nan).

<div class="col-2-equal">

``` python
# total number of nans in df
df.isnull().sum().sum()
```

~~~ python
# #nans in each col (including zeros)
df.isnull().sum()
~~~

``` python
# #not-nans in each col
df.count()

# each row
df.count(axis=1)
```

~~~ python
# columns having the nulls (any nan)
null_columns = df.columns[df.isna().any()].tolist()

# how many?
df[null_columns].isnull().sum()
~~~

~~~ python
# number of rows having ALL nans
df.isna().all(axis=1).sum()
~~~

~~~ python
# number of columns having ALL nans
df.isna().all(axis=0).sum()
~~~

~~~ python
# find index of rows having ALL nans
df.index[df.isna().all(axis=1)].to_list()
~~~
</div>

~~~ python
# number of nans in df
df.isnull().sum().sort_values(ascending=False)
# find % of null values
(df.isnull().sum()/df.isnull().count()*100).sort_values(ascending=False)
~~~

~~~ python
# Visualize the locations of missing values,
import seaborn as sns
df = df.set_index('YEAR') # y-axis is YEAR
sns.heatmap(df.isnull(), cbar=False) # x-axis is columns' name
~~~

``` python
# Plot the percentage of nans w.r.t. each column (feature)
df_tmp = (df.isnull().sum()/df.isnull().count()*100).sort_values(ascending=False).to_frame(name='percentage')
df_tmp.reset_index().plot(kind='bar', x='index', y='percentage', figsize=(20,5))
plt.xlabel('features', fontsize=14)
plt.ylabel('% of nans', fontsize=14)
```

## Duplicates

👉 [Handle duplicates](/data-preprocessing-cleaning#drop-duplicates).

~~~ python
# Check if there are duplicated values?
df['col'].duplicated().any() # returns True/False
~~~

~~~ python
# How many duplicates? (only count the first occurs)
df['col'].duplicated().sum()
~~~

~~~ python
# How many (including the repeated occurs)
df['col'].duplicated(keep=False).sum()
~~~

~~~ python
# List all duplicated values (LONG EXECUTING!!!)
pd.concat( g for _, g in df.groupby('col') if len(g)>1 )
~~~


