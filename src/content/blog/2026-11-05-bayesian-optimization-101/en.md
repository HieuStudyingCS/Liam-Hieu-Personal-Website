---
title: "Bayesian Optimization from Scratch"
description: "Gaussian processes, expected improvement, and a 30-line implementation you can run today."
pubDate: 2026-11-05
tags: [bayesian optimization, gaussian process, black-box optimization]
series: "Black-box Optimization 101"
cover: ./cover.svg
draft: true
---

> Sample post. It exists only in English, so the language switch on this page shows how the site handles a post without a translation.

## The loop

Bayesian optimization repeats three steps until the budget runs out:

1. Fit a **surrogate model** to all observations $\mathcal{D}_t = \{(x_i, y_i)\}_{i=1}^{t}$.
2. Choose $x_{t+1} = \arg\max_x \alpha(x \mid \mathcal{D}_t)$, where $\alpha$ is an **acquisition function**.
3. Evaluate $y_{t+1} = f(x_{t+1})$ and add it to the data.

The surrogate is cheap to query, so step 2 can afford thousands of evaluations of $\alpha$ while step 3 spends one evaluation of the expensive $f$.

## Gaussian process surrogate

A Gaussian process $f \sim \mathcal{GP}(0, k)$ with kernel $k$ and noise variance $\sigma_n^2$ gives a closed-form posterior at any point $x$:

$$
\mu_t(x) = \mathbf{k}_t(x)^\top \left(K_t + \sigma_n^2 I\right)^{-1} \mathbf{y}_t,
$$

$$
\sigma_t^2(x) = k(x, x) - \mathbf{k}_t(x)^\top \left(K_t + \sigma_n^2 I\right)^{-1} \mathbf{k}_t(x),
$$

where $K_t$ is the kernel matrix of the observed points and $\mathbf{k}_t(x)$ the vector of kernels between $x$ and them. The mean $\mu_t$ is our best guess of $f$; the standard deviation $\sigma_t$ says how unsure we are — small near observations, large far away (see the cover figure).

### Choosing a kernel

The Matérn-5/2 kernel is the usual default: it assumes $f$ is twice differentiable, which is smooth enough to generalize but not as unrealistically smooth as the squared-exponential kernel.

## Expected improvement

Let $y^\star = \min_i y_i$ be the best value so far. **Expected improvement** (EI) measures how much we expect to beat it at $x$:

$$
\mathrm{EI}(x) = \left(y^\star - \mu(x) - \xi\right)\Phi(z) + \sigma(x)\,\varphi(z),
\qquad z = \frac{y^\star - \mu(x) - \xi}{\sigma(x)},
$$

with $\Phi$ and $\varphi$ the standard normal CDF and PDF, and $\xi \ge 0$ a small margin that encourages exploration. The first term rewards points with a low predicted mean (**exploitation**); the second rewards points with high uncertainty (**exploration**).

## Implementation

A complete, runnable version with scikit-learn. Maximizing EI by random sampling is crude but works well in low dimensions:

```python
import numpy as np
from scipy.stats import norm
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import Matern, WhiteKernel

def expected_improvement(X, gp, y_best, xi=0.01):
    mu, sigma = gp.predict(X, return_std=True)
    sigma = np.maximum(sigma, 1e-9)
    z = (y_best - mu - xi) / sigma
    return (y_best - mu - xi) * norm.cdf(z) + sigma * norm.pdf(z)

def bayes_opt(f, bounds, n_init=5, n_iter=25, seed=0):
    rng = np.random.default_rng(seed)
    lo, hi = np.array(bounds, dtype=float).T
    X = rng.uniform(lo, hi, size=(n_init, len(lo)))
    y = np.array([f(x) for x in X])
    kernel = Matern(nu=2.5) + WhiteKernel(1e-6)
    for _ in range(n_iter):
        gp = GaussianProcessRegressor(kernel, normalize_y=True).fit(X, y)
        candidates = rng.uniform(lo, hi, size=(2048, len(lo)))
        ei = expected_improvement(candidates, gp, y.min())
        x_next = candidates[np.argmax(ei)]
        X = np.vstack([X, x_next])
        y = np.append(y, f(x_next))
    best = np.argmin(y)
    return X[best], y[best]
```

## Where to go next

- Better acquisition optimizers (multi-start L-BFGS instead of random candidates).
- Other acquisition functions: upper confidence bound, Thompson sampling, knowledge gradient.
- Libraries that do all of this properly: BoTorch, Ax, SMAC.
