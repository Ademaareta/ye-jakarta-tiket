// ==========================================================
// countdown.js - Hitung mundur menuju hari konser
// ==========================================================

// 24 Okt 2026 pukul 00.00 WIB = 23 Okt 2026 pukul 17.00 UTC
// (di JavaScript, bulan dihitung dari 0, jadi Oktober = 9)
const KONSER_MULAI = Date.UTC(2026, 9, 23, 17, 0, 0);

function tick() {
  const sisa = KONSER_MULAI - Date.now();

  if (sisa <= 0) {
    $("#cd").textContent = "Hari ini";
    return;
  }

  const hari = Math.floor(sisa / 864e5);          // 864e5 = jumlah milidetik dalam sehari
  const jam = Math.floor((sisa % 864e5) / 36e5);  // 36e5 = milidetik dalam satu jam
  const menit = Math.floor((sisa % 36e5) / 6e4);  // 6e4 = milidetik dalam satu menit

  $("#cd").textContent = `${hari}h ${jam}j ${menit}m`;
}

// Tampilkan sekarang, lalu perbarui tiap 30 detik
tick();
setInterval(tick, 30000);
