---
layout: post
title: "Deep Learning Coursera -- Overview"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai]
icon-photo: deeplearning-ai.png
notfull: 1
keywords: "deeplearning.ai deeplearning andrew NG courses online coursera machine learning certificate Neural Networks and Deep Learning Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization Structuring Machine Learning Projects Convolutional Neural Networks Sequence Models"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

This post contains the links to videos of the courses and my notes for them.

## General info

- [The main URL](https://www.coursera.org/specializations/deep-learning) of the specialization.
- There are in total 5 courses in the specialization:
    - [x] [Course 1](https://www.coursera.org/learn/neural-networks-deep-learning?specialization=deep-learning) — Neural Networks and Deep Learning -- [my note](/deeplearning-ai-course-1).
    - [x] [Course 2](https://www.coursera.org/learn/deep-neural-network?specialization=deep-learning) — Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization -- [my note](/deeplearning-ai-course-2).
    - [x] [Course 3](https://www.coursera.org/learn/machine-learning-projects?specialization=deep-learning) — Structuring Machine Learning Projects -- [my note](/deeplearning-ai-course-3).
    - [ ] [Course 4](https://www.coursera.org/learn/convolutional-neural-networks?specialization=deep-learning) — Convolutional Neural Networks -- [my note](/deeplearning-ai-course-4).
    - [ ] [Course 5](https://www.coursera.org/learn/nlp-sequence-models) — Sequence Models -- [my note](/deeplearning-ai-course-5).
- You can use <kbd>Ctr</kbd> + <kbd>F</kbd> to find quickly terms and corresponding notes.

## Syllabus

### Course 1

- [x] **Week 1** -- **Introduction to deep learning**
    - Welcome — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/welcome-Cuf2f)
    - What is a neural network? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/what-is-a-neural-network-eAE2G)
    - Supervised Learning with Neural Networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/supervised-learning-with-neural-networks-2c38r)
    - Why is Deep Learning taking off? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-is-deep-learning-taking-off-praGm)
    - About this Course — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/about-this-course-6A3es) 
    - Course Resources — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/course-resources-2PhD4)
    - Geoffrey Hinton interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/geoffrey-hinton-interview-dcm5r)
- [x] **Week 2** -- **Neural Networks Basics**
    - Binary Classification — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/binary-classification-Z8j0R)
    - Logistic Regression — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-LoKih)
    - Logistic Regression Cost Function — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-cost-function-yWaRd)
    - Gradient Descent — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-A0tBd)
    - Derivatives — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-0ULGt) 
    - More Derivative Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/more-derivative-examples-oEcPT)
    - Computation graph — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/computation-graph-4WdOY)
    - Derivatives with a Computation Graph — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-with-a-computation-graph-0VSHe)
    - Logistic Regression Gradient Descent — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/logistic-regression-gradient-descent-5sdh6)
    - Gradient Descent on m Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-on-m-examples-udiAq)
    - Vectorization — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorization-NYnog)
    - More Vectorization Examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/more-vectorization-examples-ZPlX9)
    - Vectorizing Logistic Regression — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-logistic-regression-moUlO)
    - Vectorizing Logistic Regression's Gradient Output — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-logistic-regressions-gradient-output-IgFnJ)
    - Broadcasting in Python — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/broadcasting-in-python-uBuTv)
    - A note on python/numpy vectors — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/a-note-on-python-numpy-vectors-87MUx)
    - Quick tour of Jupyter/iPython Notebooks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/quick-tour-of-jupyter-ipython-notebooks-ChN1T)
    - Explanation of logistic regression cost function (optional) — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/explanation-of-logistic-regression-cost-function-optional-SmIbQ)
    - Pieter Abbeel interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/pieter-abbeel-interview-eqiZZ)
