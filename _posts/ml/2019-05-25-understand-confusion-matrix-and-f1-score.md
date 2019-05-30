---
layout: post
title: "Understanding the confusion matrix and f1-score"
subtitle: A good accuracy is really good?
description: "A good accuracy is really good?"
tags: [errors, definition]
categories: [machine learning]
comment: 1
math: 1
---

{% assign img-url = '/img/post/ML' %}

{% include toc.html %}

In classification, if your dataset skews in some way, your results could be biased to the majority labels. An example of this problem is *fraud detection*. If 95% data says "don't have cancer" and only 5% mentions about "have cancer", your model just predicts "don't" for all cases, the accuracy is automatically 95% then. Your model is useless! How we can overcome this disadvantage?

This problem is mentioned as a "skewed class" in [the course of Andrew Ng](https://www.coursera.org/learn/machine-learning){:target="_blank"}, he defined it as "*The data that we have turns out not balance, it weights more to one class than the others*." There are [several proposed solutions](https://www.quora.com/What-problems-do-skewed-training-data-sets-lead-to) for this type of problem. In this article, we mainly talk about ***confusion matrix*** and ***f1-score*** metric to evaluate the trained model.

## TL;DR;

- **Confusion matrix**

  {:.table.table-dark}
  |              	|    predict (yes)   	|      predict (no)     	|        	|
  |:------------:	|:------------------:	|:---------------------:	|:------:	|
  | actual (yes) 	| <span class="tgreenDark">TP</span>	| <span class="tpinkLight">FN</span>	| **Recall** 	|
  |  actual (no) 	| <span class="tpinkLight">FP</span> 	|   <span class="tgreenDark">TN</span>   	|        	|
  |              	|      **Precision**     	|                       	|        	|

  - **True Positive**{:.tgreenDark} (TP): what we **predict True** is **really True**.
  - **True negative**{:.tgreenDark} (FN): what we **predict False** is **really False**.
  - **False negative**{:.tpink} (FN): what we **predict False** is **actually True**.
  - **False positve**{:.tpink} (FP): what we **predict True** is **actually False**.

- **Precision** / **Recall**
  - **Precision**: How many our positive predictions are really true?
  - **Recall**: How many positive results belong to our predictions?

- **F1-Score**: the harmonic mean(average) of the precision and recall.
- **Accuracy** / **Specificity**: 
  - **Accuracy**: How accurate our predictions to the whole predictions?
  - **Specificity**: How many negative results belong to our predictions?
- **When to use?**
  - **Precision**: is used when the "wrongly predicted yes" influences much (e.g. email spam detection).
  - **Recall**: is used when the "wrongly predicted no" influences much (e.g. fraud detection in the banking industry).
  - **Accuaracy**: is used when we have symmetric datasets.
  - **Specificity**: is used when we care about TN values and don’t want make false alarms of the FP values (e.g. drug test).
  - **F1-Score**: is used when you have an uneven class distribution and we need a balance between precision and recall.

## Confusion matrix

Suppose there are totally 1005 patients and we predict that:

- 90 patients have cancer and all that we predicted are true.
- 915 patients don't have cancer but there are only 5 of them don't really have.

We can see the above situation in the below table. It's called a **[confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix){:target="_blank"}** because this matrix makes us confused (just funny).

{:.table.table-dark}
|              	    |    predict (yes)   	|      predict (no)     	|
|:---------------:	|:------------------:	|:---------------------:	|
| **actual (yes)** 	| 90 (<span class="tgreen">True Positive</span>) 	| 910 (<span class="tpinkLight">False Negative</span>) 	|
|  **actual (no)** 	| 0 (<span class="tpinkLight">False Positive</span>) 	|   5 (<span class="tgreen">True Negative</span>)   	|

In this case,

- **True Positive**{:.tgreenDark} (TP): what we **predict True** is **really True**.
- **True negative**{:.tgreenDark} (FN): what we **predict False** is **really False**.
- **False negative**{:.tpink} (FN): what we **predict False** is **actually True**.
- **False positve**{:.tpink} (FP): what we **predict True** is **actually False**.

The FP and FN are also called [Type I error and Type II error](https://en.wikipedia.org/wiki/Type_I_and_type_II_errors){:target="_blank"} respectively.

### How to remember the confusion matrix?

But now, how can we remember the meaning of these terms? Here is a way.

- <mark><b>True</b>/<b>False</b> indicates what we predicted is right/wrong. <b>Positive</b>/<b>Negative</b> is what we predicted (1 or 0)</mark>. Other words, if you see "*True...*", it means that all you predicted are right (predicted true are really true, predicted false are really false). On the contrary, if you see "False...", it means that all you predicted are wrong (predicted true are actually false, predicted false are actually true).
- For example, **True Positive** contains "True", it means what we predicted are right and we predicted 1 (Positive) in this case.
- Another example, **False Positive** containing "False" shows that what we predicted is wrong and we predicted 1 (Positive) in this case.

## Precision / Recall

- **Precision**: This is the ratio of patients who actually have cancer based on all cancer predictions. Other words, *<mark>how many our positive predictions are really true?</mark>*

  $$
  \begin{align}
  \mathrm {precision} &= \dfrac{TP}{\mathrm{positively\, predicted\, results}}
  = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FP}} \\
  &= \dfrac{90}{90+0} = 100\%.
  \end{align}
  $$

