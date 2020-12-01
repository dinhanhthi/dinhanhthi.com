---
layout: post
title: "Data Processing & Cleaning"
tags: [Data Science]
toc: true
icon: data-processing.png
keywords: "pandas numpy remove columns drop choose some column except rename column make index reset_index drop NaNs missing values null fill nans fillnan text data dropna preprocessing warning A value is trying to be set on a copy of a slice from a DataFrame Couple different columns duplicate things need to be checked steps rename index column drop NaNs multi index filled with mean of each row"
---

{% assign img-url = '/img/post/data/data-cleaning' %}

In this note, I use `df` as `DataFrame`, `s` as `Series`.

## Libraries

~~~ python
import pandas as pd # import pandas package
import numpy as np
~~~

## Things need to be checked

<div class="two-columns-list">

1. `csv` file:
    1. Values are separated by `,` of `;`?
    2. Encoding.
    3. Timestamp type.
2. Indexes are sorted?
3. Indexes are continuous with step 1 (especially after using `.dropna()` or `.drop_duplicates`)?
4. Are there `NaN` values? Drop them?
5. Are there duplicates? Drop them?
6. How many unique values?
7. For `0/1` features, they have only 2 unique values (`0` and `1`)?
8. `KDE` plot to check the values distribution.
9. The number of columns?
10. Unique labels?
11. Time series:
    1. Time range.
    2. Time step.
    3. Timestamp's type.
    4. Timezone.
    5. Timestamps are monotonic?
</div>

## Deal with columns

### Remove or Keep some

~~~ python
# REMOVING COLUMNS
df.drop('New', axis=1, inplace=True) # drop column 'New'
df.drop(['col1', 'col2'], axis=1, inplace=True)
~~~

<div class="col-2-equal">

~~~ python
# ONLY KEEP SOME
kept_cols = ['col1', 'col2', ...]
df = df[kept_cols]
~~~

~~~ python
# ALL EXCEPT SOME
df[df.columns.difference(['b'])]
~~~
</div>

### Rename columns

~~~ python
# IMPLICITLY
df.columns = ['Surname', 'Years', 'Grade', 'Location']
~~~

~~~ python
# EXPLICITLY
df.rename(columns={'Name': 'Surname', 'Ages': 'Years'}, inplace=True)
~~~

~~~ python
# A SPECIFIC COLUMN
data.rename(columns={'gdp':'log(gdp)'}, inplace=True)
~~~

~~~ python
# RENAME INDEX COLUMN
df.index.name = 'new_name'
~~~


### Make index

<div class="col-2-equal">

~~~ python
# COLUMN HAS UNIQUE VALUES?
df['col'].is_unique # True if yes
~~~

~~~ python
# INDEX -> NORMAL COLUMN
df.reset_index(inplace=True)
~~~

~~~ python
# NORMAL COLUMN -> INDEX
df.set_index('column')
df.set_index(['col1', 'col2'])
~~~
</div>

### Drop duplicates

👉 [Overview duplicates](/dataframe-overview#duplicates).

~~~ python
# check duplicates
df['Student'].duplicated().any()
~~~

~~~ python
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

<div class="col-2-equal">

~~~ python
# Drop any rows which have any nans
df.dropna()
~~~

~~~ python
# Drop if all values in that col are NA
df.dropna(how='all', axis=1)
~~~

~~~ python
# Drop columns that have any nans
df.dropna(axis=1)
~~~

~~~ python
# Only drop columns having min 90% non-NaNs
df.dropna(thresh=int(df.shape[0]*.9), axis=1)
~~~

~~~ python
# Only keep rows having >=2 non-NA values
df.dropna(thresh=2)
~~~

~~~ python
# Only consider some cols
df.dropna(subset=['col1', 'col2'])
~~~
</div>

~~~ python
# multi-index
df.dropna(subset=[(1,'a'), (1,'b'), (2,'a'), (2,'b')])

# consider all cols '1' and '2'
df.dropna(subset=df.loc[[], [1,2]].columns)
~~~

### Fill `NaN` with others

Check other methods of `fillna` [here](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.fillna.html).

<div class="col-2-equal">

~~~ python
# Fill NaN with ' '
df['col'] = df['col'].fillna(' ')
~~~

~~~ python
# Fill NaN with 99
df['col'] = df['col'].fillna(99)
~~~

``` python
# mean / median of each column
df.fillna(df.mean())
```

~~~ python
# Fill NaN with the mean of the column
df['col'] = df['col'].fillna(df['col'].mean())
~~~

~~~ python
# Fill NA with mean of row
m = df.mean(axis=1)
for col in df.columns:
    df.loc[:, col] = df.loc[:, col].fillna(m)
~~~
</div>

## Do with conditions

~~~ python
np.where(if_this_condition_is_true, do_this, else_this)
df['new_column'] = np.where(df[i] > 10, 'foo', 'bar) # example
~~~

## Work with text data

There are a lot of [methods](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html#method-summary) we can work with text data (`pd.Series.str`). We can use it coupling with [regular expression](/regular-expression).





