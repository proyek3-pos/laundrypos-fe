import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { formatRp, formatTanggal } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { ErrorState, Loading } from "../components/StateViews.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";

// Nota cetak 80mm. Motif gelombang sabun ada di header nota (DESIGN.md).
export default function Receipt() {
  const { id } = useParams();
  useTitle("Nota: BubbleWash");
  const { data: tx, loading, error, retry } = useApi(`/transactions/${id}`);

  if (loading) return <Loading label="Memuat nota" />;
  if (error) {
    return (
      <div className="mx-auto max-w-sm">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  }
  if (!tx) return null;

  return (
    <div className="mx-auto max-w-sm">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link to={`/app/pesanan/${tx.id}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-primary dark:text-sky-300 hover:underline">
          <ArrowLeft size={18} aria-hidden="true" /> Kembali ke pesanan
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
        >
          <Printer size={18} aria-hidden="true" /> Cetak
        </button>
      </div>

      <article className="rounded-[14px] border border-line bg-surface p-5 shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <div className="text-primary dark:text-sky-300">
          <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="h-4 w-full" aria-hidden="true" focusable="false">
            <path d="M0 16 C 240 32 480 0 720 12 C 960 24 1200 8 1440 16 L1440 32 L0 32 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="mt-2 text-center">
          <p className="text-lg font-extrabold">BubbleWash</p>
          <p className="text-xs text-muted">Nota pesanan laundry</p>
        </div>
        <div className="mt-4 space-y-1 border-y border-dashed border-line py-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted">No. Nota</span>
            <span className="font-bold tabular-nums">{tx.invoiceNumber || "-"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Tanggal</span>
            <span className="tabular-nums">{formatTanggal(tx.transactionDate)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Pelanggan</span>
            <span className="font-semibold">{tx.customer?.fullName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Telepon</span>
            <span className="tabular-nums">{tx.customer?.phoneNumber}</span>
          </div>
        </div>
        <ul className="my-3 space-y-2 text-sm">
          {tx.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                {item.service?.serviceName || "Layanan"}
                <span className="block text-xs text-muted">
                  {item.quantity.toLocaleString("id-ID")} {item.service?.unit === "kg" ? "kg" : "item"} × {formatRp(item.unitPrice)}
                </span>
              </span>
              <span className="font-semibold tabular-nums">{formatRp(item.totalPrice)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-dashed border-line pt-3">
          <span className="font-bold">TOTAL</span>
          <span className="text-xl font-extrabold tabular-nums">{formatRp(tx.totalAmount)}</span>
        </div>
        <div className="mt-3 space-y-1 border-t border-dashed border-line pt-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted">Pembayaran</span>
            <span className="font-semibold">{tx.paymentMethod ? tx.paymentMethod.toUpperCase() : "Belum dibayar"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Status</span>
            <StatusBadge status={tx.paymentStatus} />
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Pesanan</span>
            <StatusBadge status={tx.status} />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">Terima kasih. Simpan nota ini untuk mengambil pesanan.</p>
      </article>
    </div>
  );
}
