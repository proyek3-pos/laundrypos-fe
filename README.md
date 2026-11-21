# laundrypos-fe

Frontend POS laundry: Vite + React 19 + Tailwind CSS v4, di-deploy ke GitHub Pages di path `/laundrypos-fe/`.

Arah desain ada di [DESIGN.md](DESIGN.md) (palet biru laut + koral, Plus Jakarta Sans, ikon Phosphor, mode gelap fungsional).

## Menjalankan lokal

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8082 (backend lokal)
npm run dev            # http://localhost:5173/laundrypos-fe/
```

Butuh backend berjalan di `VITE_API_URL`. Lihat README di `laundrypos-be`.

## Build & deploy

```bash
npm run build   # hasil di dist/
```

Push ke `master` memicu GitHub Actions (`.github/workflows/static.yml`) yang menjalankan `npm run build` lalu men-deploy `dist/` ke GitHub Pages. URL API produksi diatur di `.env.production`.

## Struktur

- `src/api/client.js`: fetch client (base URL env, token Bearer, format Rupiah/tanggal)
- `src/context/AuthContext.jsx`: sesi login + guard role
- `src/hooks/useApi.js`: state loading/error/retry untuk semua list
- `src/components/`: AppShell (sidebar + bottom nav), Toast, Modal, StatusBadge, Pagination, StateViews
- `src/pages/`: Landing, Login, Register, Dashboard, Kasir, Pesanan, Detail Pesanan, Nota (print 80mm), Pelanggan, Layanan, Pembayaran

## Peran

- **admin**: semua menu, termasuk Dashboard dan kelola Layanan.
- **staff**: kasir, pesanan, pelanggan, pembayaran.

Role ditegakkan di server; navigasi frontend hanya menyembunyikan menu yang tidak tersedia.
