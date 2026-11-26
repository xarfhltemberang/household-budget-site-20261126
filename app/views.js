// Halaman Ringkasan (dasbor) dan Anggaran, plus kerangka bersama situs.
import { CATEGORIES, MONTH } from './data.js';
import { rupiah, rupiahShort, pct, escapeHtml } from './format.js';
import { donutChart } from './charts.js';
import {
  spendingByCategory, totalSpending, totalIncome, fiftyThirtyTwenty,
  nextBill, unpaidBills,
} from './store.js';

export const NAV = [
  { hash: '#/', label: 'Ringkasan' },
  { hash: '#/anggaran', label: 'Anggaran' },
  { hash: '#/transaksi', label: 'Transaksi' },
  { hash: '#/tagihan', label: 'Tagihan' },
  { hash: '#/tabungan', label: 'Tabungan' },
  { hash: '#/laporan', label: 'Laporan' },
  { hash: '#/patokan', label: 'Data Acuan' },
];

export function layout(state, activeHash, title, bodyHtml) {
  const nav = NAV.map((n) => {
    const active = n.hash === activeHash ? ' aria-current="page"' : '';
    return `<li><a href="${n.hash}"${active}>${n.label}</a></li>`;
  }).join('');
  return `
  <a class="skip-link" href="#konten">Lewati ke konten utama</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#/" translate="no">KantongKeluarga</a>
      <p class="tagline">Anggaran rumah tangga, rapi dan jujur.</p>
      <nav aria-label="Navigasi utama"><ul class="nav">${nav}</ul></nav>
    </div>
  </header>
  <main id="konten" class="wrap" tabindex="-1">
    <h1>${title}</h1>
    ${bodyHtml}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <p>Data contoh: Keluarga Sari, 4 anggota, Jakarta — diberi label contoh di setiap halaman.
      Angka acuan berasal dari BPS, Kemnaker, dan Sekretariat ASEAN; sumber dan tahun tercantum di
      <a href="#/patokan">Data Acuan</a>. Semua data yang Anda ubah tersimpan di peramban Anda sendiri (localStorage) dan tidak dikirim ke mana pun.</p>
      <p>KantongKeluarga — situs anggaran rumah tangga statis, bekerja luring tanpa jaringan. <button type="button" class="btn-small ghost" id="reset-data">Kembalikan data contoh</button></p>
    </div>
  </footer>`;
}

function statCard(label, value, note) {
  return `<article class="stat"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-note">${note}</p></article>`;
}

export function viewDashboard(state) {
  const income = totalIncome(state);
  const spending = totalSpending(state);
  const balance = income - spending;
  const rate = income > 0 ? (balance / income) * 100 : 0;
  const byCat = spendingByCategory(state);
  const parts = CATEGORIES.filter((c) => byCat[c.id] > 0).map((c) => ({
    label: c.label, value: byCat[c.id], color: c.color,
  }));
  const rule = fiftyThirtyTwenty(state);
  const nb = nextBill(state);
  const unpaid = unpaidBills(state);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const recent = state.transactions.slice().sort((a, b) => (b.date < a.date ? -1 : 1)).slice(0, 6);

  const ruleBar = (label, value, color) => {
    const share = income > 0 ? Math.min(100, (value / income) * 100) : 0;
    return `<div class="rule-row"><span>${label}</span><div class="bar" role="img" aria-label="${label} ${pct(share)} dari pemasukan"><span style="width:${share.toFixed(1)}%;background:${color}"></span></div><strong>${pct(share)}</strong></div>`;
  };

  const recentRows = recent.map((t) => `<li><span class="tx-date">${t.date.slice(5)}</span><span class="tx-desc">${escapeHtml(t.desc)}</span><span class="tx-amount ${t.type}">${t.type === 'pemasukan' ? '+' : '−'} ${rupiah(t.amount)}</span></li>`).join('');

  const body = `
  <p class="lede">Ringkasan keuangan <strong>Keluarga Sari (contoh)</strong> — ${MONTH}. Pemasukan Rp9.800.000 dari dua pencari nafkah di Jakarta.</p>
  <section class="stats" aria-label="Ringkasan bulan ini">
    ${statCard('Pemasukan', rupiah(income), 'Gaji + penghasilan tambahan')}
    ${statCard('Belanja', rupiah(spending), 'Semua kategori, ' + MONTH)}
    ${statCard('Sisa bulan ini', rupiah(balance), balance >= 0 ? 'Masuk ke tabungan' : 'Belanja melebihi pemasukan')}
    ${statCard('Tingkat tabungan', pct(rate), 'Target sehat: 20%')}
  </section>
  <div class="grid-2">
    <section class="card" aria-labelledby="h-donut">
      <h2 id="h-donut">Belanja per kategori</h2>
      ${donutChart(parts, 'Donat belanja per kategori bulan November 2026')}
    </section>
    <section class="card" aria-labelledby="h-rule">
      <h2 id="h-rule">Aturan 50/30/20 bulan ini</h2>
      <p class="muted">Kebutuhan 50% · Keinginan 30% · Tabungan 20% dari pemasukan.</p>
      ${ruleBar('Kebutuhan', rule.kebutuhan, '#2e7d5b')}
      ${ruleBar('Keinginan', rule.keinginan, '#c98a1b')}
      ${ruleBar('Tabungan', rule.tabungan, '#1f6f8b')}
      <p class="insight">Kebutuhan keluarga contoh ini ${pct((rule.kebutuhan / income) * 100)} dari pemasukan — ${rule.kebutuhan / income <= 0.5 ? 'masih dalam batas 50%.' : 'di atas batas 50%, lihat Anggaran untuk menyesuaikan.'}</p>
    </section>
  </div>
  <div class="grid-2">
    <section class="card" aria-labelledby="h-bills">
      <h2 id="h-bills">Tagihan berikutnya</h2>
      ${nb ? `<p><strong>${escapeHtml(nb.name)}</strong> — ${rupiah(nb.amount)}, jatuh tempo tanggal ${nb.dueDay} ${MONTH}.</p>` : '<p>Semua tagihan bulan ini sudah lunas.</p>'}
      <p>${unpaid.length} tagihan belum dibayar, total ${rupiah(unpaidTotal)}. <a href="#/tagihan">Lihat semua tagihan →</a></p>
    </section>
    <section class="card" aria-labelledby="h-recent">
      <h2 id="h-recent">Transaksi terbaru</h2>
      <ul class="tx-list">${recentRows}</ul>
      <p><a href="#/transaksi">Lihat dan catat transaksi →</a></p>
    </section>
  </div>
  <section class="card" aria-labelledby="h-bench">
    <h2 id="h-bench">Bandingkan dengan angka nasional</h2>
    <p>Rata-rata pengeluaran per kapita penduduk Indonesia adalah <strong>Rp1.500.556/bulan</strong> (BPS, Susenas 2024) — makanan Rp751.789 (50,10%) dan bukan makanan Rp748.767 (49,90%). Untuk rumah tangga 4 orang, patokannya sekitar Rp6.002.224/bulan. Keluarga contoh ini membelanjakan ${rupiah(spending)} untuk 4 orang, atau ${rupiah(Math.round(spending / 4))} per orang. <a href="#/patokan">Lihat semua data acuan →</a></p>
  </section>`;
  return layout(state, '#/', 'Ringkasan — ' + MONTH, body);
}

