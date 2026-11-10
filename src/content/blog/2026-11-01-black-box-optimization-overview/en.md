---
title: "What is Black-Box Optimization?"
description: "Optimizing a function you can only query: the problem, the main families of methods, and how to pick one."
pubDate: 2026-11-01
tags: [black-box optimization, bayesian optimization, evolution strategies]
series: "Black-box Optimization"
cover: ./cover.svg
draft: true
---

> This is a sample post that ships with the site. It shows every feature the blog supports — math, code, tables, footnotes, citations to other posts — so you can copy its structure, then edit or delete it.

## The problem

In **black-box optimization** we want to find

$$
x^\star \in \arg\min_{x \in \mathcal{X}} f(x),
$$

where we can *evaluate* $f$ at any point $x$, but we do not have a formula for it, nor its gradient $\nabla f(x)$. Each query returns a number, often noisy: $y = f(x) + \varepsilon$ with $\varepsilon \sim \mathcal{N}(0, \sigma_n^2)$.

Typical examples:

- tuning the hyperparameters of a neural network, where one evaluation is one full training run;
- choosing the composition of a material or a drug, where one evaluation is a lab experiment;
- calibrating a simulator whose code we cannot differentiate.

The defining constraint is that **evaluations are expensive**. A good method is one that reaches a good $x$ with as few queries as possible.[^budget]

[^budget]: In the literature this is measured by *simple regret* $r_T = f(x_T^{\text{best}}) - f(x^\star)$ after a budget of $T$ evaluations.

## Main families of methods

### Model-free search

Random search and grid search ignore everything they have seen so far. They are embarrassingly parallel and surprisingly strong baselines in high dimensions, but they waste evaluations.

### Evolution strategies

Methods like **CMA-ES** keep a search distribution, here a Gaussian, and sample a population from it:

$$
x_i \sim m + \sigma\, \mathcal{N}(0, C), \qquad i = 1, \dots, \lambda .
$$

After evaluating the population, the mean $m$, step size $\sigma$ and covariance $C$ move toward the best samples. CMA-ES needs many evaluations, but it is robust and scales to hundreds of dimensions.

### Bayesian optimization

Bayesian optimization (BO) fits a probabilistic **surrogate model** to the data — usually a Gaussian process — and picks the next point by maximizing an **acquisition function** that trades off exploration and exploitation. It is the method of choice when you can afford only tens or hundreds of evaluations. The [next post in this series](/blog/2026-11-05-bayesian-optimization-101) builds it from scratch.

## Which one should I use?

| Budget (evaluations) | Dimension | Good default |
| --- | --- | --- |
| up to ~200 | up to ~20 | Bayesian optimization |
| thousands | up to a few hundred | CMA-ES |
| any, massively parallel | any | Random search as a baseline |

## A minimal baseline in Python

Always run a random-search baseline before anything fancier:

```python
import numpy as np

def random_search(f, bounds, n_evals, seed=0):
    rng = np.random.default_rng(seed)
    lo, hi = np.array(bounds).T
    best_x, best_y = None, np.inf
    for _ in range(n_evals):
        x = rng.uniform(lo, hi)
        y = f(x)
        if y < best_y:
            best_x, best_y = x, y
    return best_x, best_y
```

## Summary

Black-box optimization is about **sample efficiency**. Evolution strategies are robust when evaluations are cheap enough to spend thousands; Bayesian optimization shines when every evaluation counts.
