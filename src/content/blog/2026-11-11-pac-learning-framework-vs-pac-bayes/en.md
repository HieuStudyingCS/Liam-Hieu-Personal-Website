---
title: "PAC learning framework vs PAC-Bayes"
description: ""
pubDate: 2026-11-11
tags: [probabilistic machine learning, machine learning theory, probability bound]
series: "PAC Learning Framework 101"
cover: ./assets/PAC-learning-pic.png
draft: true
---

## Introduction

---


## 1. Khung PAC: đo cái gì, hứa hẹn cái gì

Khung PAC biến câu hỏi "học được không" thành một mệnh đề xác suất có hai núm vặn: độ chính xác $\epsilon$ và độ tin cậy $1-\delta$. Định lý 1 của SAM là một mệnh đề đúng dạng đó.

**Thiết lập (tr. 9–10).** Không gian đầu vào là $X$, tập nhãn là $Y=\{0,1\}$. Một concept $c: X\to Y$ là hàm cần học, thuộc concept class $C$. Người học chọn trong tập giả thuyết $H$ (có thể khác $C$). Mẫu $S=(x_1,\dots,x_m)$ được rút i.i.d. từ một phân phối $D$ cố định nhưng không biết.

**Hai loại lỗi (Định nghĩa 2.1, 2.2):**

