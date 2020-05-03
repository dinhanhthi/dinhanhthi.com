---
layout: post
title: "Deep Learning Coursera - Course 2"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai]
icon-photo: deeplearning-ai.png
katex: 1
notfull: 1
keywords: "train test dev sets big data training cross validation hold out mismatched distribution bias variance underfitting overfitting just right high low recipe machine learning tradeoff supervised learning unsupervised regularization logistic regression neural network deep learning L1 L2 Frobenius norm weight decay lambda variance problem implementation dropout regularization inverted dropout keep prob make prediction computer vision frequently downside drawback data augmentation horizontally flip double size distortion zoom rotate early stopping orthoganalization mean normalize unnormalized vanishing exploding gradients weight initialization relu tanh gradient checking euclide distance debug Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization"
---

{% assign img-url = '/img/post/mooc/dl' %}

{% include toc.html %}

This is my note for the course ([Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization](https://www.coursera.org/learn/deep-neural-network)). The codes in this note are rewritten to be more clear and concise.

⏪ **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1).

{% katexmm %}

## Initialization step

`layers_dims` contains the size of each layer from $0$ to $L$.

### zero initialization

``` python
parameters['W'+str(l)] = np.zeros((layers_dims[l], layers_dims[l-1]))
parameters['b'+str(l)] = np.zeros((layers_dims[l], 1))
```

- The performance is really bad, and the cost does not really decrease.
- In general, initializing all the weights to zero results in the network failing to break symmetry. This means that every neuron in each layer will learn the same thing, and you might as well be training a neural network with $n^{[l]}=1$ for every layer, and the network is no more powerful than a linear classifier such as logistic regression.

### Random initialization

<mark>To break symmetry</mark>, lets intialize the weights randomly.

``` python
parameters['W'+str(l)] = np.random.randn(layers_dims[l], layers_dims[l-1]) * 10 # <- LARGE (just an example of SHOULDN'T)
parameters['b'+str(l)] = np.zeros((layers_dims[l], 1))
```
- The cost starts very high. This is because with large random-valued weights, the last activation (sigmoid) outputs results that are very close to 0 or 1 for some examples, and when it gets that example wrong it incurs a very high loss for that example. Indeed, when $\log(a^{[l]}) = \log(0)$, the loss goes to infinity.
- Poor initialization can lead to vanishing/exploding gradients, which also slows down the optimization algorithm.
- If you train this network longer you will see better results, but initializing with overly large random numbers slows down the optimization.

### He initialization

Multiply randomly initial $W$ with $\sqrt{\frac{2}{n^{[l-1]}}}$. It's similar to **Xavier initialization** in which multipler factor is $\sqrt{\frac{1}{n^{[l-1]}}}$

``` python
parameters['W' + str(l)] = np.random.randn(layers_dims[l], layers_dims[l-1]) * np.sqrt(2./layers_dims[l-1])
parameters['b' + str(l)] = np.zeros((layers_dims[l], 1))
```

## Regularization step

To reduce the **overfitting problem**.

### L2 regularization

``` python
L2_regularization_cost = 0
for l in range(1, L+1):
    L2_regularization_cost += 1/m * lambd/2 * (np.sum(np.square(W[l]))
```

- The standard way. Modify cost function from,
    $$J = -\frac{1}{m} \sum\limits_{i = 1}^{m} \large{(}\small  y^{(i)}\log\left(a^{[L](i)}\right) + (1-y^{(i)})\log\left(1- a^{[L](i)}\right) \large{)}$$
    to
    $$J_{regularized} = \small \underbrace{-\frac{1}{m} \sum\limits_{i = 1}^{m} \large{(}\small y^{(i)}\log\left(a^{[L](i)}\right) + (1-y^{(i)})\log\left(1- a^{[L](i)}\right) \large{)} }_\text{cross-entropy cost} + \underbrace{\frac{1}{m} \frac{\lambda}{2} \sum\limits_l\sum\limits_k\sum\limits_j W_{k,j}^{[l]2} }_\text{L2 regularization cost}$$
- The value of $\lambda$ is a hyperparameter that you can tune using a dev set.
- L2 regularization makes your decision boundary smoother. If $\lambda$ is too large, it is also possible to "oversmooth", resulting in a model with high bias.

### Dropout

``` python
# [Forward] An example at layer 3
D3 = np.random.rand(A3.shape(0), A3.shape(1)) < keep_drop
A3 *= D3
A3 /= keep_drop
# [Backprop]
dA3 *= D3
dA3 /= keep_drop
```

- <mark>Dropout is a widely used regularization technique that is specific to deep learning</mark>. It randomly shuts down some neurons in each iteration.
- When you shut some neurons down, you actually modify your model. <mark>The idea behind drop-out</mark> is that at each iteration, you train a different model that uses only a subset of your neurons.
- With dropout, your neurons thus become <mark>less sensitive to the activation</mark> of one other specific neuron, because that other neuron might be shut down at any time.
- We will not apply dropout to the input layer or output layer.
- You only use dropout during training. Don't use dropout (randomly eliminate nodes) during test time.
- Apply dropout both during forward and backward propagation.

## Gradient checking

- To answer this <mark markdown="span">"_Give me a proof that your backpropagation is actually working!"_</mark>
- We are confident on computing $J$ but $\frac{\partial J}{\partial\theta}$.
- Use $J$ to compute an approximation of $\frac{\partial J}{\partial\theta}$ and compare with $\frac{\partial J}{\partial\theta}$.
    $$ \frac{\partial J}{\partial \theta} = \lim_{\varepsilon \to 0} \frac{J(\theta + \varepsilon) - J(\theta - \varepsilon)}{2 \varepsilon}$$

{% endkatexmm %}