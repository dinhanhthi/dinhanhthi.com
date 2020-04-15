---
layout: post
title: "Deep Learning Coursera -- Overview"
categories: [mooc]
tags: [mooc, coursera]
icon-photo: deeplearning-ai.png
notfull: 1
keywords: "deeplearning.ai deeplearning andrew NG courses online coursera machine learning certificate Neural Networks and Deep Learning Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization Structuring Machine Learning Projects Convolutional Neural Networks Sequence Models"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

This post contains the links to my handwriting notes for the courses and also my notes for the assignments.

{:.alert.alert-warning}
**Handwriting notes** are for the videos taught by Andrew NG (just the theoritical part). **Jupyter notebooks** are my personal notes for the quizzes and assignments (not the solutions because of the Honor Code rules from Coursera). **My personal solutions** for the assignement are stored in [a private repository](https://github.com/dinhanhthi/deeplearning-coursera-solutions). That's why the urls may be not available to you.

## General info

- [The main URL](https://www.coursera.org/specializations/deep-learning) of the specialization.
- You can watch the videos taught by Andrew NG without enrolling the courses but you have to do it if you wanna take the assignments or projects, also for obtaining the certificate.
- There are in total 5 courses in the specialization:
  - [x] **Course 1** — [Neural Networks and Deep Learning](https://www.coursera.org/learn/neural-networks-deep-learning?specialization=deep-learning)
  - [x] **Course 2** — [Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization](https://www.coursera.org/learn/deep-neural-network?specialization=deep-learning)
  - [ ] **Course 3** — [Structuring Machine Learning Projects]([./course-3](https://www.coursera.org/learn/machine-learning-projects?specialization=deep-learning))
  - [ ] **Course 4** — [Convolutional Neural Networks](https://www.coursera.org/learn/convolutional-neural-networks?specialization=deep-learning)
  - [ ] **Course 5** — [Sequence Models](https://www.coursera.org/learn/nlp-sequence-models)
- You can use <kbd>Ctr</kbd> + <kbd>F</kbd> to find quickly terms and corresponding notes.

## Github repo

I put all **handwriting notes** + notes for the **assignments** on a Github repository [deeplearning.ai-notes](https://github.com/dinhanhthi/deeplearning.ai-notes).

## Syllabus + handwriting notes

### Course 1

I use different names for the videos in the handwriting notes. For example, instead of the video for "*Neural Network Overview*", I named it `w3-v1` which stands for "*week 3-video 1*". Please check them carefully.

- [x] **Week 1**: **Introduction to deep learning** — handwriting notes -- jupyter notebooks
  - Welcome — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/welcome-Cuf2f)
  - What is a neural network? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/what-is-a-neural-network-eAE2G) — `w1-v1`
  - Supervised Learning with Neural Networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/supervised-learning-with-neural-networks-2c38r) — `w1-v2`
  - Why is Deep Learning taking off? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-is-deep-learning-taking-off-praGm) — `w1-v3`
  - About this Course — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/about-this-course-6A3es) 
  - Course Resources — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/course-resources-2PhD4)
  - Geoffrey Hinton interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/geoffrey-hinton-interview-dcm5r)
- [x] **Week 2**: **Neural Networks Basics** — handwriting notes -- jupyter notebooks
  - Binary Classification — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/binary-classification-Z8j0R) — `w2-v1`
  - Logistic Regression — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-LoKih) — `w2-v2`
  - Logistic Regression Cost Function — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-cost-function-yWaRd)
  - Gradient Descent — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-A0tBd) — `w2-v3`
  - Derivatives — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-0ULGt) 
  - More Derivative Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/more-derivative-examples-oEcPT)
  - Computation graph — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/computation-graph-4WdOY) — `w2-v4`
  - Derivatives with a Computation Graph — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-with-a-computation-graph-0VSHe) — `w2-v5`
  - Logistic Regression Gradient Descent — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-gradient-descent-5sdh6) — `w2-v6`
  - Gradient Descent on m Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-on-m-examples-udiAq) — `w2-v7`
  - Vectorization — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorization-NYnog) — `w2-v8`
  - More Vectorization Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/more-vectorization-examples-ZPlX9) — `w2-v9`
  - Vectorizing Logistic Regression — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-logistic-regression-moUlO) — `w2-v10`
  - Vectorizing Logistic Regression's Gradient Output — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-logistic-regressions-gradient-output-IgFnJ) — `w2-v11`
  - Broadcasting in Python — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/broadcasting-in-python-uBuTv) — `w2-v12`
  - A note on python/numpy vectors — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/a-note-on-python-numpy-vectors-87MUx)
  - Quick tour of Jupyter/iPython Notebooks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/quick-tour-of-jupyter-ipython-notebooks-ChN1T)
  - Explanation of logistic regression cost function (optional) — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/explanation-of-logistic-regression-cost-function-optional-SmIbQ)
  - Pieter Abbeel interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/pieter-abbeel-interview-eqiZZ)
- [x] **Week 3**: **Shallow neural networks** — handwriting notes -- jupyter notebooks
  - Neural Networks Overview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/neural-networks-overview-qg83v) — `w3-v1`
  - Neural Network Representation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/neural-network-representation-GyW9e) — `w3-v2`
  - Computing a Neural Network's Output — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/computing-a-neural-networks-output-tyAGh) — `w3-v3`
  - Vectorizing across multiple examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-across-multiple-examples-ZCcMM) — `w3-v4-v5`
  - Explanation for Vectorized Implementation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/explanation-for-vectorized-implementation-Y20qP) — `w3-v4-v5`
  - Activation functions — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/activation-functions-4dDC1) — `w3-v6`
  - Why do you need non-linear activation functions? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-do-you-need-non-linear-activation-functions-OASKH) — `w3-v7`
  - Derivatives of activation functions — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-of-activation-functions-qcG1j)
  - Gradient descent for Neural Networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-for-neural-networks-Wh8NI) — `w3-v8`
  - Backpropagation intuition (optional) — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/backpropagation-intuition-optional-6dDj7) — `w3-v9`
  - Random Initialization — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/random-initialization-XtFPI) — `w3-v10`
  - Ian Goodfellow interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/ian-goodfellow-interview-WSia1)