$$R(h)=\Pr_{x\sim D}\big[h(x)\neq c(x)\big]=\mathbb{E}_{x\sim D}\big[\mathbf{1}_{h(x)\neq c(x)}\big],\qquad \hat R_S(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{h(x_i)\neq c(x_i)}$$

**Mệnh đề (2.3) và cái bẫy của nó.** Với $h$ cố định trước khi rút mẫu, lỗi thực nghiệm là ước lượng không chệch của lỗi thật. Chứng minh chỉ cần tính tuyến tính của kỳ vọng và việc các $x_i$ cùng phân phối:

$$\mathbb{E}_{S\sim D^m}\big[\hat R_S(h)\big]=\frac{1}{m}\sum_{i=1}^{m}\mathbb{E}_{x_i\sim D}\big[\mathbf{1}_{h(x_i)\neq c(x_i)}\big]=\frac{1}{m}\cdot m\cdot R(h)=R(h)$$

Mệnh đề này sai khi $h=h_S$ được chọn dựa vào chính $S$. Ví dụ cực đoan: $h_S$ học thuộc $S$ và đoán ngẫu nhiên ngoài $S$. Khi đó $\hat R_S(h_S)=0$, nhưng $R(h_S)$ có thể bằng $1/2$.

Toàn bộ chương 2–3 xoay quanh việc vá lỗ hổng này bằng **uniform convergence**: chặn $\lvert R(h)-\hat R_S(h)\rvert$ đồng thời cho mọi $h\in H$, khi đó bất đẳng thức đúng cho cả $h_S$. SAM gặp đúng vấn đề này vì $w$ là nghiệm học từ $S$.

**Định nghĩa 2.3 (PAC-learnable).** $C$ là PAC-learnable nếu có thuật toán $A$ và một đa thức $\mathrm{poly}$ sao cho, với mọi $\epsilon>0$, $\delta>0$, mọi phân phối $D$ và mọi $c\in C$:

$$m\ \ge\ \mathrm{poly}\!\left(\tfrac{1}{\epsilon},\tfrac{1}{\delta},n,\mathrm{size}(c)\right)\ \Longrightarrow\ \Pr_{S\sim D^m}\big[R(h_S)\le\epsilon\big]\ \ge\ 1-\delta$$

Nếu $A$ còn chạy trong thời gian đa thức thì $C$ là *efficiently* PAC-learnable. "Approximately correct" nghĩa là $R(h_S)\le\epsilon$; "probably" nghĩa là xác suất ít nhất $1-\delta$ trên việc rút mẫu.

**Ba điểm sách nhấn mạnh (tr. 11–12), và ý nghĩa với SAM:**

1. Không giả thiết gì về $D$ (distribution-free). Định lý 1 của SAM cũng phát biểu "for any distribution $D$".
2. Train và test cùng một $D$. Mọi cận trong tài liệu này mất hiệu lực khi có lệch phân phối.
3. PAC nói về cả một lớp $C$, không phải một concept. $A$ biết $C$ nhưng không biết $c$.

**Hai cách viết cùng một kết quả (tr. 14).** Mỗi kết quả PAC có hai dạng tương đương:

- *sample complexity*: cần $m\ge f(\epsilon,\delta)$ mẫu;
- *generalization bound*: với xác suất $1-\delta$, $R\le g(m,\delta)$.

Chuyển qua lại bằng cách đặt xác suất xấu bằng $\delta$ rồi giải ra $\epsilon$. Định lý 1 của SAM viết ở dạng thứ hai.

Một khác biệt quan trọng: Định lý 1 không phải kết quả PAC-learnability. Nó không nói thuật toán nào đạt được lỗi nhỏ. Nó chỉ nói một đại lượng tính được trên $S$ chặn trên lỗi thật, và SAM sau đó dùng chính đại lượng này làm hàm mục tiêu.

---

## 2. Ví dụ 2.4: hình chữ nhật thẳng trục (tr. 12–14)

Ví dụ này chứng minh một lớp giả thuyết vô hạn vẫn học được với $m\ge\frac{4}{\epsilon}\log\frac{4}{\delta}$ mẫu. Kỹ thuật của nó là: đặt sự kiện xấu, chặn từng mảnh, rồi cộng lại bằng union bound. Đó là khuôn của mọi chứng minh phía sau, kể cả Appendix A.1.

**Bài toán.** $X=\mathbb{R}^2$, $C=H=$ tập mọi hình chữ nhật có cạnh song song trục tọa độ. Thuật toán trả về $R_S$, hình chữ nhật nhỏ nhất chứa mọi điểm nhãn 1 (tập rỗng nếu không có điểm nào).

**Hình (chuyển sang sơ đồ ký tự):**

```
┌───────────────────── r1 (dải trên) ─────────────────────┐
│   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│   ╎  ●        ●                               ●   ╎    │
r4  ╎        R_S = hình chữ nhật chặt nhất          ╎   r2
│   ╎     ●        chứa mọi điểm nhãn 1 (●)     ●   ╎    │
│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
└───────────────────── r3 (dải dưới) ────────────────────┘
  R = hình chữ nhật mục tiêu (khung ngoài)    ○ = điểm nhãn 0, nằm ngoài R
  Mỗi dải r_i có khối lượng xác suất ≥ ε/4
  R_S chạm cả bốn dải ⇒ lỗi ≤ ε
  Lỗi > ε ⇒ có ít nhất một dải không chứa mẫu nào
```

**Bước 0: lỗi chỉ nằm một phía.** $R$ là một hình chữ nhật chứa mọi điểm dương, còn $R_S$ là hình nhỏ nhất như vậy, nên $R_S\subseteq R$. Do đó $R_S$ không có false positive, và $R(R_S)=\Pr[R\setminus R_S]$.

**Bước 1: trường hợp tầm thường.** Nếu $\Pr[R]\le\epsilon$ thì $R(R_S)\le\Pr[R]\le\epsilon$ với mọi $S$. Vậy chỉ cần xét $\Pr[R]>\epsilon$. Appendix A.1 của SAM mở đầu bằng đúng thủ thuật này: khi vế phải lớn hơn 1 thì cận hiển nhiên đúng, nên chỉ xét phần còn lại.

**Bước 2: dựng bốn dải.** Viết $R=[l,r]\times[b,t]$. Dải trái là

$$r_4=[l,s_4]\times[b,t],\qquad s_4=\inf\big\{s:\ \Pr\big([l,s]\times[b,t]\big)\ge\epsilon/4\big\}.$$

$s_4$ tồn tại trong $[l,r]$ vì $\Pr[R]>\epsilon$. Ba dải còn lại dựng tương tự. Mỗi dải có hai tính chất ngược chiều nhau, dùng ở hai bước khác nhau:

- **(a)** $\Pr[r_4]\ge\epsilon/4$. Với mọi $s>s_4$, khối lượng đã $\ge\epsilon/4$. Vì $[l,s_4]$ là giao giảm dần của các $[l,s]$, theo tính liên tục của độ đo, giới hạn vẫn $\ge\epsilon/4$. Tính chất này dùng ở bước 4.
- **(b)** $\Pr[\bar r_4]\le\epsilon/4$, với $\bar r_4=[l,s_4)\times[b,t]$ (bỏ cạnh phải). Với mọi $s<s_4$, khối lượng $<\epsilon/4$, và $[l,s_4)$ là hợp tăng dần của các $[l,s]$. Tính chất này dùng ở bước 3.

Sách chỉ viết "it is not hard to see". Đây là chỗ cần nói rõ, vì hai bất đẳng thức ngược chiều phục vụ hai mục đích khác nhau.

**Bước 3: lập luận hình học.** Giả sử $R_S$ giao cả bốn dải. Giao $r_4$ nghĩa là cạnh trái $l_S$ của $R_S$ thỏa $l_S\le s_4$. Một điểm của $R$ nằm ngoài $R_S$ phải vượt ra ít nhất một cạnh. Nếu nó vượt cạnh trái, hoành độ của nó thuộc $[l,l_S)\subseteq[l,s_4)$, tức nó thuộc $\bar r_4$; ba cạnh còn lại tương tự. Vậy:

$$R\setminus R_S\ \subseteq\ \bar r_1\cup\bar r_2\cup\bar r_3\cup\bar r_4\quad\Longrightarrow\quad R(R_S)\le 4\cdot\frac{\epsilon}{4}=\epsilon.$$

Phản đảo: nếu $R(R_S)>\epsilon$ thì $R_S$ bỏ lỡ ít nhất một dải.

**Bước 4: xác suất bỏ lỡ một dải.** Sự kiện $R_S\cap r_4=\emptyset$ trùng với sự kiện "không điểm mẫu nào rơi vào $r_4$". Sách bỏ qua bước này, nên chứng minh cả hai chiều:

- Chiều thuận: một mẫu trong $r_4$ nằm trong $R$ nên có nhãn 1, do đó thuộc $R_S$.
- Chiều nghịch: nếu $r_4$ không có mẫu nào, mọi điểm dương có hoành độ $>s_4$, nên $l_S>s_4$.

Vì $m$ mẫu độc lập và theo tính chất (a):

$$\Pr_{S\sim D^m}\big[R_S\cap r_i=\emptyset\big]=\big(1-\Pr[r_i]\big)^m\le\Big(1-\frac{\epsilon}{4}\Big)^m$$

**Bước 5: union bound và $1-x\le e^{-x}$.**

$$\Pr_{S\sim D^m}\big[R(R_S)>\epsilon\big]\ \le\ \Pr\Big[\bigcup_{i=1}^{4}\{R_S\cap r_i=\emptyset\}\Big]\ \le\ \sum_{i=1}^{4}\Pr\big[R_S\cap r_i=\emptyset\big]\ \le\ 4\Big(1-\frac{\epsilon}{4}\Big)^m\ \le\ 4e^{-m\epsilon/4}$$

Bất đẳng thức $1-x\le e^{-x}$ đúng với mọi $x$ thực. Lý do: hàm $e^{-x}$ lồi nên nằm trên tiếp tuyến của nó tại 0, và tiếp tuyến đó chính là $1-x$.

**Bước 6: giải ngược ra số mẫu và cận.**

$$4e^{-m\epsilon/4}\le\delta\iff m\ge\frac{4}{\epsilon}\log\frac{4}{\delta};\qquad\text{tương đương: với xác suất }\ge1-\delta,\quad R(R_S)\le\frac{4}{m}\log\frac{4}{\delta}$$

Ví dụ số: với $\epsilon=0{,}1$ và $\delta=0{,}05$ cần $m\ge 40\ln 80\approx175{,}3$, tức 176 mẫu, cho mọi phân phối $D$.

**Bốn bài học mang theo:**

1. $H$ vô hạn vẫn học được. Lý do sâu là VC-dimension của hình chữ nhật bằng 4 (Ví dụ 3.14, mục 7), không phải số phần tử của $H$.
2. Các dải $r_i$ phụ thuộc $D$ mà thuật toán không biết; chúng chỉ tồn tại trong chứng minh. Lưới giá trị $\sigma_P$ và posterior $Q$ trong Appendix A.1 cũng vậy: SAM không bao giờ tính chúng.
3. Union bound biến "một trong nhiều điều xấu" thành một tổng. Cái giá là hệ số 4 nằm trong $\log(4/\delta)$. Appendix A.1 trả cái giá này cho vô hạn đếm được giá trị $\sigma_P$.
4. Tốc độ $1/m$ có được vì $R_S$ luôn nhất quán (không sai trên mẫu). Mục 4 cho thấy bỏ giả thiết này thì tốc độ thành $1/\sqrt m$, đúng dạng căn trong Định lý 1 của SAM.

---

## 3. $H$ hữu hạn, trường hợp nhất quán (Định lý 2.5, tr. 15–19)

Lập luận hình học của Ví dụ 2.4 không tổng quát hóa được (sách nêu ví dụ hình tròn không đồng tâm). Định lý 2.5 thay hình học bằng phép đếm: nếu $H$ hữu hạn, mọi thuật toán trả về giả thuyết nhất quán đều có $R(h_S)\le\frac{1}{m}\big(\log|H|+\log\frac1\delta\big)$.

**Phát biểu.** Cho $H$ hữu hạn, $c\in H$, và thuật toán luôn trả về $h_S$ với $\hat R_S(h_S)=0$. Khi đó:

$$m\ge\frac{1}{\epsilon}\Big(\log|H|+\log\frac{1}{\delta}\Big)\ \Longrightarrow\ \Pr_{S\sim D^m}\big[R(h_S)\le\epsilon\big]\ge1-\delta,\qquad\text{hay}\quad R(h_S)\le\frac{1}{m}\Big(\log|H|+\log\frac{1}{\delta}\Big)$$

**Chứng minh, từng bước.**

1. Ta không biết thuật toán chọn $h_S$ nào, và $h_S$ phụ thuộc $S$. Nên phải chặn cho *mọi* giả thuyết nhất quán cùng lúc (uniform convergence).
2. Đặt $H_\epsilon=\{h\in H:\ R(h)>\epsilon\}$, tập các giả thuyết "xấu".
3. Với một $h$ cố định trong $H_\epsilon$, mỗi mẫu được phân loại đúng với xác suất $1-R(h)<1-\epsilon$, độc lập giữa các mẫu. Vậy $\Pr[\hat R_S(h)=0]\le(1-\epsilon)^m$.
4. Union bound trên $H_\epsilon$, rồi dùng $1-x\le e^{-x}$:

$$\Pr\big[\exists h\in H_\epsilon:\ \hat R_S(h)=0\big]\ \le\ \sum_{h\in H_\epsilon}\Pr\big[\hat R_S(h)=0\big]\ \le\ |H_\epsilon|(1-\epsilon)^m\ \le\ |H|\,e^{-m\epsilon}$$

5. Nếu $R(h_S)>\epsilon$ thì $h_S$ là một phần tử nhất quán của $H_\epsilon$, tức sự kiện ở bước 4 xảy ra. Vậy $\Pr[R(h_S)>\epsilon]\le|H|e^{-m\epsilon}$. Đặt vế phải bằng $\delta$ rồi giải ra $\epsilon$.

**Cách đọc.** Trực giác cần giữ: một giả thuyết xấu rất khó "may mắn" đúng trên $m$ mẫu, vì xác suất đó giảm theo mũ $m$. Nên dù có $|H|$ giả thuyết xấu, hệ số $|H|$ chỉ đi vào log. Đại lượng $\log_2|H|$ là số bit cần để mô tả một phần tử của $H$. Cận nói rằng khái quát được kiểm soát bởi tỉ lệ (số bit)/(số mẫu).

**Các ví dụ 2.6–2.9: cách biểu diễn quyết định việc học có khả thi không.**

| Ví dụ | $\lvert H\rvert$ | Số mẫu theo Định lý 2.5 | Kết luận |
| --- | --- | --- | --- |
| 2.6 Hội của tối đa $n$ literal Boolean | $3^n$ (mỗi biến: có, phủ định, hoặc vắng) | $\frac{1}{\epsilon}\big(n\log3+\log\frac1\delta\big)$; với $n=10$, $\epsilon=0{,}1$, $\delta=0{,}02$ cần 149 mẫu | Efficiently PAC-learnable: thuật toán chỉ dùng mẫu dương, $O(n)$ mỗi mẫu |
| 2.7 Lớp phổ quát: mọi tập con của $\{0,1\}^n$ | $2^{2^n}$ | $\frac{1}{\epsilon}\big(2^n\log2+\log\frac1\delta\big)$, mũ theo $n$ | Định lý không đảm bảo; thực tế lớp này không PAC-learnable |
| 2.8 $k$-term DNF | $3^{nk}$ | Đa thức | Đủ mẫu, nhưng tìm giả thuyết nhất quán là NP-khó (trừ khi RP = NP) |
| 2.9 $k$-CNF | Quy về hội literal với $(2n)^k$ biến mới | Đa thức | Efficiently PAC-learnable, dù mọi $k$-term DNF đều viết được thành $k$-CNF |

Nghịch lý ở 2.8–2.9 được giải thích bằng cách biểu diễn. Học trong không gian $k$-CNF thì dễ, nhưng chuyển kết quả về dạng $k$-term DNF là bài toán khó. Bài học: với cùng một lớp hàm, học dễ hay khó phụ thuộc vào cách chọn $H$.

**Mở rộng nhỏ (không có nguyên văn trong chương 2): union bound có trọng số.** Chứng minh trên chia đều "ngân sách thất bại" $\delta$ cho $|H|$ giả thuyết. Giả sử trước khi thấy dữ liệu, ta gán cho mỗi $h$ một trọng số $p(h)>0$ với tổng bằng 1. Khi đó có thể chia ngân sách theo $p(h)$: với mỗi $h$, chọn $\epsilon_h$ sao cho $e^{-m\epsilon_h}=p(h)\,\delta$.

$$\Pr\big[\exists h:\ \hat R_S(h)=0,\ R(h)>\epsilon_h\big]\ \le\ \sum_h e^{-m\epsilon_h}=\sum_h p(h)\,\delta=\delta\quad\Longrightarrow\quad R(h_S)\le\frac{1}{m}\Big(\log\frac{1}{p(h_S)}+\log\frac{1}{\delta}\Big)$$

Cách này chạy được cả khi $H$ vô hạn đếm được. Với $p$ đều, $\log\frac{1}{p(h)}=\log|H|$ và ta lấy lại Định lý 2.5.

Đây là mầm của PAC-Bayes: $p$ là một *prior*, và $\log\frac{1}{p(h)}$ chính là $\mathrm{KL}(Q\Vert P)$ khi $Q$ dồn toàn bộ khối lượng vào $h$ (mục 8). Cùng kỹ thuật này xuất hiện trong chứng minh Định lý 4.2 (SRM) của sách và trong bước chọn $\sigma_P$ của Appendix A.1.

---

## 4. Hoeffding và trường hợp không nhất quán (mục 2.3 và Appendix D.1)

Khi không có giả thuyết nào đúng hoàn toàn trên mẫu, cận đổi từ dạng $1/m$ sang dạng căn:

$$R(h)\le\hat R_S(h)+\sqrt{\frac{\log|H|+\log(2/\delta)}{2m}}.$$

Công thức (5) trong Appendix A.1 của SAM có đúng hình dạng này, với $\log|H|$ thay bằng $\mathrm{KL}(Q\Vert P)$.

### 4.1 Công cụ: kỹ thuật Chernoff

Bất đẳng thức Markov: với $Y\ge0$ và $a>0$, $\Pr[Y\ge a]\le\mathbb{E}[Y]/a$. Áp dụng cho $Y=e^{tX}$ với $t>0$ bất kỳ (công thức D.1):

$$\Pr[X\ge\epsilon]=\Pr\big[e^{tX}\ge e^{t\epsilon}\big]\le e^{-t\epsilon}\,\mathbb{E}\big[e^{tX}\big]\qquad\forall\,t>0$$

Từ đây chỉ còn hai việc: chặn trên hàm sinh moment $\mathbb{E}[e^{tX}]$, rồi chọn $t$ tốt nhất. Chiến lược "chặn MGF rồi tối ưu một tham số tự do" sẽ quay lại trong chứng minh PAC-Bayes và trong bổ đề $\chi^2$ của Laurent–Massart mà SAM dùng.

### 4.2 Bổ đề Hoeffding (Lemma D.1), chứng minh đầy đủ

**Phát biểu.** Nếu $\mathbb{E}[X]=0$ và $a\le X\le b$ thì $\mathbb{E}[e^{tX}]\le\exp\big(t^2(b-a)^2/8\big)$ với mọi $t>0$.

1. **Dùng tính lồi.** Mọi $x\in[a,b]$ là tổ hợp lồi của $a$ và $b$ với trọng số $\frac{b-x}{b-a}$ và $\frac{x-a}{b-a}$. Vì $e^{tx}$ lồi:
$$e^{tx}\le\frac{b-x}{b-a}\,e^{ta}+\frac{x-a}{b-a}\,e^{tb}.$$
2. **Lấy kỳ vọng, dùng $\mathbb{E}[X]=0$.**
$$\mathbb{E}[e^{tX}]\le\frac{b}{b-a}\,e^{ta}-\frac{a}{b-a}\,e^{tb}=:e^{\varphi(t)}.$$
3. **Đổi biến.** Đặt $\alpha=\frac{-a}{b-a}$, thuộc $[0,1]$ vì $a\le0\le b$, và $s=t(b-a)$. Khi đó
$$\varphi=-\alpha s+\log\big(1-\alpha+\alpha e^{s}\big).$$
4. **Đạo hàm.** Ta có $\varphi(0)=0$. Đạo hàm theo $s$ bằng $-\alpha+\frac{\alpha e^s}{1-\alpha+\alpha e^s}$, bằng 0 tại $s=0$. Đạo hàm bậc hai theo $s$ bằng $u(1-u)$ với $u=\frac{\alpha e^s}{1-\alpha+\alpha e^s}\in[0,1]$, nên không vượt quá $1/4$. Đổi về biến $t$: $\varphi''(t)\le(b-a)^2/4$.
5. **Khai triển Taylor với phần dư Lagrange.** Tồn tại $\theta\in[0,t]$ sao cho
$$\varphi(t)=\varphi(0)+t\varphi'(0)+\frac{t^2}{2}\varphi''(\theta)\le\frac{t^2(b-a)^2}{8}.$$

Ý nghĩa: một biến bị chặn có đuôi nhẹ như một biến Gauss có phương sai $(b-a)^2/4$ (biến "sub-Gaussian").

### 4.3 Bất đẳng thức Hoeffding (Theorem D.2)

Cho $X_1,\dots,X_m$ độc lập, $X_i\in[a_i,b_i]$, và $S_m=\sum_i X_i$. Dùng kỹ thuật Chernoff, rồi tính độc lập (MGF của tổng bằng tích các MGF), rồi bổ đề Hoeffding cho từng $X_i-\mathbb{E}X_i$:

$$\Pr\big[S_m-\mathbb{E}S_m\ge\epsilon\big]\le e^{-t\epsilon}\prod_{i=1}^{m}\mathbb{E}\big[e^{t(X_i-\mathbb{E}X_i)}\big]\le\exp\Big(-t\epsilon+\frac{t^2}{8}\sum_{i=1}^{m}(b_i-a_i)^2\Big)$$

Số mũ ở vế phải là một parabol theo $t$, nhỏ nhất tại $t^*=4\epsilon\big/\sum_i(b_i-a_i)^2$. Thay $t^*$ vào:

$$\Pr\big[S_m-\mathbb{E}S_m\ge\epsilon\big]\le\exp\Big(-\frac{2\epsilon^2}{\sum_{i=1}^{m}(b_i-a_i)^2}\Big)$$

### 4.4 Một giả thuyết cố định (Hệ quả 2.10, 2.11)

Lấy $X_i=\mathbf{1}_{h(x_i)\neq c(x_i)}\in[0,1]$. Khi đó $\sum_i(b_i-a_i)^2=m$ và $S_m/m=\hat R_S(h)$. Sự kiện $\hat R_S(h)-R(h)\ge\epsilon$ chính là $S_m-\mathbb{E}S_m\ge m\epsilon$, nên có xác suất $\le\exp(-2m^2\epsilon^2/m)=\exp(-2m\epsilon^2)$. Cộng hai phía, rồi giải $2e^{-2m\epsilon^2}=\delta$:

$$\Pr\big[\lvert\hat R_S(h)-R(h)\rvert\ge\epsilon\big]\le2e^{-2m\epsilon^2}\ \Longrightarrow\ \text{với xác suất }\ge1-\delta:\quad R(h)\le\hat R_S(h)+\sqrt{\frac{\log(2/\delta)}{2m}}$$

**Lỗi số trong Ví dụ 2.12 (tung đồng xu, tr. 20).** Sách lấy $\delta=0{,}02$ và $m=500$, rồi viết $\sqrt{\log(10)/1000}\approx0{,}048$. Theo tính toán của mình, $\log(2/\delta)=\log100$, cho $\sqrt{4{,}605/1000}\approx0{,}068$. Con số $0{,}048$ ứng với $\delta=0{,}2$ (độ tin cậy 80%), không phải 98%. Nên kiểm tra lại trước khi dùng ví dụ này trên slide.

**Vì sao chưa dùng được cho $h_S$.** Hệ quả 2.11 cần $h$ cố định trước khi rút $S$. Với $h_S$, các $X_i$ không còn là các biến độc lập có kỳ vọng $R(h_S)$ (xem mệnh đề 2.3 ở mục 1). Lại cần uniform convergence.

### 4.5 Định lý 2.13: $H$ hữu hạn, trường hợp không nhất quán

Union bound trên $|H|$ giả thuyết, mỗi cái đóng góp $2e^{-2m\epsilon^2}$:

$$\Pr\big[\exists h\in H:\ \lvert\hat R_S(h)-R(h)\rvert>\epsilon\big]\le2|H|e^{-2m\epsilon^2}=\delta\ \Longrightarrow\ \forall h\in H:\ R(h)\le\hat R_S(h)+\sqrt{\frac{\log|H|+\log(2/\delta)}{2m}}$$

Vì cận đúng cho mọi $h$ cùng lúc, nó đúng cho $h_S$, dù thuật toán chọn $h_S$ thế nào.

**Hai dạng cận, hai tốc độ.** Ví dụ số của mình với $|H|=2^{20}$, $\epsilon=0{,}05$, $\delta=0{,}05$:

| Trường hợp | Cận | Số mẫu cần |
| --- | --- | --- |
| Nhất quán (Định lý 2.5) | $\big(\log\lvert H\rvert+\log\frac1\delta\big)/m$ | 338 |
| Không nhất quán (Định lý 2.13) | $\sqrt{\big(\log\lvert H\rvert+\log\frac2\delta\big)/(2m)}$ | 3.511 |

**Vì sao lại có căn.** Trong trường hợp nhất quán, ta chỉ cần loại những giả thuyết có lỗi $\epsilon$ mà lại đúng hết trên mẫu. Xác suất đó là $(1-\epsilon)^m\approx e^{-m\epsilon}$: số mũ tuyến tính theo $\epsilon$, vì biến Bernoulli có tham số gần 0 có phương sai nhỏ.

Trong trường hợp tổng quát, phải phát hiện độ lệch $\epsilon$ của một trung bình có phương sai tới $1/4$. Số mũ là bậc hai theo $\epsilon$, nên $\epsilon\sim1/\sqrt m$. Bất đẳng thức Bernstein (bài tập D.6) nối hai chế độ này thông qua phương sai.

**Occam.** Cận đánh đổi hai số hạng: $H$ lớn giúp $\hat R_S$ nhỏ, nhưng làm $\log|H|$ lớn. Với cùng lỗi thực nghiệm, $H$ đơn giản hơn thì tốt hơn.

**Đặt cạnh công thức (5) của SAM** (đổi $m$ thành $n$, $h$ thành $w$):

$$\text{Mohri (Định lý 2.13):}\quad R(h)\le\hat R_S(h)+\sqrt{\frac{\log|H|+\log\frac{2}{\delta}}{2m}}$$

$$\text{SAM (công thức 5):}\quad \mathbb{E}_{w\sim Q}[L_D(w)]\le\mathbb{E}_{w\sim Q}[L_S(w)]+\sqrt{\frac{\mathrm{KL}(Q\Vert P)+\log\frac{n}{\delta}}{2(n-1)}}$$

Có ba thay đổi:

1. Một giả thuyết $h$ thành một phân phối $Q$ trên trọng số.
2. $\log|H|$ thành $\mathrm{KL}(Q\Vert P)$.
3. $\log(2/\delta)$ thành $\log(n/\delta)$, với $2(n-1)$ ở mẫu.

Thay đổi thứ ba là chi phí kỹ thuật của chứng minh PAC-Bayes. Cận của SAM thuộc loại có căn vì loss trong lân cận không bằng 0.

---

## 5. Agnostic PAC, Bayes error và nhiễu (mục 2.4, tr. 21–23)

SAM sống trong kịch bản ngẫu nhiên (stochastic): nhãn không phải hàm tất định của đầu vào. Vì vậy mục tiêu chỉ có thể là gần với giả thuyết tốt nhất, không phải lỗi bằng 0.

**Kịch bản ngẫu nhiên.** $D$ là phân phối trên $X\times Y$, mẫu là $S=((x_1,y_1),\dots,(x_m,y_m))$, và $R(h)=\Pr_{(x,y)\sim D}[h(x)\neq y]$. Các cận ở mục 4 vẫn giữ nguyên, vì Hoeffding chỉ cần các cặp $(x_i,y_i)$ độc lập và loss bị chặn. Sách gọi việc mở rộng này là "straightforward".

**Định nghĩa 2.14 (agnostic PAC).** $A$ là agnostic PAC-learning nếu, với $m$ đủ lớn theo một đa thức:

$$\Pr_{S\sim D^m}\Big[R(h_S)-\min_{h\in H}R(h)\le\epsilon\Big]\ge1-\delta\qquad\text{với mọi phân phối }D\text{ trên }X\times Y$$

Khác Định nghĩa 2.3 ở chỗ so với giả thuyết tốt nhất trong $H$, chứ không đòi lỗi tuyệt đối nhỏ.

**Bayes error và nhiễu (Định nghĩa 2.15, 2.16).** $R^*$ là lỗi nhỏ nhất đạt được bởi mọi hàm đo được:

$$R^*=\inf_{h\ \text{đo được}}R(h),\qquad h_{\text{Bayes}}(x)=\arg\max_{y\in\{0,1\}}\Pr[y\mid x],\qquad \mathrm{noise}(x)=\min\big\{\Pr[1\mid x],\ \Pr[0\mid x]\big\}$$

**Chứng minh $\mathbb{E}[\mathrm{noise}(x)]=R^*$** (sách chỉ nêu kết quả).

- Với mọi $h$ và mọi $x$, xác suất sai tại $x$ là $\Pr[y\neq h(x)\mid x]$. Giá trị này bằng $\Pr[0\mid x]$ hoặc $\Pr[1\mid x]$ tùy $h(x)$, nên luôn $\ge\mathrm{noise}(x)$.
- Lấy kỳ vọng theo $x$: $R(h)\ge\mathbb{E}[\mathrm{noise}(x)]$ với mọi $h$.
- Dấu bằng xảy ra với $h_{\text{Bayes}}$, vì nó chọn nhãn có xác suất lớn hơn tại từng $x$.

**Liên hệ với SAM.**

- Định lý 1 so $L_D(w)$ với một đại lượng thực nghiệm, không so với $R^*$. Nó nói về khoảng cách train–test, không nói SAM đạt gần Bayes error.
- Mọi cận trong chương 2–3 cần loss bị chặn (ở đây là loss 0-1 trong $[0,1]$). Chứng minh trong Appendix A.1 cũng dùng giả thiết này: câu "vế phải lớn hơn 1 nên bất đẳng thức hiển nhiên đúng" chỉ đúng khi $L_D\le1$.
- Cross-entropy mà SAM thực sự tối ưu không bị chặn. Vì vậy Định lý 1 áp cho loss 0-1 (hoặc loss bị chặn), còn thuật toán chạy trên một hàm thay thế. Đây là thêm một khoảng hở giữa lý thuyết và thuật toán, cùng loại với những khoảng hở đã nêu ở mục 3 của tài liệu Related Work.

---

## 6. Độ phức tạp Rademacher (mục 3.1, tr. 29–34)

Với $H$ vô hạn, $\log|H|=\infty$ và mọi cận ở mục 3–4 trở nên vô dụng. Rademacher thay "đếm số giả thuyết" bằng "đo mức $H$ khớp được nhiễu ngẫu nhiên trên chính mẫu", và cho:

$$R(h)\le\hat R_S(h)+\mathfrak{R}_m(H)+\sqrt{\frac{\log(1/\delta)}{2m}}.$$

**Định nghĩa 3.1 và 3.2.** $G$ là họ hàm từ $Z$ vào $[a,b]$ (thường $G$ là họ loss của $H$). $\sigma_1,\dots,\sigma_m$ là các biến Rademacher: độc lập, nhận $\pm1$ với xác suất $1/2$.

$$\hat{\mathfrak{R}}_S(G)=\mathbb{E}_{\sigma}\Big[\sup_{g\in G}\frac{1}{m}\sum_{i=1}^{m}\sigma_i\,g(z_i)\Big],\qquad \mathfrak{R}_m(G)=\mathbb{E}_{S\sim D^m}\big[\hat{\mathfrak{R}}_S(G)\big]$$

Cách đọc: $\sigma$ là một chuỗi dấu ngẫu nhiên, còn $\sup$ hỏi xem $G$ có hàm nào tương quan tốt với chuỗi đó trên mẫu không. Hai trường hợp cực:

- Nếu $G$ chỉ có một hàm thì $\sup$ biến mất, và kỳ vọng bằng 0 vì $\mathbb{E}[\sigma_i]=0$.
- Nếu $G$ (nhận giá trị $\pm1$) khớp được mọi chuỗi dấu trên mẫu, thì với mỗi $\sigma$ luôn có $g$ với $g(z_i)=\sigma_i$. Khi đó tổng bằng 1, giá trị lớn nhất có thể.

### 6.1 Công cụ: bất đẳng thức McDiarmid (Theorem D.8)

Nếu đổi đối số thứ $i$ của $f$ chỉ làm $f$ thay đổi tối đa $c_i$, thì $f(S)$ tập trung quanh kỳ vọng:

$$\big\lvert f(\dots,x_i,\dots)-f(\dots,x_i',\dots)\big\rvert\le c_i\ \ \forall i\ \Longrightarrow\ \Pr\big[f(S)-\mathbb{E}f(S)\ge\epsilon\big]\le\exp\Big(-\frac{2\epsilon^2}{\sum_i c_i^2}\Big)$$

Ý chứng minh:

1. Viết $f-\mathbb{E}f=\sum_k V_k$, với $V_k=\mathbb{E}[f\mid X_1..X_k]-\mathbb{E}[f\mid X_1..X_{k-1}]$.
2. Mỗi $V_k$ có kỳ vọng có điều kiện bằng 0 và nằm trong một đoạn dài $c_k$.
3. Áp bổ đề Hoeffding có điều kiện cho từng $V_k$, rồi dùng kỹ thuật Chernoff (bất đẳng thức Azuma, D.7).

Hoeffding là trường hợp riêng của McDiarmid khi $f$ là trung bình mẫu.

### 6.2 Định lý 3.3, chứng minh từng bước

**Phát biểu.** $G$ nhận giá trị trong $[0,1]$. Với xác suất ít nhất $1-\delta$, với mọi $g\in G$:

$$\mathbb{E}[g(z)]\le\frac{1}{m}\sum_{i=1}^{m}g(z_i)+2\mathfrak{R}_m(G)+\sqrt{\frac{\log(1/\delta)}{2m}}\qquad(3.3)$$

$$\mathbb{E}[g(z)]\le\frac{1}{m}\sum_{i=1}^{m}g(z_i)+2\hat{\mathfrak{R}}_S(G)+3\sqrt{\frac{\log(2/\delta)}{2m}}\qquad(3.4)$$

**Chứng minh.**

1. **Gói "trường hợp xấu nhất" vào một biến.** Đặt $\Phi(S)=\sup_g\big(\mathbb{E}[g]-\hat{\mathbb{E}}_S[g]\big)$, với $\hat{\mathbb{E}}_S[g]$ là trung bình mẫu. Chặn $\Phi(S)$ là chặn đồng thời mọi $g$.
2. **$\Phi$ có sai phân bị chặn.** Gọi $S$ và $S'$ là hai mẫu khác nhau đúng một điểm. Vì $\sup A-\sup B\le\sup(A-B)$:
$$\Phi(S')-\Phi(S)\le\sup_g\frac{g(z_m)-g(z_m')}{m}\le\frac1m.$$
Chiều ngược lại tương tự.
3. **Áp McDiarmid với $c_i=1/m$**, nên $\sum_i c_i^2=1/m$. Với xác suất $\ge1-\delta$:
$$\Phi(S)\le\mathbb{E}[\Phi(S)]+\sqrt{\frac{\log(1/\delta)}{2m}}.$$
Còn lại là chặn $\mathbb{E}[\Phi(S)]$.
4. **Mẫu ma (ghost sample).** Lấy $S'$ độc lập, cùng phân phối với $S$. Theo (2.3), $\mathbb{E}[g]=\mathbb{E}_{S'}\big[\hat{\mathbb{E}}_{S'}[g]\big]$. Sup của một kỳ vọng không vượt kỳ vọng của sup:
$$\mathbb{E}_S[\Phi(S)]=\mathbb{E}_S\Big[\sup_g\mathbb{E}_{S'}\big[\hat{\mathbb{E}}_{S'}[g]-\hat{\mathbb{E}}_S[g]\big]\Big]\le\mathbb{E}_{S,S'}\Big[\sup_g\frac{1}{m}\sum_{i=1}^{m}\big(g(z_i')-g(z_i)\big)\Big]$$
5. **Đưa dấu $\sigma_i$ vào.** Đổi chỗ $z_i$ với $z_i'$ không làm thay đổi phân phối của cặp $(S,S')$. Việc đổi chỗ này tương đương nhân số hạng thứ $i$ với $-1$. Vậy có thể chèn $\sigma_i$ ngẫu nhiên mà kỳ vọng giữ nguyên. Đây là bước **symmetrization**, lõi của cả chứng minh.
6. **Tách $\sup$.** Dùng $\sup(U+V)\le\sup U+\sup V$, và việc $-\sigma_i$ có cùng phân phối với $\sigma_i$:
$$\mathbb{E}_{\sigma,S,S'}\Big[\sup_g\frac1m\sum_i\sigma_i\big(g(z_i')-g(z_i)\big)\Big]\le\mathbb{E}_{\sigma,S'}\Big[\sup_g\frac1m\sum_i\sigma_i g(z_i')\Big]+\mathbb{E}_{\sigma,S}\Big[\sup_g\frac1m\sum_i(-\sigma_i)g(z_i)\Big]=2\mathfrak{R}_m(G)$$
7. **Ghép lại**, ta được (3.3). Để có bản tính được từ dữ liệu (3.4):
    - $\hat{\mathfrak{R}}_S(G)$ cũng có sai phân bị chặn $1/m$. McDiarmid lần hai cho $\mathfrak{R}_m(G)\le\hat{\mathfrak{R}}_S(G)+\sqrt{\log(2/\delta)/(2m)}$ với xác suất $1-\delta/2$.
    - Dùng $\delta/2$ cho lần McDiarmid đầu, rồi union bound hai sự kiện.
    - Vế phải thành $2\cdot(\text{một căn})+(\text{một căn})=3$ căn.

