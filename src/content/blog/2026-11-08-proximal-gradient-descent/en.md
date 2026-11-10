---
title: "Proximal Gradient Descent"
description: ""
pubDate: 2026-11-08
tags: [convex optimization, first-order methods, non-smooth optimization, proximal gradient, lasso]
series: "First-order Methods"
cover: ./assets/Frank_Wolfe_vs_Projected_Gradient.webm.jpg
draft: false
---

## Introduction
### Sub-gradient method

Consider the problem 

$$
\min_x f(x)
$$

with $f$ convex, and $\operatorname{dom}(f) = \mathbb{R}^n$. Subgradient method choose an initial $x^{(0)} \in \mathbb{R}^n$, and repeat:

$$
x^{(k)} = x^{(k-1)} - t_kg^{(k-1)}, k = 1, 2, 3, \dots
$$

where $g^{(k-1)} \in \partial  f(x^{(k-1)})$. We use pre-set rules for the step sizes
(e.g., diminshing step sizes rule)

If $f$ is Lipschitz, then subgradient method has a convergence rate
$O(\frac{1}{\epsilon^2})$

Trong đoạn trên tác giả đề cập tới phương pháp sử dụng sub-gradient cho các bài toán tối ưu hàm lồi không khả vi $f(x)$.

Tuy phương pháp này tốt, nhưng hạn chế của nó là tốc độ hội tụ chậm.

Đối với Lasso regression, hàm $f(x)$ không hẳn là một hàm khả vi mà nó là một hàm kết hợp bởi các hàm thành phần (Composite function) như sau:

$$
f(x) := g(x) + h(x)
$$

Trong đó:

- $g(x)$**:** Là hàm lồi và **khả vi trơn** (Trong Lasso: $g(\beta) = \frac{1}{2}\Vert{}y - X\beta\Vert{}_2^2$).
- $h(x)$**:** Là hàm lồi, **không khả vi** nhưng có cấu trúc đơn giản (Trong Lasso: $h(\beta) = \lambda \Vert{}\beta\Vert{}_1$).

### An idea

Trong gradient descent as quadratic approximation ta có tính chất như sau:

Nếu $f(x)$ khả vi, công thức cập nhật điểm tiếp theo $x^+ = x - t\nabla f(x)$ với $t$ là learning rate

