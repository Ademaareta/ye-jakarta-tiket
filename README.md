# Ye Live in Jakarta 2026 - Web Penjualan Tiket (Proyek Portofolio)

Website penjualan tiket online dengan denah interaktif dan alur checkout lengkap. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa framework.

## Fitur
- Denah stadion interaktif dan daftar harga 8 kategori
- Kalkulator total (pajak 10% dan biaya platform 6%)
- Alur beli: pilih kategori, data diri, konfirmasi, pembayaran
- 9 metode pembayaran dan e-tiket simulasi
- Hitung mundur konser dan timer pesanan 10 menit
- Responsif dan mendukung mode gelap

## Struktur proyek
```
ye-jakarta-tiket/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js        # data zona, harga, metode pembayaran
│   ├── main.js        # denah, pilihan zona, kalkulator, e-tiket
│   ├── countdown.js   # hitung mundur konser
│   └── checkout.js    # alur checkout dan timer
├── assets/
│   └── favicon.svg
├── .gitignore
├── LICENSE
└── README.md
```

## Cara menjalankan
Buka `index.html` di browser. Tidak perlu instalasi.

## Catatan
Ini proyek portofolio desain web, bukan penjual resmi. Harga dan denah mengacu pada pengumuman promotor Raw Vision Collective. Tiket asli hanya dijual di yejakarta.com. Semua pembelian hanya simulasi dan tidak ada data yang dikirim ke server.
