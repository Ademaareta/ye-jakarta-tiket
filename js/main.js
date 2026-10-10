// ==========================================================
// main.js - Logika halaman utama
// Denah, pilihan zona, kalkulator total, dan e-tiket
// ==========================================================

// ---------- Fungsi bantu ----------

// Singkatan untuk document.querySelector
const $ = (selector) => document.querySelector(selector);

// Format angka ke Rupiah, contoh: Rp1.875.000
const rp = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);


// ---------- State (data yang berubah saat pengguna memilih) ----------

let sel = null; // kode zona yang dipilih, contoh "c1"
let q = 1;      // jumlah tiket (1 sampai 4)


// ---------- Daftar zona di bawah denah ----------

$("#zl").innerHTML = Object.entries(Z)
  .map(([kode, zona]) => `
    <li>
      <button data-k="${kode}" aria-pressed="false">
        <span class="sw" style="background:${zona.c}"></span>
        <span>${zona.n}<em>${zona.d}</em></span>
        <strong>${rp(zona.p)}</strong>
      </button>
    </li>
  `)
  .join("");


// ---------- Memilih zona ----------

function pick(kode) {
  sel = kode;
  const zona = Z[kode];

  // Tandai tombol di daftar
  document.querySelectorAll("#zl button").forEach((tombol) => {
    tombol.setAttribute("aria-pressed", tombol.dataset.k === kode);
  });

  // Nyalakan zona di denah
  document.querySelectorAll(".z").forEach((bentuk) => {
    bentuk.classList.toggle("on", bentuk.dataset.z === zona.m);
  });

  // Isi panel pembelian
  $("#pn").textContent = zona.n;
  $("#pd").textContent = zona.d;
  upd();
}


// ---------- Memperbarui jumlah tiket dan ringkasan harga ----------

function upd() {
  $("#qn").textContent = q;

  // Belum ada zona: kosongkan ringkasan, matikan tombol beli
  if (!sel) {
    $("#sm").innerHTML = "";
    $("#buy").disabled = true;
    return;
  }

  const subtotal = Z[sel].p * q;
  const pajak = Math.round(subtotal * 0.10);    // pajak pemerintah 10%
  const biaya = Math.round(subtotal * 0.06);    // biaya platform 6%

  $("#sm").innerHTML = `
    <div class="row"><span>${q} × ${rp(Z[sel].p)}</span><span>${rp(subtotal)}</span></div>
    <div class="row"><span>Pajak 10%</span><span>${rp(pajak)}</span></div>
    <div class="row"><span>Biaya platform 6%</span><span>${rp(biaya)}</span></div>
    <div class="row t"><span>Total</span><span>${rp(subtotal + pajak + biaya)}</span></div>
  `;
  $("#buy").disabled = false;
}


// ---------- Event klik ----------

// Klik zona di daftar
$("#zl").onclick = (e) => {
  const tombol = e.target.closest("button");
  if (tombol) pick(tombol.dataset.k);
};

// Klik zona di denah. Zona "sf" (Super Fans) tidak ada di denah, jadi dilewati.
document.querySelectorAll(".z").forEach((bentuk) => {
  bentuk.onclick = () => {
    const kode = Object.keys(Z).find(
      (k) => Z[k].m === bentuk.dataset.z && k !== "sf"
    );
    pick(kode);
  };
});

// Tombol kurang dan tambah tiket (batas 1 sampai 4)
$("#mi").onclick = () => {
  q = Math.max(1, q - 1);
  upd();
};
$("#pl").onclick = () => {
  q = Math.min(4, q + 1);
  upd();
};

// Tombol "Beli tiket" membuka halaman checkout (fungsi go ada di checkout.js)
$("#buy").onclick = () => go(2);


// ---------- E-tiket setelah pembayaran ----------

// Membuat pola kotak mirip QR dari kode tiket (hanya hiasan, bukan QR sungguhan)
function qr(kode) {
  let seed = 0;
  for (const huruf of kode) {
    seed = (seed * 31 + huruf.charCodeAt(0)) >>> 0;
  }

  return Array.from({ length: 49 }, () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const terisi = (seed >>> 16) & 1;
    return `<b class="${terisi ? "" : "o"}"></b>`;
  }).join("");
}

// Menampilkan jendela e-tiket. Dipanggil dari checkout.js setelah tombol bayar.
function finish(nama) {
  const zona = Z[sel];
  const kode = "YE-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const jendela = $("#dlg");

  jendela.innerHTML = `
    <div class="tk">
      <h3 id="dt">Pesanan diterima</h3>

      <div class="stub">
        <div>
          <strong>Ye Live in Jakarta 2026</strong>
          <div>24 Okt 2026 · SUGBK</div>
          <div>${zona.n} × ${q}</div>
          <div>Bayar via ${PM}</div>
          <div id="who"></div>
          <div style="font-weight:700;margin-top:6px">${kode}</div>
        </div>
        <div class="qr" aria-hidden="true">${qr(kode)}</div>
      </div>

      <p style="margin:0;color:var(--mute);font-size:13px">
        Ini simulasi untuk portofolio aku, bukan tiket asli.
        Tiket resmi hanya di yejakarta.com.
        Nomor kursi asli diberikan promotor lewat aplikasi LOKET>_<.
      </p>

      <button class="btn" onclick="dlg.close(); go(1)">Selesai</button>
    </div>
  `;

  // Nama diisi lewat textContent supaya aman dari karakter HTML
  $("#who").textContent = "Atas nama " + nama;
  jendela.showModal();
}

// Klik di luar kotak jendela menutupnya
$("#dlg").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
