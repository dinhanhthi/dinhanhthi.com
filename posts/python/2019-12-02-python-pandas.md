---
layout: post
title: "Pandas extra"
tags: [Python]
toc: true
icon: "/img/header/pandas.png"
keywords: "pandaframe series df dataframe data overview data aggregation data combining data preprocessing cleaning row column select values export write csv files output input sep separate comma semicolon read csv read_csv from dictionary list numpy array np.array to_csv write to files multiindex indexing reverse values True False element wise invert integer rows and named columns index and column name selection convert true false to 1 0 add a row to current dataframe isin"
---

{% assign img-url = '/img/post/python/pandas' %}

In this note, a general dataframe is called `df` (type `pandas.core.frame.DataFrame`), a general series is call `s` (type `pandas.core.series.Series`).

## Import library

~~~ python
import pandas as pd
import numpy as np # import numpy if necessary
~~~

## Read/Write `.csv` file

~~~ python
# READ
df = pd.read_csv('filename.csv', sep=';') # default sep=','

# if 1st col contains 0,1,2,...
df = pd.read_csv('filename.csv', index_col=1)

# with datetime info
df = pd.read_csv(PATH_DATA_FOLDER+"raw_data.csv",
                  parse_dates=['timestamp'],
                  infer_datetime_format=True,
                  cache_dates=True)
~~~

~~~ python
# WRITE
df.to_csv(path, index=False) # don't incldue index
~~~

## Create a dataframe

~~~ python
# FROM A LIST
pd.DataFrame(a_list, colummns=['col_name'])
~~~

::: col-2-flex
~~~ python
# FROM A DICTIONARY
names = ['John', 'Thi', 'Bi', 'Beo', 'Chang']
ages =  [10, 20, 21, 18, 11]
marks = [8, 9, 10, 6, 8]
city = ['Ben Tre', 'Paris', 'Ho Chi Minh Ville', 'New York', 'DC']

my_dict = {'Name':names, 'Ages':ages, 'Marks':marks, 'Place': city}
students = pd.DataFrame(my_dict)
~~~

|  | Name | Ages | Marks | Place |
|---|-------|------|-------|-------------------|
| 0 | John | 10 | 8 | Ben Tre |
| 1 | Thi | 20 | 9 | Paris |
| 2 | Bi | 21 | 10 | Ho Chi Minh Ville |
| 3 | Beo | 18 | 6 | New York |
| 4 | Chang | 11 | 8 | DC |
:::

## Adding

<div class="col-2-equal">

