---
layout: post
title: "Small projects for understanding concepts"
tags: [Project-based Learning, Collection]
notfull: 1
toc: false
icon: /img/cats/project.svg
keywords: "Image compression K-Means PCA google drive github Lossy conversion Clipping input data to the valid range for imshow Face Recognition SVM XOR problem k means principal component analysis supoprt vector machine digit face Lossy conversion pipeline"
---

{% assign img-url = '/img/post/project/' %}

::: success
This note will always be updated.
:::


🔅 **Image compression using [K-Means]({{site.url}}{{site.baseurl}}/k-means-clustering)** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/K_Means_image_compression.html) -- [Open in Colab](https://colab.research.google.com/github/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/K_Means_image_compression.ipynb).
  - Load and write an image from/to Google Drive.
  - Change the image's size from `(height, weight, channels)` to `(height x weight, channels)`
  - Reduce the image's quality using smaller number of clusters.

🔅 **Example to understand the idea of [PCA]({{site.url}}{{site.baseurl}}/principal-component-analysis)** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/PCA_understanding_example.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/PCA_understanding_example.ipynb).
  - Plot points with 2 lines which are corresponding to 2 eigenvectors.
  - Plot & choose Principal Components.
  - An example of choosing `n_components` $K$.
  - Visualization hand-written digits (the case of all digits and the case of only 2 digits -- 1 & 8).
  - Using [SVM](/support-vector-machine) to classifier data in the case of 1 & 8 and visualize the decision boundaries.

🔅 **Image compression using [PCA]({{site.url}}{{site.baseurl}}/principal-component-analysis)** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/PCA-image-compression.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/PCA-image-compression.ipynb).
  - When input is an image, the values of adjacent pixels are *highly correlated*.
  - Import images from `scipy` and Google Drive or Github (with `git`).
  - Compress grayscale images and colored ones.
  - Plot a grayscale version of a colorful images.
  - Save output to file (Google Drive).
  - Fix warning *Lossy conversion from float64 to uint8. Range [...,...]. Convert image to uint8 prior to saving to suppress this warning.*
  - Fix warning *Clipping input data to the valid range for imshow with RGB data ([0..1] for floats or [0..255] for integers)*.
  - Calculate a size (in `KB`) of a image file.

🔅 **[PCA]({{site.url}}{{site.baseurl}}/principal-component-analysis) without scikit-learn** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/PCA_without_scikit_learn.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/PCA_without_scikit_learn.ipynb).

🔅 **Face Recognition using [SVM]({{site.url}}{{site.baseurl}}/support-vector-machine)** -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/SVM-face-recognition.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/SVM-face-recognition.ipynb).
  - Using PCA to extract 150 fundamental components to feed into our SVG classifier.
  - Grid search cross-validation to explore combinations of parameters (`gamma` and `C`).
  - Classification report: precision, recall, f1-score, support.
  - Confusion matrix.
  - An example of using `pipeline`.

🔅 **XOR problem using [SVM]({{site.url}}{{site.baseurl}}/support-vector-machine)** to see the effect of `gamma` and `C` in the case of using RBF kernel -- [Open in HTML](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/notebook_in_html/SVM-XOR-RBF-kernel-parameters.html) -- [Open in Colab](https://colab.research.google.com/dinhanhthi/data-science-learning/blob/master/projects/mini-projects/SVM-XOR-RBF-kernel-parameters.ipynb).