// Penyimpanan dan hitungan turunan KantongKeluarga.
//
// Semua data pengguna tinggal di localStorage peramban (kunci di bawah),
// sehingga situs tetap bekerja luring. Data awal adalah data contoh dari
// data.js; begitu pengguna mengubah apa pun, perubahan itulah yang dipakai.
import { BUDGETS, CATEGORIES, MONTHLY_INCOME, MONTHLY_TREND, SEED_BILLS, SEED_GOALS, SEED_TRANSACTIONS } from './data.js';

const KEY = 'kantongkeluarga-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function defaultState() {
  return {
    income: MONTHLY_INCOME,
    budgets: clone(BUDGETS),
    transactions: clone(SEED_TRANSACTIONS),
    bills: clone(SEED_BILLS),
    goals: clone(SEED_GOALS),
    seeded: true,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return defaultState();
}

// --- Hitungan turunan ---

export function spendingByCategory(state) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (t.type === 'belanja' && out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}

export function totalSpending(state) {
  return state.transactions
    .filter((t) => t.type === 'belanja')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalIncome(state) {
  return state.transactions
    .filter((t) => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

export function categoryColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#888';
}

// Pembagian 50/30/20: kebutuhan 50%, keinginan 30%, tabungan 20%.
export function fiftyThirtyTwenty(state) {
  const byCat = spendingByCategory(state);
  let kebutuhan = 0;
  let keinginan = 0;
  for (const c of CATEGORIES) {
    if (c.group === 'kebutuhan') kebutuhan += byCat[c.id];
    else keinginan += byCat[c.id];
  }
  const income = totalIncome(state) || state.income;
  const tabungan = Math.max(0, income - kebutuhan - keinginan);
  return { kebutuhan, keinginan, tabungan, income };
}

export function unpaidBills(state) {
  return state.bills.filter((b) => !b.paid);
}

export function nextBill(state) {
  const unpaid = unpaidBills(state).slice().sort((a, b) => a.dueDay - b.dueDay);
  return unpaid[0] || null;
}

export function monthlyTrend(state) {
  // Bulan berjalan dihitung dari transaksi; bulan-bulan sebelumnya dari data contoh.
  const current = MONTHLY_TREND[MONTHLY_TREND.length - 1];
  const rows = MONTHLY_TREND.slice(0, -1).map((r) => ({ ...r }));
  rows.push({ month: 'Nov 2026', income: totalIncome(state), spending: totalSpending(state) });
  return { rows, current };
}

export function addTransaction(state, tx) {
  const id = 't' + Date.now().toString(36);
  state.transactions.push({ id, ...tx });
  return id;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
}
