// Halaman Transaksi, Tagihan, dan Tabungan.
import { CATEGORIES, MONTH, MONTH_KEY } from './data.js';
import { rupiah, formatDate, escapeHtml } from './format.js';
import { categoryLabel, totalSpending, totalIncome } from './store.js';
import { layout } from './views.js';

const categoryOptions = (selected) => CATEGORIES.map((c) =>
  `<option value="${c.id}"${c.id === selected ? ' selected' : ''}>${c.label}</option>`).join('');

export function viewTransaksi(state, filter) {
  const cat = filter.cat || 'semua';
  const type = filter.type || 'semua';
  let list = state.transactions.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
  if (cat !== 'semua') list = list.filter((t) => t.category === cat);
  if (type !== 'semua') list = list.filter((t) => t.type === type);
  const shownSpending = list.filter((t) => t.type === 'belanja').reduce((s, t) => s + t.amount, 0);
  const shownIncome = list.filter((t) => t.type === 'pemasukan').reduce((s, t) => s + t.amount, 0);

  const rows = list.length ? list.map((t) => `<tr>
      <td>${formatDate(t.date)}</td>
      <td>${escapeHtml(t.desc)}</td>
      <td>${t.type === 'pemasukan' ? 'Pemasukan' : categoryLabel(t.category)}</td>
      <td class="num ${t.type}">${t.type === 'pemasukan' ? '+' : '−'} ${rupiah(t.amount)}</td>
      <td><button type="button" class="btn-small" data-edit="${t.id}">Ubah</button> <button type="button" class="btn-small danger" data-delete="${t.id}">Hapus</button></td>
    </tr>`).join('') : `<tr><td colspan="5">Tidak ada transaksi yang cocok dengan filter. Ubah filter atau catat transaksi baru.</td></tr>`;

  const body = `
  <p class="lede">Semua pemasukan dan belanja keluarga contoh bulan ${MONTH}. Tambah, ubah, atau hapus — perubahan tersimpan di peramban Anda dan langsung mengubah Ringkasan, Anggaran, dan Laporan.</p>
  <section class="card" aria-labelledby="h-add">
    <h2 id="h-add">Catat transaksi</h2>
    <form id="tx-form" class="form-grid">
      <input type="hidden" id="tx-id" name="tx-id" value="">
      <div><label for="tx-date">Tanggal</label><input id="tx-date" name="tx-date" type="date" value="2026-11-26" required></div>
      <div><label for="tx-desc">Keterangan</label><input id="tx-desc" name="tx-desc" type="text" placeholder="cth. Belanja pasar pagi…" required maxlength="80"></div>
      <div><label for="tx-type">Jenis</label><select id="tx-type" name="tx-type"><option value="belanja">Belanja</option><option value="pemasukan">Pemasukan</option></select></div>
      <div id="tx-cat-wrap"><label for="tx-category">Kategori</label><select id="tx-category" name="tx-category">${categoryOptions('makanan')}</select></div>
      <div><label for="tx-amount">Jumlah (Rp)</label><input id="tx-amount" name="tx-amount" type="number" min="1" step="100" inputmode="numeric" placeholder="cth. 150000…" required></div>
      <div class="form-actions"><button type="submit" class="btn" id="tx-submit">Tambah transaksi</button><button type="button" class="btn ghost" id="tx-cancel" hidden>Batalkan ubahan</button></div>
    </form>
    <p id="tx-msg" class="saved-msg" role="status" aria-live="polite"></p>
  </section>
  <section class="card" aria-labelledby="h-list">
    <h2 id="h-list">Daftar transaksi <span class="count">(${list.length})</span></h2>
    <form id="tx-filter" class="inline-form" aria-label="Saring transaksi">
      <label for="filter-cat">Kategori</label>
      <select id="filter-cat" name="cat"><option value="semua">Semua kategori</option>${categoryOptions(cat === 'semua' ? '' : cat)}<option value="pemasukan"${cat === 'pemasukan' ? ' selected' : ''}>Pemasukan</option></select>
      <label for="filter-type">Jenis</label>
      <select id="filter-type" name="type"><option value="semua">Semua</option><option value="belanja"${type === 'belanja' ? ' selected' : ''}>Belanja</option><option value="pemasukan"${type === 'pemasukan' ? ' selected' : ''}>Pemasukan</option></select>
      <button type="submit" class="btn">Terapkan filter</button>
      <a class="btn ghost" href="#/transaksi">Atur ulang</a>
    </form>
    <p class="muted">Ditampilkan: belanja ${rupiah(shownSpending)} · pemasukan ${rupiah(shownIncome)}</p>
    <div class="table-scroll"><table class="tx-table">
      <thead><tr><th scope="col">Tanggal</th><th scope="col">Keterangan</th><th scope="col">Kategori</th><th scope="col">Jumlah</th><th scope="col">Aksi</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="muted">Total bulan ini: belanja ${rupiah(totalSpending(state))} · pemasukan ${rupiah(totalIncome(state))}.</p>
  </section>`;
  return layout(state, '#/transaksi', 'Transaksi', body);
}

