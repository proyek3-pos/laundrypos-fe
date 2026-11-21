import { useState } from "react";
import { Link } from "react-router-dom";
import { formatRp, formatTanggal } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { Pagination } from "../components/Pagination.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { EmptyState, ErrorState, Loading } from "../components/StateViews.jsx";

export default function Payments() {
  useTitle("Pembayaran: LaundryPOS");
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, retry } = useApi(`/payments?page=${page}&limit=15`);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Pembayaran</h1>
      <p className="mt-1 text-sm text-muted">Riwayat semua pembayaran, cash maupun Midtrans.</p>

      <div className="mt-4 rounded-[14px] border border-line bg-surface">
        {loading ? (
          <Loading label="Memuat pembayaran" />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            title="Belum ada pembayaran"
            description="Pembayaran muncul setelah ada pesanan yang dilunasi di kasir atau lewat detail pesanan."
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="font-bold capitalize">
                    {p.payment_method === "cash" ? "Cash" : p.payment_method || "Digital"}
                    {p.payment_method === "cash" && p.change > 0 ? ` · kembalian ${formatRp(p.change)}` : ""}
                  </p>
                  <p className="text-sm text-muted tabular-nums">
                    {formatTanggal(p.paid_at || p.created_at)}
                    {p.order_id ? ` · ${p.order_id.slice(0, 8)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <span className="font-extrabold tabular-nums">{formatRp(p.gross_amount)}</span>
                  <Link
                    to={`/app/pesanan/${p.transactionId}`}
                    className="font-bold text-primary dark:text-sky-300 hover:underline"
                    aria-label={`Lihat pesanan untuk pembayaran ${p.gross_amount}`}
                  >
                    Pesanan
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
