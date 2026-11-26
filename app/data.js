// DOMPETKU — data: contoh anggaran keluarga + angka acuan terverifikasi.
// Semua angka acuan berasal dari sumber publik (lihat halaman Sumber).
// Data keluarga di bawah ini adalah CONTOH fiktif (Keluarga Budi, 4 orang,
// Jakarta, November 2026) agar situs langsung bisa dipakai dan diuji;
// pengguna dapat mengubah, menambah, dan menghapus semuanya — tersimpan
// di localStorage dan tidak pernah dikirim ke mana pun.

export const META = {
  brand: 'DOMPETKU',
  tagline: 'Perencana Anggaran Keluarga',
  month: 'November 2026',
  family: 'Keluarga Budi — 4 orang, Jakarta',
  currency: 'Rp',
};

// Angka acuan nasional terverifikasi (ditampilkan di halaman Tips & Sumber).
export const REFERENCES = {
  umpJakarta2026: 5729876,
  umpJakarta2025: 5396761,
  umpNaikPersen: 6.17,
  susenasPerKapita: 1500556,
  susenasMakanan: 751789,
  susenasMakananPersen: 50.10,
  susenasNonMakanan: 748767,
  susenasNonMakananPersen: 49.90,
  susenasPerumahan: 391751,
  susenasBarangJasa: 180325,
  tarifListrik1300: 1444.70,
  tarifListrik900RTM: 1352,
  tarifListrik900Subsidi: 605,
  tarifListrik450Subsidi: 415,
};

export const CATEGORIES = [
  { id: 'makanan',    name: 'Makanan & Dapur',          group: 'kebutuhan', budget: 2400000, color: '#e07856' },
  { id: 'rumah',      name: 'Tempat Tinggal',           group: 'kebutuhan', budget: 1500000, color: '#4a7fb5' },
  { id: 'listrik',    name: 'Listrik, Air & Gas',       group: 'kebutuhan', budget: 450000,  color: '#e8b93e' },
  { id: 'transport',  name: 'Transportasi',             group: 'kebutuhan', budget: 800000,  color: '#7a5fb5' },
  { id: 'pendidikan', name: 'Pendidikan Anak',          group: 'kebutuhan', budget: 700000,  color: '#3fa7a0' },
  { id: 'kesehatan',  name: 'Kesehatan',                group: 'kebutuhan', budget: 350000,  color: '#d65a7a' },
  { id: 'pulsa',      name: 'Pulsa & Internet',         group: 'kebutuhan', budget: 300000,  color: '#6b8e4e' },
  { id: 'hiburan',    name: 'Hiburan & Makan di Luar',  group: 'keinginan', budget: 600000,  color: '#e08bb0' },
  { id: 'belanja',    name: 'Belanja & Lainnya',        group: 'keinginan', budget: 400000,  color: '#9a8a6a' },
  { id: 'tabungan',   name: 'Tabungan & Dana Darurat',  group: 'tabungan',  budget: 1500000, color: '#0e7a5f' },
];

export const GROUP_LABELS = {
  kebutuhan: 'Kebutuhan',
  keinginan: 'Keinginan',
  tabungan: 'Tabungan',
};

// Aturan 50/30/20 — target atas penghasilan bersih.
export const RULE_503020 = { kebutuhan: 50, keinginan: 30, tabungan: 20 };

export const INCOME_SOURCES = [
  { label: 'Gaji Ayah', amount: 5730000, note: 'setara UMP DKI Jakarta 2026' },
  { label: 'Gaji Ibu', amount: 4270000, note: 'guru honorer, paruh waktu' },
];

