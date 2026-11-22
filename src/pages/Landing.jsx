import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  ClipboardText,
  Printer,
  Receipt,
  Scales,
  Stack,
  UserCheck,
  UserPlus,
  Wallet,
} from "@phosphor-icons/react";
import { useTitle } from "../hooks/useApi.js";

const FEATURES = [
  {
    icon: Stack,
    tone: "primary",
    title: "Kasir multi-item",
    desc: "Satu pesanan bisa campur cuci per kg dan setrika per item, harga dihitung otomatis.",
  },
  {
    icon: Wallet,
    tone: "mint",
    title: "Cash dan Midtrans",
    desc: "Uang pas langsung terhitung kembaliannya, atau kirim tagihan Midtrans untuk pembayaran digital.",
  },
  {
    icon: ClipboardText,
    tone: "primary",
    title: "Status pesanan jelas",
    desc: "Dari baru masuk, diproses, selesai, sampai diambil. Kasir tahu cucian ada di mana.",
  },
  {
    icon: Printer,
    tone: "mint",
    title: "Nota siap cetak",
    desc: "Nomor nota dibuat otomatis dan siap dicetak ke printer thermal 80mm.",
  },
];

const STEPS = [
  {
    icon: UserCheck,
    title: "Pilih pelanggan",
    desc: "Cari yang sudah terdaftar, atau tambah pelanggan baru langsung dari kasir.",
  },
  {
    icon: Scales,
    title: "Timbang dan catat item",
    desc: "Berat dalam kg boleh desimal seperti 4,5. Layanan per item dihitung utuh.",
  },
  {
    icon: Receipt,
    title: "Terima bayar, cetak nota",
    desc: "Kembalian dihitung otomatis. Nota langsung siap dicetak.",
  },
];

const iconBox = (tone) =>
  tone === "mint"
    ? "bg-[var(--lw-mint-soft)] text-[var(--lw-mint)]"
    : "bg-[var(--lw-primary-soft)] text-[var(--lw-primary-ink)]";

