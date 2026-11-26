// Data acuan dan data contoh untuk KantongKeluarga.
//
// Angka acuan (bagian BENCHMARKS) adalah angka resmi yang diterbitkan dan
// sudah diverifikasi sebelum dipakai di situs ini; sumber dan tahunnya
// ditampilkan di halaman "Data Acuan". Data rumah tangga contoh
// (Keluarga Sari) adalah data fiktif yang dibuat konsisten dengan angka
// acuan tersebut dan selalu diberi label "contoh".

export const CATEGORIES = [
  { id: 'makanan', label: 'Makanan', color: '#2e7d5b', group: 'kebutuhan' },
  { id: 'perumahan', label: 'Perumahan', color: '#1f6f8b', group: 'kebutuhan' },
  { id: 'transportasi', label: 'Transportasi', color: '#c98a1b', group: 'kebutuhan' },
  { id: 'pendidikan', label: 'Pendidikan', color: '#6a4fa3', group: 'kebutuhan' },
  { id: 'kesehatan', label: 'Kesehatan', color: '#b4455a', group: 'kebutuhan' },
  { id: 'tagihan', label: 'Tagihan & Langganan', color: '#4a7a96', group: 'kebutuhan' },
  { id: 'hiburan', label: 'Hiburan & Gaya Hidup', color: '#d2691e', group: 'keinginan' },
  { id: 'lainnya', label: 'Lainnya', color: '#7a7a72', group: 'keinginan' },
];

export const MONTH = 'November 2026';
export const MONTH_KEY = '2026-11';

// Pendapatan bulanan rumah tangga contoh: dua pencari nafkah di Jakarta.
export const MONTHLY_INCOME = 9800000;

export const BUDGETS = {
  makanan: 2600000,
  perumahan: 2000000,
  transportasi: 900000,
  pendidikan: 750000,
  kesehatan: 400000,
  tagihan: 700000,
  hiburan: 500000,
  lainnya: 500000,
};

// Transaksi contoh bulan November 2026. Jumlah per kategori sengaja
// dijumlahkan agar sama dengan ringkasan di dasbor.
export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', desc: 'Sewa rumah bulan November', category: 'perumahan', amount: 1500000, type: 'belanja' },
  { id: 't02', date: '2026-11-02', desc: 'Belanja pasar pagi', category: 'makanan', amount: 450000, type: 'belanja' },
  { id: 't03', date: '2026-11-03', desc: 'Bensin motor', category: 'transportasi', amount: 300000, type: 'belanja' },
  { id: 't04', date: '2026-11-05', desc: 'SPP anak', category: 'pendidikan', amount: 500000, type: 'belanja' },
  { id: 't05', date: '2026-11-06', desc: 'Makan siang keluarga', category: 'makanan', amount: 260000, type: 'belanja' },
  { id: 't06', date: '2026-11-08', desc: 'Belanja mingguan supermarket', category: 'makanan', amount: 620000, type: 'belanja' },
  { id: 't07', date: '2026-11-09', desc: 'Pulsa & paket data', category: 'tagihan', amount: 150000, type: 'belanja' },
  { id: 't08', date: '2026-11-10', desc: 'Listrik PLN', category: 'perumahan', amount: 240000, type: 'belanja' },
  { id: 't09', date: '2026-11-11', desc: 'Ojek online', category: 'transportasi', amount: 120000, type: 'belanja' },
  { id: 't10', date: '2026-11-12', desc: 'Air PDAM', category: 'perumahan', amount: 160000, type: 'belanja' },
  { id: 't11', date: '2026-11-13', desc: 'Obat & vitamin', category: 'kesehatan', amount: 150000, type: 'belanja' },
  { id: 't12', date: '2026-11-14', desc: 'Langganan streaming', category: 'hiburan', amount: 150000, type: 'belanja' },
  { id: 't13', date: '2026-11-15', desc: 'Belanja pasar pagi', category: 'makanan', amount: 380000, type: 'belanja' },
  { id: 't14', date: '2026-11-15', desc: 'Internet rumah', category: 'tagihan', amount: 350000, type: 'belanja' },
  { id: 't15', date: '2026-11-16', desc: 'Buku & alat tulis anak', category: 'pendidikan', amount: 200000, type: 'belanja' },
  { id: 't16', date: '2026-11-17', desc: 'Bensin motor', category: 'transportasi', amount: 250000, type: 'belanja' },
  { id: 't17', date: '2026-11-18', desc: 'Nonton bioskop keluarga', category: 'hiburan', amount: 250000, type: 'belanja' },
  { id: 't18', date: '2026-11-19', desc: 'Iuran RT & kebersihan', category: 'tagihan', amount: 150000, type: 'belanja' },
  { id: 't19', date: '2026-11-20', desc: 'Periksa gigi', category: 'kesehatan', amount: 200000, type: 'belanja' },
  { id: 't20', date: '2026-11-21', desc: 'Pakaian anak', category: 'lainnya', amount: 400000, type: 'belanja' },
  { id: 't21', date: '2026-11-22', desc: 'Belanja mingguan supermarket', category: 'makanan', amount: 540000, type: 'belanja' },
  { id: 't22', date: '2026-11-23', desc: 'Parkir & tol', category: 'transportasi', amount: 180000, type: 'belanja' },
  { id: 't23', date: '2026-11-24', desc: 'Mainan edukasi anak', category: 'hiburan', amount: 200000, type: 'belanja' },
  { id: 't24', date: '2026-11-25', desc: 'Perbaikan keran dapur', category: 'lainnya', amount: 250000, type: 'belanja' },
  { id: 't25', date: '2026-11-26', desc: 'Jajan sore', category: 'makanan', amount: 200000, type: 'belanja' },
  { id: 't26', date: '2026-11-26', desc: 'Gaji bulan November (Ayah)', category: 'pemasukan', amount: 5729876, type: 'pemasukan' },
  { id: 't27', date: '2026-11-26', desc: 'Penghasilan tambahan (Ibu)', category: 'pemasukan', amount: 4070124, type: 'pemasukan' },
];

