---
layout: post
title: "Data Aggregation"
tags: [Data Science]
toc: true
icon: /img/header/aggregation.png
keywords: "dataframe groupby group agg apply pivot table melt tables lambda group different functions pivot_table"
---

{% assign img-url = '/img/post/data/data-aggregation' %}

In this note, I use `df` for `DataFrame`, `s` for `Series`.

## Libraries

~~~ python
import pandas as pd # import pandas package
import numpy as np
~~~

## Dataframe

~~~ python
dataquest_aio = 'https://raw.githubusercontent.com/dinhanhthi/dataquest-aio/master/step-2-data-analysis-and-visualization/'
dataset_url = dataquest_aio + 'course-4-data-cleaning-and-analysis/data/World_Happiness_2015.csv'
df = pd.read_csv(dataset_url) # read the data set
df.head()
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th>Country</th>
      <th>Region</th>
      <th>Happiness Rank</th>
      <th>Happiness Score</th>
      <th>Standard Error</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Switzerland</td>
      <td>Western Europe</td>
      <td>1</td>
      <td>7.587</td>
      <td>0.03411</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Iceland</td>
      <td>Western Europe</td>
      <td>2</td>
      <td>7.561</td>
      <td>0.04884</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Denmark</td>
      <td>Western Europe</td>
      <td>3</td>
      <td>7.527</td>
      <td>0.03328</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Norway</td>
      <td>Western Europe</td>
      <td>4</td>
      <td>7.522</td>
      <td>0.03880</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Canada</td>
      <td>North America</td>
      <td>5</td>
      <td>7.427</td>
      <td>0.03553</td>
    </tr>
  </tbody>
</table>

## Group dataset using `groupby()`

Group `df` by column `Region` and then selct the column `Western Europe`,

~~~ python
df.groupby('Region').get_group('Western Europe') # returns a df
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th>Country</th>
      <th>Region</th>
      <th>Happiness Rank</th>
      <th>Happiness Score</th>
      <th>Standard Error</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Switzerland</td>
      <td>Western Europe</td>
      <td>1</td>
      <td>7.587</td>
      <td>0.03411</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Iceland</td>
      <td>Western Europe</td>
      <td>2</td>
      <td>7.561</td>
      <td>0.04884</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Denmark</td>
      <td>Western Europe</td>
      <td>3</td>
      <td>7.527</td>
      <td>0.03328</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Norway</td>
      <td>Western Europe</td>
      <td>4</td>
      <td>7.522</td>
      <td>0.03880</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Finland</td>
      <td>Western Europe</td>
      <td>6</td>
      <td>7.406</td>
      <td>0.03140</td>
    </tr>
  </tbody>
</table>

Select just the `Happiness Score` column and then find the `mean`,

~~~ python
df.groupby('Region')['Happiness Score'].mean()
# other methods: size, max, min, count
~~~

~~~
Region
Australia and New Zealand          7.285000
Central and Eastern Europe         5.332931
Eastern Asia                       5.626167
Latin America and Caribbean        6.144682
Middle East and Northern Africa    5.406900
North America                      7.273000
Southeastern Asia                  5.317444
Southern Asia                      4.580857
Sub-Saharan Africa                 4.202800
Western Europe                     6.689619
Name: Happiness Score, dtype: float64
~~~

Apply multiple/custom functions,

~~~ python
def max_min(group):
  return group.max() - group.min()

df.groupby(['Country', 'Region']).agg([np.mean, np.max, max_min]).head()
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th></th>
      <th colspan="3" halign="left">Happiness Rank</th>
      <th colspan="3" halign="left">Happiness Score</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>mean</th>
      <th>amax</th>
      <th>max_min</th>
      <th>mean</th>
      <th>amax</th>
      <th>max_min</th>
    </tr>
    <tr>
      <th>Country</th>
      <th>Region</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Afghanistan</th>
      <th>Southern Asia</th>
      <td>153</td>
      <td>153</td>
      <td>0</td>
      <td>3.575</td>
      <td>3.575</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>Albania</th>
      <th>Central Europe</th>
      <td>95</td>
      <td>95</td>
      <td>0</td>
      <td>4.959</td>
      <td>4.959</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>Algeria</th>
      <th>Middle Africa</th>
      <td>68</td>
      <td>68</td>
      <td>0</td>
      <td>5.605</td>
      <td>5.605</td>
      <td>0.0</td>
    </tr>
  </tbody>
</table>

