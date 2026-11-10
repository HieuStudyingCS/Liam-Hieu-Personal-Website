# Coordinate Descent (Wright 2015): thuật toán và chứng minh hội tụ

Nov 8, 2026 · @Trọng Hiếu

## 1. Bài toán, ký hiệu và giả thiết

Mọi tốc độ hội tụ trong paper được biểu diễn qua vài hằng số Lipschitz theo tọa độ, hằng số lồi mạnh σ và bán kính tập mức R₀. Nắm chắc phần này thì các chứng minh phía sau chỉ còn là biến đổi đại số.

**Bài toán không ràng buộc (1):** tối thiểu f(x) với f: ℝⁿ → ℝ liên tục.

**Bài toán có điều chuẩn (2), (3):** f trơn, Ω lồi và tách được theo từng tọa độ, λ > 0. Ví dụ: Ω = ‖x‖₁ (Ωᵢ = |xᵢ|) hoặc ràng buộc hộp lᵢ ≤ xᵢ ≤ uᵢ (Ωᵢ là hàm chỉ thị của đoạn).

$$
\min_x\; h(x) := f(x) + \lambda\,\Omega(x), \qquad \Omega(x) = \sum_{i=1}^n \Omega_i(x_i)
$$

### Các hằng số

| Ký hiệu | Định nghĩa | Với f(x) = ½xᵀQx |
| --- | --- | --- |
| $σ (20)$ | $f(y) ≥ f(x) + ∇f(x)ᵀ(y − x) + (σ/2)‖y − x‖²$ | giá trị riêng nhỏ nhất của Q |
| $Lᵢ (21)$ | $\|∇f(x + teᵢ)ᵢ − ∇f(x)ᵢ\| ≤ Lᵢ\|t\|$ | $Qᵢᵢ$ |
| L\_max (22) | maxᵢ Lᵢ | phần tử đường chéo lớn nhất |
| L (23) | ‖∇f(x + d) − ∇f(x)‖ ≤ L‖d‖ | giá trị riêng lớn nhất của Q |
| L\_res (24) | ‖∇f(x + teᵢ) − ∇f(x)‖ ≤ L\_res\|t\| | chuẩn cột lớn nhất của Q |
| Λ (25) | L\_res / L\_max | ∈ \[1, √n\] |

Quan hệ cần nhớ: 1 ≤ L/L\_max ≤ n và L\_res ≤ L. Tỉ số L/L\_max đo mức độ các tọa độ "dính" vào nhau: f tách được hoàn toàn thì L = L\_max và Λ = 1; cận trên n đạt được khi Q = eeᵀ với e = (1, …, 1).

### Giả thiết 1

f lồi, gradient Lipschitz đều, đạt giá trị nhỏ nhất f\* trên tập nghiệm S, và tập mức ứng với điểm xuất phát x⁰ bị chặn:

```latex
R_0 := \max_{x^* \in S}\; \max_x \{\, \|x - x^*\| \;:\; f(x) \le f(x^0) \,\} < \infty
```

### Bổ đề dùng xuyên suốt

Từ (21) và định lý Taylor, khi chỉ thay đổi tọa độ i một lượng t:

```latex
f(x + t e_i) \;\le\; f(x) + t\,[\nabla f(x)]_i + \frac{L_i}{2}\, t^2 \;\le\; f(x) + t\,[\nabla f(x)]_i + \frac{L_{\max}}{2}\, t^2
```

Hệ quả của lồi mạnh: lấy min hai vế của (20) theo y (đạt tại y = x − ∇f(x)/σ) cho f\* ≥ f(x) − ‖∇f(x)‖²/(2σ), tức ‖∇f(x)‖² ≥ 2σ(f(x) − f\*).

## 2. Thuật toán cơ bản

Mỗi bước coordinate descent (CD) chỉ tính một thành phần gradient và chỉ sửa một tọa độ của x. Mọi biến thể khác nhau ở hai lựa chọn: chọn tọa độ nào và bước dài bao nhiêu.

### Algorithm 1: CD cho bài toán (1)

1. Chọn x⁰, đặt k = 0.
2. Chọn chỉ số iₖ ∈ {1, …, n}.
3. Cập nhật tọa độ iₖ theo hướng ngược thành phần gradient tương ứng (công thức dưới), tăng k và lặp lại đến khi dừng.

```latex
x^{k+1} = x^k - \alpha_k\, [\nabla f(x^k)]_{i_k}\, e_{i_k}
```

Cách chọn iₖ:

- **Cyclic (11):** lần lượt 1, 2, …, n rồi quay lại.
- **Essentially cyclic (12):** mỗi tọa độ được cập nhật ít nhất một lần trong mỗi T bước liên tiếp (T ≥ n).
- **Ngẫu nhiên:** bốc theo một phân phối xác suất, không nhất thiết đều.

Cách chọn αₖ: tối thiểu chính xác theo tọa độ đó, line search (điều kiện giảm đủ), hoặc bước cố định như 1/L\_max.

### Algorithm 2: CD cho bài toán có điều chuẩn (2), (3)

Tại tọa độ i = iₖ, tuyến tính hóa f, thêm số hạng tắt dần bậc hai với hệ số 1/αₖ, và giữ nguyên Ωᵢ:

```latex
z^k_{i} = \arg\min_{\chi}\; (\chi - x^k_{i})\,[\nabla f(x^k)]_{i} + \frac{1}{2\alpha_k}(\chi - x^k_{i})^2 + \lambda\, \Omega_{i}(\chi), \qquad x^{k+1} = x^k + (z^k_i - x^k_i)\, e_i
```

Gộp bình phương, bài toán con là một **phép shrink** S\_β áp vào bước gradient thông thường:

