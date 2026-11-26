[![best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/tiannuryadins/makefun-best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/tiannuryadins/makefun-best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# DOMPETKU — Perencana Anggaran Keluarga

Entry for [best-household-budget-site-20261126-1457](https://make.fun/bounty/best-household-budget-site-20261126-1457): an original, working household-budget site for an Indonesian family that runs fully offline in a desktop or phone browser from its own static files — no network request, no build step.

## What it is

A budget planner for a fictional example family (Keluarga Budi, 4 people, Jakarta, November 2026 — Rp10.000.000/month income) that the user can fully edit. Six sections, every one reached by a link in the header:

- **Dasbor** — remaining balance, 4 KPI cards, donut chart of spending by category, budget-vs-actual bars, recent transactions, savings-goal progress
- **Anggaran** — the 50/30/20 rule planner: editable income sources and per-category budgets, target-vs-actual bars, per-category verdicts
- **Transaksi** — add / filter / sort / delete transactions; running totals; every change updates the dashboard, budget, and goals
- **Target Tabungan** — savings goals with progress bars (Dana Darurat, DP Rumah, Dana Pendidikan Anak); deposits add to the goal and log a transaction; create new goals
- **Tips & Kalkulator** — six budgeting tips plus two working calculators: PLN electricity bill (official Q4 2025 tariffs) and emergency-fund target (OJK guidance)
- **Sumber** — every reference figure named with its published source and method notes

Every control does what it says: adding a transaction updates totals, editing a budget re-computes the 50/30/20 split, deposits move goal progress, both calculators compute live, and the light/dark theme toggle works and is remembered. Data persists in localStorage and is never sent anywhere.

## Every reference figure is real

All anchor figures are published statistics, each labelled with its year and source on the page where it appears:

- **BPS — Statistics Indonesia (Susenas, March 2024)**: average per-capita expenditure Rp1.500.556/month; food Rp751.789 (50,10%); non-food Rp748.767 (49,90%)
- **DKI Jakarta UMP 2026**: Rp5.729.876/month, up 6,17% from Rp5.396.761 (Governor Decree No. 1142/2025)
- **Ministry of Energy and Mineral Resources — PLN tariffs Q4 2025**: 1.300 VA Rp1.444,70/kWh; 900 VA RTM Rp1.352/kWh; 900 VA subsidised Rp605/kWh; 450 VA Rp415/kWh
- **OJK — Sikapi Uangmu**: emergency fund of at least 3–6 months of expenses; 6+ months for families
- **50/30/20 rule**: needs 50%, wants 30%, savings 20% (Elizabeth Warren & Amelia Warren Tyagi, "All Your Worth", 2005)

The family itself is a labelled fictional example — no real person's data. Nothing is invented, estimated by this site, or fetched from the network.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Open http://localhost:8080 in desktop Chrome or on a phone. Or open `app/index.html` directly — it works from the file system too.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts` (the kit's copy, unchanged).

## License

MIT — see [LICENSE](LICENSE).
