---
layout: post
title: "Pipeline & GridSearch"
tags: [Machine Learning]
toc: true
icon: pipeline.png
keywords: "sticky multiple processes into single process multiple tasks at once make_pipeline scaling svm pca sequential work algorithm training parameter best parameter tuning gridsearch cross validation scaling train test sets different folds folds scikit-learn naming name why what where when grid search tuning"
---

{% assign img-url = '/img/post/ML/pipeline' %}

## What's the idea of Pipeline?

Stack multiple processes into a single (scikit-learn) estimation.

![Pipeline's idea]({{img-url}}/pipeline-idea.png){:.img-full-85}
_An example of using pipeline in Machine Learning with 3 different steps._

## Why pipeline?

![Why pipeline]({{img-url}}/why-pipeline.png){:.img-80 .bg-white}
_An example of using scaling with cross-validation with and without using pipeline._


## Pipeline in Scikit-learn

Below sample codes come from [this example](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/SVM-face-recognition.html).

``` python
from sklearn.svm import SVC
from sklearn.decomposition import PCA
from sklearn.pipeline import make_pipeline

pca = PCA(n_components=150, whiten=True, random_state=42)
svc = SVC(kernel='rbf', class_weight='balanced')
model = make_pipeline(pca, svc)
```

Difference between `Pipeline` and `make_pipeline`:

- [`Pipeline`](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html): you can name the steps.
- [`make_pipeline`](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html): no need to name the steps (use them directly).

``` python
make_pipeline(PCA(), SVC())
```

``` python
Pipeline(steps=[
	('principle_component_analysis', PCA()),
	('support_vector_machine', SVC())
])
```

### Using with GridSearch

``` python
# Using with GridSearch (to choose the best parameters)
from sklearn.model_selection import GridSearchCV
param_grid = {'svc__C': [1, 5, 10, 50],	# "svc": name before, "C": param in svc
              'svc__gamma': [0.0001, 0.0005, 0.001, 0.005]}
grid = GridSearchCV(model, param_grid, cv=5, verbose=1, n_jobs=-1)

grid_result = grid.fit(X, y)
best_params = grid_result.best_params_

# predict with best params
grid.predict(X_test)
```

In case you wanna use `best_params`,

``` python
best_params['svc__C']
best_params['svc__gamma']
```

Take care the cross validation (*take a long time to run!!!*,

~~~ python
from sklearn.model_selection import cross_val_score
cv_scores = cross_val_score(grid, X, y)
print('Accuracy scores:', cv_scores)
print('Mean of score:', np.mean(cv_scores))
print('Variance of scores:', np.var(cv_scores))
~~~

## Example

- **Face Recognition using [SVM](/support-vector-machine)** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/SVM-face-recognition.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/SVM-face-recognition.ipynb).






