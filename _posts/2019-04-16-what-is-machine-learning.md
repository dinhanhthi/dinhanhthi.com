---
layout: post
title: "Fundamental concepts about Machine Learning"
subtitle: Basic understanding about Machine Learning
description: "What if you're asked about ML and you have to describe it for an amateur/a professional person?"
tags: [definition]
categories: [machine learning]
comment: 1
math: 1
date: 2019-04-25
writing: 1
---

{% assign img-url = '/img/post/ML' %}

{% include toc.html %}

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
  - *Regression* : linear regression, logistic regression, ...
  - *Classification* : K-Nearest Neighbors (KNN), Support Vector Machine (SVM), Decision Tree
- **Unsupervised learning**: We have very little or no idea what our results should look like (*Clustering*)

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

{:.question}
## The idea of K-Nearest Neighbours (KNN)?

- This is a classification algorithm, we choose a categories for some example based on the category of their neighbors. For example, if $K=1$, the category of that example is the same with the category of the nearest example to it.
- Calculate the accuracy with different numbers of $K$ and then choose the best one.

~~~ python
from sklearn.neighbors import KNeighborsClassifier
neigh = KNeighborsClassifier(n_neighbors=3)
neigh.fit(X, y)

print(neigh.predict([[1.1]]))
print(neigh.predict_proba([[0.9]]))
~~~

{:.question}
## What's a decision tree?

- The basic intuition behind a decision tree is to map out all possible decision paths in the form of a tree.
- We need to choose the best attribute with the highest significance and split the data based on that attribute. But what is the measure to choose this attribute?
- We base on the **entropy** and the **information gain**.
  - **Entropy** (of each node, <mark>between 0 and 1</mark>) : the amount of information disorder or the amount of randomness in the data. <mark>The lower the entropy, the less uniform the distribution, the purer the node.</mark>. Each node (entropy) have several ways to split the data (based on different attributes)
    
    $$
    E = -p(A)\log(p(A)) - p(B)\log(p(B))
    $$
  
  - **Information gain** : The information we "gain" after the split. The tree with the <mark>higher information gain will be chosen</mark>.

    $$
    G = E_0 - (w_1 \times E_1 + w_2 \times E_2)
    $$

    {:.img-full-normal}
    ![Choose a way of splitting]({{img-url}}/decision_tree.jpg)

~~~ python
from sklearn.tree import DecisionTreeClassifier
drugTree = DecisionTreeClassifier(criterion="entropy", max_depth = 4)
drugTree.fit(X_trainset,y_trainset)
predTree = drugTree.predict(X_testset)
~~~

{:.question}
## Differences between logistic regression and linear regression and other classification algorithms?

We use **Logistic Rregression** instead of **Linear Regression** because : 
  
- The dependent variable is binary / multiclass (categorical variable), we cannot apply LR in this case.
- We need the know the probabilities of the results.

We use **Logistic Regression** instead of **other categorical classifiers** because :

- The predicted probabilities in LR are more well-calibrated.
- If we need to see the impact of some features on the dependent variables.
- When we wanna check the decision boundary.

~~~ python
from sklearn.linear_model import LogisticRegression
LR = LogisticRegression(C=0.01, solver='liblinear').fit(X_train,y_train)
# C parameter indicates inverse of regularization strength which must be a positive float.
yhat = LR.predict(X_test)

# get the probability
#  the first column is the probability of class 1, P(Y=1|X), and second column is probability of class 0, P(Y=0|X):
yhat_prob = LR.predict_proba(X_test)
~~~

{:.question}
## The idea of Support Vector Machine (SVM)?

- It's a **supervised algorithm** that classifies cases by <mark>mapping data to higher-dimensional feature space</mark> and <mark>finding the separator</mark>.
- How we can transform data to the higher-dimensinal space? By using **kernels**.
- How we can find the best separator after the transformation? By using **SVM**.
  - Find the largest separation (margin) between two classes.

~~~ python
from sklearn import svm
clf = svm.SVC(kernel='rbf')
clf.fit(X_train, y_train)
yhat = clf.predict(X_test)
~~~

{:.question}
## Differences between Clustering and Classification

- **Classification** : you have **labeled data** and need to make a prediction on the unknown object. It's *supervised learning*.
- **Clustering** : you working on **unlabeled data** and need to split data into groups where objects have the common properties. It's *unspervised learning*.

{:.question}
## K-means Clustering?

- We need to separate the data into different groups without knowing their labels beforehand. 
- The process is based on "K" centroids at the first glance (they are chosen randomly). 
- We divide the data based on the distance of each point to the sigmoids. The shortest distance decides the group to which that point belongs. 
- After we have the frist groups, we move the centroids to the mean of each cluster and start again the algorithm until we don't have too much change on the centroids.
- We need to do several differently initial centroids to find the best results and avoid the local optimization.
- After trying with different K, we need to apply the **elbow method** to choose the most suitable K.

~~~ python
from sklearn.cluster import KMeans
k_means = KMeans(init = "k-means++", n_clusters = 4, n_init = 12)
# initial centroids
# k-means++ : k-means clustering in a smart way to speed up the convergence
# n_init : number of times we "re-choose" the initial centroids.
k_means.fit(X)
k_means_labels = k_means.labels_ # labels for points
k_means_cluster_centers = k_means.cluster_centers_ # coordinates of the cluster centers
~~~

{:.ref}
Source of figures used in this post: [overfitting](https://towardsdatascience.com/cross-validation-70289113a072){:target="_blank"}, [decision tree](https://www.coursera.org/learn/machine-learning-with-python/lecture/E6wtC/building-decision-trees){:target="_blank"}.