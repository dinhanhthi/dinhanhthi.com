---
layout: post
title: "DL 3 - Structuring ML Projects"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai]
icon-photo: deeplearning-ai.png
katex: 1
keywords: "machine learning strategy ML orthogonalization single number evaluation metric Satisficing and Optimizing metric train test dev set human level performance avoidable bias surpassing improve your model performance Andrej Karpathy carrying out error analysis cleaning up incorrectly labeled data build your first system quickly then iterate training and testng on different distributions bias variance with mismatched data distribution addressing data mismatch transfer learning multi task learning end to end deep learning Ruslan Salakhutdinov andrew ng the quick brown fox jumps over the lazy dog A-Z shortest sentence speech recognition"
---

{% assign img-url = '/img/post/mooc/dl' %}

{% include toc.html %}

This is my note for the course ([Structuring Machine Learning Projects](https://www.coursera.org/learn/machine-learning-projects)). The codes in this note are rewritten to be more clear and concise.

🎯 [Overview of all 5 courses.](/deeplearning-ai)

👉 **Course 1** -- [Neural Networks and Deep Learning](/deeplearning-ai-course-1).<br />
👉 **Course 2** -- [Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization](/deeplearning-ai-course-2).<br />
👉 **Course 3** -- [Structuring Machine Learning Projects](/deeplearning-ai-course-3). <br />
👉 **Course 4** -- [Convolutional Neural Networks](https://www.notion.so/dinhanhthi/CNN-by-deeplearning-ai-a081d253fc2c4c0b99edd2757c759b9e). <br />
👉 **Course 5** -- [Sequence Models](https://www.notion.so/dinhanhthi/CNN-by-deeplearning-ai-a081d253fc2c4c0b99edd2757c759b9e).

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
- In some problems, deep learning has surpassed human-level performance. Example: Online advertising, Product recommendation, Loan approval. $\Leftarrow$ **Structured data**.
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

### Carrying out error analysis

- <mark markdown='span'>**Error Analysis**</mark> = manually examining mistakes that your algorithm is making can give you insight what to do next.
- **Example**: in cat recognition, there are some factors affecting $\Rightarrow$ Consider a <mark markdown='span'>table **ERROR ANALYSIS**</mark> $\Rightarrow$ Evaluate multiple ideas in parallel,

  | Image        | Dog    | Great Cats | blurry  | Instagram filters |    Comments    |
  | ------------ | ------ | ---------- | ------- | ----------------- |--------------- |
  | 1            | ✓      |            |         | ✓                 |  Pitbull       |
  | 2            | ✓      |            | ✓       | ✓                 |                |
  | 3            |        |            |         |                   |Rainy day at zoo|
  | 4            |        | ✓          |         |                   |                |
  | ....         |        |            |         |                   |                |
  | **% totals** | **8%** | **43%**    | **61%** |      **12%**      |                |

  - We focus on _Great Cats_ and _blurry_ (have much influence).
- <mark>To carry out error analysis</mark> $\Rightarrow$ you should find a set of mislabeled examples in dev set $\Rightarrow$ look at mislabeled: False Positive or False Negative (number of errors) $\Rightarrow$ decide if to create a new category?

### Cleaning up incorrectly labaled data

- **In training**: DL algo is robust to random errors $\Rightarrow$ we can ignore them!
  - However, DL algo is LESS robust to systematic errors.
- **Solutions**: Using table Error Analysis to decide what types of error to focus in the next step (base of their fraction of errors in the total of errors).
- (Recall) <mark markdown='span'>The purpose of **dev set** is to help you select between 2 classifier A and B</mark>.
- **If you decide to fix labels**:
  1. Apply the <mark>same process to dev and test sets</mark> and make sure they come from the same distribution!
  2. Examine **also** on examples got **right** (not only on the ones got wrong) $\Rightarrow$ otherwise, we have overfitting problem!
  3. Train vs dev/test may have different distribution $\Rightarrow$ **No need** to be corrected mislabeled on training set!

### When starting a new project?

<mark markdown='span'>**Advice**</mark>: Build your first system **quickly** and then iterate!!

1. Quickly set up dev/test sets + metric.
2. Build initial system quickly.
3. Check bias analysis and Error analysis $\Rightarrow$ Priopritize the next step!

## Mismatched training and dev/test set

### Training & testing on different distribution

- Example: **training** (photos from internet, 200K), **dev & test** (photos from phone, 4K).
- **Shouldn't**: Shufflt all 204K and split into train/dev/test!
- <mark markdown='span'>**Should**</mark>:
  - Train - 200K (web) + 2K (mobile).
  - Dev = Test = 0.5K (mobile).

### Bias and Variance with mismatched data dist

- Sometimes, <mark markdown='span'>dev err > training err</mark> $\Rightarrow$ (possibly) the data in dev is **more difficult** to predict than the data in training.
- When comming from training err to dev err:
  1. The algo saw data in training set but not in dev set.
  2. The distribution of data in dev set is different!
- **IDEA**: create a new <mark>"train-dev" set</mark> which has the same distribution as training data but not used for training.
- <mark markdown='span'>**Keys to be considered**</mark>: Human error, Train error, Train-dev error, Dev error, Test error:
  - [**Avoidable bias**](#avoidable-bias) = _train_ - _human_.
  - **Variance problem** = _train-dev_ - _train_
  - **Data mismatch** = _dev_ - _train-dev_
  - **Overfitting to dev set** = _test_ - _dev_
- If there is a **huge gap between dev & test err** $\Rightarrow$ overtune to the dev set $\Rightarrow$ may need to find a bigger dev set!
- **Example 1**: A high _variance problem_! (train/train-dev $\to$ big, train-dev/dev $\to$ small)
  - Human error: 0%
  - Train error: **1%**
  - Train-dev error: **9%**
  - Dev error: 10%
- **Example 2**: _data mismatch problem_ (train/train-dev $\to$ small, train-dev/dev $\to$ big)
  - Human error: 0%
  - Train error: **1%**
  - Train-dev error: **1.5%**
  - Dev error: **10%**
- **Example 3**: _avoidable bias problem_ (because training err is much worse than human level, others are small)
  - Human error: **0%**
  - Train error: **10%**
  - Train-dev error: 11%
  - Dev error: 12%
- **Example 4**: _Avoidable bias problem_ and _mismatch problem_. (human/train $\to$ big, train-dev/dev $\to$ big)
  - Human error: **0%**
  - Train error: **1%**
  - Train-dev error: **1.5%**
  - Dev error: **10%**
- **Remark**: most of the time, the errs are decreasing from _human_ to _test_. However if (sometimes) _dev_ > _train-dev_, we rewrite all above errors in to a new table like this,

  {:.img-80.pop}
  ![Error table]({{img-url}}/mismatch.jpg)
  _Error table. Image from the course._

  - We find **by hand** 2 6% errors to consider the quality of dev/test err. In the figure, your figure is infact GOOD!

### Addressing data mismatch

- Addressing data mismatch (_don't garantee it will work but you can try_):
  - Carry out manually error analysis $\Rightarrow$ try to understand difference between training and dev/test errors.
  - Make the training data more similar or collect more data similar to dev/test set.
- <mark markdown='span'>**Artificial data synthesis**</mark>:
  - "_the quick brown fox jumps over the lazy dog_" $\Leftarrow$ shortest sentence contains all A-Z letters in English.
  - Create manually data (combine 2 different types of data). However, BE CAREFUL if one of 2 data is much smaller to the other. It may be overfitting to the smaller!

## Learning from multiple tasks

### Transfer learning

- **IDEA**: already trained on 1 task (_Task A_) + don't have enough data on the current task (_Task B_) $\Rightarrow$ we can apply the trained network on the current one.

{:.img-90.pop}
![Transfer learning]({{img-url}}/transfer-learning.jpg)
_Transfer learning. Image from the course._

- To do transfer learning, delete the last layer of NN and it's weights and:
  1. Option 1: if you **have a small data set** - keep all the other weights as a fixed weights. Add a new last layer(-s) and initialize the new layer weights and feed the new data to the NN and learn the new weights.
  2. Option 2: if you **have enough data** you can retrain all the weights.
- **Pretraining** = training on task A.
- **Fine-tuning** = using pretrained weights + use new data to train task B.
- This idea is useful because some of layers of trained NN contain helpful information for the new problem.
- <mark markdown='span'>**Transfer learning makes sense when**</mark> (e.g. from A to B):
  1. Task A and B have the same input X.
  1. You have a lot more data for task A than task B.
  1. Low level features from A could be helpful for learning B.

### Multi-task learning

- 1 NN do several things at the same time and each of these tasks helps hopefully all of the other tasks!
- **Example**: Autonomous driving example $\Rightarrow$ Detect several things (not only 1) at the same time like: pedestrians, other cars, stop signs, traffic lights,...

{:.img-80.pop}
![Multi-task learning]({{img-url}}/multi-task.jpg)
_Multi-task learning. Image from the course._

- We use **Logistic Regression** for the last layer. It's DIFFERENT from **softmax regression** because in this case, we need to determine more than 2 labels!
- If there are some infos unclear in Y (e.g. don't know if there is a traffic light or not?), we consider only the rest and just ignore the unclear!
- <mark markdown='span'>**Multi-task makes sense when**</mark> (e.g. from A to B):
  1. Training on a set of tasks that could benefit from having shred lover-level features.
  2. Usually: amount of data you have for each task is quite similar.
  3. Can train a big enough NN to do well on all the task.
- In general (have ENOUGH DATA), multi-task gives better performances!
- **Other remarks**:
  - Multi-task learning (usually) works good in **object detection**.
  - (Usually) transfer learning is USED MORE OFTEN (an better) than multi task learning!

## End-to-end deep learning

- There have been some data processing system require multiple stages of processing. $\Rightarrow$ <mark>End-to-end does take all of them into 1 NN</mark>.
- **Example**: speech recognition from English to French: this case, end-to-end works better than separated problems because it has enough data!

  {:.img-90.pop}
  ![End to end learning]({{img-url}}/end-to-end.jpg)
  _End-to-end learning. Image from the course._

- **Example**: auto open gate system: in this case, separated task is better end-to-end.
  1. Determine the head.
  2. Determine the name.
- <mark>When end-to-end works, it works very well!</mark>
- **Pros & Cons**:
  - **Pros**:
    - Let the data speaks.
    - Let hand-designing of components needed.
  - **Cons**:
    - May need a lot of data.
    - Excludes potentially useful hand-designing components.
- If having enough data $\Rightarrow$ can think of using end-to-end!
- <mark markdown='span'>**Advice**</mark>: carefully choose what type of $X \to Y$ mapping $\Leftarrow$ depends on what tasks you can get data for!

👉 **Course 4** -- [Structuring Machine Learning Projects](/deeplearning-ai-course-4).

{% endkatexmm %}