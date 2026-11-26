// DOMPETKU — main.js: state (localStorage), hash router, computed totals,
// event delegation for every control. No network: all data lives in the browser.

import { CATEGORIES, TRANSACTIONS, GOALS, INCOME_SOURCES, META } from './data.js';
import { viewDashboard, viewBudget, viewTransactions, viewGoals, viewTips, viewSources } from './views.js';
import { fmtRp } from './charts.js';

const STORE_KEY = 'dompetku-v1';
const THEME_KEY = 'dompetku-theme';

function defaults() {
  return {
    income: INCOME_SOURCES.map((s) => ({ ...s })),
    categories: CATEGORIES.map((c) => ({ ...c })),
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    goals: GOALS.map((g) => ({ ...g })),
    ui: { filterCat: '', sortTx: 'date-desc' },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) return defaults();
    parsed.ui = { filterCat: '', sortTx: 'date-desc', ...(parsed.ui || {}) };
    return parsed;
  } catch {
    return defaults();
  }
}

let state = load();

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage penuh: tetap jalan */ }
}

function calc() {
  const incomeTotal = state.income.reduce((a, s) => a + (Number(s.amount) || 0), 0);
  const perCat = {};
  let expenseTotal = 0;
  for (const t of state.transactions) {
    if (t.type !== 'out') continue;
    expenseTotal += Number(t.amount) || 0;
    if (t.categoryId) perCat[t.categoryId] = (perCat[t.categoryId] || 0) + (Number(t.amount) || 0);
  }
  const budgetTotal = state.categories.reduce((a, c) => a + (Number(c.budget) || 0), 0);
  const groupBudget = { kebutuhan: 0, keinginan: 0, tabungan: 0 };
  const groupActual = { kebutuhan: 0, keinginan: 0, tabungan: 0 };
  for (const c of state.categories) {
    groupBudget[c.group] = (groupBudget[c.group] || 0) + (Number(c.budget) || 0);
    groupActual[c.group] = (groupActual[c.group] || 0) + (perCat[c.id] || 0);
  }
  return {
    incomeTotal, expenseTotal, perCat, budgetTotal, groupBudget, groupActual,
    remaining: incomeTotal - expenseTotal,
    txCount: state.transactions.length,
  };
}

const ROUTES = {
  '': viewDashboard,
  '#/': viewDashboard,
  '#/anggaran': viewBudget,
  '#/transaksi': viewTransactions,
  '#/target': viewGoals,
  '#/tips': viewTips,
  '#/sumber': viewSources,
};

const TITLES = {
  '': 'Dasbor', '#/': 'Dasbor', '#/anggaran': 'Anggaran', '#/transaksi': 'Transaksi',
  '#/target': 'Target Tabungan', '#/tips': 'Tips & Kalkulator', '#/sumber': 'Sumber',
};

function render() {
  const hash = location.hash || '#/';
  const view = ROUTES[hash] || viewDashboard;
  const c = calc();
  document.getElementById('view').innerHTML = view(state, c);
  document.querySelectorAll('nav a').forEach((a) => {
    const on = (a.getAttribute('href') === hash) || (hash === '' && a.getAttribute('href') === '#/');
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.title = `${TITLES[hash] || 'Dasbor'} — DOMPETKU`;
  window.__shotReady = true;
}

function rerender() { window.__shotReady = false; save(); render(); }

// --- theme ---
const root = document.documentElement;
try {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') root.setAttribute('data-theme', savedTheme);
} catch { /* abaikan */ }

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem(THEME_KEY, next); } catch { /* abaikan */ }
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Mode terang' : '🌙 Mode gelap';
}

// --- events (delegation; halaman dirender ulang, jadi jangan ikat sekali) ---
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const action = t.getAttribute('data-action');
  if (action === 'del-tx') {
    const id = t.getAttribute('data-id');
    state.transactions = state.transactions.filter((x) => x.id !== id);
    rerender();
  }
  if (action === 'reset-demo') {
    if (window.confirm('Kembalikan semua data ke contoh awal? Perubahanmu akan hilang.')) {
      state = defaults();
      rerender();
    }
  }
});

document.addEventListener('change', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const action = t.getAttribute('data-action');
  if (action === 'edit-budget') {
    const cat = state.categories.find((c) => c.id === t.getAttribute('data-id'));
    const v = Math.max(0, Math.round(Number(t.value) || 0));
    if (cat) { cat.budget = v; rerender(); }
  }
  if (action === 'edit-income') {
    const idx = Number(t.getAttribute('data-idx'));
    const v = Math.max(0, Math.round(Number(t.value) || 0));
    if (state.income[idx]) { state.income[idx].amount = v; rerender(); }
  }
  if (action === 'filter-cat') { state.ui.filterCat = t.value; rerender(); }
  if (action === 'sort-tx') { state.ui.sortTx = t.value; rerender(); }
});

document.addEventListener('input', (e) => {
  const id = e.target.id;
  if (id === 'kwh' || id === 'tarif-daya') {
    const kwh = Math.max(0, Number(document.getElementById('kwh')?.value) || 0);
    const tarif = Number(document.getElementById('tarif-daya')?.value) || 0;
    const out = document.getElementById('listrik-out');
    if (out) out.textContent = fmtRp(kwh * tarif);
  }
  if (id === 'darurat-wajib' || id === 'darurat-bulan') {
    const wajib = Math.max(0, Number(document.getElementById('darurat-wajib')?.value) || 0);
    const bulan = Number(document.getElementById('darurat-bulan')?.value) || 0;
    const out = document.getElementById('darurat-out');
    if (out) out.textContent = fmtRp(wajib * bulan);
  }
});

document.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  if (form.id === 'tx-form') {
    const desc = document.getElementById('tx-desc').value.trim();
    const amount = Math.round(Number(document.getElementById('tx-amount').value) || 0);
    const type = document.getElementById('tx-type').value;
    const cat = document.getElementById('tx-cat').value;
    const date = document.getElementById('tx-date').value || '2026-11-26';
    if (!desc || amount <= 0) return;
    state.transactions.unshift({
      id: 'u' + Date.now().toString(36),
      date, desc, type,
      categoryId: type === 'in' ? null : cat,
      amount,
    });
    rerender();
    const note = document.getElementById('tx-form')?.closest('.card')?.querySelector('.note');
    void note;
  }
  if (form.id === 'goal-form') {
    const name = document.getElementById('goal-name').value.trim();
    const target = Math.round(Number(document.getElementById('goal-target').value) || 0);
    const monthly = Math.round(Number(document.getElementById('goal-monthly').value) || 0);
    if (!name || target <= 0) return;
    state.goals.push({ id: 'g' + Date.now().toString(36), name, target, saved: 0, monthly, note: 'Target buatan pengguna.' });
    rerender();
  }
  if (form.classList.contains('deposit-form')) {
    const goalId = form.getAttribute('data-goal');
    const goal = state.goals.find((g) => g.id === goalId);
    const amount = Math.round(Number(form.querySelector('input').value) || 0);
    if (!goal || amount <= 0) return;
    goal.saved += amount;
    state.transactions.unshift({
      id: 'u' + Date.now().toString(36),
      date: '2026-11-26',
      desc: 'Setoran ' + goal.name,
      categoryId: 'tabungan',
      type: 'out',
      amount,
    });
    rerender();
  }
});

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
if (root.getAttribute('data-theme') === 'dark') {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = '☀️ Mode terang';
}

window.addEventListener('hashchange', render);
document.getElementById('month-label').textContent = META.month;
render();