export default function Landing() {
  useTitle("BubbleWash: kasir laundry yang ringan dipakai");
  return (
    <div data-ltheme="sky" className="min-h-dvh bg-[var(--lw-bg)] text-[var(--lw-ink)]">
      <header className="lw-t sticky top-0 z-40 border-b border-[var(--lw-line)] bg-[var(--lw-surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--lw-line)] bg-[var(--lw-primary-soft)]">
              <img
                src={import.meta.env.BASE_URL + "icon.png"}
                alt="Ikon BubbleWash"
                className="h-6 w-auto"
                width={24}
                height={24}
              />
            </span>
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
              Bubble<span className="text-[var(--lw-primary)]">Wash</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              to="/login"
              className="lw-t rounded-xl px-3.5 py-2 text-sm font-semibold hover:bg-[var(--lw-primary-soft)] hover:text-[var(--lw-primary-ink)]"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="lw-t rounded-xl bg-[var(--lw-btn-bg)] px-4 py-2.5 text-sm font-bold text-[var(--lw-btn-ink)] transition-colors hover:bg-[var(--lw-btn-hover)] sm:px-5"
            >
              Daftar Staf
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="lw-hero lw-t relative overflow-hidden border-b border-[var(--lw-line)] pb-14 pt-10 sm:pb-20 sm:pt-14">
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <h1 className="mb-5 max-w-xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.15rem]">
                  Kasir laundry yang ringan dipakai setiap hari
                </h1>
                <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--lw-muted)] sm:text-lg">
                  Catat pesanan, hitung kembalian, tandai cucian yang sudah diambil. Semua dari satu tempat.
                </p>
                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[var(--lw-btn-bg)] px-6 py-3.5 text-sm font-bold text-[var(--lw-btn-ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--lw-btn-hover)] sm:text-base"
                  >
                    <span>Masuk ke Kasir</span>
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--lw-line)] bg-[var(--lw-surface)] px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-[var(--lw-subtle)] sm:text-base"
                  >
                    <UserPlus size={16} aria-hidden="true" />
                    <span>Buat Akun Staf</span>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[var(--lw-line)] pt-6 text-xs font-medium text-[var(--lw-muted)] sm:text-sm">
                  {["Berat desimal (4,5 kg)", "Cash & Midtrans", "Printer Thermal 80mm"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle size={16} weight="fill" className="text-[var(--lw-mint)]" aria-hidden="true" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ilustrasi kartu POS: contoh nyata alur kasir, tanpa tombol mati */}
              <div className="lg:col-span-5">
                <div className="lw-card-shadow lw-t rounded-3xl border border-[var(--lw-line)] bg-[var(--lw-surface)] p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--lw-line)] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden="true" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      <span className="ml-1.5 text-xs font-semibold text-[var(--lw-muted)]">Nota #BW-2049</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lw-mint-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lw-mint)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--lw-mint)]" aria-hidden="true" />
                      Diproses
                    </span>
                  </div>
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--lw-line)] bg-[var(--lw-subtle)] p-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lw-btn-bg)] text-xs font-bold text-[var(--lw-btn-ink)]">
                        RN
                      </span>
                      <div>
                        <p className="text-sm font-bold">Rina Novianti</p>
                        <p className="text-xs text-[var(--lw-muted)]">0812-3456-7890 · Reguler</p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-[var(--lw-primary-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--lw-primary-ink)]">
                      Terdaftar
                    </span>
                  </div>
                  <div className="mb-4 space-y-2.5">
                    {[
                      { name: "Cuci Komplit (Kiloan)", meta: "4,5 kg × Rp 7.000", total: "Rp 31.500" },
                      { name: "Setrika Kemeja Kerja", meta: "3 pcs × Rp 4.000", total: "Rp 12.000" },
                    ].map((i) => (
                      <div
                        key={i.name}
                        className="flex items-center justify-between border-b border-dashed border-[var(--lw-line)] py-1.5 text-sm"
                      >
                        <div>
                          <p className="font-semibold">{i.name}</p>
                          <p className="text-xs text-[var(--lw-muted)]">{i.meta}</p>
                        </div>
                        <span className="font-bold">{i.total}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 rounded-2xl border border-[var(--lw-line)] bg-[var(--lw-primary-soft)]/60 p-3.5">
                    <div className="flex items-center justify-between text-xs text-[var(--lw-muted)]">
                      <span>Total Tagihan</span>
                      <span className="text-base font-extrabold text-[var(--lw-ink)]">Rp 43.500</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--lw-muted)]">
                      <span>Tunai Diterima</span>
                      <span className="font-semibold text-[var(--lw-ink)]">Rp 50.000</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--lw-line)] pt-2">
                      <span className="text-xs font-bold text-[var(--lw-primary-ink)]">Kembalian Otomatis</span>
                      <span className="text-sm font-extrabold text-[var(--lw-mint)]">Rp 6.500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fitur */}
        <section className="lw-t bg-[var(--lw-bg)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:col-span-5">
                <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.1rem]">
                  Semua yang kasir butuh, tanpa fitur lepas
                </h2>
                <p className="text-base leading-relaxed text-[var(--lw-muted)]">
                  BubbleWash dibangun untuk alur kerja laundry: terima, timbang, bayar, serahkan. Tidak ada menu
                  yang tidak terpakai.
                </p>
              </div>
              <div className="space-y-5 lg:col-span-7">
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--lw-line)] bg-[var(--lw-surface)] p-5 transition-colors hover:border-[var(--lw-primary)] sm:gap-5"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBox(f.tone)}`}
                      aria-hidden="true"
                    >
                      <f.icon size={24} />
                    </span>
                    <div>
                      <h3 className="mb-1 text-base font-bold sm:text-lg">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-[var(--lw-muted)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cara kerja + CTA */}
        <section className="lw-t border-t border-[var(--lw-line)] bg-[var(--lw-subtle)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl sm:mb-12">
              <h2 className="mb-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">Tiga langkah di kasir</h2>
              <p className="text-base text-[var(--lw-muted)]">
                Alur yang sama seperti mencatat di buku, tapi angka dan nota tidak bisa salah.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="rounded-3xl border border-[var(--lw-line)] bg-[var(--lw-surface)] p-6 transition-colors hover:border-[var(--lw-primary)] sm:p-7"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-block rounded-lg bg-[var(--lw-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--lw-primary-ink)]">
                      Langkah {i + 1}
                    </span>
                    <s.icon size={20} className="text-[var(--lw-muted)] opacity-50" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--lw-muted)]">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 sm:mt-20">
              <div className="lw-cta relative overflow-hidden rounded-3xl border border-[var(--lw-line)] px-6 py-12 text-center sm:px-12 sm:py-16">
                <div className="relative z-10 mx-auto max-w-xl">
                  <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-[var(--lw-cta-ink)] sm:text-3xl">
                    Siap buka kasir hari ini?
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-[var(--lw-cta-ink)]/85 sm:text-base">
                    Masuk dengan akun staf, pilih pelanggan, dan catat pesanan pertama.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--lw-cta-btn)] px-7 py-3.5 text-sm font-bold text-[var(--lw-cta-btn-ink)] shadow-lg transition-all hover:-translate-y-0.5 sm:text-base"
                  >
                    <span>Masuk ke Kasir</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="lw-t border-t border-[var(--lw-line)] bg-[var(--lw-surface)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[var(--lw-muted)] sm:text-sm">BubbleWash, aplikasi kasir untuk usaha laundry.</p>
          <div className="flex items-center gap-6 text-xs font-semibold sm:text-sm">
            <Link to="/login" className="text-[var(--lw-primary-ink)] hover:underline">
              Masuk
            </Link>
            <Link to="/register" className="text-[var(--lw-primary-ink)] hover:underline">
              Daftar
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