If you wanna apply different functions on different columns,

~~~ python
df.groupby(['Country', 'Region']).agg({
    'Happiness Rank': max_min,
    'Happiness Score': ['min', 'max'],
    'Standard Error': 'count'
}).head(3)
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th></th>
      <th>Happiness Rank</th>
      <th colspan="2" halign="left">Happiness Score</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>max_min</th>
      <th>min</th>
      <th>max</th>
    </tr>
    <tr>
      <th>Country</th>
      <th>Region</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Afghanistan</th>
      <th>Southern Asia</th>
      <td>0</td>
      <td>3.575</td>
      <td>3.575</td>
    </tr>
    <tr>
      <th>Albania</th>
      <th>Central Europe</th>
      <td>0</td>
      <td>4.959</td>
      <td>4.959</td>
    </tr>
    <tr>
      <th>Algeria</th>
      <th>Middle Africa</th>
      <td>0</td>
      <td>5.605</td>
      <td>5.605</td>
    </tr>
  </tbody>
</table>

Or using `apply` and `lambda` function,

~~~ python
orders.groupby('shoes').price.apply(lambda x: np.min(x, 25)).reset_index()
~~~

## Group using `pivot_table()`

![An example of pivotting by a single column]({{img-url}}/pivoting_table_simple1.png){:.img-90}
_An example of pivotting by a single column<sup>[\[ref\]](https://nikgrozev.com/2015/07/01/reshaping-in-pandas-pivot-pivot-table-stack-and-unstack-explained-with-pictures/)</sup>_

Group by `Region` (as an index) and choosing `GDP` and `City` columns,{% ref "https://github.com/dinhanhthi/data-science-learning/blob/master/codecademy-data-science/course-10%20Data%20Analysis%20with%20Pandas/Aggregates%20in%20Pandas.ipynb" %}

~~~ python
df.pivot_table(values=['GDP', 'City'], index='Region') # returns df
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th>Happiness Rank</th>
      <th>Standard Error</th>
    </tr>
    <tr>
      <th>Region</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Australia and New Zealand</th>
      <td>9.5</td>
      <td>0.037270</td>
    </tr>
    <tr>
      <th>Central and Eastern Europe</th>
      <td>79.0</td>
      <td>0.045208</td>
    </tr>
    <tr>
      <th>Eastern Asia</th>
      <td>64.5</td>
      <td>0.037225</td>
    </tr>
  </tbody>
</table>

Apply some functions,

~~~ python
df.pivot_table(['GDP', 'City'], 'Region', aggfunc=[np.mean, np.max], margins=True)
# margins shows the "All" row
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th colspan="2" halign="left">mean</th>
      <th colspan="2" halign="left">amax</th>
    </tr>
    <tr>
      <th></th>
      <th>Happiness Rank</th>
      <th>Standard Error</th>
      <th>Happiness Rank</th>
      <th>Standard Error</th>
    </tr>
    <tr>
      <th>Region</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Australia and New Zealand</th>
      <td>9.5</td>
      <td>0.037270</td>
      <td>10</td>
      <td>0.04083</td>
    </tr>
    <tr>
      <th>Central and Eastern Europe</th>
      <td>79.0</td>
      <td>0.045208</td>
      <td>134</td>
      <td>0.06913</td>
    </tr>
    <tr>
      <th>Eastern Asia</th>
      <td>64.5</td>
      <td>0.037225</td>
      <td>100</td>
      <td>0.05051</td>
    </tr>
  </tbody>
</table>

## Reorganizing df using `pivot()`

![An example of multi-column pivoting]({{img-url}}/pivoting_simple_multicolumn.png){:.img-90}
_An example of multi-column pivoting ([ref](https://nikgrozev.com/2015/07/01/reshaping-in-pandas-pivot-pivot-table-stack-and-unstack-explained-with-pictures/))_

Make values in one columns be columns in a new "pivot" table,{% ref "https://github.com/dinhanhthi/data-science-learning/blob/master/codecademy-data-science/course-10%20Data%20Analysis%20with%20Pandas/Aggregates%20in%20Pandas.ipynb" %}

~~~ python
df = pd.DataFrame({'foo': ['one', 'one', 'one', 'two', 'two',
                           'two'],
                   'bar': ['A', 'B', 'C', 'A', 'B', 'C'],
                   'baz': [1, 2, 3, 4, 5, 6],
                   'zoo': ['x', 'y', 'z', 'q', 'w', 't']})

pivot_1 = df.pivot(index='foo', columns='bar', values='baz')
pivot_2 = df.pivot(index='foo', columns='bar')['baz']
pivot_3 = df.pivot(index='foo', columns='bar', values=['baz', 'zoo'])

display_side_by_side(df, pivot_1, pivot_2, pivot_3)
~~~

<table>
  <thead>
    <tr>
      <th></th>
      <th>foo</th>
      <th>bar</th>
      <th>baz</th>
      <th>zoo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>one</td>
      <td>A</td>
      <td>1</td>
      <td>x</td>
    </tr>
    <tr>
      <th>1</th>
      <td>one</td>
      <td>B</td>
      <td>2</td>
      <td>y</td>
    </tr>
    <tr>
      <th>2</th>
      <td>one</td>
      <td>C</td>
      <td>3</td>
      <td>z</td>
    </tr>
    <tr>
      <th>3</th>
      <td>two</td>
      <td>A</td>
      <td>4</td>
      <td>q</td>
    </tr>
    <tr>
      <th>4</th>
      <td>two</td>
      <td>B</td>
      <td>5</td>
      <td>w</td>
    </tr>
    <tr>
      <th>5</th>
      <td>two</td>
      <td>C</td>
      <td>6</td>
      <td>t</td>
    </tr>
  </tbody>
</table>

::: col-2-flex
<table>
  <thead>
    <tr>
      <th>bar</th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
    </tr>
    <tr>
      <th>foo</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>one</th>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <th>two</th>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th>bar</th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
    </tr>
    <tr>
      <th>foo</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>one</th>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <th>two</th>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th colspan="3" halign="left">baz</th>
      <th colspan="3" halign="left">zoo</th>
    </tr>
    <tr>
      <th>bar</th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
    </tr>
    <tr>
      <th>foo</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>one</th>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>x</td>
      <td>y</td>
      <td>z</td>
    </tr>
    <tr>
      <th>two</th>
      <td>4</td>
      <td>5</td>
      <td>6</td>
      <td>q</td>
      <td>w</td>
      <td>t</td>
    </tr>
  </tbody>
</table>
:::

For one who wanna know `display_side_by_side`, check [this note](/jupyter-notebook#display-dataframes-side-by-side).

## Change shape of df with `melt()`

Contrary to `pivot`, we now want to transform several columns into values of a single column,{% ref "https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.melt.html" %}

~~~ python
df = pd.DataFrame({'A': {0: 'a', 1: 'b', 2: 'c'},
                   'B': {0: 1, 1: 3, 2: 5},
                   'C': {0: 2, 1: 4, 2: 6}})

df1 = pd.melt(df, id_vars=['A'], value_vars=['B'])
df2 = pd.melt(df, id_vars=['A'], value_vars=['B', 'C'])

display_side_by_side(df, df1, df2)
~~~

::: col-2-flex
<table>
  <thead>
    <tr>
      <th></th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>a</td>
      <td>1</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>b</td>
      <td>3</td>
      <td>4</td>
    </tr>
    <tr>
      <th>2</th>
      <td>c</td>
      <td>5</td>
      <td>6</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>A</th>
      <th>variable</th>
      <th>value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>a</td>
      <td>B</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>b</td>
      <td>B</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>c</td>
      <td>B</td>
      <td>5</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>A</th>
      <th>variable</th>
      <th>value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>a</td>
      <td>B</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>b</td>
      <td>B</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>c</td>
      <td>B</td>
      <td>5</td>
    </tr>
    <tr>
      <th>3</th>
      <td>a</td>
      <td>C</td>
      <td>2</td>
    </tr>
    <tr>
      <th>4</th>
      <td>b</td>
      <td>C</td>
      <td>4</td>
    </tr>
    <tr>
      <th>5</th>
      <td>c</td>
      <td>C</td>
      <td>6</td>
    </tr>
  </tbody>
</table>
:::

## References

- [Data Cleaning and Analysis](https://github.com/dinhanhthi/dataquest-aio/tree/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis) on Dataquest.
- [Transforming data with pandas](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/dataquest-aio/blob/master/step-2-data-analysis-and-visualization/course-4-data-cleaning-and-analysis/notebooks_in_html/task-3-transforming-data-with-pandas.html) on Dataquest.
- **pandas official** -- [Group By: split-apply-combine](https://pandas.pydata.org/pandas-docs/stable/user_guide/groupby.html)


