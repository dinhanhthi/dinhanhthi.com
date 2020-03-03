---
layout: post
title: "Data Sample"
categories: [data science]
keywords: create data sample example dataframe fake data time series data int numbers columns list of int numbers from numpy
---

## Time Series data

~~~ python
import numpy as np
import pandas as pd

df = dict({
    'date': pd.date_range('1/1/2020', periods=per, freq='T'),
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
      <td>2020-01-01 00:00:00</td>
      <td>10</td>
      <td>20</td>
      <td>30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2020-01-01 00:01:00</td>
      <td>11</td>
      <td>21</td>
      <td>31</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2020-01-01 00:02:00</td>
      <td>12</td>
      <td>22</td>
      <td>32</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2020-01-01 00:03:00</td>
      <td>13</td>
      <td>23</td>
      <td>33</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2020-01-01 00:04:00</td>
      <td>14</td>
      <td>24</td>
      <td>34</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2020-01-01 00:05:00</td>
      <td>15</td>
      <td>25</td>
      <td>35</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2020-01-01 00:06:00</td>
      <td>16</td>
      <td>26</td>
      <td>36</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2020-01-01 00:07:00</td>
      <td>17</td>
      <td>27</td>
      <td>37</td>
    </tr>
  </tbody>
</table>

With timezone (manually)

~~~ python
df = pd.DataFrame({'timestamp': ['2019-01-31T16:47:00+01:00', '2019-01-31T16:48:00+02:00', 
                                  '2019-01-31T16:49:00+02:00', '2019-01-31T16:50:00+01:00']})
~~~

<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th>timestamp</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-01-31T16:47:00+01:00</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-01-31T16:48:00+02:00</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-01-31T16:49:00+02:00</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-01-31T16:50:00+01:00</td>
    </tr>
  </tbody>
</table>