### 6.3 Từ họ loss về $H$ (Bổ đề 3.4, Định lý 3.5)

Với $h$ nhận giá trị $\pm1$ và loss 0-1, ta có $\mathbf{1}_{h(x)\neq y}=\big(1-y\,h(x)\big)/2$. Khi thay vào định nghĩa Rademacher:

- Phần hằng số $\sigma_i/2$ không phụ thuộc $h$, nên ra khỏi $\sup$ và có kỳ vọng 0.
- $-\sigma_i y_i$ có cùng phân phối với $\sigma_i$ khi $y_i$ cố định.

Vậy $\hat{\mathfrak{R}}_S(G)=\tfrac12\hat{\mathfrak{R}}_{S_X}(H)$, và hệ số 2 trong (3.3) triệt tiêu:

$$R(h)\le\hat R_S(h)+\mathfrak{R}_m(H)+\sqrt{\frac{\log(1/\delta)}{2m}}\qquad(3.17)$$

$$R(h)\le\hat R_S(h)+\hat{\mathfrak{R}}_S(H)+3\sqrt{\frac{\log(2/\delta)}{2m}}\qquad(3.18)$$

### 6.4 Tính $\hat{\mathfrak{R}}_S(H)$ chính là huấn luyện với nhãn ngẫu nhiên

