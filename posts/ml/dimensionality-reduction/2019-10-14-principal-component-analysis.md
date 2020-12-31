---
layout: post
title: "Principal Component Analysis (PCA)"
tags: [Machine Learning, Dimensionality Reduction]
toc: true
icon: /img/cats/ml.svg
keywords: pca Dimensionality Reduction compress data dimensional reduction speed up algorithms or to visualize data feature selection Feature projection mean variance covariance eigenvalues covariance matrix eigenvectors explained_variance_ratio_ Whitening Image compression Luis Serrano Tiep Vu Jake VanderPlas UFLDL - Stanford Shankar Muthuswamy
---

{% assign img-url = '/img/post/ML/dim_redu' %}

👉 Note: [UMAP & t-SNE](/umap-t-SNE/).

## What?

Sometimes we need to "compress" our data to speed up algorithms or to visualize data. One way is to use [**dimensionality reduction**](/tags/dimensionality-reduction/) which is the process of reducing the number of random variables under consideration by obtaining a set of principal variables. We can think of 2 approaches:

- **Feature selection**: find a subset of the input variables.
- **Feature projection** (also *Feature extraction*): transforms the data in the high-dimensional space to a space of fewer dimensions. **PCA** is one of the methods following this approach.

![An idea of using PCA from 2D to 1D.]({{img-url}}/pca-1.jpg){:.img-full-90 .pop}
***Figure 1.** An idea of using PCA from 2D to 1D.*

![An idea of using PCA from 5D to 2D.]({{img-url}}/pca-2.jpg){:.img-full-75 .pop}
***Figure 2.** An idea of using PCA from 5D to 2D.*

::: warning
❓ **Questions**{:.tbrown}: How can we choose the **green arrows**{:.tgreen} like in Figure 1 and 2 (their **directions** and their **magnitudes**)?
:::

From a data points, there are many ways of projections, for examples,

![An example of different projections.]({{img-url}}/pca-4.jpg){:.img-full-75 .pop}
***Figure 3.** We will project the points to the green line or the violet line? Which one is the best choice?*

Intuitively, the green line is ==better with more separated points==. But how can we choose it "mathematically" (precisely)? We need to know about:

- **[Mean](/mean-median-mode)**: finds the most balanced point in the data.
- **[Variance](/variance-covariance-correlation)**: measures the spread of data from the mean. However, variance is not enough. There are many different ways in that we get the same variance.
- **[Covariance](/variance-covariance-correlation)**: indicates the direction in that data are spreading.

{% hsbox "An example of the same mean and variance but different covariance." %}
![Different data but the same mean and variance.]({{img-url}}/pca-5.jpg){:.img-full-100 .pop}
***Figure 4.** Different data but the same mean and variance. That's why we need covariance!*
{% endhsbox %}

### Algorithm

1. Subtract the mean to move to the original axes.
2. From the original data (a lot of features $x_1, x_2, \ldots, x_N$), we construct a **covariance matrix $U$**.
2. Find the **eigenvalues**{:.tbrown} $\lambda_1, \lambda_2,\ldots$ and correspondent **eigenvectors** $v_1, v_2, \ldots$ of that matrix (we call them **eigenstuffs**). Choose $K < N$ couples $\lambda$ and $v$ (the highest eigenvalues) and we get a reduced matrix *$U_K$*.
3. Projection original data points to the $K$-dimensional plane created based on these new *eigenstuffs*. This step creates new data points on a new dimensional space ($K$).

    $$Z = U_K^TX$$
4. Now, instead of solving the original problem ($N$ features), we only need to solve a new problem with $K$ features ($K<N$).

