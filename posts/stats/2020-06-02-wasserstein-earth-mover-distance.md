---
layout: post
title: "Earth mover’s distance"
toc: true
tags: [Prob & Stats]
icon: /img/cats/stats.svg
notfull: 1
keywords: "compare distribution CDF Earth mover's distance earth mover Wasserstein Distance Kolmogorov test ks test EMD"
---

{% assign img-url = '/img/post/stats' %}

## What (general)?

- In statistics, the earth mover's distance (EMD) is a <mark>measure of the distance between two probability distributions</mark> over a region D.{% ref "https://en.wikipedia.org/wiki/Earth_mover%27s_distance" %}
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

_Energy = $\Sigma$ weight of block x distance to move that block_.{:.text-center}

Suppose that weight of each block is 1. All below figures are copied from [this](https://medium.com/@jonathan_hui/gan-wasserstein-gan-wgan-gp-6a1a2aa1b490).

![EMD example]({{img-url}}/emd_1.png){:.img-50}

There are 2 ways to do that,

![EMD example]({{img-url}}/emd_2.jpeg){:.img-50}
_2 ways of moving blocks from left to right._

Above example gives the same energies ($42$) but there are usually different as below example,

![EMD example]({{img-url}}/emd_3.png){:.img-50}

## Coding

``` python
from scipy.stats import wasserstein_distance
```

::: code-output-equal
``` python
arr1 = [1,2,3,4,5,6]
arr2 = [1,2,3,4,5,6]
wasserstein_distance(arr1, arr2)
```

``` bash
0.0
# they are exactly the same!
```
:::

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

![EMD example]({{img-url}}/emd_4.jpg){:.img-100}
</div>

## References

- [What is an intuitive explanation of the Wasserstein distance?](https://www.quora.com/What-is-an-intuitive-explanation-of-the-Wasserstein-distance)
- [GAN — Wasserstein GAN & WGAN-GP](https://medium.com/@jonathan_hui/gan-wasserstein-gan-wgan-gp-6a1a2aa1b490)
- [An example](https://www.youtube.com/watch?v=U7xdiGc7IRU) of why we need to use EMD instead of [Kolmogorov–Smirnov distance](/KS-test) (video).