/**
 * Widget: một bước Coordinate Descent cho Lasso nhìn như một phép chiếu bị "kéo lùi".
 *
 * Vẽ trong mặt phẳng chứa xⱼ và phần dư riêng phần r⁽ʲ⁾. Trục ngang là đường thẳng qua xⱼ,
 * đo theo bội của xⱼ (vạch 1 = xⱼ), nên hoành độ của r⁽ʲ⁾ chính là βⱼ^OLS = ρⱼ / zⱼ.
 * Bước Lasso: βⱼ = S(ρⱼ, λ) / zⱼ, phần dư mới r^mới = r⁽ʲ⁾ − βⱼ xⱼ.
 *
 * Dùng trong bài viết (.md), trên một dòng riêng, có dòng trống trước và sau:
 *   <div data-widget="lasso-projection"></div>
 *
 * Tuỳ chọn:
 *   data-lambda="0.8"   λ ban đầu
 *   data-r="2.2,1.6"    toạ độ ban đầu của r⁽ʲ⁾ (theo bội của xⱼ)
 *   data-z="1"          zⱼ = (1/n)‖xⱼ‖² (mặc định 1, tức cột đã chuẩn hoá)
 *   data-lang="vi"      ép ngôn ngữ (mặc định theo trang)
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const I18N = {
  vi: {
    lambda: 'Giá trị λ',
    hint: 'Kéo đầu mút của r⁽ʲ⁾ (hoặc chạm vào hình) để đổi phần dư; dùng phím mũi tên khi đã chọn điểm.',
    newSup: 'mới',
    rho: '<i>ρ</i><sub>j</sub> = (1/<i>n</i>) <b>x</b><sub>j</sub><sup>⊤</sup><b>r</b><sup>(j)</sup>',
    ols: '<i>β</i><sub>j</sub><sup>OLS</sup> = <i>ρ</i><sub>j</sub> / <i>z</i><sub>j</sub>',
    lasso: '<i>β</i><sub>j</sub> = <i>S</i>(<i>ρ</i><sub>j</sub>, <i>λ</i>) / <i>z</i><sub>j</sub>',
    inner: '(1/<i>n</i>) <b>x</b><sub>j</sub><sup>⊤</sup><b>r</b><sup>mới</sup>',
    legendR: 'phần dư riêng phần',
    legendBeta: 'hình chiếu sau khi bị kéo lùi',
    legendNew: 'phần dư mới',
    legendOls: 'hình chiếu OLS (vuông góc)',
    legendBand: 'vùng βⱼ = 0 (|ρⱼ| ≤ λ)',
    ols0: (a) => `λ = 0 là OLS. Hình chiếu giữ nguyên độ dài, phần dư mới vuông góc với <b>x</b><sub>j</sub> (tích vô hướng = ${a}).`,
    active: (rho, lam, d, ip) =>
      `|<i>ρ</i><sub>j</sub>| = ${rho} &gt; <i>λ</i> = ${lam}: hình chiếu bị kéo lùi một đoạn <i>λ</i>/<i>z</i><sub>j</sub> = ${d} về phía gốc. Phần dư mới không còn vuông góc với <b>x</b><sub>j</sub>: tích vô hướng bằng ${ip}.`,
    dead: (rho, lam) =>
      `|<i>ρ</i><sub>j</sub>| = ${rho} ≤ <i>λ</i> = ${lam}: hình chiếu quá ngắn nên bị bỏ hẳn, <i>β</i><sub>j</sub> = 0 và phần dư mới bằng đúng <b>r</b><sup>(j)</sup>.`,
    aria: 'Hình tương tác: phép chiếu phần dư lên xⱼ và bước co ngưỡng mềm của Lasso.',
    handle: 'Đầu mút của r⁽ʲ⁾: dùng phím mũi tên để di chuyển',
  },
  en: {
    lambda: 'Penalty λ',
    hint: 'Drag the tip of r⁽ʲ⁾ (or tap the plot) to change the residual; arrow keys work once the point is focused.',
    newSup: 'new',
    rho: '<i>ρ</i><sub>j</sub> = (1/<i>n</i>) <b>x</b><sub>j</sub><sup>⊤</sup><b>r</b><sup>(j)</sup>',
    ols: '<i>β</i><sub>j</sub><sup>OLS</sup> = <i>ρ</i><sub>j</sub> / <i>z</i><sub>j</sub>',
    lasso: '<i>β</i><sub>j</sub> = <i>S</i>(<i>ρ</i><sub>j</sub>, <i>λ</i>) / <i>z</i><sub>j</sub>',
    inner: '(1/<i>n</i>) <b>x</b><sub>j</sub><sup>⊤</sup><b>r</b><sup>new</sup>',
    legendR: 'partial residual',
    legendBeta: 'projection after shrinking',
    legendNew: 'new residual',
    legendOls: 'OLS projection (perpendicular)',
    legendBand: 'region βⱼ = 0 (|ρⱼ| ≤ λ)',
    ols0: (a) => `λ = 0: this is plain OLS. The projection keeps its full length and the new residual is orthogonal to <b>x</b><sub>j</sub> (inner product = ${a}).`,
    active: (rho, lam, d, ip) =>
      `|<i>ρ</i><sub>j</sub>| = ${rho} &gt; <i>λ</i> = ${lam}: the projection is pulled back by <i>λ</i>/<i>z</i><sub>j</sub> = ${d} toward the origin. The new residual is no longer orthogonal to <b>x</b><sub>j</sub>: its inner product is exactly ${ip}.`,
    dead: (rho, lam) =>
      `|<i>ρ</i><sub>j</sub>| = ${rho} ≤ <i>λ</i> = ${lam}: the projection is too short and is dropped, so <i>β</i><sub>j</sub> = 0 and the new residual equals <b>r</b><sup>(j)</sup>.`,
    aria: 'Interactive plot: projecting the residual onto xⱼ and the Lasso soft-thresholding step.',
    handle: 'Tip of r⁽ʲ⁾: use the arrow keys to move it',
  },
};

const fmt = (x, digits = 2) => {
  const r = Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x;
  return r.toFixed(digits).replace('-', '−');
};

function svgEl(parent, tag, attrs = {}, style = '') {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (style) node.setAttribute('style', style);
  parent.appendChild(node);
  return node;
}

const LABEL =
  'fill: var(--text); font-size: 13px; font-family: var(--font-sans); paint-order: stroke; stroke: var(--surface); stroke-width: 4px; stroke-linejoin: round';

/** Nhãn toán trong SVG: parts = [[chữ, kiểu]] với kiểu 'b' (đậm, vector), 'i' (nghiêng), 'sub', 'sup' hoặc '' */
function mathText(parent, x, y, parts, anchor = 'middle', extra = '') {
  const t = svgEl(parent, 'text', { x, y, 'text-anchor': anchor }, LABEL + extra);
  let shift = 0;
  for (const [str, kind] of parts) {
    const target = kind === 'sup' ? -5 : kind === 'sub' ? 4 : 0;
    const span = svgEl(t, 'tspan', { dy: target - shift });
    if (kind === 'b') span.setAttribute('font-weight', '700');
    if (kind === 'i') span.setAttribute('font-style', 'italic');
    if (kind === 'sub' || kind === 'sup') span.setAttribute('font-size', '10px');
    span.textContent = str;
    shift = target;
  }
  return t;
}

