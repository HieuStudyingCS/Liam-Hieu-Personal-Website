---
title: "Coordinate Descent"
description: "Thuật toán Coordinate descent giải quyết các bài toán tối ưu hóa bằng cách liên tiếp thực hiện việc cực tiểu hóa xấp xỉ dọc theo các huớng tọa độ hoặc theo siêu mặt phẳng tọa độ."
pubDate: 2026-11-07
tags: [black-box optimization, coordinate descent]
series: "Black-box Optimization"
cover: ./assets/Coordinate Search and Descent.png
draft: true
---

## Mở đầu
# Abstract

Thuật toán Coordinate descent giải quyết các bài toán tối ưu hóa bằng cách liên tiếp thực hiện việc cực tiểu hóa xấp xỉ dọc theo các huớng tọa độ hoặc theo siêu mặt phẳng tọa độ.

# Introduction

They are iterative methods in which each iterate is obtained by fixing most components of the variable vector $\mathbf{x}$ at their values from the current iteration, and approximately minimizing the objective with respect to the remaining components. Each such subproblem is a lower-dimensional (even scalar) minimization problem, and thus can typically be solved more easily than the full problem

Câu nói trên có thể hiểu như sau:

- Bắt đầu từ một điểm dự đoán ban đầu cho tất cả các biến số trong vector $\mathbf{x}$.
- Tại mỗi bước lặp, thuật toán sẽ chọn ra một biến (hoặc nhóm nhỏ các biến) để tối ưu. Tất cả các biến còn lại sẽ bị xem như là hằng số tại thời điểm lặp.
- Nếu ta nhìn bài toán dưới góc độ này thì giống như là ta đang giảm đi số chiều của bài toán đang cần được giải quyết. Hệ quả là tính toán đạo hàm sẽ đơn giản hơn, hơn nữa việc chọn một trục tọa độ và tìm cực tiểu trên đó lại đỡ tốn tài nguyên tính toán hơn so với bài toán quy mô lớn (đa chiều).
- Sau khi tìm được giá trị tối ưu cho biến đó, thuật toán lại quay chuyển qua biến tiếp theo rồi sau đó lặp lại quy trình cũ.
    
    Nghĩa là nếu vector $\mathbf{x} = \begin{bmatrix}x_1 \\ x_2 \\ \dots \\ x_n\end{bmatrix}$thì quy trình cập nhật sẽ 
    
    là $x_1 \rightarrow x_2 \rightarrow \dots \rightarrow x_n \rightarrow x_1 \rightarrow x_2 \dots$
    
- Quá trình này có thể được mô tả như việc giảm giá trị trên tất cả các trục tọa độ, giúp cho thuật toán tiếp cận gần với điểm hội tụ hơn (đáy bát).

*Lưu ý*: quá trình cập nhật tuần tự trên được gọi là **Cyclic Coordinate Descent,** trong thực tế thì ta còn nhiều cách cập nhật khác như Randomized Coordinate Descent hay Greedy/Gauss-Southwell rule.

Nhờ ý tưởng này mà thuật toán trên được ứng dụng rộng rãi trong các trường hợp như:

- non-smooth regularizations (lasso) terms
- A small number of equality constraints

*Lưu ý:* Trong bài này thì chỉ đề cập tới việc chỉnh sửa/cập nhật trên một trục tọa độ, nhưng thông thường thì chúng ta thường dùng tới method cập nhật trên nhiều trục tọa độ hơn (block coordinate descent).

## Formulations

Trong paper này sẽ mentioned tới một dạng bài toán tối thiểu hóa không điều kiện như sau:

$$
\min_\mathbf{x} f(\mathbf{x})
$$

Trong đó, $f: \mathbb{R}^n \to \mathbb{R}$ là một hàm liên tục. 

Trong một số phiên bản khác của thuật toán CD, ta thường có thể thêm điều kiện cho $f$ như $f$ phải trơn và lồi, hay trơn nhưng có thể có không lồi…

Ta thường sử dụng các hàm số có dạng như sau trong đa phần các bài toán mà CD có thể giải hiệu quả:

$$
\min_\mathbf{x} h(\mathbf{x}) := f(\mathbf{x}) + \lambda \Omega(\mathbf{x})
$$

Trong đó $f$ trơn. $\Omega$ là hàm điều chuẩn (là thành phần regularization) và hàm này có thể là hàm không trơn, và có thể có giá trị là vô cùng, $\lambda > 0$ là hệ số điều chuẩn.

Thông thường, $\Omega$ là một hàm lồi (convex) và thường được ngầm nhận định là có thể phân tách thành từng biến (separable) hoặc phân tách thành một nhóm các biến (block-separable)

Nói thêm: Separable và block-separable là gì?

Một hàm $\Omega$ được xem là một hàm có thể tách biệt được trên một vector nhiều chiều $\mathbf{x} = (x_1, x_2, \dots, x_n)^T$ khi ta có thể viết hàm ban đầu dưới dạng tổng của các hàm độc lập, mỗi hàm chỉ xử lý một biến duy nhất

$$
\Omega(\mathbf{x}) = \Omega_1(x_1) +\Omega_2(x_2) + \dots + \Omega_n(x_n)
$$

Có thể lấy ví dụ là hàm ridge như sau:

$$
\left\| \mathbf{x} \right\|_2^2 = x_1^2 + x_2^2 + \dots + x_n^2
$$

Vậy thì block-separable nghĩa là ta có thể tách biệt theo các block

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

Vậy nếu như $\Omega$ là hàm separable thì nghĩa là ta có thể viết hàm này dưới dạng như sau:

$$
Ω⁡(x)=\sum_{i=1}^nΩ_i(x_i)
$$

Trong đó, $\Omega_i: \mathbb{R} \to \mathbb{R}, \forall i$

Ngoài ra, paper còn note thêm về việc sử dụng submatrices $U_i, i = 1, 2,\dots, N$ để tách vector $\mathbf{x}$ ban đầu thành các blocks và biểu diễn lại $\Omega(\mathbf{x})$ như sau

$$
\Omega(\mathbf{x}) = \sum_{i=1}^N\Omega_i(U_i^T\mathbf{x})
$$

Ngoài ra, authors còn nói về box constraints, có thể giải thích về khái niệm này như sau:

- Các hàm thành phần $\Omega_i(x_i)$ là một hàm chỉ thị (indicator function) $I_{[l_i, u_i]}(x_i)$ cho khoảng $[l_i, u_i]$
- $[l_i, u_i]$ là giới hạn ràng buộc cho giá trị mà $x_i$ có thể nhận, nghĩa là $x_i$ chỉ có thể nhận giá trị trong khoảng từ cận dưới $l_i$ đến cận trên $u_i$. Khi mô tả dưới dạng hình học giải tích thì nó giống như một cái hộp nên mới gọi là box constraints.

 $I_{[l_i, u_i]}(x_i) = \begin{cases}0 \text{ , } x_i \in [l_i, x_i] \\ +\infty, x_i \notin [l_i, x_i]\end{cases}$

Trong optimization, nhờ hàm chỉ thị mà ta có thể ép các trọng số phải luôn nằm trong một không gian hình chữ nhật cố định.

- Các ràng buộc hoàn toàn độc lập với nhau, ví dụ $1 \leq x_1 \leq 5$ và $-2 \leq x_2 \leq 5$.
- Nên có thể thấy thêm một ưu điểm nữa của CD so với các thuật toán tối ưu hóa khác nằm ở chỗ CD tối ưu dựa trên một biến hoặc một nhóm các biến, nên việc gắn thêm constraints cho từng biến không làm cho bài toán bị phức tạp lên quá mức. Trong khi việc gắn thêm 1 constraint vào các thuật toán tối ưu khác cũng làm cho bài toán trở nên phức tạp hơn rất nhiều.

Sau đó, tác giả nói về group-sparse regularizers, nghĩa là các hàm thành phần $\Omega_i(z_i)$ áp dụng l2-norm cho từng khối

$$
\Omega_i(z_i) := \left\|z_i\right\|_2
$$