Vì $\sigma_i$ và $-\sigma_i$ cùng phân phối:

$$\hat{\mathfrak{R}}_S(H)=-\mathbb{E}_\sigma\Big[\inf_h\frac1m\sum_i\sigma_i h(x_i)\Big].$$

Với mỗi $\sigma$ cố định, bài toán $\inf$ là ERM trên bộ nhãn ngẫu nhiên $\sigma$ (tr. 34). Nói cách khác: muốn đo Rademacher, hãy gán nhãn ngẫu nhiên cho dữ liệu và xem mô hình khớp được bao nhiêu.

Đó đúng là thí nghiệm của Zhang et al. (2017) mà SAM trích ở đoạn đầu Introduction. Mạng sâu khớp 100% nhãn ngẫu nhiên trên CIFAR, tức $\hat{\mathfrak{R}}_S(H)$ của lớp mạng đó gần bằng 1. Khi đó (3.18) cho $R(h)\le\hat R_S(h)+1+\dots$, một cận vô nghĩa. Mục 8 bàn tiếp hệ quả này.

---

## 7. Growth function, VC-dimension và cận dưới (mục 3.2–3.4, tr. 34–48)

$\hat{\mathfrak{R}}_S(H)$ có thể khó tính (vì là một bài ERM), nên sách chặn nó bằng hai đại lượng tổ hợp: growth function $\Pi_H(m)$ và VC-dimension $d$. Chuỗi kết quả cuối cùng cho:

$$R(h)\le\hat R_S(h)+O\Big(\sqrt{d\log(m/d)/m}\Big).$$

Cận dưới ở cuối mục cho thấy $d$ là đại lượng đúng trong trường hợp xấu nhất.

### 7.1 Growth function và bổ đề Massart

**Định nghĩa 3.6.** $\Pi_H(m)$ là số cách gán nhãn (dichotomy) khác nhau nhiều nhất mà $H$ tạo ra được trên $m$ điểm. Luôn có $\Pi_H(m)\le2^m$. Khác Rademacher, đại lượng này không phụ thuộc phân phối.

**Bổ đề Massart (3.7).** Cho $A$ là tập hữu hạn trong $\mathbb{R}^m$, và $r=\max_{x\in A}\|x\|_2$. Khi đó:

$$\mathbb{E}_\sigma\Big[\sup_{x\in A}\frac1m\sum_{i=1}^{m}\sigma_i x_i\Big]\le\frac{r\sqrt{2\log|A|}}{m}$$

**Chứng minh** (qua bất đẳng thức cực đại D.10–D.11):

1. Với mỗi $x\in A$, $X_x=\sum_i\sigma_i x_i$ là tổng các biến độc lập, trung bình 0, nằm trong $[-|x_i|,|x_i|]$. Áp bổ đề Hoeffding cho từng số hạng rồi nhân lại:
$$\mathbb{E}[e^{tX_x}]\le e^{t^2\|x\|^2/2}\le e^{t^2r^2/2}.$$
2. Dùng Jensen, rồi chặn max bởi tổng:
$$e^{t\,\mathbb{E}[\max_x X_x]}\le\mathbb{E}\big[e^{t\max_x X_x}\big]\le\sum_x\mathbb{E}[e^{tX_x}]\le|A|\,e^{t^2r^2/2}.$$
3. Lấy log rồi chia cho $t$:
$$\mathbb{E}[\max_x X_x]\le\frac{\log|A|}{t}+\frac{tr^2}{2}.$$
Chọn $t=\sqrt{2\log|A|}/r$ được $r\sqrt{2\log|A|}$. Cuối cùng chia cho $m$.

