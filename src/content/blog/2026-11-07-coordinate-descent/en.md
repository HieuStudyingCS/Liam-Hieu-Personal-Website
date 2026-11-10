---
title: "Coordinate Descent"
description: "Coordinate descent solves optimization problems by minimizing the objective function along coordinate directions or coordinate hyperplanes"
pubDate: 2026-11-07
tags: [convex optimization, first-order methods, coordinate descent, lasso]
series: "First-order Methods"
cover: ./assets/Coordinate Search and Descent.png
draft: false
---

## Introduction
### Abstract

Coordinate descent solves optimization problems by minimizing the objective function along coordinate directions or coordinate hyperplanes.

### Introduction

They are iterative methods in which each iterate is obtained by fixing most components of the variable vector $\mathbf{x}$ at their values from the current iteration, and approximately minimizing the objective with respect to the rema  ining components. Each such subproblem is a lower-dimensional (even scalar) minimization problem, and thus can typically be solved more easily than the full problem.

Có thể hiểu thuật toán này như sau:

<aside>

- Bắt đầu từ một điểm dự đoán ban đầu cho tất cả các biến số trong vector $\mathbf{x}$.
- Tại mỗi bước lặp, thuật toán sẽ chọn ra một biến (hoặc nhóm nhỏ các biến) để tối ưu. Tất cả các biến còn lại sẽ bị xem như là hằng số tại thời điểm lặp.
- Nếu ta nhìn bài toán dưới góc độ này thì giống như là ta đang giảm đi số chiều của bài toán đang cần được giải quyết. Hệ quả là tính toán đạo hàm sẽ đơn giản hơn, hơn nữa việc chọn một trục tọa độ và tìm cực tiểu trên đó lại đỡ tốn tài nguyên tính toán hơn so với bài toán quy mô lớn (đa chiều).
- Sau khi tìm được giá trị tối ưu cho biến đó, thuật toán lại quay chuyển qua biến tiếp theo rồi sau đó lặp lại quy trình cũ.
    
Nghĩa là nếu vector $\mathbf{x} = \begin{bmatrix}x_1 \\ x_2 \\ \dots \\ x_n\end{bmatrix}$ thì quy trình cập nhật sẽ là $x_1 \rightarrow x_2 \rightarrow \dots \rightarrow x_n \rightarrow x_1 \rightarrow x_2 \dots$
    
- Quá trình này có thể được mô tả như việc giảm giá trị trên tất cả các trục tọa độ, giúp cho thuật toán tiếp cận gần với điểm hội tụ hơn (đáy bát).

*Lưu ý:* quá trình cập nhật tuần tự trên được gọi là **Cyclic Coordinate Descent,** trong thực tế thì ta còn nhiều cách cập nhật khác như Randomized Coordinate Descent hay Greedy/Gauss-Southwell rule.

</aside>


Nhờ ý tưởng này mà thuật toán trên được ứng dụng rộng rãi trong các trường hợp như:

- non-smooth regularizations (lasso) terms
- A small number of equality constraints

*Lưu ý:* Trong bài này thì chỉ đề cập tới việc chỉnh sửa/cập nhật trên một trục tọa độ, nhưng thông thường thì chúng ta thường dùng tới method cập nhật trên nhiều trục tọa độ hơn (block coordinate descent).

### Formulations

Xét bài toán tổng quát như sau:

$$
\min_{\mathbf{x} \in \mathbb{R}^n} f(\mathbf{x})
$$

Trong đó, $f: \mathbb{R}^n \to \mathbb{R}$ là một hàm liên tục. 

<aside>

Trong một số phiên bản khác của thuật toán CD, ta thường có thể thêm điều kiện cho $f$ như $f$ phải trơn và lồi, hay trơn nhưng có thể có không lồi…

</aside>

Xét các hàm số có dạng như sau trong đa phần các bài toán mà CD có thể giải hiệu quả:

$$
\min_\mathbf{x} h(\mathbf{x}) := f(\mathbf{x}) + \lambda \Omega(\mathbf{x})
$$

Trong đó $f$ trơn. $\Omega$ là hàm điều chuẩn (là thành phần regularization) và hàm này có thể là hàm không trơn, và có thể có giá trị là vô cùng, $\lambda > 0$ là hệ số điều chuẩn.

Thông thường, $\Omega$ là một hàm lồi (convex) và thường được ngầm nhận định là có thể phân tách thành từng biến (separable) hoặc phân tách thành một nhóm các biến (block-separable)

<details>
    <summary>Separable và block-separable là gì?</summary>

Một hàm $\Omega$ được xem là một hàm có thể tách biệt được trên một vector nhiều chiều $\mathbf{x} = (x_1, x_2, \dots, x_n)^T$ khi ta có thể viết hàm ban đầu dưới dạng tổng của các hàm độc lập, mỗi hàm chỉ xử lý một biến duy nhất

$$
\Omega(\mathbf{x}) = \Omega_1(x_1) +\Omega_2(x_2) + \dots + \Omega_n(x_n)
$$

Có thể lấy ví dụ là hàm ridge như sau:

$$
\left\| \mathbf{x} \right\|_2^2 = x_1^2 + x_2^2 + \dots + x_n^2
$$

Ta thấy mỗi hàm $g(x) = |x|$ chỉ xử lý một biến $x_i$ duy nhất, nên ta gọi hiện tượng phân tách này là separable.

Thay vì ta phân tách theo từng biến, ta có thể phân tách theo một nhóm các biến:

Nếu chia $\mathbf{x}$ thành các khối $\mathbf{x}  =(x_{B_1}, x_{B_2}, \dots, x_{B_m})^T$ thì

$$
\Omega(\mathbf{x}) = \Omega_1(x_{B_1}) +\Omega_2(x_{B_2}) + \dots + \Omega_m(x_{B_m})
$$

Cụ thể phương pháp chia khối như sau, giả sử ta có một vector 5 chiều như sau:

$$
\mathbf{x} = \begin{bmatrix}x_1 \\ x_2 \\ \dots \\ x_5\end{bmatrix}
$$

Vậy ta định nghĩa ma trận đơn vị $U = I_5$ như sau:

$$
U = I_5 = \begin{bmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 & 1 \end{bmatrix}
$$

Giả sử ta muốn chia 5 biến vector $x_i$ này thành 2 phần bao gồm $[x_1, x_2]^T$ và $[x_3, x_4, x_5]^T$ thì ta làm như sau:

- Vì ta muốn chia vector thành 2 thành phần, nên ý tưởng chính được nêu trong paper này là cắt ma trận $U$ ban đầu thành 2 ma trận mới $U_1$ (lấy 2 cột đầu của $U$) và $U_2$ (lấy 3 cột cuối của $U$) như sau:

$$
U_1 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0 & 0 \\ 0 & 0 \\ 0 & 0 \end{bmatrix} \qquad U_2 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

Sau đó ta sử dụng tích $U_i^T\mathbf{x}$ để lấy ra thành phần thứ $i$ như sau:

$U_1^T x = \begin{bmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{bmatrix} = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}$

$U_2^T x = \begin{bmatrix} 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 & 1\end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{bmatrix} = \begin{bmatrix} x_3 \\ x_4 \\ x_ 5\end{bmatrix}$

Vậy ta có một hệ quả như sau, để có thể tách một vector thành các block, ta chỉ việc sử dụng tổ hợp từ các cột của ma trận đơn vị $U$.
</details>

Vậy nếu như $\Omega$ là hàm separable thì nghĩa là ta có thể viết hàm này dưới dạng như sau:

$$
Ω⁡(x)=\sum_{i=1}^nΩ_i(x_i)
$$

Trong đó, $\Omega_i: \mathbb{R} \to \mathbb{R}, \forall i$

Ngoài ra, ta còn có cách biểu diễn khác theo các submatrices $U_i, i = 1, 2,\dots, N$ để tách vector $\mathbf{x}$ ban đầu thành các blocks và biểu diễn lại $\Omega(\mathbf{x})$ như sau

$$
\Omega(\mathbf{x}) = \sum_{i=1}^N\Omega_i(U_i^T\mathbf{x})
$$

Box Constraints:

- Các hàm thành phần $\Omega_i(x_i)$ là một hàm chỉ thị (indicator function) $I_{[l_i, u_i]}(x_i)$ cho khoảng $[l_i, u_i]$
- $[l_i, u_i]$ là giới hạn ràng buộc cho giá trị mà $x_i$ có thể nhận, nghĩa là $x_i$ chỉ có thể nhận giá trị trong khoảng từ cận dưới $l_i$ đến cận trên $u_i$. Khi mô tả dưới dạng hình học thì nó giống như một cái hộp (hình chữ nhật) nên ta mới gọi là box constraints.

$$
I_{[l_i, u_i]}(x_i) = \begin{cases}0 \text{ , } x_i \in [l_i, u_i] \\ +\infty, x_i \notin [l_i, u_i]\end{cases}
$$

Trong optimization, nhờ hàm chỉ thị mà ta có thể ép các trọng số phải luôn nằm trong một không gian hình chữ nhật cố định.

- Các ràng buộc hoàn toàn độc lập với nhau, ví dụ $1 \leq x_1 \leq 5$ và $-2 \leq x_2 \leq 5$.
- Nên có thể thấy thêm một ưu điểm nữa của CD so với các thuật toán tối ưu hóa khác nằm ở chỗ CD tối ưu dựa trên một biến hoặc một nhóm các biến, nên việc gắn thêm constraints cho từng biến không làm cho bài toán bị phức tạp lên quá mức. Trong khi việc gắn thêm 1 constraint vào các thuật toán tối ưu khác cũng làm cho bài toán trở nên phức tạp hơn rất nhiều.

Group-sparse regularizers, nghĩa là các hàm thành phần $\Omega_i(z_i)$ áp dụng l2-norm cho từng khối:

$$
\Omega_i(z_i) := \left\|z_i\right\|_2
$$

Ưu điểm của cách này so với separable nằm ở chỗ thay vì ép từng biến về $0$ thì nó sẽ hoặc là làm các biến trong block này được giữ lại (khác $0$) hoặc làm một nhóm các biến đều bị ép đồng thời về $0$. Dẫn tới hiện tượng thưa theo từng nhóm các biến (Group-sparse).

### Bài toán cực tiểu hóa rủi ro thực nghiệm (ERM)

Một lớp bài toán đặc biệt phù hợp với Coordinate Descent là **cực tiểu hóa rủi ro thực nghiệm** (Empirical Risk Minimization – ERM) (Wright, 2015):

$$
\min_{w \in \mathbb{R}^d} \; \frac{1}{n} \sum_{i=1}^{n} \phi_i\big(c_i^T w\big) + \lambda\, g(w)
$$

Trong đó:

- $c_i \in \mathbb{R}^d$ ($i = 1, \dots, n$) là vector đặc trưng của mẫu dữ liệu thứ $i$, còn $w \in \mathbb{R}^d$ là vector tham số;
- $\phi_i : \mathbb{R} \to \mathbb{R}$ là hàm mất mát lồi của mẫu thứ $i$, chỉ phụ thuộc vào $w$ thông qua giá trị dự đoán $c_i^T w$;
- $g$ là hàm điều chuẩn lồi và $\lambda > 0$ là hệ số điều chuẩn.

Nhiều mô hình quen thuộc là trường hợp riêng của dạng này, với $y_i$ là nhãn của mẫu thứ $i$:

| Mô hình | $\phi_i(s)$ | $g(w)$ |
| --- | --- | --- |
| Bình phương tối thiểu | $\frac{1}{2}(s - y_i)^2$ | $0$ |
| Ridge | $\frac{1}{2}(s - y_i)^2$ | $\frac{1}{2}\lVert w \rVert_2^2$ |
| Lasso | $\frac{1}{2}(s - y_i)^2$ | $\lVert w \rVert_1$ |
| Hồi quy logistic, $y_i \in \{-1, +1\}$ | $\log\big(1 + e^{-y_i s}\big)$ | $\frac{1}{2}\lVert w \rVert_2^2$ hoặc $0$ |
| SVM tuyến tính, $y_i \in \{-1, +1\}$ | $\max(0,\, 1 - y_i s)$ | $\frac{1}{2}\lVert w \rVert_2^2$ |

<aside>

**Hàm liên hợp (convex conjugate).** Với một hàm lồi $t$, hàm liên hợp $t^*$ được định nghĩa là

$$
t^*(y) = \sup_{z} \big( z^T y - t(z) \big)
$$

Ví dụ: với $t(z) = \frac{1}{2}z^2$ thì $t^*(y) = \frac{1}{2}y^2$; với $t(z) = |z|$ thì $t^*(y) = 0$ nếu $|y| \le 1$, và $t^*(y) = +\infty$ trong trường hợp còn lại.

</aside>

Hàm liên hợp là công cụ để viết **bài toán đối ngẫu** của ERM. Bài toán đối ngẫu có phần tổng tách được theo từng biến đối ngẫu, mỗi biến ứng với đúng một mẫu dữ liệu. Vì vậy nó đặc biệt hợp với Coordinate Descent: mỗi bước chỉ cần cập nhật một biến đối ngẫu, tức là chỉ xử lý một mẫu dữ liệu. Đây là ý tưởng phía sau SDCA và bộ giải SVM của LIBLINEAR.

<details>
    <summary>Bài toán đối ngẫu và hàm liên hợp lồi?</summary>

Cho hàm số $f: \mathbb{R}^n \to \mathbb{R}$ và nếu hàm số $f^*: \mathbb{R}^n \to \mathbb{R}$ được định nghĩa như sau

$$
f^*(y) = \sup_{x \in \text{dom}f} (y^Tx - f(x))
$$

thì ta nói đây là hàm liên hợp lồi của hàm $f$. 

<!-- Ví dụ

1. $t(z)=\tfrac12 z^2$. Cần max của $zy-\tfrac12z^2$. Đạo hàm $y-z=0$ cho $z^*=y$, suy ra

$$t^*(y)=y^2-\tfrac12y^2=\tfrac12y^2$$

Hàm này tự liên hợp với chính nó. Ví dụ $y=1.5$ cho $z^*=1.5$ và $t^*=1.125$, khớp với hình.

2. $t(z)=\lvert z\rvert$. Nếu $\lvert y\rvert\le1$ thì $zy\le\lvert z\rvert$ với mọi $z$, nên sup bằng 0 (đạt tại $z=0$). Nếu $\lvert y\rvert>1$, cho $z\to\pm\infty$ cùng dấu với $y$ thì $zy-\lvert z\rvert=\lvert z\rvert(\lvert y\rvert-1)\to\infty$. Vậy

$$t^*(y)=\begin{cases}0 & \lvert y\rvert\le1\\ +\infty & \lvert y\rvert>1\end{cases}$$

Tức là hàm chỉ thị của đoạn $[-1,1]$. Đây là lý do đối ngẫu của lasso có ràng buộc hộp.

3. $t(z)=e^z$. Với $y>0$: đạo hàm $y-e^z=0$ cho $z^*=\ln y$, suy ra

$$t^*(y)=y\ln y-y$$

Với $y<0$: cho $z\to-\infty$ thì $zy\to+\infty$, nên $t^*=+\infty$. Với $y=0$: sup bằng 0 nhưng không đạt.

4. Logistic $t(z)=\log(1+e^z)$. Giải $y=\sigma(z)$ cho $z^*=\log\frac{y}{1-y}$, và

$$t^*(y)=y\log y+(1-y)\log(1-y),\qquad y\in[0,1]$$

Đây là âm entropy nhị phân, nên đối ngẫu của logistic regression là một bài toán cực đại entropy.

5. Hàm chỉ thị của một điểm, $I_{\{b\}}$ (0 tại $b$, $+\infty$ chỗ khác): sup chỉ lấy tại $z=b$, nên $I_{\{b\}}^*(s)=bs$. Paper dùng đúng điều này để đưa hệ $Aw=b$ về dạng ERM.

Các tính chất của hàm liên hợp lồi:
1. $f^*$ luôn lồi, kể cả khi $f$ không lồi, vì nó là $\sup$ của các hàm tuyến tính theo $y$.
Bất đẳng thức Fenchel–Young, suy thẳng từ định nghĩa:
$$
t(z)+t^*(y)\ge z^Ty\quad\forall z,y
$$ 
-->

<details>
    <summary>Tính chất 1: Hàm $f^*$ là một hàm lồi</summary>

Ta có thể thấy $f^*$ là một hàm lồi, không quá khó để giải thích tính chất này, ta cố định một $x$, xét hàm số

$$
l_x(y) = x^Ty - f(x)
$$

là một **hàm affine** theo $y$: hệ số góc là $x$, hằng số là $-f(x)$. Vậy $f^*(y) = \sup_x l_x(y)$ là cận trên đúng (hay $\sup$) của tất cả các đường thẳng (hay siêu phẳng).

Ta có một kết quả là $\sup$ của các hàm lồi thì luôn lồi. Chứng minh:

Với $y_1, y_2$ và $\theta \in [0,1]$, mỗi $l_x$ là affine nên có

$$
\ell_x(\theta y_1+(1-\theta)y_2)=\theta\ell_x(y_1)+(1-\theta)\ell_x(y_2)\le\theta f^*(y_1)+(1-\theta)f^*(y_2)
$$

Lấy $\sup$ theo $x$ ở vế trái, ta thu được kết quả

$$
f^*(\theta y_1+(1-\theta)y_2)\le\theta f^*(y_1)+(1-\theta)f^*(y_2) \tag{1}
$$

Và ta cũng biết định nghĩa của hàm lồi được xác định là, cho hàm số $f(x)$ xác định trên một tập lồi $I$. Hàm $f(x)$ được gọi là hàm lồi nếu với mọi $x, y \in I$ và với mọi số thực $\lambda \in [0,1]$, ta có bất đẳng thức:

$$
f(\lambda x + (1-\lambda)y) \leq \lambda f(x) + (1-\lambda)f(y)
$$

**Ý nghĩa hình học:** Đoạn thẳng nối hai điểm $(x, f(x))$ và $(y, f(y))$ nằm phía trên đồ thị của hàm số.

Từ định nghĩa về hàm lồi kết hợp với $(1)$, ta có kết luận: $f^*$ là một hàm lồi. Hơn nữa, do không sử dụng $f$ trong lập luận nên dù $f$ là hàm không lồi thì cũng không ảnh hưởng kết quả cuối cùng là $f^*$ là hàm lồi.

</details>


<details>
    <summary>Tính chất 2: Bất đẳng thức Fenchel–Young</summary>

$$
f(x)+f^*(y)\ge y^Tx\quad\forall x,y \in \mathbb{R}^n
$$

Dấu bằng xảy ra khi và chỉ khi $y=\nabla f(x)$ (hoặc $y$ thuộc dưới vi phân).

</details>


<details>
    <summary>Tính chất 3: Liên hợp 2 lần</summary>

$f^{**}=f$ khi $f$ lồi và đóng (Fenchel–Moreau). Không làm mất thông tin, mà ta chỉ đổi từ biểu diễn điểm sang biểu diễn qua tiếp tuyến (ý nghĩa trực quan của hàm liên hợp lồi, sẽ được tìm hiểu sau).

</details>

<details>
    <summary>Tính chất 4: Gradient nghịch đảo nhau</summary>

Gradient nghịch đảo nhau: $\nabla f^*=(\nabla f)^{-1}$. Với $e^x$: $\nabla f=e^x$, $\nabla f^*=\ln y$.

Chứng minh:



</details>


![](./assets/conjugate%20function.png)
*(The conjugate function, "Convex Optimization", Stanford [4])*

Ý nghĩa trực quan của hàm liên hợp lồi (áp dụng cho trường hợp $f$ là hàm lồi, khả vi):  
- Thông thường, một đường cong lồi $f(x)$ được mô tả bằng tập hợp các điểm $(x, f(x))$.
- Tuy nhiên, ta cũng có thể mô tả cũng đường cong đó bằng tập hợp tất cả các đường tiếp tuyến bao lấy nó từ bên dưới.
- Nếu ta chọn độ dốc (hay hệ số góc) cho các đường tiếp tuyến này là $y$, thì biểu thức $f^*(y) = \sup_x (y^T x - f(x))$ sẽ giúp ta tìm ra vị trí mà đường thẳng có độ dốc $y$ tiếp xúc với đồ thị hàm $f(x)$. Hơn nữa, $-f^*(y)$ là giao điểm của tiếp tuyến đó với trục tung.

<details>
    <summary>Chứng minh cho ý nghĩa trực quan</summary>

Xét hàm liên hợp lồi sau:

$$
f^*(y) = \sup_{x\in \text{dom}(f)} h(x) =\sup_{x \in \text{dom}(f)} (y^Tx - f(x))
$$

Trong đó $h(x) = y^Tx - f(x)$.

Giả sử $f(x)$ là hàm lồi, khả vi và supremum đạt được tại điểm cực đại $x^*$ thì $-f(x)$ là hàm lõm, kết hợp với thành phần tuyến tính là $y^Tx$ nên hàm $h(x)$ là một hàm lõm theo $x$.

Đối với hàm lõm và khả vi $h(x)$, điểm $x^*$ là cực đại toàn cục của hàm khi và chỉ khi gradient của $h(x)$ theo $x$ tại điểm đó bằng vector $0$.

$$
\nabla_x h(x^*) = \left. \nabla_x (y^T x - f(x)) \right\vert{}_{x = x^*} = y - \nabla f(x^*) = 0
$$

$$
\Leftrightarrow \nabla f(x^*) = y \tag{1}
$$

Tại điểm tiếp xúc $(x^*, f(x^*))$, phương trình siêu mặt phẳng tiếp tuyến $W(x)$ của đồ thị hàm $f(x)$ được xác định là

$$
\begin{align*}
W(x) &= f(x^*) + \nabla f(x^*)^T (x - x^*) \\
\Leftrightarrow W(x) &= f(x^*) + y^T (x - x^*) \\
\Leftrightarrow W(x) &= y^T x + \left[ f(x^*) - y^T x^* \right]
\end{align*}
$$

Mà ta lại có, $f^*(y) = \sup_{x \in \mathbf{dom}\,f} \left(y^T x - f(x)\right) = y^T x^* - f(x^*)$

Nên, 

$$
W(x) = y^T x - f^*(y)
$$

Dễ thấy, nếu $x = 0$, ta thu được 

$$
W(0) = -f^*(y) \tag{2}
$$

Vậy từ (1) và (2) ta có kết luận sau:
1. Điểm $x^*$ (cực đại toàn cục của $h(x)$) là vị trí mà độ dốc (hay gradient) của đồ thị hàm số $f(x)$ bằng $y$.

2. Giá trị $-f^*(y)$ chính là tung độ gốc của siêu mặt phẳng có độ dốc $y$ tiếp xúc bên dưới đồ thị hàm $f(x)$ (đây cũng là điều mà Hình ảnh về conjugate function trong cuốn Convex Optimization của Boyd & Vandenberghe minh họa được chèn ở trên).

</details>


<!-- Dấu bằng xảy ra khi và chỉ khi $y=\nabla t(z)$ (hoặc $y$ thuộc dưới vi phân).

Liên hợp hai lần: $t^{**}=t$ khi $t$ lồi và đóng (Fenchel–Moreau). Không mất thông tin, chỉ đổi ngôn ngữ từ điểm sang tiếp tuyến.
Gradient nghịch đảo nhau: $\nabla t^*=(\nabla t)^{-1}$. Với $e^z$: $\nabla t=e^z$, $\nabla t^*=\ln y$.
Lồi mạnh và trơn đối ngẫu nhau: $t$ lồi mạnh với hệ số $\mu$ khi và chỉ khi $\nabla t^*$ Lipschitz với hằng số $1/\mu$. Vì thế điều chuẩn $\lambda g$ làm bài toán đối ngẫu dễ tối ưu.


Lagrangian và hàm đối ngẫu

Xét bài toán gốc: $\min_w f(w)$ với ràng buộc $h_j(w)\le0$. Ta “bán” mỗi ràng buộc thành một khoản phạt với giá $x_j\ge0$ (nhân tử Lagrange):

$$L(w,x)=f(w)+\sum_j x_jh_j(w)$$
$$q(x)=\inf_w L(w,x)$$

$q$ luôn lõm (inf của các hàm tuyến tính theo $x$), kể cả khi bài toán gốc không lồi.

Đối ngẫu yếu. Với mọi $w$ khả thi và mọi $x\ge0$, vì $x_jh_j(w)\le0$:

$$q(x)\le L(w,x)\le f(w)\;\Longrightarrow\; q(x)\le P^*$$

Mỗi $x$ cho một chặn dưới; bài toán đối ngẫu tìm chặn dưới tốt nhất $D^*=\max_{x\ge0}q(x)\le P^*$.

Đối ngẫu mạnh. Bài toán lồi có một điểm khả thi chặt (điều kiện Slater) thì $D^*=P^*$. Khoảng cách $P^*-D^*$ gọi là duality gap.

Điều kiện KKT (khi đối ngẫu mạnh): $\nabla_wL(w^*,x^*)=0$, $w^*$ khả thi, $x^*\ge0$, và $x_j^*h_j(w^*)=0$ (ràng buộc không chặt thì giá bằng 0).

Ví dụ trực quan: $\min w^2$ với $w\ge1$

Nghiệm hiển nhiên $w^*=1$, $P^*=1$. Viết ràng buộc là $1-w\le0$:

$$L(w,x)=w^2+x(1-w)$$

Với $x$ cố định, min theo $w$ đạt tại $w=x/2$, cho

$$q(x)=x-\frac{x^2}{4}$$

Đọc hình: đường cam là Lagrangian, đáy của nó (chấm xanh) luôn nằm dưới $P^*=1$, đúng như đối ngẫu yếu. Gap tính được là

$$1-q(x)=\Big(1-\frac x2\Big)^2\ge0$$

bằng 0 duy nhất tại $x^*=2$. Khi đó đáy Lagrangian rơi đúng vào $w=x^*/2=1=w^*$, và điều kiện bù $x^*(1-w^*)=0$ thỏa. Nhân tử còn có nghĩa kinh tế: nếu đổi ràng buộc thành $w\ge c$ thì $P^*=c^2$, đạo hàm theo $c$ tại $c=1$ bằng $2=x^*$. **$x^*$ là “giá” của việc siết ràng buộc thêm một đơn vị.**

Đối ngẫu Fenchel: nơi conjugate xuất hiện

Dạng tổng quát mà paper dùng:

$$\min_w\; f(w)+g(Aw)$$

Bước 1: tách biến. Đặt $u=Aw$ thành ràng buộc, gán nhân tử $x$:

$$L(w,u,x)=f(w)+g(u)+x^T(Aw-u)$$

Bước 2: inf theo $w$. $\inf_w\big(f(w)+(A^Tx)^Tw\big)=-f^*(-A^Tx)$, đúng định nghĩa conjugate.

Bước 3: inf theo $u$. $\inf_u\big(g(u)-x^Tu\big)=-g^*(x)$.

Kết quả:

$$\max_x\; -f^*(-A^Tx)-g^*(x)$$

Mọi phép inf trong hàm đối ngẫu đều có dạng “hàm trừ tuyến tính”, nên conjugate là ngôn ngữ tự nhiên của đối ngẫu. Lấy lại nghiệm gốc nhờ dấu bằng Fenchel–Young: $w^*\in\partial f^*(-A^Tx^*)$.

Ví dụ số: nghiệm chuẩn nhỏ nhất

Bài toán: $\min\tfrac12(w_1^2+w_2^2)$ với $w_1+w_2=2$, tức $A=[1\;\;1]$, $b=2$. Nghiệm gốc rõ ràng $w^*=(1,1)$, $P^*=1$.

Lagrangian: $L=\tfrac12\|w\|^2+x(2-w_1-w_2)$. Min theo $w$ cho $w=A^Tx=(x,x)$, thay vào:

$$q(x)=x^2+2x-2x^2=-x^2+2x$$

Max tại $x^*=1$, $D^*=1=P^*$. Nghiệm gốc lấy lại bằng $w^*=A^Tx^*=(1,1)$. Đây đúng là bài toán (10) trong paper, và chạy coordinate descent trên nó chính là thuật toán Kaczmarz.

Ví dụ của paper: ERM

Áp khung Fenchel cho (5) với $u_i=c_i^Tw$ và nhân tử $x_i/n$:

$$\inf_{u_i}\big(\phi_i(u_i)+x_iu_i\big)=-\phi_i^*(-x_i)$$
$$\inf_w\Big(\lambda g(w)-\tfrac1n(Cx)^Tw\Big)=-\lambda g^*\Big(\frac{Cx}{\lambda n}\Big)$$

Gộp lại và đổi max thành min, ta được đúng (7):

$$\min_x\;\frac1n\sum_{i=1}^n\phi_i^*(-x_i)+\lambda g^*\Big(\frac{1}{\lambda n}Cx\Big)$$

Với $g=\tfrac12\|\cdot\|^2$ (tự liên hợp), nghiệm gốc là $w^*=\dfrac{Cx^*}{\lambda n}=\dfrac{1}{\lambda n}\sum_i x_i^*c_i$: tổ hợp các điểm dữ liệu. Trong SVM, các điểm có $x_i^*\ne0$ chính là support vectors.

Vì sao đối ngẫu hữu ích
Chứng nhận tối ưu: mọi cặp $(w,x)$ khả thi cho khoảng $[q(x),f(w)]$ chứa $P^*$; gap nhỏ là dừng được.
Đổi cấu trúc: (5) ghép mọi mẫu qua $w$, còn (7) có số hạng tách rời theo từng $x_i$, hợp với coordinate descent.
Đổi số chiều: gốc có $d$ biến, đối ngẫu có $n$ biến (hoặc $m$ với $Aw=b$).
Diễn giải: nhân tử là giá của ràng buộc, cho biết mỗi mẫu quan trọng đến đâu. -->

Các ví dụ tính toán, tổng kết

|$f(x)$|$\operatorname{dom}f$|$f^*(y)$|$\operatorname{dom}f^*$|
|:-|:-:|:-:|:-:|
|$ax+b$	|$\mathbb{R}$|	$-b$|	$\{a\}$
|$-\log x$|	$\mathbb{R}_{++}$|	$-\log(-y)-1$|	$-\mathbb{R}_{++}$|
|$e^x$|	$\mathbb{R}$|	$y\log y-y$|$\mathbb{R}_+$|
|$x\log x$|	$\mathbb{R}_+$|	$e^{y-1}$|	$\mathbb{R}$|
|$1/x$|	$\mathbb{R}_{++}$|	$-2\sqrt{-y}$|	$-\mathbb{R}_+$|

Một quy luật rút ra từ bảng trên:
- $\operatorname{dom}f^*$ là tập các độ dốc mà $f$ có tiếp tuyến (hoặc tiệm cận được). Hàm mũ có độ dốc từ 0 đến $\infty$ nên miền là $\mathbb{R}_+$; hàm $1/x$ giảm dần nên miền là các số âm.

Trong optimization, các bài toán gốc được gọi là bài toán nguyên thủy (primal problem) đều có một bài toán tương đương với nó được gọi là bài toán đối ngẫu (dual problem)  

Về mặt đại số có thể tưởng tượng như sau, giả sử ta có $f(w) \geq g(x)$, bài toán nguyên thủy là bài toán đi tìm điểm cực tiểu của $f(w)$. Với bất đẳng thức trên, nếu ta đẩy cận dưới $g(x)$ lên cao nhất có thể (chạm tới $f(w)$) thì có nghĩa là ta đi tìm $\max_x g(x)$ → Đây là bài toán đối ngẫu trong trường hợp $g$ là hàm lồi.

Ví dụ bài toán đối ngẫu:

<div data-widget="convex-conjugate" data-lang="vi"></div>


</details>

## Lasso Regression

Ta có hàm mục tiêu cần tối thiểu hóa trong bài toán Lasso Regression như sau

$$
\begin{align*}
J(\boldsymbol{\beta}) &= \frac{1}{2n} \Vert{}\mathbf{y} - X\boldsymbol{\beta}\Vert{}_2^2 + \lambda \Vert{}\boldsymbol{\beta}\Vert{}_1 \\&= \frac{1}{2n} \sum_{i=1}^n \left(y_i - \sum_{k=1}^p x_{ik}\beta_k\right)^2 + \lambda \sum_{k=1}^p \vert{}\beta_k\vert{}
\end{align*}
$$

Vấn đề của Gradient descent là hàm thành phần regularization không khả vi tại các điểm $\beta_k = 0$ $\Rightarrow$ Chuyển qua coordinate descent. Cách làm cụ thể như sau:

Tách riêng thành phần làm cho hàm số không khả vi (các $\beta_j$) như sau

$$
y_i - \sum_{k=1}^p x_{ik}\beta_k = \underbrace{\left(y_i - \sum_{k \neq j} x_{ik}\beta_k\right)}_{r_i^{(j)}} - x_{ij}\beta_j = r_i^{(j)} - x_{ij}\beta_j
$$

Trong đó, $\mathbf{r}^{(j)} = (r_1^{(j)}, \dots, r_n^{(j)})^T$ được gọi là vector phần dư từng phần (partial residual) - tức là phần sai số còn lại khi dùng tất cả các biến (ngoại trừ biến $j$) để dự đoán $\mathbf{y}$.

Ta viết lại hàm mục tiêu như sau:

$$
\begin{align*}J(\boldsymbol{\beta}) &= \frac{1}{2n} \sum_{i=1}^n \left(y_i - \sum_{k=1}^p x_{ik}\beta_k\right)^2 + \lambda \sum_{k=1}^p \vert{}\beta_k\vert{} \\ &= \frac{1}{2n}\sum_{i = 1}^n(r_i^{(j)} - x_{ij}\beta_j)^2 + \lambda\sum_{k \neq j}|\beta_k| + \lambda |\beta_j| \\ &= \frac{1}{2n}(\sum_{i = 1}^nr_i^{(j)^2}) -\frac{1}{n}(\sum_{i=1}^nr_i^{(j)}x_{ij})\beta_j+ \frac{1}{2n}(\sum_{i=1}^nx_{ij}^2)\beta_j^2+\lambda\sum_{k \neq j}|\beta_k| + \lambda |\beta_j| \\ &=  \frac{1}{2n}(\sum_{i = 1}^nr_i^{(j)^2}) -\frac{1}{n}(\mathbf{x_j}^T\mathbf{r}^{(j)})\beta_j+ \frac{1}{2n}\left\|\mathbf{x_j}\right\|_2^2\beta_j^2+\lambda\sum_{k \neq j}|\beta_k| + \lambda |\beta_j|\end{align*}
$$

Sau đó đặt:

$$
z_j = \frac{1}{n}\sum_{i=1}^nx_{ij}^2 = \frac{1}{n}\left\|\mathbf{x_j}\right\|_2^2 \qquad \rho_j = \frac{1}{n}\sum_{i=1}^n x_{ij}r_i^{(j)} = \frac{1}{n}\mathbf{x_j}^T\mathbf{r^{(j)}}
$$

Viết lại $J(\beta)$ như sau:

$$
\begin{align*}J(\beta) &= (\frac{1}{2n}(\sum_{i = 1}^nr_i^{(j)^2})+\lambda\sum_{k \neq j}|\beta_k|)+g(\beta_j) \\ &= (\frac{1}{2n}(\sum_{i = 1}^nr_i^{(j)^2})+\lambda\sum_{k \neq j}|\beta_k|)+\frac{1}{2} z_j \beta_j^2 - \rho_j \beta_j + \lambda \vert{}\beta_j\vert{}\end{align*}
$$

Sau đó đạo hàm theo biến $\beta_j$ và cập nhật tham số ở thời điểm này

$$
\frac{\partial J}{\partial w_j} = z_j\beta_j - \rho_j+\lambda \partial |\beta_j|
$$

Ta dùng khái niệm sub-gradient để tính $\partial |\beta_j|$ như sau:

$$
\partial \vert{}\beta_j\vert{} = \begin{cases} \{+1\} & \text{nếu } \beta_j > 0 \\ \{-1\} & \text{nếu } \beta_j < 0 \\ [-1, 1] & \text{nếu } \beta_j = 0 \end{cases}
$$

Theo điều kiện tối ưu Karush-Kuhn-Tucker (KKT) cho hàm lồi không khả vi, $\beta_j^*$ là điểm cực tiểu toàn cục của $g(\beta_j)$ khi và chỉ khi giá trị $0$ nằm trong tập dưới vi phân của $g(\beta_j)$:

$$
0 \in \partial g(\beta_j) = z_j \beta_j - \rho_j + \lambda \cdot \partial \vert{}\beta_j\vert{}
$$

Ta xét 3 trường hợp tương ứng của $\beta_j$:

1. **Trường hợp 1: Giả sử nghiệm** $\beta_j > 0$
Khi đó $\partial \vert{}\beta_j\vert{} = +1$. Phương trình tối ưu trở thành:

$$
z_j \beta_j - \rho_j + \lambda(1) = 0 \implies \beta_j = \frac{\rho_j - \lambda}{z_j}
$$

Để giả thiết $\beta_j > 0$ đúng (với $z_j > 0$), điều kiện cần và đủ là $\rho_j > \lambda$.

2. **Trường hợp 2: Giả sử nghiệm** $\beta_j < 0$
Khi đó $\partial \vert{}\beta_j\vert{} = -1$. Phương trình tối ưu trở thành:

$$
z_j \beta_j - \rho_j + \lambda(-1) = 0 \implies \beta_j = \frac{\rho_j + \lambda}{z_j}
$$

Để giả thiết $\beta_j < 0$ đúng, điều kiện cần và đủ là $\rho_j < -\lambda$.

3. **Trường hợp 3: Giả sử nghiệm** $\beta_j = 0$
Khi đó tồn tại $v \in [-1, 1]$ sao cho:

$$
z_j(0) - \rho_j + \lambda v = 0 \implies v = \frac{\rho_j}{\lambda}
$$

Vì $v \in [-1, 1]$, điều này tương đương với $-1 \le \frac{\rho_j}{\lambda} \le 1 \iff \vert{}\rho_j\vert{} \le \lambda$.

Hệ quả là ta có thao tác để cập nhật cho $\beta_j$ là

$$
\beta_j \leftarrow \frac{S(\rho_j, \lambda)}{z_j} = \begin{cases} \dfrac{\rho_j - \lambda}{z_j} & \text{nếu } \rho_j > \lambda \\ 0 & \text{nếu } \vert{}\rho_j\vert{} \le \lambda \\ \dfrac{\rho_j + \lambda}{z_j} & \text{nếu } \rho_j < -\lambda \end{cases}
$$

Hàm $S(\rho_j, \lambda) = \text{sign}(\rho_j) \max(\vert{}\rho_j\vert{} - \lambda, 0)$ được gọi là **Toán tử ngưỡng mềm (Soft-Thresholding operator)**.

**Ý nghĩa của công thức:**

- Đại lượng $\rho_j = \frac{1}{n} \mathbf{x}_j^T \mathbf{r}^{(j)}$ đo lường mức độ đóng góp của biến thứ $j$ vào việc giải thích phần sai số còn lại. Nếu không có phạt Lasso ($\lambda = 0$), nghiệm hồi quy đơn biến chính là $\beta_j^{\text{OLS}} = \rho_j / z_j$.

Trong thực tế (như thư viện `glmnet` hoặc `scikit-learn`), thuật toán Coordinate Descent cho Lasso được thực thi như sau:

1. **Khởi tạo:** Gán vector trọng số ban đầu $\boldsymbol{\beta}^{(0)} = \mathbf{0}$ (hoặc từ nghiệm trước đó), tính vector phần dư toàn cục $\mathbf{r} = \mathbf{y} - X\boldsymbol{\beta}^{(0)}$.
2. **Vòng lặp theo chu kỳ (Cyclic updates):** Lặp qua từng tọa độ $j = 1, 2, \dots, p$:
    - Cộng trả lại đóng góp hiện tại của biến $j$ vào phần dư để lấy phần dư từng phần: $\mathbf{r}^{(j)} = \mathbf{r} + \mathbf{x}_j \beta_j^{\text{cũ}}$.
    - Tính độ tương quan $\rho_j = \frac{1}{n} \mathbf{x}_j^T \mathbf{r}^{(j)}$.
    - Cập nhật trọng số mới bằng ngưỡng mềm: $\beta_j^{\text{mới}} \leftarrow \frac{S(\rho_j, \lambda)}{z_j}$.
    - Cập nhật lại phần dư toàn cục chỉ trong $O(n)$ phép tính:
        
        $\mathbf{r} \leftarrow \mathbf{r} - \mathbf{x}_j (\beta_j^{\text{mới}} - \beta_j^{\text{cũ}})$.
        
3. **Điều kiện dừng:** Lặp lại bước 2 cho đến khi độ thay đổi lớn nhất của các trọng số $\max_j \vert{}\beta_j^{\text{mới}} - \beta_j^{\text{cũ}}\vert{}$ nhỏ hơn ngưỡng sai số $\epsilon$ (ví dụ $10^{-4}$).

### Một góc nhìn khác

1. Khi $\lambda = 0$:

$$
J(\beta) = \sum_{i=1}^n \left(r_i^{(j)} - x_{ij}\beta_j\right)^2 = \left\Vert{}\mathbf{r}^{(j)} - \beta_j \mathbf{x}_j\right\Vert{}_2^2
$$

Trong không gian $\mathbb{R}^n$ (với $n$ là số mẫu dữ liệu):

- $\mathbf{r}^{(j)}$ là vector phần dư từng phần.
- $\mathbf{x}_j$ là vector cột thứ $j$ của ma trận dữ liệu $X$.
- $\beta_j \mathbf{x}_j$ là một vector nằm trên đường thẳng đi qua $\mathbf{x}_j$.

Việc tìm $\beta_j$ để cực tiểu hóa $J(\beta)$ là một phép chiếu trực giao (orthogonal projection) lên đường thẳng đi qua vector $\mathbf{x_j}$, ta có công thức như sau

$$
\beta_j^{OLS}= \text{proj}_{\mathbf{x}_j} \left(\mathbf{r}^{(j)}\right) = \underbrace{\left(\frac{\langle \mathbf{r}^{(j)}, \mathbf{x}_j \rangle}{\Vert{}\mathbf{x}_j\Vert{}_2^2}\right)}_{\beta_j^{\text{OLS}}} \mathbf{x}_j = \left(\frac{\rho_j}{z_j}\right) \mathbf{x}_j
$$

Phần dư mới sau khi cập nhật $\beta_j$ là $\mathbf{r}^{\text{mới}} = \mathbf{r}^{(j)} - \beta_j^{\text{OLS}} \mathbf{x}_j$ sẽ **vuông góc** với cột $\mathbf{x}_j$ (nghĩa là $\mathbf{x}_j^T \mathbf{r}^{\text{mới}} = 0$)

Như vậy, nếu $\lambda = 0$, thuật toán Coordinate Descent chính là **chiếu trực giao liên tiếp** vector sai số lên từng cột $\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_p$ (trong toán học giải tích số, thuật toán này còn gọi là phương pháp Gauss-Seidel).

2. Khi $\lambda > 0$ (lasso):

Khi có lasso thì quy tắc cập nhật khác đi

Lasso thay đổi độ dài của hình chiếu trực giao này:

1. Đầu tiên, thuật toán vẫn **chiếu trực giao** $\mathbf{r}^{(j)}$ lên $\mathbf{x}_j$. Độ dài hình chiếu được đo qua $\rho_j = \frac{1}{n}\mathbf{x}_j^\top \mathbf{r}^{(j)}$: nghiệm OLS là $\beta_j^{\text{OLS}} = \rho_j / z_j$, tức hình chiếu là $\beta_j^{\text{OLS}}\mathbf{x}_j$.
2. Sau đó, thay vì đi hết hình chiếu như OLS, toán tử ngưỡng mềm $S(\rho_j, \lambda)$ **kéo hệ số về phía 0 một đoạn $\lambda / z_j$**, nghĩa là hình chiếu bị kéo lùi về phía gốc tọa độ một đoạn bằng $\lambda / z_j$ lần vector $\mathbf{x}_j$:
   - Nếu hình chiếu quá ngắn ($|\rho_j| \le \lambda$), thuật toán bỏ hẳn hình chiếu: $\beta_j = 0$ và phần dư mới bằng đúng phần dư riêng phần, $\mathbf{r}^{\text{mới}} = \mathbf{r}^{(j)}$.
   - Nếu hình chiếu đủ dài ($|\rho_j| > \lambda$), phần dư mới $\mathbf{r}^{\text{mới}} = \mathbf{r}^{(j)} - \beta_j \mathbf{x}_j$ **không còn vuông góc** với $\mathbf{x}_j$, mà dừng ở chỗ tích vô hướng đúng bằng mức phạt: $\frac{1}{n}\mathbf{x}_j^\top \mathbf{r}^{\text{mới}} = \lambda \operatorname{sign}(\beta_j)$.

Gộp hai trường hợp lại, sau mỗi bước cập nhật ta luôn có $\big|\frac{1}{n}\mathbf{x}_j^\top \mathbf{r}^{\text{mới}}\big| \le \lambda$, với dấu bằng khi $\beta_j \ne 0$. Đây chính là điều kiện tối ưu (KKT) của Lasso theo tọa độ $j$. OLS ép tích vô hướng này về đúng $0$, còn Lasso chỉ cần nó nằm trong khoảng $[-\lambda, \lambda]$: chỉ phần hình chiếu vượt ra ngoài khoảng đó mới được dùng để cập nhật $\beta_j$.

Hãy kéo đầu mút của $\mathbf{r}^{(j)}$ và thay đổi $\lambda$ trong hình dưới đây. Trục ngang là đường thẳng qua $\mathbf{x}_j$, đo theo bội của $\mathbf{x}_j$, và các cột đã được chuẩn hóa ($z_j = 1$). Để ý rằng nếu tịnh tiến $\mathbf{r}^{\text{mới}}$ về gốc tọa độ, đầu mút của nó luôn nằm trong vùng xám, và nằm đúng trên mép vùng xám khi $\beta_j \ne 0$.

<div data-widget="lasso-projection" data-lang="vi"></div>


<details>
    <summary>Giải thích thêm</summary>

Soft-thresholding operator kéo ngắn hình chiếu lại một đoạn $\lambda / z_j$ là do quy tắc cập nhật:

$$
\beta_j^{\text{Lasso}} = \frac{\rho_j - \lambda}{z_j} = \frac{\rho_j}{z_j} -\frac{\lambda}{z_j} = \beta^{OLS} - \frac{\lambda}{z_j}
$$

Trong đó $\beta^{OLS}$ là hệ số của phép chiếu trực giao khi $\lambda = 0$, ta cũng có điều tương tự khi $\rho_j < - \lambda$.

Nếu xét vector hình chiếu $\hat{\mathbf{y}}_j^{OLS}$

- Khi $\lambda  = 0$, ta đi từ gốc tọa độ đến chân đường vuông góc:

$$
\hat{\mathbf{y}}_j^{\text{OLS}} = \beta_j^{\text{OLS}} \mathbf{x}_j = \left(\frac{\rho_j}{z_j}\right) \mathbf{x}_j
$$

- Khi $\lambda > 0$, điểm dừng mới là:

$$
\hat{\mathbf{y}}_j^{\text{Lasso}} = \beta_j^{\text{Lasso}} \mathbf{x}_j = \left(\frac{\rho_j}{z_j} - \frac{\lambda}{z_j}\right) \mathbf{x}_j = \hat{\mathbf{y}}_j^{\text{OLS}} - \left(\frac{\lambda}{z_j}\right) \mathbf{x}_j \tag{1}
$$

Như vậy, trên đường thẳng định hướng bởi vector $\mathbf{x}_j$, điểm chiếu đã bị **lùi lại một đoạn bằng** $\frac{\lambda}{z_j}$ **lần đơn vị của vector** $\mathbf{x}_j$.

Nhìn vào (1) ta có thể thấy 2 trường hợp như sau:

- $|\rho_j| > \lambda$: Thì hình chiếu của vector phần dư sẽ bị kéo về hướng của góc tọa độ một đoạn $\lambda / z_j$.  Cụ thể, nếu $\rho_j > \lambda$ thì $\beta_j^{\text{Lasso}} = \beta_j^{\text{OLS}} - \lambda / z_j$; nếu $\rho_j < -\lambda$ thì $\beta_j^{\text{Lasso}} = \beta_j^{\text{OLS}} + \lambda / z_j$.
- $|\rho_j| \le \lambda$: độ dài hình chiếu $|\beta_j^{\text{OLS}}| = |\rho_j| / z_j$ không vượt quá đoạn bị kéo lùi $\lambda / z_j$. Nếu tiếp tục kéo lùi, điểm chiếu sẽ vượt qua gốc tọa độ và $\beta_j$ đổi dấu, mâu thuẫn với giả thiết dấu ở trường hợp 1 và 2. Hệ quả là ta có: $\beta_j^{\text{Lasso}} = 0$
    - Có thể nhìn cái này dưới một góc độ khác như sau, ta có:
    
    $$
    \rho_j = \frac{1}{n} \mathbf{x}_j^T \mathbf{r}^{(j)} = \frac{1}{n} \Vert{}\mathbf{x}_j\Vert{}_2 \cdot \Vert{}\mathbf{r}^{(j)}\Vert{}_2 \cdot \cos(\theta)
    $$
    
    Trong đó $\theta$ là góc tạo bởi vector đặc trưng $\mathbf{x}_j$ và vector phần dư $\mathbf{r}^{(j)}$
    
    - Khi $\theta \approx 90\degree$ → $\cos(\theta) \approx 0$ → Nghĩa là 2 vector đặc trưng $\mathbf{x_j}$ và vector phần dư từng phần $r^{(j)}$ này gần như vuông góc với nhau, hệ quả là hình chiếu của vector phần dư từng phần ($\beta_j\mathbf{x_j}$) gần như là trùng với gốc tọa độ → $\beta_j = 0$

</details>

Một phương pháp khác để giải bài toán không khả vi của lasso regression là [Proximal Gradient Descent.](../2026-11-08-proximal-gradient-descent/en.md)

## References
1. [Subgradient Methods](https://web.stanford.edu/class/ee364b/lectures/subgrad_method_notes.pdf)
2. [Proximal Gradient Descent (and Acceleration)](https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf)
3. [Coordinate Descent Algorithms](https://arxiv.org/html/1502.04759v1)
4. [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)