Ưu điểm của cách này so với separable nằm ở chỗ thay vì ép từng biến về $0$ thì nó sẽ hoặc là làm các biến trong block này được giữ lại (khác $0$) hoặc làm toàn bộ các biến đều bị ép về $0$ đồng thời.

!image.png

Note một tí để đọc dễ hiểu hơn:

- Trong optimization, các bài toán gốc được gọi là bài toán nguyên thủy (primal problem) đều có một bài toán tương đương với nó được gọi là bài toán đối ngẫu (dual problem)
- Về mặt đại số có thể tưởng tượng như sau, giả sử ta có $f(w) \geq g(x)$, bài toán nguyên thủy là bài toán đi tìm điểm cực tiểu của $f(w)$. Với bất đẳng thức trên, nếu ta đẩy cận dưới $g(x)$ lên cao nhất có thể (chạm tới $f(w)$) thì có nghĩa là ta đi tìm $\max_x g(x)$ → Đây là bài toán đối ngẫu trong trường hợp $g$ là hàm lồi.

Ví dụ bài toán đối ngẫu

# Application in computing lasso regression

$$
J(\boldsymbol{\beta}) = \frac{1}{2n} \Vert{}\mathbf{y} - X\boldsymbol{\beta}\Vert{}_2^2 + \lambda \Vert{}\boldsymbol{\beta}\Vert{}_1 = \frac{1}{2n} \sum_{i=1}^n \left(y_i - \sum_{k=1}^p x_{ik}\beta_k\right)^2 + \lambda \sum_{k=1}^p \vert{}\beta_k\vert{}
$$

Vấn đề của Gradient descent là hàm thành phần regularization không khả vi tại các điểm $\beta_k = 0$ → Chuyển qua coordinate descent (tối ưu trên từng coordinate thay vì tối ưu toàn bộ coordinate hay tối ưu không gian đa chiều)

## Về mặt đại số - giải tích

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

1. **Trường hợp 2: Giả sử nghiệm** $\beta_j < 0$
Khi đó $\partial \vert{}\beta_j\vert{} = -1$. Phương trình tối ưu trở thành:

$$
z_j \beta_j - \rho_j + \lambda(-1) = 0 \implies \beta_j = \frac{\rho_j + \lambda}{z_j}
$$

Để giả thiết $\beta_j < 0$ đúng, điều kiện cần và đủ là $\rho_j < -\lambda$.

1. **Trường hợp 3: Giả sử nghiệm** $\beta_j = 0$
Khi đó tồn tại $v \in [-1, 1]$ sao cho:

$$
z_j(0) - \rho_j + \lambda v = 0 \implies v = \frac{\rho_j}{\lambda}
$$

Vì $v \in [-1, 1]$, điều này tương đương với $-1 \le \frac{\rho_j}{\lambda} \le 1 \iff \vert{}\rho_j\vert{} \le \lambda$.

Tiếp theo ta dùng toán tử ngưỡng mềm (soft-thresholding operator) để cập nhật cho $\beta_j$

$$
\beta_j \leftarrow \frac{S(\rho_j, \lambda)}{z_j} = \begin{cases} \dfrac{\rho_j - \lambda}{z_j} & \text{nếu } \rho_j > \lambda \\ 0 & \text{nếu } \vert{}\rho_j\vert{} \le \lambda \\ \dfrac{\rho_j + \lambda}{z_j} & \text{nếu } \rho_j < -\lambda \end{cases}
$$

Hàm $S(\rho_j, \lambda) = \text{sign}(\rho_j) \max(\vert{}\rho_j\vert{} - \lambda, 0)$ được gọi là **Toán tử ngưỡng mềm (Soft-Thresholding)**.

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

## Về mặt hình học - giải tích (orthogonal projection)

Khi $\lambda = 0$:

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

Phần dư mới sau khi cập nhật $\beta_j$ là $\mathbf{r}^{\text{mới}} = \mathbf{r}^{(j)} - \beta_j^{\text{OLS}} \mathbf{x}_j$ sẽ **vuông góc hoàn toàn** với cột $\mathbf{x}_j$ (nghĩa là $\mathbf{x}_j^T \mathbf{r}^{\text{mới}} = 0$)

