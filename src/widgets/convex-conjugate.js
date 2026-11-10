/**
 * Widget: hàm liên hợp lồi t*(y) = sup_z ( z·y − t(z) ) của một hàm một biến.
 *
 * Dùng trong bài viết (.md), đặt trên một dòng riêng, có dòng trống trước và sau:
 *   <div data-widget="convex-conjugate"></div>
 *
 * Tuỳ chọn (thêm vào thẻ div):
 *   data-fn="half-square"        hàm hiện đầu tiên: half-square | abs | exp
 *   data-fns="half-square,abs"   chỉ cho chọn các hàm này (chỉ một hàm thì ẩn nút chọn)
 *   data-y="1.5"                 độ dốc y ban đầu
 *   data-lang="vi"               ép ngôn ngữ (mặc định theo trang)
 *
 * Màu các đường lấy từ biến CSS --w-series-1..3 (src/styles/global.css, mục "Widget").
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const I18N = {
  en: {
    fn: 'Function',
    slope: 'Slope y',
    zstar: 'Maximizer z*',
    notAttained: 'not attained',
    line: 'line z·y',
    gapMax: 'largest gap = t*(y)',
    tangent: 'tangent line, meets the vertical axis at −t*(y)',
    gap: 'gap z·y − t(z)',
    unbounded: 'gap grows without bound',
    aria: 'Interactive plot: a convex function t(z), the line z·y and the conjugate t*(y).',
  },
  vi: {
    fn: 'Hàm',
    slope: 'Độ dốc y',
    zstar: 'Điểm đạt max z*',
    notAttained: 'không đạt được',
    line: 'đường z·y',
    gapMax: 'khoảng hở lớn nhất = t*(y)',
    tangent: 'tiếp tuyến, cắt trục tung tại −t*(y)',
    gap: 'khoảng hở z·y − t(z)',
    unbounded: 'khoảng hở tăng vô hạn',
    aria: 'Đồ thị tương tác: hàm lồi t(z), đường z·y và hàm liên hợp t*(y).',
  },
};

/**
 * Mỗi hàm: t(z), nghiệm của sup (conj), công thức hiển thị, khung vẽ.
 * conj(y) trả về { zstar, value, dir }: zstar = null nếu sup không đạt được,
 * value = Infinity nếu sup vô hạn, dir = phía z chạy ra vô cùng (+1 hoặc −1).
 * z: [min, max] trục hoành; v: [min, max] trục tung; y: [min, max, bước, mặc định].
 */
const FUNCTIONS = {
  'half-square': {
    label: '½z²',
    t: (z) => (z * z) / 2,
    conj: (y) => ({ zstar: y, value: (y * y) / 2 }),
    formula: { en: 't*(y) = y²/2', vi: 't*(y) = y²/2' },
    z: [-3, 3],
    v: [-3.5, 4.5],
    y: [-2.5, 2.5, 0.1, 1.5],
  },
  abs: {
    label: '|z|',
    t: Math.abs,
    conj: (y) =>
      Math.abs(y) <= 1 ? { zstar: 0, value: 0 } : { zstar: null, value: Infinity, dir: Math.sign(y) },
    formula: {
      en: 't*(y) = 0 if |y| ≤ 1, +∞ otherwise',
      vi: 't*(y) = 0 nếu |y| ≤ 1, +∞ nếu ngược lại',
    },
    z: [-3, 3],
    v: [-2.5, 3.5],
    y: [-2, 2, 0.1, 0.6],
  },
  exp: {
    label: 'eᶻ',
    t: Math.exp,
    conj: (y) => {
      if (y > 0) return { zstar: Math.log(y), value: y * Math.log(y) - y };
      if (y === 0) return { zstar: null, value: 0, dir: -1 };
      return { zstar: null, value: Infinity, dir: -1 };
    },
    formula: {
      en: 't*(y) = y ln y − y for y > 0, +∞ for y < 0',
      vi: 't*(y) = y ln y − y khi y > 0, +∞ khi y < 0',
    },
    z: [-4, 2.2],
    v: [-3, 6],
    y: [-1, 4, 0.1, 2],
  },
};

