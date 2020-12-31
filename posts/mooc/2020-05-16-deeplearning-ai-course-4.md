---
layout: post
title: "DL 4 - Convolutional Neural Network (CNN)"
tags: [MOOC, deeplearning.ai, Deep Learning, CNN]
toc: true
icon: deeplearning-ai.png
keywords: ""
notfull: 1
---

{% assign img-url = '/img/post/mooc/dl/cnn' %}

This is my note for the course ([Convolutional neural network](https://www.coursera.org/learn/convolutional-neural-networks/home/welcome)). The codes in this note are rewritten to be more clear and concise.

👉 **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1).
👉 **Course 2** -- [Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization](/deeplearning-ai-course-2).
👉 **Course 3** -- [Structuring Machine Learning Projects](/deeplearning-ai-course-3).
👉 **Course 4** -- [Convolutional Neural Networks](/deeplearning-ai-course-4).
👉 **Course 5** -- [Sequence Models](/deeplearning-ai-course-5).

::: warning
This site is under the way of being converted from [this quick note](https://www.notion.so/dinhanhthi/CNN-by-deeplearning-ai-a081d253fc2c4c0b99edd2757c759b9e).
:::

## CNN

### Intro

- $H\times W \times C$ $\Rightarrow$ too large $\Rightarrow$ too many parameters $\Rightarrow$ Need Conv.
- **Edge detection** by a **filter** (3x3 for example) (or **kernel**) $\Rightarrow$ multiply with original image by a **convulution operator** (*)

    ![CNN%20by%20deeplearning%20ai%20c3e21f2887ce494ab8e4a7c7997680f5/Untitled.png]({{img-url}}/Untitled_0.png){:.img-90}

    ![CNN%20by%20deeplearning%20ai%20c3e21f2887ce494ab8e4a7c7997680f5/Untitled_1.png]({{img-url}}/Untitled_1.png){:.img-90}

    - **Sobel filter, Scharr filter** (not only 0, 1, -1)

        ![CNN%20by%20deeplearning%20ai%20c3e21f2887ce494ab8e4a7c7997680f5/Untitled_2.png]({{img-url}}/Untitled_2.png){:.img-100}

    - Can use **backprop** to learn the value of filter.

        ![CNN%20by%20deeplearning%20ai%20c3e21f2887ce494ab8e4a7c7997680f5/Untitled_3.png]({{img-url}}/Untitled_3.png){:.img-100}

    - Not only edge, we can learn by degree of images.

### Padding

- We don't want image to shrink everytime
    - $(6\times 6) \ast (3\times 3)$ (filter) $\Rightarrow 4\times 4$
    - $(n\times n) \ast (f\times f) \Rightarrow (n-f+1) \times (n-f+1)$
- We don't want pixel on the corner or edges are used much less on the outputs
- $\Rightarrow$ we can pad the images (expand more all around the images): $6\times 6$ $\Rightarrow$ (pad 1) $\Rightarrow 8\times 8$
  - $(8\times 8) \ast (3\times 3)$ $\Rightarrow 6\times 6$ (instead of $4\times 4$)
  - $\Rightarrow$ $(n+2p-f+1) \times (n+2p-f+1)$
- 2 common choices:
  - **valid conv** $\Rightarrow$ no padding: $(n\times n) * (f\times f) \Rightarrow (n-f+1) \times (n-f+1)$
  - **same conv** $\Rightarrow$ out's size = in's size $\Rightarrow$ choose $p=\frac{f-1}{2}$
- $f$ is usually odd $\Rightarrow$ just a convention. $3\times 3$, $5\times 5$ are very common.

### Stride convulutions

### Conv over volumes

### 1-layer of ConvNet

### Simple example of ConvNet

### Pooling layer

### LeNet-5

### Why Convolution?