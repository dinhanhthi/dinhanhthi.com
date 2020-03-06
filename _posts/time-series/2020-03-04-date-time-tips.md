---
layout: post
title: "Date / Time tips"
categories: [time series]
keywords: resample rule time step timedelta delta constructor format representation days hours minute second milisecond microsecond nanosecond offset string frequency resampling how DateOffsets frequencies strings offset aliases freq compare arithmetic timedelta
---

{% include toc.html %}

## List of resampling rules

Official ref [here](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html) — search "_DateOffsets_" to jump to the table.

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

### Compare/Make arithmetic different frequency string

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

## Timedelta to offset string

This is used to find the offset string (or "DateOffsets" or "frequencies strings" or "offset aliases") for `rule` in [`Resample`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.resample.html) {% ref https://stackoverflow.com/questions/46429736/pandas-resampling-how-to-generate-offset-rules-string-from-timedelta %}.

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

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
## EXAMPLE
import pandas as pd
test = pd.Timedelta('1 minutes')
timedelta_to_string(test)
~~~

{:.output.flex-fill.d-flex}
~~~
Timedelta('0 days 00:01:00')
'1T'
~~~
</div>

## Detect time series frequency

Find the different time steps in a datetime columns,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# count the number of elements for each time steps
df.date.diff().value_counts()

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

Timedelta('0 days 00:01:00')
Timedelta('0 days 00:04:00')
~~~
</div>

One can couple with function `timedelta_to_string` in the previous section to find out the most-appeared time steps to feed into `df.resample()`'s `rule`.
