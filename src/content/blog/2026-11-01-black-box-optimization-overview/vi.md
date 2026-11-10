---
title: "Black-Box Optimization là gì?"
description: "Tối ưu một hàm chỉ có thể truy vấn: bài toán, các họ phương pháp chính và cách chọn phương pháp."
pubDate: 2026-11-01
tags: [black-box optimization, bayesian optimization, evolution strategies]
series: "Black-box Optimization 101"
cover: ./cover.svg
draft: false
---

> Đây là bài mẫu đi kèm website. Bài dùng đủ các tính năng của blog — công thức, code, bảng, chú thích, link sang bài khác — để bạn sao chép cấu trúc, rồi sửa hoặc xóa đi.

## Bài toán

Trong **black-box optimization**, ta muốn tìm

$$
x^\star \in \arg\min_{x \in \mathcal{X}} f(x),
$$

trong đó ta có thể *đánh giá* $f$ tại bất kỳ điểm $x$ nào, nhưng không có công thức của $f$ hay gradient $\nabla f(x)$. Mỗi lần truy vấn trả về một con số, thường có nhiễu: $y = f(x) + \varepsilon$ với $\varepsilon \sim \mathcal{N}(0, \sigma_n^2)$.

Một vài ví dụ:

- tinh chỉnh siêu tham số của mạng nơ-ron, mỗi lần đánh giá là một lần huấn luyện trọn vẹn;
- chọn thành phần vật liệu hoặc thuốc, mỗi lần đánh giá là một thí nghiệm;
- hiệu chỉnh một bộ mô phỏng mà ta không thể lấy đạo hàm.

Ràng buộc cốt lõi là **mỗi lần đánh giá rất đắt**. Phương pháp tốt là phương pháp đạt được $x$ tốt với ít lần truy vấn nhất.[^budget]

[^budget]: Trong các bài báo, điều này được đo bằng *simple regret* $r_T = f(x_T^{\text{best}}) - f(x^\star)$ sau ngân sách $T$ lần đánh giá.

## Các họ phương pháp chính

### Tìm kiếm không dùng mô hình

Random search và grid search không tận dụng những điểm đã thấy. Chúng chạy song song rất dễ và là baseline mạnh bất ngờ khi số chiều lớn, nhưng lãng phí lượt đánh giá.

### Evolution strategies

Các phương pháp như **CMA-ES** duy trì một phân phối tìm kiếm (ở đây là phân phối Gauss) và lấy mẫu một quần thể từ nó:

$$
x_i \sim m + \sigma\, \mathcal{N}(0, C), \qquad i = 1, \dots, \lambda .
$$

Sau khi đánh giá quần thể, trung bình $m$, bước nhảy $\sigma$ và hiệp phương sai $C$ được dịch về phía các mẫu tốt nhất. CMA-ES cần nhiều lượt đánh giá nhưng rất ổn định và mở rộng được tới hàng trăm chiều.

### Bayesian optimization

Bayesian optimization (BO) khớp một **mô hình thay thế** (surrogate) mang tính xác suất lên dữ liệu — thường là Gaussian process — và chọn điểm tiếp theo bằng cách tối đa hóa một **acquisition function** cân bằng giữa khám phá và khai thác. Đây là lựa chọn hàng đầu khi bạn chỉ có vài chục đến vài trăm lượt đánh giá. [Bài tiếp theo trong chuỗi](/blog/2026-11-05-bayesian-optimization-101) (tiếng Anh) xây dựng BO từ đầu.

## Nên dùng phương pháp nào?

| Ngân sách (lượt đánh giá) | Số chiều | Lựa chọn mặc định |
| --- | --- | --- |
| tới khoảng 200 | tới khoảng 20 | Bayesian optimization |
| hàng nghìn | tới vài trăm | CMA-ES |
| bất kỳ, chạy song song lớn | bất kỳ | Random search làm baseline |

## Một baseline tối giản bằng Python

Luôn chạy random search làm baseline trước khi thử phương pháp phức tạp hơn:

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

## Tóm tắt

Black-box optimization xoay quanh **hiệu quả mẫu**. Evolution strategies ổn định khi đủ ngân sách cho hàng nghìn lượt đánh giá; Bayesian optimization tỏa sáng khi từng lượt đánh giá đều quý.