```latex
S_\beta(\tau) := \arg\min_{\chi}\; \frac{1}{2\beta}(\chi - \tau)^2 + \Omega_i(\chi), \qquad z^k_i = S_{\lambda\alpha_k}\big(x^k_i - \alpha_k [\nabla f(x^k)]_i\big)
```

Ví dụ với Ωᵢ = |·|: S\_β(τ) = sign(τ)·max(|τ| − β, 0), tức soft-thresholding, có công thức đóng. Khi không có Ωᵢ, Algorithm 2 trùng Algorithm 1. (Paper viết min trong (13) nhưng ý là argmin.)

Cả hai thuật toán mở rộng tự nhiên sang **block CD**: cập nhật một khối tọa độ Uᵢ thay vì một tọa độ, khối phải khớp với cấu trúc tách khối của Ω.

### Áp dụng cho hệ Aw = b: thuật toán Kaczmarz

Nghiệm chuẩn nhỏ nhất của Aw = b (A ∈ ℝ^(m×n), hệ có nghiệm) là nghiệm của min ½‖w‖² với Aw = b (9). Bài toán đối ngẫu Lagrange của nó là (10), và nghiệm gốc lấy lại bằng w = Aᵀx:

```latex
\min_{x \in \mathbb{R}^m}\; f(x) := \tfrac12 \|A^T x\|_2^2 - b^T x, \qquad [\nabla f(x)]_i = A_i A^T x - b_i
```

Với các hàng chuẩn hóa ‖Aᵢ‖ = 1 (14) thì Lᵢ = (AAᵀ)ᵢᵢ = 1. Chạy Algorithm 1 với αₖ = 1 trên (10) và theo dõi wᵏ = Aᵀxᵏ:

```latex
x^{k+1} = x^k - (A_{i_k} A^T x^k - b_{i_k})\, e_{i_k} \;\Longrightarrow\; w^{k+1} = w^k - (A_{i_k} w^k - b_{i_k})\, A_{i_k}^T
```

Đây chính là công thức Kaczmarz (16). Sau bước này A\_{iₖ}w^{k+1} = b\_{iₖ}: phương trình thứ iₖ được thỏa mãn chính xác, nên mỗi bước là một phép chiếu w lên siêu phẳng của một phương trình.

### Liên hệ với stochastic gradient (SG)

Randomized CD là một trường hợp riêng của SG: với iₖ bốc đều, ước lượng gᵏ = n · (thành phần iₖ của ∇f(xᵏ)) · e(iₖ) là không chệch vì E(gᵏ) = ∇f(xᵏ). Hai ưu điểm so với SG tổng quát: f giảm được đảm bảo ở mỗi bước, và phương sai của gᵏ tiến về 0 khi xᵏ hội tụ (vì ∇f(x\*) = 0). SG trên bài toán gốc (5) lấy một mẫu tương ứng với CD trên bài toán đối ngẫu (7) cập nhật một xᵢ; Kaczmarz vừa là CD trên (10), vừa là SG trên ½‖Aw − b‖² (17).

## 3. Randomized CD và Định lý 1

Với tọa độ bốc đều và bước 1/L\_max, sai số kỳ vọng giảm theo 1/k khi f lồi và giảm tuyến tính với hệ số 1 − σ/(nL\_max) khi f lồi mạnh.

### Algorithm 3

Giống Algorithm 1, nhưng mỗi bước chọn iₖ đều ngẫu nhiên trong {1, …, n}, độc lập với các bước trước (lấy mẫu có hoàn lại). Ký hiệu E\_{iₖ} là kỳ vọng theo riêng iₖ, còn E là kỳ vọng theo toàn bộ i₀, i₁, …

### Định lý 1

Giả sử Giả thiết 1 và αₖ ≡ 1/L\_max. Khi đó với mọi k > 0:

```latex
\mathbb{E}\, f(x^k) - f^* \;\le\; \frac{2 n L_{\max} R_0^2}{k} \qquad (27)
```

Nếu thêm σ > 0 trong (20) thì:

```latex
\mathbb{E}\, f(x^k) - f^* \;\le\; \Big(1 - \frac{\sigma}{n L_{\max}}\Big)^k \big(f(x^0) - f^*\big) \qquad (28)
```

### Chứng minh

**Bước 1: mỗi bước giảm f một lượng tỉ lệ với bình phương thành phần gradient.** Áp dụng bổ đề ở Mục 1 với t = −αₖ · (thành phần iₖ của gradient), rồi thay αₖ = 1/L\_max:

```latex
\begin{aligned}
f(x^{k+1}) &\le f(x^k) - \alpha_k [\nabla f(x^k)]_{i_k}^2 + \tfrac12 \alpha_k^2 L_{i_k} [\nabla f(x^k)]_{i_k}^2 \\
&\le f(x^k) - \alpha_k\Big(1 - \tfrac{L_{\max}}{2}\alpha_k\Big)[\nabla f(x^k)]_{i_k}^2 \;=\; f(x^k) - \frac{1}{2L_{\max}}[\nabla f(x^k)]_{i_k}^2 \qquad (29)
\end{aligned}
```

**Bước 2: lấy kỳ vọng theo iₖ.** Vì xᵏ không phụ thuộc iₖ và mỗi chỉ số có xác suất 1/n, trung bình của bình phương thành phần gradient là ‖∇f‖²/n:

```latex
\mathbb{E}_{i_k} f(x^{k+1}) \;\le\; f(x^k) - \frac{1}{2 n L_{\max}} \|\nabla f(x^k)\|^2 \qquad (30)
```

(Paper in nhầm cận trên của tổng là m; đúng phải là n.)

**Bước 3: chuyển sang dãy sai số.** Đặt φₖ := E f(xᵏ) − f\*. Trừ f\* hai vế, lấy kỳ vọng toàn phần, rồi dùng bất đẳng thức Jensen E(Z²) ≥ (EZ)²:

```latex
\phi_{k+1} \;\le\; \phi_k - \frac{1}{2nL_{\max}}\, \mathbb{E}\|\nabla f(x^k)\|^2 \;\le\; \phi_k - \frac{1}{2nL_{\max}} \big[\mathbb{E}\|\nabla f(x^k)\|\big]^2 \qquad (32)
```

**Bước 4: chặn dưới chuẩn gradient bằng sai số.** Do (29), f không tăng nên xᵏ luôn nằm trong tập mức của x⁰, suy ra ‖xᵏ − x\*‖ ≤ R₀. Dùng tính lồi và Cauchy–Schwarz:

```latex
f(x^k) - f^* \;\le\; \nabla f(x^k)^T (x^k - x^*) \;\le\; \|\nabla f(x^k)\|\,\|x^k - x^*\| \;\le\; R_0\, \|\nabla f(x^k)\|
```

Lấy kỳ vọng: E‖∇f(xᵏ)‖ ≥ φₖ/R₀. Thay vào (32):

```latex
\phi_k - \phi_{k+1} \;\ge\; \frac{\phi_k^2}{2 n L_{\max} R_0^2}
```

**Bước 5: mẹo nghịch đảo.** Vì φₖ₊₁ ≤ φₖ nên φₖφₖ₊₁ ≤ φₖ², do đó:

```latex
\frac{1}{\phi_{k+1}} - \frac{1}{\phi_k} = \frac{\phi_k - \phi_{k+1}}{\phi_k \phi_{k+1}} \;\ge\; \frac{\phi_k - \phi_{k+1}}{\phi_k^2} \;\ge\; \frac{1}{2nL_{\max}R_0^2}
```

Cộng dồn từ 0 đến k − 1: 1/φₖ ≥ 1/φ₀ + k/(2nL\_max R₀²) ≥ k/(2nL\_max R₀²). Đảo ngược ra (27).

**Trường hợp lồi mạnh.** Dùng hệ quả ‖∇f(x)‖² ≥ 2σ(f(x) − f\*) ở Mục 1 thay cho Bước 4, thay thẳng vào vế phải của (32) trước khi dùng Jensen:

```latex
\phi_{k+1} \;\le\; \phi_k - \frac{2\sigma}{2nL_{\max}}\,\phi_k \;=\; \Big(1 - \frac{\sigma}{nL_{\max}}\Big)\phi_k
```

Áp dụng đệ quy ra (28). ∎

### Nhận xét

- **Bước khác:** cùng các chặn (27), (28) vẫn đúng với αₖ = 1/L\_{iₖ} hoặc tối thiểu chính xác theo tọa độ, vì trong (29) chỉ cần lấy min theo αₖ, và 1/L\_max là một lựa chọn không tối ưu.
- **So với gradient descent đầy đủ:** GD bước 1/L cho f(xᵏ) − f\* ≤ 2LR₀²/k (33). Mỗi bước CD có hệ số nL\_max thay cho L. Vì L có thể lớn tới nL\_max, hai chặn tương đương trong trường hợp cực đoan; thông thường L và L\_max cùng cỡ nên CD cần nhiều bước hơn khoảng n lần. Bù lại, nếu một thành phần gradient rẻ cỡ 1/n gradient đầy đủ, thì tính theo khối lượng tính toán CD không tệ hơn GD và có lợi khi L ≫ L\_max (nhận xét này là suy luận thêm, không có trong paper).
- **Hội tụ tuyến tính dưới giả thiết yếu hơn lồi mạnh** đã được chứng minh: essential strong convexity, optimal strong convexity, generalized error bound.
- **Lấy mẫu không hoàn lại (theo epoch):** xáo trộn {1, …, n} đầu mỗi epoch rồi duyệt lần lượt. Thực nghiệm thường nhanh hơn lấy mẫu có hoàn lại, nhưng chưa có lý thuyết giải thích.

## 4. Randomized Kaczmarz: hội tụ tuyến tính

Kaczmarz chọn hàng ngẫu nhiên hội tụ tuyến tính với hệ số 1 − λ\_min,nz/m, kể cả khi Aw = b có vô số nghiệm. Đây là kết quả mạnh hơn Định lý 1, vì bài toán đối ngẫu (10) không cần lồi mạnh.

**Thiết lập.** Hệ Aw = b có nghiệm, hàng chuẩn hóa ‖Aᵢ‖ = 1, chỉ số hàng iₖ bốc đều trong {1, …, m}. Ký hiệu P(·) là phép chiếu lên tập nghiệm {w : Aw = b}, λ\_min,nz là giá trị riêng khác 0 nhỏ nhất của AAᵀ, và rₖ := A\_{iₖ}wᵏ − b\_{iₖ} là phần dư của hàng được chọn.

### Chứng minh

**Bước 1: khoảng cách đến tập nghiệm giảm đúng bằng bình phương phần dư.** Vì P(wᵏ⁺¹) là điểm gần wᵏ⁺¹ nhất trong tập nghiệm, còn P(wᵏ) cũng thuộc tập nghiệm:

```latex
\|w^{k+1} - P(w^{k+1})\|^2 \;\le\; \|w^{k+1} - P(w^k)\|^2 = \big\|\,(w^k - P(w^k)) - r_k A_{i_k}^T\,\big\|^2
```

Khai triển bình phương. Vì A\_{iₖ}P(wᵏ) = b\_{iₖ} nên A\_{iₖ}(wᵏ − P(wᵏ)) = rₖ, và ‖A\_{iₖ}‖ = 1:

```latex
= \|w^k - P(w^k)\|^2 - 2 r_k \cdot r_k + r_k^2 \;=\; \|w^k - P(w^k)\|^2 - (A_{i_k} w^k - b_{i_k})^2
```

(Bản arXiv có thêm hệ số ½ trước số hạng đầu, đó là lỗi in.)

