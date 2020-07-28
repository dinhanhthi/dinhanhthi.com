---
layout: post
title: "TF 1 - Intro to TensorFlow for AI, ML, DL"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai, tensorflow]
icon-photo: tensorflow.svg
katex: 1
keywords: "deep learning ai coursera tensorflow google project python mnist convolutional neural networks cnn andrew ng"
---

{% assign img-url = '/img/post/mooc/tf' %}

{% include toc.html %}

This is my note for the [first course](https://www.coursera.org/learn/introduction-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

{% katexmm %}

## Basic DL on MNIST

``` python
import tensorflow as tf

# stop the training with condition
class myCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs={}): # compare at the end of each epoch
        if(logs.get('accuracy') > 0.99):
            self.model.stop_training = True

mnist = tf.keras.datasets.mnist
(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0 # normalize

callbacks = myCallback() # define the callback

model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)), # takes that square and turns it into a 1 dim
    tf.keras.layers.Dense(512, activation=tf.nn.relu),
    tf.keras.layers.Dense(10, activation=tf.nn.softmax) # 10 outputs
])
```

Comments ([notebook](https://bit.ly/3jHSCYg)):

1. Adding more Neurons we have to do more calculations, slowing down the process, but get more accurate.
2. The first layer in your network should be the same shape as your data.
3. The number of neurons in the last layer should match the number of classes you are classifying for.
4. Extra layers are often necessary.

## Basic DL on Fashion-MNIST


``` python
# the same as in MINST
# different at below line of loading data
mnist = tf.keras.datasets.fashion_mnist
```

## Basic CNN

``` python
import tensorflow as tf
mnist = tf.keras.datasets.fashion_mnist

(training_images, training_labels), (test_images, test_labels) = mnist.load_data()
# Why reshape?
# The first convolution expects a single tensor containing everything,
# so instead of 60000 28x28x1 items in a list, we have a single 4D list
# that is 60000x28x28x1
training_images=training_images.reshape(60000, 28, 28, 1)
training_images=training_images / 255.0
test_images = test_images.reshape(10000, 28, 28, 1)
test_images=test_images/255.0

model = tf.keras.models.Sequential([
  tf.keras.layers.Conv2D(64, (3,3), activation='relu', input_shape=(28, 28, 1)),
  tf.keras.layers.MaxPooling2D(2, 2),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPooling2D(2,2),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.summary() # model detail

model.fit(training_images, training_labels, epochs=5)
test_loss = model.evaluate(test_images, test_labels)
```

``` bash
# model.summary()
Model: "sequential_1"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
conv2d (Conv2D)              (None, 26, 26, 64)        640
                             # for every image, 64 convolution has been tried
                             # 26 (=28-2) because we use 3x3 filter and we can't
                             # count on edges, so the picture is 2 smaller on x and y.
                             # if 5x5 filter => 4 smaller on x and y.
_________________________________________________________________
max_pooling2d (MaxPooling2D) (None, 13, 13, 64)        0
_________________________________________________________________
conv2d_1 (Conv2D)            (None, 11, 11, 64)        36928
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 5, 5, 64)          0
_________________________________________________________________
flatten_1 (Flatten)          (None, 1600)              0
_________________________________________________________________
dense_2 (Dense)              (None, 128)               204928
_________________________________________________________________
dense_3 (Dense)              (None, 10)                1290
=================================================================
Total params: 243,786
Trainable params: 243,786
Non-trainable params: 0
```

Comments:

1. [Kernel in image processing](https://en.wikipedia.org/wiki/Kernel_(image_processing)): examples with images.
2. [Pooling layer](https://en.wikipedia.org/wiki/Convolutional_neural_network#Pooling_layer): non-linear down-sampling.

More?

1. [Image Filtering](https://lodev.org/cgtutor/filtering.html) -- Lode's Computer Graphics Tutorial
2. Applying Convolutions on top of our Deep neural network will make training => It depends on many factors. It might make your training faster or slower, and a poorly designed Convolutional layer may even be less efficient than a plain DNN!
3. What is a Convolution? => A technique to isolate features in images
4. What is a Pooling? => A technique to reduce the information in an image while maintaining features
5. How do Convolutions improve image recognition? => They isolate features in images
6. After passing a 3x3 filter over a 28x28 image, how big will the output be? => 26x26
7. After max pooling a 26x26 image with a 2x2 filter, how big will the output be? => 13x13


## Visualizing the Convolutions and Pooling

Using layer API, something like below, check more in [the notebook](https://bit.ly/3f6wQtA).

``` python
import matplotlib.pyplot as plt
f, axarr = plt.subplots()

from tensorflow.keras import models
layer_outputs = [layer.output for layer in model.layers]
activation_model = tf.keras.models.Model(inputs = model.input, outputs = layer_outputs)

for x in range(0,4):
    f1 = activation_model.predict(test_images[FIRST_IMAGE].reshape(1, 28, 28, 1))[x]
    axarr[0,x].imshow(f1[0, : , :, CONVOLUTION_NUMBER], cmap='inferno')
    axarr[0,x].grid(False)
    ...
```

{% endkatexmm %}
