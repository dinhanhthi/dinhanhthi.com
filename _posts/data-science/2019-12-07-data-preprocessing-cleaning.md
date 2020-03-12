---
layout: post
title: "Data Processing & Cleaning"
categories: [data science]
icon-photo: data-processing.png
keywords: "pandas numpy remove columns drop choose some column except rename column make index reset_index drop NaNs missing values null fill nans fillnan text data dropna preprocessing warning A value is trying to be set on a copy of a slice from a DataFrame Couple different columns duplicate things need to be checked steps"
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

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

## Things need to be checked

<div class="two-columns-list" markdown="1">
1. `csv` file:
    1. Values are separated by `,` of `;`?
    2. Encoding.
    3. Timestamp type.
2. Indexes are sorted?
2. Indexes are continuous with step 1 (especially after using `.dropna()` or `.drop_duplicates`)?
3. Are there `NaN` values? Drop them?
4. Are there duplicates? Drop them?
5. How many unique values?
6. For `0/1` features, they have only 2 unique values (`0` and `1`)?
7. `KDE` plot to check the values distribution.
8. The number of columns?
9. Unique labels?
9. Time series:
    1. Time range.
    2. Time step.
    3. Timestamp's type.
    4. Timezone.
    5. Timestamps are monotonic?
</div>

## Deal with columns

### Remove or Keep some

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

Choose all columns except some,

~~~ python
df[df.columns.difference(['b'])]
~~~

### Rename columns

In this part, we are going to use below dataframe `df`.

{:.dataframe}
|  | Name | Ages | Marks | Place |
|---|-------|------|-------|-------------------|
| 0 | John | 10 | 8 | Ben Tre |
| 1 | Thi | 20 | 9 | Paris |

~~~ python
# implicitly
df.columns = ['Surname', 'Years', 'Grade', 'Location']

# explicitly
df.rename(columns={
  'Name': 'Surname',
  'Ages': 'Years',
  ...
}, inplace=True)
~~~

We can use the *explicit* method to rename a specific column in df.

~~~ python
data.rename(columns={'gdp':'log(gdp)'}, inplace=True)
~~~

### Make index

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

### Drop duplicates

👉 [Overview duplicates](/dataframe-overview#duplicates).

~~~ python
# check duplicates
df['Student'].duplicated().any()

# remove duplicates in some columns
df.drop_duplicates(['col1', 'col2'])
# use "ignore_index=True" if you wanna reset indexes to 0,1,...,n-1
~~~

### Couple different columns

~~~ python
df = df0[['Date', 'Heure', 'tH (°C)']].copy()
df['timestamp'] = df['Date'] + ' ' + df['Heure']

# if you use without `.copy()`
# WARNING: A value is trying to be set on a copy of a slice from a DataFrame. 
~~~

## Deal with missing values `NaN`

👉 [Overview missing values](/dataframe-overview#missing-values).

### Drop `NaN` values

Full reference of `dropna` is [here](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.dropna.html).

~~~ python
# Drop any rows which have any nans
df.dropna()

# Drop if all values in that row/columns are NA
df.dropna(how='all') # default: how='any'

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

## Do with conditions

~~~ python
np.where(if_this_condition_is_true, do_this, else_this)
df['new_column'] = np.where(df[i] > 10, 'foo', 'bar) # example
~~~

## Work with text data

There are a lot of [methods](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html#method-summary) we can work with text data (`pd.Series.str`). We can use it coupling with [regular expression](/regular-expression).





