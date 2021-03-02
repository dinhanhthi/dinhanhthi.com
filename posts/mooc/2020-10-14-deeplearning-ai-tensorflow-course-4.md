---
layout: post
title: "TF 4 - Sequences, TS and Prediction"
tags: [MOOC, Time Series, deeplearning.ai, Deep Learning, TensorFlow]
toc: true
icon: tensorflow.svg
keywords: "deep learning ai coursera tensorflow google project python sequences time series sunspot activities circle NASA RNN Autocorrelation autocorrelated time series trend seasonality lambda layer sequence to vector sequence to sequence univariate multivariate learning rate LSTM callback recurrent layer moving average differencing metric train test validation set windowed dataset loss function Huber"
---

{% assign img_url = '/img/post/mooc/tf' %}

This is my note for the [4th course](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).
👉 Go to [course 2 - CNN in TensorFlow](/deeplearning-ai-tensorflow-course-2).
👉 Go to [course 3 - NLP in Tensorflow](/deeplearning-ai-tensorflow-course-3).

{:.noindent}
- __Sequence models__: focus on _time series_ (there are others) -- stock, weather,...
- At the end, we wanna model __sunspot actitivity cycles__ which is important to NASA and other space agencies.
- Using RNN on time series data.

## Sequences and prediction

### Time Series

📙 Notebook: [introduction to time series](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-1/notebook_1_introduction_to_time_series.html). + [explaining video](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/Pzp5K/introduction-to-time-series). => How to create synthetic time series data + plot them.