![A big picture of the idea of PCA algorithm.]({{img-url}}/pca-3.jpg){:.img-full-100 .pop}
_**Figure 5.** A big picture of the idea of PCA algorithm. "Eigenstuffs" are eigenvalues and eigenvectors. [Source](https://www.youtube.com/watch?v=g-Hb26agBFg)._

## Code

~~~ python
from sklearn.decomposition import PCA

s = np.array([...])
pca = PCA(n_components=150, whiten=True, random_state=42)
# pca.fit(s)
s1 = pca.fit_transform(s)

print (pca.components_) # eigenvectors
print (pca.explained_variance_) # eigenvalues
~~~

Some notable components (see [full](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)):

- `pca.fit(X)`: only fit `X` (and then we can use `pca` for other operations).
- `pca.fit_transform(X)`: Fit the model with `X` and apply the dimensionality reduction on `X` (from `(n_samples, n_features)` to `(n_samples, n_components)`).
- `pca.inverse_transform(s1)`: transform `s1` back to original data space (2D) - not back to `s`!!!
- `pca1.mean_`: mean point of the data.
- `pca.components_`: eigenvectors (`n_components` vectors).
- `pca.explained_variance_`: eigenvalues. It's also the amount of retained variance which is corresponding to **each** components.
- `pca.explained_variance_ratio_`: the **percentage** in that variance is retained if we consider on **each** component.

Some notable parameters:

- `n_components=0.80`: means it will return the Eigenvectors that have the 80% of the variation in the dataset.

::: warning
When choosing the number of principal components ($K$), we choose $K$ to be the smallest value so that for example, $99\%$ of variance, is retained.{% ref "https://stackoverflow.com/questions/32857029/python-scikit-learn-pca-explained-variance-ratio-cutoff" %}

In [Scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html), we can use `pca.explained_variance_ratio_.cumsum()`. For example, `n_components = 5` and we have,

~~~ python
[0.32047581  0.59549787  0.80178824  0.932976    1.]
~~~

then we know that with $K=4$, we would retain $93.3\%$ of the variance.
:::

### Whitening

Whitening makes the features:

- less correlated with each other,
- all features have the same variance (or, unit component-wise variances).

![An illustration of whitening.]({{img-url}}/pca-6.jpeg){:.img-full-100 .pop}
_PCA / Whitening. **Left**: Original toy, 2-dimensional input data. **Middle**: After performing PCA. The data is centered at zero and then rotated into the eigenbasis of the data covariance matrix. This decorrelates the data (the covariance matrix becomes diagonal). **Right**: Each dimension is additionally scaled by the eigenvalues, transforming the data covariance matrix into the identity matrix. Geometrically, this corresponds to stretching and squeezing the data into an isotropic gaussian blob._


If this section doesn't satisfy you, read [this](http://ufldl.stanford.edu/tutorial/unsupervised/PCAWhitening/#whitening) and [this](http://cs231n.github.io/neural-networks-2/) (section *PCA and Whitening*).

## PCA in action

- **Example to understand the idea of PCA**: [html file](/files/ml/pca/PCA_understanding_example.html) -- [open in colab](https://colab.research.google.com/drive/1F_A_fJOY-oiV7Ly4y_evF9sfwII-ljJK).

    - Plot points with 2 lines which are corresponding to 2 eigenvectors.
    - Plot & choose Principal Components.
    - An example of choosing `n_components` $K$.
    - Visualization hand-written digits (the case of all digits and the case of only 2 digits -- 1 & 8).
    - Using [SVM](/support-vector-machine) to classifier data in the case of 1 & 8 and visualize the decision boundaries.

- **Image compression**: [html file](/files/ml/pca/PCA-image-compression.html) -- [open in colab](https://colab.research.google.com/drive/1G_WPZMmQ020kjSmqMI_k21_zLDrPlYtg).

    - When input is an image, the values of adjacent pixels are *highly correlated*.
    - Import images from `scipy` and Google Drive or Github (with `git`).
    - Compress grayscale images and colored ones.
    - Plot a grayscale version of a colorful images.
    - Save output to file (Google Drive).
    - Fix warning *Lossy conversion from float64 to uint8. Range [...,...]. Convert image to uint8 prior to saving to suppress this warning.*
    - Fix warning *Clipping input data to the valid range for imshow with RGB data ([0..1] for floats or [0..255] for integers)*.
    - Calculate a size (in `KB`) of a image file.

- **PCA without scikit-learn**: [html file](/files/ml/pca/PCA_without_scikit_learn.html) -- [open in colab](https://colab.research.google.com/drive/1IWMuon3NSpGybmnBBWxlvbS9yUjxtf_8).

## References

- **Luis Serrano** -- [Video] [Principal Component Analysis (PCA)](https://www.youtube.com/watch?v=g-Hb26agBFg). It's very intuitive!
- **Stats.StackExchange** -- [Making sense of principal component analysis, eigenvectors & eigenvalues](https://stats.stackexchange.com/questions/2691/making-sense-of-principal-component-analysis-eigenvectors-eigenvalues).
- **Scikit-learn** -- [PCA official doc](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html).
- **Tiep Vu** -- *Principal Component Analysis*: [Bài 27](https://machinelearningcoban.com/2017/06/15/pca/) and [Bài 28](https://machinelearningcoban.com/2017/06/21/pca2/).
- **Jake VanderPlas** -- [In Depth: Principal Component Analysis](https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html).
- **Tutorial 4 Yang** -- [Principal Components Analysis](/files/ml/pca/tutorial4-yang.pdf).
- **Andrew NG.** -- [My raw note](https://rawnote.dinhanhthi.com/machine-learning-coursera-8#principal-component-analysis-pca) of the course ["Machine Learning" on Coursera](https://www.coursera.org/learn/machine-learning/).
- **Shankar Muthuswamy** -- [Facial Image Compression and Reconstruction with PCA](https://shankarmsy.github.io/posts/pca-sklearn.html).
- **UFLDL - Stanford** -- [PCA Whitening](http://ufldl.stanford.edu/tutorial/unsupervised/PCAWhitening/).





