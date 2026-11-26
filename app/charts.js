// DOMPETKU — charts.js: hand-rolled SVG charts, no libraries, no network.
// donutChart(items, size): items = [{label, value, color}]
// hbarChart(rows, max): rows = [{label, value, budget, color}] — anggaran vs realisasi
// splitBars(groups): [{label, target, actual, color}] — target vs aktual 50/30/20

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function fmtRp(n) {
  const v = Math.round(n);
  return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function fmtShort(n) {
  if (n >= 1000000) return 'Rp' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' jt';
  if (n >= 1000) return 'Rp' + Math.round(n / 1000) + ' rb';
  return fmtRp(n);
}

export function donutChart(items, size = 260) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  let angle = -Math.PI / 2;
  let paths = '';
  for (const it of items) {
    if (it.value <= 0) continue;
    const frac = it.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${it.color}"><title>${esc(it.label)}: ${fmtRp(it.value)} (${(frac * 100).toFixed(1)}%)</title></path>`;
  }
  return `<svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="Diagram donat pengeluaran per kategori">${paths}<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-center-num">${fmtShort(total)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-center-label">total belanja</text></svg>`;
}

export function hbarChart(rows, width = 640) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.value, r.budget || 0)));
  const rowH = 44;
  const height = rows.length * rowH + 8;
  let out = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const wVal = (r.value / max) * (width - 210);
    const wBud = ((r.budget || 0) / max) * (width - 210);
    const over = r.value > (r.budget || 0);
    out += `<g>
      <text x="0" y="${y + 13}" class="hbar-label">${esc(r.label)}</text>
      <text x="0" y="${y + 30}" class="hbar-sub">${fmtRp(r.value)} dari ${fmtRp(r.budget || 0)}</text>
      <rect x="205" y="${y + 2}" width="${Math.max(2, wBud).toFixed(1)}" height="12" rx="3" class="hbar-budget" />
      <rect x="205" y="${y + 18}" width="${Math.max(2, wVal).toFixed(1)}" height="12" rx="3" fill="${r.color}" />
      ${over ? `<text x="${(205 + wVal + 6).toFixed(1)}" y="${y + 29}" class="hbar-over">lebih ${fmtShort(r.value - (r.budget || 0))}</text>` : ''}
    </g>`;
  });
  return `<svg class="hbar" viewBox="0 0 ${width} ${height}" role="img" aria-label="Anggaran dibanding realisasi per kategori">${out}</svg>`;
}

export function splitBars(groups) {
  // groups: [{label, targetPct, actualPct, color, targetRp, actualRp}]
  let out = '';
  groups.forEach((g, i) => {
    const y = 16 + i * 78;
    const wT = Math.max(2, (g.targetPct / 100) * 420);
    const wA = Math.max(2, (g.actualPct / 100) * 420);
    out += `<g>
      <text x="0" y="${y}" class="split-label">${esc(g.label)}</text>
      <text x="470" y="${y}" class="split-pct">${g.actualPct.toFixed(1)}% aktual / ${g.targetPct}% target</text>
      <rect x="0" y="${y + 8}" width="${wT.toFixed(1)}" height="12" rx="3" class="split-target" />
      <rect x="0" y="${y + 24}" width="${wA.toFixed(1)}" height="12" rx="3" fill="${g.color}" />
      <text x="0" y="${y + 58}" class="split-sub">Target ${fmtRp(g.targetRp)} — aktual ${fmtRp(g.actualRp)}</text>
    </g>`;
  });
  const height = groups.length * 78 + 12;
  return `<svg class="split" viewBox="0 0 640 ${height}" role="img" aria-label="Target 50/30/20 dibanding aktual">${out}</svg>`;
}