~~~ python
# a column
df['new_col] = [new_values]
~~~

~~~ python
# a row
df.loc['new_index'] = [new_value]
~~~
</div>

``` python
# add a new col based on another's values
df_im = df0.copy()[['col']]
df_im['status'] = df0['col'].apply(lambda row: 1 if row>=80 else 0)
```

## Shuffle rows

``` python
# shuffle all rows and reset the index
df_new = df.sample(frac=1).reset_index(drop=True)
```

## Sorting

``` python
df.sort_values(by='col1', ascending=False)
```

## Select rows/columns/item(s)

👉 [Indexing and selecting data — pandas 1.1.2 documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html)

### Select Single value

**Select a single value** (with condition): Get the mark of `Thi` (`9`).

~~~ python
# interchange `.values[0]` and `.iloc[0]`
df[df.Name=='Thi'].Marks.values[0]
df.loc[df.Name=='Thi', 'Marks'].values[0]
~~~

~~~ python
# with indexes
df.iloc[1,2] # row 2, column 3
~~~

~~~ python
# column's name with row's index
df[['Marks']].iloc[1].values[0] # column 'Marks', row 2
~~~

~~~ python
# column's index with row's value
df[df.Name=='Thi'].iloc[:,2].values[0] # column 3, row of 'Thi'
~~~

### Select integer rows and named columns

~~~ python
df.loc[1:5, 'col']
~~~

### Select columns

**Select a column** (returns a `Series`)

<div class="col-2-equal">

~~~ python
# with column's name
df['Name']
df.loc[:, 'Name']
~~~

~~~ python
# with an index
df.iloc[:,0]
~~~
</div>

Returns a `pd.DataFrame`,

<div class="col-2-equal">

~~~ python
df[['Name']]
df.loc[:, ['Name']]
~~~

~~~ python
# with an index
df.iloc[:,[0]]
~~~
</div>

**Select multi-columns** (type `DataFrame`): Get columns `Name` & `Place`:

<div class="col-2-equal">

~~~ python
# using columns's names
df[['Name', 'Place']]
df.loc[:, ['Name', 'Place']]
~~~

~~~ python
# using indexes
df.iloc[:, [0,-1]]
~~~
</div>

### Select rows

**Select a row** (returns a `Series`)

<div class="col-2-equal">

``` python
# with an index
df.iloc[1]
```

``` python
# with a condition
df[df['Name']=='Thi'] # DataFrame
df[df['Name']=='Thi'].iloc[0] # Series
```

``` python
df[df.Name=='Thi'] # DataFrame
df[df.Name=='Thi'].iloc[0] # Series
df[df.Name=='Thi'].values[0] # ndarray
```
</div>

**Select multi-rows** (type `DataFrame`)

<div class="col-2-equal">

~~~ python
# using indexes
df.iloc[:3]
df.loc[:2]
~~~

``` python
# with conditions
df[df['A'].isin([3, 6])]
```
</div>

## MultiIndex

👉 [MultiIndex / advanced indexing — pandas 1.1.2 documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/advanced.html)

### All multiindex

~~~ python
arrays = [['bar', 'bar', 'baz', 'baz', 'foo', 'foo'], ['one', 'two', 'one', 'two', 'one', 'two']]
index = pd.MultiIndex.from_arrays(arrays)
df = pd.DataFrame(np.random.randn(3, 6), index=['A', 'B', 'C'], columns=index)
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th colspan="2" halign="left">bar</th>
      <th colspan="2" halign="left">baz</th>
      <th colspan="2" halign="left">foo</th>
    </tr>
    <tr>
      <th></th>
      <th>one</th>
      <th>two</th>
      <th>one</th>
      <th>two</th>
      <th>one</th>
      <th>two</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A</th>
      <td>-0.752333</td>
      <td>0.490581</td>
      <td>0.774629</td>
      <td>0.487185</td>
      <td>1.767773</td>
      <td>0.028956</td>
    </tr>
    <tr>
      <th>B</th>
      <td>-0.057864</td>
      <td>-0.221516</td>
      <td>-0.568726</td>
      <td>-0.563732</td>
      <td>1.362453</td>
      <td>-0.563213</td>
    </tr>
    <tr>
      <th>C</th>
      <td>-0.338319</td>
      <td>-0.346590</td>
      <td>0.012845</td>
      <td>0.755455</td>
      <td>1.260937</td>
      <td>-0.038209</td>
    </tr>
  </tbody>
</table>

Selection,

::: code-output-equal
~~~ python
df.loc['A', ('baz', 'two')]
~~~

~~~
0.487185
~~~
:::

::: code-output-equal
~~~ python
df.loc[:,('baz', 'two')]
~~~

~~~
A    0.487185
B   -0.563732
C    0.755455
Name: (baz, two), dtype: float64
~~~
:::

### With a single name column

If there are some column with single name,

~~~ python
arrays = [['bar', 'bar', 'baz', 'baz', 'foo', 'foo'], [i for i in range(2)]*3]
index = pd.MultiIndex.from_arrays(arrays)
df1 = pd.DataFrame(np.random.randn(3, 6), index=['A', 'B', 'C'], columns=index)
~~~

#### Good practice

~~~ python
# GOOD PRACTICE
df1['time'] = [1,2,3]
df_rs2 = df1
~~~

<table class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="2" halign="left">bar</th>
      <th colspan="2" halign="left">baz</th>
      <th colspan="2" halign="left">foo</th>
      <th>time</th>
    </tr>
    <tr>
      <th></th>
      <th>0</th>
      <th>1</th>
      <th>0</th>
      <th>1</th>
      <th>0</th>
      <th>1</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A</th>
      <td>-1.386119</td>
      <td>-0.496755</td>
      <td>1.482855</td>
      <td>0.943795</td>
      <td>-1.173290</td>
      <td>-0.445365</td>
      <td>1</td>
    </tr>
    <tr>
      <th>B</th>
      <td>-0.900710</td>
      <td>-1.571009</td>
      <td>1.086964</td>
      <td>1.546927</td>
      <td>-1.564426</td>
      <td>0.622763</td>
      <td>2</td>
    </tr>
    <tr>
      <th>C</th>
      <td>0.712231</td>
      <td>0.235247</td>
      <td>-0.807031</td>
      <td>0.671802</td>
      <td>0.597149</td>
      <td>0.111332</td>
      <td>3</td>
    </tr>
  </tbody>
</table>

Selection,

::: code-output-equal
~~~ python
# FOR GOOD PRACTICE
df_rs2.loc['A', ('baz', 1)]
df_rs2.loc['A', 'baz']
~~~

~~~ bash
0.943795
0    1.482855
1    0.943795
~~~
:::

#### Bad practice

~~~ python
# BAD PRACTICE
df2 = pd.DataFrame([1,2,3], index=['A', 'B', 'C'], columns=['time'])
df_rs1 = pd.concat([df1, df2], axis=1)
~~~

<table class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>(bar, 0)</th>
      <th>(bar, 1)</th>
      <th>(baz, 0)</th>
      <th>(baz, 1)</th>
      <th>(foo, 0)</th>
      <th>(foo, 1)</th>
      <th>time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A</th>
      <td>-1.386119</td>
      <td>-0.496755</td>
      <td>1.482855</td>
      <td>0.943795</td>
      <td>-1.173290</td>
      <td>-0.445365</td>
      <td>1</td>
    </tr>
    <tr>
      <th>B</th>
      <td>-0.900710</td>
      <td>-1.571009</td>
      <td>1.086964</td>
      <td>1.546927</td>
      <td>-1.564426</td>
      <td>0.622763</td>
      <td>2</td>
    </tr>
    <tr>
      <th>C</th>
      <td>0.712231</td>
      <td>0.235247</td>
      <td>-0.807031</td>
      <td>0.671802</td>
      <td>0.597149</td>
      <td>0.111332</td>
      <td>3</td>
    </tr>
  </tbody>
</table>

Selection,

::: code-output-flex
~~~ python
# FOR BAD PRACTICE
df.loc['A', [('baz', 0)]]
df_rs1.loc['A', [('baz', i) for i in [0,1]]]
~~~

~~~ bash
(baz, 0)    0.729023
(baz, 0)    1.482855
(baz, 1)    0.943795
~~~
:::

### Rename multiindex

~~~ python
# all columns' name at the level 1
df.columns.set_levels(['b1','c1','f1'], level=1, inplace=True)
~~~

### Drop multiindex

::: code-output-equal
``` python
df.columns = df.columns.droplevel()
```

``` python
   a
   b  c         b c
0  1  2   ->  0 1 2
1  3  4       1 3 4
```
:::

## Compare 2 dataframes

``` python
df1.equals(df2)
```

## True / False

<div class="col-2-equal">

~~~ python
# Invert True/False value in Series
s = pd.Series([True, True, False, True])
~s
~~~

~~~ python
# Convert True / False to 1 / 0
df['col'] = df['col'].astype(int)
# int or float
~~~
</div>


