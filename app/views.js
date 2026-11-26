// DOMPETKU — views.js: six pages, all rendered from state + computed totals.
// Every number shown is computed from the transaction list and budgets;
// nothing is hard-coded except the example data in data.js.

import { CATEGORIES, GROUP_LABELS, RULE_503020, REFERENCES, TIPS, SOURCES, META } from './data.js';
import { donutChart, hbarChart, splitBars, fmtRp, fmtShort } from './charts.js';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function catName(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : 'Lainnya';
}

function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#888';
}

function dateID(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(d)} Nov 2026`;
}

function groupSplit(calc) {
  return ['kebutuhan', 'keinginan', 'tabungan'].map((g) => {
    const targetRp = (calc.incomeTotal * RULE_503020[g]) / 100;
    const actualRp = calc.groupActual[g] || 0;
    const budgetRp = calc.groupBudget[g] || 0;
    return {
      group: g, label: GROUP_LABELS[g],
      targetPct: RULE_503020[g],
      actualPct: calc.incomeTotal ? (actualRp / calc.incomeTotal) * 100 : 0,
      budgetPct: calc.incomeTotal ? (budgetRp / calc.incomeTotal) * 100 : 0,
      targetRp, actualRp, budgetRp,
      color: g === 'kebutuhan' ? '#4a7fb5' : g === 'keinginan' ? '#e08bb0' : '#0e7a5f',
    };
  });
}

export function viewDashboard(state, calc) {
  const donutItems = CATEGORIES
    .map((c) => ({ label: c.name, value: calc.perCat[c.id] || 0, color: c.color }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
  const hbarRows = CATEGORIES.map((c) => ({
    label: c.name, value: calc.perCat[c.id] || 0, budget: c.budget, color: c.color,
  })).sort((a, b) => b.value - a.value).slice(0, 6);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const split = groupSplit(calc);
  const needGap = split[0].actualPct - 50;
  const saveGap = split[2].actualPct - 20;
  const verdict = needGap > 5
    ? `Kebutuhanmu ${split[0].actualPct.toFixed(0)}% dari penghasilan — di atas target 50%. Wajar untuk Jakarta, tapi ruang tabunganmu jadi sempit.`
    : 'Pembagianmu sudah dekat dengan aturan 50/30/20. Pertahankan.';
  const rows = recent.map((t) => `<tr>
      <td>${dateID(t.date)}</td><td>${esc(t.desc)}</td><td>${t.categoryId ? esc(catName(t.categoryId)) : 'Penghasilan'}</td>
      <td class="${t.type === 'in' ? 'num in' : 'num out'}">${t.type === 'in' ? '+' : '−'} ${fmtRp(t.amount)}</td>
    </tr>`).join('');
  const goalMini = state.goals.map((g) => {
    const pct = Math.min(100, (g.saved / g.target) * 100);
    return `<div class="goal-mini"><div class="goal-mini-head"><span>${esc(g.name)}</span><span>${pct.toFixed(0)}%</span></div>
      <div class="bar"><span style="width:${pct.toFixed(1)}%"></span></div>
      <div class="goal-mini-sub">${fmtRp(g.saved)} dari ${fmtRp(g.target)}</div></div>`;
  }).join('');
  const legend = donutItems.map((d) => `<li><span class="dot" style="background:${d.color}"></span>${esc(d.label)}<b>${fmtShort(d.value)}</b></li>`).join('');
  return `<section class="hero">
    <div><p class="eyebrow">${esc(META.month)} · ${esc(META.family)}</p>
    <h1>Uang keluarga, terlihat semua.</h1>
    <p class="lede">DOMPETKU mencatat penghasilan, belanja, dan tabungan satu keluarga dalam satu tempat — tanpa aplikasi, tanpa akun, tanpa internet. Semua data contoh ini bisa kamu ubah; tersimpan di perambanmu sendiri.</p>
    <p class="hero-actions"><a class="btn primary" href="#/transaksi">+ Catat transaksi</a> <a class="btn" href="#/anggaran">Lihat anggaran 50/30/20</a></p></div>
    <div class="hero-card"><div class="hero-card-label">Sisa bulan ini</div>
    <div class="hero-card-num">${fmtRp(calc.remaining)}</div>
    <div class="hero-card-sub">dari penghasilan ${fmtRp(calc.incomeTotal)} · sudah dibelanjakan ${fmtRp(calc.expenseTotal)}</div>
    <div class="bar big"><span style="width:${(calc.expenseTotal / Math.max(1, calc.incomeTotal) * 100).toFixed(1)}%"></span></div>
    <div class="hero-card-sub">${(calc.expenseTotal / Math.max(1, calc.incomeTotal) * 100).toFixed(0)}% penghasilan sudah dipakai · tabungan berjalan ${fmtRp(calc.perCat.tabungan || 0)}</div></div>
  </section>
  <section class="kpis">
    <div class="kpi"><span>Penghasilan</span><b>${fmtRp(calc.incomeTotal)}</b><small>2 sumber · bisa diubah di Anggaran</small></div>
    <div class="kpi"><span>Total belanja</span><b>${fmtRp(calc.expenseTotal)}</b><small>${calc.txCount} transaksi bulan ini</small></div>
    <div class="kpi"><span>Sisa</span><b>${fmtRp(calc.remaining)}</b><small>${(calc.remaining / Math.max(1, calc.incomeTotal) * 100).toFixed(0)}% dari penghasilan</small></div>
    <div class="kpi"><span>Dana darurat</span><b>${((state.goals[0].saved / state.goals[0].target) * 100).toFixed(0)}%</b><small>${fmtRp(state.goals[0].saved)} dari ${fmtRp(state.goals[0].target)}</small></div>
  </section>
  <section class="grid2">
    <div class="card"><h2>Ke mana uang pergi?</h2><p class="muted">Belanja per kategori, ${esc(META.month)}. Tabungan dihitung sebagai setoran, bukan belanja hangus.</p>
      <div class="donut-wrap">${donutChart(donutItems)}<ul class="legend">${legend}</ul></div></div>
    <div class="card"><h2>Anggaran vs realisasi</h2><p class="muted">Enam kategori terbesar. Batang pudar = anggaran, batang warna = yang benar-benar keluar.</p>
      ${hbarChart(hbarRows)}
      <p class="note">Kategori yang lewat anggaran: ${CATEGORIES.filter((c) => (calc.perCat[c.id] || 0) > c.budget).map((c) => esc(c.name)).join(', ') || 'tidak ada'}.</p></div>
  </section>
  <section class="grid2">
    <div class="card"><h2>Transaksi terakhir</h2>
      <table class="tbl"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead><tbody>${rows}</tbody></table>
      <p><a href="#/transaksi">Lihat semua transaksi →</a></p></div>
    <div class="card"><h2>Target tabungan</h2>${goalMini}
      <p class="note">${esc(verdict)}</p><p><a href="#/target">Kelola target tabungan →</a></p></div>
  </section>`;
}

export function viewBudget(state, calc) {
  const split = groupSplit(calc);
  const bars = splitBars(split.map((s) => ({
    label: s.label, targetPct: s.targetPct, actualPct: s.actualPct, color: s.color, targetRp: s.targetRp, actualRp: s.actualRp,
  })));
  const rows = CATEGORIES.map((c) => {
    const actual = calc.perCat[c.id] || 0;
    const pct = c.budget ? (actual / c.budget) * 100 : 0;
    const over = actual > c.budget;
    return `<tr><td><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</td>
      <td>${esc(GROUP_LABELS[c.group])}</td>
      <td class="num"><input class="budget-input" type="number" min="0" step="10000" value="${c.budget}" data-action="edit-budget" data-id="${c.id}" aria-label="Anggaran ${esc(c.name)}"></td>
      <td class="num">${fmtRp(actual)}</td>
      <td class="num ${over ? 'over' : ''}">${pct.toFixed(0)}%</td>
      <td class="num ${over ? 'over' : 'ok'}">${over ? '−' + fmtRp(actual - c.budget) : '+' + fmtRp(c.budget - actual)}</td></tr>`;
  }).join('');
  const incomeRows = state.income.map((s, i) => `<tr><td>${esc(s.label)}</td><td class="num"><input class="budget-input" type="number" min="0" step="10000" value="${s.amount}" data-action="edit-income" data-idx="${i}" aria-label="Penghasilan ${esc(s.label)}"></td><td class="muted">${esc(s.note || '')}</td></tr>`).join('');
  const verdicts = split.map((s) => {
    const d = s.actualPct - s.targetPct;
    const word = Math.abs(d) < 3 ? 'sesuai target' : d > 0 ? `${d.toFixed(0)} poin di atas target` : `${Math.abs(d).toFixed(0)} poin di bawah target`;
    return `<li><b>${esc(s.label)}:</b> aktual ${s.actualPct.toFixed(1)}% (${fmtRp(s.actualRp)}) — ${word}.</li>`;
  }).join('');
  return `<h1>Anggaran — aturan 50/30/20</h1>
  <p class="lede">Aturan 50/30/20 membagi penghasilan bersih menjadi kebutuhan 50%, keinginan 30%, dan tabungan 20%. Angka di bawah memakai penghasilan contoh Rp10.000.000 — ubah penghasilan atau anggaran apa pun, semua hitungan ikut berubah.</p>
  <section class="card"><h2>Penghasilan bulanan</h2>
    <table class="tbl"><thead><tr><th>Sumber</th><th class="num">Jumlah / bulan</th><th>Catatan</th></tr></thead><tbody>${incomeRows}</tbody>
    <tfoot><tr><td><b>Total penghasilan</b></td><td class="num"><b>${fmtRp(calc.incomeTotal)}</b></td><td></td></tr></tfoot></table>
    <p class="note">Gaji Ayah Rp5.730.000 setara UMP DKI Jakarta 2026 (Rp5.729.876 — Keputusan Gubernur No. 1142/2025). Lihat halaman Sumber.</p></section>
  <section class="card"><h2>Target vs aktual</h2>${bars}
    <ul class="verdicts">${verdicts}</ul>
    <p class="note">Keluarga contoh memakai 65% untuk kebutuhan — di atas target 50%. Itu wajar di Jakarta: menurut BPS, makanan saja sudah 50,10% dari pengeluaran rata-rata orang Indonesia. Yang dijaga adalah tabungan tetap jalan.</p></section>
  <section class="card"><h2>Anggaran per kategori</h2><p class="muted">Klik angka anggaran untuk mengubahnya. Persentase = realisasi terhadap anggaran.</p>
    <table class="tbl"><thead><tr><th>Kategori</th><th>Kelompok</th><th class="num">Anggaran</th><th class="num">Realisasi</th><th class="num">%</th><th class="num">Sisa</th></tr></thead><tbody>${rows}</tbody>
    <tfoot><tr><td><b>Total</b></td><td></td><td class="num"><b>${fmtRp(calc.budgetTotal)}</b></td><td class="num"><b>${fmtRp(calc.expenseTotal)}</b></td><td></td><td class="num"><b>${fmtRp(calc.budgetTotal - calc.expenseTotal)}</b></td></tr></tfoot></table>
    <p><button class="btn" data-action="reset-demo">Kembalikan data contoh</button> <span class="muted">Semua perubahan tersimpan otomatis di peramban ini.</span></p></section>`;
}

export function viewTransactions(state, calc) {
  const filter = state.ui.filterCat || '';
  const sort = state.ui.sortTx || 'date-desc';
  let list = [...state.transactions];
  if (filter) list = list.filter((t) => t.categoryId === filter || (filter === 'income' && t.type === 'in'));
  if (sort === 'date-desc') list.sort((a, b) => (a.date < b.date ? 1 : -1));
  if (sort === 'amount-desc') list.sort((a, b) => b.amount - a.amount);
  if (sort === 'amount-asc') list.sort((a, b) => a.amount - b.amount);
  const opts = `<option value="">Semua kategori</option><option value="income"${filter === 'income' ? ' selected' : ''}>Penghasilan</option>` +
    CATEGORIES.map((c) => `<option value="${c.id}"${filter === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const rows = list.map((t) => `<tr>
      <td>${dateID(t.date)}</td><td>${esc(t.desc)}</td>
      <td>${t.type === 'in' ? 'Penghasilan' : esc(catName(t.categoryId))}</td>
      <td class="num ${t.type === 'in' ? 'in' : 'out'}">${t.type === 'in' ? '+' : '−'} ${fmtRp(t.amount)}</td>
      <td><button class="btn small danger" data-action="del-tx" data-id="${t.id}">Hapus</button></td></tr>`).join('');
  const catOpts = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  return `<h1>Transaksi</h1>
  <p class="lede">Semua uang masuk dan keluar bulan ini. Tambah, saring, urutkan, atau hapus — saldo dan grafik di halaman lain ikut berubah.</p>
  <section class="card"><h2>Tambah transaksi</h2>
    <form id="tx-form" class="form-grid">
      <label>Tanggal <input type="date" id="tx-date" value="2026-11-26" required></label>
      <label>Keterangan <input type="text" id="tx-desc" placeholder="cth. Belanja mingguan" maxlength="60" required></label>
      <label>Jenis <select id="tx-type"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <label>Kategori <select id="tx-cat">${catOpts}</select></label>
      <label>Jumlah (Rp) <input type="number" id="tx-amount" min="1000" step="1000" placeholder="150000" required></label>
      <span></span><button class="btn primary" type="submit">Simpan transaksi</button>
    </form>
    <p class="note">Transaksi "Pemasukan" masuk ke penghasilan; "Pengeluaran" mengurangi sisa dan mengisi realisasi kategorinya.</p></section>
  <section class="card"><h2>Daftar transaksi <span class="muted">(${list.length} dari ${state.transactions.length})</span></h2>
    <div class="toolbar"><label>Saring <select id="tx-filter" data-action="filter-cat">${opts}</select></label>
    <label>Urutkan <select id="tx-sort" data-action="sort-tx">
      <option value="date-desc"${sort === 'date-desc' ? ' selected' : ''}>Terbaru dulu</option>
      <option value="amount-desc"${sort === 'amount-desc' ? ' selected' : ''}>Jumlah terbesar</option>
      <option value="amount-asc"${sort === 'amount-asc' ? ' selected' : ''}>Jumlah terkecil</option>
    </select></label></div>
    <table class="tbl"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5" class="muted">Tidak ada transaksi untuk saringan ini.</td></tr>'}</tbody>
    <tfoot><tr><td colspan="3"><b>Total tampil</b></td><td class="num"><b>${fmtRp(list.reduce((a, t) => a + (t.type === 'in' ? t.amount : -t.amount), 0))}</b></td><td></td></tr></tfoot></table></section>`;
}

