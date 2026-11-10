## 1. Coordinate Descent: ý tưởng và thuật toán

Coordinate Descent (CD) giảm một hàm nhiều biến bằng cách mỗi lần chỉ cập nhật **một tọa độ** (hoặc một khối tọa độ), giữ nguyên các tọa độ còn lại. Mỗi bước vì thế chỉ là một bài toán một chiều, thường giải được bằng công thức đóng hoặc rất rẻ.

### 1.1. Bài toán và hai kiểu cập nhật

Xét bài toán:

$$
\min_{x \in \mathbb{R}^n} f(x)
$$

**Kiểu 1 — cực tiểu chính xác theo từng tọa độ** (kiểu Gauss–Seidel, dùng ngay giá trị mới nhất của các tọa độ đã cập nhật):

$$
x_i^{k+1} = \arg\min_{t \in \mathbb{R}} \; f\big(x_1^{k+1}, \dots, x_{i-1}^{k+1},\; t,\; x_{i+1}^{k}, \dots, x_n^{k}\big)
$$

**Kiểu 2 — bước gradient trên một tọa độ** (Wright 2015, Algorithm 1). Chọn chỉ số i\_k rồi chỉ đi theo đạo hàm riêng thứ i\_k:

$$
x^{k+1} = x^{k} - \alpha_k \, \big[\nabla f(x^{k})\big]_{i_k} \, e_{i_k}
$$

Trong đó e\_i là vector đơn vị thứ i. Bước nhảy thường chọn α\_k = 1/L\_{i\_k}, với L\_i là hằng số Lipschitz của đạo hàm riêng thứ i dọc theo trục i:

$$
\big|[\nabla f(x + t e_i)]_i - [\nabla f(x)]_i\big| \le L_i \, |t|, \qquad L_{\max} = \max_i L_i
$$

Điểm hay: luôn có 1 ≤ L / L\_max ≤ n, với L là hằng số Lipschitz của toàn bộ gradient. Nghĩa là **bước nhảy theo từng tọa độ (1/L\_i) có thể lớn hơn nhiều so với bước của Gradient Descent (1/L)**, vì mỗi trục chỉ cần "an toàn" theo độ cong của riêng nó.

### 1.2. Mã giả

```
Input: điểm xuất phát x^0, số vòng lặp K
for k = 0, 1, ..., K-1:
    chọn tọa độ i_k trong {1, ..., n}          # theo một quy tắc ở bảng dưới
    x^{k+1} = x^k - (1 / L_{i_k}) * grad_{i_k} f(x^k) * e_{i_k}
return x^K
```

### 1.3. Chọn tọa độ nào để cập nhật?

| Quy tắc | Cách chọn i\_k | Ghi chú |
| --- | --- | --- |
| Cyclic | Lần lượt 1, 2, …, n, 1, 2, … | Đơn giản nhất. Cận lý thuyết kém hơn randomized khoảng một hệ số n (Wright 2015) |
| Randomized | Ngẫu nhiên đều, hoặc với xác suất tỉ lệ L\_i | Có cận hội tụ kỳ vọng gọn gàng (Nesterov 2012) |
| Random permutation | Xáo trộn thứ tự ở đầu mỗi epoch, rồi đi hết n tọa độ | Hay dùng nhất trong thực tế |
| Gauss–Southwell (greedy) | Tọa độ có \|∂f/∂x\_i\| lớn nhất | Mỗi bước giảm nhiều nhất nhưng phải biết cả gradient; hội tụ nhanh hơn random khi gradient rẻ (Nutini et al. 2015) |

### 1.4. Khi nào CD đáng dùng?

CD mạnh khi **một đạo hàm riêng rẻ hơn nhiều so với cả gradient**. Ví dụ với f(x) = φ(Ax), nếu giữ sẵn vector Ax thì cập nhật một tọa độ chỉ tốn O(m) thay vì O(mn). Đó là lý do CD là thuật toán mặc định cho Lasso và Elastic Net (glmnet), SVM tuyến tính (LIBLINEAR, giải bài toán đối ngẫu), và nhiều bài toán thưa.

**Block Coordinate Descent:** thay vì một tọa độ, ta chia biến thành các khối và cực tiểu lần lượt theo từng khối. Các thuật toán quen thuộc như k-means (luân phiên tâm cụm và gán nhãn) hay Alternating Least Squares trong phân rã ma trận đều là dạng này.

