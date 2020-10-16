---
layout: post
title: "TF 4 - Sequences, Time Series and Prediction"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai, tensorflow]
icon-photo: tensorflow.svg
keywords: "deep learning ai coursera tensorflow google project python sequences time series sunspot activities circle NASA RNN Autocorrelation autocorrelated time series trend seasonality"
notfull: 1
---

{% assign img_url = '/img/post/mooc/tf' %}

{% include toc.html %}

This is my note for the [4th course](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).<br />
👉 Go to [course 2 - CNN in TensorFlow](/deeplearning-ai-tensorflow-course-2).<br />
👉 Go to [course 3 - NLP in Tensorflow](/deeplearning-ai-tensorflow-course-3).

- __Sequence models__: focus on _time series_ (there are others) -- stock, weather,...
- At the end, we wanna model __sunspot actitivity cycles__ which is important to NASA and other space agencies.
- Using RNN on time series data.

## Sequences and prediction

### Time Series

👉 Notebook: [introduction to time series](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-1/notebook_1_introduction_to_time_series.html). + [explaining video](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/Pzp5K/introduction-to-time-series). => How to create synthetic time series data + plot them.

{:.noindent}
- Time series is everywhere: stock prices, weather focasts, historical trends (Moore's law),...
- **Univariate** TS and **MUltivariate** TS.
- Type of things can we do with ML over TS:
  - Any thing has a time factor can be analysed using TS.
  - Predicting a focasting (eg. birth & death in Japan -> predict future for retirement, immigration, impacts...).
  - __Imputation__: project back into the past.
  - Fill holes in the data.
  - Nomalies detecction (website attacks).
  - Spot patterns (eg. speed recognition).
- Common patterns in TS:
  - __Trend__: a specific direcion that they're moving in.

    {:.img-50}
    ![Trend]({{img_url}}/trend.png)
  - __Seasonality__: patterns repeat at predictable intervals (eg. active users for a website).

    {:.img-100}
    ![seasonality]({{img_url}}/seasonality.png)
  - Combinition of both **trend** and **seasonality**.

    {:.img-50}
    ![trend+seasonality]({{img_url}}/trend_seasonality.png)
  - __Stationary__ TS.

    {:.img-50}
    ![stationality]({{img_url}}/stationality.png)
  - __Autocorrelated__ TS: a time series is linearly related to a _lagged_ version of itself.. There is no trend, no seasonality.

    {:.img-60}
    ![autocorrelation]({{img_url}}/autocorrelation.png)
  - __Multiple auto correlation__.

    {:.img-60}
    ![multiple_autocorrelation]({{img_url}}/multiple_autocorrelation.png)
  - May be **trend** + **seasonality** + **autorrelation** + **noise**.

    {:.img-60}
    ![trend_seasonality_autocorrelation_noise]({{img_url}}/trend_seasonality_autocorrelation_noise.png)
  - **Non-stationary** TS:

    {:.img-60}
    ![non_stationary]({{img_url}}/non_stationary.png)
    _In this case, we base just on the later data to predict the future (not on the whole data)._

### Train / Validation / Test

- **Fixed partitioning** (this course focuses on) =  splitting TS data into **training period**, **validation period** and **test period**.
  - If TS is seasonal, we want each period contains the whole number of seasons.

    {:.img-70}
    ![Fixed partitioning]({{img_url}}/fixed_partitioning.png)

- We can split + train + test to get a model and then **re-train** with the data **containing also the test period** so that the model is optimized! In that case, the test set comes from the future.

    {:.img-70}
    ![Fixed partitioning with test period comes from the future]({{img_url}}/fixed_partitioning_future_test.png)
- **Roll-forward partitioning**: we start with a short training period and we gradually increase it (1 day at a time or 1 week at a time). At each iteration, we train the model on training period, use it to focast the following day/week in the validation period. = Fixed partitioning in a number of times!

    {:.img-70}
    ![Roll-forward partitioning]({{img_url}}/roll_forward_partitioning.png)

### Metrics

For evaluating models:

``` python
errors = forecasts - actual

# Mean squared error (square to get rid of negative values)
# Eg. Used if large errors are potentially dangerous
mse = np.square(errors).mean()
# Get back to the same scale to error
rmse = np.sqrt(mse)

# Mean absolute error (his favorite)
# this doesn't penalize large errs as much as mse does,
# used if loss is proportional to the size of err
mae = np.abs(errors).mean()

# Mean abs percentage err
# idea of the size of err compared to the values
mape = np.abs(errors / x_valid).mean()
```

``` python
# MAE with TF
keras.metrics.mean_absolute_error(x_valid, naive_forecast).numpy()
```

### Moving average and differencing

👉 Notebook: [Forecasting](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-1/notebook_2_forecasting.html). + [explaining video](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/KVWrR/forecasting).

**Moving average**: a simple forecasting method. Calculate the average of blue lines within a fixed "averaging windows".

- This can eliminate noises and doesn't anticipate trend or seasonality.
- Depend on the "averaging window", it can give worse result than naive forecast.

{:.img-70}
![Moving average]({{img_url}}/moving_average.png)
_Take the average on each yellow window. MAE=7.14 (optimal is 4)._

``` python
def moving_average_forecast(series, window_size):
    """Forecasts the mean of the last few values.
        If window_size=1, then this is equivalent to naive forecast"""
    forecast = []
    for time in range(len(series) - window_size):
    forecast.append(series[time:time + window_size].mean())
    return np.array(forecast)
```

**Differencing**: remove the trend and seasonality from the TS. We study on the differences between points and their previous neighbor in period.

{:.img-100}
![Moving average on differenced time series]({{img_url}}/moving_avg_on_differenced_ts.jpg)
_Left image: we find the differencing of original values, then we find the average (orange line). Right image: restore the trend and seasonality. MAE=5.8 (optimal is 4)._

Above method still get the noises (because we add the differencing to the previous noise). If we remove past noise using moving average on that.

{:.img-70}
![Smoothing both past and present values]({{img_url}}/smoothing_both_past_present_values.png)
_Smoothing both past and present values. MAE=4.5 (optimal is 4)._

Keep in mind before using Deep Learning, <mark>sometimes simple approaches just work fine!</mark>