---
layout: post
title: "Support Vector Machine (SVM)"
tags: [Machine Learning, Classification]
toc: true
icon: svm.webp
keywords: Maximum Margin Classifier hyperplane geometry margin hard margin soft margin quadratic programming dual form Lagrange multipliers kernal trick Mercer conditions linear kernel gaussian kernel RBF Radial Basic Function Exponential kernel Polynomial kernel Hybrid kernel Sigmoidal Andrew NG Face detection Detecting spam outliers detection Text and hypertext categorization Bioinformatics Regularization parameter parameter C gamma XOR problem Face Recognition Tiep Vu Simplilearn Jeremy Kun Jake VanderPlas Chris Albon
---

{% assign img-url = '/img/post/ML/support-vector-machine' %}

## What's the idea of SVM?

SVM (also called *Maximum Margin Classifier*) is an algorithm that takes the data as an input and outputs a line/hyperplane that separates those classes if possible.

Suppose that we need to separate two classes of a dataset. The task is to ==find a line to separate them==. However, there are many lines which can do that (countless number of lines). How can we choose the best one?

![An idea of support vectors and SVM.]({{img-url}}/svm-1.jpg){:.img-full-90 .pop}
*An idea of support vectors (samples on the margin) and SVM (find the optimal hyperplane).*

{% hsbox "More mathematical details on finding a hyperplane" %}

We need to find a hyperplane $(H)$: $\mathbf{w}^T\mathbf{x} + b = 0$ where the weights $\mathbf{w}=(w_1,\ldots,w_d)$ and a point $\mathbf{x}=(x_1,\ldots,x_d)$. For example, in 2D ($d=2$), we need to find a hyperplane $w_1x_1 + w_2x_2 + b=0$. Note also that, the distance between a point $\mathbf{x}_0$ and $(H)$ is given by,

$$
\text{d}(\mathbf{x}_0, H) = \frac{\vert\mathbf{w}^T\mathbf{x}_0 + b\vert}{\Vert\mathbf{w}\Vert_2}, \quad (1)
$$

where $\Vert\mathbf{w}\Vert_2 = \sqrt{\sum_{i=1}^d w_i^2}$.

In order to understand the idea, we consider a 2D case with the classification of 2 classes (blue faces  are numbered as "$+1$" and orange faces are numbered as "$-1$").

![Finding a hyperplane.]({{img-url}}/svm-6.jpg){:.img-full-50}
*We need to find an optimal hyperplane between 2 classes (find $w_1, w_2$ and $b$).*

Recall that a **margin** (*geometric margin*) is the minimum distance between a hyperplane and the closest point(s) to it. Thanks to $(1)$, we can find the margin to a hyperplane by determining the closet distance from an arbitrary points $(\mathbf{x}_i, y_i)$ to that hyperplane via,

$$
\text{margin} = \min_i \frac{y_i(\mathbf{w}^T\mathbf{x}_i + b)}{||\mathbf{w}||_2}. \quad (2)
$$

Note that, because $y_i$ takes values $-1$ or $+1$ and it always has the same sign as $\mathbf{w}^T\mathbf{x}_i + b$, $y_i(\mathbf{w}^T\mathbf{x}_i + b)$ is always positive.

The SVM problem is to find ($\mathbf{w}, b$) so that the *hard-margin* $(2)$ has the maximum value, i.e.,

$$
\begin{aligned}
(\mathbf{w}, b)
&= \arg \max_{\mathbf{w}, b} \left(
    \min_i \frac{y_i(\mathbf{w}^T\mathbf{x}_i + b)}{\Vert\mathbf{w}\Vert_2}
\right)\\
&= \arg \max_{\mathbf{w}, b}\left(
    \frac{1}{\Vert\mathbf{w}\Vert_2} \min_i y_i(\mathbf{w}^T\mathbf{x}_i + b)
\right)
\end{aligned} \quad (3)
$$

($\arg$ means you need to find $\mathbf{w},b$ so that the function reaches the $\max$.)

This is an optimal problem. Another remark is that we can multiply both sides of $(H)$ by any real number $k\ne 0$, we obtain the same $(H)$. With that reason, we can suppose that,

$$
y_i(\mathbf{w}^T\mathbf{x}_i + b) = 1,
$$

for all points on the hyperplane, and the problem $(3)$ becomes,

