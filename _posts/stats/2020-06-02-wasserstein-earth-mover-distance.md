---
layout: post
title: "Earth mover’s distance"
categories: [probability & statistics]
tags: ['distribution', distance]
katex: 1
notfull: 1
keywords: "compare distribution CDF Earth mover's distance earth mover Wasserstein Distance Kolmogorov test ks test EMD"
---

{% assign img-url = '/img/post/stats' %}

{% include toc.html %}

{% katexmm %}

## What (general)?

- In statistics, the earth mover's distance (EMD) is a <mark>measure of the distance between two probability distributions</mark> over a region D.{% ref https://en.wikipedia.org/wiki/Earth_mover%27s_distance %}
- In stats or computer science, it's "_Earth mover's distance_".
- In maths, it's "_Wasserstein metric_"
- <mark>The Wasserstein distance is the minimum cost of transporting mass in converting the data distribution q to the data distribution p.</mark>

## What (math way)?

The idea borrowed from [this](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.wasserstein_distance.html). The first Wasserstein distance between the distributions $u$ and $v$ is:

$$
l_1 (u, v) = \inf_{\pi \in \Gamma (u, v)} \int_{\mathbb{R} \times
        \mathbb{R}} |x-y| \mathrm{d} \pi (x, y)
$$

where $\Gamma(u,v)$ is the set of (probability) distributions on $\mathbb{R}\times \mathbb{R}$ whose marginals are  and  on the first and second factors respectively.

If $U$ and $V$ are the respective CDFs of $u$ and $v$, this distance also equals to:

$$
l_1(u, v) = \int_{-\infty}^{+\infty} |U-V|
$$


## Example of metric

Suppose we wanna move the blocks on the left to dotted-blocks on the right, we wanna find the "energy" (or metric) to do that.

{:.text-center}
_Energy = $\Sigma$ weight of block x distance to move that block_.

Suppose that weight of each block is 1. All below figures are copied from [this](https://medium.com/@jonathan_hui/gan-wasserstein-gan-wgan-gp-6a1a2aa1b490).

{:.img-50}
![EMD example]({{img-url}}/emd_1.png)

There are 2 ways to do that,

{:.img-50}
![EMD example]({{img-url}}/emd_2.jpeg)
_2 ways of moving blocks from left to right._

Above example gives the same energies ($42$) but there are usually different as below example,

{:.img-50}
![EMD example]({{img-url}}/emd_3.png)

## Coding

``` python
from scipy.stats import wasserstein_distance
```

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
``` python
arr1 = [1,2,3,4,5,6]
arr2 = [1,2,3,4,5,6]
wasserstein_distance(arr1, arr2)
```

{:.output.flex-fill.d-flex}
``` bash
0.0
# they are exactly the same!
```
</div>

<div class="columns-2" markdown="1">
``` python
arr1 = [1,2,3]
arr2 = [4,5,6]
wasserstein_distance(arr1, arr2)
# 3.0000000000000004

import seaborn as sns
sns.distplot(arr1, kde=False, hist_kws={"histtype": "step", "linewidth": 3, "alpha": 1, "color": "b"})
sns.distplot(arr2, kde=False, hist_kws={"histtype": "step", "linewidth": 3, "alpha": 1, "color": "r"})
```

{:.img-100}
![EMD example]({{img-url}}/emd_4.jpg)
</div>

## References

- [What is an intuitive explanation of the Wasserstein distance?](https://www.quora.com/What-is-an-intuitive-explanation-of-the-Wasserstein-distance)
- [GAN — Wasserstein GAN & WGAN-GP](https://medium.com/@jonathan_hui/gan-wasserstein-gan-wgan-gp-6a1a2aa1b490)
- [An example](https://www.youtube.com/watch?v=U7xdiGc7IRU) of why we need to use EMD instead of [Kolmogorov–Smirnov distance](/KS-test) (video).

{% endkatexmm %}