{:.noindent}
- Time series is everywhere: stock prices, weather focasts, historical trends (Moore's law),...
- **Univariate** TS and **Miltivariate** TS.
- Type of things can we do with ML over TS:
  - Any thing has a time factor can be analysed using TS.
  - Predicting a forecasting (eg. birth & death in Japan -> predict future for retirement, immigration, impacts...).
  - __Imputation__: project back into the past.
  - Fill holes in the data.
  - Nomalies detecction (website attacks).
  - Spot patterns (eg. speed recognition).
- Common patterns in TS:
  - __Trend__: a specific direcion that they're moving in.

    ![Trend]({{img_url}}/trend.png){:.img-50}
  - __Seasonality__: patterns repeat at predictable intervals (eg. active users for a website).

    ![seasonality]({{img_url}}/seasonality.png){:.img-100}
  - Combinition of both **trend** and **seasonality**.

    ![trend+seasonality]({{img_url}}/trend_seasonality.png){:.img-50}
  - __Stationary__ TS.

    ![stationality]({{img_url}}/stationality.png){:.img-50}
  - __Autocorrelated__ TS: a time series is linearly related to a _lagged_ version of itself.. There is no trend, no seasonality.

    ![autocorrelation]({{img_url}}/autocorrelation.png){:.img-60}
  - __Multiple auto correlation__.

    ![multiple_autocorrelation]({{img_url}}/multiple_autocorrelation.png){:.img-60}
  - May be **trend** + **seasonality** + **autorrelation** + **noise**.

    ![trend_seasonality_autocorrelation_noise]({{img_url}}/trend_seasonality_autocorrelation_noise.png){:.img-60}
  - **Non-stationary** TS:

    ![non_stationary]({{img_url}}/non_stationary.png){:.img-60}
    _In this case, we base just on the later data to predict the future (not on the whole data)._

### Train / Validation / Test

- **Fixed partitioning** (this course focuses on) =  splitting TS data into **training period**, **validation period** and **test period**.
  - If TS is seasonal, we want each period contains the whole number of seasons.

    ![Fixed partitioning]({{img_url}}/fixed_partitioning.png){:.img-70}

- We can split + train + test to get a model and then **re-train** with the data **containing also the test period** so that the model is optimized! In that case, the test set comes from the future.

    ![Fixed partitioning with test period comes from the future]({{img_url}}/fixed_partitioning_future_test.png){:.img-70}
- **Roll-forward partitioning**: we start with a short training period and we gradually increase it (1 day at a time or 1 week at a time). At each iteration, we train the model on training period, use it to focast the following day/week in the validation period. = Fixed partitioning in a number of times!

    ![Roll-forward partitioning]({{img_url}}/roll_forward_partitioning.png){:.img-70}

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

📙 Notebook: [Forecasting](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-1/notebook_2_forecasting.html). + [explaining video](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/KVWrR/forecasting).

**Moving average**: a simple forecasting method. Calculate the average of blue lines within a fixed "averaging windows".

- This can eliminate noises and doesn't anticipate trend or seasonality.
- Depend on the "averaging window", it can give worse result than naive forecast.

![Moving average]({{img_url}}/moving_average.png){:.img-70}
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

![Moving average on differenced time series]({{img_url}}/moving_avg_on_differenced_ts.jpg){:.img-100}
_Left image: we find the differencing of original values, then we find the average (orange line). Right image: restore the trend and seasonality. MAE=5.8 (optimal is 4)._

Above method still get the noises (because we add the differencing to the previous noise). If we remove past noise using moving average on that.

![Smoothing both past and present values]({{img_url}}/smoothing_both_past_present_values.png){:.img-70}
_Smoothing both past and present values. MAE=4.5 (optimal is 4)._

Keep in mind before using Deep Learning, <mark>sometimes simple approaches just work fine!</mark>

## Deep NN for Time Series

### Preparing features and labels

- We need to split our TS data into features and labels so that we can use them in ML algos.
- In this case: features=#values in TS, label=next_value.
  - Feature: window size and train to predict next value.
  - Ex: 30 days of values as features and next value as label.
  - Overtime, train ML to match 30 features to match a single label.

📙 Notebook: [Preparing features and labels](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-2/notebook_1_preparing_features_and_labels.html).
👉 [Video explains how to split to features and labels from dataset](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/TYErD/preparing-features-and-labels).

``` python
def windowed_dataset(series, window_size, batch_size, shuffle_buffer):
    dataset = tf.data.Dataset.from_tensor_slices(series)
    dataset = dataset.window(window_size + 1, shift=1, drop_remainder=True)
    dataset = dataset.flat_map(lambda window: window.batch(window_size + 1))
    dataset = dataset.shuffle(shuffle_buffer).map(lambda window: (window[:-1], window[-1]))
    dataset = dataset.batch(batch_size).prefetch(1)
    return dataset
```

{% hsbox "Explain the codes" %}

``` python
# create a very simple dataset
dataset = tf.data.Dataset.range(6)
arr = [val.numpy() for val in dataset]
print(arr)
# [0, 1, 2, 3, 4, 5]
```

``` python
# make equal (drop_remaninder) windows
dataset = dataset.window(5, shift=1, drop_remainder=True)
dataset = dataset.flat_map(lambda window: window.batch(5))
    # instead of val.numpy for each val in each window
for window in dataset:
    print(window.numpy())
# [0 1 2 3 4]
# [1 2 3 4 5]
```

``` python
# split the last value to be label
dataset = dataset.map(lambda window: (window[:-1], window[-1:]))
# [0 1 2 3] [4]
# [1 2 3 4] [5]
```

``` python
# shuffle
dataset = dataset.shuffle(buffer_size=6)
# construct batch of 2
dataset = dataset.batch(2).prefetch(1)
# x =  [[1 2 3 4], [0 1 2 3]]
# y =  [[5], [4]]
```
{% endhsbox %}

## Sequence bias

Sequence bias is when the order of things can impact the selection of things. <mark>It's ok to shuffle!</mark>

## Feeding windowed datasets into NN

📙 Notebook: [Single layer NN](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-2/notebook_2_1layer_NN_linear_reg.html) + [video explains it](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/YERBd/more-on-single-layer-neural-network).

``` python
# Simple linear regression (1 layer NN)
dataset = windowed_dataset(x_train, window_size, batch_size, shuffle_buffer_size)
l0 = tf.keras.layers.Dense(1, input_shape=[window_size])
model = tf.keras.models.Sequential([l0])
model.compile(loss="mse", optimizer=tf.keras.optimizers.SGD(lr=1e-6, momentum=0.9))
model.fit(dataset,epochs=100,verbose=0)
print("Layer weights {}".format(l0.get_weights()))

forecast = []

for time in range(len(series) - window_size):
    forecast.append(model.predict(series[time:time + window_size][np.newaxis]))
    # np.newaxis: reshape X to input dimension that used by the model

forecast = forecast[split_time-window_size:]
results = np.array(forecast)[:, 0, 0]
```

📙 Notebook: [DNN with TS](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-2/notebook_3_DNN_TS.html) + [video explains it](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/HecKT/deep-neural-network-training-tuning-and-prediction).

``` python
# A way to choose an optimal learning rate
lr_schedule = tf.keras.callbacks.LearningRateScheduler(
    lambda epoch: 1e-8 * 10**(epoch / 20))
optimizer = tf.keras.optimizers.SGD(lr=1e-8, momentum=0.9)
model.compile(loss="mse", optimizer=optimizer)
history = model.fit(dataset, epochs=100, callbacks=[lr_schedule], verbose=0)
```

<div class="columns-2">

``` python
lrs = 1e-8 * (10 ** (np.arange(100) / 20))
plt.semilogx(lrs, history.history["loss"])
plt.axis([1e-8, 1e-3, 0, 300])
```

![Loss w.r.t different learning rates.]({{img_url}}/c4_w2_lr.png){:.img-100 .bg-white}
_Loss w.r.t different learning rates. We choose the lowest one, around 8e-6._
</div>

📙 Notebook: [DNN with synthetic TS](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-2/notebook_4_DNN_synthetic_data.html).

## RNN for TS

{:.noindent}
- RRN is a NN containing Recurrent layer.
- The different from DNN is the input shape is __3 dimensional__ (`batch_size x #time_step x dims_input_at each_timestep`).
- Re-use 1 cell multiple times in different layers (in this course).

![Idea of how RNN works with TS data.]({{img_url}}/rnn_ts_idea.png){:.img-100}
_Idea of how RNN works with TS data. The current location can be impacted more by the nearby locations._

### Shape of input to RNN

👉 [Video explains the dimensional and sequence-to-vector RNN](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/fP3ND/shape-of-the-inputs-to-the-rnn).

{:.noindent}
- Suppose: _window size_ of 30 time steps, _batch size_ of 4: Shape will be 4x30x1 and the _memory cell_ input will be 4x1 matrix.
- If the memory cell comprises 3 neurons then the _output matrix_ will be 4x3. Therefore, the full output of the layer will be 4x30x3.
- $H_i$ is just a copy of $Y_i$.
- Below figure: input and also output a sequence.

![Dimension of input to RNN.]({{img_url}}/rnn_ts_dim.png){:.img-100}
_Dimension of input to RNN._

### Sequence to vector RNN

{:.noindent}
- Sometimes, we want only input a sequence but not output. This called __sequence-to-vector RNN__. I.E., <mark>ignore all of the outputs except the last one!</mark>. In `tf.keras`, it's default setting!

![Sequence to vector RNN.]({{img_url}}/rnn_ts_sequence_to_vector.png){:.img-100}
_Sequence to vector RNN._

``` python
# Check the figure below as an illustration
model = tf.keras.models.Sequential([
tf.keras.layers.SimpleRNN(20, return_sequences=True, input_shape=[None, 1]),
    # input_shape:
    #   TF assumes that 1st dim is batch size -> any size at all -> no need to define
    #   None -> number of time steps, None means RNN can handle sequence of any length
    #   1 -> univariate TS
tf.keras.layers.SimpleRNN(20),
    # if there is `return_sequences=True` -> sequence-to-sequence RNN
tf.keras.layers.Dense(1),
])
```

![Illustration with keras.]({{img_url}}/rnn_ts_illustraction_with_keras.png){:.img-80}
_Illustration with keras._

### Lambda layer

👉 [Video explains the use of lambda layer in RNN.](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/I0K6b/lambda-layers).

``` python
model = tf.keras.models.Sequential([
    tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=-1), # expand to 1 dim (from 2) so that we have 3 dims: batch size x #timesteps x series dim
                        input_shape=[None]), # can use any size of sequences
    tf.keras.layers.SimpleRNN(40, return_sequences=True),
    tf.keras.layers.SimpleRNN(40),
    tf.keras.layers.Dense(1),
    tf.keras.layers.Lambda(lambda x: x * 100.0)
        # default activation in RNN is tanh -> (-1, 1) -> scale to -100, 100
])
```

### Simple RNN

{:.noindent}
- Loss function __Huber__ ([wiki](https://en.wikipedia.org/wiki/Huber_loss)): less sensitive to outliers. => we use this because our data in this case get a little bit noisy!

📙 Notebook: [Simple RNN with a TS data](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-3/notebook_1_simple_RNN_with_TS.html) + [videos explains it](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/5W1Rw/rnn).

### LSTM

📙 Notebook: [LSTM with a TS data](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-3/notebook_2_LSTM_with_TS.html) + [videos explains it](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/IqcpX/more-on-lstm).

``` python
# clear internal variables
tf.keras.backend.clear_session()
dataset = windowed_dataset(x_train, window_size, batch_size, shuffle_buffer_size)

model = tf.keras.models.Sequential([
    tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=-1),
                        input_shape=[None]),
    # LSTM here
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32, return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32, return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    #
    tf.keras.layers.Dense(1),
    tf.keras.layers.Lambda(lambda x: x * 100.0)
])
```

📙 Notebook: [LSTM with synthetic TS](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-3/notebook_3_LSTM_synthetic_data.html).

## Real-world time series data

{:.noindent}
- We are going to predict the __sunspot actitivity cycles__ ([download dataset](https://www.kaggle.com/robervalt/sunspots)).
- Combine CNN + LSTM.

👉 Andrew's [video on Optimization Algo: Mini-batch gradient descent](https://www.youtube.com/watch?v=4qJaSmvhxi8).
📙 Notebook: [Sunspot dataset with CNN+LSTM](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-4/notebook_1_sunspot_cnn_lstm.html). + [video explains it](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/zAaeD/combining-our-tools-for-analysis).
📙 Notebook: [Sunspot dataset with DNN only](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-4/week-4/notebook_2_sunspot_DNN_only.html) + [explaining video](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/EPaeW/sunspots).
👉 [Video explains train & tune the model](https://www.coursera.org/learn/tensorflow-sequences-time-series-and-prediction/lecture/LYbcx/train-and-tune-the-model) (how to choose suitable values for sizes)