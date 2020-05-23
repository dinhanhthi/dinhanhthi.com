---
layout: post
title: "Deep Learning Coursera - Course 3"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai]
icon-photo: deeplearning-ai.png
katex: 1
notfull: 1
keywords: "machine learning strategy ML orthogonalization single number evaluation metric Satisficing and Optimizing metric train test dev set human level performance avoidable bias surpassing improve your model performance Andrej Karpathy carrying out error analysis cleaning up incorrectly labeled data build your first system quickly then iterate training and testng on different distributions bias variance with mismatched data distribution addressing data mismatch transfer learning multi task learning end to end deep learning Ruslan Salakhutdinov andrew ng"
---

{% assign img-url = '/img/post/mooc/dl' %}

{% include toc.html %}

This is my note for the course ([Structuring Machine Learning Projects](https://www.coursera.org/learn/machine-learning-projects)). The codes in this note are rewritten to be more clear and concise.

🎯 [Overview of all 5 courses.](/deeplearning-ai)

👉 **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1).<br />
👉 **Course 2** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-2).<br />
👉 **Course 4** -- [Structuring Machine Learning Projects](/deeplearning-ai-course-4).

⭐ **Case study** (should read): [Bird recognition in the city of Peacetopia](/deeplearning-ai-course-3-bird-recognition-peacetopia).<br />
⭐ **Case study** (should read): [Autonomous driving](/deeplearning-ai-course-3-autonomous-driving) (I copied it from [this](https://github.com/Kulbear/deep-learning-coursera/blob/master/Structuring%20Machine%20Learning%20Projects/Week%202%20Quiz%20-%20Autonomous%20driving%20(case%20study).md)).


This course will give you some strategies to help analyze your problem to go in a direction that will help you get better results.

{% katexmm %}

## Introduction to ML Strategy

### Why ML strategy?

- "_ML strategy_" = How to structure your ML project?
- <mark markdown='span'>**Ideas to improve your ML systems**</mark>:

    <div class="two-columns-list mb-0" markdown="1">

    1. Collect more data.
    2. Collect more diverse training set.
    3. Train algorithm longer with gradient descent.
    4. Try different optimization algorithm (e.g. Adam).
    5. Try bigger network.
    6. Try smaller network.
    7. Try dropout.
    8. Add L2 regularization.
    9. Change network architecture (activation functions, # of hidden units, etc.)

    </div>

- However, don't spend too much time to do one of above things, <mark>we need to go right direction!</mark>

### Orthogonalization

- In **orthogonalization**, you have some controls, but each control does a specific task and doesn't affect other controls.
- <mark markdown='span'>**Chain of assumptions in ML**</mark>:
  1. You'll have to fit training set well on cost function (near human level performance if possible).
   - If it's not achieved you could try bigger network, another optimization algorithm (like Adam)...
  2. Fit dev set well on cost function.
   - If its not achieved you could try regularization, bigger training set...
  3. Fit test set well on cost function.
   - If its not achieved you could try bigger dev. set...
  4. Performs well in real world.
   - If its not achieved you could try change dev. set, change cost function...

## Setting up your goal

### Single number evaluation metric

- <mark markdown='span'>**Advice**</mark> : It's better and faster to set a single number evaluation metric for your project before you start it.
- **Example**: instead of using both precision and recall, just use f1. Check [this note](/confusion-matrix-and-f1-score).
- Dev set + single row number evaluation metric $\Rightarrow$ enough to make a choice!

### Satisfying and Optimizing metric

- It's difficult to set all parameters to a single row number evaluation metric $\Rightarrow$ set up (many) **satisfying** + (one) **optimizing** matrix.
  - **Satisfying** (use threshold): satisfying this is enough.
  - **Optimizing**: more important, it's accuracy!
- **Example**: call "Hi Siri",
  - Accuracy: is it awoken? $\Leftarrow$ **optimizing**
  - False positive: it's awoken but we don't call it! $\Leftarrow$ set the **satisfying** as less then 1 false positive per day!

### Train/dev/test distributions

- The way we set the distribution of train / dev / test sets can impact much on the running time.
- Dev set = developement set / hold out cross validation set.
- <mark markdown='span'>**Advice**</mark>: Make dev set and test set come from the same distribution!

### Size of the dev and test sets

- **Old** (less data, <100000): 70% train - 30% test or something like that.
- **Now** (big data): 98% - 1% - 1%.
- **Test set**: set your <mark>test set to be big enough</mark> to give high confiance in the overall performance of your system.

### When to change dev/test sets and metrics

- Sometimes, we put our target a wrong place $\Rightarrow$ should <mark>change metric!</mark>
- **Example**: cat classification,
  - _Algo A_: 3% error but contains porn $\Leftarrow$ train / test error like this!

    $$
    \text{Err (old metric)} = \dfrac{1}{m_{\text{dev}}} \sum_{i=1}^{m_{\text{dev}}} \mathcal{L} \{ y^{(i)}_{\text{pred}} \ne y^{(i)} \}
    $$

  - _Algo B_: 5% error but no porn $\Leftarrow$ human like this!

    $$
    \begin{aligned}
    \text{Err (adapted metric)} &= \dfrac{1}{\Sigma_i W^{(i)}} \sum_{i=1}^{m_{\text{dev}}} W^{(i)} \mathcal{L} \{ y^{(i)}_{\text{pred}} \ne y^{(i)} \} \\
    W^{(i)} &= \begin{cases}
        1 \text{ if } X^{(i)} \text{ contains non-porn}, \\
        10 \text{ if } X^{(i)} \text{ contains porn}.
    \end{cases}
    \end{aligned}
    $$

- This is actually an example of an orthogonalization where you should take a machine learning problem and break it into distinct steps: 
  1. Figure out how to define a metric that captures what you want to do (place the target). 
  2. Worry about how to actually do well on this metric (how to aim/shoot accurately at the target).
- **Conclusion**: if doing well on your metric + dev/test set doesn't correspond to doing well in your application, change your metric and/or dev/test set.

## Comparing to human-level performance

### Why human-level performance?

- **Reasons**:
  1. ML algos are now work better & easier (than the past) $\Rightarrow$ only them is not enough $\Rightarrow$ need human-level performance (HLP).
  2. Workflow of building ML system $\Rightarrow$ wanna more efficient? $\Rightarrow$ try to do something that human can also do.
- **Bayes error** = best possible error (theory).
- After surpassing HLP, _it's slow down_, why?
  1. HLP is very closed to Bayes optimal error. Ex: we can recognize things in blur.
  2. Whenever under HLP, there are certain tools to use to improve the performance but there is no tool to do after surpassing HLP.
- <mark>So long as ML is worse than HLP, you can:</mark>
  - Get labeled data from human.
  - Gain insight from manual error analysis: why did a person get this right?
  - Better analysis of bias / variance.

### Avoidable bias

- Sometimes we don't want algo works TOO WELL on the training set $\Rightarrow$ use HLP.
- **Example**: cat recognition gives 2 different results (but the same gap between train & test)
  1. **Big gap** between train and human. $\Rightarrow$ focus on <mark>reducing bias</mark> (bigger NN, run training longer,...) $\Leftarrow$ **Underfitting**!
   
        | Humans             | 1%   | 1%   |
        | ------------------ | ---- | ---- |
        | **Training error** | 8%   | 8%   |
        | **Dev Error**      | 10%  | 10%  |
  2. **Small gap** between train and human. $\Rightarrow$ focus on <mark>reducing variance</mark> $\Leftarrow$ **Overfitting**!
   
        | Humans             | 1%   | 7.5% |
        | ------------------ | ---- | ---- |
        | **Training error** | 8%   | 8%   |
        | **Dev Error**      | 10%  | 10%  |
- Based on the human error $\Rightarrow$ decide whether high/low error $\Rightarrow$ bias / variance reduction!
- Gap between human & training $\Rightarrow$ **Avoidable bias**.
- Gap between training & test $\Rightarrow$ **Variance**!

### Understanding human-level performance

- Use the nearest value to Bayes error as a human level error! (the smallest)
- The way we choose HL error sometimes can impact the way we improve our algo (bias or variance reduction)
- <mark markdown='span'>Use human level error as a **proxy** of Bayes error!</mark>

### Surpassing human-level performance

- When training error **less than** human error, it's difficile to decide what's avoidable bias!
- In some problems, deep learning has surpassed human-level performance. Like: Online advertising, Product recommendation, Loan approval. $\Leftarrow$ **Structured data**.
- In **natural perception tasks** (speech recognition, NLP,...): ML surpasses human!
- <mark markdown='span'>**In short**</mark>:
  - Machine > human $\Leftarrow$ structured data.
  - Machine > **One** person $\Leftarrow$ some natural perception tasks.
  - Machine > human $\Leftarrow$ natural perception tasks.

### Improving your model performance

- <mark markdown='span'>The two fundamental asssumptions of supervised learning</mark>:
  1. You can fit the training set pretty well. This is roughly saying that you can achieve low **avoidable bias**. 
  2. The training set performance generalizes pretty well to the dev/test set. This is roughly saying that **variance** is not too bad.
- <mark markdown='span'>To improve your deep learning supervised system</mark> follow these guidelines:
  1. Look at the difference between human level error and the training error - **avoidable bias**.
  2. Look at the difference between the dev/test set and training set error - **Variance**.
  3. If **avoidable bias** is large you have these options:
     - Train bigger model.
     - Train longer/better optimization algorithm (like Momentum, RMSprop, Adam).
     - Find better NN architecture/hyperparameters search.
  4. If **variance** is large you have these options:
     - Get more training data.
     - Regularization (L2, Dropout, data augmentation).
     - Find better NN architecture/hyperparameters search.

## Error Analysis



## Mismatched training and dev/test set

## Learning from multiple tasks

## End-to-end deep learning

{% endkatexmm %}