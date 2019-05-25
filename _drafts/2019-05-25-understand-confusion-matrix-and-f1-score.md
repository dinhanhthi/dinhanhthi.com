---
layout: post
title: "Understand the confusion matrix and f1-score"
subtitle: A good accuracy is really good?
description: "A good accuracy is really good?"
tags: [errors, definition]
categories: [machine learning]
comment: 1
math: 1
---

{% assign img-url = '/img/post/ML' %}

{% include toc.html %}

In classification, if your dataset is skewed in some way, your results could be biased to the majority labels. An example of this problem is *fraud detection*. If 95% data says "don't have a cancer" and only 5% mentions about "have a cancer", your model just predicts "don't" for all cases, the accuracy is automatically 95% then. Your model is useless! How we can overcome this disadvantage? 

This problem is mentioned as a "skewed class" in [the course of Andrew Ng](https://www.coursera.org/learn/machine-learning){:target="_blank"}, he defined it as "*The data that we have turns out not balance, it weights more to one class than the others*." There are [several proposed solutions](https://www.quora.com/What-problems-do-skewed-training-data-sets-lead-to) for this type of problem. In this article, we mainly talk about ***confusion matrix*** and ***f1-score*** metric to evaluate the trained model.

## Confusion matrix

Suppose there are totally 130 patients and we predict that:

- 100 patients have cancer but there are actually only 90 patients are really have.
- 30 patients don't have cancer but all of these predictions are false, they all have cancer.

We can see the above situation in below table. It's called **[confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix){:target="_blank"}** because this matrix makes us confused (just funny).

{:.img-full-75}
![An example of TP, TN, FP and FN.]({{img-url}}/tf_np.jpg)

In this case,

- **True positve** (TP) : what we **predict True** is **really True**.
- **True negative** (FN) : what we **predict False** is **really False**.
- **False negative** (TN) : what we **predict False** is **actually True**.
- **False positve** (FP) : what we **predict True** is **actually False**.

How can we remember the meaning of these terms? Here is a way. 

- <mark><b>True</b>/<b>False</b> indicates what we predicted are right/wrong. <b>Positive</b>/<b>Negative</b> are what we predicted (1 or 0)</mark>. Other words, if you see "*True...*", it means that all you predicted are right (predicted true are really true, predicted false are really false). On the contrary, if you see "False...", it means that all you predicted are wrong (predicted true are actually false, predicted false are actually true).
- For example, **True Positive** contains "True", it means what we predicted are right and we predicted 1 (Positive) in this case. 
- Another example, **False Positive** containing "False" showes that what we predicted are wrong and we predicted 1 (Positive) in this case.

## Precision / Recall

- **Precision** : This is the ratio of patients who actually have cancer based on all cancer predictions. Other words, *How many our predictions are really true?*
- **Recall** : How many our positive predictions are really true?

{:.img-full-50}
![Precision and Recall.]({{img-url}}/precision_recall_3.jpg)