## 2. Coordinate Descent: hội tụ, thất bại và ví dụ Lasso

Với hàm lồi và trơn, CD hội tụ với tốc độ cùng bậc với Gradient Descent. Với hàm không trơn, CD có thể **kẹt hoàn toàn**, trừ khi phần không trơn tách được theo từng tọa độ. Lasso rơi đúng vào trường hợp tốt đó.

### 2.1. Tốc độ hội tụ (hàm lồi, trơn)

Với randomized CD, bước nhảy 1/L\_max (Wright 2015, Theorem 3.1), R\_0 là "bán kính" của tập mức ban đầu {x : f(x) ≤ f(x^0)}:

$$
\mathbb{E}\big[f(x^k)\big] - f^\star \le \frac{2\, n\, L_{\max} R_0^2}{k}
$$

Nếu f lồi mạnh với hằng số σ, hội tụ tuyến tính:

$$
\mathbb{E}\big[f(x^k)\big] - f^\star \le \Big(1 - \frac{\sigma}{n L_{\max}}\Big)^{k} \big(f(x^0) - f^\star\big)
$$

So với Gradient Descent bước 1/L: f(x^k) − f\* ≤ 2 L R\_0² / k. CD có thêm hệ số n vì mỗi bước chỉ dùng 1 trong n thành phần gradient. Nhưng vì L ≤ n·L\_max, n bước CD (chi phí xấp xỉ một gradient đầy đủ) thường tiến bộ **ngang hoặc hơn** một bước GD.

### 2.2. Khi nào CD thất bại?

**Hàm không trơn và không tách được.** Ví dụ gọn để đưa vào blog:

$$
f(x, y) = 5\,|x - y| + (x + y - 2)^2
$$

Cực tiểu toàn cục là $(1, 1)$ với $f = 0$. Nhưng tại $(0, 0)$ ($f = 4$):

- Theo trục $x$: $f(t, 0) = 5|t| + (t − 2)²$. Với $t > 0$, đạo hàm là $2t + 1 > 0$; với $t < 0$, đạo hàm là $2t − 9 < 0$. Vậy $t = 0$ là cực tiểu theo trục $x$.
- Theo trục $y$: tương tự do đối xứng.
- Theo đường chéo $(s, s)$: $f = (2s − 2)²$ giảm dần về $0$ khi $s → 1$.

CD đứng yên mãi tại (0, 0) dù đây không phải điểm tối ưu: mọi hướng giảm đều nằm chéo, không trùng trục tọa độ nào. Wikipedia có hình minh hoạ đúng hiện tượng này.

**Hàm không lồi.** Powell (1973) xây dựng một hàm trơn trên ℝ³ mà cyclic CD với cực tiểu chính xác cứ chạy vòng quanh 6 điểm không tối ưu, không bao giờ hội tụ. Chỉ cần nhiễu nhỏ hoặc chọn tọa độ ngẫu nhiên là thoát được (Wright 2015, mục 4).

**Trường hợp vẫn ổn:** nếu hàm có dạng phần trơn cộng phần không trơn **tách được theo từng tọa độ**, CD hội tụ về nghiệm tối ưu (Tseng 2001):

$$
F(x) = g(x) + \sum_{i=1}^{n} h_i(x_i), \qquad g \text{ lồi, khả vi}; \; h_i \text{ lồi}
$$

### 2.3. Ví dụ kinh điển: Lasso bằng Coordinate Descent

Lasso có đúng dạng tách được ở trên, vì ‖β‖₁ = Σ |β\_j|:

```latex
\min_{\beta \in \mathbb{R}^p} \; \frac{1}{2}\,\lVert y - X\beta \rVert_2^2 + \lambda \lVert \beta \rVert_1
```

Cố định mọi hệ số trừ β\_j. Gọi r^{(j)} là phần dư riêng (bỏ đóng góp của cột j). Bài toán một chiều theo β\_j có nghiệm đóng:

```latex
r^{(j)} = y - \sum_{k \ne j} x_k \beta_k, \qquad
\beta_j \leftarrow \frac{S_{\lambda}\big(x_j^{\top} r^{(j)}\big)}{\lVert x_j \rVert_2^2}
```

