# DESIGN.md — Laundry POS, arah desain "segar & ramah"

Identitas: aplikasi kasir laundry yang terasa "bersih dan wangi": cerah, ramah, ringan dipakai kasir setiap hari. Dipilih langsung oleh pemilik produk (sesi desain 2026-11-21).

## Dial

**ENERGY 2 / RHYTHM 2 / MOTION 1**

Alasan: aplikasi operasional harian, bukan landing seremonial. Motion hanya hover, transisi mikro, dan feedback form; tidak ada animasi loop.

## Palet (2 core + 1 accent, R-29)

| Token | Nilai | Pemakaian | Alasan |
|---|---|---|---|
| primary | `#0E7490` (biru laut) | sidebar aktif, tombol utama, link | menunjuk langsung identitas laundry, "air bersih" |
| accent | `#F97066` (koral) | CTA utama kasir "Buat Pesanan", badge butuh-perhatian, satu elemen fokus per layar | hangat, dipakai sparingly supaya fokus |
| bg | `#FAFAF8` (putih hangat) | latar | netral hangat, tidak dihitung core |
| ink | `#17303B` | teks utama | turunan biru laut, bukan hitam mati |
| muted | `#5C6B72` | teks sekunder | lolos AA 4.5:1 di atas bg (dicek, bukan ditebak) |
| status | hijau `#047857`, amber `#B45309`, merah `#B91C1C` | badge status lunas/diproses/batal | fungsional, bukan dekorasi |

Dilarang: gradient biru-ungu, glow berlebih, glassmorphism di banyak elemen.

## Tipografi

**Plus Jakarta Sans** (400/500/600/700/800). Alasan: font asal Indonesia, ramah, punya tabular figures: harga selalu pakai `font-variant-numeric: tabular-nums` dan format `Rp` tanpa desimal bila bulat.

## Motif identitas

**Gelombang sabun**: satu lekuk gelombang halus yang hanya muncul di tiga tempat: header halaman auth, empty state, dan header nota. Alasan: motif spesifik yang diulang, bukan dekorasi di mana-mana.

## Radius, shadow, ikon

- Radius: `10px` input/tombol, `14px` kartu, pill hanya untuk chip status. Radius sebagai hierarki, bukan default pill.
- Shadow: hanya elemen yang benar-benar melayang (dropdown, modal, toast). Elevation sebagai marker.
- Ikon: **Phosphor** (`@phosphor-icons/react`). Alasan: punya glyph yang benar-benar relevan (washing-machine, t-shirt, drop), bukan set default yang kebetulan ada.

## Bahasa

Indonesia konsisten (`lang="id"`), label operasional pendek. Tanpa em dash (R-02). CTA spesifik: "Buat Pesanan", "Simpan Pelanggan", bukan "Get Started".

## Dark mode

Toggle fungsional, default light; kedua mode diverifikasi kontrasnya. Alasan (R-21): tidak ada alasan kuat tema fixed; kasir kadang jaga shift malam.

## Aturan konten

- Tanpa testimonial atau statistik palsu (R-17/R-18); landing hanya klaim yang bisa diverifikasi.
- KPI dashboard hanya dari `GET /reports/summary`, tanpa delta yang tidak dihitung dari data.
- Empty state menyebut penyebab dan aksi berikutnya, bukan sekadar "Tidak ada data".

## Landing page: tema owner-supplied (mockup BubbleWash, 2026-11-22)

Landing memakai tema Sky Mint sebagai satu-satunya tema (keputusan owner, 2026-11-22: switcher 3 tema dihapus, Terracotta/Midnight tidak dilanjutkan).

- Gradient hero/CTA dan pola titik di banner CTA: bagian identitas mockup owner (R-01/R-07, alasan tertulis), bukan gradient default; stop CTA digelapkan (mis. #0369A1/#047857) supaya teks putih lolos AA.
- Difilter antislop dari mockup: badge eyebrow "Tema:" + titik pulse di atas H1 (R-09/R-31), animasi float tak berujung pada kartu hero (R-19), glow di semua tombol (R-13, hanya CTA utama). Modal simulasi kasir + form auth palsu tidak dibuat: kasir asli ada di app (R-26/R-38).
- Ikon tetap Phosphor demi konsistensi dengan app; glyph relevan per fitur (R-04).
- Kontras ketiga tema diverifikasi contrast-check.py; pasangan terendah 4.60 (R-25). Midnight berfungsi sebagai mode gelap landing (R-21/R-34).
