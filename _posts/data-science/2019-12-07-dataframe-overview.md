---
layout: post
title: "Data Overview"
categories: [data science]
icon-photo: data-overview.png
keywords: "dataframe dataset import csv pandas numpy describe shape dtype list of columns counting missing values NaNs null heatmap seaborn check duplicate show all deal handle processing KDE Kernel Density Estimation values distribution"
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

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

~~~ python
# LIST OF COLUMNS
df.columns
len(df.columns) # count the number of columns

# UNIQUE VALUES IN COL
df['col'].unique()
~~~

## Counting

Counting the number of elements of each class in df,

~~~ python
df.Classes.value_counts() # give number of each 0 and 1
~~~

## Missing values

👉 [Handle missing values](/data-preprocessing-cleaning#deal-with-missing-values-nan).

Show the number of missing values in each column (including the zero ones)

~~~ python
df.isnull().sum()
~~~

If you wanna show the columns having the null,

~~~ python
null_columns = df.columns[f().any()]
df[null_columns].isnull().sum()
~~~

The number of `null` values in df (missing values),

~~~ python
df.isnull().sum().sort_values(ascending=False)
df.isnull().sum()/df_train.isnull().count()*100 # find % of null values
~~~

Visualize the locations of missing values,

~~~ python
import seaborn as sns
df = df.set_index('YEAR') # y-axis is YEAR
sns.heatmap(df.isnull(), cbar=False) # x-axis is columns' name
~~~

## Duplicates

👉 [Handle duplicates](/data-preprocessing-cleaning#drop-duplicates).

~~~ python
# Check if there are duplicated values?
df['col'].duplicated().any() # returns True/False

# How many duplicates? (only count the first occurs)
df['col'].duplicated().sum()

# How many (including the repeated occurs)
df['col'].duplicated(keep=False).sum()

# List all duplicated values (LONG EXECUTING!!!)
pd.concat( g for _, g in df.groupby('col') if len(g)>1 )
~~~


