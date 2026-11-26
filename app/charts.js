// Grafik SVG yang digambar tangan — tanpa pustaka grafik eksternal.
// Setiap grafik memakai role="img" dan aria-label agar terbaca pembaca layar.
import { rupiahShort } from './format.js';

function svgOpen(w, h, label) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">`;
}

// Donat: [{label, value, color}]
export function donutChart(parts, label) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const cx = 110;
  const cy = 110;
  const r = 82;
  const inner = 54;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    const frac = p.value / total;
    const a0 = offset * Math.PI * 2 - Math.PI / 2;
    const a1 = (offset + frac) * Math.PI * 2 - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const ix0 = cx + inner * Math.cos(a0);
    const iy0 = cy + inner * Math.sin(a0);
    const ix1 = cx + inner * Math.cos(a1);
    const iy1 = cy + inner * Math.sin(a1);
    if (frac > 0) {
      arcs += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z" fill="${p.color}"><title>${p.label}: ${rupiahShort(p.value)}</title></path>`;
    }
    offset += frac;
  }
  const legend = parts
    .map((p) => {
      const pct = Math.round((p.value / total) * 100);
      return `<li><span class="swatch" style="background:${p.color}"></span>${p.label} <strong>${pct}%</strong> · ${rupiahShort(p.value)}</li>`;
    })
    .join('');
  return `<div class="chart-wrap chart-donut">${svgOpen(220, 220, label)}${arcs}<text x="110" y="104" text-anchor="middle" class="donut-total">${rupiahShort(total)}</text><text x="110" y="126" text-anchor="middle" class="donut-caption">total belanja</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Batang vertikal: [{label, value, color?}]
export function barChart(bars, label, maxValue) {
  const max = maxValue || Math.max(...bars.map((b) => b.value), 1);
  const w = 560;
  const h = 240;
  const base = 200;
  const gap = 12;
  const bw = (w - gap * (bars.length + 1)) / bars.length;
  let rects = '';
  let labels = '';
  bars.forEach((b, i) => {
    const bh = Math.max(2, (b.value / max) * 160);
    const x = gap + i * (bw + gap);
    const y = base - bh;
    rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="4" fill="${b.color || '#2e7d5b'}"><title>${b.label}: ${rupiahShort(b.value)}</title></rect>`;
    labels += `<text x="${(x + bw / 2).toFixed(1)}" y="${base + 18}" text-anchor="middle" class="chart-label">${b.label}</text>`;
    labels += `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" class="chart-value">${rupiahShort(b.value)}</text>`;
  });
  return `<div class="chart-wrap">${svgOpen(w, h, label)}<line x1="0" y1="${base}" x2="${w}" y2="${base}" class="axis"/>${rects}${labels}</svg></div>`;
}

// Garis tren: [{label, income, spending}]
export function lineChart(rows, label) {
  const w = 560;
  const h = 260;
  const padL = 8;
  const padR = 8;
  const top = 24;
  const bottom = 224;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spending)), 1) * 1.05;
  const x = (i) => padL + (i * (w - padL - padR)) / (rows.length - 1);
  const y = (v) => bottom - ((v / max) * (bottom - top));
  const points = (key) => rows.map((r, i) => `${x(i).toFixed(1)},${y(r[key]).toFixed(1)}`).join(' ');
  const dots = rows
    .map((r, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(r.spending).toFixed(1)}" r="4.5" fill="#b4455a"><title>${r.month}: belanja ${rupiahShort(r.spending)}</title></circle>`)
    .join('');
  const labels = rows
    .map((r, i) => {
      const anchor = i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle';
      return `<text x="${x(i).toFixed(1)}" y="${bottom + 20}" text-anchor="${anchor}" class="chart-label">${r.month}</text>`;
    })
    .join('');
  return `<div class="chart-wrap">${svgOpen(w, h, label)}
    <line x1="0" y1="${bottom}" x2="${w}" y2="${bottom}" class="axis"/>
    <polyline points="${points('income')}" fill="none" stroke="#2e7d5b" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${points('spending')}" fill="none" stroke="#b4455a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${labels}
    <g class="chart-legend-inline"><circle cx="14" cy="12" r="5" fill="#2e7d5b"/><text x="24" y="16" class="chart-label">Pemasukan</text><circle cx="130" cy="12" r="5" fill="#b4455a"/><text x="140" y="16" class="chart-label">Belanja</text></g>
  </svg></div>`;
}
