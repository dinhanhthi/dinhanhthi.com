---
layout: post
title: "Data Sample"
categories: [data science]
keywords: create data sample example dataframe fake data time series data int numbers columns list of int numbers from numpy different time steps gaps don't continue
---

{% include toc.html %}

## Time Series data

Read more about [`date_range()`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html), there are other options, for example, adding timezones.

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

<table border="1" class="dataframe">
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

With timezone (manually)

~~~ python
df = pd.DataFrame({'timestamp': ['2019-01-31T16:47:00+01:00', '2019-01-31T16:48:00+02:00', 
                                  '2019-01-31T16:49:00+02:00', '2019-01-31T16:50:00+01:00']})
~~~

Different time gaps (time steps)

~~~ python
df = pd.DataFrame(columns=['date', 'val1', 'val2', 'val3'])
start_date = '2020-01-01 00:00:00'
periods = [3, 2, 3, 4]
gaps = [0, 5, 4, 2]

for idx, _ in enumerate(periods):
    per = periods[idx]
    gap = gaps[idx]
    start_date = str(pd.Timestamp(start_date) + DateOffset(minutes=gap))
    df_tmp = dict({
        'date': pd.date_range(start_date, periods=per, freq='T'),
        'val1': np.arange((idx+1)*10, (idx+1)*10+per, 1),
        'val2': np.arange((idx+1)*100, (idx+1)*100+per, 1),
        'val3': np.arange((idx+1)*1000, (idx+1)*1000+per, 1)
    })
    start_date = str(pd.Timestamp(start_date) + DateOffset(minutes=per-1))
    df_tmp = pd.DataFrame(df_tmp)
    df = pd.concat([df, df_tmp], ignore_index=True)

df = df.infer_objects() # without this, all numeric columns' dtypes are 'object'
~~~

<table class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th>date</th>
      <th>val1</th>
      <th>val2</th>
      <th>val3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2020-01-01 00:00:00</td>
      <td>10</td>
      <td>100</td>
      <td>1000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2020-01-01 00:01:00</td>
      <td>11</td>
      <td>101</td>
      <td>1001</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2020-01-01 00:02:00</td>
      <td>12</td>
      <td>102</td>
      <td>1002</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2020-01-01 00:07:00</td>
      <td>20</td>
      <td>200</td>
      <td>2000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2020-01-01 00:08:00</td>
      <td>21</td>
      <td>201</td>
      <td>2001</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2020-01-01 00:12:00</td>
      <td>30</td>
      <td>300</td>
      <td>3000</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2020-01-01 00:13:00</td>
      <td>31</td>
      <td>301</td>
      <td>3001</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2020-01-01 00:14:00</td>
      <td>32</td>
      <td>302</td>
      <td>3002</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2020-01-01 00:16:00</td>
      <td>40</td>
      <td>400</td>
      <td>4000</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2020-01-01 00:17:00</td>
      <td>41</td>
      <td>401</td>
      <td>4001</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2020-01-01 00:18:00</td>
      <td>42</td>
      <td>402</td>
      <td>4002</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2020-01-01 00:19:00</td>
      <td>43</td>
      <td>403</td>
      <td>4003</td>
    </tr>
  </tbody>
</table>