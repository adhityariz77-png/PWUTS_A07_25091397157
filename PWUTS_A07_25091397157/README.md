# PWUTS_A07_25091397157

# MeowNesa – Sistem Informasi Data Kucing & Adopsi Jaga Satwa UNESA

Website tugas **Ujian Tengah Semester (UTS) Pemrograman Web**, Gasal 2026/2027.

| | |
|---|---|
| **Nama** | *Adhitya Rizqullah* |
| **NIM** | 25091397157 |
| **Kelompok** | A07 (Kelompok 7) |
| **Program Studi** | D4 Manajemen Informatika, Universitas Negeri Surabaya |
| **Dosen** | Ari Kurniawan, S.Kom., M.T. |
| **Repository** | https://github.com/adhityariz77-png/PWUTS_A07_25091397157 |
| **Demo online** | https://adhityariz77-png.github.io/PWUTS_A07_25091397157/ |

---

## 1. Tentang Website

**MeowNesa** adalah sistem informasi untuk membantu komunitas **Jaga Satwa UNESA** mengelola data kucing di dua kampus, yaitu **Ketintang** dan **Lidah Wetan**, mulai dari pendataan, status kesehatan (steril), sampai proses pengajuan adopsi.

Pengunjung dapat:
1. melihat dan mencari kucing yang terdata,
2. melihat detail tiap kucing,
3. mengajukan adopsi lewat formulir online tanpa perlu membuat akun.

---

## 2. Kesesuaian dengan Soal UTS

| Item soal | Ketentuan | Pemenuhan | File |
|---|---|---|---|
| **2.a** | Homepage sebagai layout utama, *responsive*, HTML + CSS + JS/jQuery | Layout utama berisi navbar, area konten, dan footer. Tampilan menyesuaikan HP, tablet, dan PC. | `index.html`, `css/style.css`, `js/app.js` |
| **2.a** | Menu ke halaman 2.b dan 2.c memakai **Ajax** | Klik menu memanggil `$.ajax()` dan hasilnya dimasukkan ke area `#konten`, tanpa memuat ulang seluruh halaman. | `js/app.js` |
| **2.a** | Memakai gambar | Logo, ikon kucing, foto kucing, dan gambar Jaga Satwa. | `img/` |
| **2.b** | Minimal 1 halaman konten, interaktif dengan jQuery | **Katalog kucing** dengan pencarian, filter, dan popup detail. | `pages/katalog.html` |
| **2.c** | Minimal 1 halaman form sesuai database proposal, dengan validasi sebelum submit ke server HTTP | **Form pengajuan adopsi** (tabel `pengajuan_adopsi`), divalidasi jQuery, lalu dikirim dengan `$.ajax` POST. | `pages/form-adopsi.html` |
| **2.e** | Catatan pengerjaan | Dokumen ini. | `README.md` |
| **3.b** | Nama folder `PWUTS_<kode_kelompok>_<nim>` | `PWUTS_A07_25091397157` | – |

Halaman 2.b dan 2.c sama-sama dimuat **di dalam** layout utama (2.a), jadi navbar dan footer tetap tampil.

---

## 3. Fitur

### Layout utama dan navigasi (2.a)
- Navbar di atas (*sticky*, tetap terlihat saat halaman digulir), logo **MeowNesa** di ujung kiri.
- Tiga menu: **Beranda**, **Katalog Kucing**, **Ajukan Adopsi**.
- Perpindahan halaman memakai **Ajax** dan *hash* di URL (`#beranda`, `#katalog`, `#adopsi`), sehingga tombol *Back* browser tetap berfungsi dan halaman bisa dibuka langsung lewat link.
- **Responsif:** di layar ≤ 900 px menu berubah menjadi tombol hamburger, dan di layar ≤ 600 px katalog tampil 2 kolom.

### Beranda
- *Hero* berisi pengenalan, maskot kucing, dan tombol menuju katalog dan formulir.
- Statistik (2 kampus, 77 kucing, adopsi gratis) dan langkah **Cara adopsi** (3 langkah).
- Pratinjau 4 kucing yang bisa diajukan, diambil dari `data/kucing.json`.
- Peringatan agar kalung kucing UNESA tidak dilepas.

### Katalog kucing (2.b)
Data **77 kucing** dibaca dari `data/kucing.json` dengan `$.getJSON`.
- **Pencarian** langsung saat mengetik (nama, kode, lokasi, atau ciri).
- **Filter lokasi** (dropdown) dan **filter cepat**: Semua, Bisa diajukan adopsi, Kampus Ketintang, Kampus Lidah Wetan, Sudah diadopsi.
- Tombol **"Tampilkan lebih banyak"** (12 kucing per tampilan).
- **Popup detail** berisi foto, jenis kelamin, status steril, lokasi, dan ciri-ciri (bisa ditutup dengan tombol atau tombol `Esc`).
- Tombol **"Ajukan adopsi"** pada kucing yang memenuhi syarat. Kucing yang diklik otomatis terpilih di formulir.

### Form pengajuan adopsi (2.c)
Berisi field sesuai tabel `pengajuan_adopsi`:

| Field | Aturan validasi |
|---|---|
| `id_kucing` (kucing yang diajukan) | Wajib dipilih. Hanya kucing berstatus bisa diajukan yang muncul. |
| `nama_pemohon` | Wajib, 3–100 karakter, hanya huruf. |
| `nomor_whatsapp` | Wajib, format `08xx` atau `+628xx`, 10–14 digit. |
| `email` | Wajib, format email valid, maksimal 150 karakter. |
| `jenis_hunian` | Wajib dipilih (rumah pribadi, kos, atau apartemen). |
| `alamat` | Wajib, minimal 10 karakter. |
| `komitmen` | Checkbox wajib dicentang. |

Cara kerja validasi:
- Setiap field dicek saat ditinggalkan (*blur*) dan saat diubah. Pesan error muncul di bawah field, dengan border **merah** jika salah dan **hijau** jika benar.
- Saat tombol **Kirim pengajuan** ditekan, semua field dicek. Jika ada yang salah, pengiriman **dibatalkan** dan kursor pindah ke field pertama yang salah.
- Jika semua benar, data dikirim dengan `$.ajax` **POST** ke server HTTP.
- Sistem membuat otomatis `nomor_pengajuan` (contoh `ADP-2026-123`), `kode_tracking`, dan `status_pengajuan` (`Menunggu Review`). Dua kode pertama ditampilkan ke pemohon setelah berhasil.

> **Server tujuan:** form mengirim ke `https://httpbin.org/post`, server uji HTTP publik yang membalas data yang diterimanya. URL bisa diganti dengan endpoint server kelompok di `js/app.js` (cari `httpbin.org`). Jika server tidak dapat dihubungi, halaman tetap memberi tahu bahwa data hanya divalidasi di browser.

---

## 4. Teknologi

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman |
| CSS3 (Grid, Flexbox, media query) | Tampilan dan responsif |
| JavaScript + **jQuery 3.7.1** | Ajax, interaksi katalog, validasi form |
| JSON | Penyimpanan data kucing (`data/kucing.json`) |
| Google Fonts | Fraunces (judul) dan DM Sans (isi) |

---

## 5. Struktur Folder

```
PWUTS_A07_25091397157/
├── index.html            # Layout utama (2.a)
├── css/
│   └── style.css         # Seluruh gaya dan aturan responsif
├── js/
│   └── app.js            # Navigasi Ajax, katalog, validasi form
├── pages/                # Halaman yang dimuat lewat Ajax
│   ├── beranda.html      # Konten beranda
│   ├── katalog.html      # Katalog kucing (2.b)
│   └── form-adopsi.html  # Form pengajuan adopsi (2.c)
├── data/
│   └── kucing.json       # Data 77 kucing
├── img/
│   ├── brand/            # Logo MeowNesa dan ikon kucing
│   ├── kucing/           # Foto kucing (KTT-xx, LDH-xx)
│   └── jaga-satwa.png    # Gambar komunitas Jaga Satwa
└── README.md             # Dokumen ini
```

---

## 6. Cara Menjalankan

### Opsi A – Buka online (paling mudah)
Buka https://adhityariz77-png.github.io/PWUTS_A07_25091397157/

### Opsi B – Di komputer sendiri
Ajax **tidak berjalan** jika file dibuka langsung (`file://`), jadi perlu server lokal. Buka terminal di folder proyek lalu jalankan:

```bash
python -m http.server 8000
```

Kemudian buka http://localhost:8000 di browser. Alternatifnya, pakai ekstensi **Live Server** di VS Code.

> Butuh koneksi internet untuk memuat jQuery, Google Fonts, dan mengirim form ke server uji.

---

## 7. Desain

- **Palet warna:** plum `#8f1a5c` dan `#4b0c36` (warna utama), magenta logo `#d911b8`, kuning `#ffd95a` (aksen), krem `#fff8f1` (latar). Warna dipilih mengikuti nuansa merah-pink pada identitas Jaga Satwa dan warna logo MeowNesa.
- **Gambar:** logo dan ikon kucing dipakai di navbar, hero, header halaman, dan footer agar tampilan tidak polos.
- **Aksesibilitas:** menu hamburger memakai `aria-expanded`, kolom form memakai `label`, popup bisa ditutup dengan `Esc`, dan animasi dimatikan untuk pengguna yang memilih *reduce motion*.

---

## 8. Sumber Data

Data dan foto kucing berasal dari file presensi Jaga Satwa UNESA: `Presensi_Ketintang_2026.xlsx` (kode **KTT**, Kampus Ketintang) dan `PRESENSI_LIDAH_WETAN.xlsx` (kode **LDH**, Kampus Lidah Wetan). Hanya kucing yang memiliki foto yang dimasukkan.

Sebuah kucing berstatus `bisa_diajukan` jika **sudah steril, belum diadopsi, tidak hilang, dan masih ada**. Status ini dapat diubah di `data/kucing.json`.

---

## 9. Catatan

- Tugas 2.a, 2.b, dan 2.c dikerjakan secara pribadi dan disesuaikan agar tidak sama dengan anggota kelompok lain (item 2.d).
- Website ini dibuat untuk keperluan tugas perkuliahan. Data pengajuan tidak disimpan permanen karena server tujuan hanya server uji.
