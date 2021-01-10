---
layout: post
title: "Decision Tree Classifier"
tags: [Machine Learning, Classification]
toc: true
icon: decision-tree.svg
keywords: classification regression outlook temperature huminity windy play golf Iterative Dichotomiser (ID3) CART (Classification And Regression Tree) information gain entropy Gini impurity root node branch child node internal node splitting pruning parent node sub nodes stopping condition gini gain Highly interpretable irrelevant features Non-parametric tuning unbalanced Graphviz Saed Sayad Tiep Vu Brian Ambielli Aurélien Géron
---

{% assign img-url = '/img/post/ML/random-forest-decision-tree' %}

## What's the idea of Decision Tree Classifier?

The basic intuition behind a decision tree is to map out all possible decision paths in the form of a tree. It can be used for *classification* and *regression* ([note](/decision-tree-regression)). In this post, let's try to understand the classifier.

Suppose that we have a dataset $S$ like in the figure below<sup>[\[ref, *Table 1.2*\]](https://books.google.fr/books/about/Data_Mining_Practical_Machine_Learning_T.html?id=bDtLM8CODsQC){:target="_blank"}</sup>,

<div class="col-2-equal">

![Example of dataset]({{img-url}}/dt-1-1.jpg){:.img-100 .pop}
*An example of dataset $S$.*

![Example of dataset]({{img-url}}/dt-1-2.jpg){:.img-100 .pop}
*A decision tree we want.*
</div>

There are [many algorithms](https://en.wikipedia.org/wiki/Decision_tree_learning#Decision_tree_types) which can help us make a tree like above, in Machine Learning, we usually use:

{:.indent}
- [**ID3**](https://en.wikipedia.org/wiki/ID3_algorithm) (*Iterative Dichotomiser*): uses **information gain** / **entropy**.
- **[CART](https://en.wikipedia.org/wiki/Decision_tree_learning#Gini_impurity)** (*Classification And Regression Tree*): uses **Gini impurity**.

### Some basic concepts

![Concepts with a tree.]({{img-url}}/f5.jpg){:.img-full-80}

- **Splitting**: It is a process of dividing a node into two or more sub-nodes.
- **Pruning**: When we remove sub-nodes of a decision node, this process is called pruning.
- **Parent node and Child Node**: A node, which is divided into sub-nodes is called parent node of sub-nodes where as sub-nodes are the child of parent node.

### ID3 algorithm

{% hsbox "**ID3 algorithm (TL;DR;)**" %}

1. To check the disorder at current node (let's say $S$, parent node), we calculate its **entropy** with,

    $$
	H(S) = -\sum_{i=1}^{2} p_{S,i} \log_2 p_{S,i},
	$$

    where $i \in$ the number of classes and $p_{S,i}$ is the probability of class $i$ in $S$.
2. If entropy at this node is **pure** (there is only 1 class or the majority is 1 class) or it meets [the stopping conditions](#when-to-stop), we stop splitting at this node. Otherwise, go to the next step.

3. Calculate the **information gain** (IG) after splitting node $S$ on each attribute (for example, consider attribute $O$). The attribute w.r.t. the ==biggest IG== will be chosen!

    $$\underbrace{IG(S,O)}_{\text{information gain}} = \underbrace{H(S)}_{\text{entropy before split}} - \underbrace{\sum_j P(O_j | S) \times H(S,O_j)}_{\text{weighted entropy after split}}$$

    where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$.
4. After splitting, we have new child nodes. Each of them becomes a new parent node in the next step. Go back to step 1.

{% endhsbox %}

{% hsbox "**ID3 algorithm in detail**" %}

How we know we can split the dataset $S$ base on the **Outlook attribute** instead of the others (*Temperature, Humidity, Windy*)? $\Rightarrow$ We calculate the **information gain** after splitting $S$ on each attribute. *It’s the information which can increase the level of certainty after splitting*. The **highest one** will be chosen (after this section, you will see that the Outlook attribute has the highest information gain).

In order to calculate the information gain, we need "**entropy**" which is *the amount of information disorder or the amount of randomness in the data*.

$$
\text{information gain} = \text{entropy before split} - \text{weighted entropy after split}
$$

At the beginning, `entropy before split` ($H(S)$) shows us the disorder status of the whole dataset $S$. If $S$ contains only `Yes`, $S$ has no disorder or it's **pure** ($H(S)=0)$. If the amount of `Yes` and `No` in $S$ is equal, $S$ has the highest disorder ($H(S)=1$).

![Illustration of entropy with different proportions of Yes/No in S.]({{img-url}}/f6.jpg){:.img-full-80}
*An illustration of entropy with different proportions of Yes/No in $S$.*

At each node, we need to calculate again its entropy (corresponding to the number of `Yes` and `No` in this node.). We prefer **the lowest entropy**, of course! How can we calculate entropy of each node? More specifically, how to calculate $H(S)$?

$$
H(S) = -\sum_{i=1}^{2} p_{S,i} \log_2 p_{S,i},
$$

where $i \in$ the number of classes (node $S$ has 2 classes, `Yes` and `No`), $p_{S,i}$ is the probability of class $i$ in $S$.

![Graph of H(S) in the case there are 2 classes.]({{img-url}}/f11.svg){:.img-full-45 .bg-white}
*Graph of $H(p)$ in the case of 2 classes. Max is 1.*

::: warning
In this case we use $\log_2$ (binary logarithm) to obtain the maximum $H(S)=1$ and we also use a convention in which $0\times\log_2(0)=0$. There are other documents using $\log$ (natural logarithm) instead.
:::

<div class="columns-2">
<div>

On node $S$ , we have,

$$
\begin{aligned}
H(S) &= H([9,5]) \\
&= -\frac{9}{14} \times \log_2(\frac{9}{14}) - \frac{5}{14}\times\log_2(\frac{5}{14})\\
&= 0.94.
\end{aligned}
$$

We see that, $S$ is not pure but it's also not totally disordered.
</div>

![The frequency of classes in S]({{img-url}}/f1.jpg){:.img-100}
*The frequency of classes in S.*
</div>

Because we are considering to split $S$ on $O$ (Outlook) and $O$ has 3 different properties which are *Sunny, Overcast* and *Rainy*. Corresponding to these properties, we have different sizes of `Yes`/`No` (Different nodes having different sizes of data but their total is equal to the size of $S$ which is their "parent" node.). That's why we need to calculate the **weighted entropy** (`weighted entropy after split`).

$$
\sum_{j=1}^3 P(O_j) \times H(S,O_j),
$$

where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$. Therefore, the information gain if split $S$ on $O$ is,

$$
IG(S,O) = H(S) - \sum_{j=1}^3 P(O_j) \times H(S,O_j).
$$

![If we split S in O?]({{img-url}}/f2.jpg){:.img-100 .pop}
*If we split S on Outlook (O), there will be 3 branches.*

For example, we consider branch $O_1$ (Sunny), it has $P(O_1)=\frac{5}{14}$ and entropy at this node, $H(S,O_1)$ is calculated as

<div class="columns-2">

$$
\begin{aligned}
H(S,O_1) &= H([2,3]) \\
&= -\frac{2}{5} \times \log_2(\frac{2}{5}) - \frac{3}{5}\times\log_2(\frac{3}{5})\\
&= 0.97.
\end{aligned}
$$

![Only consider O1]({{img-url}}/f3.jpg){:.img-100}
*Only consider branch Sunny ($O_1$).*
</div>

Thus, the information gain after splitting $S$ on $O$ is,

$$
\begin{aligned}
IG(S,O) &= H(S) - \sum_{j=1}^3 P(O_j) \times H(S,O_j) \\
&= 0.94 - (\frac{5}{14}\times 0.971 + \frac{4}{14}\times 0 + \frac{5}{14}\times 0.971) \\
&= 0.94 - 0.693 = 0.247.
\end{aligned}
$$

With the same method, we can calculate the information gain after splitting $S$ on other attributes (Temperature, Windy, Humidity) and get,

![Dataset is split into different ways.]({{img-url}}/dt-4.jpg){:.img-full-75 .pop}
*Dataset is split into different ways.*

We can see that, the winner is **Outlook** with **the highest information gain**. We split $S$ on that attribute first!

![Data is split on Outlook.]({{img-url}}/f9.jpg){:.img-100 .pop}
*Dataset is split on Outlook.*

How about 3 others remaining attributes (Temperature, Humidity, Windy), which one to be chosen next? Especially on branches Suuny and Humidity because on branch Overcast, this node is pure (all are `Yes`), we don't need to split any more.

![Which attribute will be chosen next?]({{img-url}}/f10.jpg){:.img-full-50}
*There are remaining Temperature, Humidity, Windy. Which attribute will be chosen next?*

We repeat the steps again, for example, on the branch $O_1$ (Sunny), we calculate IG after splitting $O_1$ on each attribute Temperature (T), Humidity (H) or Windy (W). Other words, we need to calculate $IG(O_1,T)$, $IG(O_1, H)$ and $IG(O_1, W)$ and then compare them to find the best one. Let's consider $H$ (Humidity) as an example,

<div class="columns-2">
<div>

$$
\begin{aligned}
IG(O_1,H) &= H(O_1) - \sum_{j=1}^2 P(H_j|O_1) \times H(O_1,H_j) \\
&= H(S,O_1) - \frac{3}{5}\times 0 - \frac{2}{5} \times 0 \\
&= 0.971.
\end{aligned}
$$

Nodes $W_1$ and $W_2$ are pure, that's why their entropy are $0$.
</div>

![Consider branch O1 and attribute W]({{img-url}}/f4.jpg){:.img-full-75}
*Consider branch $O_1$ and attribute Windy (W).*
</div>

Similarly, we calculate $IG(O_1,T)$, $IG(O_1,H)$ and we see that $IG(O_1,W)$ is the biggest one! So we choose $W$ (Windy) to split at node $O_1$. On the branch $O_3$ (Rainy), the biggest information gain after splitting is on $H$ (Humidity).

![Example of dataset]({{img-url}}/dt-1.jpg){:.img-100 .pop}

From now, if we have a new input which contains information about *Outlook, Temperature, Humidity* and *Windy*, we go from the top of the tree and choose an appropriate branch to get the decision `Yes` or `No`.

{% endhsbox %}

### CART algorithm

{% hsbox "**CART algorithm (TL;DR;)**" %}

::: warning
The difference between two algorithms is the difference between $H(S)$ and $I_G(S)$.
:::

1. To check the disorder at current node (let's say $S$, parent node), we calculate its **Giny Impurity** with,

    $$I_G(S) = \sum_{i=1}^{2} p_{S,i}(1-p_{S,i}),$$

    where $i \in$ the number of classes in $S$ and $p_{S,i}$ is the probability of class $i$ in $S$.
2. If entropy at this node is **pure** (there is only 1 class or the majority is 1 class) or it meets [the stopping conditions](#when-to-stop), we stop splitting at this node. Otherwise, go to the next step.
3. Calculate the **Gini Gain** (GG) after splitting node $S$ on each attribute (for example, consider attribute $O$). The attribute w.r.t. the ==biggest GG== will be chosen!

    $$\underbrace{GG(S,O)}_{\text{gini gain}} = \underbrace{I_G(S)}_{\text{gini impurity before split}} - \underbrace{\sum_j P(O_j | S) \times I_G(S,O_j)}_{\text{weighted gini impurity after split}}$$

    where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$.
4. After splitting, we have new child nodes. Each of them becomes a new parent node in the next step. Go back to step 1.

{% endhsbox %}

{% hsbox "**CART algorithm in detail**" %}

It's quite the same to the ID3 algorithm except a truth that it's based on the definition of **Gini impurity** instead of **Entropy**. *Gini impurity is a measure of how often a randomly chosen element from the set would be incorrectly labeled if it was randomly labeled according to the distribution of labels in the subset.*

At every nonleaf node (which isn't pure), we have to answer a question "*Which attribute we should choose to split that node?*" We calculate the **Gini gain** for each split based on the attribute we are going to use. This *Gini gain* is quite the same as *Information gain*. The highest one will be chosen.

$$
\text{gini gain} = \text{gini impurity before split} - \text{weighted gini impurity after split}
$$

The **Gini Impurity** at node $S$ is calculated as,

$$
I_G(S) = \sum_{i=1}^2p_{S,i}(1-p_{S,i}),
$$

where $i\in$ the number of classes in $S$, $p_{S,i}$ is the probability of class $i$ in $S$. $I_G=0$ will be the best!

<div class="columns-2">
<div markdown="1">

On node $S$, we have,

$$
\begin{aligned}
I_G(S) &= I_G([9,5]) \\
&= \frac{9}{14} \times \frac{5}{14} + \frac{5}{14} \times \frac{9}{14}\\
&= 0.459.
\end{aligned}
$$
</div>

![The frequency of classes in S]({{img-url}}/f1.jpg){:.img-100}
*The frequency of classes in S.*
</div>

Similarly to the information gain, we can calculate **Gini Gain** ($GG$) after splitting $S$ on the property $O$ with,

$$
GG(S,O) = I_G(S) - \sum_{j=1}^3 P(O_j) \times I_G(S,O_j),
$$

where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$.

![If we split S in O?]({{img-url}}/f12.jpg){:.img-100 .pop}
*If we split S on Outlook (O), there will be 3 branches.*

Apply above equation, we calculate all GG if splitting $S$ on each property and get,

$$
\begin{aligned}
GG(S,O) &= I_G([9,5]) - ( \frac{5}{14}\times I_G([2,3]) + \frac{4}{14}\times I_G([4,0]) + \frac{5}{14}\times I_G([3,2])) \\
&= \ldots
\end{aligned}
$$

The same for $GG(S,H)$ (Humidity), $GG(S,T)$ (Temperature) and $GG(S,W)$ (Windy). Keep going the same arguments as in the section **ID3 in detail**, we will get the final tree. The difference between two algorithms is the difference between $H(S)$ and $I_G(S)$.

{% endhsbox %}

### Gini Impurity or Entropy?

Some points:<sup>[\[ref\]](https://books.google.fr/books/about/Hands_on_Machine_Learning_with_Scikit_Le.html?id=I6qkDAEACAAJ&source=kp_book_description&redir_esc=y)</sup>

{:.indent}
- Most of the time, they lead to similar trees.<sup>[\[ref\]](https://www.unine.ch/files/live/sites/imi/files/shared/documents/papers/Gini_index_fulltext.pdf)</sup>
- Gini impurity is slightly faster.<sup>[\[ref\]](https://www.unine.ch/files/live/sites/imi/files/shared/documents/papers/Gini_index_fulltext.pdf)</sup>
- Gini impurity tends to isolate the most frequent class in its own branch of the tree, while entropy tends to produce slightly more balanced trees.

## Good / Bad of Decision Tree?

Some highlight **advantages** of Decision Tree Classifier:{% ref "https://blog.easysol.net/machine-learning-algorithms-1" %}

{:.indent}
1. Can be used for regression or classification.
2. Can be displayed graphically.
3. Highly interpretable.
4. Can be specified as a series of rules, and more closely approximate human decision-making than other models.
5. Prediction is fast.
6. Features don't need scaling.
7. Automatically learns feature interactions.
8. Tends to ignore irrelevant features.
9. Non-parametric (will outperform linear models if relationship between features and response is highly non-linear).

Its **disadvantages**:

{:.indent}
1. Performance is (generally) not competitive with the best supervised learning methods.
2. Can easily ==overfit== the training data ([tuning](https://stackoverflow.com/questions/22903267/what-is-tuning-in-machine-learning) is required).
3. Small variations in the data can result in a completely different tree (high variance).
4. Recursive binary splitting makes "locally optimal" decisions that may not result in a globally optimal tree.
5. ==Doesn't== work well with ==unbalanced== or ==small== datasets.

## When to stop?

If the number of features are too large, we'll have a very large tree! Even, it easily leads to an [overfitting problem](/underfitting-overfitting). How to avoid them?

{:.indent}
1. **Pruning**: removing the branches that make use of features having low importance.
2. Set a minimum number of training input to use on each leaf. If it doesn't satisfy, we remove this leaf. In [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html#sklearn.tree.DecisionTreeClassifier), use `min_samples_split`.
3. Set the maximum depth of the tree. In [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html#sklearn.tree.DecisionTreeClassifier), use `max_depth`.

## When we need to use Decision Tree?

- When explainability between variable is prioritised over accuracy. Otherwise, we tend to use [Random Forest]({/random-forest).
- When the data is more non-parametric in nature.
- When we want a simple model.
- When entire dataset and features can be used
- When we have limited computational power
- When we are not worried about accuracy on future datasets.
- When we are not worried about accuracy on future datasets.

## Using Decision Tree Classifier with Scikit-learn

### Load and create

Load the library,

~~~ python
from sklearn.tree import DecisionTreeClassifier
~~~

Create a decision tree ([other parameters](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html#sklearn.tree.DecisionTreeClassifier)):

~~~ python
# The Gini impurity (default)
clf = DecisionTreeClassifier() # criterion='gini'
# The information gain (ID3)
clf = DecisionTreeClassifier(criterion='entropy')
~~~

An example,

::: code-output-equal
~~~ python
from sklearn import tree
X = [[0, 0], [1, 1]]
Y = [0, 1]
clf = tree.DecisionTreeClassifier()
clf = clf.fit(X, Y)
# predict
clf.predict([[2., 2.]])
# probability of each class
clf.predict_proba([[2., 2.]])
~~~

~~~
array([1])
array([[0., 1.]])
~~~
:::

### Plot and Save plots

Plot the tree (You may need to install [Graphviz](https://www.graphviz.org/) first. Don't forget to add its installed folder to `$path`),

<div class="columns-2">

~~~ python
from IPython.display import Image
import pydotplus
dot_data = tree.export_graphviz(clf, out_file=None,
                                rounded=True,
                                filled=True)
graph = pydotplus.graph_from_dot_data(dot_data)
Image(graph.create_png())
~~~

![Iris tree.]({{img-url}}/iris-tree.png){:.img-100 .pop}
</div>

Save the tree (follows the codes in "plot the tree")

~~~ python
graph.write_pdf("tree.pdf")   # to pdf
graph.write_png("thi.png")    # to png
~~~

## References

- **Scikit-learn**. *[Decision Tree CLassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html#sklearn.tree.DecisionTreeClassifier) official doc*.
- **Saed Sayad**. *[Decision Tree - Classification](https://www.saedsayad.com/decision_tree.htm)*.
- **Tiep Vu**. [*Bài 34: Decision Trees (1): Iterative Dichotomiser 3*](https://machinelearningcoban.com/2018/01/14/id3/).
- **Brian Ambielli**. *[Information Entropy and Information Gain](https://bambielli.com/til/2017-10-22-information-gain/)*.
- **Brian Ambielli**. *[Gini Impurity (With Examples)](https://bambielli.com/til/2017-10-29-gini-impurity/)*.
- **Aurélien Géron**. *[Hands-on Machine Learning with Scikit-Learn and TensorFlow](https://books.google.fr/books/about/Hands_on_Machine_Learning_with_Scikit_Le.html?id=I6qkDAEACAAJ&source=kp_book_description&redir_esc=y)*, chapter 6.