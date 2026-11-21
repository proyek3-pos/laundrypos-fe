import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CashRegister,
  ChartLineUp,
  DotsThree,
  Moon,
  Receipt,
  SignOut,
  Sun,
  UsersThree,
  Wallet,
  WashingMachine,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/app/kasir", label: "Kasir", icon: CashRegister, admin: false },
  { to: "/app/pesanan", label: "Pesanan", icon: Receipt, admin: false },
  { to: "/app/pelanggan", label: "Pelanggan", icon: UsersThree, admin: false },
  { to: "/app/pembayaran", label: "Pembayaran", icon: Wallet, admin: false },
  { to: "/app/dashboard", label: "Dashboard", icon: ChartLineUp, admin: true },
  { to: "/app/layanan", label: "Layanan", icon: WashingMachine, admin: true },
];

export function AppShell() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [moreOpen, setMoreOpen] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  const items = NAV.filter((n) => !n.admin || isAdmin);
  const mainItems = items.slice(0, 4);
  const extraItems = items.slice(4);

  return (
    <div className="min-h-dvh">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface md:flex">
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="Logo LaundryPOS" className="h-9 w-9" width={36} height={36} />
          <span className="text-lg font-extrabold tracking-tight">LaundryPOS</span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Menu utama">
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-[10px] px-3 font-semibold ${
                  isActive ? "bg-primary-soft text-primary-deep" : "text-ink hover:bg-primary-soft"
                }`
              }
            >
              <n.icon size={20} aria-hidden="true" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line px-5 py-4">
          <p className="text-sm font-bold">{user.username}</p>
          <p className="text-xs capitalize text-muted">{user.role}</p>
          <div className="mt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Pakai mode terang" : "Pakai mode gelap"}
              className="rounded-input p-2.5 text-ink hover:bg-primary-soft"
            >
              {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={doLogout}
              className="inline-flex min-h-11 items-center gap-2 rounded-input px-3 text-sm font-semibold text-danger hover:bg-danger-soft"
            >
              <SignOut size={18} aria-hidden="true" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="Logo LaundryPOS" className="h-8 w-8" width={32} height={32} />
          <span className="font-extrabold">LaundryPOS</span>
        </div>
        <div className="flex items-center gap-1">
          {extraItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Menu lainnya"
              className="rounded-input p-2.5 text-ink hover:bg-primary-soft"
            >
              <DotsThree size={20} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Pakai mode terang" : "Pakai mode gelap"}
            className="rounded-input p-2.5 text-ink hover:bg-primary-soft"
          >
            {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={doLogout}
            aria-label="Keluar"
            className="rounded-input p-2.5 text-danger hover:bg-danger-soft"
          >
            <SignOut size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="md:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-5 pb-28 sm:px-6 md:pb-10">
          <Outlet />
        </div>
      </main>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface md:hidden"
        aria-label="Menu utama"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {mainItems.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                isActive ? "text-primary-deep" : "text-muted"
              }`
            }
          >
            <n.icon size={22} aria-hidden="true" />
            {n.label}
          </NavLink>
        ))}
      </nav>

      {moreOpen && (
        <div className="no-print fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Menu lainnya">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[14px] bg-surface p-4 pb-8">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold">Menu lainnya</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Tutup"
                className="rounded-input p-2 text-ink hover:bg-primary-soft"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {extraItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMoreOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-[10px] px-3 font-semibold hover:bg-primary-soft"
              >
                <n.icon size={20} aria-hidden="true" /> {n.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 font-semibold hover:bg-primary-soft"
            >
              {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              {dark ? "Mode terang" : "Mode gelap"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