// Transaksi contoh November 2026. Jumlah per kategori (realisasi):
// makanan 2.150.000; rumah 1.500.000; listrik 520.000; transport 760.000;
// pendidikan 700.000; kesehatan 280.000; pulsa 300.000; hiburan 640.000;
// belanja 380.000; tabungan 1.500.000. Total keluar 8.730.000 dari
// penghasilan 10.000.000 — sisa 1.270.000.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', desc: 'Gaji Ayah', categoryId: null, type: 'in', amount: 5730000 },
  { id: 't02', date: '2026-11-01', desc: 'Gaji Ibu', categoryId: null, type: 'in', amount: 4270000 },
  { id: 't03', date: '2026-11-01', desc: 'Setor dana darurat', categoryId: 'tabungan', type: 'out', amount: 800000 },
  { id: 't04', date: '2026-11-01', desc: 'Setor DP rumah', categoryId: 'tabungan', type: 'out', amount: 500000 },
  { id: 't05', date: '2026-11-01', desc: 'Setor dana pendidikan', categoryId: 'tabungan', type: 'out', amount: 200000 },
  { id: 't06', date: '2026-11-02', desc: 'Belanja mingguan pasar', categoryId: 'makanan', type: 'out', amount: 385000 },
  { id: 't07', date: '2026-11-03', desc: 'Token listrik', categoryId: 'listrik', type: 'out', amount: 200000 },
  { id: 't08', date: '2026-11-04', desc: 'Bensin motor', categoryId: 'transport', type: 'out', amount: 50000 },
  { id: 't09', date: '2026-11-05', desc: 'SPP anak pertama', categoryId: 'pendidikan', type: 'out', amount: 350000 },
  { id: 't10', date: '2026-11-05', desc: 'SPP anak kedua', categoryId: 'pendidikan', type: 'out', amount: 250000 },
  { id: 't11', date: '2026-11-06', desc: 'Bensin mobil', categoryId: 'transport', type: 'out', amount: 300000 },
  { id: 't12', date: '2026-11-07', desc: 'Belanja supermarket', categoryId: 'makanan', type: 'out', amount: 420000 },
  { id: 't13', date: '2026-11-08', desc: 'Iuran BPJS keluarga', categoryId: 'kesehatan', type: 'out', amount: 105000 },
  { id: 't14', date: '2026-11-09', desc: 'Makan di luar keluarga', categoryId: 'hiburan', type: 'out', amount: 180000 },
  { id: 't15', date: '2026-11-10', desc: 'Bayar kontrakan', categoryId: 'rumah', type: 'out', amount: 1500000 },
  { id: 't16', date: '2026-11-11', desc: 'Parkir & tol', categoryId: 'transport', type: 'out', amount: 85000 },
  { id: 't17', date: '2026-11-12', desc: 'Paket internet rumah', categoryId: 'pulsa', type: 'out', amount: 150000 },
  { id: 't18', date: '2026-11-13', desc: 'Ojek online', categoryId: 'transport', type: 'out', amount: 75000 },
  { id: 't19', date: '2026-11-14', desc: 'Belanja mingguan', categoryId: 'makanan', type: 'out', amount: 390000 },
  { id: 't20', date: '2026-11-15', desc: 'Pulsa & paket data', categoryId: 'pulsa', type: 'out', amount: 150000 },
  { id: 't21', date: '2026-11-16', desc: 'Token listrik', categoryId: 'listrik', type: 'out', amount: 180000 },
  { id: 't22', date: '2026-11-17', desc: 'Nonton bioskop', categoryId: 'hiburan', type: 'out', amount: 160000 },
  { id: 't23', date: '2026-11-18', desc: 'Belanja bulanan beras & minyak', categoryId: 'makanan', type: 'out', amount: 555000 },
  { id: 't24', date: '2026-11-19', desc: 'Bensin mobil', categoryId: 'transport', type: 'out', amount: 250000 },
  { id: 't25', date: '2026-11-19', desc: 'Peralatan dapur', categoryId: 'belanja', type: 'out', amount: 150000 },
  { id: 't26', date: '2026-11-20', desc: 'Air PDAM', categoryId: 'listrik', type: 'out', amount: 140000 },
  { id: 't27', date: '2026-11-21', desc: 'Buku & alat tulis', categoryId: 'pendidikan', type: 'out', amount: 100000 },
  { id: 't28', date: '2026-11-22', desc: 'Obat & vitamin', categoryId: 'kesehatan', type: 'out', amount: 175000 },
  { id: 't29', date: '2026-11-23', desc: 'Jajan akhir pekan', categoryId: 'hiburan', type: 'out', amount: 140000 },
  { id: 't30', date: '2026-11-24', desc: 'Belanja mingguan', categoryId: 'makanan', type: 'out', amount: 400000 },
  { id: 't31', date: '2026-11-25', desc: 'Langganan streaming', categoryId: 'hiburan', type: 'out', amount: 160000 },
  { id: 't32', date: '2026-11-26', desc: 'Baju anak', categoryId: 'belanja', type: 'out', amount: 230000 },
];

// Target tabungan. Dana darurat: 6 x Rp6.500.000 pengeluaran kebutuhan
// (acuan OJK: 3-6 bulan pengeluaran; keluarga mengambil 6 bulan).
// Setoran bulanan 800.000 + 500.000 + 200.000 = 1.500.000,
// sama dengan anggaran kategori Tabungan.
export const GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 39000000, saved: 12500000, monthly: 800000, note: '6 bulan pengeluaran kebutuhan (Rp6.500.000 x 6) — acuan OJK' },
  { id: 'g2', name: 'DP Rumah', target: 50000000, saved: 8000000, monthly: 500000, note: 'Uang muka rumah subsidi, target 2 tahun lagi' },
  { id: 'g3', name: 'Dana Pendidikan Anak', target: 25000000, saved: 4250000, monthly: 200000, note: 'Biaya masuk sekolah lanjutan anak pertama' },
];

