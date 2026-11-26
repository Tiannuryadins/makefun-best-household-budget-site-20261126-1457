// Capture DOMPETKU screenshots + interaction tests in headless Chrome via
// playwright-core (from the npx cache, as previous entries did). Run from the
// repo root. Serves app/ on 127.0.0.1:8081 — start `node serve.ts --port 8081` first.
const { chromium } = require('/home/hatch/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const { join, resolve } = require('node:path');
const { statSync, readFileSync } = require('node:fs');

const here = resolve(__dirname);
const BASE = 'http://127.0.0.1:8081';
const shots = JSON.parse(readFileSync(join(here, 'shots.json'), 'utf8'));

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hatch/cft-dl/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
  });
  const errors = [];
  const externalRequests = [];
  const track = (page, label) => {
    page.on('pageerror', (e) => errors.push(`pageerror ${label}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console ${label}: ${m.text()}`); });
    page.on('request', (r) => {
      const u = r.url();
      if (!u.startsWith(BASE) && !u.startsWith('data:')) externalRequests.push(`${label}: ${u}`);
    });
  };

  // --- Screenshots ---
  for (const shot of shots) {
    const page = await browser.newPage({ viewport: shot.viewport, deviceScaleFactor: 1 });
    track(page, shot.file);
    await page.goto(`${BASE}/${shot.path}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
    await page.waitForTimeout(300);
    const out = join(here, 'screenshots', shot.file);
    await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
    const size = statSync(out).size;
    console.log('SHOT_OK', shot.file, `${size} bytes`, size <= 262144 ? 'UNDER_256K' : 'OVER_256K!');
    await page.close();
  }

  // --- Interaction tests on a desktop page ---
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  track(page, 'interact');
  await page.goto(`${BASE}/#/`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  const t = async (name, fn) => { try { console.log('TEST', name, JSON.stringify(await fn())); } catch (e) { errors.push(`test ${name}: ${e.message}`); } };

  await t('dashboard-kpis', () => page.evaluate(() => document.querySelectorAll('.kpi').length));
  await t('dashboard-donut', () => page.evaluate(() => document.querySelectorAll('svg.donut path').length));
  await t('dashboard-remaining', () => page.evaluate(() => document.querySelector('.hero-card-num').textContent));

  await page.goto(`${BASE}/#/transaksi`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  await t('add-transaction', () => page.evaluate(() => {
    document.getElementById('tx-desc').value = 'Tes belanja';
    document.getElementById('tx-amount').value = '75000';
    document.getElementById('tx-cat').value = 'makanan';
    document.querySelector('#tx-form button[type="submit"]').click();
    return document.querySelectorAll('tbody tr').length;
  }));
  await t('added-row-visible', () => page.evaluate(() => document.body.innerText.includes('Tes belanja')));
  await t('delete-added-transaction', () => page.evaluate(() => {
    const rows = [...document.querySelectorAll('tbody tr')];
    const row = rows.find((r) => r.textContent.includes('Tes belanja'));
    if (!row) return 'NOT_FOUND';
    row.querySelector('[data-action="del-tx"]').click();
    return document.body.innerText.includes('Tes belanja') ? 'STILL_THERE' : 'DELETED';
  }));

  await page.goto(`${BASE}/#/anggaran`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  await t('budget-change-income', () => page.evaluate(() => {
    const input = document.querySelector('[data-action="edit-income"]');
    input.value = '11000000';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return document.querySelector('tfoot td.num b').textContent;
  }));
  await t('budget-split-bars', () => page.evaluate(() => document.querySelectorAll('svg.split rect').length));
  await t('budget-inputs', () => page.evaluate(() => document.querySelectorAll('.budget-input').length));

  await page.goto(`${BASE}/#/target`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  await t('goal-deposit', () => page.evaluate(() => {
    const before = document.querySelector('.goal-card .goal-num').textContent;
    const form = document.querySelector('.deposit-form');
    form.querySelector('input').value = '100000';
    form.querySelector('button[type="submit"]').click();
    const after = document.querySelector('.goal-card .goal-num').textContent;
    return { before, after };
  }));

  await page.goto(`${BASE}/#/tips`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  await t('listrik-calculator', () => page.evaluate(() => {
    const kwh = document.getElementById('kwh');
    kwh.value = '100';
    kwh.dispatchEvent(new Event('input', { bubbles: true }));
    return document.getElementById('listrik-out').textContent;
  }));
  await t('darurat-calculator', () => page.evaluate(() => {
    const w = document.getElementById('darurat-wajib');
    w.value = '5000000';
    w.dispatchEvent(new Event('input', { bubbles: true }));
    return document.getElementById('darurat-out').textContent;
  }));

  await t('theme-toggle', () => page.evaluate(() => {
    document.getElementById('theme-toggle').click();
    return document.documentElement.getAttribute('data-theme');
  }));
  await t('all-nav-routes', () => page.evaluate(async () => {
    const routes = ['#/anggaran', '#/transaksi', '#/target', '#/tips', '#/sumber'];
    const out = [];
    for (const r of routes) {
      location.hash = r;
      await new Promise((res) => setTimeout(res, 200));
      out.push(`${r}:${document.querySelector('h1') ? document.querySelector('h1').textContent : 'NO H1'}`);
    }
    return out;
  }));
  await page.close();

  await browser.close();
  console.log('EXTERNAL_REQUESTS:', externalRequests.length === 0 ? 'NONE' : JSON.stringify(externalRequests, null, 2));
  console.log('JS_ERRORS:', errors.length === 0 ? 'NONE' : JSON.stringify(errors, null, 2));
  if (errors.length || externalRequests.length) process.exit(1);
  console.log('ALL_OK');
})().catch((e) => { console.error('DRIVER_FAIL', e.message); process.exit(1); });
