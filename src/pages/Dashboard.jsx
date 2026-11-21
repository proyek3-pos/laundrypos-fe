import { Link } from "react-router-dom";
import { DownloadSimple } from "@phosphor-icons/react";
import { api, formatRp, formatTanggal } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { EmptyState, ErrorState, Loading } from "../components/StateViews.jsx";

// Job layar ini: kasir pemilik mau tahu "berapa masuk hari ini, apa yang belum lunas".
// Angka hanya dari /reports/summary, tanpa delta yang tidak dihitung dari data.
export default function Dashboard() {
  useTitle("Dashboard: LaundryPOS");
  const { data: sum, loading, error, retry } = useApi("/reports/summary");
  const { data: recent, loading: recentLoading } = useApi("/transactions?limit=5");

  const exportCsv = async () => {
    try {
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      const from = `${firstOfMonth.getFullYear()}-${String(firstOfMonth.getMonth() + 1).padStart(2, "0")}-01`;
      const res = await api.get(`/transactions?limit=100&from=${from}`);
      const rows = [["No Nota", "Tanggal", "Pelanggan", "Total", "Status", "Pembayaran"]];
      (res.data ?? []).forEach((t) =>
        rows.push([
          t.invoiceNumber,
          new Date(t.transactionDate).toLocaleString("id-ID"),
          t.customer?.fullName ?? "",
          t.totalAmount,
          t.status,
          t.paymentStatus === "paid" ? `lunas (${t.paymentMethod || "digital"})` : "belum lunas",
        ]),
      );
      const csv = rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pesanan-${from}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // toast di level halaman: pakai alert inline sederhana
      alert(`Gagal mengunduh CSV: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Ringkasan pendapatan dan pesanan laundry.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex min-h-11 items-center gap-2 rounded-input border border-line bg-surface px-4 font-bold text-ink hover:bg-primary-soft"
        >
          <DownloadSimple size={18} aria-hidden="true" /> Unduh CSV (bulan ini)
        </button>
      </div>

      {loading ? (
        <Loading label="Menghitung ringkasan" />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[14px] bg-primary p-5 text-white">
              <p className="text-sm font-semibold opacity-90">Pendapatan hari ini</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums">{formatRp(sum?.revenueToday ?? 0)}</p>
              <p className="mt-1 text-xs opacity-90">Dari pesanan yang sudah lunas.</p>
            </div>
            <div className="rounded-[14px] border border-line bg-surface p-5">
              <p className="text-sm font-semibold text-muted">Pendapatan bulan ini</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums">{formatRp(sum?.revenueMonth ?? 0)}</p>
              <p className="mt-1 text-xs text-muted">Sejak tanggal 1.</p>
            </div>
            <div className="rounded-[14px] border border-line bg-surface p-5">
              <p className="text-sm font-semibold text-muted">Pesanan hari ini</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums">{sum?.ordersToday ?? 0}</p>
            </div>
            <div className="rounded-[14px] border border-line bg-surface p-5">
              <p className="text-sm font-semibold text-muted">Belum lunas</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums">{sum?.unpaidCount ?? 0}</p>
              <p className="mt-1 text-xs text-muted">Pesanan yang menunggu pembayaran.</p>
            </div>
          </div>

          <section className="mt-6 rounded-[14px] border border-line bg-surface">
            <div className="flex items-center justify-between px-5 pt-4">
              <h2 className="font-bold">Pesanan terbaru</h2>
              <Link to="/app/pesanan" className="font-bold text-primary hover:underline">
                Lihat semua
              </Link>
            </div>
            {recentLoading ? (
              <Loading label="Memuat pesanan" />
            ) : (recent ?? []).length === 0 ? (
              <EmptyState
                title="Belum ada pesanan"
                description="Pesanan pertama dari kasir akan muncul di sini."
              />
            ) : (
              <ul className="mt-2 divide-y divide-line border-t border-line">
                {recent.map((tx) => (
                  <li key={tx.id}>
                    <Link to={`/app/pesanan/${tx.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3.5 hover:bg-primary-soft">
                      <div className="min-w-0">
                        <p className="font-bold tabular-nums">{tx.invoiceNumber || "-"}</p>
                        <p className="text-sm text-muted">
                          {tx.customer?.fullName} · {formatTanggal(tx.transactionDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <StatusBadge status={tx.status} />
                          <StatusBadge status={tx.paymentStatus} />
                        </div>
                        <span className="font-extrabold tabular-nums">{formatRp(tx.totalAmount)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