export function viewAnggaran(state) {
  const byCat = spendingByCategory(state);
  const income = totalIncome(state);
  const totalBudget = CATEGORIES.reduce((s, c) => s + (state.budgets[c.id] || 0), 0);
  const totalActual = totalSpending(state);

  const rows = CATEGORIES.map((c) => {
    const budget = state.budgets[c.id] || 0;
    const actual = byCat[c.id];
    const share = budget > 0 ? Math.min(100, (actual / budget) * 100) : 0;
    const over = actual > budget;
    const status = over ? `<span class="badge over">Lewat ${rupiah(actual - budget)}</span>` : `<span class="badge ok">Sisa ${rupiah(budget - actual)}</span>`;
    return `<tr>
      <th scope="row">${c.label}</th>
      <td><label class="visually-hidden" for="budget-${c.id}">Anggaran ${c.label}</label><input id="budget-${c.id}" name="budget-${c.id}" type="number" min="0" step="1000" inputmode="numeric" value="${budget}" data-category="${c.id}"></td>
      <td class="num">${rupiah(actual)}</td>
      <td><div class="bar" role="img" aria-label="${c.label}: ${pct(share)} dari anggaran"><span style="width:${share.toFixed(1)}%;background:${over ? '#b4455a' : c.color}"></span></div></td>
      <td class="num">${pct(share)}</td>
      <td>${status}</td>
    </tr>`;
  }).join('');

  const body = `
  <p class="lede">Atur anggaran tiap kategori untuk ${MONTH}, lalu bandingkan dengan belanja sebenarnya. Anggaran keluarga contoh ini disusun dari angka BPS: makanan mengikuti porsi 50,10% pengeluaran per kapita.</p>
  <section class="card" aria-labelledby="h-budget">
    <h2 id="h-budget">Anggaran vs belanja nyata</h2>
    <form id="budget-form">
      <table class="budget-table">
        <thead><tr><th scope="col">Kategori</th><th scope="col">Anggaran (Rp)</th><th scope="col">Belanja nyata</th><th scope="col">Kemajuan</th><th scope="col">%</th><th scope="col">Status</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th scope="row">Total</th><td class="num"><strong>${rupiah(totalBudget)}</strong></td><td class="num"><strong>${rupiah(totalActual)}</strong></td><td></td><td class="num"><strong>${pct(totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0)}</strong></td><td>${totalActual > totalBudget ? '<span class="badge over">Lewat anggaran</span>' : '<span class="badge ok">Dalam anggaran</span>'}</td></tr></tfoot>
      </table>
      <p><button type="submit" class="btn">Simpan anggaran</button> <span id="budget-saved" class="saved-msg" role="status" aria-live="polite"></span></p>
    </form>
  </section>
  <section class="card" aria-labelledby="h-503020">
    <h2 id="h-503020">Kalkulator 50/30/20</h2>
    <p>Aturan praktis: 50% pemasukan untuk kebutuhan, 30% untuk keinginan, 20% untuk tabungan dan pelunasan utang.</p>
    <form id="rule-form" class="inline-form">
      <label for="rule-income">Pemasukan bulanan (Rp)</label>
      <input id="rule-income" name="rule-income" type="number" min="0" step="1000" inputmode="numeric" value="${income}">
      <button type="submit" class="btn">Hitung</button>
    </form>
    <div id="rule-result" role="status" aria-live="polite">
      <p>Dari pemasukan ${rupiah(income)}: kebutuhan <strong>${rupiah(Math.round(income * 0.5))}</strong> · keinginan <strong>${rupiah(Math.round(income * 0.3))}</strong> · tabungan <strong>${rupiah(Math.round(income * 0.2))}</strong>.</p>
    </div>
    <p class="muted">Patokan UMP DKI Jakarta 2026 adalah Rp5.729.876/bulan (Kemnaker / Kepgub No. 1142/2025) — gaji Ayah di keluarga contoh ini sama dengan UMP tersebut.</p>
  </section>`;
  return layout(state, '#/anggaran', 'Anggaran', body);
}