Công thức cập nhật trên được rút ra từ đạo hàm của quadratic approximation (cụ thể là hệ quả từ khai triển taylor bậc 1 kết hợp với l2 regularization quanh điểm $z = x$ như sau:

$$
x^+ = \arg \min_z \{f(x)+ \nabla f(x)^T(z - x) + \frac{1}{2t}\left\|z - x\right\|_2^2\}
$$

$$
\Rightarrow z = x - t \nabla f(x)
$$

Nhưng nếu $f(x)$ không hoàn toàn khả vi thì sao? Nghĩa là nếu $f(x)$ có dạng

$$
f(x) := g(x) + h(x)
$$

Trong đó, $g(x)$**:** Là hàm lồi và **khả vi trơn,** $h(x)$**:** Là hàm lồi, **không khả vi** nhưng có cấu trúc đơn giản.

Nếu vậy thì phương pháp xấp xỉ bậc 2 trên không hợp lý vì hàm này không hoàn toàn khả vi.

Câu hỏi mà tác giả đặt ra là “Tại sao chúng ta không **chỉ xấp xỉ bậc hai cho phần trơn** $g(x)$, còn phần không khả vi $h(x)$ **thì giữ nguyên không đụng vào**?”

Theo ý tưởng này ta có cách cập nhật mới như sau:

$$
\begin{align*}x^+ &= \arg \min_z \{\tilde{g_t}(z)+ h(z)\} \\ &= \arg \min_z \{g(x) + \nabla g(x)^T(z - x) + \frac{1}{2t}\left\|z - x\right\|_2^2 + h(z)\} \\&= \arg \min_z \{\nabla g(x)^T(z - x) + \frac{1}{2t}\left\|z - x\right\|_2^2 + h(z)\}\end{align*} \tag{1}
$$

Ta biến đổi bình phương đủ sau:

$$
\begin{align*}\nabla g(x)^T (z - x) + \frac{1}{2t}\Vert{}z - x\Vert{}_2^2 &= \frac{1}{2t} \left( \Vert{}z - x\Vert{}_2^2 + 2t \nabla g(x)^T (z - x) \right) \\ &= \frac{1}{2t}\left( \Vert{}z - x\Vert{}_2^2 + 2t \nabla g(x)^T (z - x) + t^2\left\|\nabla g(x)\right\|_2^2 - t^2\left\|\nabla g(x)\right\|_2^2\right) \\ &= \frac{1}{2t} \left\|z - x +t\nabla g(x)\right\|_2^2 - \frac{t}{2}\left\|\nabla g(x)\right\|_2^2\end{align*}
$$

Viết lại (1) như sau;

$$
\begin{align*}x^+ &= \arg \min_z \{\nabla g(x)^T(z - x) + \frac{1}{2t}\left\|z - x\right\|_2^2 + h(z)\} \\ &= \arg \min_z \{\frac{1}{2t} \left\|z - x +t\nabla g(x)\right\|_2^2 - \frac{t}{2}\left\|\nabla g(x)\right\|_2^2+h(z)\} \\ &= \arg \min_z \{\frac{1}{2t} \left\|z - x +t\nabla g(x)\right\|_2^2 + h(z)\}\end{align*}
$$

> **Ý nghĩa được tác giả nhấn mạnh:**
> 
> 
> Điểm cập nhật mới $z$ phải thỏa mãn đồng thời:
> 
> 1. Cụm thứ nhất muốn $z$ phải nằm thật gần điểm $x - t\nabla g(x)$ (vốn là bước nhảy Gradient Descent thông thường trên phần trơn $g$).
> 2. Cụm thứ hai bắt $z$ phải làm cho hàm phạt không khả vi $h(z)$ càng nhỏ càng tốt (với Lasso là kéo các tọa độ của $z$ về $0$). Nghĩa là phải đồng thời làm cho $h(z)$ nhỏ đi.

Tác giả định nghĩa thêm ánh xạ proximal như sau:

$$
\text{prox}_{h, t}(u) = \arg\min_z \left\{ \frac{1}{2t}\Vert{}u - z\Vert{}_2^2 + h(z) \right\}
$$

Nếu cho $u = x - t\nabla g(x)$ thì ta có quy tắc cập nhật $x^+$ như sau:

$$
x^+ = \text{prox}_{h, t}(x - t\nabla g(x))
$$

Khi đó, mỗi vòng lặp thứ $k$ của thuật toán **Proximal Gradient Descent** chỉ gồm 2 bước:

1. **Bước Gradient (trên phần khả vi** $g$**):** Tính điểm trung gian $u^{(k)} = x^{(k-1)} - t_k \nabla g(x^{(k-1)})$.
2. **Bước Proximal (trên phần không khả vi $h$):** Đưa điểm trung gian đó qua bộ lọc Proximal:

$$
x^{(k)} = \text{prox}_{h, t_k}\left( x^{(k-1)} - t_k \nabla g(x^{(k-1)}) \right)
$$

What good did this for?

Tác giả tự đặt câu hỏi phản biện: *"Trông có vẻ như ta chỉ đang đánh tráo bài toán tối ưu này bằng một bài toán tối ưu* $\arg\min_z$ *khác?"*

Câu trả lời nằm ở chỗ:

- Trong bài toán gốc $\min \{g(z) + h(z)\}$, hàm $g(z)$ (như $\frac{1}{2}\Vert{}y - Xz\Vert{}_2^2$) có ma trận $X$ làm các biến $z_1, \dots, z_p$ bị trộn lẫn vào nhau.
- Nhưng trong định nghĩa của $\text{prox}_{h,t}(u)$, hàm phức tạp $g(z)$ không còn nữa. Thay vào đó là khoảng cách bình phương hình cầu đơn giản $\frac{1}{2t}\Vert{}u - z\Vert{}_2^2 = \frac{1}{2t}\sum_{i=1}^p (u_i - z_i)^2$. Nhờ vậy, bài toán $\text{prox}_{h,t}(u)$ giải ra được **nghiệm đóng (closed-form)** ngay lập tức cho rất nhiều hàm không khả vi $h(z)$.
</aside>

Nhờ vào đặc tính này mà ta có thể giải quyết vấn đề không khả vi của lasso

!image.png

!image.png

!image.png

!image.png

Một ứng dụng quan trọng của thuật toán này được đề cập như sau:

**Tăng tốc Nesterov thành thuật toán FISTA (Trang 21 – 29):**

Ở nửa sau bài giảng, tác giả chỉ ra rằng chỉ cần thêm một bước quán tính (momentum) cực nhẹ trước khi tính gradient:

$$
v = \beta^{(k-1)} + \frac{k-2}{k+1}\left(\beta^{(k-1)} - \beta^{(k-2)}\right)
$$

$$
\beta^{(k)} = S_{\lambda t_k}\left( v + t_k X^T(y - Xv) \right)
$$

Thuật toán này gọi là **FISTA (Fast ISTA)**, đẩy tốc độ hội tụ từ $O(1/k)$ lên mức tối ưu lý thuyết $O(1/k^2)$ (chỉ cần $O(1/\sqrt{\epsilon})$ bước lặp) mà hầu như không tốn thêm chi phí tính toán nào.

# References

1. [Proximal Gradient Descent](https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf)