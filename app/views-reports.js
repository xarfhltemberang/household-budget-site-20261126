// Halaman Laporan dan Data Acuan.
import { BENCHMARKS, CATEGORIES, MONTHLY_TREND } from './data.js';
import { rupiah, pct } from './format.js';
import { barChart, lineChart } from './charts.js';
import { spendingByCategory, totalSpending, totalIncome, monthlyTrend } from './store.js';
import { layout } from './views.js';

export function viewLaporan(state) {
  const trend = monthlyTrend(state);
  const income = totalIncome(state);
  const spending = totalSpending(state);
  const byCat = spendingByCategory(state);
  const bars = CATEGORIES.map((c) => ({
    label: c.label.replace(' & ', ' & '),
    value: byCat[c.id],
    color: c.color,
  }));
  const budgetBars = CATEGORIES.map((c) => ({
    label: c.label, value: state.budgets[c.id] || 0, color: '#9db8a6',
  }));

  const biggest = CATEGORIES.reduce((a, b) => (byCat[b.id] > byCat[a.id] ? b : a));
  const over = CATEGORIES.filter((c) => byCat[c.id] > (state.budgets[c.id] || 0));
  const prev = MONTHLY_TREND[MONTHLY_TREND.length - 2];
  const change = prev.spending > 0 ? ((spending - prev.spending) / prev.spending) * 100 : 0;
  const rate = income > 0 ? ((income - spending) / income) * 100 : 0;

  const insights = [
    `Kategori terbesar bulan ini adalah ${biggest.label} sebesar ${rupiah(byCat[biggest.id])} (${pct((byCat[biggest.id] / spending) * 100)} dari total belanja).`,
    change >= 0
      ? `Belanja naik ${pct(Math.abs(change))} dibanding Oktober 2026 (${rupiah(prev.spending)}).`
      : `Belanja turun ${pct(Math.abs(change))} dibanding Oktober 2026 (${rupiah(prev.spending)}).`,
    over.length
      ? `Kategori yang melewati anggaran: ${over.map((c) => `${c.label} (lewat ${rupiah(byCat[c.id] - (state.budgets[c.id] || 0))})`).join(', ')}.`
      : 'Semua kategori masih dalam anggaran bulan ini.',
    rate >= 20
      ? `Tingkat tabungan ${pct(rate)} — sudah mencapai target sehat 20%.`
      : `Tingkat tabungan ${pct(rate)} — masih di bawah target sehat 20%. Menekan ${biggest.label} sebesar ${rupiah(Math.round((income * 0.2 - (income - spending))))} akan mencapai target.`,
  ];

  const body = `
  <p class="lede">Tren enam bulan terakhir keluarga contoh (Juni–November 2026). Bulan-bulan Juni–Oktober adalah data contoh yang tetap, November dihitung langsung dari transaksi yang Anda catat.</p>
  <section class="card" aria-labelledby="h-trend">
    <h2 id="h-trend">Pemasukan vs belanja, Juni–November 2026</h2>
    ${lineChart(trend.rows, 'Grafik garis pemasukan dan belanja Juni sampai November 2026')}
    <p class="muted">Pemasukan contoh tetap Rp9.800.000/bulan. Belanja tertinggi pada September 2026 (${rupiah(8600000)}).</p>
  </section>
  <section class="card" aria-labelledby="h-cat">
    <h2 id="h-cat">Belanja per kategori vs anggaran</h2>
    ${barChart(bars, 'Grafik batang belanja per kategori bulan November 2026')}
    <p class="muted">Batang di bawah memakai anggaran tiap kategori sebagai pembanding: anggaran total ${rupiah(CATEGORIES.reduce((s, c) => s + (state.budgets[c.id] || 0), 0))}.</p>
    ${barChart(budgetBars, 'Grafik batang anggaran per kategori bulan November 2026')}
  </section>
  <section class="card" aria-labelledby="h-insight">
    <h2 id="h-insight">Yang bisa dibaca dari angka ini</h2>
    <ul class="insights">${insights.map((i) => `<li>${i}</li>`).join('')}</ul>
  </section>`;
  return layout(state, '#/laporan', 'Laporan', body);
}

function benchmarkTable(b) {
  const rows = b.rows.map((r) => `<tr><th scope="row">${r.label}${r.note ? `<br><span class="muted">${r.note}</span>` : ''}</th><td class="num">${typeof r.value === 'number' && r.value < 100 ? r.value.toLocaleString('id-ID') + ' ' + (r.unit || '') : rupiah(r.value)}</td></tr>`).join('');
  return `<section class="card" aria-labelledby="h-${b.title.slice(0, 8)}">
    <h2>${b.title}</h2>
    <table class="bench-table"><tbody>${rows}</tbody></table>
    <p class="source">Sumber: ${b.source}</p>
  </section>`;
}

export function viewPatokan(state) {
  const body = `
  <p class="lede">Semua angka di halaman ini adalah angka resmi yang diterbitkan — bukan karangan. Angka-angka inilah yang dipakai sebagai patokan di seluruh situs ini, dan keluarga contoh (Keluarga Sari) disusun agar konsisten dengannya.</p>
  ${benchmarkTable(BENCHMARKS.susenas)}
  <p>Untuk rumah tangga 4 orang seperti keluarga contoh, patokan pengeluaran dari Susenas 2024 adalah 4 × Rp1.500.556 = <strong>Rp6.002.224/bulan</strong>, dengan makanan sekitar Rp3.007.156. Keluarga contoh membelanjakan ${rupiah(totalSpending(state))} pada November 2026 — di atas patokan nasional, wajar untuk rumah tangga di Jakarta dengan pemasukan Rp9.800.000.</p>
  ${benchmarkTable(BENCHMARKS.ump)}
  ${benchmarkTable(BENCHMARKS.poverty)}
  ${benchmarkTable(BENCHMARKS.householdSize)}
  <section class="card" aria-labelledby="h-note">
    <h2 id="h-note">Cara memakai angka ini</h2>
    <ul class="insights">
      <li>Bandingkan belanja makanan keluarga Anda dengan porsi 50,10% dari Susenas — kalau jauh di atas itu, mungkin ada yang bisa dihemat dari belanja harian.</li>
      <li>UMP adalah lantai upah, bukan patokan gaya hidup: anggaran yang sehat dihitung dari pemasukan nyata Anda, bukan dari UMP.</li>
      <li>Garis kemiskinan BPS (Rp595.242 per kapita, September 2024) adalah batas kebutuhan dasar, bukan target anggaran.</li>
    </ul>
  </section>`;
  return layout(state, '#/patokan', 'Data Acuan', body);
}
