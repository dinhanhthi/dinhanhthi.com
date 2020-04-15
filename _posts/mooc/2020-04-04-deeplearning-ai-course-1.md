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

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

The handwriting notes for this course ([Neural Networks and Deep Learning](https://www.coursera.org/learn/neural-networks-deep-learning?specialization=deep-learning)) is available here. This note contains only the important things.

{% katexmm %}

## Logistic Regression

### Sigmoid function

<div class="columns-2" markdown="1">
$$
\begin{aligned}
\sigma(z) &= \dfrac{1}{1+e^{-z}} \\
\sigma(z) &\xrightarrow{z\to \infty} 1 \\
\sigma(z) &\xrightarrow{z\to -\infty} 0
\end{aligned}
$$

~~~ python
import numpy as np
import numpy as np

def sigmoid(x):
    s = 1 / (1+np.exp(-x))
    return s
~~~
</div>

<div class="columns-2" markdown="1">
$$
\sigma'(x) = \sigma(x) (1 - \sigma(x))
$$

~~~ python
def sigmoid_derivative(x):
    s = sigmoid(x)
    ds = sigmoid(x)*(1-sigmoid(x))
    return ds
~~~
</div>

### Softmax function

The output of the softmax function can be used to represent a categorical distribution – that is, a probability distribution over K different possible outcomes.

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

### Forward and Backward propagation

Initialize $w, b$ and then repeat until convergence ($m$: number of training examples, $\alpha$: learning rate, $J$: cost function, $A$: activation function):

{:.pl-4.two-columns}
1. $A = \sigma(w^TX + b)$
2. $J(w,b) = -\frac{1}{m} \left( Y \log A^T + (1-Y)\log(1-A^T) \right)$
3. $\partial_{w}J = \frac{1}{m}X(A-Y)^T$
4. $\partial_{b}J = \frac{1}{m} \Sigma (A-Y)$
5. $w := w - \alpha \partial_{w}J$
6. $b := b - \alpha \partial_{b}J$

The dimension of variables: $X\in \mathbb{R}^{n_x \times m}, Y\in \mathbb{R}^{1\times m}, b\in \mathbb{R}^{1\times m}, w\in \mathbb{R}^{n_x \times 1}, A\in \mathbb{R}^{1\times m}, J\in \mathbb{R}$, $\partial_wJ \in \mathbb{R}$, $\partial_bJ \in \mathbb{R}$.

{% hsbox Show the codes %}
<div class="flex-50" markdown="1">
~~~ python
# Initialize b and w
def initialize_with_zeros(dim):
    w = np.zeros((dim, 1))
    b = 0   
    return w, b
~~~

~~~ python
# Finding grad_w and grad_b
def propagate(w, b, X, Y):
    m = X.shape[1]
    # FORWARD PROPAGATION (FROM X TO COST)
    A = sigmoid(np.dot(w.T,X) + b)
    cost = -1/m * (np.dot(Y, np.log(A.T)) 
            + p.dot((1-Y), np.log(1-A.T)))
    # BACKWARD PROPAGATION (TO FIND GRAD)
    dw = 1/m * np.dot(X, (A-Y).T)
    db = 1/m * np.sum(A-Y)
    cost = np.squeeze(cost)
    grads = {"dw": dw, "db": db}
    return grads, cost
~~~

~~~ python
# Find the best b, w
def optimize(w, b, X, Y, num_iterations, 
             learning_rate):
    for i in range(num_iterations):
      grads, cost = propagate(w, b, X, Y)
      # Retrieve derivatives from grads
      dw = grads["dw"]
      db = grads["db"]
      w = w - learning_rate*dw
      b = b - learning_rate*db
    params = {"w": w, "b": b}
    grads = {"dw": dw, "db": db}
    return params, grads
~~~

~~~ python
# Using found w, b and X to predict Y
def predict(w, b, X):
    m = X.shape[1]
    Y_pred = np.zeros((1,m))
    w = w.reshape(X.shape[0], 1)
    A = sigmoid(np.dot(w.T,X) + b)    
    for i in range(A.shape[1]):
        # Convert probabilities A[0,i] 
        #   to actual predictions p[0,i]
        Y_pred = A > 0.5
        Y_pred = Y_pred.astype(int)
    return Y_pred
~~~
</div>
{% endhsbox %}

### Logistic Regression Model

Using above functions `initialize_with_zeros`, `propagate`, `optimize` and `predict`.

{% hsbox Show the codes %}
~~~ python
def model(X_train, Y_train, X_test, Y_test, num_iterations = 2000, learning_rate = 0.5):    
    # initialize parameters with zeros
    w, b = initialize_with_zeros(X_train.shape[0])
    # Gradient descent
    parameters, grads, costs = optimize(w, b, X_train, Y_train, num_iterations, learning_rate)
    # Retrieve parameters w and b from dictionary "parameters"
    w = parameters["w"]
    b = parameters["b"]
    # Predict test/train set examples
    Y_prediction_test = predict(w, b, X_test)
    Y_prediction_train = predict(w, b, X_train)
    # Print train/test Errors
    print("train accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_train - Y_train)) * 100))
    print("test accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_test - Y_test)) * 100))
~~~
{% endhsbox %}

### Predict an image of cat

{% hsbox Show the codes %}
~~~ python
import scipy
from PIL import Image
from scipy import ndimage

my_image = "my_image.jpg" 

fname = my_image
image = np.array(ndimage.imread(fname, flatten=False))
image = image/255.
my_image = scipy.misc.imresize(image, size=(num_px,num_px)).reshape((1, num_px*num_px*3)).T
my_predicted_image = predict(d["w"], d["b"], my_image)

plt.imshow(image)
print("y = " + str(np.squeeze(my_predicted_image)) 
      + ", your algorithm predicts a \"" 
      + classes[int(np.squeeze(my_predicted_image)),].decode("utf-8") 
      + "\" picture.")
~~~
{% endhsbox %}

## Python tips

○ Reshape quickly from `(10,9,9,3)` to `(9*9*3,10)`:

~~~ python
X = np.random.rand(10, 9, 9, 3)
X = X.reshape(10,-1).T
~~~

○ Don't use loop, use **vectorization**!


{% endkatexmm %}
