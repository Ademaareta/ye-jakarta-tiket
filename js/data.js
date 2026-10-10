// ==========================================================
// data.js - Data zona tiket, metode pembayaran, dan langkah checkout
// Ubah nama zona, harga, atau deskripsi di sini.
// ==========================================================

// Zona tiket.
//   n = nama zona
//   p = harga per tiket (Rupiah)
//   c = warna kotak kecil di daftar
//   d = deskripsi singkat
//   m = zona di denah yang ikut menyala (cocok dengan data-z di index.html)
const Z = {
  vipE: {
    n: "VIP East",
    p: 9850000,
    c: "#5A504A",
    d: "Kursi bernomor + paket VIP",
    m: "vipE"
  },
  vipW: {
    n: "VIP West",
    p: 9850000,
    c: "#5A504A",
    d: "Kursi bernomor + paket VIP",
    m: "vipW"
  },
  sf: {
    n: "Super Fans Festival",
    p: 5850000,
    c: "#EADBCB",
    d: "Berdiri, masuk lebih awal + paket",
    m: "fest"
  },
  fest: {
    n: "Festival A & B",
    p: 3500000,
    c: "#EADBCB",
    d: "Berdiri di area tengah",
    m: "fest"
  },
  c1: {
    n: "CAT 1A & 1B",
    p: 4875000,
    c: "#B3A397",
    d: "Kursi bernomor",
    m: "c1"
  },
  c2: {
    n: "CAT 2A & 2B",
    p: 3875000,
    c: "#7A6E68",
    d: "Kursi bernomor",
    m: "c2"
  },
  c3: {
    n: "CAT 3A & 3B",
    p: 2875000,
    c: "#2B2927",
    d: "Kursi bernomor",
    m: "c3"
  },
  c4: {
    n: "CAT 4A & 4B",
    p: 1875000,
    c: "#D9C5B2",
    d: "Kursi bernomor",
    m: "c4"
  }
};

// Metode pembayaran: [kode, nama lengkap, warna badge, teks badge]
// Badge hanya representasi teks, bukan logo resmi.
const PMS = [
  ["card",  "Kartu kredit / debit",    "#1F3B8C", "KARTU"],
  ["livin", "Livin' by Mandiri",       "#F5B800", "livin'"],
  ["mdr",   "Mandiri Virtual Account", "#0B3D91", "Mandiri"],
  ["bca",   "BCA Virtual Account",     "#0060AF", "BCA"],
  ["bni",   "BNI Virtual Account",     "#F26B21", "BNI"],
  ["briva", "BRIVA",                   "#00529C", "BRIVA"],
  ["gopay", "GoPay",                   "#00AA13", "gopay"],
  ["spay",  "ShopeePay",               "#EE4D2D", "ShopeePay"],
  ["indo",  "Indodana PayLater",       "#E0332B", "indodana"]
];

// Nama langkah di penunjuk langkah halaman checkout
const STEPS = ["Pilih kategori", "Data diri", "Konfirmasi", "Pembayaran"];