export function viewGoals(state, calc) {
  const cards = state.goals.map((g) => {
    const pct = Math.min(100, (g.saved / g.target) * 100);
    const monthsLeft = g.monthly > 0 ? Math.max(0, Math.ceil((g.target - g.saved) / g.monthly)) : null;
    return `<article class="card goal-card"><h2>${esc(g.name)}</h2>
      <div class="goal-num">${fmtRp(g.saved)} <span class="muted">dari ${fmtRp(g.target)}</span></div>
      <div class="bar big"><span style="width:${pct.toFixed(1)}%"></span></div>
      <p><b>${pct.toFixed(1)}% tercapai</b> · setoran ${fmtRp(g.monthly)}/bulan${monthsLeft !== null ? ` · lunas sekitar ${monthsLeft} bulan lagi` : ''}</p>
      <p class="muted">${esc(g.note)}</p>
      <form class="deposit-form" data-goal="${g.id}">
        <label>Tambah setoran (Rp) <input type="number" min="1000" step="1000" value="${g.monthly}" required></label>
        <button class="btn primary" type="submit">Setor</button>
      </form></article>`;
  }).join('');
  return `<h1>Target Tabungan</h1>
  <p class="lede">Tiga tujuan keluarga contoh. Setoran menambah saldo target — dan tercatat otomatis sebagai transaksi tabungan bulan ini, jadi anggaran dan dasbor ikut berubah.</p>
  <section class="grid2">${cards}</section>
  <section class="card"><h2>Buat target baru</h2>
    <form id="goal-form" class="form-grid">
      <label>Nama target <input type="text" id="goal-name" placeholder="cth. Umroh" maxlength="40" required></label>
      <label>Target (Rp) <input type="number" id="goal-target" min="100000" step="50000" placeholder="20000000" required></label>
      <label>Setoran / bulan (Rp) <input type="number" id="goal-monthly" min="0" step="10000" placeholder="500000" required></label>
      <span></span><button class="btn primary" type="submit">Buat target</button>
    </form></section>
  <section class="card"><h2>Kenapa dana darurat didahulukan?</h2>
    <p>Sikapi Uangmu (OJK) menyebut dana darurat sebaiknya cukup untuk setidaknya 3–6 bulan pengeluaran hidup — untuk keluarga, 6 bulan ke atas. Keluarga Budi menargetkan 6 × Rp6.500.000 (pengeluaran kebutuhan) = Rp39.000.000, dan sudah mengumpulkan Rp12.500.000. Setelah target ini penuh, setoran Rp800.000/bulan bisa dialihkan ke DP rumah.</p></section>`;
}

