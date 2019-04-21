---
layout: post
title: "Fundamental concepts about Machine Learning & Data Science"
subtitle: Basic understanding about ML & DS
description: "What if you're asked about ML and you have to describe it for an amateur/a professional person?"
tags: [machine learning]
category: machine-learning
comment: 1
date: 2019-04-21
---

{% assign img-url = '/img/post/ML' %}

This is **the first post in the series** of posts I wrote about what I’ve learned in Machine Learning and Data Science on the online courses. I write these posts by supposing that there are some interviewers asking me some technical questions in these fields. I also write the answers in the context where someone doesn’t know anything about ML or Data ask about these fields.

{:.alert.alert-warning}
This article is not for you to learn, it's for refrence only!

{:.question}
## What's Machine Learning?

> A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E. -- [Tom Mitchell](http://www.cs.cmu.edu/~tom/){:target="_blank"}.

Above definition was mentioned in the course of Andrew NG in his course on Coursera. **Shorter, for me,** ML is the science in that we give computers abilities to act without being explicitly programmed. They can learn from some given data (they can even collect data by themselves), using some algorithms and make the prediction.

{:.question}
## Differences between supervised learning / unsupervised learning?

- **Supervised learning** : output is already known.
- **Unsupervised learning**: We have very little or no idea what our results should look like.

{:.question}
## What's Data Science?

Data Science is the process of using data to understand different things, of uncovering the insights and trends that are hiding behind data in order to answer some questions.

{:.question}
## What's Big Data?

> Put simply, big data is larger, more complex data sets, especially from new data sources. These data sets are so voluminous that traditional data processing software just can’t manage them. But these massive volumes of data can be used to address business problems you wouldn’t have been able to tackle before. -- [Oracle](https://www.oracle.com/big-data/guide/what-is-big-data.html){:target="_blank"}.

{:.question}
## What are differences between Data Scientist, Data Engineer, Data Analyst?

- **Data Analyst** : *The bridge, the driver. From the past show the present*. They set the link between traditional business and the data driven, also between tech teams and business teams. They give advices to the managers based on the results to help them make better decisions. **Jobs** : data cleaning, performing analysis and creating data visualizations. 
- **Data Scientist** : *The brain, what are behind the scene. From the past, show the future.* They apply their expertise in statistics and building machine learning models to make predictions and answer key business questions. **Jobs** : clean, analyze, and visualize data (like data analyst but more depth) & are able to train and optimize machine learning models.
- **Data Engineer** : *The workers.* They prepare foundations for DS and DA. They have good software dev tools, build and perform systems for others to work.

{:#overfitting-underfitting}
{:.question}
## What is overfitting and underfitting?

- **Underfitting** : Capturing not enough pattern in the data. The curve under fit the data points. The model performs poorly both in the training set and test set.
- **Overfitting** : Contrary to underfitting, capturing noise, unnecessary patterns which do not generalize well to unseen data. The model performs very well on the training set but poorly on the test set.

{:.img-full-50}
![Overfitting and underfitting]({{img-url}}/overfitting-underfitting.png)

**Other names** : overfitting (**high variance**), underfitting (**high bias**).

{:.question}
## What's the train/test split's problem?

It depends highly on the way we choose the train/test set data. That's why we need to use **cross-validation** evaluation to fix it. For example, K-fold cross validation.

~~~ python
# Split arrays or matrices into random train and test subsets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)
~~~

If **we have enough data**, it may be a good choice.

{:#diff-training-test-validation-tests}
{:.question}
## What is different between training set / test set / cross validation set?

- **Training set** : Your algorithms adjust their parameters based on training data.
- **Validation set** : Your algorithms are run on validation set to get a result. This result is compared to other training/validation data to choose the best one.
	- **Cross validation set** : We don't split the data into fixed partitions, hence CV.
	- Above things give us the reason why we need to choose CV and training sets on the same distribution so that we can compare between them.
- **Test set** : You run the "winner" algorithm (parameters) on the test set to see how well your model works in the real world.


## References

1. [Why only three partitions? (training, validation, test)](https://stats.stackexchange.com/questions/9357/why-only-three-partitions-training-validation-test){:target="_blank"}


{:.ref}
Source of figures used in this post: [overfitting](https://towardsdatascience.com/cross-validation-70289113a072){:target="_blank"}.