Như vậy, nếu $\lambda = 0$, thuật toán Coordinate Descent chính là việc **chiếu trực giao liên tiếp** vector sai số lên từng cột $\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_p$ (trong toán học giải tích số, thuật toán này còn gọi là phương pháp chiếu Kaczmarz hay Gauss-Seidel).

Khi $\lambda > 0$ (lasso):

Khi có lasso thì quy tắc cập nhật khác đi

Lasso ảnh hưởng tới độ dài của hình chiếu trực giao này:

1. Đầu tiên, thuật toán vẫn thực hiện **phép chiếu trực giao** $\mathbf{r}^{(j)}$ lên $\mathbf{x}_j$ để đo độ dài hình chiếu (thông qua $\rho_j = \frac{1}{n}\mathbf{x}_j^T \mathbf{r}^{(j)}$).
2. Sau đó, thay vì đi hết độ dài hình chiếu đó như OLS, toán tử ngưỡng mềm $S(\rho_j, \lambda)$ **kéo lùi (co ngắn) hình chiếu lại một đoạn** $\lambda/z_j$ về phía gốc tọa độ:
    - Nếu hình chiếu ban đầu quá ngắn ($\vert{}\rho_j\vert{} \le \lambda$), Lasso xóa bỏ luôn hình chiếu ($\beta_j = 0$), giữ nguyên phần dư.
    - Nếu hình chiếu đủ dài ($\vert{}\rho_j\vert{} > \lambda$), phần dư mới **không hoàn toàn vuông góc** với $\mathbf{x}_j$ nữa, mà dừng lại ở trạng thái tạo với $\mathbf{x}_j$ một tích vô hướng đúng bằng ngưỡng phạt: $\vert{}\frac{1}{n}\mathbf{x}_j^T \mathbf{r}^{\text{mới}}\vert{} = \lambda$.

soft-thresholding operator kéo lùi hình chiếu một đoạn $\lambda / z_j$ là do quy tắc cập nhật:

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

- $|\rho_j| \geq \lambda$: Thì hình chiếu của vector phần dư sẽ bị kéo về hướng của góc tọa độ một đoạn $\lambda / z_j$.
- $|\rho_j| \leq \lambda$: Lúc này hệ số $\beta_j^{Lasso} \leq 0$ nhưng vì $\beta_j^{Lasso} \geq 0$ nên ta chỉ có thể thấy $\beta_j^{Lasso} = 0$ thay vì thấy nó âm.
    - Có thể nhìn cái này dưới một góc độ khác như sau, ta có:
    
    $$
    \rho_j = \frac{1}{n} \mathbf{x}_j^T \mathbf{r}^{(j)} = \frac{1}{n} \Vert{}\mathbf{x}_j\Vert{}_2 \cdot \Vert{}\mathbf{r}^{(j)}\Vert{}_2 \cdot \cos(\theta)
    $$
    
    Trong đó $\theta$ là góc tạo bởi vector đặc trưng $\mathbf{x}_j$ và vector phần dư $\mathbf{r}^{(j)}$
    
    - Khi $\theta \approx 90\degree$ → $\cos(\theta) \approx 0$ → Nghĩa là 2 vector đặc trưng $\mathbf{x_j}$ và vector phần dư từng phần $r^{(j)}$ này gần như vuông góc với nhau, hệ quả là hình chiếu của vector phần dư từng phần ($\beta_j\mathbf{x_j}$) gần như là trùng với gốc tọa độ → $\beta_j = 0$


Một góc nhìn khác cho phương pháp giải lasso regression là proximal gradient descent

available at Proximal Gradient Descent

# References
1. [Subgradient Methods](https://web.stanford.edu/class/ee364b/lectures/subgrad_method_notes.pdf)
2. [Proximal Gradient Descent (and Acceleration)](https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf)
3. [Coordinate Descent Algorithms](https://arxiv.org/html/1502.04759v1)