Với S\_λ là toán tử **soft-thresholding** (kéo z về 0 một lượng λ, và bằng 0 hẳn nếu |z| ≤ λ, đây là lý do Lasso tạo nghiệm thưa):

```latex
S_{\lambda}(z) = \operatorname{sign}(z)\,\max\big(|z| - \lambda,\; 0\big)
```

Mẹo cài đặt: giữ sẵn phần dư r = y − Xβ. Khi đó x\_jᵀr^{(j)} = x\_jᵀr + ‖x\_j‖²β\_j, và sau mỗi lần đổi β\_j chỉ cần cập nhật r trong O(n) (n là số mẫu). Đây là cách glmnet cài đặt (Friedman, Hastie & Tibshirani 2010):

```python
import numpy as np

def soft_threshold(z, lam):
    return np.sign(z) * np.maximum(np.abs(z) - lam, 0.0)

def lasso_cd(X, y, lam, n_sweeps=100):
    n, p = X.shape
    beta = np.zeros(p)
    r = y - X @ beta                  # phần dư
    col_sq = (X ** 2).sum(axis=0)     # ||x_j||^2
    for _ in range(n_sweeps):
        for j in range(p):
            if col_sq[j] == 0:
                continue
            rho = X[:, j] @ r + col_sq[j] * beta[j]     # x_j^T r^(j)
            new = soft_threshold(rho, lam) / col_sq[j]
            r -= X[:, j] * (new - beta[j])              # cập nhật phần dư, O(n)
            beta[j] = new
    return beta
```

## 3. Minh hoạ: Coordinate Descent so với Gradient Descent

&#91;embedded content: đường đi của Coordinate Descent và Gradient Descent trên cùng một hàm bậc hai\]

CD luôn di chuyển song song với trục tọa độ nên đường đi có dạng bậc thang. Trên hàm này, mỗi trục có độ cong Lᵢ = 1 trong khi cả hàm có L = 1.8, nên CD được phép bước dài hơn và về đích nhanh hơn. Nếu hai biến tương quan mạnh hơn (hệ số 0.8 tiến tới 1), các bậc thang sẽ ngắn dần và CD chậm đi rõ rệt. Các số liệu trong hình được tính trực tiếp từ hai thuật toán trên hàm này.

## 4. Proximal Gradient Descent: bài toán, toán tử prox và ISTA

Proximal Gradient Descent giải các bài toán "phần trơn + phần không trơn" bằng hai bước: một bước gradient trên phần trơn, rồi một bước **prox** xử lý phần không trơn. Nó nhanh hơn hẳn subgradient method và bao gồm Gradient Descent, Projected Gradient Descent và ISTA như các trường hợp riêng.

### 4.1. Bài toán composite

```latex
\min_{x \in \mathbb{R}^n} \; F(x) = g(x) + h(x)
```

- g lồi, khả vi, ∇g Lipschitz với hằng số L (ví dụ: hàm loss).
- h lồi, có thể **không khả vi**, nhưng có prox dễ tính (ví dụ: ℓ₁, ràng buộc tập lồi).

### 4.2. Toán tử proximal

```latex
\operatorname{prox}_{t h}(v) = \arg\min_{z} \Big( h(z) + \frac{1}{2t}\,\lVert z - v \rVert_2^2 \Big)
```

Trực giác: tìm điểm z vừa làm h nhỏ, vừa **gần** điểm v. Tham số t càng nhỏ thì z càng bị giữ gần v. Prox chỉ phụ thuộc h, không phụ thuộc g.

| h(x) | prox\_{th}(v) | Thuật toán thu được |
| --- | --- | --- |
| 0 | v | Gradient Descent thường |
| Indicator I\_C (0 trong tập lồi C, +∞ ngoài C) | Phép chiếu P\_C(v) | Projected Gradient Descent |
| λ‖x‖₁ | Soft-thresholding từng thành phần: S\_{λt}(v\_i) | ISTA (Lasso) |
| (λ/2)‖x‖₂² | v / (1 + λt) | Ridge, weight decay |
| λ‖x‖₂ (group lasso, một nhóm) | max(0, 1 − λt/‖v‖₂) · v | Group Lasso |
| λ‖X‖\_\* (chuẩn hạt nhân của ma trận) | Soft-threshold các giá trị kỳ dị (SVT) | Matrix completion |

### 4.3. Thuật toán

```latex
x^{k+1} = \operatorname{prox}_{t h}\big(x^{k} - t\, \nabla g(x^{k})\big)
```

