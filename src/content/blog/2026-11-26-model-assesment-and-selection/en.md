---
title: "Model Assessment and Selection"
description: ""
pubDate: 2026-11-26
tags: [statistical learning theory, statistics]
series: "statistical learning theory"
cover: ./assets/model_evaluation_and_model_selection.png
draft: false
---

## Introduction
After the training phase is finished we want to evaluate how good the model's prediction capability on independent data is. Also, a key problem in the design of learning algorithms is the choice of the hypothesis set $\mathcal{H}$, this is known as *model selection*.
 
In this blog, we'll explore how can describe and illustrate the key mothods for performance assessment and model selection.

### Quick Start

In supervised learning problem, the objective is to learn a function $\hat{f}$ trying to predict labels from all given data. The set of all possible data (or inputs) will be denoted by $\mathcal{X}$. We will often have $\mathcal{X} \subseteq \mathbb{R}^d$. The set of labels will be denoted by $\mathcal{Y}$.

- In binary classification, $\mathcal{Y} = \{0, 1\}$. 
- In regression, labels can be any real number $\mathcal{Y} = \mathbb{R}$.

A target function $f$ is to mapping from a set of inputs $\mathcal{X}$ to a set of their labels $\mathcal{Y}$ ($f: \mathcal{X} \to \mathcal{Y}$). However, the problem is that this function is unknown. Our objective is to learn a function $\hat{f} \approx f$,which is known as predictors. That is, we consider a family of predictors parameterized by $\theta$ $\{\theta \in \Theta: \hat{f} = f_\theta\}$ where $\Theta$ is any set, called the parameter set, and each $f_\theta$ is a predictor.

For example, in linear regression, we have $f_\theta = \boldsymbol{\theta}^\top \mathbf{x} \in \mathcal{Y} = \mathbb{R}$, with $\mathcal{X} = \mathbb{R}^d$ is a family of predictors parameterized by $\boldsymbol{\theta} \in \Theta = \mathbb{R}^d$

In order to quantify how serious a mistake our predictor made, we measure it by a loss function $\ell$. The loss function can be any function $\ell: \mathcal{Y}^2 \to [0, +\infty)$ such that $\ell(y, y) = 0$ for any $y \in \mathcal{Y}$; $\ell(f_\theta(\mathbf{x}), y)$ will be interpreted as the cost of the prediction error. 

In classification, the most used loss function is

$$
\ell(f_\theta(\mathbf{x}), y) = \begin{cases}1 \text{ , if } f_\theta(\mathbf{x}) \neq y\\ 0\text{ , if } f_\theta(\mathbf{x}) = y\end{cases}
$$

This function is called 0-1 loss function and can be rewrited as $\ell(f_\theta(\mathbf{x}), y) = \mathbf{1}(f_\theta(\mathbf{x})\neq y)$


### Generalization Error and Empirical Risk

Assume we want to build a model to predict label of each data point $\mathbf{x}$. However, we cannot know these data points, nor their labels. A way to model this uncertainty is to assume that a future pair label-data is a random variable $(X, Y)$ taking values in $\mathcal{X} \times \mathcal{Y}$.

Let $P$ denote unknown probability distribution of $(X, Y)$ and $\mathcal{H}$ be a family of functions mapping $\mathcal{X}$ to $\mathcal{Y}$. So that, the expected prediction mistake is thus 

$$
R(f_\theta) = \mathbb{E}_{(X, Y) \sim P}\left[\ell(f_\theta(X), Y)\right]
$$

This is usually refered as the generalization risk (or generalization error) of function $f_\theta$. A good model is one that can minimize the generalization error $R(f_\theta)$ as much as possible. Ideally, we want to find $f^*$ such that

$$
R(f^*) = \underset{f \in \mathcal{H}}{\inf} R(f_\theta)
$$

However, we are not able to measure exactly these functions. Instead, we will train our machine based on examples. That is, we assume that we can access to a sample drawn independently from the probability distribution $P$, which then is called the data, or observations: $\mathcal{S} = \{(X_1, Y_1), \dots, (X_n, Y_n)\}$.

<aside>

**Caution:** We assume that our data is **i.i.d** (independent and identically distributed) from a probability distribution $P$.

</aside>

<aside>

**Definition (Empirical risk):** we have $\ell_i(f_\theta(X_i), Y_i) \geq 0$ is value of loss function on $i$-th data point $(X_i, Y_i)$. We define the empirical risk over $\mathcal{S}$:

$$
r(f_\theta) = \frac{1}{n}\sum_{i=1}^n \ell_i(f_\theta(X_i), Y_i) \tag{1}
$$

</aside>

If $f_\theta$ is fixed, $(1)$ would be an unbiased estimator of generalization error. It means that we have

$$
\underset{\mathcal{S} \sim P^n}{\mathbb{E}} \left[r(f_\theta)\right] = R(f_\theta)
$$

*Proof*:

First, we apply the linearity of expectation

$$
\mathbb{E}_\mathcal{S} \left[r(f_\theta)\right] = \mathbb{E}_\mathcal{S} \left[\frac{1}{n} \sum_{i=1}^n \ell_i(f_\theta(X_i), Y_i)\right] = \frac{1}{n} \sum_{i=1}^n\mathbb{E}_\mathcal{S} \left[\ell_i(f_\theta(X_i), Y_i)\right]
$$