Bước 2 là một "union bound dạng kỳ vọng": thay max bằng tổng bên trong hàm mũ, giá phải trả là $\log|A|$.

**Hệ quả 3.8 và 3.9.** Với $G$ nhận giá trị $\pm1$, các vector $(g(x_1),\dots,g(x_m))$ có chuẩn $\sqrt m$, và có không quá $\Pi_G(m)$ vector khác nhau. Massart cho $\mathfrak{R}_m(G)\le\sqrt{2\log\Pi_G(m)/m}$. Thay vào (3.17):

$$R(h)\le\hat R_S(h)+\sqrt{\frac{2\log\Pi_H(m)}{m}}+\sqrt{\frac{\log(1/\delta)}{2m}}\qquad(3.22)$$

So với Định lý 2.13, $\log|H|$ được thay bằng $\log\Pi_H(m)$: số cách gán nhãn *thực sự phân biệt được* trên $m$ điểm. Có vô hạn giả thuyết, nhưng chỉ hữu hạn hành vi trên mẫu.

### 7.2 VC-dimension

**Định nghĩa 3.10.** $H$ shatter một tập $m$ điểm nếu tạo được cả $2^m$ cách gán nhãn trên tập đó. $\mathrm{VCdim}(H)=\max\{m:\ \Pi_H(m)=2^m\}$.

Muốn chứng minh $\mathrm{VCdim}=d$ cần hai chiều:

- Cận dưới: chỉ ra **một** tập $d$ điểm bị shatter.
- Cận trên: chứng minh **mọi** tập $d+1$ điểm đều không bị shatter. Chiều này thường khó hơn.

| Ví dụ | VCdim | Lý do cận trên |
| --- | --- | --- |
| 3.11 Đoạn thẳng trên $\mathbb{R}$ | 2 | Ba điểm không tạo được nhãn $(+,-,+)$ |
| 3.12 Siêu phẳng trong $\mathbb{R}^d$ | $d+1$ | Định lý Radon: $d+2$ điểm luôn chia được thành hai nhóm có bao lồi giao nhau, nên không tách được bằng siêu phẳng |
| 3.14 Hình chữ nhật thẳng trục | 4 | Với 5 điểm, hộp bao được xác định bởi tối đa 4 điểm cực (trái, phải, trên, dưới). Gán $-$ cho điểm còn lại và $+$ cho 4 điểm cực là không thể |
| 3.15 Đa giác lồi $d$ đỉnh | $2d+1$ | Đặt các điểm trên một đường tròn là tối ưu |
| 3.16 $\{t\mapsto\sin(\omega t)\}$ | $\infty$ | Chỉ một tham số $\omega$ nhưng shatter được tập điểm lớn tùy ý (bài tập 3.20) |

Hàng 3.14 khép vòng với Ví dụ 2.4: $H$ vô hạn vẫn học được vì $\mathrm{VCdim}=4$.

Hàng 3.16 là bài học quan trọng cho mạng sâu: **số tham số không phải thước đo độ phức tạp đúng**. Cận của SAM vẫn chứa $k$ (số tham số), nhưng đi kèm $\log(1+\|w\|^2/\rho^2)$. Tức là nó phụ thuộc vào nghiệm $w$ cụ thể, chứ không chỉ vào lớp mô hình.

### 7.3 Bổ đề Sauer (3.17): từ $d$ sang $\Pi_H(m)$

$$\mathrm{VCdim}(H)=d\ \Longrightarrow\ \Pi_H(m)\le\sum_{i=0}^{d}\binom{m}{i}\qquad\forall m$$

**Chứng minh** bằng quy nạp theo $m+d$:

1. Cố định $S=\{x_1,\dots,x_m\}$ đạt $\Pi_H(m)$, và đặt $G=H|_S$. Mỗi phần tử của $G$ là một tập con của $S$ được gán nhãn 1. Đặt $S'=S\setminus\{x_m\}$.
2. Định nghĩa hai họ:
    - $G_1$: $G$ thu hẹp về $S'$ (quên $x_m$).
    - $G_2$: các tập con $g'\subseteq S'$ mà cả $g'$ lẫn $g'\cup\{x_m\}$ đều thuộc $G$.
3. **Đếm.** Mỗi phần tử của $G_1$ ứng với 1 hoặc 2 phần tử của $G$ (có hoặc không có $x_m$). Những phần tử ứng với 2 chính là $G_2$. Vậy $|G|=|G_1|+|G_2|$.
4. $\mathrm{VCdim}(G_1)\le d$, nên theo giả thiết quy nạp:
$$|G_1|\le\sum_{i\le d}\binom{m-1}{i}.$$
5. Nếu $Z\subseteq S'$ bị $G_2$ shatter thì $Z\cup\{x_m\}$ bị $G$ shatter, vì mỗi nhãn trên $Z$ đi được với cả hai nhãn của $x_m$. Vậy $\mathrm{VCdim}(G_2)\le d-1$, và:
$$|G_2|\le\sum_{i\le d-1}\binom{m-1}{i}.$$
6. Cộng lại và dùng đẳng thức Pascal $\binom{m-1}{i}+\binom{m-1}{i-1}=\binom{m}{i}$, ta được $\sum_{i\le d}\binom{m}{i}$.

**Hệ quả 3.18.** Với $m\ge d$, làm ba bước: nhân mỗi số hạng với $(m/d)^{d-i}\ge1$; thêm các số hạng từ $d+1$ đến $m$; dùng nhị thức Newton rồi $1+x\le e^x$:

$$\Pi_H(m)\le\sum_{i=0}^{d}\binom{m}{i}\le\Big(\frac md\Big)^d\sum_{i=0}^{m}\binom{m}{i}\Big(\frac dm\Big)^i=\Big(\frac md\Big)^d\Big(1+\frac dm\Big)^m\le\Big(\frac{em}{d}\Big)^d$$

Hệ quả đáng nhớ: growth function chỉ có hai kiểu. Hoặc nó là đa thức $O(m^d)$ khi $d$ hữu hạn, hoặc bằng $2^m$ với mọi $m$ khi $d=\infty$. Không có trường hợp ở giữa.

### 7.4 Cận VC (Hệ quả 3.19)

Thay $\log\Pi_H(m)\le d\log(em/d)$ vào (3.22):

$$R(h)\le\hat R_S(h)+\sqrt{\frac{2d\log\frac{em}{d}}{m}}+\sqrt{\frac{\log(1/\delta)}{2m}}=\hat R_S(h)+O\Big(\sqrt{\frac{\log(m/d)}{m/d}}\Big)$$

Khả năng khái quát được quyết định bởi tỉ lệ $m/d$. Đây là Occam lần thứ ba, với "đơn giản" đo bằng VC-dimension.

### 7.5 Cận dưới (Định lý 3.20, 3.23)

Với mọi thuật toán, tồn tại một phân phối xấu sao cho:

$$\text{realizable:}\quad\Pr\Big[R(h_S)>\frac{d-1}{32m}\Big]\ge\frac{1}{100}$$

$$\text{non-realizable:}\quad\Pr\Big[R(h_S)-\inf_{h\in H}R(h)>\sqrt{\frac{d}{320m}}\Big]\ge\frac{1}{64}$$

Ý chứng minh (phương pháp xác suất của Erdős):

- Dồn phân phối lên một tập bị shatter.
- Với điểm không xuất hiện trong mẫu, mọi cách gán nhãn đều có thể, nên thuật toán chỉ còn đoán như tung đồng xu.
- Lấy trung bình trên mọi cách gán nhãn để chứng minh có ít nhất một cách gán nhãn xấu.

Ý nghĩa: cận trên $d/m$ (realizable) và $\sqrt{d/m}$ (agnostic) là đúng tới hằng số và log. Nếu $d=\infty$ thì không thể PAC-learn. Đây là lý do các cận kiểu VC không thể cứu được mạng sâu: vấn đề không nằm ở hằng số, mà ở chính đại lượng được đo.

---

## 8. Vì sao các cận này rỗng với mạng sâu, và lối thoát PAC-Bayes

Cả ba thước đo của chương 2–3 ($\log|H|$, Rademacher, VC) chỉ phụ thuộc lớp $H$. Vì vậy chúng giống nhau cho mọi $h\in H$, kể cả nghiệm tốt lẫn nghiệm học thuộc. Với mạng khớp được nhãn ngẫu nhiên, cả ba đều $\ge1$. Lối thoát là cận phụ thuộc vào chính nghiệm $w$, và PAC-Bayes là lối mà SAM chọn.

**Ba con số cho mạng sâu (CIFAR, $n=50.000$):**

- Rademacher: Zhang et al. (2017) cho thấy mạng khớp được nhãn ngẫu nhiên, nên $\hat{\mathfrak{R}}_S(H)\approx1$ và (3.18) cho $R(h)\le\hat R_S(h)+1+\dots$ (mục 6.4).
- VC: mạng shatter được tập huấn luyện thì $d\ge m$. Thay $d=m$ vào Hệ quả 3.19, số hạng $\sqrt{2d\log(em/d)/m}$ bằng $\sqrt2\approx1{,}41$.
- Đếm tham số: WRN-28-10 có khoảng 36,5 triệu tham số, gấp khoảng 730 lần số mẫu.

Cận dưới ở mục 7.5 cho biết đây không phải lỗi hằng số. Một cận chỉ phụ thuộc $(d,m,\delta)$ phải đúng cả với phân phối xấu nhất, nên không thể nhỏ khi $d\ge m$. Muốn nói được gì, cận phải dùng thông tin về nghiệm cụ thể mà thuật toán tìm ra.

**Các lối thoát.**

- Sách có hai lối ở các chương sau: cận theo margin (chương 5) và ổn định thuật toán (chương 14).
- Lối thứ ba, PAC-Bayes (McAllester 1999), không có trong sách. Đó là lối Định lý 1 của SAM đi.

### 8.1 PAC-Bayes tổng quát hóa chương 2 như thế nào

Thay vì một giả thuyết $h$, ta làm hai việc:

- Chọn một prior $P$ trên trọng số *trước khi thấy dữ liệu*.
- Sau khi huấn luyện, trả về một posterior $Q$ bất kỳ (có thể phụ thuộc $S$).

Độ phức tạp là $\mathrm{KL}(Q\Vert P)$, một phiên bản liên tục của Định nghĩa E.2 trong sách:

$$\mathrm{KL}(Q\Vert P)=\mathbb{E}_{w\sim Q}\Big[\log\frac{q(w)}{p(w)}\Big]\ge0\qquad(\text{Mệnh đề E.3: bằng 0 khi và chỉ khi }Q=P)$$

Đây đúng là phần mở rộng của union bound có trọng số ở mục 3:

- Nếu $Q$ dồn toàn bộ khối lượng vào một $h$ trong $H$ đếm được, thì $\mathrm{KL}(Q\Vert P)=\log\frac{1}{P(h)}$.
- Nếu thêm $P$ đều trên $H$ hữu hạn, thì $\mathrm{KL}=\log|H|$.

Vậy Định lý 2.5 và 2.13 là trường hợp riêng của PAC-Bayes, tới hằng số.

### 8.2 Công cụ mới duy nhất: bất đẳng thức đổi độ đo

Union bound không dùng được cho tập trọng số vô hạn không đếm được. PAC-Bayes thay nó bằng bất đẳng thức Donsker–Varadhan. Với mọi hàm $f$, và mọi $Q,P$ có mật độ dương (như các phân phối Gauss trong SAM):

$$\mathbb{E}_Q[f]\le\mathrm{KL}(Q\Vert P)+\log\mathbb{E}_P\big[e^{f}\big]$$

Chứng minh chỉ một dòng, dùng Jensen cho hàm $\log$ lõm:

$$\log\mathbb{E}_P\big[e^{f}\big]=\log\mathbb{E}_Q\Big[e^{f}\,\frac{p}{q}\Big]\ge\mathbb{E}_Q\Big[f+\log\frac{p}{q}\Big]=\mathbb{E}_Q[f]-\mathrm{KL}(Q\Vert P)$$

**Vì sao nó thay được union bound.** Vế phải có hai phần:

- $\mathrm{KL}(Q\Vert P)$ chỉ phụ thuộc $Q$, nên $Q$ được phép phụ thuộc dữ liệu.
- $\log\mathbb{E}_P[e^f]$ lấy trung bình theo $P$. Vì $P$ cố định trước dữ liệu, mỗi $w$ trong đó cũng "cố định trước dữ liệu", giống $h$ trong Hệ quả 2.11.

Từ đó, chọn $f$ là một bội của độ lệch train–test. Hoeffding chặn được $\mathbb{E}_S\mathbb{E}_P[e^f]$, rồi Markov cho xác suất trên $S$. Chi tiết chứng minh này là nội dung của phần nối tiếp theo.

Hệ quả trực tiếp cho SAM: $P$ không được phụ thuộc dữ liệu. Đó là lý do Appendix A.1 không được chọn $\sigma_P$ tối ưu theo $w$. Thay vào đó, nó phải dựng sẵn một lưới giá trị rồi trả giá bằng union bound.

### 8.3 Vì sao độ phẳng xuất hiện

SAM chọn $Q=\mathcal{N}(w,\sigma^2I)$, một "đám mây" quanh nghiệm, và $P=\mathcal{N}(0,\sigma_P^2I)$. Khi đó $\mathbb{E}_Q[L_S]=\mathbb{E}_\epsilon[L_S(w+\epsilon)]$ là loss trung bình trong một lân cận của $w$. Đại lượng này nhỏ chỉ khi $w$ nằm trong vùng phẳng.

Đánh đổi nằm ở $\sigma$:

- $\sigma$ lớn làm KL nhỏ (đám mây gần prior hơn), nhưng làm loss trong lân cận lớn.
- $\sigma$ nhỏ thì ngược lại.

Bán kính $\rho$ của SAM sinh ra từ đúng đánh đổi này.

Cũng vì vậy, $Q$ phải là một đám mây chứ không phải một điểm. Trên không gian trọng số liên tục, $Q$ dồn vào một điểm $w$ cho $\mathrm{KL}(Q\Vert P)=\infty$, và cận trở nên vô dụng. Phải "làm mờ" nghiệm thành một phân phối thì mới trả được giá KL hữu hạn. Chính sự làm mờ đó đưa lân cận, tức độ phẳng, vào cận.

Dziugaite & Roy (2017) tối ưu trực tiếp cận kiểu này và thu được cận không rỗng đầu tiên cho mạng sâu trên MNIST. Đó là bằng chứng rằng lối này khác về chất so với chương 3, không chỉ khác hằng số.

---

## 9. Bản đồ sang Định lý 1 của SAM

Bảy bước của Appendix A.1 đều dựa trên công cụ đã có ở các mục trên. Chỉ hai chỗ cần thêm ngoài sách: bất đẳng thức đổi độ đo ở bước 2, và giả thiết $L_D(w)\le\mathbb{E}_\epsilon[L_D(w+\epsilon)]$ ở bước 7.

**Sơ đồ (chuyển sang bảng; ★ đánh dấu chỗ sách không có):**

