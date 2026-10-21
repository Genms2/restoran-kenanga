// ===== Pengaturan =====
// Ganti dengan nomor WhatsApp warung (format: 62 + nomor tanpa angka 0 di depan)
const NOMOR_WA = "6282181962684";

// Menyimpan pesanan: { "Soto Ayam": { harga: 15000, jumlah: 2 } }
const pesanan = {};

const daftar = document.getElementById("daftar-pesanan");
const kosong = document.getElementById("pesanan-kosong");
const totalEl = document.getElementById("total");
const tombolWA = document.getElementById("kirim-wa");
const inputNama = document.getElementById("nama-pemesan");

function rupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Menampilkan ulang daftar pesanan setiap ada perubahan
function tampilkanPesanan() {
  daftar.innerHTML = "";
  let total = 0;
  const namaMenu = Object.keys(pesanan);

  namaMenu.forEach(function (nama) {
    const item = pesanan[nama];
    const subtotal = item.harga * item.jumlah;
    total += subtotal;

    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "info-item";
    const judul = document.createElement("strong");
    judul.textContent = nama;
    const detail = document.createElement("small");
    detail.textContent = item.jumlah + " x " + rupiah(item.harga) + " = " + rupiah(subtotal);
    info.append(judul, detail);

    const atur = document.createElement("div");
    atur.className = "atur-jumlah";
    const kurang = document.createElement("button");
    kurang.type = "button";
    kurang.textContent = "-";
    kurang.setAttribute("aria-label", "Kurangi " + nama);
    kurang.addEventListener("click", function () { ubahJumlah(nama, -1); });
    const jumlah = document.createElement("span");
    jumlah.textContent = item.jumlah;
    const tambah = document.createElement("button");
    tambah.type = "button";
    tambah.textContent = "+";
    tambah.setAttribute("aria-label", "Tambah " + nama);
    tambah.addEventListener("click", function () { ubahJumlah(nama, 1); });
    atur.append(kurang, jumlah, tambah);

    li.append(info, atur);
    daftar.appendChild(li);
  });

  kosong.hidden = namaMenu.length > 0;
  tombolWA.disabled = namaMenu.length === 0;
  totalEl.textContent = rupiah(total);
}

function ubahJumlah(nama, selisih) {
  pesanan[nama].jumlah += selisih;
  if (pesanan[nama].jumlah <= 0) {
    delete pesanan[nama];
  }
  tampilkanPesanan();
}

// Klik tombol "Tambah" pada kartu menu
document.querySelectorAll(".tambah").forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    const nama = tombol.dataset.nama;
    const harga = Number(tombol.dataset.harga);
    if (pesanan[nama]) {
      pesanan[nama].jumlah += 1;
    } else {
      pesanan[nama] = { harga: harga, jumlah: 1 };
    }
    tampilkanPesanan();
  });
});

// Kirim pesanan lewat WhatsApp
tombolWA.addEventListener("click", function () {
  const pemesan = inputNama.value.trim() || "-";
  let teks = "Halo Warung Kenanga, saya mau pesan:\n";
  let total = 0;

  Object.keys(pesanan).forEach(function (nama) {
    const item = pesanan[nama];
    total += item.harga * item.jumlah;
    teks += "- " + nama + " x" + item.jumlah + "\n";
  });

  teks += "Total: " + rupiah(total) + "\nAtas nama: " + pemesan;

  const url = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(teks);
  window.open(url, "_blank");
});

tampilkanPesanan();