$$
\begin{aligned}
    &(\mathbf{w}, b) = \arg\max_{\mathbf{w}, b} \frac{1}{\Vert\mathbf{w}\Vert_2}   \\
    \text{subject to} &~~ y_i(\mathbf{w}^T\mathbf{x}_i + b) \geq 1, \forall i = 1, 2, \dots, N.
\end{aligned}
$$

The second line due to the fact that the closet points have distance $1$ to the hyperplane, the other points have distance greater than $1$. We can write above problem as,

$$
\begin{aligned}
    &(\mathbf{w}, b) = \arg\min_{\mathbf{w}, b} \frac{1}{2}\Vert\mathbf{w}\Vert_2^2   \\
    \text{subject to} &~~ y_i(\mathbf{w}^T\mathbf{x}_i + b)-1 \geq 0, \forall i = 1, 2, \dots, N.
\end{aligned} \quad (4)
$$

This is called "*primal formulation of linear SVMs*". In mathematical optimization, one can prove that the problem $(4)$ has an unique solution (We can get an unique hyperplane $(H)$ which satisfies the classification problem). Such problems are generally called [quadratic programming](https://en.wikipedia.org/wiki/Quadratic_programming) problems.

Problem $(4)$ can be solved "more easily" by considering its [dual formulation](https://en.wikipedia.org/wiki/Duality_(optimization)). Apply the method of [Lagrange multipliers](https://en.wikipedia.org/wiki/Lagrange_multiplier), we define a Lagrangian,

$$
\Lambda(\mathbf{w},b,\lambda) = \dfrac{1}{2}\Vert \mathbf{w}\Vert_2^2 - \sum_{i=1}^N \lambda_i(y_i(\mathbf{w}^T\mathbf{x}_i+b)-1),
$$

where $\mathbf{w}, \mathbf{x}_i$ are vectors with $d$ elements and $\lambda$ is a vector with $N$ elements. We need to minimize this Lagrangian w.r.t. $\mathbf{w}, b$ and simultaneously require that the derivative w.r.t. $\lambda$ vanishes,  all subject to the constraints that $\lambda_i \ge 0$. If we set the derivatives w.r.t. $\mathbf{w}, b$, we obtain,

$$
\begin{aligned}
\dfrac{\partial \Lambda(\mathbf{w},b,\lambda)}{\partial b} &= 0 \Rightarrow \sum_{i=1}^N\lambda_iy_i=0, \\
\dfrac{\partial \Lambda(\mathbf{w},b,\lambda)}{\partial \mathbf{w}} &= 0 \Rightarrow \mathbf{w}=\sum_{i=1}^N\lambda_iy_i\mathbf{x}_i.
\end{aligned}
$$

We substitute the above into the equation for $\Gamma(\mathbf{w},b,\lambda)$ and obtain "*dual formulation of linear SVMs*",

$$
\begin{aligned}
    &\lambda = \arg\max_{\lambda} \left( \sum_{i=1}^N \lambda_i  -\frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N \lambda_i\lambda_j y_i y_j \mathbf{x}_i^T\mathbf{x}_j \right)  \\
    \text{subject to} &~~ \lambda_i \ge 0, \sum_{i=1}^N\lambda_iy_i = 0, ~\forall i=1,\ldots,N.
\end{aligned} \quad (5)
$$

in that, $\mathbf{w}$ is defined in terms of $\lambda_i$: $\mathbf{w} = \sum_1^N\lambda_iy_i\mathbf{x}_i$ and the solution becomes

$$
f(\mathbf{x})=\text{sign}(\Sigma_1^N\lambda_iy_i\mathbf{x}_i^T\mathbf{x}_j + b).
$$

Then given a new instance $\mathbf{x}$, the classifier is,

$$
f(\mathbf{x})=\text{sign}(\mathbf{w}^T\mathbf{x} + b).
$$

The benefits of using dual formulation are:<sup>[\[ref, slide 52\]](/files/ml//svm-without-tears.pdf)</sup>

- No need to access original data, need to access only dot products $\mathbf{x}_i^T\mathbf{x}_j$.
- Number of free parameters is bounded by the number of support vectors and not by the number of variables
(beneficial for high-dimensional problems).

Read more in [this post](https://machinelearningcoban.com/2017/04/09/smv/#-bai-toan-doi-ngau-cho-svm) (Vietnamese), [this slide](/files/ml//svm-without-tears.pdf) or [this post](/files/ml/Duality_for_the_SVM.pdf).

{% endhsbox %}

## Using SVM with kernel trick

Most of the time, we cannot separate classes in the current dataset easily (not linearly separable data). We need to use **kernel trick** first (==transform from the current dimension to a higher dimension==) and then we use SVM. These classes are not linearly separable.

![An idea of kernel and SVM (1D to 2D).]({{img-url}}/svm-2.jpg){:.img-full-85 .pop}
*An idea of kernel and SVM. Transform from 1D to 2D. Data is not linearly separable in the **input space** but it is linearly separable in the **feature space** obtained by a kernel.*

![An idea of kernel and SVM (2D to 3D).]({{img-url}}/svm-3.jpg){:.img-full-85 .pop}
*An idea of kernel and SVM. Transform from 2D to 3D. Data is not linearly separable in the **input space** but it is linearly separable in the **feature space** obtained by a kernel.*

{% hsbox "More mathematical details" %}

Original data $\mathbf{x}$ (in input space),<sup>[\[ref, slide 59\]](/files/ml//svm-without-tears.pdf)</sup>

$$
\begin{aligned}
f(\mathbf{x}) =\text{sign}(\mathbf{w}^T\mathbf{x} + b), \quad
\mathbf{w} =\sum_{i=1}^N\lambda_iy_i\mathbf{x}_i
\end{aligned}
$$

Data in a higher dimensional feature space $\Phi(\mathbf{x})$,

$$
\begin{aligned}
f(\mathbf{x}) =\text{sign}(\mathbf{w}^T\Phi(\mathbf{x}) + b), \quad
\mathbf{w} =\sum_{i=1}^N\lambda_iy_i\Phi(\mathbf{x}_i)
\end{aligned}
$$

We can rewrite $f(\mathbf{x})$ as,

$$
f(\mathbf{x}) =\text{sign} \left( \sum_{i=1}^N\lambda_iy_i\Phi(\mathbf{x}_i)^T\Phi(\mathbf{x}) + b \right),
$$

or,

$$
\begin{aligned}
f(\mathbf{x}) &=\text{sign}(\sum_{i=1}^N\lambda_iy_iK(\mathbf{x}_i,\mathbf{x}) + b), \\
K(\mathbf{x}_i,\mathbf{x}) &= \Phi(\mathbf{x}_i)^T\Phi(\mathbf{x}).
\end{aligned}
$$

Therefore, we do not need to know $\Phi$ explicitly, we just need to define a *kernel function* $K(\cdot,\cdot): \mathbb{R}^d\times \mathbb{R}^d \to \mathbb{R}$. However, not every function $\mathbb{R}^d\times \mathbb{R}^d \to \mathbb{R}$ can be a valid kernel. It has to satisfy so-called [Mercer conditions](https://en.wikipedia.org/wiki/Mercer%27s_theorem#Mercer's_condition). Otherwise, the underlying quadratic program may not be solvable.

{% endhsbox %}

==A **kernel** is a dot product== in some feature space:

$$
K(\mathbf{x}_i, \mathbf{x}_j) = \Phi(\mathbf{x}_i, \mathbf{x}_j).
$$

It also measures **the similarity** between two points $\mathbf{x}_i$ and $\mathbf{x}_j$.

We have some popular kernels,

- **Linear kernel**: $K(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{x}_i \cdot \mathbf{x}_j$. We use `kernel = 'linear'` in [`sklearn.svm.SVM`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html#sklearn.svm.SVC). Linear kernels are rarely used in practice.
- **Gaussian kernel** (or ***Radial Basic Function* -- RBF**): $K(\mathbf{x}_i, \mathbf{x}_j) = \exp(-\gamma\Vert \mathbf{x}_i - \mathbf{x}_j \Vert^2)$. It's used the most. We use `kernel = 'rbf'` (default) with keyword `gamma` for $\gamma$ (must be greater than $0$) in [`sklearn.svm.SVM`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html#sklearn.svm.SVC).
- **Exponential kernel**: $K(\mathbf{x}_i, \mathbf{x}_j) = \exp(-\gamma\Vert \mathbf{x}_i - \mathbf{x}_j \Vert)$.
- **Polynomial kernel**: $K(\mathbf{x}_i, \mathbf{x}_j) = (r+\gamma\mathbf{x}_i \cdot \mathbf{x}_j)^d$. We use `kernel = 'poly'` with keyword `degree` for $d$ and `coef0` for $r$ in [`sklearn.svm.SVM`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html#sklearn.svm.SVC). It's more popular than RBF in NLP. The most common degree is $d = 2$ (quadratic), since larger degrees tend to overfit on NLP problems.<sup>[\[ref\]](https://en.wikipedia.org/wiki/Polynomial_kernel)</sup>
- **Hybrid kernel**: $K(\mathbf{x}_i, \mathbf{x}_j) = (p+\mathbf{x}_i \cdot \mathbf{x}_j)^q\exp(-\gamma\Vert \mathbf{x}_i - \mathbf{x}_j \Vert^2)$.
- **Sigmoidal**: $K(\mathbf{x}_i, \mathbf{x}_j) = \tanh(\gamma\mathbf{x}_i \cdot \mathbf{x}_j+r)$. We use `kernel = 'sigmoid'` with keyword `coef0` for $r$ in [`sklearn.svm.SVM`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html#sklearn.svm.SVC).

We can also define a custom kernel thanks to [this help](https://scikit-learn.org/stable/modules/svm.html#custom-kernels).

::: success
Choose whatever kernel performs best on cross-validation data. Andrew NG said in his ML course.
:::

{% hsbox "Examples of choosing a kernel" %}

![SVM in XOR problem.]({{img-url}}/svm-8.jpg){:.img-full-90 .pop}
*Using SVM with 3 different kernels in a [XOR problem](https://en.wikipedia.org/wiki/Exclusive_or). In this case, Gaussian kernel is the choice.<sup>[\[ref\]](https://machinelearningcoban.com/2017/04/22/kernelsmv/#4-v%C3%AD-d%E1%BB%A5-minh-h%E1%BB%8Da)</sup>*

![In the case of almost linearly separable data.]({{img-url}}/svm-9.jpg){:.img-full-90 .pop}
*Using SVM with 3 different kernels in the case of **almost linearly** separable data. In this case, Polynomial kernel is the choice.*

{% endhsbox %}

## Good or Bad?

**Advantages**:

{:.indent}
- Compared to both logistic regression and NN, a SVM sometimes gives a cleaner way of learning ==non-linear functions==.
- SVM is better than NN with 1 layer (Perceptron Learning Algorithm) thanks to the largest margin between 2 classes.
- Accurate in ==high-dimensional spaces== + ==memory effecient==.
- Good accuracy and perform ==faster== prediction compared to ==Naïve Bayes algorithm==.<sup>[\[ref\]](https://www.datacamp.com/community/tutorials/svm-classification-scikit-learn-python#advantages)</sup>

**Disadvantages**:

{:.indent}
- Prone to ==overfitting==: if number of features are larger than number of samples.
- Don't provide probability estimation.
- ==Not efficient== if your ==data is very big==!
- It works poorly with overlapping classes
- Sensitive to the type of kernel used.


## SVM used for?

Some points:<sup>[\[re\]](https://www.youtube.com/watch?time_continue=21&v=TtKF996oEl8)</sup>

{:.indent}
- Classification, regression and outliers detection.
- Face detection.
- Text and hypertext categorization.
- Detecting spam.
- Classification of images.
- Bioinformatics.

## Using SVM with Scikit-learn

~~~ python
from sklearn.svm import SVC

svc = SVC(kernel='linear') # default = 'rbf' (Gaussian kernel)
# other kernels: poly, sigmoid, precomputed or a callable

svc = svc.fit(X, y)
svc.predict(X)

# gives the support vectors
svc.support_vectors_
~~~

There are [other parameters](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html#sklearn.svm.SVC) of `sklearn.svm.SVM`.

::: warning
In the case of **linear SVM**, we can also use `sklearn.svm.LinearSVC`. It's similar to `sklearn.svm.SVG` with `kernel='linear'` but implemented in terms of `liblinear` rather than `libsvm`, so it has more flexibility in the choice of penalties and loss functions and should scale better to large numbers of samples.<sup>[\[ref\]](https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVC.html)</sup>
:::

### Meaning of some parameters

**The Regularization parameter** (`C`, default `C=1.0`): if `C` is larger, hyperplane has smaller margin but do a better job of classification and otherwise. This is how you can control the trade-off between decision boundary and misclassification term.

{:.indent}
- **Higher values** of `C` $\Rightarrow$ a higher possibility of ==overfitting==, the softmargin SVM is equivalent to the hard-margin SVM.
- **Lower values** of `C` $\Rightarrow$ a higher possibility of ==underfitting==. We admit misclassifications in the training data

We use this in the case of *not linearly separable data*; It's also called **soft-margin linear SVM**.

![The Regularization parameter.]({{img-url}}/svm-4.jpg){:.img-full-85 .pop}
*An illustration of using `C`.*

![The Regularization parameter.]({{img-url}}/svm-7.jpg){:.img-full-100 .pop}
*An illustration of using `C`. Bigger `C`, smaller margin.<sup>[\[ref\]](https://machinelearningcoban.com/2017/04/13/softmarginsmv/)</sup>*

{% hsbox "More mathematical details on $C$ and soft-margin problems" %}

Recall that the *hard-margin* problem is,

$$
\begin{aligned}
    &(\mathbf{w}, b) = \arg \min_{\mathbf{w}, b} \frac{1}{2}\Vert\mathbf{w}\Vert_2^2   \\
    \text{subject to} &~~ y_i(\mathbf{w}^T\mathbf{x}_i + b) -1 \geq 0, \forall i = 1, 2, \dots, N.
\end{aligned} \quad (4~\text{revisited})
$$

and its duality is,

$$
\begin{aligned}
    &\lambda = \arg\max_{\lambda} \left( \sum_{i=1}^N \lambda_i  -\frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N \lambda_i\lambda_j y_i y_j \mathbf{x}_i^T\mathbf{x}_j \right)  \\
    \text{subject to} &~~ \lambda_i \ge 0, \sum_{i=1}^N\lambda_iy_i = 0, ~\forall i=1,\ldots,N.
\end{aligned} \quad (5~\text{revisited})
$$

Instead of considering a *hard-margin* $(4)$, we consider following *soft-margin* problem (with the addition of *slack variables*)

<div class="columns-2">

![The slack variables.]({{img-url}}/ssvm3.png){:.img-full-100 .pop}
*An introduction to slack variables.<sup>[\[ref\]](https://machinelearningcoban.com/2017/04/13/softmarginsmv/)</sup>*

$$
\begin{aligned}
    &(\mathbf{w}, b, \xi) = \arg\min_{\mathbf{w}, b, \xi} \left( \frac{1}{2}{\Vert\mathbf{w}\Vert_2^2} + C \sum_{i=1}^N \xi_i \right)  \\
    \text{subject to} &~~ y_i(\mathbf{w}^T\mathbf{x}_i + b) \geq 1 - \xi_i, \forall i = 1, \dots, N \\
    &~~ \xi_i \leq 0,  ~\forall i = 1, 2, \dots, N
\end{aligned}
$$
</div>

With these new slack variables, we have to decide the trade-off between maximizing the margin (term $\frac{1}{2}\Vert \mathbf{w}\Vert_2^2$) and minimizing the mistakes (term $C\Sigma_1^n\xi_i$).

When $C$ is big, the term $\frac{1}{2}\Vert \mathbf{w}\Vert_2^2$ is almost considered as $0$ in the minimized problem and the problem focuses on minimizing the term $C\Sigma_1^n\xi_i$ (avoiding misclassification). That's why the margin looks more narrow in the case of bigger $C$.

A dual formulation of above soft-margin problem is,

$$
\begin{aligned}
    &\lambda = \arg\max_{\lambda} \left( \sum_{i=1}^N \lambda_i  -\frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N \lambda_i\lambda_j y_i y_j \mathbf{x}_i^T\mathbf{x}_j \right)  \\
    \text{subject to} &~~ 0 \le \lambda_i \le C, \sum_{i=1}^N\lambda_iy_i = 0,~\forall i=1,\ldots,N.
\end{aligned} \quad (6)
$$

Note that, $(6)$ looks like $(5)$ (duality of hard-margin problem) but condition $0 \le \lambda_i \le C$.

{% endhsbox %}

**Gamma** (`gamma`, default `gamma='auto'` which uses `1/n_features`): determine the number of points to construct the hyperplane.

![The parameter gamma.]({{img-url}}/svm-5.jpg){:.img-full-90 .pop}
*An illustration of using `gamma`. In **high-gamma** case, we only consider points nearby the hyperplane, it may cause an ==overfitting==.*

![gamma parameter.]({{img-url}}/svm-10.jpg){:.img-full-90 .pop}
*==Bigger gamma==, more change to get ==overfitting== (in a XOR problem).*

{% hsbox "Understanding the idea of `gamma` in the Gaussian kernel" %}

We have another form of Gaussian kernel which is,

$$
K(\mathbf{x}_i, \mathbf{x}_j)
= \text{exp}\left( - \dfrac{\Vert \mathbf{x}_i - \mathbf{x}_j \Vert^2}{2\sigma^2}  \right),
$$

where $\sigma$ is the standard deviation which shows the spread of the data.

Compare to the one used in the scikit-learn, $K(\mathbf{x}_i, \mathbf{x}_j) = \exp(-\gamma\Vert \mathbf{x}_i - \mathbf{x}_j \Vert^2)$, we see that $\gamma$ is an inverse of $\sigma$. It implies,

- When $\sigma$ is bigger (or $\gamma$ is smaller), the similarity between two points $\mathbf{x}_i$ and $\mathbf{x}_j$ are considered in a wide range (spreading widely).
- Conversely, when $\sigma$ is smaller (or $\gamma$ is bigger), only two points $\mathbf{x}_i$ and $\mathbf{x}_j$ which are really near to each other will be considered to be similar. That's why we see there are many "groups" in the figure corresponding to $\gamma=100$. It leads to an overfitting problem.

{% endhsbox %}

## SVM in action

- **XOR problem** to see the effect of `gamma` and `C` in the case of using RBF kernel: [html file](/files/ml/svm/SVM-XOR-RBF-kernel-parameters.html) -- [open in colab](https://drive.google.com/file/d/1tvmwhMJiEB89Mo7m2oys0pcUwdgwPW5f/view?usp=sharing).
- **Face Recognition**<sup>[\[ref\]](https://jakevdp.github.io/PythonDataScienceHandbook/05.07-support-vector-machines.html)</sup>: [html file](/files/ml/svm/SVM-face-recognition.html) -- [open in colab](https://colab.research.google.com/drive/1n2mpRLGL_pyUvV7yJacnspEvDwBYz16A).

    <div ><div class="hsbox">
	<div class="hs__title">What's interesting?</div>
    <div class="hs__content">

    Some points:{% ref "https://jakevdp.github.io/PythonDataScienceHandbook/05.07-support-vector-machines.html" %}

    {:.indent}
    - We will use a principal component analysis to extract 150 fundamental components to feed into our support vector machine classifier.
    - Grid search cross-validation to explore combinations of parameters.
    - For a real-world facial recognition task, in which the photos do not come precropped into nice grids, the only difference in the facial classification scheme is the feature selection: you would need to use a more sophisticated algorithm to find the faces, and extract features that are independent of the pixellation. For this kind of application, one good option is to make use of [OpenCV](http://opencv.org/), which, among other things, includes pre-trained implementations of state-of-the-art feature extraction tools for images in general and faces in particular.
    - I generally only turn to SVMs once other simpler, faster, and less tuning-intensive methods have been shown to be insufficient for my needs. Nevertheless, if you have the CPU cycles to commit to training and cross-validating an SVM on your data, the method can lead to excellent results.
    </div>
    </div>

## References

- **Scikit-learn** -- [SVM official doc](https://scikit-learn.org/stable/modules/svm.html).
- **Simplilearn** -- [How Support Vector Machine Works \| SVM In Machine Learning](https://www.youtube.com/watch?time_continue=21&v=TtKF996oEl8).
- **Tiep Vu** -- [Bài 19: Support Vector Machine](https://machinelearningcoban.com/2017/04/09/smv/).
- **Jeremy Kun** -- [Formulating the Support Vector Machine Optimization Problem](https://jeremykun.com/2017/06/05/formulating-the-support-vector-machine-optimization-problem/).
- **Tiep Vu** -- [Bài 20: Soft Margin Support Vector Machine](https://machinelearningcoban.com/2017/04/13/softmarginsmv/).
- **Tiep Vu** - [Bài 21: Kernel Support Vector Machine](https://machinelearningcoban.com/2017/04/22/kernelsmv/).
- **Alexander Statnikov**, **Douglas Hardin**, **Isabelle Guyon**, **Constantin F. Aliferis** -- [A Gentle Introduction to Support Vector Machines in Biomedicine](/files/ml//svm-without-tears.pdf).
- **Jake VanderPlas** -- [In-Depth: Support Vector Machines](https://jakevdp.github.io/PythonDataScienceHandbook/05.07-support-vector-machines.html). -- Example: How to code and illustrate hyperplane and support vectors in Python?
- **Chris Albon** -- [Notes](https://chrisalbon.com/) about Support Vector Machines.
- **Andrew NG** -- [My raw note](https://mynote.dinhanhthi.com/machine-learning-coursera-7) when I learned [the course Machine Learning](https://www.coursera.org/learn/machine-learning/) on Coursera.