Cách nhìn hữu ích cho blog: mỗi bước cực tiểu **xấp xỉ bậc hai của g** cộng giữ nguyên h:

```latex
x^{k+1} = \arg\min_{z} \Big( g(x^k) + \nabla g(x^k)^{\top}(z - x^k) + \frac{1}{2t}\lVert z - x^k \rVert_2^2 + h(z) \Big)
```

Với t ≤ 1/L, biểu thức trong ngoặc là một **cận trên** của F. Cực tiểu cận trên thì F chắc chắn giảm, đây là ý tưởng majorization–minimization.

Bước cập nhật cũng viết được giống Gradient Descent nhờ **generalized gradient** G\_t (Tibshirani, CMU 10-725):

```latex
G_t(x) = \frac{x - \operatorname{prox}_{t h}\big(x - t \nabla g(x)\big)}{t}, \qquad x^{k+1} = x^{k} - t\, G_t(x^{k})
```

### 4.4. ISTA cho Lasso

Với g(β) = ½‖y − Xβ‖² và h(β) = λ‖β‖₁, ta có ∇g(β) = −Xᵀ(y − Xβ) và L = λ\_max(XᵀX) = ‖X‖₂²:

```latex
\beta^{k+1} = S_{\lambda t}\Big(\beta^{k} + t\, X^{\top}\big(y - X\beta^{k}\big)\Big), \qquad t \le \frac{1}{\lVert X \rVert_2^2}
```

```python
def ista(X, y, lam, n_iters=1000):
    L = np.linalg.norm(X, 2) ** 2          # hằng số Lipschitz của grad g
    t = 1.0 / L
    beta = np.zeros(X.shape[1])
    for _ in range(n_iters):
        grad = -X.T @ (y - X @ beta)                       # bước gradient trên g
        beta = soft_threshold(beta - t * grad, lam * t)    # bước prox của h
    return beta
```

Mình đã chạy thử: trên dữ liệu ngẫu nhiên 100 × 20, `lasso_cd` ở mục 2, `ista` và `fista` ở mục 5 đều cho cùng giá trị hàm mục tiêu với `sklearn.linear_model.Lasso` (sai lệch hệ số cỡ 10⁻¹¹). Lưu ý scikit-learn dùng hàm mục tiêu (1/2n)‖y − Xβ‖² + α‖β‖₁, nên λ ở đây tương ứng α · n.

## 5. Proximal Gradient: bước nhảy, hội tụ và FISTA

Với bước nhảy t ≤ 1/L, proximal gradient hội tụ với tốc độ O(1/k), giống hệt Gradient Descent trên hàm trơn dù h không trơn. Thêm momentum kiểu Nesterov (FISTA) nâng tốc độ lên O(1/k²).

### 5.1. Tốc độ hội tụ

Nếu ∇g Lipschitz với hằng số L và bước nhảy cố định t ≤ 1/L (Tibshirani, CMU 10-725):

```latex
F(x^{k}) - F^\star \le \frac{\lVert x^{0} - x^\star \rVert_2^2}{2\, t\, k}
```

| Phương pháp | Tốc độ trên F = g + h lồi | Số vòng lặp để sai số ε |
| --- | --- | --- |
| Subgradient method | O(1/√k) | O(1/ε²) |
| Proximal gradient (ISTA) | O(1/k) | O(1/ε) |
| Accelerated proximal gradient (FISTA) | O(1/k²) | O(1/√ε) |

Nếu g còn lồi mạnh, proximal gradient hội tụ tuyến tính (sai số giảm theo cấp số nhân).

### 5.2. Không biết L thì chọn bước nhảy thế nào? Backtracking

Bắt đầu từ một t ban đầu, chọn 0 < β < 1. Trong khi điều kiện dưới đây còn đúng thì gán t ← βt:

```latex
g\big(x - t\, G_t(x)\big) > g(x) - t\, \nabla g(x)^{\top} G_t(x) + \frac{t}{2}\, \lVert G_t(x) \rVert_2^2
```

Điều kiện chỉ dùng g, không dùng h. Cận hội tụ vẫn giữ nguyên, chỉ thay t bằng β/L.

### 5.3. FISTA (Beck & Teboulle 2009)

