---
layout: post
title: "Date / Time tips"
categories: [time series]
keywords: "resample rule time step timedelta delta constructor format representation days hours minute second milisecond microsecond nanosecond offset string frequency resampling how DateOffsets frequencies strings offset aliases freq compare arithmetic timedelta different well sorted correctly pandas time series user guide convert timedelta timedelta64 numpy. np. TimedeltaIndex diff() difference datetimeindex Timedelta UNIX timestamp UTC +0 to_offset cannot use single T without number"
---

{% include toc.html %}

## List of resampling rules

Official ref [here](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects) — search "_DateOffsets_" to jump to the table.

~~~
B         business day frequency
C         custom business day frequency (experimental)
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

### Compare/Make arithmetic different frequency strings

We wanna compare `150S` (150 seconds) with `1T` (1 minutes).

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
import pandas as pd
pd.to_timedelta('150S') > pd.to_timedelta('1T')
pd.to_timedelta('120S') == pd.to_timedelta('1T')
pd.to_timedelta('120S') == pd.to_timedelta('2T')
~~~

{:.output.flex-fill.d-flex}
~~~
True
False
True
~~~
</div>

We can make some arithmetic with them.

## `TimedeltaIndex` differences

There is no `.diff` method with `TimedeltaIndex`, you can use,

~~~ python
np.subtract(df[1:], df[:-1])

# convert to hour
np.subtract(df[1:], df[:-1]) / pd.Timedelta('1 hour')
~~~

## Converting

To `Timedelta`,

~~~ python
# numpy.timedelta64(208206000000000,'ns') → Timedelta('2 days 09:50:06')
pd.Timedelta(time, unit='ns')

# DateOffsets ('14T') → Timedelta('0 days 00:14:00')
pd.to_timedelta('14T')

# Can't use 'T' as '1T'?
from pandas.tseries.frequencies import to_offset
pd.to_timedelta(to_offset('T'))
~~~

Timestamps,

~~~ python
from datetime import datetime

# to same timezone (UTC, +0)
df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True, infer_datetime_format=True, cache=True)

# UTC+0 to UNIX timestamp
df['timestamp'] = df['timestamp'].apply(lambda x: int(datetime.timestamp(x)*1000)) # miliseconds
~~~

### Timedelta to offset string

This is used to find the offset string (or "DateOffsets" or "frequencies strings" or "offset aliases") for `rule` in [`Resample`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.resample.html) {% ref https://stackoverflow.com/questions/46429736/pandas-resampling-how-to-generate-offset-rules-string-from-timedelta %}.

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ python
def timedelta_to_string(timedelta):
    c = timedelta.components
    time_format = ''
    if c.days != 0:
        time_format += '%dD' % c.days
    if c.hours > 0:
        time_format += '%dH' % c.hours
    if c.minutes > 0:
        time_format += '%dT' % c.minutes
    if c.seconds > 0:
        time_format += '%dS' % c.seconds
    if c.milliseconds > 0:
        time_format += '%dL' % c.milliseconds
    if c.microseconds > 0:
        time_format += '%dU' % c.microseconds
    if c.nanoseconds > 0:
        time_format += '%dN' % c.nanoseconds
    return time_format
~~~

<div markdown="1" class="flex-even overflow-auto pl-md-1">
~~~ python
## EXAMPLE
import pandas as pd
test = pd.Timedelta('1 minutes')
timedelta_to_string(test)
~~~

{:.output.mt-m1.bt-none}
~~~
Timedelta('0 days 00:01:00')
'1T'
~~~
</div>
</div>

## Detect time series frequency

Find the different time steps in a datetime columns,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
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

{:.output.flex-fill.d-flex}
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
</div>

One can couple with function `timedelta_to_string` in the previous section to find out the most-appeared time steps to feed into `df.resample()`'s `rule`.

## Check timestamps are well sorted?

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ python
# CHECK
df.date.is_monotonic # monotonic increasing?
df.date.is_monotonic_decreasing # decreasing?

# if using groupby
def check_monotonic(group):
    return group.is_monotonic
df.groupby('label').agg({'timestamp': [check_monotonic] })
~~~

{:.flex-even.overflow-auto.pl-md-1}
~~~ python
# ARRANGE THEM
df.sort_values(by='date', inplace=True)
~~~
</div>

## References

- [Time Series User Guide](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html) on [pandas](/python-pandas).
