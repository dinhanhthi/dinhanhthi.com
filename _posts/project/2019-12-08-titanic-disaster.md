---
layout: post
title: "Titanic Disaster on Kaggle"
categories: [project-based learning]
icon-photo: titanic.png
---

{% assign img-url = '/img/post/project/titanic' %}

{% include toc.html %}

{% notcomplete %}

## Introduction

In [this challenge](https://www.kaggle.com/c/titanic), we are going to answer the question: "*What sorts of people were more likely to survive?*" using passenger data. Datasets to be used: `train.csv` (for training and predicting), `test.csv` (for submitting).

<p class="text-center" markdown="1">
{% html https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/kaggle-titanic-disaster/titanic_kaggle.html %} -- {% colab https://dinhanhthi.com/github-colab?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/kaggle-titanic-disaster/titanic_kaggle.ipynb %}
</p>

{:.img-full-100.pop}
![First 10 rows of dataset]({{img-url}}/df.jpg)
*First 10 rows of the dataset.*

## Preliminaries

~~~ python
import numpy as np
import matplotlib.pyplot as plt # plot
import pandas as pd # working with dataset
~~~

## Overview datasets

Read data,

~~~ python
df = pd.read_csv("train.csv")
df_test = pd.read_csv("test.csv")
~~~

Take a look,

~~~ python
df.head(10)
df.info()
df_test.info()
df.describe() # for numerical features
df.describe(include=['O']) # for categorical features
~~~

Find the percentage of missing data on each feature,

~~~ python
total = df.isnull().sum().sort_values(ascending=False)
percent = (round(df.isnull().sum()/df.isnull().count()*100, 1)).sort_values(ascending=False)
pd.concat([total, percent], axis=1, keys=['Total', '% of missing'])
~~~

Survival based on some categorical features,

~~~ python
df.pivot_table(index="Sex", values="Survived")
df.pivot_table(index="Pclass", values="Survived")
df.pivot_table(index="SibSp", values="Survived")
df.pivot_table(index="Parch", values="Survived")
~~~

Visualize survival based on `Age` (numerical),

~~~ python
df[df["Survived"]==1]['Age'].plot.hist(alpha=0.5, color='blue', bins=50) # survived
df[df["Survived"]==0]['Age'].plot.hist(alpha=0.5, color='blue', bins=50) # died
~~~

List of titles from `Name`,

~~~ python
df.Name.str.extract(' ([A-Za-z]+)\.', expand=False)
~~~

## Preprocessing data

Drop some unnecessary features (columns),

~~~ python
# do for both train and test sets
df.drop(['Name', 'Fare', 'Ticket', 'Cabin'], axis=1, inplace=True)
df_test.drop(['Name', 'Fare', 'Ticket', 'Cabin'], axis=1, inplace=True)
~~~

## References

- **Chris Albon** -- [Titanic Competition With Random Forest](https://chrisalbon.com/machine_learning/trees_and_forests/titanic_competition_with_random_forest/).
- **Manav Sehgal** -- [Titanic Data Science Solutions](https://www.kaggle.com/startupsci/titanic-data-science-solutions).
- **Dataquest** -- [Kaggle fundamental](https://app.dataquest.io/course/kaggle-fundamentals) -- [on my Github](https://github.com/dinhanhthi/dataquest-aio/tree/master/step-7-machine-learning-intermediate/course-3-kaggle-fundamentals).