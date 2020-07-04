---
layout: post
title: "Decision Tree Regression"
categories: [machine learning]
tags: ['decision tree', 'regression']
katex: 1
icon-photo: decision-tree.svg
keywords: classification regression MSE Mean Square Error MAE Mean Absolute Error stopping conditions Standard Deviation Reduction SDR Graphviz example Saed Sayad
---

{% assign img-url = '/img/post/ML/random-forest-decision-tree' %}
{% assign file-url = '/files/ml' %}

{% katexmm %}

{% include toc.html %}

## What's the idea of Decision Tree Regression?

The basic intuition behind a decision tree is to map out all possible decision paths in the form of a tree. It can be used for *classification* ([note](/decision-tree-classifier)) and *regression*. In this post, let's try to understand the regression.

DT Regression is similar to [DT Classification](/decision-tree-classifier), however we use **Mean Square Error** (MSE, default) or **Mean Absolute Error** (MAE) instead of *cross-entropy* or *Gini impurity* to determine splits.

<p class="p-mark">
$$
\begin{aligned}
\text{MSE} &= \frac{1}{n} \sum_{i=1}^{n} (y_i - \bar{y}_i)^2, \\
\text{MAE} &= \frac{1}{n}\sum_{i=1}^n \vert y_i - \bar{y}_i \vert.
\end{aligned}
$$
</p>

Suppose that we have a dataset $S$ like in the figure below,

<div class="columns-2" markdown="1">
{:.img-full-normal.pop}
![Example of dataset]({{img-url}}/r1.jpg)
*An example of dataset $S$.*

{:.img-full-normal.pop}
![Example of dataset]({{img-url}}/r2.jpg)
*A decision tree we want.*
</div>

### Some basic concepts

{:.img-full-85}
![Concepts with a tree.]({{img-url}}/r3.jpg)

- **Splitting**: It is a process of dividing a node into two or more sub-nodes.
- **Pruning**: When we remove sub-nodes of a decision node, this process is called pruning.
- **Parent node and Child Node**: A node, which is divided into sub-nodes is called parent node of sub-nodes where as sub-nodes are the child of parent node.

{:.alert.alert-success}
Other aspects of decision tree algorithm, check [this note](/decision-tree-classifier).

{:.alert.alert-warning}
Looking for an example like in [the post of decision tree classifier](/decision-tree-classifier)? Check [this]({{ file-url }}/saedsayad.com-Decision Tree - Regression.pdf)! Below are a short algorithm,

1. Calculate the **Standard Deviation** ($SD$) of the current node (let's say $S$, parent node) by using MSE or MAE,

    <p class="p-mark">
    $$
    \begin{aligned}
    SD(S) &= \frac{1}{n} \sum_{i=1}^{n} (y_i - \bar{y}_i)^2, \\
    \text{or  } SD(S) &= \frac{1}{n}\sum_{i=1}^n \vert y_i - \bar{y}_i \vert,
    \end{aligned}
    $$
    </p>
    
    where $y_i\in$ the target values (*Hours Played* in the above example), $\bar{y}=\frac{\Sigma y}{n}$ is the mean value and $n$ is the number of examples **in this node**.

2. Check the **stopping conditions** (we don't need to make any split at this node) to stop the split and this node becomes a leaf node. Otherwise, go to step 3.

    - The minimum number of samples required to split an internal node, use `min_samples_split` in [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor).
    - The maximum depth of the tree, use `max_depth` in [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor).
    - A node will be split if this split induces a decrease of the impurity greater than or equal to this value, use `min_impurity_decrease` in [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor).
    - Its *coefficient of variation* ($\frac{SD(S)}{\bar{y}}$) is less than a certain threshold.

3. Calculate the **Standard Deviation Reduction** (SDR) after splitting node $S$ on each attribute (for example, consider attribute $O$). The attribute w.r.t. the biggest SDR will be chosen!

    <p class="p-mark">
    $$
    \underbrace{SDR(S,O)}_{\text{Standard Deviation Reduction}} 
    = \underbrace{SD(S)}_{\text{SD before split}}
    - \underbrace{\sum_j P(O_j | S) \times SD(S,O_j)}_{\text{weighted SD after split}}
    $$
    </p>

    where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$. Note that, $SD(S,O_j)$ means the SD of node $O_j$ which is also a child of node $S$.

4. After splitting, we have new child nodes. Each of them becomes a new parent node in the next step. Go back to step 1. 

## Using Decision Tree Regression with Scikit-learn

### Load and create

Load the library,

~~~ python
from sklearn.tree import DecisionTreeRegressor
~~~

Create a decision tree ([other parameters](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor)):

~~~ python
# mean squared error (default)
reg = DecisionTreeRegressor() # criterion='mse'
# mean absolute error 
reg = DecisionTreeRegressor(criterion='mae')
~~~

An example,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
from sklearn import tree
X = [[0, 0], [2, 2]]
y = [0.5, 2.5]
reg = tree.DecisionTreeRegressor()
reg = reg.fit(X, y) # train
~~~~

{:.output.flex-fill.d-flex}
~~~
array([0.5])
~~~
</div>

### Plot and save plots

Plot the tree (You may need to install [Graphviz](https://www.graphviz.org/) first. Don't forget to add its installed folder to `$path`),

<div class="columns-2" markdown="1">
~~~ python
from IPython.display import Image
import pydotplus
dot_data = tree.export_graphviz(reg, out_file=None, 
                                rounded=True, 
                                filled=True)
graph = pydotplus.graph_from_dot_data(dot_data)
Image(graph.create_png())
~~~

{:.img-full-normal.pop}
![An example.]({{img-url}}/r4.png)
</div>

Save the tree (follows the codes in "plot the tree")

~~~ python
graph.write_pdf("tree.pdf")   # to pdf
graph.write_png("thi.png")    # to png
~~~


## References

- **Skikit-learn**. *[Decision Tree Regressor](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor) official doc*.
- **Saed Sayad**. *[Decision Tree - Regression](http://saedsayad.com/decision_tree_reg.htm)*.

{% endkatexmm %}