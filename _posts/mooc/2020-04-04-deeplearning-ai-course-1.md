---
layout: post
title: "Deep Learning Coursera -- Course 1"
categories: [mooc]
tags: [mooc, coursera]
icon-photo: deeplearning-ai.png
katex: 1
notfull: 1
keywords: "logistic regression sigmoid derivative function python tips softmax activation function forward propagation and backward propagation simple neural network model predict an image of cat"
---

{% assign img-url = '/img/post/mooc/dl' %}

{% include toc.html %}

The handwriting notes for this course ([Neural Networks and Deep Learning](https://www.coursera.org/learn/neural-networks-deep-learning?specialization=deep-learning)) is available here. This note contains only the important things.

{% katexmm %}

## Activation functions

Check [Comparison of activation functions](https://en.wikipedia.org/wiki/Activation_function#Comparison_of_activation_functions) on wikipedia.

### Why non-linear activation functions?



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

{:.img-full-100}
![sigmoid function]({{img-url}}/sigmoid.png)
_Signmoid function graph on Wikipedia._
</div>

<div class="flex-50" markdown="1">
~~~ python
import numpy as np
import numpy as np

def sigmoid(x):
    s = 1 / (1+np.exp(-x))
    return s
~~~

~~~ python
def sigmoid_derivative(x):
    s = sigmoid(x)
    ds = sigmoid(x)*(1-sigmoid(x))
    return ds
~~~
</div>

### Softmax function

<div class="columns-2" markdown="1">
The output of the softmax function can be used to represent a categorical distribution – that is, a probability distribution over <mark>K different possible</mark> outcomes.

{:.img-full-100}
![softmax function]({{img-url}}/softmax.png)
_Udacity Deep Learning Slide on Softmax_
</div>

<div class="columns-2" markdown="1">
$$
\sigma (\mathbf {z} )_{i}={\frac {e^{z_{i}}}{\sum _{j=1}^{K}e^{z_{j}}}}{\text{ for }}i=1,\dotsc ,K{\text{ and }}\mathbf {z}\in \mathbb {R} ^{K}
$$

~~~ python
def softmax(x):
  x_exp = np.exp(x)
  x_sum = np.sum(x_exp, axis=1, keepdims=True)
  s = x_exp / x_sum
  return s
~~~
</div>

### tanh function

- tanh is better than sigmoid because mean $\to$ 0 and it centers the data better for the next layer.
- Don't use sigmoid on hidden units except for the output layer because in the case $0 \le \hat{y} \le 1$, sigmoid is better than tanh.

<div class="columns-2" markdown="1">
$$
\sigma(z) = \dfrac{e^{-z} - e^{-z}}{e^{-z} + e^{-z}}
$$

{:.img-full-100}
![tanh function]({{img-url}}/tanh.png)
_Graph of tanh from analyticsindiamag._
</div>

### ReLU

- ReLU (**R**ectified **L**inear **U**nit).
- Its derivative is much different from 0 than sigmoid/tanh $\to$ learn faster!
- <mark>If you aren't sure which one to use in the activation, use ReLU!</mark>
- Weakness: derivative ~ 0 in the negative side, we use **Leaky ReLU** instead! However, Leaky ReLU aren't used much in practice!

$$
\sigma(z) = max(0,z)
$$

{:.img-full-70}
![relu vs leaky relu]({{img-url}}/relu-leaky.jpg)
_ReLU (left) and Leaky ReLU (right)_

## Logistic Regression

### Forward and Backward propagation

Initialize $w, b$ and then repeat until convergence ($m$: number of training examples, $\alpha$: learning rate, $J$: cost function, $A$: activation function):

{:.pl-4.two-columns}
1. $A = \sigma(w^TX + b)$
2. $J(w,b) = -\frac{1}{m} \left( Y \log A^T + (1-Y)\log(1-A^T) \right)$
3. $\partial_{w}J = \frac{1}{m}X(A-Y)^T$
4. $\partial_{b}J = \frac{1}{m} \Sigma (A-Y)$
5. $w := w - \alpha \partial_{w}J$
6. $b := b - \alpha \partial_{b}J$

The <mark>dimension of variables</mark>: $X\in \mathbb{R}^{n_x \times m}, Y\in \mathbb{R}^{1\times m}, b\in \mathbb{R}^{1\times m}, w\in \mathbb{R}^{n_x \times 1}, A\in \mathbb{R}^{1\times m}, J\in \mathbb{R}$, $\partial_wJ \in \mathbb{R}$, $\partial_bJ \in \mathbb{R}$.

{% hsbox Show the codes %}

``` python
def logistic_regression_model(X_train, Y_train, X_test, Y_test, 
                              num_iterations = 2000, learning_rate = 0.5):

    m = X_train.shape[1] # number of training examples

    # INITIALIZE w, b
    w = np.zeros((X_train.shape[0], 1))
    b = 0

    # GRADIENT DESCENT
    for i in range(num_iterations):
        grads, cost = propagate(w, b, X_train, Y_train)
        dw = grads["dw"]
        db = grads["db"]
        w = w - learning_rate*dw
        b = b - learning_rate*db
        
        # FORWARD PROPAGATION (from x to cost)
        A = sigmoid(np.dot(w.T, X_train) + b)
        cost = -1/m * (np.dot(Y, np.log(A.T)) 
               + p.dot((1-Y), np.log(1-A.T)))

        # BACKWARD PROPAGATION (find grad)
        dw = 1/m * np.dot(X_train, (A-Y).T)
        db = 1/m * np.sum(A-Y)
        cost = np.squeeze(cost)

        # OPTIMIZE
        w = w - learning_rate*dw
        b = b - learning_rate*db

    # PREDICT (with optimized w, b)
    Y_pred = np.zeros((1,m))
    w = w.reshape(X.shape[0], 1)

    A = sigmoid(np.dot(w.T,X_test) + b)
    Y_pred_test = A > 0.5
```

{% endhsbox %}

## Neural Network overview

- We need **forward propagation** to find the cost and we need **backward propagation** to find optimal paramters.

### Notations

<div class="two-columns-list" markdown="1">
- $a^{[0]} = X$ : input layer.
- $a^{[2]}_i$ : layer $2$, node $i$.
- $a^{[2](i)}$ : layer $2$, example $i$.
- $n_x$ : number of features.
- $m$ : number of examples.
</div>

### Dimensions

<div class="two-columns-list" markdown="1">
- $X \in \mathbb{R}^{n_x \times m}$
</div>


## Python tips

○ Reshape quickly from `(10,9,9,3)` to `(9*9*3,10)`:

~~~ python
X = np.random.rand(10, 9, 9, 3)
X = X.reshape(10,-1).T
~~~

○ Don't use loop, use **vectorization**!


{% endkatexmm %}
