---
layout: post
title: "Date / Time extra"
tags: [Time Series]
toc: true
icon: datetime.svg
notfull: 1
keywords: "resample rule time step timedelta delta constructor format representation days hours minute second milisecond microsecond nanosecond offset string frequency resampling how DateOffsets frequencies strings offset aliases freq compare arithmetic timedelta different well sorted correctly pandas time series user guide convert timedelta timedelta64 numpy. np. TimedeltaIndex diff() difference datetimeindex Timedelta UNIX timestamp UTC +0 to_offset cannot use single T without number check info timestamp of a dataframe set index ISO 8601 format isoformat duration datetime"
---

## ISO 8601 format

For duration:

{:.indent}
- `P` (duration, always at the beginning of the duration), `Y` (year), `M` (month), `W` (week), `D` (day), `T` (time designator, always precedes the time components), `H` (hour), `M` (minute), `S` (second).
- **Example**: `P3Y6M4DT12H30M5S` -- a duration of three years, six months, four days, twelve hours, thirty minutes, and five seconds.

Converter,

~~~ python
from datetime import datetime, timedelta
from isodate import duration_isoformat # used only for datetime.timedelta

def get_isoformat(time):
    """
    Convert pd.Timedelta, pd.Timestamp,
    datetimme.datetime, datetime.time, datetime.date, datetime.timedelta
    to isoformat
    """
    if not isinstance(time, timedelta):
        return time.isoformat()
    else:
        return duration_isoformat(time)
~~~

## `Timedelta`

### To `Timedelta`,

~~~ python
# numpy.timedelta64(208206000000000,'ns') → Timedelta('2 days 09:50:06')
pd.Timedelta(time, unit='ns')
~~~

~~~ python
# DateOffsets ('14T') → Timedelta('0 days 00:14:00')
pd.to_timedelta('14T')
~~~

~~~ python
# Can't use 'T' as '1T'?
from pandas.tseries.frequencies import to_offset
pd.to_timedelta(to_offset('T'))
~~~

### From `Timedelta`,

~~~ python
# Timedelta('0 days 00:01:20') -> 80 (s)
# (SINGLE VALUE)
td.total_seconds() # float
~~~

~~~ python
# Timedelta('0 days 00:01:20') -> 80 (s) (FLOAT)
# (ONLY WORK with a series, not a single value)
series.astype('timedelta64[s]') # or 'ms'
~~~

~~~ python
# '1 minutes' -> '1T'
def timedelta_to_string(timedelta):
    units = ['D', 'H', 'T', 'S', 'L', 'U', 'N']
    time_format = ''
    for i, c in enumerate(timedelta.components):
        if c != 0: time_format += str(c) + units[i]
    return time_format
~~~

::: code-output-equal
~~~ python
## EXAMPLE
import pandas as pd
test = pd.Timedelta('1 minutes')
timedelta_to_string(test)
~~~

~~~
Timedelta('0 days 00:01:00')
'1T'
~~~
:::

### `TimedeltaIndex` differences

There is no `.diff` method with `TimedeltaIndex`, you can use,

~~~ python
np.subtract(df[1:], df[:-1])

# convert to hour
np.subtract(df[1:], df[:-1]) / pd.Timedelta('1 hour')
~~~

### Compare/Make arithmetic different frequency strings

We wanna compare `150S` (150 seconds) with `1T` (1 minutes).

::: code-output-equal
~~~ python
import pandas as pd
pd.to_timedelta('150S') > pd.to_timedelta('1T')
pd.to_timedelta('120S') == pd.to_timedelta('1T')
pd.to_timedelta('120S') == pd.to_timedelta('2T')
~~~

~~~
True
False
True
~~~
:::

## Timestamps

~~~ python
from datetime import datetime
~~~

~~~ python
# to same timezone (UTC, +0)
df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True, infer_datetime_format=True, cache=True)
~~~

~~~ python
# UTC+0 to UNIX timestamp (POSIX timestamp)
df['timestamp'] = df['timestamp'].apply(lambda x: int(datetime.timestamp(x)*1000)) # miliseconds

