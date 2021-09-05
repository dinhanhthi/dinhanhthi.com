---
layout: post
title: "Data Combining"
tags: [Data Science]
toc: true
icon: /img_src/header/coupling.png
keywords: coupling dataframes inner outer left right merging pandas display side by side concatenate concat
---

{% assign img-url = '/img/post/data/data-processing' %}

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

![Types of merge]({{img-url}}/type_of_join.png){:.img-full-100}

On **the same column name**,

~~~ python
# left
df_left = pd.merge(left=df1, right=df2, how='left', on='Col_1', suffixes=('_df1', '_df2'))
# right
df_right = pd.merge(left=df1, right=df2, how='right', on='Col_1', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_left, df_right)
~~~

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>B</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>F</td>
      <td>-4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>E</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
:::

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>B</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <th>4</th>
      <td>F</td>
      <td>NaN</td>
      <td>-4</td>
    </tr>
  </tbody>
</table>
:::

~~~ python
# inner (defaut)
df_inner = pd.merge(left=df1, right=df2, on='Col_1', suffixes=('_df1', '_df2'))
# outer
df_outer = pd.merge(left=df1, right=df2, how='outer', on='Col_1', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_inner, df_outer)
~~~

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>B</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>F</td>
      <td>-4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>E</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
:::

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>B</td>
      <td>2</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <th>5</th>
      <td>F</td>
      <td>NaN</td>
      <td>-4</td>
    </tr>
  </tbody>
</table>
:::

On the **different column names**,

~~~ python
# left
df_left = pd.merge(left=df1, right=df2, how='left', left_on='Col_1', right_on='Col_X', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_left)
~~~

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_X</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>B</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>F</td>
      <td>-4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>E</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
:::

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_X</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
      <td>E</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>C</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
:::

The result keeps both `Col_1` and `Col_X` while in the case of the same column name, there is only 1 column. Other words, in this case, we only want to keep `Col_1` and don't need `Col_X`. How to do that?

~~~ python
df_left = df1.set_index('Col_1').join(df2.set_index('Col_X'), how="left", lsuffix="_df1", rsuffix="_df2").reset_index()

display_side_by_side(df1, df2, df_left)
~~~

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2.0</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_X</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>B</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>-3.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>F</td>
      <td>-4.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>E</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
:::

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2_df1</th>
      <th>Col_2_df2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1.0</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
      <td>-3.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2.0</td>
      <td>2.0</td>
    </tr>
  </tbody>
</table>