const fmt = (x, digits = 2) => {
  if (x === Infinity) return '+∞';
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

let uid = 0;

export default function mount(root) {
  const ds = root.dataset;
  const lang = (ds.lang || document.documentElement.lang || 'en').toLowerCase().startsWith('vi') ? 'vi' : 'en';
  const L = I18N[lang];
  const requested = (ds.fns || '').split(',').map((s) => s.trim()).filter((k) => k in FUNCTIONS);
  const list = requested.length ? requested : Object.keys(FUNCTIONS);
  const id = `w-cc-${++uid}`;

  let fnId = ds.fn && list.includes(ds.fn) ? ds.fn : list[0];
  let y = 0;
  let hoverZ = null;
  let firstSetup = true;

  root.innerHTML = `
    <div class="w-controls">
      <div class="w-seg" role="group" aria-label="${L.fn}"${list.length < 2 ? ' hidden' : ''}>
        ${list.map((k) => `<button type="button" data-fn="${k}">t(z) = ${FUNCTIONS[k].label}</button>`).join('')}
      </div>
      <div class="w-slider">
        <label for="${id}-y">${L.slope}</label>
        <input id="${id}-y" type="range" />
        <output class="w-num" for="${id}-y"></output>
      </div>
    </div>
    <div class="w-stats" aria-live="polite">
      <div class="w-stat">
        <span class="w-stat-label">${L.zstar}</span>
        <span class="w-stat-value" data-out="zstar"></span>
      </div>
      <div class="w-stat">
        <span class="w-stat-label" data-out="formula"></span>
        <span class="w-stat-value" data-out="tstar"></span>
      </div>
    </div>
    <div class="w-plot">
      <svg role="img" aria-label="${L.aria}"></svg>
      <div class="w-tip" hidden></div>
    </div>
    <div class="w-legend">
      <span><i class="w-sw" style="background: var(--w-series-1)"></i><span data-out="legend-t"></span></span>
      <span><i class="w-sw w-sw-dash"></i>${L.line}</span>
      <span><i class="w-sw w-sw-bar" style="background: var(--w-series-3)"></i>${L.gapMax}</span>
      <span data-out="legend-tan"><i class="w-sw" style="background: var(--w-series-2)"></i>${L.tangent}</span>
    </div>`;

  const $ = (sel) => root.querySelector(sel);
  const input = $('input');
  const output = $('output');
  const svg = $('svg');
  const plot = $('.w-plot');
  const tip = $('.w-tip');
  const out = (name) => $(`[data-out="${name}"]`);

  // Kích thước và hàm đổi toạ độ của lần vẽ gần nhất (dùng cho rê chuột)
  let frame = null;

  function setFn(k) {
    fnId = k;
    const f = FUNCTIONS[k];
    const [lo, hi, step, def] = f.y;
    input.min = String(lo);
    input.max = String(hi);
    input.step = String(step);
    const start = firstSetup && ds.y !== undefined && !Number.isNaN(Number(ds.y)) ? Number(ds.y) : def;
    input.value = String(Math.min(hi, Math.max(lo, start)));
    firstSetup = false;
    root.querySelectorAll('.w-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fn === k)));
    out('legend-t').textContent = `t(z) = ${f.label}`;
    out('formula').textContent = f.formula[lang];
    hoverZ = null;
    update();
  }

  function update() {
    y = Math.round(Number(input.value) * 100) / 100;
    output.textContent = fmt(y, 1);
    const c = FUNCTIONS[fnId].conj(y);
    out('zstar').textContent =
      c.zstar !== null ? fmt(c.zstar) : `${L.notAttained} (z → ${c.dir > 0 ? '+' : '−'}∞)`;
    out('tstar').textContent = fmt(c.value);
    out('zstar').classList.toggle('is-text', c.zstar === null);
    out('legend-tan').hidden = !Number.isFinite(c.value);
    draw();
  }

  function draw() {
    const f = FUNCTIONS[fnId];
    const W = Math.max(280, Math.round(plot.clientWidth || 600));
    const H = Math.round(Math.min(400, Math.max(250, W * 0.56)));
    const pad = { l: 4, r: 4, t: 8, b: 24 };
    const [z0, z1] = f.z;
    const [v0, v1] = f.v;
    const X = (z) => pad.l + ((z - z0) / (z1 - z0)) * (W - pad.l - pad.r);
    const V = (v) => pad.t + ((v1 - v) / (v1 - v0)) * (H - pad.t - pad.b);
    frame = { W, pad, z0, z1 };

    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', String(W));
    svg.setAttribute('height', String(H));

    const clipId = `${id}-clip`;
    const defs = svgEl(svg, 'defs');
    const clip = svgEl(defs, 'clipPath', { id: clipId });
    svgEl(clip, 'rect', { x: pad.l, y: pad.t, width: W - pad.l - pad.r, height: H - pad.t - pad.b });

    // Trục toạ độ và vạch chia
    const axis = 'stroke: var(--border-strong); stroke-width: 1';
    const muted = 'fill: var(--text-muted); font-size: 11px; font-family: var(--font-sans)';
    svgEl(svg, 'line', { x1: X(z0), y1: V(0), x2: X(z1), y2: V(0) }, axis);
    svgEl(svg, 'line', { x1: X(0), y1: pad.t, x2: X(0), y2: H - pad.b }, axis);
    for (let k = Math.ceil(z0); k <= Math.floor(z1); k++) {
      if (k === 0) continue;
      svgEl(svg, 'line', { x1: X(k), y1: V(0) - 3, x2: X(k), y2: V(0) + 3 }, axis);
      const tick = svgEl(svg, 'text', { x: X(k), y: V(0) + 16, 'text-anchor': 'middle' }, muted);
      tick.textContent = fmt(k, 0);
    }
    const zLabel = svgEl(svg, 'text', { x: W - pad.r - 2, y: V(0) - 8, 'text-anchor': 'end' }, `${muted}; font-size: 13px`);
    zLabel.textContent = 'z';

    const g = svgEl(svg, 'g', { 'clip-path': `url(#${clipId})` });
    const line = (zA, vA, zB, vB, style) => svgEl(g, 'line', { x1: X(zA), y1: V(vA), x2: X(zB), y2: V(vB) }, style);
    const dot = (z, v, color) =>
      svgEl(svg, 'circle', { cx: X(z), cy: V(v), r: 5 }, `fill: ${color}; stroke: var(--surface); stroke-width: 2`);

    // Đường z·y (nét đứt)
    line(z0, z0 * y, z1, z1 * y, 'stroke: var(--text-muted); stroke-width: 1.5; stroke-dasharray: 5 5');

    // Đồ thị t(z)
    const N = 240;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const z = z0 + ((z1 - z0) * i) / N;
      const v = Math.min(f.t(z), v1 + (v1 - v0)); // chặn giá trị quá lớn, phần thừa bị cắt bởi clip
      d += `${i ? 'L' : 'M'}${X(z).toFixed(2)},${V(v).toFixed(2)}`;
    }
    svgEl(g, 'path', { d, fill: 'none' }, 'stroke: var(--w-series-1); stroke-width: 2.5; stroke-linejoin: round');

    const c = f.conj(y);
    const labels = [];

    if (Number.isFinite(c.value)) {
      // Tiếp tuyến song song với z·y, cắt trục tung tại −t*(y)
      line(z0, z0 * y - c.value, z1, z1 * y - c.value, 'stroke: var(--w-series-2); stroke-width: 2');
      if (c.zstar !== null) {
        const zs = c.zstar;
        line(zs, f.t(zs), zs, zs * y, 'stroke: var(--w-series-3); stroke-width: 3.5; stroke-linecap: round');
        if (f.t(zs) >= v0 && f.t(zs) <= v1) dot(zs, f.t(zs), 'var(--w-series-3)');
      }
      if (-c.value >= v0 && -c.value <= v1) {
        dot(0, -c.value, 'var(--w-series-2)');
        labels.push({ x: X(0) + 10, y: V(-c.value) + 4, anchor: 'start', text: '−t*(y)' });
      }
    } else {
      // sup = +∞: vẽ khoảng hở ở mép khung, phía z chạy ra vô cùng
      const zE = c.dir > 0 ? z1 - 0.06 * (z1 - z0) : z0 + 0.06 * (z1 - z0);
      const lo = Math.max(v0, f.t(zE));
      const hi = Math.min(v1, zE * y);
      line(zE, lo, zE, hi, 'stroke: var(--w-series-3); stroke-width: 3.5; stroke-linecap: round');
      // Nhãn đặt trên đầu đoạn thẳng nếu còn chỗ, nếu không thì đặt ở giữa
      const roomAbove = V(hi) - pad.t > 28;
      labels.push({
        x: X(zE) + (roomAbove ? 0 : c.dir > 0 ? -10 : 10),
        y: roomAbove ? V(hi) - 12 : V((lo + hi) / 2) + 4,
        anchor: c.dir > 0 ? 'end' : 'start',
        text: `${L.unbounded} (z → ${c.dir > 0 ? '+' : '−'}∞)`,
      });
    }

    // Rê chuột: khoảng hở tại một z bất kỳ
    if (hoverZ !== null) {
      const hz = hoverZ;
      svgEl(svg, 'line', { x1: X(hz), y1: pad.t, x2: X(hz), y2: H - pad.b }, 'stroke: var(--border-strong); stroke-width: 1; stroke-dasharray: 2 3');
      line(hz, f.t(hz), hz, hz * y, 'stroke: var(--w-series-3); stroke-width: 2; stroke-dasharray: 4 3; opacity: 0.8');
      const gap = hz * y - f.t(hz);
      tip.innerHTML = `z = ${fmt(hz)}<br />${L.gap} = ${fmt(gap)}`;
      tip.hidden = false;
      const scale = plot.clientWidth / W;
      const left = X(hz) * scale;
      const flip = left > plot.clientWidth * 0.6;
      tip.style.left = flip ? '' : `${left + 12}px`;
      tip.style.right = flip ? `${plot.clientWidth - left + 12}px` : '';
    } else {
      tip.hidden = true;
    }

    for (const lb of labels) {
      const t = svgEl(svg, 'text', { x: lb.x, y: lb.y, 'text-anchor': lb.anchor }, 'fill: var(--text); font-size: 13px; font-family: var(--font-sans); paint-order: stroke; stroke: var(--surface); stroke-width: 4px; stroke-linejoin: round');
      t.textContent = lb.text;
    }
  }

  function zFromPointer(e) {
    if (!frame) return null;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * frame.W;
    const z = frame.z0 + ((px - frame.pad.l) / (frame.W - frame.pad.l - frame.pad.r)) * (frame.z1 - frame.z0);
    return Math.min(frame.z1, Math.max(frame.z0, z));
  }

  svg.addEventListener('pointermove', (e) => {
    hoverZ = zFromPointer(e);
    draw();
  });
  svg.addEventListener('pointerdown', (e) => {
    hoverZ = zFromPointer(e);
    draw();
  });
  svg.addEventListener('pointerleave', () => {
    hoverZ = null;
    draw();
  });

  input.addEventListener('input', update);
  root.querySelectorAll('.w-seg button').forEach((b) => b.addEventListener('click', () => setFn(b.dataset.fn)));

  let lastWidth = 0;
  new ResizeObserver(() => {
    const w = Math.round(plot.clientWidth);
    if (w !== lastWidth) {
      lastWidth = w;
      draw();
    }
  }).observe(plot);

  setFn(fnId);
}
