---
layout: post
title: "Grid Search"
categories: [machine learning]
icon-photo: gridsearch.svg
notfull: 1
keywords: hyper parameter tuning Random Forest in solving the Titanic problem
---

{% assign img-url = '/img/post/ML/' %}

A process of performing hyper parameter tuning to determine optimal values for a given model.

Below are an example of using Grid Search with Random Forest in solving the [Titanic problem](/titanic-disaster).

~~~ python
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier as RF
~~~

~~~ python
# Create a DICTIONARY containing all the candidate values of the parameters
parameter_grid = dict(n_estimators=list(range(1, 5001, 1000)),
                      criterion=['gini','entropy'],
                      max_features=list(range(1, len(features), 2)),
                      max_depth= [None] + list(range(5, 25, 1)))

# Creata a random forest object
random_forest = RF(random_state=0, n_jobs=-1)

# Create a gridsearch object with 5-fold cross validation, 
#   and uses all cores (n_jobs=-1)
gsc = GridSearchCV(estimator=random_forest, 
                   param_grid=parameter_grid, 
                   cv=5, verbose=1, n_jobs=-1)
~~~

- `estimator`: model we are using (`RF`).
- `param_grid`: a **dictionary** of required parameters and their range of values specified in `estimator`.

Fit and get the best parameters,

~~~ python
grid_result = gsc.fit(X, y)
best_params = grid_result.best_params_
~~~

In the case you wanna use these `best_params`, 

~~~ python
best_clf = RF(n_estimators = best_params["n_estimators"], 
              criterion = best_params["criterion"],
              max_features = best_params["max_features"],
              max_depth = best_params["max_depth"]
           )
~~~

Or you can just use directly the result to predict,

~~~ python
gsc.fit(X, y)
gsc.predict(X_test)
~~~

Take the cross validation (*take a long time to run!!!*{:.tpink}),

~~~ python
cv_scores = cross_val_score(gsc, X, y)
print('Accuracy scores:', cv_scores)
print('Mean of score:', np.mean(cv_scores))
print('Variance of scores:', np.var(cv_scores))
~~~

## Reference

- **Chris Albon** -- [Titanic Competition With Random Forest](https://chrisalbon.com/machine_learning/trees_and_forests/titanic_competition_with_random_forest/).
- **Scikit-learn** -- [Parameter estimation using grid search with cross-validation](https://scikit-learn.org/stable/auto_examples/model_selection/plot_grid_search_digits.html).