**Bước 2: lấy kỳ vọng theo iₖ.** Trung bình của rₖ² trên m hàng là ‖Awᵏ − b‖²/m:

```latex
\mathbb{E}_{i_k}\|w^{k+1} - P(w^{k+1})\|^2 \;\le\; \|w^k - P(w^k)\|^2 - \frac{1}{m}\|A w^k - b\|^2
```

**Bước 3: chặn phần dư theo khoảng cách.** Đặt v = wᵏ − P(wᵏ). Vì AP(wᵏ) = b nên Awᵏ − b = Av. Phép chiếu lên tập nghiệm làm v vuông góc với không gian null của A, tức v nằm trong không gian hàng range(Aᵀ). Trên không gian đó, ‖Av‖² = vᵀAᵀAv ≥ λ\_min,nz‖v‖², vì các giá trị riêng khác 0 của AᵀA và AAᵀ trùng nhau. Vậy:

```latex
\mathbb{E}_{i_k}\|w^{k+1} - P(w^{k+1})\|^2 \;\le\; \Big(1 - \frac{\lambda_{\min,\mathrm{nz}}}{m}\Big)\|w^k - P(w^k)\|^2
```

**Bước 4:** lấy kỳ vọng toàn phần rồi đệ quy:

```latex
\mathbb{E}\|w^k - P(w^k)\|^2 \;\le\; \Big(1 - \frac{\lambda_{\min,\mathrm{nz}}}{m}\Big)^k \|w^0 - P(w^0)\|^2 \qquad \blacksquare
```

**Vì sao không cần lồi mạnh?** Thay cho lồi mạnh, chứng minh dùng đo khoảng cách đến cả tập nghiệm (không phải đến một nghiệm), và bất đẳng thức ‖Av‖² ≥ λ\_min,nz‖v‖² chỉ cần đúng trên không gian hàng. Đây là phiên bản tổng quát hóa nhẹ của Strohmer–Vershynin cho hệ có nhiều nghiệm.

## 5. Accelerated randomized CD

Thêm momentum kiểu Nesterov nâng tốc độ từ 1/k lên 1/k², và trong trường hợp lồi mạnh thay σ/L\_max bằng √(σ/L\_max). Cái giá là mỗi bước phải cập nhật hai vector dày đặc, và kỹ thuật đổi biến Lee–Sidford giải quyết điều này.

### Algorithm 4 (Nesterov 2012)

Đầu vào: ước lượng σ ≥ 0 và các Lᵢ (có thể thay tất cả bằng L\_max). Khởi tạo v⁰ = x⁰, γ₋₁ = 0. Mỗi bước k:

1. Chọn γₖ là nghiệm lớn hơn của phương trình γ² − γ/n = (1 − γσ/n)γₖ₋₁².
2. Đặt αₖ = (n − γₖσ) / (γₖ(n² − σ)) và βₖ = 1 − γₖσ/n.
3. Điểm ngoại suy yᵏ = αₖvᵏ + (1 − αₖ)xᵏ.
4. Bốc iₖ đều, lấy dᵏ = thành phần iₖ của ∇f(yᵏ) nhân e(iₖ).
5. xᵏ⁺¹ = yᵏ − dᵏ / L\_{iₖ}.
6. vᵏ⁺¹ = βₖvᵏ + (1 − βₖ)yᵏ − (γₖ / L\_{iₖ}) dᵏ.

Trực giác: xᵏ là dãy bước gradient thông thường, vᵏ tích lũy thông tin gradient với bước dài hơn (hệ số γₖ), còn yᵏ là điểm trộn giữa hai dãy nơi gradient được tính, giống heavy-ball và FISTA.

### Định lý 2 (Nesterov 2012, Theorem 6)

Giả sử Giả thiết 1 và đặt

```latex
S_0 := \sup_{x^* \in S} L_{\max}\|x^0 - x^*\|^2 + \frac{f(x^0) - f^*}{n^2}
```

Khi đó với mọi k ≥ 0:

```latex
\mathbb{E}\, f(x^k) - f^* \;\le\; S_0\,\frac{\sigma}{L_{\max}}\left[\Big(1 + \frac{\sqrt{\sigma/L_{\max}}}{2n}\Big)^{k+1} - \Big(1 - \frac{\sqrt{\sigma/L_{\max}}}{2n}\Big)^{k+1}\right]^{-2} \;\le\; S_0\Big(\frac{n}{k+1}\Big)^2
```

Paper không chứng minh lại định lý này mà dẫn Nesterov. Cách đọc:

- **Lồi mạnh (σ > 0):** số hạng (1 + √(σ/L\_max)/(2n))^(k+1) chiếm ưu thế, nên sai số giảm tuyến tính với hệ số khoảng 1 − √(σ/L\_max)/n mỗi bước. So với (28), số bước cần thiết giảm cỡ √(L\_max/σ) lần.
- **Chỉ lồi:** chặn cuối S₀(n/(k+1))² thay cho 1/k ở (27), nên số bước để đạt sai số ε giảm từ O(1/ε) xuống O(1/√ε).

### Vấn đề chi phí và kỹ thuật Lee–Sidford

Algorithm 3 chỉ sửa một tọa độ mỗi bước. Algorithm 4 phải cập nhật yᵏ và vᵏ dày đặc, tốn O(n), và gradient được tính tại yᵏ thay đổi nhiều giữa các bước. Đổi biến của Lee–Sidford đưa chi phí về bằng số phần tử khác 0 liên quan.

**Algorithm 5 (Kaczmarz tăng tốc).** Áp Algorithm 4 lên (10) với Lᵢ = 1 và chuyển sang không gian gốc bằng ṽ = Aᵀv, ỹ = Aᵀy:

