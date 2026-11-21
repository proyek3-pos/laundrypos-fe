import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "@phosphor-icons/react";
import { formatRp, formatTanggal } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { inputClass } from "../components/Field.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { StatusBadge, STATUS_LABELS } from "../components/StatusBadge.jsx";
import { EmptyState, ErrorState, Loading } from "../components/StateViews.jsx";

const STATUSES = ["", "pending", "diproses", "selesai", "diambil", "batal"];

export default function Orders() {
  useTitle("Pesanan: BubbleWash");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: "10" });
    if (status) p.set("status", status);
    if (q.trim()) p.set("q", q.trim());
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return `/transactions?${p.toString()}`;
  }, [page, status, q, from, to]);

  const { data, meta, loading, error, retry } = useApi(query);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pesanan</h1>
          <p className="mt-1 text-sm text-muted">Pantau status dan pembayaran setiap pesanan.</p>
        </div>
        <Link
          to="/app/kasir"
          className="inline-flex min-h-11 items-center gap-2 rounded-input bg-accent px-4 font-extrabold text-ink hover:bg-accent-deep hover:text-white"
        >
          <Receipt size={18} aria-hidden="true" /> Buat Pesanan
        </Link>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          className={inputClass}
          placeholder="Cari no. nota"
          aria-label="Cari nomor nota"
          value={q}
          onChange={(e) => resetPage(setQ)(e.target.value)}
        />
        <select
          className={inputClass}
          aria-label="Filter status"
          value={status}
          onChange={(e) => resetPage(setStatus)(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "" ? "Semua status" : STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          type="date"
          className={inputClass}
          aria-label="Dari tanggal"
          value={from}
          onChange={(e) => resetPage(setFrom)(e.target.value)}
        />
        <input
          type="date"
          className={inputClass}
          aria-label="Sampai tanggal"
          value={to}
          onChange={(e) => resetPage(setTo)(e.target.value)}
        />
      </div>

      <div className="mt-4 rounded-[14px] border border-line bg-surface">
        {loading ? (
          <Loading label="Memuat pesanan" />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            title="Belum ada pesanan yang cocok"
            description="Pesanan baru dari kasir akan muncul di sini, atau ubah filter pencarian."
            action={
              <Link
                to="/app/kasir"
                className="inline-flex min-h-11 items-center gap-2 rounded-input bg-accent px-4 font-extrabold text-ink hover:bg-accent-deep hover:text-white"
              >
                Buka Kasir
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.map((tx) => (
              <li key={tx.id}>
                <Link to={`/app/pesanan/${tx.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5 hover:bg-primary-soft sm:px-5">
                  <div className="min-w-0">
                    <p className="font-bold tabular-nums">{tx.invoiceNumber || "-"}</p>
                    <p className="truncate text-sm text-muted">
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
      </div>
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
