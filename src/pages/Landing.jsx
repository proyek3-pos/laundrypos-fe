import { Link } from "react-router-dom";
import { CashRegister, Printer, Receipt, Wallet } from "@phosphor-icons/react";
import { Wave } from "../components/Wave.jsx";
import { useTitle } from "../hooks/useApi.js";

const FEATURES = [
  {
    icon: CashRegister,
    title: "Kasir multi-item",
    desc: "Satu pesanan bisa campur cuci per kg dan setrika per item, harga dihitung otomatis.",
  },
  {
    icon: Wallet,
    title: "Cash dan Midtrans",
    desc: "Uang pas langsung terhitung kembaliannya, atau kirim tagihan Midtrans untuk pembayaran digital.",
  },
  {
    icon: Receipt,
    title: "Status pesanan jelas",
    desc: "Dari baru masuk, diproses, selesai, sampai diambil. Kasir tahu cucian ada di mana.",
  },
  {
    icon: Printer,
    title: "Nota siap cetak",
    desc: "Nomor nota dibuat otomatis dan siap dicetak ke printer thermal 80mm.",
  },
];

const STEPS = [
  { title: "Pilih pelanggan", desc: "Cari yang sudah terdaftar, atau tambah pelanggan baru langsung dari kasir." },
  { title: "Timbang dan catat item", desc: "Berat dalam kg boleh desimal seperti 4,5. Layanan per item dihitung utuh." },
  { title: "Terima bayar, cetak nota", desc: "Kembalian dihitung otomatis. Nota langsung siap dicetak." },
];

export default function Landing() {
  useTitle("LaundryPOS: kasir laundry yang ringan dipakai");
  return (
    <div className="min-h-dvh bg-bg">
      <header className="no-print sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo LaundryPOS" className="h-8 w-8" width={32} height={32} />
            <span className="font-extrabold">LaundryPOS</span>
          </div>
          <nav className="flex items-center gap-2" aria-label="Menu beranda">
            <Link to="/login" className="inline-flex min-h-11 items-center px-4 font-bold text-primary hover:underline">
              Masuk
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
            >
              Daftar Staf
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Kasir laundry yang ringan dipakai setiap hari
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Catat pesanan, hitung kembalian, tandai cucian yang sudah diambil. Semua dari satu tempat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center rounded-input bg-accent px-6 font-extrabold text-ink hover:bg-accent-deep hover:text-white"
              >
                Masuk ke Kasir
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-11 items-center rounded-input border border-line bg-surface px-6 font-bold text-ink hover:bg-primary-soft"
              >
                Buat Akun Staf
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-10 text-primary-soft">
            <Wave className="h-full w-full" />
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Semua yang kasir butuh, tanpa fitur lepas</h2>
              <p className="mt-3 text-muted">
                LaundryPOS dibangun untuk alur kerja laundry: terima, timbang, bayar, serahkan. Tidak ada menu yang
                tidak terpakai.
              </p>
            </div>
            <ul className="space-y-6">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-primary-soft text-primary-deep"
                    aria-hidden="true"
                  >
                    <f.icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-bold">{f.title}</h3>
                    <p className="text-sm text-muted">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Tiga langkah di kasir</h2>
            <p className="mt-2 text-muted">Alur yang sama seperti mencatat di buku, tapi angka dan nota tidak bisa salah.</p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-[14px] border border-line bg-surface p-5">
                  <p className="text-sm font-extrabold text-primary-deep">Langkah {i + 1}</p>
                  <h3 className="mt-1 font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="rounded-[14px] bg-primary px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-extrabold">Siap buka kasir hari ini?</h2>
            <p className="mx-auto mt-2 max-w-md opacity-90">
              Masuk dengan akun staf, pilih pelanggan, dan catat pesanan pertama.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex min-h-11 items-center rounded-input bg-surface px-6 font-extrabold text-primary-deep hover:bg-primary-soft"
            >
              Masuk ke Kasir
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <p className="text-sm text-muted">LaundryPOS, aplikasi kasir untuk usaha laundry.</p>
          <nav className="flex gap-4 text-sm font-bold" aria-label="Tautan footer">
            <Link to="/login" className="text-primary hover:underline">
              Masuk
            </Link>
            <Link to="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
