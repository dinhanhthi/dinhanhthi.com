---
layout: post
title: "Random Forest"
tags: [Machine Learning]
icon: decision-tree.svg
toc: true
keywords: "decision tree ensemble learning votes from the trees relatively uncorrelated bagging Feature randomness entropy imbalanced classes feature importance Tony Yiu The Yhat Blog Chris Albon fast.ai"
---

{% assign img-url = '/img/post/ML/random-forest-decision-tree' %}

## What's the idea of Random Forest?

Random forest consists a (large) number of [decision trees](/search?q=decision+tree) operating together ([ensemble learning](https://en.wikipedia.org/wiki/Ensemble_learning)). ==The class with the most votes== from the trees will be chosen as the final result of the RF's prediction. These decision tree models are relatively uncorrelated so that they can protect each other from their individual errors.

![An illustration of the random forest's idea.]({{img-url}}/rf1.jpg){:.img-full-85}
*An illustration of the random forest's idea.*

{% hsbox "What is **Ensemble Learning**?" %}
Ensemble learning involves the **combination of several models** to solve a single prediction problem. It works by generating multiple classifiers/models which learn and make predictions independently. Those predictions are then combined into a single (mega) prediction that should be as good or better than the prediction made by any one classifer.{% ref "http://blog.yhat.com/posts/random-forests-in-python.html" %}
{% endhsbox %}

❓ **How (decision) trees are chosen?** RF ensures that the chosen trees are not too correlated to the others.

1. **Bagging**: From a sample of size N, trees are chosen so that they also have size N **with replacement**. For example, if our training data was [1, 2, 3, 4, 5] (size 5), then we might give one of our tree the list [1, 2, 2, 5, 5] (with replacement).
2. **Feature randomness**: The features in the original dataset are chosen randomly. There may be some trees that are lacking in some features.

So in our random forest, we end up with trees that are not only trained on different sets of data (thanks to bagging) but also use different features to make decisions{% ref "https://towardsdatascience.com/understanding-random-forest-58381e0602d2" %}.

*For each tree*, we can use [decision tree classifier](/decision-tree-classifier) or [decision tree regression](/decision-tree-regression) depending on the type our problem (classification or regression).

## When we use Random Forest?

- _Decision tree algorithms_ easily lead to ==_overfitting problems_==. Random forest algorithm can ==overcome== this.
- Capable of both regression and classification problems.
- Handle a large number of features.
- Estimating which features are important in the underlying data being modeled{% ref "http://blog.yhat.com/posts/random-forests-in-python.html" %}.
- Random forest is capable of learning without carefully crafted data transformations{% ref "http://blog.yhat.com/posts/random-forests-in-python.html" %}.
- ==Output probabilities== for classification problems.

## Using RF with Scikit-learn

### Random forest classifier

Load the library,

~~~ python
from sklearn.ensemble import RandomForestClassifier
~~~

A sample dataset:

~~~ python
iris = datasets.load_iris() # iris flowers
X = iris.data
y = iris.target
~~~

Create RF classifier([other parameters](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)),

~~~ python
clf = RandomForestClassifier(criterion='entropy', # default is 'gini'
                             n_estimators=8, # number of trees (default=10)
                             n_jobs=-1) # number of processors being used ("-1" means "all")
~~~

::: success
If a problem has **imbalanced classes**, use `class_weight="balanced"`.<sup>[\[ref\]](https://chrisalbon.com/machine_learning/trees_and_forests/handle_imbalanced_classes_in_random_forests/)</sup>
:::

Training & predict ([other methods](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)),

~~~ python
model = clf.fit(X, y)
model.predict([[ 5,  4,  3,  2]]) # returns: array([1])
model.predict_proba([[ 5,  4,  3,  2]]) # predict class probabilities
~~~

### Random forest regression

~~~ python
# load libraries
from sklearn.ensemble import RandomForestRegressor
from sklearn import datasets
~~~

~~~ python
# sample: Boston Housing Data
boston = datasets.load_boston()
X = boston.data[:,0:2]
y = boston.target
~~~

~~~ python
# train
regr = RandomForestRegressor(random_state=0, n_jobs=-1)
model = regr.fit(X, y)
~~~

~~~ python
# predict
model.predict(<something>)
~~~

### Select important features in Random Forest

Some premilinaries,

~~~ python
from sklearn.ensemble import RandomForestClassifier

# Load data
iris = datasets.load_iris()
X = iris.data
y = iris.target

# create a RF classifier
clf = RandomForestClassifier(random_state=0, n_jobs=-1)
~~~

Select feature importance{% ref "https://chrisalbon.com/machine_learning/trees_and_forests/feature_importance" %},

~~~ python
# Train model
model = clf.fit(X, y)

# Calculate feature importances
importances = model.feature_importances_

# load additional packages
import numpy as np
import matplotlib.pyplot as plt
~~~

Visualize,

<div class="columns-2">

~~~ python
# Sort feature importances in descending order
indices = np.argsort(importances)[::-1]
# Rearrange feature names so they match the sorted feature importances
names = [iris.feature_names[i] for i in indices]

plt.figure()
plt.title("Feature Importance")
plt.bar(range(X.shape[1]), importances[indices])
plt.xticks(range(X.shape[1]), names, rotation=90)

plt.show()
~~~

![Features importances.]({{img-url}}/feature_importance_11_0.png){:.img-100 .bg-white}
</div>

Select features with importance greater than a threshold,{% ref "https://chrisalbon.com/machine_learning/trees_and_forests/select_important_features_in_random_forest" %}

~~~ python
from sklearn.feature_selection import SelectFromModel

# Create object that selects features with importance greater than or equal to a threshold
selector = SelectFromModel(clf, threshold=0.3)

# Feature new feature matrix using selector
X_important = selector.fit_transform(X, y)

# Train random forest using most important features
model = clf.fit(X_important, y)
~~~

## References

- **Tony Yiu** -- [Understanding Random Forest](https://towardsdatascience.com/understanding-random-forest-58381e0602d2).
- **Scikit-learn** -- [Random Forest CLassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html) official doc.
- **Scikit-learn** -- [Random Forest Regression](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html) official doc.
- **Chris Albon** -- [Titanic Competition With Random Forest](https://chrisalbon.com/machine_learning/trees_and_forests/titanic_competition_with_random_forest/).
- **The Yhat Blog** -- [Random Forests in Python](http://blog.yhat.com/posts/random-forests-in-python.html).
- **fast.ai** -- [Introduction to Random Forest](http://course18.fast.ai/lessonsml1/lesson1.html) and a solution to "*Bull Book for Bulldozers*" problem on Kaggle.