| Bước trong Appendix A.1 | Công cụ trong sách Mohri |
| --- | --- |
| 1. Vế phải $>1$ thì cận hiển nhiên đúng; chỉ còn xét $\|w\|^2\le\rho^2\big(e^{4n/k}-1\big)$ | Ví dụ 2.4, bước 1: $\Pr[R]\le\epsilon$ thì lỗi $\le\epsilon$ với mọi $S$; chỉ xét phần còn lại |
| 2. Cận PAC-Bayes, công thức (5): $\mathbb{E}_Q L_D\le\mathbb{E}_Q L_S+\sqrt{(\mathrm{KL}+\log\frac n\delta)/(2(n-1))}$ | Định lý 2.13 + Hoeffding (D.2). ★ Thiếu: bất đẳng thức đổi độ đo (mục 8.2) |
| 3. KL giữa hai Gauss, công thức (6): $P=\mathcal{N}(0,\sigma_P^2I)$, $Q=\mathcal{N}(w,\sigma^2I)$ | Định nghĩa E.2 (KL); dạng đóng cho hai Gauss phải tự tính |
| 4. Lưới $\sigma_P^2=c\cdot\exp\big((1-j)/k\big)$, $\delta_j=\frac{6\delta}{\pi^2j^2}$, tổng các $\delta_j$ bằng $\delta$ | Định lý 4.2 (SRM) và mục 3: union bound có trọng số, $\sum1/k^2=\pi^2/6$ |
| 5. Chọn $j$ để $\sigma_P^2$ gần $\rho^2+\|w\|^2/k$; ra $k\log(1+\|w\|^2/\rho^2)$ và $2\log(6n+3k)$ | SRM: chọn $k$ theo cận; giá phải trả là thêm số hạng $\log k$ vào cận |
| 6. $\|\epsilon\|^2\le\rho^2$ với xác suất $1-1/\sqrt n$ (bổ đề $\chi^2$ của Laurent–Massart) | Kỹ thuật Chernoff (D.1, D.4): chặn hàm sinh moment rồi tối ưu tham số $t$ |
| 7. Từ trung bình sang max trong quả cầu; cần $L_D(w)\le\mathbb{E}_\epsilon L_D(w+\epsilon)$ | Loss bị chặn trong $[0,1]$ (mục 5). ★ Thiếu: giả thiết về $L_D$ quanh $w$ |

Các bước 1→7 nối tiếp nhau theo thứ tự chứng minh.

Hai điểm trùng hợp đáng chỉ ra trên slide:

- **Hằng số $\pi^2/6$.** Chứng minh Định lý 4.2 của sách (tr. 66) chia ngân sách thất bại cho lớp $H_k$ theo $1/k^2$ và dùng $\sum1/k^2=\pi^2/6$. Appendix A.1 làm đúng như vậy cho giá trị $\sigma_P$ thứ $j$: $\delta_j=6\delta/(\pi^2j^2)$, nên $\sum_j\delta_j=\delta$.
- **Cùng một cách mở đầu.** Ví dụ 2.4 loại trường hợp $\Pr[R]\le\epsilon$ vì lỗi hiển nhiên nhỏ. Appendix A.1 loại trường hợp vế phải $>1$ vì loss bị chặn bởi 1. Cả hai đều xử lý trường hợp tầm thường trước, để có giả thiết cần cho phần còn lại.

Phần nối chi tiết sẽ đi qua từng bước 1–7 với đầy đủ đại số. Phần đó gồm chứng minh cận PAC-Bayes (5) từ bất đẳng thức đổi độ đo và Hoeffding, và cách các số hạng $\log(1+\|w\|^2/\rho^2)$ và $2\log(6n+3k)$ sinh ra.

---

## 10. Câu hỏi tự kiểm tra

Nếu trả lời được các câu dưới mà không nhìn lại thì nền đã đủ để sang phần nối chi tiết với Appendix A.1. Mỗi câu ghi mục chứa câu trả lời; hãy cố viết ra giấy trước khi mở lại mục đó.

1. Trong Ví dụ 2.4, vì sao cần cả $\Pr[r_i]\ge\epsilon/4$ lẫn $\Pr[\bar r_i]\le\epsilon/4$? Mỗi bất đẳng thức dùng ở bước nào? (mục 2)
2. Nếu thuật toán trả về hình chữ nhật lớn nhất không chứa điểm âm nào, lỗi nằm ở phía nào của $R$, và các dải phải định nghĩa lại ra sao? (mục 2)
3. Mệnh đề $\mathbb{E}[\hat R_S(h)]=R(h)$ hỏng ở bước nào khi thay $h$ bằng $h_S$? Đưa một ví dụ cụ thể. (mục 1)
4. Với $H$ đếm được và prior $p(h_k)=6/(\pi^2k^2)$ cho phần tử thứ $k$, viết cận cho trường hợp nhất quán. Số hạng độ phức tạp tăng theo $k$ ra sao? (mục 3)
5. Vì sao cận nhất quán có tốc độ $1/m$ còn cận tổng quát chỉ có $1/\sqrt m$? Phương sai đóng vai trò gì? (mục 4)
6. Tự chứng minh lại bổ đề Hoeffding. Bước nào dùng $\mathbb{E}[X]=0$, bước nào dùng $X$ bị chặn? (mục 4.2)
7. Trong chứng minh Định lý 3.3, bước nào cần $S'$ độc lập và cùng phân phối với $S$, bước nào cần $\sigma_i$ đối xứng? (mục 6.2)
8. Tính $\hat{\mathfrak{R}}_S(H)$ khi $H$ chỉ có một hàm, và khi $H$ là mọi hàm từ $X$ vào $\{-1,+1\}$ trên $m$ điểm phân biệt. (mục 6)
9. Chứng minh lại VCdim của hình chữ nhật bằng 4, rồi giải thích vì sao điều này khớp với kết luận của Ví dụ 2.4. (mục 7.2)
10. Vì sao không thể dùng $Q$ dồn vào một điểm $w$ trong PAC-Bayes trên $\mathbb{R}^k$, và điều đó liên quan gì đến độ phẳng? (mục 8.3)
11. Trong Appendix A.1, vì sao không được đặt thẳng $\sigma_P^2=\rho^2+\|w\|^2/k$? Cái giá của việc dùng lưới là số hạng nào trong cận? (mục 8.2, 9)

---

## 11. Nguồn và số trang đối chiếu

Mọi định lý và số trang đã được đối chiếu trực tiếp với file PDF bạn gửi (Mohri, Rostamizadeh, Talwalkar, *Foundations of Machine Learning*, bản 2, MIT Press, 2018) và bản arXiv của SAM (Foret et al., ICLR 2021). Các chứng minh mở rộng đánh dấu "không có nguyên văn" là do mình viết.

| Kết quả | Trang sách | Trang PDF |
| --- | --- | --- |
| Định nghĩa 2.1–2.3, mệnh đề (2.3) | 10–11 | 27–28 |
| Ví dụ 2.4 (hình chữ nhật thẳng trục) | 12–14 | 29–31 |
| Định lý 2.5, Ví dụ 2.6–2.9 | 15–19 | 32–36 |
| Hệ quả 2.10–2.11, Ví dụ 2.12, Định lý 2.13 | 19–20 | 36–37 |
| Định nghĩa 2.14–2.16 | 22–23 | 39–40 |
| Định nghĩa 3.1–3.2, Định lý 3.3 | 30–33 | 47–50 |
| Bổ đề 3.4, Định lý 3.5 | 33–34 | 50–51 |
| Định nghĩa 3.6, bổ đề Massart 3.7, Hệ quả 3.8–3.9 | 34–35 | 51–52 |
| Định nghĩa 3.10, Ví dụ 3.11–3.16 | 36–40 | 53–57 |
| Bổ đề Sauer 3.17, Hệ quả 3.18–3.19 | 41–43 | 58–60 |
| Cận dưới 3.20 và 3.23 | 43–48 | 60–65 |
| Định lý 4.2 (SRM, hằng số $\pi^2/6$) | 66 | 83 |
| Bổ đề D.1, Định lý D.2 (Hoeffding) | 437–438 | 454–455 |
| Định lý D.8 (McDiarmid) | 442 | 459 |
| Định lý D.10, Hệ quả D.11 (bất đẳng thức cực đại) | 444–445 | 461–462 |
| Định nghĩa E.2, Mệnh đề E.3 (KL) | 450 | 467 |

**Phía SAM:** Định lý 1 (Section 2) và Appendix A.1, công thức (4)–(14), bản arXiv 2010.01412. Appendix A.1 dựa vào các nguồn: McAllester (1999), *PAC-Bayesian model averaging*; Dziugaite & Roy (2017); Langford & Caruana (2002); Laurent & Massart (2000); Chatterji, Neyshabur & Sedghi (2020).

**Ngoài sách, mình viết từ hiểu biết sẵn có, chưa đối chiếu nguồn gốc:**

- Bất đẳng thức đổi độ đo Donsker–Varadhan (mục 8.2). Nên kiểm tra trong một tài liệu PAC-Bayes trước khi đưa lên slide.
- Con số khoảng 36,5 triệu tham số của WRN-28-10.
