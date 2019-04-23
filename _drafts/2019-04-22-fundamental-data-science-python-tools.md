---
layout: post
title: "Fundamental of some data science python tools"
subtitle: besides the syntaxes
description: "What are besides the syntaxes"
tags: [python]
categories: [data]
comment: 1
writing: 1
---

{% assign img-url = '/img/post/python' %}

This article helps me clarify some definitions and usages of the python toolboxes for data science.

{:.alert.alert-warning}
This article is not for you to learn, it's for refrence only!

{:.question}
## What is the difference between a data frame and a NumPy array in Python?

- **Dataframe** [[1]](https://www.quora.com/What-is-the-difference-between-a-data-frame-and-a-NumPy-array-in-Python){:.target="_blank"} : 
	- 2-dimensional <mark>heterogonous</mark> array.
	- Similar to a SQL table or Spreadsheet.
	- Access 
- **NumPy array** : 
	- Object are of <mark>homogeneous</mark> (same-kind) multidimensional array.
	- It is a table of elements (usually numbers), all of the <mark>same type</mark>, indexed by a tuple of <mark>positive integers</mark>. In NumPy dimensions are called axes.
- To use [scikit-learn library](https://scikit-learn.org/), we have to convert the Pandas data frame to a Numpy array.

	~~~ python
  X = df[['col1', 'col2', 'col3']].values
	~~~

{:.ref}
Source of figures used in this post: [overfitting](https://towardsdatascience.com/cross-validation-70289113a072){:target="_blank"}.