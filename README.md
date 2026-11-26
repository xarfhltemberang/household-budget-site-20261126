[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/xarfhltemberang/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/xarfhltemberang/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# KantongKeluarga — Anggaran Rumah Tangga

Situs anggaran rumah tangga statis berbahasa Indonesia yang berjalan luring
dari berkasnya sendiri, di desktop maupun di ponsel. Tanpa langkah build,
tanpa permintaan jaringan, tanpa pustaka eksternal: semua grafik digambar
tangan sebagai SVG dan semua data tersimpan di peramban pengguna
(localStorage).

## Yang bisa dilakukan

- **Ringkasan** (`#/`): pemasukan vs belanja bulan berjalan, sisa uang,
  tingkat tabungan, donat belanja per kategori, aturan 50/30/20, tagihan
  berikutnya, dan transaksi terbaru.
- **Anggaran** (`#/anggaran`): atur anggaran tiap kategori dan bandingkan
  dengan belanja nyata (bilah kemajuan + status lewat/sisa), plus kalkulator
  50/30/20 dari pemasukan berapa pun.
- **Transaksi** (`#/transaksi`): tambah, ubah, dan hapus pemasukan/belanja;
  saring menurut kategori dan jenis; total diperbarui langsung di semua
  halaman.
- **Tagihan** (`#/tagihan`): tagihan rutin dengan tanggal jatuh tempo dan
  centang lunas/belum; tambah tagihan baru.
- **Tabungan** (`#/tabungan`): target tabungan dengan kemajuan dan setoran;
  buat target baru.
- **Laporan** (`#/laporan`): tren pemasukan vs belanja enam bulan (grafik
  garis), belanja vs anggaran per kategori (grafik batang), dan wawasan yang
  dihitung dari angka.
- **Data Acuan** (`#/patokan`): angka resmi yang dipakai sebagai patokan di
  seluruh situs, beserta sumber dan tahunnya.

## Data contoh dan angka acuan

Situs ini dimuat dengan **Keluarga Sari (contoh)** — rumah tangga 4 anggota
di Jakarta, pemasukan Rp9.800.000/bulan, belanja Rp8.150.000 pada November
2026. Semua angka contoh diberi label contoh dan konsisten satu sama lain.

Angka acuannya nyata dan terverifikasi, masing-masing dengan sumber di
halaman Data Acuan:

- **BPS, Susenas 2024** (Indikator Kesejahteraan Rakyat 2024): rata-rata
  pengeluaran per kapita Rp1.500.556/bulan — makanan Rp751.789 (50,10%),
  bukan makanan Rp748.767 (49,90%); perumahan & fasilitas rumah tangga
  Rp391.751; barang & jasa Rp180.325.
- **Kemnaker / Keputusan Gubernur DKI Jakarta No. 1142/2025**: UMP DKI
  Jakarta 2026 Rp5.729.876/bulan (naik 6,17% dari Rp5.396.761 pada 2025);
  UMP terendah Jawa Barat Rp2.317.601.
- **BPS, September 2024**: garis kemiskinan Rp595.242 per kapita/bulan;
  Rp2.803.590 per rumah tangga miskin/bulan (rata-rata 4,71 anggota).
- **BPS via Sekretariat ASEAN, State of ASEAN Families Report 2026**:
  rata-rata 3,9 anggota per rumah tangga Indonesia (2022).

## Menjalankan

```sh
node serve.ts            # http://localhost:8080
```

## Menyerahkan (program)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, pustaka standar saja) menyalin `app/` dan
`screenshots/` ke direktori keluaran dan menulis `dossier.json` dengan
`vendor/makefun-frontend.ts`.

## Struktur

- `app/index.html` — satu halaman, rute hash
- `app/main.js` — router dan pengikat kejadian
- `app/data.js` — kategori, data contoh, dan angka acuan
- `app/store.js` — penyimpanan localStorage dan hitungan turunan
- `app/charts.js` — grafik SVG (donat, batang, garis)
- `app/views.js` — kerangka bersama, Ringkasan, Anggaran
- `app/views-tools.js` — Transaksi, Tagihan, Tabungan
- `app/views-reports.js` — Laporan, Data Acuan
- `app/format.js` — format rupiah dan tanggal (Intl)
- `app/style.css` — gaya situs

## Lisensi

MIT — lihat `LICENSE`.
