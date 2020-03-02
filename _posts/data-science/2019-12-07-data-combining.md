---
layout: post
title: "Data Combining"
categories: [data science]
icon-photo: coupling.png
keywords: coupling dataframes inner outer left right merging pandas display side by side concatenate concat
---

{% assign img-url = '/img/post/data/data-cleaning' %}

{% include toc.html %}

{% include note_html_colab.html %}

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

{:.img-full-85}
![Types of merge]({{img-url}}/type_of_join.png)
*Types of merge, [source](http://www.datasciencemadesimple.com/join-merge-data-frames-pandas-python/).*

On **the same column name**,

~~~ python
# left
df_left = pd.merge(left=df1, right=df2, how='left', on='Col_1', suffixes=('_df1', '_df2'))
# right
df_right = pd.merge(left=df1, right=df2, how='right', on='Col_1', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_left, df_right)
~~~

{:.img-full-normal.pop}
![Merge left and right on the same column name]({{img-url}}/merge_1.jpg)

~~~ python
# inner (defaut)
df_inner = pd.merge(left=df1, right=df2, on='Col_1', suffixes=('_df1', '_df2'))
# outer
df_outer = pd.merge(left=df1, right=df2, how='outer', on='Col_1', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_inner, df_outer)
~~~

{:.img-full-normal.pop}
![Merge inner and outer on the same column name]({{img-url}}/merge_2.jpg)

On the **different column names**,

~~~ python
# left
df_left = pd.merge(left=df1, right=df2, how='left', left_on='Col_1', right_on='Col_X', suffixes=('_df1', '_df2'))

display_side_by_side(df1, df2, df_left)
~~~

{:.img-full-75.pop}
![Merge left on different column names]({{img-url}}/merge_3.jpg)

The result keeps both `Col_1` and `Col_X` while in the case of the same column name, there is only 1 column. Other words, in this case, we only want to keep `Col_1` and don't need `Col_X`. How to do that?

~~~ python
df_left = df1.set_index('Col_1').join(df2.set_index('Col_X'), how="left", lsuffix="_df1", rsuffix="_df2").reset_index()

display_side_by_side(df1, df2, df_left)
~~~

{:.img-full-75.pop}
![Merge left on different column names and keep one column on the result]({{img-url}}/merge_4.jpg)

## Concatenate dfs with `concat()`

~~~ python
# axis=0 (default)
df_concat_0 = pd.concat([df1, df2]) # the same columns
df_concat_1 = pd.concat([df1, df2], axis=1) # the same rows

df_concat_0_idx = pd.concat([df1, df2], ignore_index=True)
# ignore_index=True prevent duplicating indexes 

display_side_by_side(df1, df2, df_concat_0, df_concat_1, df_concat_0_idx)
~~~

{:.img-full-100.pop}
![Concatenate 2 dataframes]({{img-url}}/concat_1.jpg)

## Combine 2 dataframes with missing values

<div class="columns-2 size-2-1" markdown="1">
We consider a situation in that we need to combine 2 dfs containing missing values in each. The missing values will be filled by taking from the others. For example, the value of `C` in the left df can be fulfilled by the value of `C` in the right df.

![Example]({{img-url}}/combine_missing.jpg)
</div>

We can apply rules with [`df.combine`](https://pandas-docs.github.io/pandas-docs-travis/reference/api/pandas.DataFrame.combine.html).







