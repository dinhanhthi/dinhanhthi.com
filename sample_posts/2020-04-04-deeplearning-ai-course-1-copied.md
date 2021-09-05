---
layout: post
title: "DL 1 - NN and DL"
tags: [MOOC, deeplearning.ai, Deep Learning]
toc: true
icon: deeplearning-ai.png
keywords: "logistic regression sigmoid derivative function python tips softmax activation function forward propagation and backward propagation simple neural network model predict an image of cat tanh relu leaky relu gradient descent L layer L-layer initialize parameters and hyperparameters shallow nn recognize a cat reshape neural networks supervised learning geoffrey hinton binary classification logistic gradient descent derivatives computation graph vetorization jupyter notebook Pieter Abbeel NN representation backprop intuition matrix dimension deep l-layer building blocks hyperparameters andrew ng"
---

{% assign img-url = '/img/post/mooc/dl' %}

This is my note for the course ([Neural Networks and Deep Learning](https://www.coursera.org/learn/neural-networks-deep-learning?specialization=deep-learning)). The codes in this note are rewritten to be more clear and concise.

👉 **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1/).

If you want to break into cutting-edge AI, this course will help you do so.

## Activation functions

👉 Check [Comparison of activation functions](https://en.wikipedia.org/wiki/Activation_function#Comparison_of_activation_functions) on wikipedia.

### Why non-linear activation functions in NN Model?

Suppose $g(z)=z$ (linear)

$$
\begin{aligned}
a^{[1]} &= g(z^{[1]} = z^{[1]}) = w^{[1]}x + b^{[1]} \quad \text{(linear)} \\
a^{[1]} &= g(z^{[2]} = z^{[2]}) = w^{[2]}a^{[1]} + b^{[2]} \\
        &= (w^{[2]}w^{[1]})x + (w^{[2]}b^{[1]} + b^{[2]}) \quad \text{(linear again)}.
\end{aligned}
$$

You might not have any hidden layer! Your model is just Logistic Regression, no hidden unit! <mark>Just use non-linear activations for hidden layers!</mark>

### Sigmoid function

- Usually used in the output layer in the binary classification.
- <mark>Don't use sigmoid in the hidden layers!</mark>

<div class="columns-2" markdown="1">

$$
\begin{aligned}
\sigma(z) &= \dfrac{1}{1+e^{-z}} \\
\sigma(z) &\xrightarrow{z\to \infty} 1 \\
\sigma(z) &\xrightarrow{z\to -\infty} 0 \\
\sigma'(x) &= \sigma(x) (1 - \sigma(x))
\end{aligned}
$$

![sigmoid function]({{img-url}}/sigmoid.png){:.img-100 .bg-white}
_Signmoid function graph on Wikipedia._
</div>

<div class="col-2-equal">

~~~ python
import numpy as np
import numpy as np

def sigmoid(z):
    return 1 / (1+np.exp(-z))
~~~

~~~ python
def sigmoid_derivative(z):
    return sigmoid(z)*(1-sigmoid(z))
~~~
</div>