1. γₖ, αₖ, βₖ như Algorithm 4.
2. ỹᵏ = αₖṽᵏ + (1 − αₖ)wᵏ.
3. Bốc hàng iₖ ∈ {1, …, m}, đặt d̃ᵏ = (A\_{iₖ}ỹᵏ − b\_{iₖ}) · (A\_{iₖ})ᵀ.
4. wᵏ⁺¹ = ỹᵏ − d̃ᵏ và ṽᵏ⁺¹ = βₖṽᵏ + (1 − βₖ)ỹᵏ − γₖd̃ᵏ.

Khử wᵏ, cặp (ṽ, ỹ) cập nhật theo một phép biến đổi tuyến tính 2×2 cộng một số hạng thưa:

```latex
[\tilde v^{k+1}\;\tilde y^{k+1}] = [\tilde v^{k}\;\tilde y^{k}]\,R_k - S_k, \quad R_k = \begin{bmatrix} \beta_k & \alpha_{k+1}\beta_k \\ 1-\beta_k & 1-\alpha_{k+1}\beta_k \end{bmatrix}, \quad S_k = (A_{i_k}\tilde y^k - b_{i_k})\,A_{i_k}^T\,\big[\gamma_k \;\; 1 - \alpha_{k+1} + \alpha_{k+1}\gamma_k\big]
```

Sₖ là ma trận n×2 chỉ khác 0 ở các hàng mà A\_{iₖ} khác 0. Ý tưởng là không lưu (ṽ, ỹ) trực tiếp mà lưu (v̂, ŷ) cùng một ma trận 2×2 Bₖ, khởi tạo B₀ = I:

```latex
[\tilde v^k\;\tilde y^k] = [\hat v^k\;\hat y^k]\,B_k, \qquad B_{k+1} := B_k R_k, \qquad [\hat v^{k+1}\;\hat y^{k+1}] := [\hat v^k\;\hat y^k] - S_k B_{k+1}^{-1}
```

Kiểm tra: \[v̂ ŷ\]ᵏ⁺¹Bₖ₊₁ = \[v̂ ŷ\]ᵏBₖRₖ − Sₖ = \[ṽ ỹ\]ᵏRₖ − Sₖ, đúng với công thức cập nhật. Phần dữ liệu lớn (v̂, ŷ) chỉ thay đổi ở các hàng của Sₖ, phần dày đặc bị dồn vào Bₖ 2×2. Tích vô hướng cần cho phần dư cũng tính được thưa: A\_{iₖ}ỹᵏ = (A\_{iₖ}v̂ᵏ)(Bₖ)₁₂ + (A\_{iₖ}ŷᵏ)(Bₖ)₂₂. Tổng chi phí mỗi bước là O(|A\_{iₖ}|), bằng Kaczmarz thường.

Kỹ thuật này mở rộng cho bài toán ERM đối ngẫu (7) với g(z) = ‖z‖²/2. Điều kiện cốt lõi: thành phần gradient tại yᵏ phải tính được rẻ từ biểu diễn hai vector cộng hai hệ số.

## 6. Cyclic CD và Định lý 3

Duyệt tọa độ theo vòng cho chặn tất định (không phải kỳ vọng), nhưng chặn tệ hơn randomized khoảng n lần và xấu đi khi các tọa độ ràng buộc chặt với nhau.

### Định lý 3 (Beck–Tetruashvili 2013)

Giả sử Giả thiết 1, αₖ ≡ 1/L\_max, iₖ chọn theo thứ tự vòng (11) bắt đầu từ i₀ = 1. Với k = n, 2n, 3n, … (cuối mỗi vòng):

```latex
f(x^k) - f^* \;\le\; \frac{4 n L_{\max}\big(1 + nL^2/L_{\max}^2\big) R_0^2}{k + 8} \qquad (41)
```

Nếu thêm σ > 0:

```latex
f(x^k) - f^* \;\le\; \left(1 - \frac{\sigma}{2L_{\max}\big(1 + nL^2/L_{\max}^2\big)}\right)^{k/n} \big(f(x^0) - f^*\big) \qquad (42)
```

### Chứng minh

Paper suy ra từ Theorem 3.6 và 3.9 của Beck–Tetruashvili bằng phép đối chiếu tham số:

1. Mỗi bước của thuật toán BCGD trong bài gốc ứng với một vòng gồm n bước của Algorithm 1.
2. Cập nhật từng tọa độ thay vì khối, nên số khối p = n.
3. Đặt các hằng số Lipschitz khối lớn nhất và nhỏ nhất đều bằng L\_max.

Nguồn gốc của hệ số nL²/L\_max² (giải thích trực giác, không có trong paper): trong một vòng, mỗi tọa độ được cập nhật bằng gradient tại một điểm đã trôi khỏi điểm đầu vòng. Sai lệch gradient do sự trôi đó bị chặn bởi L nhân độ dời tích lũy qua tối đa n bước, nên khi so với một bước gradient đầy đủ xuất hiện số hạng tỉ lệ với nL²/L\_max².

### So sánh với randomized (Định lý 1)

- **Tử số của chặn 1/k:** vì L ≥ L\_max, tử số của (41) là O(n²), trong khi (27) chỉ là O(n).
- **Tốc độ tuyến tính:** vì (1 − ε)^(1/n) ≈ 1 − ε/n, hệ số mỗi bước của (42) khoảng 1 − σ/(2nL\_max(1 + nL²/L\_max²)), tệ hơn (28) thêm một thừa số cỡ n.
- **Đổi lại:** chặn của cyclic là tất định, còn của randomized chỉ là kỳ vọng.
- **Phụ thuộc vào ràng buộc giữa tọa độ:** L/L\_max càng gần n (tọa độ càng phụ thuộc nhau) thì chặn càng yếu, đúng với trực giác là CD cần nhiều bước hơn để gỡ ràng buộc.