- **Recall** (*Sensitivity*): Among patients who really have cancer, how many of them are predicted by our model? Other words, *<mark>how many positive results belong to our predictions?</mark>*

  $$
  \begin{align}
  \mathrm {recall} &= \dfrac{TP}{\mathrm{positively\, actual\, results}}
  = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FN}} \\
  &= \dfrac{90}{90+910} = 9\%.
  \end{align}
  $$

{:.table.table-striped}
|              	|    predict (yes)   	|      predict (no)     	|        	|
|:------------:	|:------------------:	|:---------------------:	|:------:	|
| actual (yes) 	| 90 (True Positive) 	| 1000 (False Negative) 	| **Recall** 	|
|  actual (no) 	| 0 (False Positive) 	|   5 (True Negative)   	|        	|
|              	|      **Precision**     	|                       	|        	|

### High precision / Low recall

How can we understand about precision and recall? If one of them is high while the other is low, what happens? Come back to the above table,

- If we only rely on the **precision**, our model is really good because everyone we predict having cancer is really having cancer (100% our positive predictions are true).
- A big problem comes from the **recall**. There are 910 patients (91%) having cancer are not diagnosed! Our model is not good anymore!

### Low precision / High recall

How about vice versa?

{:.table.table-striped}
|              	| predict (yes) 	| predict (no) 	|
|:------------:	|:-------------:	|:------------:	|
| actual (yes) 	|       <span class="tgreenDark">90</span>      	|      <span class="tpink">10</span>      	|
|  actual (no) 	|      <span class="tpink">910</span>      	|       <span class="tgreenDark">5</span>      	|

In this case, $\mathrm {precision} = 9\%$, $\mathrm {recall} = 90\%$. We predict many patients having cancer but they actually don't! We may think that this case is less fatal than the previous one where we miss many infected patients and they cannot have timely treatments.

### Why both precision and recall are important?

Precision results tell us about how much accuracy our "desired prediction" is. But then, we may *wait a minute* and *want to check again* whether *we miss something?* Recall gives us the answer to this question. If you wanna fix your algorithms to improve one of them, the other will be reduced.

**Another example**, you wanna build a *suggestion service* online. Your positive predictions are the products that are interesting to the customers. Your model will show related products off to the customers so that they can buy more on your platform. If the precision is high but the recall is too low, your suggested products are really interesting to the customers but your customers also miss a lot of potential products. Otherwise, if the precicion is low but the recall is high, you can be sure that all potential products are shown to the customers but there are also a lot of useless products therein and it may lead the customers to change to other platforms.

<mark>Without recall, we don't believe in our negative predictions. Without precision, we don't believe in our positive predictions.</mark> Then, is there any kind of metrics which can help us estimate our model more easily? It's **[F1-Score!](https://en.wikipedia.org/wiki/F1_score){:target="_blank"}**

### When one of them is more important than the other?

{:.table.table-striped}
|              	|    predict (yes)   	|      predict (no)     	|        	|
|:------------:	|:------------------:	|:---------------------:	|:------:	|
| actual (yes) 	| <span class="tgreenDark">TP</span>	| <span class="tpink">FN</span>	| **Recall** 	|
|  actual (no) 	| <span class="tpink">FP</span> 	|   <span class="tgreenDark">TN</span>   	|        	|
|              	|      **Precision**     	|                       	|        	|


<mark><b>The precision takes an important role</b> when the cost of FP is high (the "wrongly predicted yes" influences much).</mark> For instance, in email spam detection, FP is "*an email which is not spam has been identified as spam*". If the precision is low, or FP is high, many important emails will be lost. In this case, if the recall is low, or FN is high, we will receive many spam emails, it's not as dangerous as the case of low precision.

<mark><b>The recall takes an important role</b> when the cost of FN is high (the "wrongly predicted no" influences much).</mark> The example of fraud detection given from the beginning of this post is an instance. Another one is fraud detection in the banking industry. An FN is "*a transaction is predicted non-fraudulent but it's actually fraudulent.*" The consequence may be very serious for the banks. In this case, if the precision is low, or FP is high, there may be a lot of wrong warnings to the banks. They may spend more time and effort to verify them but their customers will not be affected.

