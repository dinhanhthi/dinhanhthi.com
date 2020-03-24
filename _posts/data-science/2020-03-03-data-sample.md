---
layout: post
title: "Data Sample"
categories: [data science]
keywords: "create data sample example dataframe fake data time series data int numbers columns list of int numbers from numpy different time steps gaps don't continue Temporary file and directory tempfile"
---

{% include toc.html %}

## Temporary file and directory

Using [tempfile](https://docs.python.org/3/library/tempfile.html). A file/directory will be created to work. Close files, files are deleted!

~~~ python
import tempfile

# create tmp file and write some data
fp = tempfile.TemporaryFile()
fp.write(b'Hello world!')

# read data from file
fp.seek(0)
fp.read()

# close the file, it'll be removed!
fp.close()
~~~

## Time Series data

Read more about [`date_range()`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html), there are other options, for example, adding timezones.

<div class="d-md-flex" markdown="1">
{:.overflow-auto.pr-md-1}
~~~ python
import numpy as np
import pandas as pd

df = dict({
    'date': pd.date_range('1/1/2020', periods=4, freq='T', tz='Europe/Paris'),
    'val1': np.arange(10,10+per,1),
    'var2': np.arange(20,20+per,1),
    'var3': np.arange(30,30+per,1)
})
df = pd.DataFrame(df)
~~~

{:.overflow-auto.pl-md-1}
<table class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th>date</th>
      <th>val1</th>
      <th>var2</th>
      <th>var3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2020-01-01 00:00:00+01:00</td>
      <td>10</td>
      <td>20</td>
      <td>30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2020-01-01 00:01:00+01:00</td>
      <td>11</td>
      <td>21</td>
      <td>31</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2020-01-01 00:02:00+01:00</td>
      <td>12</td>
      <td>22</td>
      <td>32</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2020-01-01 00:03:00+01:00</td>
      <td>13</td>
      <td>23</td>
      <td>33</td>
    </tr>
  </tbody>
</table>
</div>

With timezone (manually)

~~~ python
df = pd.DataFrame({'timestamp': ['2019-01-31T16:47:00+01:00', '2019-01-31T16:48:00+02:00', 
                                 '2019-01-31T16:49:00+02:00', '2019-01-31T16:50:00+01:00']})
~~~

Different time gaps (time steps),

~~~ python
def generate_sample(starting_date, periods=None, gaps=None, freq="1T", n_vars=1):
    """
    General a sample time series dataframe with different periods and time steps.
    
    Parameters:
    -----------
    starting_date: datetime-like, str, int, float
        Starting date of the data.
    periods: array, list of int
        The list of (different) periods to generate.
    gaps: array, list of numbers, optional
        The list of gaps (between periods).
    freq: frequency strings
        The most popular time steps.
    n_vars: int
        Number of columns of variables.
    """
    df = pd.DataFrame()
    periods = list(periods)
    for idx, _ in enumerate(periods):
        per = periods[idx]
        if gaps is not None:
            gaps = list(gaps)
            gap = gaps[idx]
            starting_date = str(pd.Timestamp(starting_date) + pd.to_timedelta(to_offset(freq))*gap)
        else:
            starting_date = str(pd.Timestamp(starting_date))
            
        df_tmp = dict({'date': pd.date_range(starting_date, periods=per, freq=freq)})
        df_tmp = pd.DataFrame(df_tmp)
        df = pd.concat([df, df_tmp], ignore_index=True, sort=False)
        starting_date = str(df_tmp.date.iloc[-1])
    
    for i_var in range(n_vars):
        df['var'+str(i_var)] = np.arange(i_var*10, i_var*10+sum(periods))
    
    df = df.infer_objects()
    return df
~~~

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ python
df = generate_sample(starting_date='2020-01-01', 
                     periods=[3, 2], 
                     gaps=[0, 5], 
                     freq='1T', 
                     n_vars=5)
~~~

{:.flex-even.overflow-auto.pl-md-1}
<table class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>date</th>
      <th>var0</th>
      <th>var1</th>
      <th>var2</th>
      <th>var3</th>
      <th>var4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>2020-01-01 00:00:00</td>
      <td>0</td>
      <td>10</td>
      <td>20</td>
      <td>30</td>
      <td>40</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2020-01-01 00:01:00</td>
      <td>1</td>
      <td>11</td>
      <td>21</td>
      <td>31</td>
      <td>41</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2020-01-01 00:02:00</td>
      <td>2</td>
      <td>12</td>
      <td>22</td>
      <td>32</td>
      <td>42</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2020-01-01 00:07:00</td>
      <td>3</td>
      <td>13</td>
      <td>23</td>
      <td>33</td>
      <td>43</td>
    </tr>
    <tr>
      <td>4</td>
      <td>2020-01-01 00:08:00</td>
      <td>4</td>
      <td>14</td>
      <td>24</td>
      <td>34</td>
      <td>44</td>
    </tr>
  </tbody>
</table>
</div>