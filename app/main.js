// Router dan pengikat kejadian KantongKeluarga.
//
// Situs ini satu halaman dengan rute hash: #/, #/anggaran, #/transaksi,
// #/tagihan, #/tabungan, #/laporan, #/patokan. Setiap render menggambar
// ulang <main> dari state terbaru, lalu mengikat formulir halaman itu.
import { CATEGORIES } from './data.js';
import { rupiah } from './format.js';
import { loadState, saveState, resetState, addTransaction, deleteTransaction } from './store.js';
import { viewDashboard, viewAnggaran } from './views.js';
import { viewTransaksi, viewTagihan, viewTabungan } from './views-tools.js';
import { viewLaporan, viewPatokan } from './views-reports.js';

let state = loadState();

function parseHash() {
  const raw = location.hash || '#/';
  const [path, query] = raw.slice(1).split('?');
  const params = new URLSearchParams(query || '');
  return { path: path || '/', cat: params.get('cat') || 'semua', type: params.get('type') || 'semua' };
}

function render() {
  const { path, cat, type } = parseHash();
  let html;
  if (path === '/anggaran') html = viewAnggaran(state);
  else if (path === '/transaksi') html = viewTransaksi(state, { cat, type });
  else if (path === '/tagihan') html = viewTagihan(state);
  else if (path === '/tabungan') html = viewTabungan(state);
  else if (path === '/laporan') html = viewLaporan(state);
  else if (path === '/patokan') html = viewPatokan(state);
  else html = viewDashboard(state);
  document.body.innerHTML = html;
  bindPage(path);
  const main = document.getElementById('konten');
  if (main) main.focus({ preventScroll: true });
}

function moneyValue(input) {
  const n = Number(input.value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function bindPage(path) {
  // Kembalikan data contoh (di footer setiap halaman).
  const resetBtn = document.getElementById('reset-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (window.confirm('Kembalikan semua data ke data contoh awal? Perubahan Anda akan hilang.')) {
        state = resetState();
        saveState(state);
        render();
      }
    });
  }

  if (path === '/anggaran') {
    const form = document.getElementById('budget-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      for (const input of form.querySelectorAll('input[data-category]')) {
        const v = Number(input.value);
        if (Number.isFinite(v) && v >= 0) state.budgets[input.dataset.category] = Math.round(v);
      }
      saveState(state);
      document.getElementById('budget-saved').textContent = 'Anggaran tersimpan.';
      render();
    });
    const ruleForm = document.getElementById('rule-form');
    ruleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const income = moneyValue(document.getElementById('rule-income')) || 0;
      document.getElementById('rule-result').innerHTML =
        `<p>Dari pemasukan ${rupiah(income)}: kebutuhan <strong>${rupiah(Math.round(income * 0.5))}</strong> · keinginan <strong>${rupiah(Math.round(income * 0.3))}</strong> · tabungan <strong>${rupiah(Math.round(income * 0.2))}</strong>.</p>`;
    });
  }

  if (path === '/transaksi') {
    const form = document.getElementById('tx-form');
    const typeSel = document.getElementById('tx-type');
    const catWrap = document.getElementById('tx-cat-wrap');
    const syncCat = () => { catWrap.style.display = typeSel.value === 'pemasukan' ? 'none' : ''; };
    typeSel.addEventListener('change', syncCat);
    syncCat();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = moneyValue(document.getElementById('tx-amount'));
      const desc = document.getElementById('tx-desc').value.trim();
      const date = document.getElementById('tx-date').value;
      const type = typeSel.value;
      if (!amount || !desc || !date) return;
      const editingId = document.getElementById('tx-id').value;
      const tx = {
        date,
        desc,
        category: type === 'pemasukan' ? 'pemasukan' : document.getElementById('tx-category').value,
        amount,
        type,
      };
      if (editingId) {
        const old = state.transactions.find((t) => t.id === editingId);
        if (old) Object.assign(old, tx);
        document.getElementById('tx-msg').textContent = 'Transaksi diperbarui.';
      } else {
        addTransaction(state, tx);
        document.getElementById('tx-msg').textContent = 'Transaksi ditambahkan.';
      }
      saveState(state);
      render();
      const msg = document.getElementById('tx-msg');
      if (msg) msg.textContent = editingId ? 'Transaksi diperbarui.' : 'Transaksi ditambahkan.';
    });
    document.getElementById('tx-cancel').addEventListener('click', () => render());

    document.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = state.transactions.find((x) => x.id === btn.dataset.edit);
        if (!t) return;
        document.getElementById('tx-id').value = t.id;
        document.getElementById('tx-date').value = t.date;
        document.getElementById('tx-desc').value = t.desc;
        document.getElementById('tx-type').value = t.type;
        document.getElementById('tx-amount').value = t.amount;
        if (t.type === 'belanja') document.getElementById('tx-category').value = t.category;
        syncCat();
        document.getElementById('tx-submit').textContent = 'Simpan perubahan';
        document.getElementById('tx-cancel').hidden = false;
        document.getElementById('tx-desc').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
    document.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = state.transactions.find((x) => x.id === btn.dataset.delete);
        if (t && window.confirm(`Hapus transaksi “${t.desc}” (${rupiah(t.amount)})?`)) {
          deleteTransaction(state, t.id);
          saveState(state);
          render();
        }
      });
    });
  }

  if (path === '/tagihan') {
    document.querySelectorAll('[data-bill]').forEach((box) => {
      box.addEventListener('change', () => {
        const b = state.bills.find((x) => x.id === box.dataset.bill);
        if (b) {
          b.paid = box.checked;
          saveState(state);
          render();
        }
      });
    });
    document.querySelectorAll('[data-delete-bill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = state.bills.find((x) => x.id === btn.dataset.deleteBill);
        if (b && window.confirm(`Hapus tagihan “${b.name}”?`)) {
          state.bills = state.bills.filter((x) => x.id !== b.id);
          saveState(state);
          render();
        }
      });
    });
    document.getElementById('bill-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = moneyValue(document.getElementById('bill-amount'));
      const name = document.getElementById('bill-name').value.trim();
      const day = Number(document.getElementById('bill-day').value);
      if (!amount || !name || !(day >= 1 && day <= 31)) return;
      state.bills.push({ id: 'b' + Date.now().toString(36), name, amount, dueDay: day, paid: false });
      saveState(state);
      render();
      const msg = document.getElementById('bill-msg');
      if (msg) msg.textContent = 'Tagihan ditambahkan.';
    });
  }

  if (path === '/tabungan') {
    document.querySelectorAll('.goal-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = moneyValue(form.querySelector('input[name="amount"]'));
        const g = state.goals.find((x) => x.id === form.dataset.goal);
        if (!amount || !g) return;
        g.saved += amount;
        saveState(state);
        render();
        const msg = document.getElementById('goal-msg');
        if (msg) msg.textContent = `${rupiah(amount)} ditambahkan ke ${g.name}.`;
      });
    });
    document.getElementById('goal-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const target = moneyValue(document.getElementById('goal-target'));
      const name = document.getElementById('goal-name').value.trim();
      const note = document.getElementById('goal-note').value.trim();
      if (!target || !name) return;
      state.goals.push({ id: 'g' + Date.now().toString(36), name, target, saved: 0, note });
      saveState(state);
      render();
    });
  }
}

window.addEventListener('hashchange', render);
render();