### Chọn L\_max lớn hơn

L\_max chỉ cần thỏa (21), (22), nên có thể chọn lớn hơn (bước ngắn hơn). Với L\_max = L, chặn (41) thành 4n(n + 1)LR₀²/(k + 8), tệ hơn gradient descent (33) khoảng 2n² lần. Với L\_max = √n·L, chặn thành 8n^(3/2)LR₀²/(k + 8), vẫn kém (33) khoảng 4n^(3/2) lần.

### Thực nghiệm trong paper (Mục 3.8)

Trên hàm bậc hai ½xᵀQx với Q dựng có điều khiển, so sánh cyclic, randomized có hoàn lại (IID) và theo epoch, mỗi loại với bước 1/L\_max hoặc bước tối ưu 1/Qᵢᵢ. Kết quả: hội tụ tuyến tính xuất hiện cả khi Q suy biến (tốt hơn lý thuyết); epoch thường nhanh hơn IID nhưng hiếm khi quá 2 lần; bước tối ưu thường tốt hơn, có khi ít hơn 6 lần số bước; ở các cấu hình khó, cyclic chậm hơn randomized từ 10 lần trở lên.

## 7. Điều chuẩn tách được và Định lý 4

Algorithm 2 với tọa độ ngẫu nhiên đạt đúng tốc độ tuyến tính 1 − σ/(nL\_max) như trường hợp trơn, dù Ω không khả vi. Mấu chốt là một hàm xấp xỉ H tách được theo tọa độ.

### Giả thiết 2

f có gradient Lipschitz đều và lồi mạnh với σ > 0; mọi Ωᵢ lồi; h = f + λΩ đạt cực tiểu h\* tại duy nhất x\*. Khi đó h cũng lồi mạnh với cùng σ, tức với mọi α ∈ \[0, 1\]:

```latex
h(\alpha x + (1-\alpha) y) \;\le\; \alpha h(x) + (1-\alpha) h(y) - \tfrac12 \sigma \alpha (1-\alpha)\|x - y\|^2 \qquad (43)
```

### Định lý 4

Với Giả thiết 2, iₖ bốc đều độc lập và αₖ ≡ 1/L\_max trong Algorithm 2, với mọi k ≥ 0:

```latex
\mathbb{E}\, h(x^k) - h^* \;\le\; \Big(1 - \frac{\sigma}{n L_{\max}}\Big)^k \big(h(x^0) - h^*\big) \qquad (44)
```

### Chứng minh

**Công cụ: hàm xấp xỉ H.** Định nghĩa

```latex
H(x^k, z) := f(x^k) + \nabla f(x^k)^T (z - x^k) + \tfrac12 L_{\max}\|z - x^k\|^2 + \lambda\,\Omega(z)
```

H tách được theo từng tọa độ của z. Gọi zᵏ là điểm cực tiểu của H theo z: thành phần thứ i của zᵏ chính là giá trị Algorithm 2 sẽ gán nếu chọn tọa độ i. Như vậy zᵏ là "bước giả định" cập nhật mọi tọa độ cùng lúc.

**Bước 1: so H với h.** Từ lồi mạnh (20), f(xᵏ) + ∇f(xᵏ)ᵀ(z − xᵏ) ≤ f(z) − (σ/2)‖z − xᵏ‖². Thay vào định nghĩa H:

```latex
H(x^k, z) \;\le\; h(z) + \tfrac12 (L_{\max} - \sigma)\|z - x^k\|^2 \qquad (45)
```

**Bước 2: chặn giá trị nhỏ nhất của H.** Lấy min hai vế theo z, rồi thu hẹp vế phải về các điểm trên đoạn thẳng z = αx\* + (1 − α)xᵏ (khi đó ‖z − xᵏ‖ = α‖xᵏ − x\*‖), và dùng (43):

```latex
\begin{aligned}
H(x^k, z^k) &\le \min_{\alpha\in[0,1]}\; h(\alpha x^* + (1-\alpha)x^k) + \tfrac12 (L_{\max} - \sigma)\alpha^2 \|x^k - x^*\|^2 \\
&\le \min_{\alpha\in[0,1]}\; \alpha h^* + (1-\alpha) h(x^k) + \tfrac12\big[(L_{\max} - \sigma)\alpha^2 - \sigma\alpha(1-\alpha)\big]\|x^k - x^*\|^2
\end{aligned}
```

Hệ số trong ngoặc vuông rút gọn thành α(L\_max·α − σ), bằng 0 khi α = σ/L\_max. Chọn giá trị này:

```latex
H(x^k, z^k) \;\le\; \frac{\sigma}{L_{\max}}\, h^* + \Big(1 - \frac{\sigma}{L_{\max}}\Big) h(x^k) \qquad (46)
```

**Bước 3: kỳ vọng của bước thật sự.** Bước thật chỉ sửa tọa độ i = iₖ thành zᵏᵢ. Dùng bổ đề ở Mục 1 cho f, còn phần Ω giữ nguyên các tọa độ j ≠ i, rồi lấy trung bình trên n khả năng của i:

```latex
\mathbb{E}_{i_k} h(x^{k+1}) \;\le\; \frac1n \sum_{i=1}^n \Big\{ f(x^k) + [\nabla f(x^k)]_i (z^k_i - x^k_i) + \tfrac12 L_{\max}(z^k_i - x^k_i)^2 + \lambda\Omega_i(z^k_i) + \lambda\sum_{j\ne i}\Omega_j(x^k_j) \Big\}
```

Cộng theo i: số hạng f(xᵏ) xuất hiện n lần; các số hạng gradient và bình phương gộp thành ∇f(xᵏ)ᵀ(zᵏ − xᵏ) + ½L\_max‖zᵏ − xᵏ‖²; mỗi Ω\_j(xᵏ\_j) xuất hiện n − 1 lần và mỗi Ωᵢ(zᵏᵢ) một lần. Tách thành n − 1 bản sao của h(xᵏ) cộng đúng H(xᵏ, zᵏ):

