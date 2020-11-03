---
layout: post
title: "DL 4 - CNN"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai]
icon-photo: deeplearning-ai.png
katex: 1
notfull: 1
keywords: "andrew ng machine learning"
---

{% assign img-url = '/img/post/mooc/dl' %}

{% include toc.html %}

This is my note for the course ([Convolutional Neural Networks](https://www.coursera.org/learn/convolutional-neural-networks?specialization=deep-learning)). The codes in this note are rewritten to be more clear and concise.

🎯 [Overview of all 5 courses.](/deeplearning-ai)

👉 **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1).<br />
👉 **Course 2** -- [Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization](/deeplearning-ai-course-2).<br />
👉 **Course 3** -- [Structuring Machine Learning Projects](/deeplearning-ai-course-3).<br />
👉 **Course 5** -- [Sequence Models](/deeplearning-ai-course-5).

This course will teach you how to build convolutional neural networks and apply it to image data.

{% katexmm %}

## Computer vision

- Challenges of computer vision: inputs get really big. $\Rightarrow$ Easily lead to overfitting and infeasible!

## Edge Detection

- We wanna detect vertical / horizontal edges. $*$ is called a <mark>convolution</mark> operator. The $3\times 3$ square is called a <mark>filter</mark> (<mark>kernel</mark>)

    {:.img-90.pop}
    ![Horizontal edge detection]({{img-url}}/edge_detection.png)
    _Horizontal edge detection.<sup>[ref](http://datahacker.rs/edge-detection-extended/)</sup>_

    {:.img-80.pop}
    ![Vertical vs horizontal]({{img-url}}/verticle_horizontal.png)
    _Vertical vs Horizontal.<sup>[ref](http://datahacker.rs/edge-detection-extended/)</sup>_

- There are many different filers we could use. __Sobel filter__ and __Scharr filter__ 's advantage is that it allows you to put a little bit more weight to the central row of the central pixel, this makes it maybe a little bit more robust.

    {:.img-80.pop}
    ![Sobel filter and Scharr filter]({{img-url}}/conv_3_filtri_sobel_sch.png)
    _Sobel filter and Scharr filter.<sup>[ref](http://datahacker.rs/edge-detection-extended/)</sup>_


## References

- [2 ResNet Architecture](https://www.youtube.com/watch?v=0tBPSxioIZE).
- [Understand how works Resnet… without talking about residual](https://medium.com/@pierre_guillou/understand-how-works-resnet-without-talking-about-residual-64698f157e0c)


👉 **Course 5** -- [Sequence Models](/deeplearning-ai-course-5).

{% endkatexmm %}