export const TIPS = [
  {
    title: 'Bayar dirimu dulu',
    body: 'Sisihkan tabungan di hari gajian, sebelum uang dipakai untuk hal lain. Keluarga Budi menyetor Rp1.500.000 setiap tanggal 1 — 15% dari penghasilan Rp10.000.000 — dan dana daruratnya sudah 32% dari target.',
  },
  {
    title: 'Makanan memang pos terbesar',
    body: 'Menurut BPS (Susenas Maret 2024), rata-rata orang Indonesia membelanjakan Rp751.789 per bulan untuk makanan — 50,10% dari total pengeluaran per kapita Rp1.500.556. Wajar kalau pos dapur terasa berat; yang dijaga adalah porsinya terhadap penghasilanmu, bukan membandingkannya dengan keluarga lain.',
  },
  {
    title: 'Kebutuhan di atas 50% itu normal di kota besar',
    body: 'Aturan 50/30/20 adalah target, bukan vonis. Keluarga contoh ini memakai 65% penghasilannya untuk kebutuhan — wajar untuk Jakarta, di mana sewa dan makan mahal. Yang penting: kebutuhan terkendali, tabungan jalan, dan keinginan ditekan, bukan dihilangkan.',
  },
  {
    title: 'Dana darurat 3-6 bulan pengeluaran',
    body: 'Sikapi Uangmu (OJK) menyebut dana darurat sebaiknya cukup untuk setidaknya 3-6 bulan pengeluaran hidup; untuk yang sudah berkeluarga, 6 bulan ke atas. Hitung dari pengeluaran wajibmu, bukan dari gaji — pakai kalkulator di bawah.',
  },
  {
    title: 'Tagihan listrik bisa dihitung sendiri',
    body: 'Tarif PLN triwulan IV 2025 untuk rumah tangga 1.300 VA adalah Rp1.444,70 per kWh (Kementerian ESDM). Kalikan pemakaian kWh-mu dengan tarif dayamu — kalkulator di bawah sudah memakai tarif resmi ini.',
  },
  {
    title: 'Satu kebocoran kecil, sebulan terasa',
    body: 'Langganan streaming Rp160.000, jajan akhir pekan Rp140.000, makan di luar Rp180.000 — sendiri-sendiri kecil, bersama-sama Rp480.000 sebulan. Cek halaman Transaksi dan urutkan dari yang terbesar: kebocoran selalu terlihat di sana.',
  },
];

export const SOURCES = [
  {
    name: 'Badan Pusat Statistik — Indikator Kesejahteraan Rakyat 2024 / Susenas Maret 2024',
    url: 'https://data.goodstats.id/statistic/simak-komposisi-pengeluaran-masyarakat-indonesia-2024-nUPWs',
    figures: 'Pengeluaran per kapita Rp1.500.556/bulan; makanan Rp751.789 (50,10%); bukan makanan Rp748.767 (49,90%); perumahan & fasilitas rumah tangga Rp391.751; barang & jasa Rp180.325.',
    note: 'Angka BPS dikutip dari laporan Indikator Kesejahteraan Rakyat 2024; tautan mengarah ke ringkasan GoodStats atas laporan tersebut.',
  },
  {
    name: 'Pemerintah Provinsi DKI Jakarta — Keputusan Gubernur No. 1142 Tahun 2025 tentang UMP 2026',
    url: 'https://www.beritajakarta.id/read/149722/naik-617-persen-ump-dki-jakarta-2026-ditetapkan-rp5729876',
    figures: 'UMP DKI Jakarta 2026 Rp5.729.876/bulan, naik 6,17% dari Rp5.396.761 (2025); alfa 0,75; berlaku 1 Januari 2026 (PP No. 49/2025).',
    note: 'Diumumkan Gubernur Pramono Anung, 24 Desember 2025.',
  },
  {
    name: 'Kementerian ESDM — Tarif Tenaga Listrik Triwulan IV 2025 (Permen ESDM No. 7/2024)',
    url: 'https://listrikindonesia.com/detail/17977/pemerintah-umumkan-tarif-listrik-triwulan-iv-2025-ini-daftar-harganya',
    figures: 'R-1/TR 1.300 VA Rp1.444,70/kWh; 900 VA RTM Rp1.352/kWh; 900 VA subsidi Rp605/kWh; 450 VA Rp415/kWh. Berlaku Oktober-Desember 2025, tanpa kenaikan.',
    note: 'Dipakai pada kalkulator listrik di halaman Tips.',
  },
  {
    name: 'Otoritas Jasa Keuangan — Sikapi Uangmu (edukasi perencanaan keuangan)',
    url: 'https://sikapiuangmu.ojk.go.id/',
    figures: 'Dana darurat sebaiknya cukup untuk setidaknya 3-6 bulan pengeluaran hidup; untuk yang sudah berkeluarga, 6 bulan ke atas.',
    note: 'Acuan target Dana Darurat pada halaman Target Tabungan.',
  },
  {
    name: 'Aturan 50/30/20 — Elizabeth Warren & Amelia Warren Tyagi, "All Your Worth" (2005)',
    url: 'https://en.wikipedia.org/wiki/50/30/20_rule',
    figures: 'Kebutuhan 50%, keinginan 30%, tabungan & pelunasan utang 20% dari penghasilan bersih.',
    note: 'Aturan populer yang dipakai perencana halaman Anggaran; dipakai sebagai target, bukan kewajiban.',
  },
];