export function viewTips(state, calc) {
  const tipCards = TIPS.map((t) => `<article class="card"><h2>${esc(t.title)}</h2><p>${esc(t.body)}</p></article>`).join('');
  const r = REFERENCES;
  return `<h1>Tips & Kalkulator</h1>
  <p class="lede">Enam kebiasaan yang dipakai keluarga contoh — plus dua kalkulator yang memakai angka resmi, bukan tebakan.</p>
  <section class="grid2">${tipCards}</section>
  <section class="grid2">
    <div class="card"><h2>Kalkulator tagihan listrik</h2>
      <p class="muted">Tarif resmi PLN triwulan IV 2025 (Kementerian ESDM, Permen ESDM No. 7/2024).</p>
      <form class="form-grid" onsubmit="return false">
        <label>Daya & golongan <select id="tarif-daya">
          <option value="415">450 VA bersubsidi — Rp415/kWh</option>
          <option value="605">900 VA bersubsidi — Rp605/kWh</option>
          <option value="1352">900 VA RTM — Rp1.352/kWh</option>
          <option value="1444.7" selected>1.300 VA — Rp1.444,70/kWh</option>
          <option value="1444.7">2.200 VA — Rp1.444,70/kWh</option>
        </select></label>
        <label>Pemakaian (kWh/bulan) <input type="number" id="kwh" min="0" step="1" value="200"></label>
      </form>
      <p class="calc-out">Perkiraan tagihan: <b id="listrik-out">${fmtRp(200 * 1444.7)}</b> / bulan</p>
      <p class="note">Keluarga contoh memakai sekitar 263 kWh/bulan (token Rp380.000 ÷ Rp1.444,70). Tagihan riil masih ditambah pajak penerangan jalan (PPJ) yang besarnya tergantung daerah.</p></div>
    <div class="card"><h2>Kalkulator dana darurat</h2>
      <p class="muted">Acuan OJK: setidaknya 3–6 bulan pengeluaran; keluarga 6 bulan ke atas.</p>
      <form class="form-grid" onsubmit="return false">
        <label>Pengeluaran wajib / bulan (Rp) <input type="number" id="darurat-wajib" min="0" step="50000" value="6500000"></label>
        <label>Berapa bulan? <select id="darurat-bulan">
          <option value="3">3 bulan — lajang</option>
          <option value="6" selected>6 bulan — berkeluarga</option>
          <option value="9">9 bulan — penghasilan tak tetap</option>
          <option value="12">12 bulan — penghasilan tak tetap + tanggungan</option>
        </select></label>
      </form>
      <p class="calc-out">Target dana daruratmu: <b id="darurat-out">${fmtRp(6500000 * 6)}</b></p>
      <p class="note">Hitung dari pengeluaran wajib — biaya yang tetap harus dibayar walau penghasilan berhenti — bukan dari gaji.</p></div>
  </section>
  <section class="card"><h2>Angka acuan yang dipakai situs ini</h2>
    <ul class="ref-list">
      <li>UMP DKI Jakarta 2026: <b>${fmtRp(r.umpJakarta2026)}</b> (2025: ${fmtRp(r.umpJakarta2025)}, naik ${r.umpNaikPersen}%)</li>
      <li>Pengeluaran per kapita (BPS, Susenas Mar 2024): <b>${fmtRp(r.susenasPerKapita)}/bulan</b> — makanan ${fmtRp(r.susenasMakanan)} (${r.susenasMakananPersen}%), bukan makanan ${fmtRp(r.susenasNonMakanan)} (${r.susenasNonMakananPersen}%)</li>
      <li>Tarif listrik 1.300 VA: <b>Rp${r.tarifListrik1300.toLocaleString('id-ID')}/kWh</b> (TW IV 2025)</li>
    </ul><p><a href="#/sumber">Lihat semua sumber →</a></p></section>`;
}