export const SEED_BILLS = [
  { id: 'b1', name: 'Sewa rumah', amount: 1500000, dueDay: 1, paid: true },
  { id: 'b2', name: 'SPP anak', amount: 500000, dueDay: 5, paid: true },
  { id: 'b3', name: 'Listrik PLN', amount: 240000, dueDay: 10, paid: true },
  { id: 'b4', name: 'Air PDAM', amount: 160000, dueDay: 12, paid: true },
  { id: 'b5', name: 'Internet rumah', amount: 350000, dueDay: 15, paid: true },
  { id: 'b6', name: 'Langganan streaming', amount: 150000, dueDay: 18, paid: false },
  { id: 'b7', name: 'BPJS Kesehatan', amount: 150000, dueDay: 20, paid: false },
  { id: 'b8', name: 'Iuran RT & kebersihan', amount: 150000, dueDay: 28, paid: false },
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Dana darurat', target: 15000000, saved: 6200000, note: 'Setara 2 bulan pengeluaran' },
  { id: 'g2', name: 'Liburan keluarga', target: 5000000, saved: 3400000, note: 'Liburan akhir tahun' },
  { id: 'g3', name: 'DP motor baru', target: 8000000, saved: 2100000, note: 'Ganti motor lama' },
  { id: 'g4', name: 'Pendidikan anak', target: 10000000, saved: 4800000, note: 'Tabungan sekolah tahun depan' },
];

// Tren bulanan contoh (Juni–November 2026) untuk halaman Laporan.
export const MONTHLY_TREND = [
  { month: 'Jun 2026', income: 9800000, spending: 7950000 },
  { month: 'Jul 2026', income: 9800000, spending: 8300000 },
  { month: 'Agu 2026', income: 9800000, spending: 8050000 },
  { month: 'Sep 2026', income: 9800000, spending: 8600000 },
  { month: 'Okt 2026', income: 9800000, spending: 8200000 },
  { month: 'Nov 2026', income: 9800000, spending: 8150000 },
];

// Angka acuan resmi — ditampilkan apa adanya beserta sumber dan tahun.
export const BENCHMARKS = {
  susenas: {
    title: 'Pengeluaran penduduk Indonesia (BPS, Susenas 2024)',
    source: 'BPS — Indikator Kesejahteraan Rakyat 2024 / Pengeluaran untuk Konsumsi Penduduk Indonesia, Maret 2024 (Susenas)',
    rows: [
      { label: 'Rata-rata pengeluaran per kapita per bulan', value: 1500556 },
      { label: 'Untuk makanan (50,10%)', value: 751789 },
      { label: 'Untuk bukan makanan (49,90%)', value: 748767 },
      { label: 'Perumahan & fasilitas rumah tangga', value: 391751 },
      { label: 'Barang & jasa', value: 180325 },
      { label: 'Pesta & upacara (terendah)', value: 28326 },
    ],
  },
  ump: {
    title: 'Upah Minimum Provinsi 2026 (Kemnaker / Keputusan Gubernur)',
    source: 'Kementerian Ketenagakerjaan, daftar UMP 2026; UMP DKI Jakarta ditetapkan lewat Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025',
    rows: [
      { label: 'DKI Jakarta (tertinggi)', value: 5729876, note: 'naik 6,17% dari Rp5.396.761 pada 2025' },
      { label: 'Papua Pegunungan', value: 4508714 },
      { label: 'Bali', value: 3207459 },
      { label: 'Jawa Tengah', value: 2327386 },
      { label: 'Jawa Barat (terendah)', value: 2317601 },
    ],
  },
  poverty: {
    title: 'Garis kemiskinan (BPS, Susenas)',
    source: 'BPS — Profil Kemiskinan di Indonesia, September 2024',
    rows: [
      { label: 'Garis kemiskinan per kapita per bulan (Sep 2024)', value: 595242 },
      { label: 'Garis kemiskinan per rumah tangga miskin per bulan', value: 2803590, note: 'rata-rata 4,71 anggota rumah tangga' },
    ],
  },
  householdSize: {
    title: 'Ukuran rumah tangga',
    source: 'BPS, dihimpun Sekretariat ASEAN — State of ASEAN Families Report 2026',
    rows: [
      { label: 'Rata-rata anggota rumah tangga Indonesia (2022)', value: 3.9, unit: 'orang' },
    ],
  },
};