## Your brain's turn

You will understand more if you can figure out by yourself. Let's check below figure which shows 30 predictions made by an email classification model. Those to the right of the classification threshold are classified as "spam", while those to the left are classified as "not spam."

{:.img-full-normal}
![Your turn]({{img-url}}/PrecisionVsRecallBase.svg)

For you, what are the values of precision and recall in this case? If we increase the threshold, the recall will be increasing or decreasing or stay constant? Think of them carefully, get your own an answer and then compare it with [this one](https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall){:target="_blank"}. You can also take some basic tests on this field [here](https://developers.google.com/machine-learning/crash-course/classification/check-your-understanding-accuracy-precision-recall){:target="_blank"}.

## F1-Score, Accuracy, Specifility

F1-Score is a relation which takes into account both the precision and the recall so that instead of considering the balance between them, <mark>you only need to mind only one metric</mark>. F1-Score is calculated as below,

$$
F_{1} = \left({\frac {\mathrm {recall} ^{-1}+\mathrm {precision} ^{-1}}{2}}\right)^{-1}=2\times {\frac {\mathrm {precision} \cdot \mathrm {recall} }{\mathrm {precision} +\mathrm {recall} }}.
$$

Recall that,

{:.table.table-striped}
|              	|    predict (yes)   	|      predict (no)     	|
|:------------:	|:------------------:	|:---------------------:	|
| actual (yes) 	| <span class="tgreenDark">TP</span>	| <span class="tpink">FN</span>	|
|  actual (no) 	| <span class="tpink">FP</span> 	|   <span class="tgreenDark">TN</span>

and

$$
\begin{align}
\mathrm {precision} = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FP}}, \quad
\mathrm {recall} = \dfrac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FN}}
\end{align}
$$

You may easily notice that if we change our definition of "positive" class (what is "1" is now "0" and vice versa), the value of F1-Score changes too. It's because the TP in the formulas of precision and recall will change to FN instead. It means that <mark>you have to be careful when you choose the label for positive class. The meaning of F1-Score will be corresponding to this label</mark>.

How F1-Score can be useful in evaluating a model? <mark>When you need a balance between precision and recall</mark> and <mark>when you have an uneven class distribution</mark>. If one of them is improved at the expense of the other, F1-Score will be very small.

When we want to evaluate a model, there are many methods we can use. In the viewpoint of F1-Score, precision and recall, we also need the **accuracy** and the **specificity**.

- **Accuaracy**: *How accurate our predictions to the whole predictions?* We choose **accuracy** in most cases, especially when we have symmetric datasets. 

  $$
  \mathrm{accuracy} = \dfrac{TP + TN}{TP + TN + FP + FN}
  $$

- **Specificity**: *How many negative results belong to our predictions?* We choose **specificity** when we care about TN values and don't want make false alarms of the FP values. For example, we're running a drug test in which all people who get the positive results will go to jail. Of course, we don't want put the guys who are actually drug-free into there.

  $$
  \mathrm{specificity} = \dfrac{TN}{FP + TN}
  $$


## Conclusion

In a nutshell, please step to [TL;DR;](#tldr). For a real application of using metrics in an imbalanced classes problem, I'll write another post.

## References

1. [Classification: Precision and Recall](https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall){:target="_blank"} - **Google Developers**, *Machine Learning Crash Course*.
2. [Classification: Check Your Understanding (Accuracy, Precision, Recall)](https://developers.google.com/machine-learning/crash-course/classification/check-your-understanding-accuracy-precision-recall){:target="_blank"} - **Google Developers**, *Machine Learning Crash Course*.
3. [F-measure versus Accuracy](https://nlpers.blogspot.com/2007/10/f-measure-versus-accuracy.html){:target="_blank"} - **NLP blog**.
4. [Accuracy, Precision, Recall or F1?](https://towardsdatascience.com/accuracy-precision-recall-or-f1-331fb37c5cb9){:target="_blank"} - **Koo Ping Shung**, *Towards Data Science*.
5. [Dealing with Imbalanced data: undersampling, oversampling and proper cross-validation](https://www.marcoaltini.com/blog/dealing-with-imbalanced-data-undersampling-oversampling-and-proper-cross-validation#){:target="_blank"} - **Marco Altini**.
6. [Accuracy, Recall, Precision, F-Score & Specificity, which to optimize on?](https://towardsdatascience.com/accuracy-recall-precision-f-score-specificity-which-to-optimize-on-867d3f11124){:target="_blank"} - **Salma Ghoneim**, *Towards Data Science*.



