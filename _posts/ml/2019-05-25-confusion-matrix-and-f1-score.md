---
layout: post
title: "Confusion matrix & f1-score"
categories: [machine learning]
tags: [score]
katex: 1
keywords: "true false negative positive type i type ii error precision recall f1 score email spam bank transaction is fraudulent skewed class accuracy specificity prediction support ROC curve machine learning crash course google developers Koo Ping Shung Marco Altini Salma Ghoneim Towards Data Science NLP blog"
---

{% assign img-url = '/img/post/ML/confusion-matrix-f1-score' %}

{% katexmm %}

{% include toc.html %}

## Confusion matrix

{:.table.bd-right.table-dark}
|              	|    actual (yes)   	|      actual (no)     	|
|:------------:	|:------------------:	|:---------------------:	|
| predict (yes) 	| <span class="tgreen-light">TP</span>	| <span class="tpink-light">FP</span>	|
|  predict (no) 	| <span class="tpink-light">FN</span> 	|   <span class="tgreen-light">TN</span>   	|

<div class="columns-2" markdown="1">
<div markdown="1">
- **True Positive** (**TP**{:.tgreen}): what we predict Positive is really Positive.
- **True Negative** (**FN**{:.tgreen}): what we predict Negative is really Negative.
- **False Negative** (**FN**{:.tpink}): what we predict Negative is actually Positive.
- **False Positive** (**FP**{:.tpink}): what we predict Positive is actually Negative.
</div>

{:.img-full-100.pop}
![This guy is pregnant?]({{img-url}}/cm_ex.png)
*This guy is pregnant?*
</div>

### How to remember?

- **True**/**False** indicates what we predicted is right/wrong.
- **Positive**/**Negative** is what we predicted (yes or no).

### Type I / Type II errors

- FP = [Type I](https://en.wikipedia.org/wiki/Type_I_and_type_II_errors) error = rejection of true null hypothesis = negative results are predicted wrongly = what we predict positive is actually negative.
- FN = [Type II](https://en.wikipedia.org/wiki/Type_I_and_type_II_errors) error = non-rejection of a false null hypothesis = positive results are predicted wrongly = what we predict negative are actually positive.

### Why CM is important?

Give a general view about our model, "is it really good?" thanks to precision and recall!

## Precision & Recall

{:.table.bd-right.table-dark}
|              	|    actual (yes)   	|      actual (no)     	|        	|
|:------------:	|:------------------:	|:---------------------:	|:------:	|
| predict (yes) 	| <span class="tgreen-light">TP</span>	| <span class="tpink-light">FP</span>	| **Precision** 	|
|  predict (no) 	| <span class="tpink-light">FN</span> 	|   <span class="tgreen-light">TN</span>   	|        	|
|              	|      **Recall**     	|                       	|        	|

- **Precision**: How many of our positive predictions are really true? (Check the accuracy of our positive predictions).

    <p class="p-mark">
    $$
    \mathrm {precision}
    = \dfrac{\mathrm{true\, positive}}{\mathrm{positively\, predicted\, results}}
    = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FP}}.
    $$
    </p>

- **Recall**: How many of positive results belong to our predictions? (Do we miss some negative predictions?)

    <p class="p-mark">
    $$
    \mathrm {recall}
    = \dfrac{\mathrm{true\, positive}}{\mathrm{positively\, actual\, results}}
    = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FN}}.
    $$
    </p>

### When to use?

- **Precision** is importantly used when the "wrongly predicted yes" (FP) influences much (e.g. *This email is spam?* -- results yes but actually no and we lost important emails!).
- **Recall** is importantly used when the "wrongly predicted no" (FN) influences much (e.g. In the banking industry, *this transaction is fraudulent?* -- results no but actually yes and we lost money!).

## F1-Score

High precision and low recall or vice versa? F1-Score gives us a balance between precision and recall.

<p class="p-mark">
$$
f_1 = \left({\frac {\mathrm {recall} ^{-1}+\mathrm {precision} ^{-1}}{2}}\right)^{-1}=2\times {\frac {\mathrm {precision} \cdot \mathrm {recall} }{\mathrm {precision} +\mathrm {recall} }}.
$$
</p>

F1-score depends on how we label the class "positive". *This email is spam?* is **very different** from *This email is not spam?*

