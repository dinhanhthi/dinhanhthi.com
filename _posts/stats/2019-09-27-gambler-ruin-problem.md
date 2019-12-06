---
layout: post
title: "Gamler Ruin Problem"
categories: [probability & statistics]
math: 1
---

{% assign img-url = '/img/post/stats' %}
{% assign file-url = '/files/stats' %}

Consider a gambler who starts with an initial fortune of $i$€ and then on each successive gamble
either wins $1$€ or loses $1$€ independent of the past with probabilities $p$ and $q = 1−p$ respectively. The gambler's objective is to reach a total fortune of $N$€, without first getting ruined (running out of money).

Let $P\_i$ be the probability that the gambler wins when starting with $i$€, we have

$$
\begin{align}
P_0 &= 0\\
P_N &= 1 \\
P_i &= pP_{i+1} + qP_{i-1}
\end{align}
$$

Finally, 

<div class="p-mark py-3" markdown="1">
$$
\begin{align}
P_i = \begin{cases}
\dfrac{1-\frac{q}{p}}{1-(\frac{q}{p})^N}, & \text{if } p \ne q; \\
\dfrac{1}{N} &\text{if }p=q=\frac{1}{2}.
\end{cases}
\end{align}
$$
</div>

Note that, $1-P\_i$ is the probability of ruin.

**Another type of this question**{:.tbrown}: Consider an ant walking along the positive integers. At position $i$, the ant moves to $i+1$ with probabilities $p$ and to $i-1$ with probabilities $q$. If the ant reach $0$, it stops walking. Starting from $i>0$, what is the probability that the ant reaches $i=N$ before reaching $0$? 

Sometimes, we consider above problem as a [random walk](https://en.wikipedia.org/wiki/Random_walk) problem. This post is copied from [this](http://www.columbia.edu/~ks20/FE-Notes/4700-07-Notes-GR.pdf) and we have a backup version [here]({{file-url}}/Gambler Ruin Problem.pdf).