```latex
\mathbb{E}_{i_k} h(x^{k+1}) \;\le\; \frac{n-1}{n}\, h(x^k) + \frac1n\, H(x^k, z^k)
```

**Bước 4: ghép lại.** Trừ h\* hai vế và dùng (46) cho H(xᵏ, zᵏ) − h\* ≤ (1 − σ/L\_max)(h(xᵏ) − h\*):

```latex
\mathbb{E}_{i_k} h(x^{k+1}) - h^* \;\le\; \Big[\frac{n-1}{n} + \frac1n\Big(1 - \frac{\sigma}{L_{\max}}\Big)\Big](h(x^k) - h^*) = \Big(1 - \frac{\sigma}{nL_{\max}}\Big)(h(x^k) - h^*)
```

Lấy kỳ vọng theo i₀, …, iₖ₋₁ rồi đệ quy ra (44). ∎

### Mở rộng

- **f lồi nhưng không lồi mạnh:** có kết quả kiểu (27) với vài chi tiết kỹ thuật, xem Richtárik–Takáč.
- **f không lồi:** với bước cố định, mọi điểm tụ của dãy là điểm dừng và một độ đo tối ưu giảm về 0 với tốc độ 1/k (Patrascu–Necoara).

## 8. CD song song

CD bất đồng bộ trên bộ nhớ chia sẻ giữ được gần nguyên tốc độ của bản tuần tự, nên tăng tốc gần tuyến tính theo số lõi, miễn là độ trễ tối đa τ đủ nhỏ so với n.

### Song song đồng bộ

Các bộ xử lý cập nhật các tập tọa độ rời nhau rồi đồng bộ trước vòng tiếp. Các biến thể paper điểm qua:

- **Bradley và cộng sự (bài toán ℓ₁):** P bộ xử lý cập nhật P tọa độ ngẫu nhiên mỗi vòng; tốc độ 1/k giữ nguyên nếu P không vượt quá n/L.
- **Jaggi và cộng sự:** CD trên ERM đối ngẫu (7) với g = ½‖·‖², chia biến đối ngẫu giữa các lõi và đồng bộ vector Ax, giống Gauss–Jacobi khối phi tuyến.
- **Richtárik–Takáč:** cập nhật một tập con Sₖ theo công thức Algorithm 2, chia việc cho các bộ xử lý; Fercoq và cộng sự thêm tăng tốc, Marecek và cộng sự thêm một tầng song song thứ hai.

Nhược điểm chung: bước đồng bộ bắt các bộ xử lý nhanh chờ bộ chậm và tốn chi phí khóa bộ nhớ.

### Algorithm 6 và 7: CD bất đồng bộ

Vector x nằm trong bộ nhớ chia sẻ. Mỗi bộ xử lý tự chạy vòng lặp sau mà không chờ ai (Algorithm 6):

1. Chọn chỉ số i.
2. Đọc các thành phần cần thiết của x và tính thành phần thứ i của gradient.
3. Ghi xᵢ ← xᵢ − α · (thành phần đó), một thao tác nguyên tử không cần khóa.

Nhìn toàn cục với bộ đếm k tăng mỗi khi có một lần ghi (Algorithm 7), khác biệt duy nhất so với Algorithm 1 là gradient được tính tại x̂ᵏ, một phiên bản "cũ" của x, vì giữa lúc đọc và lúc ghi các lõi khác đã sửa x:

```latex
x^{k+1} = x^k - \alpha_k\, [\nabla f(\hat x^k)]_{i_k}\, e_{i_k}
```

Các biến thể khác nhau ở giả thiết về độ "cũ" của x̂ᵏ.

### Định lý 5: bất đồng bộ hoàn toàn (Bertsekas–Tsitsiklis)

**Bất đồng bộ hoàn toàn** nghĩa là: mọi tọa độ được cập nhật vô hạn lần, và thời điểm cập nhật gần nhất của mọi thành phần trong x̂ᵏ tiến ra vô cùng khi k → ∞.

**Phát biểu.** Giả sử (1) có nghiệm duy nhất x\*, f lồi và khả vi liên tục, Algorithm 7 chạy bất đồng bộ hoàn toàn với αₖ ≡ α, và ánh xạ T(x) = x − α∇f(x) co chặt theo chuẩn ℓ∞:

```latex
\|T(x) - x^*\|_\infty \;\le\; \eta\, \|x - x^*\|_\infty, \qquad \eta \in (0, 1) \qquad (48)
```

Khi đó xᵏ → x\*.

**Ý tưởng chứng minh** (paper dẫn Bertsekas–Tsitsiklis, không trình bày): xét các hộp lồng nhau quanh x\* theo chuẩn ℓ∞ với bán kính ηʲR. Co theo ℓ∞ có nghĩa là nếu mọi thành phần mà một bộ xử lý đọc đều đã nằm trong hộp j, thì tọa độ nó ghi ra nằm trong hộp j + 1, bất kể các thành phần khác cũ đến đâu. Hai điều kiện bất đồng bộ hoàn toàn đảm bảo lần lượt mọi tọa độ rồi sẽ bước vào mỗi hộp nhỏ hơn.

**Giới hạn.** Không có tốc độ hội tụ, và điều kiện (48) rất mạnh. Phản ví dụ: f(x) = ½xᵀQx với Q = \[\[1, 1\], \[1, 2\]\] lồi chặt và x\* = 0, nhưng tại x = (1, −1) thì Qx = (0, −1), nên T(x) = (1, −1 + α) và ‖T(x)‖∞ ≥ 1 = ‖x‖∞ với mọi α > 0.

### Định lý 6: bất đồng bộ một phần (Liu–Wright)