export function viewTagihan(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = total - paidTotal;
  const sorted = state.bills.slice().sort((a, b) => a.dueDay - b.dueDay);

  const rows = sorted.map((b) => `<tr class="${b.paid ? 'paid' : 'unpaid'}">
      <td><label class="check-row"><input type="checkbox" data-bill="${b.id}" ${b.paid ? 'checked' : ''}> <span>${escapeHtml(b.name)}</span></label></td>
      <td class="num">${rupiah(b.amount)}</td>
      <td>Tanggal ${b.dueDay} ${MONTH}</td>
      <td>${b.paid ? '<span class="badge ok">Lunas</span>' : '<span class="badge due">Belum dibayar</span>'}</td>
      <td><button type="button" class="btn-small danger" data-delete-bill="${b.id}">Hapus</button></td>
    </tr>`).join('');

  const body = `
  <p class="lede">Tagihan rutin keluarga contoh bulan ${MONTH}. Centang tagihan yang sudah dibayar — status tersimpan di peramban Anda.</p>
  <section class="stats" aria-label="Ringkasan tagihan">
    <article class="stat"><p class="stat-label">Total tagihan</p><p class="stat-value">${rupiah(total)}</p><p class="stat-note">${state.bills.length} tagihan rutin</p></article>
    <article class="stat"><p class="stat-label">Sudah dibayar</p><p class="stat-value">${rupiah(paidTotal)}</p><p class="stat-note">${paid.length} dari ${state.bills.length} tagihan</p></article>
    <article class="stat"><p class="stat-label">Belum dibayar</p><p class="stat-value">${rupiah(unpaidTotal)}</p><p class="stat-note">${state.bills.length - paid.length} tagihan menanti</p></article>
  </section>
  <section class="card" aria-labelledby="h-bills">
    <h2 id="h-bills">Daftar tagihan — ${MONTH}</h2>
    <div class="table-scroll"><table class="tx-table">
      <thead><tr><th scope="col">Tagihan</th><th scope="col">Jumlah</th><th scope="col">Jatuh tempo</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>
  <section class="card" aria-labelledby="h-add-bill">
    <h2 id="h-add-bill">Tambah tagihan rutin</h2>
    <form id="bill-form" class="form-grid">
      <div><label for="bill-name">Nama tagihan</label><input id="bill-name" name="bill-name" type="text" placeholder="cth. Iuran sampah…" required maxlength="60"></div>
      <div><label for="bill-amount">Jumlah (Rp)</label><input id="bill-amount" name="bill-amount" type="number" min="1" step="100" inputmode="numeric" placeholder="cth. 50000…" required></div>
      <div><label for="bill-day">Jatuh tempo (tanggal)</label><input id="bill-day" name="bill-day" type="number" min="1" max="31" step="1" inputmode="numeric" value="15" required></div>
      <div class="form-actions"><button type="submit" class="btn">Tambah tagihan</button></div>
    </form>
    <p id="bill-msg" class="saved-msg" role="status" aria-live="polite"></p>
  </section>`;
  return layout(state, '#/tagihan', 'Tagihan', body);
}

export function viewTabungan(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);

  const cards = state.goals.map((g) => {
    const share = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
    const left = Math.max(0, g.target - g.saved);
    return `<article class="card goal-card">
      <h3>${escapeHtml(g.name)}</h3>
      <p class="muted">${escapeHtml(g.note)}</p>
      <p class="goal-amount"><strong>${rupiah(g.saved)}</strong> dari ${rupiah(g.target)}</p>
      <div class="bar big" role="img" aria-label="${escapeHtml(g.name)}: ${Math.round(share)} persen tercapai"><span style="width:${share.toFixed(1)}%;background:#2e7d5b"></span></div>
      <p>${Math.round(share)}% tercapai · kurang ${rupiah(left)}</p>
      <form class="goal-form inline-form" data-goal="${g.id}">
        <label for="add-${g.id}">Tambah tabungan (Rp)</label>
        <input id="add-${g.id}" name="amount" type="number" min="1000" step="1000" inputmode="numeric" placeholder="cth. 200000…" required>
        <button type="submit" class="btn">Tambah</button>
      </form>
    </article>`;
  }).join('');

  const body = `
  <p class="lede">Target tabungan keluarga contoh. Dana darurat adalah yang pertama: idealnya 3–6 bulan pengeluaran, sekitar ${rupiah(totalSpending(state) * 3)}–${rupiah(totalSpending(state) * 6)} untuk keluarga ini.</p>
  <section class="stats" aria-label="Ringkasan tabungan">
    <article class="stat"><p class="stat-label">Total terkumpul</p><p class="stat-value">${rupiah(totalSaved)}</p><p class="stat-note">Di ${state.goals.length} target</p></article>
    <article class="stat"><p class="stat-label">Total target</p><p class="stat-value">${rupiah(totalTarget)}</p><p class="stat-note">${Math.round((totalSaved / totalTarget) * 100)}% tercapai</p></article>
    <article class="stat"><p class="stat-label">Sisa bulan ini</p><p class="stat-value">${rupiah(totalIncome(state) - totalSpending(state))}</p><p class="stat-note">Bisa dialihkan ke tabungan</p></article>
  </section>
  <div class="grid-2">${cards}</div>
  <p id="goal-msg" class="saved-msg" role="status" aria-live="polite"></p>
  <section class="card" aria-labelledby="h-new-goal">
    <h2 id="h-new-goal">Buat target baru</h2>
    <form id="goal-form" class="form-grid">
      <div><label for="goal-name">Nama target</label><input id="goal-name" name="goal-name" type="text" placeholder="cth. Umrah keluarga…" required maxlength="60"></div>
      <div><label for="goal-target">Target (Rp)</label><input id="goal-target" name="goal-target" type="number" min="1000" step="1000" inputmode="numeric" placeholder="cth. 20000000…" required></div>
      <div><label for="goal-note">Catatan</label><input id="goal-note" name="goal-note" type="text" placeholder="cth. Berangkat 2028…" maxlength="80"></div>
      <div class="form-actions"><button type="submit" class="btn">Buat target</button></div>
    </form>
  </section>`;
  return layout(state, '#/tabungan', 'Tabungan', body);
}