/** Mũi tên từ (x1, y1) tới (x2, y2), toạ độ màn hình */
function arrow(parent, x1, y1, x2, y2, color, width = 2.5, extra = '') {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(11, len * 0.45);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  svgEl(parent, 'line', { x1, y1, x2: bx + ux * 1, y2: by + uy * 1 }, `stroke: ${color}; stroke-width: ${width}; stroke-linecap: round${extra}`);
  const w = head * 0.5;
  svgEl(parent, 'polygon', {
    points: `${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`,
  }, `fill: ${color}`);
}

let uid = 0;

export default function mount(root) {
  const ds = root.dataset;
  const pageLang = (ds.lang || document.documentElement.lang || 'en').toLowerCase();
  const lang = pageLang.startsWith('vi') ? 'vi' : 'en';
  const L = I18N[lang];
  const id = `w-lp-${++uid}`;

  const num = (v, d) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : d);
  const z = Math.min(4, Math.max(0.25, num(ds.z, 1)));
  const [r0x, r0y] = ds.r ? ds.r.split(',').map((v) => Number(v.trim())) : [NaN, NaN];
  const R = { x: Number.isFinite(r0x) ? r0x : 2.2, y: Number.isFinite(r0y) ? r0y : 1.6 };
  let lambda = Math.min(2.5, Math.max(0, num(ds.lambda, 0.8)));

  root.innerHTML = `
    <div class="w-controls">
      <div class="w-slider">
        <label for="${id}-l">${L.lambda}</label>
        <input id="${id}-l" type="range" min="0" max="2.5" step="0.05" value="${lambda}" />
        <output class="w-num" for="${id}-l"></output>
      </div>
    </div>
    <div class="w-stats w-stats-4">
      <div class="w-stat"><span class="w-stat-label">${L.rho}</span><span class="w-stat-value" data-out="rho"></span></div>
      <div class="w-stat"><span class="w-stat-label">${L.ols}</span><span class="w-stat-value" data-out="ols"></span></div>
      <div class="w-stat"><span class="w-stat-label">${L.lasso}</span><span class="w-stat-value" data-out="beta"></span></div>
      <div class="w-stat"><span class="w-stat-label">${L.inner}</span><span class="w-stat-value" data-out="inner"></span></div>
    </div>
    <p class="w-status" aria-live="polite" data-out="status"></p>
    <div class="w-plot"><svg role="img" aria-label="${L.aria}"></svg></div>
    <div class="w-legend">
      <span><i class="w-sw" style="background: var(--w-series-1)"></i><span><b>r</b><sup>(j)</sup> ${L.legendR}</span></span>
      <span><i class="w-sw" style="background: var(--w-series-2)"></i><span><i>β</i><sub>j</sub><b>x</b><sub>j</sub> ${L.legendBeta}</span></span>
      <span><i class="w-sw" style="background: var(--w-series-3)"></i><span><b>r</b><sup>${L.newSup}</sup> ${L.legendNew}</span></span>
      <span><i class="w-sw w-sw-dash"></i>${L.legendOls}</span>
      <span><i class="w-sw w-sw-band"></i>${L.legendBand}</span>
    </div>
    <p class="w-hint">${L.hint}</p>`;

  const $ = (sel) => root.querySelector(sel);
  const input = $('input');
  const output = $('output');
  const svg = $('svg');
  const plot = $('.w-plot');
  const out = (name) => $(`[data-out="${name}"]`);

  let view = null; // khung toạ độ của lần vẽ gần nhất
  const content = svgEl(svg, 'g');
  const hit = svgEl(svg, 'circle', { r: 18, tabindex: 0, 'aria-label': L.handle }, 'fill: transparent; cursor: grab; touch-action: none; outline: none');
  const dot = svgEl(svg, 'circle', { r: 7 }, 'fill: var(--w-series-1); stroke: var(--surface); stroke-width: 2; pointer-events: none');
  hit.addEventListener('focus', () => {
    dot.setAttribute('r', '9');
    dot.style.stroke = 'var(--text)';
  });
  hit.addEventListener('blur', () => {
    dot.setAttribute('r', '7');
    dot.style.stroke = 'var(--surface)';
  });
  hit.addEventListener('keydown', (e) => onKey(e));

  function compute() {
    const rho = z * R.x;
    const S = Math.sign(rho) * Math.max(Math.abs(rho) - lambda, 0);
    const beta = S / z;
    return { rho, ols: R.x, beta, inner: rho - z * beta };
  }

  function update() {
    const c = compute();
    output.textContent = fmt(lambda);
    out('rho').textContent = fmt(c.rho);
    out('ols').textContent = fmt(c.ols);
    out('beta').textContent = fmt(c.beta);
    out('inner').textContent = fmt(c.inner);
    out('status').innerHTML =
      lambda === 0
        ? L.ols0(fmt(c.inner))
        : c.beta === 0
          ? L.dead(fmt(Math.abs(c.rho)), fmt(lambda))
          : L.active(fmt(Math.abs(c.rho)), fmt(lambda), fmt(lambda / z), fmt(c.inner));
    draw();
  }

  function draw() {
    const W = Math.max(280, Math.round(plot.clientWidth || 600));
    const narrow = W < 480;
    const [x0, x1] = narrow ? [-3, 3] : [-4, 4];
    const [y0, y1] = narrow ? [-1.2, 2.8] : [-1.5, 3];
    const pad = { l: 6, r: 6, t: 6, b: 6 };
    const s = (W - pad.l - pad.r) / (x1 - x0); // cùng tỉ lệ hai trục để góc vuông trông đúng là vuông
    const H = Math.round(s * (y1 - y0) + pad.t + pad.b);
    const X = (u) => pad.l + (u - x0) * s;
    const Y = (v) => pad.t + (y1 - v) * s;
    view = { W, H, x0, x1, y0, y1, pad, s };

    content.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', String(W));
    svg.setAttribute('height', String(H));

    const c = compute();
    const muted = 'var(--text-muted)';
    const ax = Y(0);

    // Vùng βⱼ = 0: hoành độ (= βⱼ^OLS) nằm trong [−λ/zⱼ, λ/zⱼ]
    const half = lambda / z;
    if (half > 0) {
      svgEl(content, 'rect', { x: X(-half), y: pad.t, width: X(half) - X(-half), height: H - pad.t - pad.b }, 'fill: var(--accent-soft)');
      for (const e of [-half, half]) {
        svgEl(content, 'line', { x1: X(e), y1: pad.t, x2: X(e), y2: H - pad.b }, 'stroke: var(--border-strong); stroke-width: 1; stroke-dasharray: 4 4');
      }
      const top = pad.t + 16;
      const lab = (sign) => [[sign, ''], ['λ', 'i'], ['/', ''], ['z', 'i'], ['j', 'sub']];
      if (X(half) - X(-half) >= 96) {
        mathText(content, X(-half), top, lab('−'), 'middle', `; fill: ${muted}`);
        mathText(content, X(half), top, lab(''), 'middle', `; fill: ${muted}`);
      } else {
        mathText(content, X(0), top, lab('±'), 'middle', `; fill: ${muted}`);
      }
    }

    // Trục: đường thẳng qua xⱼ (ngang) và phương vuông góc (dọc, mờ)
    svgEl(content, 'line', { x1: X(0), y1: pad.t, x2: X(0), y2: H - pad.b }, 'stroke: var(--border); stroke-width: 1');
    arrow(content, X(x0), ax, X(x1) - 2, ax, 'var(--text)', 1.25);
    for (let k = Math.ceil(x0); k <= Math.floor(x1) - 1; k++) {
      if (k === 0) continue;
      svgEl(content, 'line', { x1: X(k), y1: ax - 3, x2: X(k), y2: ax + 3 }, 'stroke: var(--text-muted); stroke-width: 1');
    }
    mathText(content, X(x1) - 4, ax - 10, [['x', 'b'], ['j', 'sub']], 'end');

    const P = { x: X(c.ols), y: ax }; // chân đường vuông góc (OLS)
    const B = { x: X(c.beta), y: ax }; // hình chiếu sau khi kéo lùi
    const T = { x: X(R.x), y: Y(R.y) }; // đầu mút r⁽ʲ⁾
    const up = R.y >= 0 ? -1 : 1; // phía có r⁽ʲ⁾ (trên hay dưới trục, theo màn hình)

    // OLS: đường vuông góc + ký hiệu góc vuông
    svgEl(content, 'line', { x1: P.x, y1: P.y, x2: T.x, y2: T.y }, `stroke: ${muted}; stroke-width: 1.5; stroke-dasharray: 5 5`);
    if (Math.abs(T.y - P.y) > 14) {
      const side = -Math.sign(c.ols || 1);
      const q = 8;
      svgEl(content, 'polyline', {
        points: `${P.x + side * q},${P.y} ${P.x + side * q},${P.y + up * q} ${P.x},${P.y + up * q}`,
        fill: 'none',
      }, `stroke: ${muted}; stroke-width: 1`);
    }

    // Đoạn bị kéo lùi (chính là hình chiếu của r^mới lên xⱼ)
    if (lambda > 0 && c.beta !== 0) {
      const off = -up * 14;
      const yy = ax + off;
      svgEl(content, 'line', { x1: B.x, y1: yy, x2: P.x, y2: yy }, 'stroke: var(--w-series-2); stroke-width: 1.5');
      for (const xx of [B.x, P.x]) svgEl(content, 'line', { x1: xx, y1: yy - 4, x2: xx, y2: yy + 4 }, 'stroke: var(--w-series-2); stroke-width: 1.5');
      mathText(content, (B.x + P.x) / 2, yy + (off > 0 ? 16 : -7), [['λ', 'i'], ['/', ''], ['z', 'i'], ['j', 'sub']], 'middle');
    }

    // Các vector
    if (c.beta === 0) {
      // r^mới = r⁽ʲ⁾: vẽ r⁽ʲ⁾ dày phía dưới, r^mới mảnh phía trên
      arrow(content, X(0), ax, T.x, T.y, 'var(--w-series-1)', 7);
      arrow(content, X(0), ax, T.x, T.y, 'var(--w-series-3)', 2.5);
      svgEl(content, 'circle', { cx: X(0), cy: ax, r: 5 }, 'fill: var(--w-series-2); stroke: var(--surface); stroke-width: 2');
      mathText(content, X(0) - 8, ax - up * 20, [['β', 'i'], ['j', 'sub'], [' = 0', '']], 'end');
    } else {
      arrow(content, X(0), ax, B.x, B.y, 'var(--w-series-2)', 4);
      arrow(content, B.x, B.y, T.x, T.y, 'var(--w-series-3)', 2.5);
      arrow(content, X(0), ax, T.x, T.y, 'var(--w-series-1)', 2.5);
      mathText(content, (X(0) + B.x) / 2, ax + (up < 0 ? 20 : -10), [['β', 'i'], ['j', 'sub'], ['x', 'b'], ['j', 'sub']], 'middle');
    }

    // Điểm OLS (rỗng)
    svgEl(content, 'circle', { cx: P.x, cy: P.y, r: 4.5 }, `fill: var(--surface); stroke: ${muted}; stroke-width: 1.5`);

    // Nhãn r⁽ʲ⁾ và r^mới: đặt ra phía ngoài tam giác O–βⱼxⱼ–r⁽ʲ⁾ để không chồng lên nhau
    const labelAlong = (ax1, ay1, bx1, by1, t, away, parts) => {
      const mx = ax1 + (bx1 - ax1) * t;
      const my = ay1 + (by1 - ay1) * t;
      const len = Math.hypot(bx1 - ax1, by1 - ay1) || 1;
      let nx = -(by1 - ay1) / len;
      let ny = (bx1 - ax1) / len;
      const side = (mx - away.x) * nx + (my - away.y) * ny;
      if (side < -1e-6 || (Math.abs(side) <= 1e-6 && nx > 0)) {
        nx = -nx;
        ny = -ny;
      }
      mathText(content, mx + nx * 16, my + ny * 16 + 4, parts, nx > 0.3 ? 'start' : nx < -0.3 ? 'end' : 'middle');
    };
    const O = { x: X(0), y: ax };
    if (c.beta === 0) {
      labelAlong(O.x, O.y, T.x, T.y, 0.55, { x: O.x + 1, y: O.y }, [['r', 'b'], [L.newSup, 'sup'], [' = ', ''], ['r', 'b'], ['(j)', 'sup']]);
    } else {
      labelAlong(O.x, O.y, T.x, T.y, 0.55, B, [['r', 'b'], ['(j)', 'sup']]);
      labelAlong(B.x, B.y, T.x, T.y, 0.5, O, [['r', 'b'], [L.newSup, 'sup']]);
    }

    // Điểm kéo được (phần tử cố định, chỉ cập nhật vị trí để không mất focus bàn phím)
    for (const el of [hit, dot]) {
      el.setAttribute('cx', String(T.x));
      el.setAttribute('cy', String(T.y));
    }
    hit.setAttribute('aria-valuetext', `(${fmt(R.x)}, ${fmt(R.y)})`);
  }

  function setR(x, y) {
    if (!view) return;
    R.x = Math.round(Math.min(view.x1 - 0.2, Math.max(view.x0 + 0.2, x)) * 100) / 100;
    R.y = Math.round(Math.min(view.y1 - 0.2, Math.max(view.y0 + 0.2, y)) * 100) / 100;
    update();
  }

  function fromPointer(e) {
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * view.W;
    const py = ((e.clientY - rect.top) / rect.height) * view.H;
    return { x: view.x0 + (px - view.pad.l) / view.s, y: view.y1 - (py - view.pad.t) / view.s };
  }

  function onKey(e) {
    const step = e.shiftKey ? 0.5 : 0.1;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    setR(R.x + m[0], R.y + m[1]);
  }

  let dragging = false;
  svg.addEventListener('pointerdown', (e) => {
    dragging = true;
    svg.setPointerCapture(e.pointerId);
    const p = fromPointer(e);
    setR(p.x, p.y);
  });
  svg.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const p = fromPointer(e);
    setR(p.x, p.y);
  });
  const stop = () => {
    dragging = false;
  };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);

  input.addEventListener('input', () => {
    lambda = Math.round(Number(input.value) * 100) / 100;
    update();
  });

  let lastWidth = 0;
  new ResizeObserver(() => {
    const w = Math.round(plot.clientWidth);
    if (w !== lastWidth) {
      lastWidth = w;
      draw();
    }
  }).observe(plot);

  update();
}
