---
layout: post
title: "Pandas"
categories: [python]
icon-photo: pandas.png
---

{% assign img-url = '/img/post/python/pandas' %}

{% include toc.html %}

{% updfreq %}

In this note, a general dataframe is called `df` (type `pandas.core.frame.DataFrame`), a general series is call `s` (type `pandas.core.series.Series`).

## Import library

~~~ python
import pandas as pd
import numpy as np # import numpy if necessary
~~~

## Read `.csv` file

~~~ python
df = pd.read_csv('filename.csv')
df.head() # read first 5 rows
df.tail() # last 5 rows
df.head(10) # first 10 rows
~~~

## Get info

~~~ python
df.info() # show dtype of dataframe
df.describe() # distributions, dispersion, shape of dataset,...

df.shape # dataframe's shape
df.dtypes # type of each column
~~~

## Create a dataframe

From a dictionary

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ python
names = ['John', 'Thi', 'Bi', 'Beo', 'Chang']
ages =  [10, 20, 21, 18, 11]
marks = [8, 9, 10, 6, 8]
city = ['Ben Tre', 'Paris', 'Ho Chi Minh Ville', 'New York', 'DC']

my_dict = {'Name':names, 'Ages':ages, 'Marks':marks, 'Place': city}
students = pd.DataFrame(my_dict)
~~~

{:.flex-even.overflow-auto.pl-md-1}
<div markdown="1">

{:.font-95}
|  | Name | Ages | Marks | Place |
|---|-------|------|-------|-------------------|
| 0 | John | 10 | 8 | Ben Tre |
| 1 | Thi | 20 | 9 | Paris |
| 2 | Bi | 21 | 10 | Ho Chi Minh Ville |
| 3 | Beo | 18 | 6 | New York |
| 4 | Chang | 11 | 8 | DC |

</div>
</div>

## Select rows/columns/item(s)

In this part, we are going to use below dataframe `df`.

{:.font-95}
|  | Name | Ages | Marks | Place |
|---|-------|------|-------|-------------------|
| 0 | John | 10 | 8 | Ben Tre |
| 1 | Thi | 20 | 9 | Paris |
| 2 | Bi | 21 | 10 | Ho Chi Minh Ville |
| 3 | Beo | 18 | 6 | New York |
| 4 | Chang | 11 | 8 | DC |

**Select a single value**{:.tbrown} (with condition): Get the mark of `Thi` (`9`).

~~~ python
# interchange `.values[0]` and `.iloc[0]`
df[df.Name=='Thi'].Marks.values[0]
df.loc[df.Name=='Thi', 'Marks'].values[0]

# with indexes
df.iloc[1,2] # row 2, column 3

# column's name with row's index
df[['Marks']].iloc[1].values[0] # column 'Marks', row 2

# column's index with row's value
df[df.Name=='Thi'].iloc[:,2].values[0] # column 3, row of 'Thi'
~~~

**Select a column**{:.tbrown} (type `Series`): Get column `Name`.

~~~ python
# with column's name
df['Name']
df.loc[:, 'Name']

# with an index
df.iloc[:,0]
~~~

Select multi-columns (type `DataFrame`): Get columns `Name` & `Place`:

~~~ python
# using columns's names
df[['Name', 'Place']]
df.loc[:, ['Name', 'Place']]

# using indexes
df.iloc[:, [0,-1]]
~~~

**Select a row**{:.tbrown} (type `Series`): Get row `Thi`.

<div class="code-box-copy" markdown="1">
~~~ python
# with an index
df.iloc[1]

# with a condition
df[df['Name']=='Thi'] # type: DataFrame
df[df['Name']=='Thi'].iloc[0] # type: Series

df[df.Name=='Thi'] # type: DataFrame
df[df.Name=='Thi'].iloc[0] # type: Series
df[df.Name=='Thi'].values[0] # type: ndarray
~~~ 
</div>

Select multi-rows (type `DataFrame`): Get first 3 rows of dataset,

~~~ python
# using indexes
df.iloc[:3]
df.loc[:2]
~~~