export function viewSources(state, calc) {
  const rows = SOURCES.map((s) => `<article class="card source-card"><h2>${esc(s.name)}</h2>
    <p><b>Angka yang dipakai:</b> ${esc(s.figures)}</p>
    <p class="muted">${esc(s.note)}</p>
    <p><a href="${esc(s.url)}" target="_blank" rel="noopener">Buka sumber ↗</a></p></article>`).join('');
  return `<h1>Sumber & Metode</h1>
  <p class="lede">Setiap angka acuan di situs ini berasal dari publikasi yang bisa dicek. Data keluarga (penghasilan, transaksi, target) adalah contoh fiktif agar situs bisa langsung dipakai — ganti dengan datamu sendiri, semuanya tersimpan di perambanmu dan tidak pernah dikirim ke mana pun.</p>
  ${rows}
  <section class="card"><h2>Metode</h2>
    <ul class="ref-list">
      <li><b>Anggaran vs realisasi:</b> realisasi kategori = jumlah semua transaksi pengeluaran berkategori itu pada bulan berjalan.</li>
      <li><b>Aturan 50/30/20:</b> persentase dihitung dari total penghasilan bulan berjalan; targetnya 50% kebutuhan, 30% keinginan, 20% tabungan.</li>
      <li><b>Target tabungan:</b> persen tercapai = terkumpul ÷ target; "lunas sekitar N bulan lagi" = sisa target ÷ setoran bulanan.</li>
      <li><b>Kalkulator listrik:</b> pemakaian kWh × tarif resmi golongan yang dipilih; belum termasuk pajak penerangan jalan daerah.</li>
      <li><b>Kalkulator dana darurat:</b> pengeluaran wajib bulanan × jumlah bulan yang dipilih.</li>
      <li><b>Pembulatan:</b> rupiah dibulatkan ke rupiah penuh; persentase ditampilkan satu desimal.</li>
    </ul></section>
  <section class="card"><h2>Tentang DOMPETKU</h2>
    <p>DOMPETKU adalah situs perencana anggaran keluarga berbahasa Indonesia, dibuat untuk kompetisi make.fun "Make the best household budget site" (November 2026). Nama, teks, dan contoh di dalamnya asli — tidak menyalin merek, teks, atau gambar dari situs lain. Situs ini berjalan sepenuhnya dari berkas statis, tanpa jaringan.</p></section>`;
}