### When to use F1-Score?

- When you need a balance between precision and recall.
- When we have a "skewed class" problem (uneven class distribution, too many "yes" and very few "no", for example).
- One of precision and recall is improved but the other changes too much, then f1-score will be very small!

### How to choose f1-score value?

Normally, $f_1\in (0,1]$ and it gets the higher values, the better our model is.

- The best one ($f_1=1$), both precision and recall get $100\%$.
- One of precision and recall gets very small value (close to 0), $f_1$ is very small, our model is not good!

What if we prefer one of precision and recall than the other? We consider $f_{\beta}$<sup>[[ref]](https://pdfs.semanticscholar.org/3dcd/a1bec36586b46b1dc67a477beca2c5a105be.pdf)</sup>

<p class="p-mark">
$$
f_{\beta} = ( 1 + \beta^2)\frac{\text{precision}\cdot\text{recall}}{\beta^2\cdot\text{precision} + \text{recall}}
$$
</p>

$f_1$ is a special case of $f_{\beta}$ when $\beta=1$:

- When precision is more important than recall, we choose $\beta < 1$ (usually choose $\beta=0.5$).
- When recall is more important than precision, we choose $\beta > 1$ (usually choose $\beta=2$).

## Accuracy / Specificity

- **Accuracy**: How accurate our predictions to the whole predictions?

    <p class="p-mark">
    $$
    \mathrm{accuracy} = \dfrac{TP + TN}{TP + TN + FP + FN}
    $$
    </p>

- **Specificity**: How many negative results belong to our predictions?

    <p class="p-mark">
    $$
    \mathrm{specificity} = \dfrac{TN}{FP + TN}
    $$
    </p>

### When to use?

- **Accuaracy** is used when we have symmetric datasets.
- **Specificity** is used when we care about TN values and don't want to make false alarms of the FP values (e.g. drug test).

## Confusion Matrix & F1-Score with Scikit-learn

~~~ python
from sklearn.metrics import confusion_matrix
n_classes = target.shape[0]
confusion_matrix(y_true, y_pred, labels=range(n_classes))
~~~

Precision / Reacall / f1-score / support

~~~ python
from sklearn.metrics import classification_report
classification_report(y_test, y_pred)
~~~

ROC curve,

~~~ python
from sklearn.metrics import roc_curve
import matplotlib.pyplot as plt
%matplotlib inline

fpr, tpr, thresholds = roc_curve(y_test, y_pred_prob)
# create plot
plt.plot(fpr, tpr, label='ROC curve')
plt.plot([0, 1], [0, 1], 'k--', label='Random guess')
_ = plt.xlabel('False Positive Rate')
_ = plt.ylabel('True Positive Rate')
_ = plt.title('ROC Curve')
_ = plt.xlim([-0.02, 1])
_ = plt.ylim([0, 1.02])
_ = plt.legend(loc="lower right")
~~~

## References

1. [Classification: Precision and Recall](https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall){:target="_blank"} - **Google Developers**, *Machine Learning Crash Course*.
2. [Classification: Check Your Understanding (Accuracy, Precision, Recall)](https://developers.google.com/machine-learning/crash-course/classification/check-your-understanding-accuracy-precision-recall){:target="_blank"} - **Google Developers**, *Machine Learning Crash Course*.
3. [F-measure versus Accuracy](https://nlpers.blogspot.com/2007/10/f-measure-versus-accuracy.html){:target="_blank"} - **NLP blog**.
4. [Accuracy, Precision, Recall or F1?](https://towardsdatascience.com/accuracy-precision-recall-or-f1-331fb37c5cb9){:target="_blank"} - **Koo Ping Shung**, *Towards Data Science*.
5. [Dealing with Imbalanced data: undersampling, oversampling and proper cross-validation](https://www.marcoaltini.com/blog/dealing-with-imbalanced-data-undersampling-oversampling-and-proper-cross-validation#){:target="_blank"} - **Marco Altini**.
6. [Accuracy, Recall, Precision, F-Score & Specificity, which to optimize on?](https://towardsdatascience.com/accuracy-recall-precision-f-score-specificity-which-to-optimize-on-867d3f11124){:target="_blank"} - **Salma Ghoneim**, *Towards Data Science*.

{% endkatexmm %}