Because $f_\theta$ is fixed, it means this function is independent to our dataset $\mathcal{S}$. As a result, $\mathcal{\mathbb{E}}_\mathcal{S}[\ell_i(f_\theta(X_i), Y_i)]$ is equivalent to the value of loss function at one single data point. 

So that,

$$
\mathcal{\mathbb{E}}_\mathcal{S}[\ell_i(f_\theta(X_i), Y_i)] = \mathcal{\mathbb{E}}_{(X_i, Y_i) \sim P}[\ell_i(f_\theta(X_i), Y_i)] = R(f_\theta)
$$

As a result

$$
\mathbb{E}_\mathcal{S} \left[r(f_\theta)\right] = \frac{1}{n} \sum_{i=1}^n\mathbb{E}_\mathcal{S} \left[\ell_i(f_\theta(X_i), Y_i)\right] = \frac{1}{n} \sum_{i=1}^n R(f_\theta) = R(f_\theta)
$$

### Empirical Risk Minimizer (ERM)
We will write $\mathbb{P}_\mathcal{S}$ for probabilities with respect to the sample $\mathcal{S}$.

Note that, each parameter in a parameter set $\Theta$ then eventually returns a predictor $f_\theta$ from the hypothesis set $\mathcal{H}$. So that, 

$$
R(\theta) := R(f_\theta)
$$

An estimator $\hat{\theta}((X_1, Y_1), \dots, (X_n, Y_n))$ is a function of sample, this function returns a guess for the parameter $\theta$ we should use for future predictions. Formally,

$$
\hat{\theta}: \bigcup_{n=1}^{\infty}(\mathcal{X} \times \mathcal{Y})^n \to \Theta
$$

For short, we write $\hat{\theta}$ instead of $\hat{\theta}((X_1, Y_1), \dots, (X_n, Y_n))$. 

<aside>

Definition (Empirical Risk Minimizer, or ERM): 

$$
\hat{\theta}_{\text{ERM}} = \underset{\theta \in \Theta}{\arg\min r(\theta)}
$$

</aside>

Our objective is to minimize $R$ but we are not able to measure it because the probability distribution $P$ is unknown. So we hope that minimizing $r$ is equivalent to minimizing $R$. Actually, this makes sense because of the law of large number

<details>
    <summary>Law of Large Number</summary>

<aside>

Theorem 1 (Weak Law of Large Number): Let $X_1, X_2, \dots$ be iid random variables with $\mathbb{E}[X_i] = \mu$ and $\operatorname{Var}(X_i) = \sigma^2 < \infty$, and define $\bar{X}_n = \frac{1}{n}\sum_{i=1}^nX_i$. Then, for every $\epsilon > 0$,

$$
\underset{n\to \infty}{\lim}\mathbb{P}\left(\vert{}\bar{X}_n-\mu\vert{}< \epsilon \right) = 1
$$

;that is, $\bar{X}_n$ converges in probabilty to $\mu$.

</aside>

*Proof:*
We have, for every $\epsilon > 0$, applying Chebyshev's inequality

$$
\mathbb{P}\left(\vert{}\bar{X}_n-\mu\vert{} \geq \epsilon \right) = \mathbb{P}\left((\bar{X}_n-\mu)^2 \geq \epsilon^2 \right) \leq \frac{\mathbb{E}\left[(\bar{X}_n - \mu)^2\right]}{\epsilon^2} = \frac{\operatorname{Var}\left(\bar{X}_n\right)}{\epsilon^2} = \frac{\sigma^2}{n\epsilon^2}
$$

Hence,

$$
\mathbb{P}\left(\vert{}\bar{X}_n-\mu\vert{} < \epsilon \right) = 1- \mathbb{P}\left(\vert{}\bar{X}_n-\mu\vert{} \geq \epsilon \right) \geq 1 - \frac{\sigma^2}{n\epsilon^2}
$$

When $n \to \infty$ the right-hand side of our inequality would go to $1$. It means that the probability would have to be greater or equal than $1$. That is,

$$
\underset{n\to \infty}{\lim}\mathbb{P}\left(\vert{}\bar{X}_n-\mu\vert{}< \epsilon \right) = 1
$$

The Weak Law of Large Number states that, under general conditions, the sample mean approaches the population mean as $n\to \infty$.


<aside>

Theorem 2 (Strong Law of Large Number): Let $X_1, X_2, \dots$ be iid random variables with $\mathbb{E}[X_i] = \mu$ and $\operatorname{Var}(X_i) = \sigma^2 < \infty$, and define $\bar{X}_n = \frac{1}{n}\sum_{i=1}^nX_i$. Then, for every $\epsilon > 0$,

$$
\mathbb{P}\left(\underset{n\to \infty}{\lim}\vert{\bar{X}_n-\mu}\vert{} < \epsilon\right) = 1
$$

;that is, $\bar{X}_n$ converges almost surely to $\mu$.

</aside>
</details>


### The role of test data
The question is clearly that why don't we just use only the training data to estimate the generalization error but use the test data instead?




## Bias, Variance, and Model Complexity





## References

1. Christopher Bishop, Section 3.2, page 147, "Bias-Variance Decomposition", Pattern Regconition and Machine Learning.  
2. Trevor Hastie et al, Section 7, page 219, "Model Assessment and Selection", The Elements of Statistical Learning - Data mining, Inference, and Prediction.  