```latex
\begin{aligned}
x^{k} &= \operatorname{prox}_{t h}\big(y^{k} - t\, \nabla g(y^{k})\big) \\
t_{k+1} &= \frac{1 + \sqrt{1 + 4 t_k^2}}{2} \\
y^{k+1} &= x^{k} + \frac{t_k - 1}{t_{k+1}}\,\big(x^{k} - x^{k-1}\big)
\end{aligned}
```

Khởi tạo y¹ = x⁰, t₁ = 1, bước nhảy 1/L. Cận hội tụ:

```latex
F(x^{k}) - F^\star \le \frac{2 L \lVert x^{0} - x^\star \rVert_2^2}{(k+1)^2}
```

Ở đây t\_k là hệ số momentum của FISTA, khác với bước nhảy t. Khi viết blog nên đổi tên một trong hai để không nhầm. Nhiều giáo trình dùng dạng tương đương đơn giản hơn với hệ số (k − 2)/(k + 1).

```python
def fista(X, y, lam, n_iters=1000):
    L = np.linalg.norm(X, 2) ** 2
    step = 1.0 / L
    x = np.zeros(X.shape[1])
    x_old, z, m = x.copy(), x.copy(), 1.0          # z = y^k, m = t_k
    for _ in range(n_iters):
        x_old = x
        x = soft_threshold(z + step * X.T @ (y - X @ z), lam * step)
        m_new = (1 + np.sqrt(1 + 4 * m * m)) / 2
        z = x + ((m - 1) / m_new) * (x - x_old)     # bước momentum
        m = m_new
    return x
```

Hai điểm nên nhắc trong blog:

- **FISTA không phải phương pháp giảm đơn điệu:** F(x^k) có thể tăng nhẹ ở vài vòng lặp rồi mới giảm tiếp.
- **Restart:** đặt lại momentum (m = 1) mỗi khi F tăng thường giúp FISTA nhanh hơn nữa trên bài toán gần lồi mạnh (O'Donoghue & Candès 2015).

## 6. Minh hoạ: hai bước của proximal gradient

&#91;embedded content: hai bước của proximal gradient và hình dạng toán tử soft-thresholding\]

Bên trái: khi h là ràng buộc, bước gradient có thể đưa điểm ra ngoài tập C, và prox kéo nó về điểm gần nhất trong C. Bên phải: khi h = λ‖x‖₁, prox co mỗi thành phần về 0 một lượng λ, và vùng |z| ≤ λ bị đưa hẳn về 0 — đó là lý do ISTA và CD cho Lasso tạo ra nghiệm thưa.

## 7. Liên hệ giữa hai thuật toán và với black-box optimization

Hai thuật toán gặp nhau ở **proximal coordinate descent**, và ý tưởng "đi theo từng trục" của CD chính là cửa ngõ dẫn sang các phương pháp không dùng đạo hàm, rồi tới CMA-ES. Đây có thể là mạch truyện cho series "Black-box Optimization" của bạn.

### 7.1. Proximal coordinate descent

Với F(x) = g(x) + Σ h\_i(x\_i), thay vì prox cho cả vector, ta làm bước gradient + prox **trên một tọa độ** (Wright 2015, mục 3.7):

```latex
x_{i}^{k+1} = \operatorname{prox}_{h_i / L_i}\Big(x_i^{k} - \frac{1}{L_i}\,\big[\nabla g(x^k)\big]_i\Big)
```

Với Lasso, công thức này cho đúng bước cập nhật soft-thresholding ở mục 2.3. Nói cách khác: **CD cho Lasso chính là ISTA chạy trên từng tọa độ một**.

### 7.2. Coordinate search: CD không cần đạo hàm

Khi chỉ đánh giá được f(x) (black-box), ta vẫn đi theo trục được bằng cách thử hai điểm x ± δe\_i. Đây là **coordinate search** (compass search), thành viên đơn giản nhất của họ direct search / pattern search (Kolda, Lewis & Torczon 2003):

```
Input: x, bước δ > 0, ngưỡng dừng δ_min
while δ > δ_min:
    improved = False
    for i = 1, ..., n:
        for d in (+δ e_i, -δ e_i):
            if f(x + d) < f(x):
                x = x + d; improved = True; break
    if not improved:
        δ = δ / 2          # không hướng nào tốt hơn: thu nhỏ bước
return x
```

### 7.3. Điểm yếu chung: phụ thuộc hệ trục tọa độ

Cả CD lẫn coordinate search đều chỉ đi theo trục. Nếu xoay bài toán đi (các biến tương quan mạnh, các đường mức dài và nằm chéo), bậc thang trong hình ở mục 3 sẽ ngắn dần và thuật toán bò rất chậm. Các cách khắc phục nối đuôi nhau theo thời gian:

| Phương pháp | Ý tưởng |
| --- | --- |
| Rosenbrock (1960) | Xoay hệ trục theo hướng các bước đã thành công |
| Hooke–Jeeves (1961) | Sau mỗi lượt dò theo trục, nhảy thêm một bước "pattern" theo hướng vừa đi |
| CMA-ES (Hansen & Ostermeier 2001) | Học ma trận hiệp phương sai của phân phối lấy mẫu, bất biến với phép xoay |
| Adaptive Coordinate Descent (Loshchilov, Schoenauer & Sebag 2011) | Chạy coordinate search trong hệ trục được học theo kiểu CMA-ES |

Gợi ý mạch bài cho series: Coordinate Descent → Coordinate Search (bỏ đạo hàm) → vấn đề hệ trục → CMA-ES học hệ trục tốt nhất.

## 8. Rà lỗi hai bài blog

Chưa rà được: phiên làm việc này chưa kết nối với máy tính của bạn nên chưa đọc được file bài viết và các link references trong đó. Mục này sẽ được cập nhật khi có file.

Một điểm đã thấy từ lần xem trước: trong `2026-11-07-coordinate-descent/vi.md`, ngay sau `## Mở đầu` có dòng `# Abstract` dùng heading cấp 1. Mục lục chỉ lấy `##` và `###`, và tiêu đề cấp 1 là tiêu đề bài, nên dòng này nên đổi thành `## Abstract`.

## 9. Nguồn tham khảo

**Nguồn mình đã đọc để viết tài liệu này:**

- [Wright, S. J. (2015). Coordinate descent algorithms. Mathematical Programming 151, 3–34 (bản arXiv)](https://arxiv.org/abs/1502.04759) — bài tổng quan chuẩn về CD; công thức cập nhật, L\_max, cận hội tụ, phản ví dụ Powell, ERM và bài toán đối ngẫu. Ảnh công thức ERM trong thư mục bài của bạn trông như lấy từ bài này (phương trình (5)–(6)).
- [Ryan Tibshirani — Proximal Gradient Descent, CMU 10-725 Convex Optimization](https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf) — định nghĩa prox, generalized gradient, ISTA, SVT, backtracking, cận O(1/k) và O(1/k²). Có biểu đồ so sánh hội tụ của subgradient, ISTA và FISTA rất đáng xem.
- [Coordinate descent — Wikipedia](https://en.wikipedia.org/wiki/Coordinate_descent) — hình minh hoạ đường đi bậc thang và hình CD bị kẹt trên hàm không trơn.

**Nguồn gốc nên trích khi đưa vào blog** (mình dẫn theo hiểu biết, chưa mở trong phiên này):

- Beck, A., & Teboulle, M. (2009). A fast iterative shrinkage-thresholding algorithm for linear inverse problems. SIAM Journal on Imaging Sciences — bài gốc của FISTA.
- Parikh, N., & Boyd, S. (2014). Proximal Algorithms. Foundations and Trends in Optimization — tổng quan về toán tử prox.
- Friedman, J., Hastie, T., & Tibshirani, R. (2010). Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software — glmnet.
- Tseng, P. (2001). Convergence of a block coordinate descent method for nondifferentiable minimization. JOTA — điều kiện hội tụ khi phần không trơn tách được.
- Nesterov, Y. (2012). Efficiency of coordinate descent methods on huge-scale optimization problems. SIAM Journal on Optimization — randomized CD.
- Nutini, J., et al. (2015). Coordinate descent converges faster with the Gauss–Southwell rule than random selection. ICML.
- O'Donoghue, B., & Candès, E. (2015). Adaptive restart for accelerated gradient schemes. Foundations of Computational Mathematics.
- Kolda, T. G., Lewis, R. M., & Torczon, V. (2003). Optimization by direct search: new perspectives on some classical and modern methods. SIAM Review.
- Loshchilov, I., Schoenauer, M., & Sebag, M. (2011). Adaptive coordinate descent. GECCO.
