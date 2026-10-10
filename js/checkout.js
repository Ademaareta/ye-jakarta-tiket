// ==========================================================
// checkout.js - Alur checkout
// Langkah 2: data diri, 3: konfirmasi, 4: pembayaran
// (langkah 1 adalah halaman pilih kategori di index.html)
// ==========================================================

// ---------- State ----------

let step = 1;     // langkah yang sedang tampil
let PM = "";      // nama metode pembayaran yang dipilih
let P = {};       // data pembeli: a=nama depan, b=nama belakang, e=email, p=telepon, i=identitas, d=tanggal lahir, g=jenis kelamin
let tm;           // id interval untuk timer pesanan
let left = 600;   // sisa waktu pesanan dalam detik (10 menit)


// ---------- Fungsi bantu ----------

// Hitung subtotal, pajak 10%, biaya platform 6%, dan total
function tot() {
  const s = Z[sel].p * q;
  const t = Math.round(s * 0.10);
  const f = Math.round(s * 0.06);
  return { s, t, f, all: s + t + f };
}

// Ubah sisa detik menjadi teks "09:59"
function clk() {
  const menit = String(Math.floor(left / 60)).padStart(2, "0");
  const detik = String(left % 60).padStart(2, "0");
  return menit + ":" + detik;
}


// ---------- Timer pesanan ----------

function startTimer() {
  clearInterval(tm);
  left = 600;

  tm = setInterval(() => {
    left--;

    const el = $("#tmr");
    if (el) el.textContent = clk();

    // Waktu habis: kembali ke halaman pilih kategori
    if (left <= 0) {
      go(1);
      $("#pd").textContent = "Waktu pembayaran habis. Pilih tiket lagi.";
    }
  }, 1000);
}


// ---------- Pindah langkah ----------

function go(n) {
  if (n === 2 && step === 1) startTimer();
  if (n === 1) clearInterval(tm);

  step = n;
  $("#v1").hidden = n !== 1;   // halaman pilih kategori
  $("#v2").hidden = n === 1;   // halaman checkout

  if (n > 1) draw();
  scrollTo(0, 0);
}


// ---------- Potongan HTML tiap bagian ----------

// Penunjuk langkah di atas halaman
function stepsHTML() {
  return STEPS.map((nama, i) => {
    const nomor = i + 1;
    const kelas = nomor < step ? "d" : nomor === step ? "c" : "";
    const centang = nomor < step ? "✓ " : "";
    return `<li class="${kelas}">${centang}${nama}</li>`;
  }).join("");
}

// Tombol Kembali dan Lanjut
function navHTML(labelLanjut) {
  return `
    <div class="nav">
      <button class="btn line" id="bk">Kembali</button>
      <button class="btn" id="nx">${labelLanjut}</button>
    </div>
  `;
}

// Langkah 2: formulir data diri
function formHTML() {
  return `
    <h2>Data diri</h2>

    <div class="g2">
      <label>Nama depan *
        <input id="f1" autocomplete="given-name">
      </label>
      <label>Nama belakang
        <input id="f2" autocomplete="family-name">
      </label>
    </div>

    <label>Email *
      <input id="f3" type="email" autocomplete="email">
    </label>

    <label>Nomor telepon *
      <input id="f4" type="tel" placeholder="+62 81222333444">
    </label>

    <label>Nomor identitas (KTP/SIM/paspor) *
      <input id="f5" placeholder="Isi data fiktif untuk simulasi">
    </label>

    <label>Tanggal lahir *
      <input id="f6" type="date">
    </label>

    <fieldset>
      <legend>Jenis kelamin *</legend>
      <label class="r"><input type="radio" name="g" value="Laki-laki"> Laki-laki</label>
      <label class="r"><input type="radio" name="g" value="Perempuan"> Perempuan</label>
    </fieldset>

    <label class="r">
      <input type="checkbox" id="f7"> Saya setuju dengan syarat dan ketentuan (simulasi)
    </label>

    <p class="mute">Data hanya ada di browsermu dan tidak dikirim ke mana pun. Pakai data fiktif.</p>
    <p class="err" id="er" role="alert"></p>

    ${navHTML("Lanjut")}
  `;
}

// Langkah 3: konfirmasi pesanan (nama, email, telepon diisi lewat textContent di bindConfirm)
function confirmHTML(zona) {
  return `
    <h2>Konfirmasi pesanan</h2>

    <dl class="dl">
      <dt>Nama</dt><dd id="c1"></dd>
      <dt>Email</dt><dd id="c2"></dd>
      <dt>Telepon</dt><dd id="c3"></dd>
      <dt>Zona</dt><dd>${zona.n} × ${q}</dd>
    </dl>

    <p class="mute">Periksa lagi datanya. Tiket akan atas nama pembeli di atas.</p>

    ${navHTML("Lanjut ke pembayaran")}
  `;
}