**Giả thiết trễ bị chặn.** iₖ bốc đều độc lập, và x̂ᵏ chỉ thiếu các cập nhật từ tối đa τ bước gần nhất, với K là một tập con của {k − 1, …, k − τ}:

```latex
x^k = \hat x^k + \sum_{l \in K} (x^{l+1} - x^l) \qquad (49)
```

τ tỉ lệ với số bộ xử lý P, thực tế khoảng 2P đến 3P. Bước cố định αₖ ≡ γ/L\_max (50), với γ chọn để thuật toán tiến đều nhưng không quá nhanh, vì tiến quá nhanh làm thông tin trong x̂ᵏ lỗi thời. Điều này được ép bằng điều kiện (51): với một ρ > 1, kỳ vọng bình phương độ dài bước "giả định cập nhật mọi tọa độ" giảm không quá hệ số 1/ρ mỗi bước.

**Phát biểu.** Giả sử Giả thiết 1 và điều kiện trễ

```latex
4 e \Lambda (\tau + 1)^2 \;\le\; \sqrt{n} \qquad (53)
```

Khi đó với γ = 1/2 (bước 1/(2L\_max)), với P\_S là phép chiếu lên tập nghiệm:

```latex
\mathbb{E}\, f(x^k) - f^* \;\le\; \frac{n\big(L_{\max}\|x^0 - P_S(x^0)\|^2 + f(x^0) - f^*\big)}{n + k} \qquad (54)
```

Nếu thêm điều kiện optimal strong convexity f(x) − f\* ≥ (σ/2)‖x − P\_S(x)‖² (52), yếu hơn lồi mạnh vì không cần nghiệm duy nhất:

```latex
\mathbb{E}\, f(x^k) - f^* \;\le\; \Big(1 - \frac{\sigma}{n(\sigma + 2L_{\max})}\Big)^k \big(L_{\max}\|x^0 - P_S(x^0)\|^2 + f(x^0) - f^*\big) \qquad (55)
```

Paper chỉ phát biểu (bản sửa từ Corollary 2 của Liu–Wright), không chứng minh lại.

**Cách đọc.**

- **So với Định lý 1:** gần như trùng nhau. Chênh lệch chủ yếu do bước nhỏ hơn 2 lần, còn chặn 1/k chỉ thêm n ở mẫu số. Vậy tổng khối lượng tính toán gần như không đổi khi chia cho nhiều lõi, tức tăng tốc gần tuyến tính, khớp với thực nghiệm.
- **Điều kiện (53) là then chốt:** khi các tọa độ ràng buộc yếu (Λ gần 1), τ được phép tới cỡ n^(1/4); khi ràng buộc mạnh, τ có thể chỉ được khoảng 1. Khi đó chọn γ nhỏ hơn sẽ làm chặn xấu đi từ từ thay vì hỏng hẳn.
- **Giả thiết đọc không nhất quán:** phân tích trước đó giả sử x̂ᵏ bằng đúng một xʲ cũ với k − τ ≤ j ≤ k, cho kết quả nới lỏng hơn cho τ, nhưng giả thiết đó có thể sai khi một lõi đang đọc x trong lúc lõi khác sửa nó. Mô hình (49) cho phép hiện tượng này.

## 9. Tổng kết tốc độ hội tụ

Randomized CD là mốc tham chiếu: tăng tốc cải thiện nó về bậc, cyclic kém hơn khoảng n lần nhưng tất định, còn bản bất đồng bộ giữ gần nguyên tốc độ.

| Thuật toán | Giả thiết và bước | f lồi | Lồi mạnh (hệ số co) | Nguồn |
| --- | --- | --- | --- | --- |
| Randomized CD (Alg. 3) | Giả thiết 1, α = 1/L\_max | 2nL\_max R₀² / k | (1 − σ/(nL\_max))^k | Định lý 1, có chứng minh |
| Randomized Kaczmarz | Aw = b có nghiệm, hàng chuẩn hóa | không áp dụng | (1 − λ\_min,nz/m)^k trên E‖w − P(w)‖², không cần lồi mạnh | Mục 3.3, có chứng minh |
| Accelerated CD (Alg. 4) | Giả thiết 1, cần ước lượng σ, Lᵢ | S₀ (n/(k+1))² | khoảng (1 − √(σ/L\_max)/n)^k | Định lý 2, dẫn Nesterov |
| Cyclic CD | Giả thiết 1, α = 1/L\_max, k là bội của n | 4nL\_max(1 + nL²/L\_max²)R₀² / (k + 8) | (1 − σ/(2L\_max(1 + nL²/L\_max²)))^(k/n) | Định lý 3, dẫn Beck–Tetruashvili |
| Proximal randomized CD (Alg. 2) | Giả thiết 2, α = 1/L\_max | xem Richtárik–Takáč | (1 − σ/(nL\_max))^k trên h | Định lý 4, có chứng minh |
| Bất đồng bộ hoàn toàn (Alg. 7) | nghiệm duy nhất, T co theo ℓ∞ | hội tụ, không có tốc độ | không có tốc độ | Định lý 5, dẫn Bertsekas–Tsitsiklis |
| Bất đồng bộ trễ ≤ τ (Alg. 7) | Giả thiết 1, điều kiện (53), α = 1/(2L\_max) | n(L\_max‖x⁰ − P\_S(x⁰)‖² + f(x⁰) − f\*) / (n + k) | (1 − σ/(n(σ + 2L\_max)))^k, chỉ cần (52) | Định lý 6, dẫn Liu–Wright |
| Gradient descent (đối chiếu) | α = 1/L | 2LR₀² / k | không nêu trong paper | (33) |

Nguồn: [Wright, Coordinate Descent Algorithms, arXiv:1502.04759](https://arxiv.org/html/1502.04759v1).