- [x] **Week 3** -- **Shallow neural networks**
    - Neural Networks Overview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/neural-networks-overview-qg83v)
    - Neural Network Representation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/neural-network-representation-GyW9e)
    - Computing a Neural Network's Output — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/computing-a-neural-networks-output-tyAGh)
    - Vectorizing across multiple examples — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/vectorizing-across-multiple-examples-ZCcMM)
    - Explanation for Vectorized Implementation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/explanation-for-vectorized-implementation-Y20qP)
    - Activation functions — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/activation-functions-4dDC1)
    - Why do you need non-linear activation functions? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-do-you-need-non-linear-activation-functions-OASKH)
    - Derivatives of activation functions — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/derivatives-of-activation-functions-qcG1j)
    - Gradient descent for Neural Networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/gradient-descent-for-neural-networks-Wh8NI)
    - Backpropagation intuition (optional) — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/backpropagation-intuition-optional-6dDj7)
    - Random Initialization — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/random-initialization-XtFPI)
    - Ian Goodfellow interview — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/ian-goodfellow-interview-WSia1)
- [x] **Week 4** -- **Shallow neural networks**
    - Deep L-layer neural network — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/deep-l-layer-neural-network-7dP6E)
    - Forward Propagation in a Deep Network — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/forward-propagation-in-a-deep-network-MijzH)
    - Getting your matrix dimensions right — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/getting-your-matrix-dimensions-right-Rz47X)
    - Why deep representations? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/why-deep-representations-rz9xJ)
    - Building blocks of deep neural networks — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/building-blocks-of-deep-neural-networks-uGCun)
    - Forward and Backward Propagation — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/forward-and-backward-propagation-znwiG)
    - Parameters vs Hyperparameters — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/parameters-vs-hyperparameters-TBvb5)
    - What does this have to do with the brain? — [video](https://www.coursera.org/lecture/neural-networks-deep-learning/what-does-this-have-to-do-with-the-brain-obJnR)

### Course 2

- [x] **Week 1** -- **Practical aspects of Deep Learning**
    - Train / Dev / Test sets — [video](https://www.coursera.org/lecture/deep-neural-network/train-dev-test-sets-cxG1s)
    - Bias / Variance — [video](https://www.coursera.org/lecture/deep-neural-network/bias-variance-ZhclI)
    - Basic Recipe for Machine Learning — [video](https://www.coursera.org/lecture/deep-neural-network/basic-recipe-for-machine-learning-ZBkx4)
    - Regularization — [video](https://www.coursera.org/lecture/deep-neural-network/regularization-Srsrc)
    - Why regularization reduces overfitting? — [video](https://www.coursera.org/lecture/deep-neural-network/why-regularization-reduces-overfitting-T6OJj)
    - Dropout Regularization — [video](https://www.coursera.org/lecture/deep-neural-network/dropout-regularization-eM33A)
    - Understanding Dropout — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-dropout-YaGbR)
    - Other regularization methods — [video](https://www.coursera.org/lecture/deep-neural-network/other-regularization-methods-Pa53F)
    - Normalizing inputs — [video](https://www.coursera.org/lecture/deep-neural-network/normalizing-inputs-lXv6U)
    - Vanishing / Exploding gradients — [video](https://www.coursera.org/lecture/deep-neural-network/vanishing-exploding-gradients-C9iQO)
    - Weight Initialization for Deep Networks — [video](https://www.coursera.org/lecture/deep-neural-network/weight-initialization-for-deep-networks-RwqYe)
    - Numerical approximation of gradients — [video](https://www.coursera.org/lecture/deep-neural-network/numerical-approximation-of-gradients-XzSSa)
    - Gradient checking — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-checking-htA0l)
    - Gradient Checking Implementation Notes — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-checking-implementation-notes-6igIc) 
    - Yoshua Bengio interview — [video](https://www.coursera.org/lecture/deep-neural-network/yoshua-bengio-interview-bqUgf)
- [x] **Week 2** -- **Optimization algorithms**
    - Mini-batch gradient descent — [video](https://www.coursera.org/lecture/deep-neural-network/mini-batch-gradient-descent-qcogH)
    - Understanding mini-batch gradient descent — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-mini-batch-gradient-descent-lBXu8)
    - Exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/exponentially-weighted-averages-duStO)
    - Understanding exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/understanding-exponentially-weighted-averages-Ud7t0)
    - Bias correction in exponentially weighted averages — [video](https://www.coursera.org/lecture/deep-neural-network/bias-correction-in-exponentially-weighted-averages-XjuhD)
    - Gradient descent with momentum — [video](https://www.coursera.org/lecture/deep-neural-network/gradient-descent-with-momentum-y0m1f)
    - RMSprop — [video](https://www.coursera.org/lecture/deep-neural-network/rmsprop-BhJlm)
    - Adam optimization algorithm — [video](https://www.coursera.org/lecture/deep-neural-network/adam-optimization-algorithm-w9VCZ)
    - Learning rate decay — [video](https://www.coursera.org/lecture/deep-neural-network/learning-rate-decay-hjgIA)
    - The problem of local optima — [video](https://www.coursera.org/lecture/deep-neural-network/the-problem-of-local-optima-RFANA)
    - Yuanqing Lin interview — [video](https://www.coursera.org/lecture/deep-neural-network/yuanqing-lin-interview-CXqid)
- [x] **Week 3** -- **Hyperparameter tuning, Batch Normalization and Programming Frameworks**
    - Tuning process -- [video](https://www.coursera.org/lecture/deep-neural-network/tuning-process-dknSn).
    - Using an appropriate scale to pick hyperparameters -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/3rdqN/using-an-appropriate-scale-to-pick-hyperparameters).
    - Hyperparameters tuning in practice: Pandas vs. Caviar -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/DHNcc/hyperparameters-tuning-in-practice-pandas-vs-caviar).
    - Normalizing activations in a network -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/4ptp2/normalizing-activations-in-a-network).
    - Fitting Batch Norm into a neural network -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/RN8bN/fitting-batch-norm-into-a-neural-network).
    - Why does Batch Norm work? -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/81oTm/why-does-batch-norm-work).
    - Batch Norm at test time -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/FsoNw/batch-norm-at-test-time).
    - Softmax Regression -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/HRy7y/softmax-regression).
    - Training a softmax classifier -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/LCsCH/training-a-softmax-classifier).
    - Deep learning frameworks -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/NpLFp/deep-learning-frameworks).
    - TensorFlow -- [video](https://www.coursera.org/learn/deep-neural-network/lecture/zcZlH/tensorflow).

### Course 3

- [ ] **Week 1** -- **ML Strategy (1)**
    - Why ML Strategy -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/yeHYT/why-ml-strategy)
    - Orthogonalization -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/FRvQe/orthogonalization)
    - Single number evaluation metric -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/wIKkC/single-number-evaluation-metric)
    - Satisficing and Optimizing metric -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/uNWnZ/satisficing-and-optimizing-metric)
    - Train/dev/test distributions -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/78P8f/train-dev-test-distributions)
    - Size of the dev and test sets -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/HOby4/size-of-the-dev-and-test-sets)
    - When to change dev/test sets and metrics -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/Ux3wB/when-to-change-dev-test-sets-and-metrics)
    - Why human-level performance? -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/FWkpo/why-human-level-performance)
    - Avoidable bias -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/LG12R/avoidable-bias)
    - Understanding human-level performance -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/XInVm/understanding-human-level-performance)
    - Surpassing human-level performance -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/LiV7n/surpassing-human-level-performance)
    - Improving your model performance -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/4IPD6/improving-your-model-performance)
    - Andrej Karpathy interview -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/Ggkxn/andrej-karpathy-interview)
- [ ] **Week 2** -- **ML Strategy (2)**
    - Carrying out error analysis -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/GwViP/carrying-out-error-analysis)
    - Cleaning up incorrectly labeled data -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/IGRRb/cleaning-up-incorrectly-labeled-data)
    - Build your first system quickly, then iterate -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/jyWpn/build-your-first-system-quickly-then-iterate)
    - Training and testing on different distributions -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/Xs9IV/training-and-testing-on-different-distributions)
    - Bias and Variance with mismatched data distributions -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/ht85t/bias-and-variance-with-mismatched-data-distributions)
    - Addressing data mismatch -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/biLiy/addressing-data-mismatch)
    - Transfer learning -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/WNPap/transfer-learning)
    - Multi-task learning -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/l9zia/multi-task-learning)
    - What is end-to-end deep learning? -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/k0Klk/what-is-end-to-end-deep-learning)
    - Whether to use end-to-end deep learning -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/H56eb/whether-to-use-end-to-end-deep-learning)
    - Ruslan Salakhutdinov interview -- [video](https://www.coursera.org/learn/machine-learning-projects/lecture/kR8gk/ruslan-salakhutdinov-interview)

## Course 4

## Course 5