- [x] **Week 4**: **Shallow neural networks** — handwriting notes -- jupyter notebooks
  - Deep L-layer neural network — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/deep-l-layer-neural-network-7dP6E) — `w4-v1`
  - Forward Propagation in a Deep Network — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/forward-propagation-in-a-deep-network-MijzH) — `w4-v2`
  - Getting your matrix dimensions right — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/getting-your-matrix-dimensions-right-Rz47X) — `w4-v3`
  - Why deep representations? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-deep-representations-rz9xJ) — `w4-v4`
  - Building blocks of deep neural networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/building-blocks-of-deep-neural-networks-uGCun) — `w4-v5`
  - Forward and Backward Propagation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/forward-and-backward-propagation-znwiG) — `w4-v6`
  - Parameters vs Hyperparameters — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/parameters-vs-hyperparameters-TBvb5) — `w4-v7`
  - What does this have to do with the brain? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/what-does-this-have-to-do-with-the-brain-obJnR) — `w4-v8`

### Course 2

I use different names for the videos in the handwriting notes. For example, instead of the video for "*Neural Network Overview*", I named it `w3-v1` which stands for "*week 3-video 1*". Please check them carefully.

- [x] **Week 1**: **Practical aspects of Deep Learning** — handwriting notes -- jupyter notebooks
  - Train / Dev / Test sets — [video](https://www.coursera.org/lecture/deep-neural-network/train-dev-test-sets-cxG1s) — `w1-v1`
  - Bias / Variance — [video](https://www.coursera.org/lecture/deep-neural-network/bias-variance-ZhclI) — `w1-v2`
  - Basic Recipe for Machine Learning — [video](https://www.coursera.org/lecture/deep-neural-network/basic-recipe-for-machine-learning-ZBkx4) — `w1-v3`
  - Regularization — [video](https://www.coursera.org/lecture/deep-neural-network/regularization-Srsrc) — `w1-v4`
  - Why regularization reduces overfitting? — [video](https://www.coursera.org/lecture/deep-neural-network/why-regularization-reduces-overfitting-T6OJj) — `w1-v5`
  - Dropout Regularization — [video](https://www.coursera.org/lecture/deep-neural-network/dropout-regularization-eM33A) — `w1-v6`
  - Understanding Dropout — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-dropout-YaGbR) — `w1-v7`
  - Other regularization methods — [video](https://www.coursera.org/lecture/deep-neural-network/other-regularization-methods-Pa53F) — `w1-v8`
  - Normalizing inputs — [video](https://www.coursera.org/lecture/deep-neural-network/normalizing-inputs-lXv6U) — `w1-v9`
  - Vanishing / Exploding gradients — [video](https://www.coursera.org/lecture/deep-neural-network/vanishing-exploding-gradients-C9iQO) — `w1-v10`
  - Weight Initialization for Deep Networks — [video](https://www.coursera.org/lecture/deep-neural-network/weight-initialization-for-deep-networks-RwqYe) — `w1-v11`
  - Numerical approximation of gradients — [video](https://www.coursera.org/lecture/deep-neural-network/numerical-approximation-of-gradients-XzSSa) — `w1-v12`
  - Gradient checking — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-checking-htA0l) — `w1-v13`
  - Gradient Checking Implementation Notes — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-checking-implementation-notes-6igIc) 
  - Yoshua Bengio interview — [video](https://www.coursera.org/lecture/deep-neural-network/yoshua-bengio-interview-bqUgf)
- [x] **Week 2**: **Optimization algorithms** — handwriting notes -- jupyter notebooks
  - Mini-batch gradient descent — [video](https://www.coursera.org/lecture/deep-neural-network/mini-batch-gradient-descent-qcogH) — `w2-v1`
  - Understanding mini-batch gradient descent — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-mini-batch-gradient-descent-lBXu8) — `w2-v2`
  - Exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/exponentially-weighted-averages-duStO) — `w2-v3`
  - Understanding exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-exponentially-weighted-averages-Ud7t0) — `w2-v4`
  - Bias correction in exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/bias-correction-in-exponentially-weighted-averages-XjuhD) — `w2-v5`
  - Gradient descent with momentum — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-descent-with-momentum-y0m1f) — `w2-v6`
  - RMSprop — [video](https://www.coursera.org/lecture/deep-neural-network/rmsprop-BhJlm) — `w2-v7`
  - Adam optimization algorithm — [video](https://www.coursera.org/lecture/deep-neural-network/adam-optimization-algorithm-w9VCZ) — `w2-v8`
  - Learning rate decay — [video](https://www.coursera.org/lecture/deep-neural-network/learning-rate-decay-hjgIA) — `w2-v9`
  - The problem of local optima — [video](https://www.coursera.org/lecture/deep-neural-network/the-problem-of-local-optima-RFANA) — `w2-v10`
  - Yuanqing Lin interview — [video](https://www.coursera.org/lecture/deep-neural-network/yuanqing-lin-interview-CXqid)
- [ ] **Week 3**: **Shallow neural networks** — handwriting notes -- jupyter notebooks