// Langkah 4: pilihan metode pembayaran
function paymentHTML(total) {
  const tombolMetode = PMS.map(([kode, nama, warna, teks]) => {
    const warnaTeks = warna === "#F5B800" ? "#1F1D1B" : "#fff";
    return `
      <button class="pt" role="radio" aria-checked="false" data-k="${kode}">
        <span class="bd" style="background:${warna};color:${warnaTeks}">${teks}</span>
        <span>${nama}</span>
      </button>
    `;
  }).join("");

  return `
    <h2>Metode pembayaran</h2>

    <div class="pm" role="radiogroup" aria-label="Metode pembayaran">
      ${tombolMetode}
    </div>

    <p class="mute">Badge ini hanya representasi, bukan logo resmi. Tidak ada uang yang dipindahkan.</p>

    <div class="nav">
      <button class="btn line" id="bk">Kembali</button>
      <button class="btn" id="pay" disabled>Bayar ${rp(total.all)}</button>
    </div>
  `;
}

// Kartu ringkasan pesanan di sisi kanan
function summaryHTML(zona, total) {
  return `
    <h3>Ye Live in Jakarta 2026</h3>
    <p class="mute">
      24 Okt 2026 · 20.00 – 23.59 WIB<br>
      Stadion Utama Gelora Bung Karno, Jakarta
    </p>

    <div class="sum">
      <strong>Ringkasan pesanan</strong>
      <div class="row">
        <span>${zona.n}<br>${q} tiket × ${rp(zona.p)}</span>
        <span>${rp(total.s)}</span>
      </div>
      <div class="row"><span>Pajak 10%</span><span>${rp(total.t)}</span></div>
      <div class="row"><span>Biaya platform 6%</span><span>${rp(total.f)}</span></div>
      <div class="row t"><span>Total</span><span>${rp(total.all)}</span></div>
    </div>
  `;
}


// ---------- Menggambar halaman checkout ----------

function draw() {
  const zona = Z[sel];
  const total = tot();

  // Pilih isi kartu kiri sesuai langkah
  let isi;
  if (step === 2) isi = formHTML();
  else if (step === 3) isi = confirmHTML(zona);
  else isi = paymentHTML(total);

  $("#v2").innerHTML = `
    <ol class="steps">${stepsHTML()}</ol>

    <div class="timer">
      Sisa waktu untuk menyelesaikan pesanan: <span id="tmr">${clk()}</span>
    </div>

    <div class="co">
      <div class="card">${isi}</div>
      <aside class="card">${summaryHTML(zona, total)}</aside>
    </div>
  `;

  // Tombol Kembali ada di semua langkah
  $("#bk").onclick = () => go(step - 1);

  if (step === 2) bindForm();
  else if (step === 3) bindConfirm();
  else bindPayment();
}


// ---------- Aksi tiap langkah ----------

// Langkah 2: isi ulang formulir (kalau pembeli kembali) dan validasi saat lanjut
function bindForm() {
  const kolom = [
    ["f1", "a"],
    ["f2", "b"],
    ["f3", "e"],
    ["f4", "p"],
    ["f5", "i"],
    ["f6", "d"]
  ];
  kolom.forEach(([id, kunci]) => {
    $("#" + id).value = P[kunci] || "";
  });

  if (P.g) {
    const radio = document.querySelector(`input[name=g][value="${P.g}"]`);
    if (radio) radio.checked = true;
  }

  $("#nx").onclick = () => {
    const nilai = (id) => $("#" + id).value.trim();
    const gender = document.querySelector("input[name=g]:checked");

    // Cek satu per satu, berhenti di kesalahan pertama
    let pesan = "";
    if (!nilai("f1")) {
      pesan = "Isi nama depan.";
    } else if (!/^\S+@\S+\.\S+$/.test(nilai("f3"))) {
      pesan = "Isi email yang valid.";
    } else if (nilai("f4").replace(/\D/g, "").length < 8) {
      pesan = "Isi nomor telepon yang valid.";
    } else if (!nilai("f5")) {
      pesan = "Isi nomor identitas (data fiktif untuk simulasi).";
    } else if (!nilai("f6")) {
      pesan = "Isi tanggal lahir.";
    } else if (!gender) {
      pesan = "Pilih jenis kelamin.";
    } else if (!$("#f7").checked) {
      pesan = "Centang persetujuan untuk melanjutkan.";
    }

    if (pesan) {
      $("#er").textContent = pesan;
      return;
    }

    P = {
      a: nilai("f1"),
      b: nilai("f2"),
      e: nilai("f3"),
      p: nilai("f4"),
      i: nilai("f5"),
      d: nilai("f6"),
      g: gender.value
    };
    go(3);
  };
}

// Langkah 3: tampilkan data pembeli (lewat textContent supaya aman) lalu lanjut
function bindConfirm() {
  $("#c1").textContent = (P.a + " " + P.b).trim();
  $("#c2").textContent = P.e;
  $("#c3").textContent = P.p;

  $("#nx").onclick = () => go(4);
}

// Langkah 4: pilih metode, lalu bayar
function bindPayment() {
  document.querySelectorAll(".pt").forEach((tombol) => {
    tombol.onclick = () => {
      PM = PMS.find((metode) => metode[0] === tombol.dataset.k)[1];

      document.querySelectorAll(".pt").forEach((lain) => {
        lain.setAttribute("aria-checked", lain === tombol);
      });

      $("#pay").disabled = false;   // tombol bayar aktif setelah ada metode dipilih
    };
  });

  $("#pay").onclick = () => {
    clearInterval(tm);
    finish((P.a + " " + P.b).trim());   // finish ada di main.js
  };
}