# unix timestamp to Timestamps
datetime.fromtimestamp(unix_ts//1000)
~~~

~~~ python
# UNIX float (ms) -> datetime64
df['timestamp'] = df['timestamp'].astype('datetime64[ms]')
# change `ms` with others, e.g. `ns` for nanosecond
~~~

``` python
# remove timezone
df['time'].dt.tz_localize(None)
```

### Get info timestamps

~~~ python
def set_index(data, col_time):
    """
    Make a copy of a time-series dataframe `df` and set the column-time be the
    index of the dataframe.
    In the case index has no name, we set it as `'index'`.
    """
    df0 = data.copy()
    if col_time != 'index': # col_time is not the index
        df0 = df0.set_index(col_time)
    else:
        if df0.index.name is None:
            df0.index.name = 'index'
    return df0
~~~

~~~ python
def get_info_timestamps(df, col_date='index'):
    # make sure timestamps are on index
    df = set_index(df, col_date)
    index_name = df.index.name
    df = df.reset_index()
    print('Time range: ', df[index_name].max() - df[index_name].min())
    print('Number of different time steps: ', df[index_name].diff().value_counts().count())
    print('Max time step: ', df[index_name].diff().max())
    print('Min time step: ', df[index_name].diff().min())
    print('The most popular time step: ', df[index_name].diff().value_counts().index[0])
    print('timestamps are monotonic increasing? ', df[index_name].is_monotonic)
    print('Are there duplicate timestamps? ', df[index_name].duplicated().any())
    print('How many unique duplicates? ', df[index_name].duplicated().sum(), ' (in total ',df.shape[0], ')')
    print('How many repeated duplicates? ', df[index_name].duplicated(keep=False).sum(), ' (in total ',df.shape[0], ')')
~~~

### Check timestamps are well sorted?

<div class="col-2-equal">

~~~ python
# CHECK
df.date.is_monotonic # monotonic increasing?
df.date.is_monotonic_decreasing # decreasing?

# if using groupby
def check_monotonic(group):
    return group.is_monotonic
df.groupby('label').agg({'timestamp': [check_monotonic] })
~~~

~~~ python
# ARRANGE THEM
df.sort_values(by='date', inplace=True)
~~~
</div>

## Detect time series frequency

Find the different time steps in a datetime columns,

::: code-output-equal
~~~ python
# count the number of elements for each time steps
df.date.diff().value_counts()

# count number of different time steps
df.date.diff().value_counts().count()

# take the index of the largest
df.date.diff().value_counts().index[0]

# take the index of the smallest
df.date.diff().value_counts().index[-1]
~~~

~~~
00:01:00    11
00:03:00     2
00:02:00     1
00:04:00     1
Name: date, dtype: int64

4

Timedelta('0 days 00:01:00')

Timedelta('0 days 00:04:00')
~~~
:::

One can couple with function `timedelta_to_string` in the previous section to find out the most-appeared time steps to feed into `df.resample()`'s `rule`.

## List of resampling rules

Official ref [here](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects) — search "_DateOffsets_" to jump to the table.

~~~
B         business day frequency
C         custom business day frequency (experimental)`
D         calendar day frequency
W         weekly frequency
M         month end frequency
SM        semi-month end frequency (15th and end of month)
BM        business month end frequency
CBM       custom business month end frequency
MS        month start frequency
SMS       semi-month start frequency (1st and 15th)
BMS       business month start frequency
CBMS      custom business month start frequency
Q         quarter end frequency
BQ        business quarter endfrequency
QS        quarter start frequency
BQS       business quarter start frequency
A         year end frequency
BA, BY    business year end frequency
AS, YS    year start frequency
BAS, BYS  business year start frequency
BH        business hour frequency
H         hourly frequency
T, min    minutely frequency
S         secondly frequency
L, ms     milliseconds
U, us     microseconds
N         nanoseconds
~~~

## References

- [Time Series User Guide](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html) on [pandas](/python-pandas).
