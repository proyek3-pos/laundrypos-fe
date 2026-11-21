import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { api, formatRp, formatTanggal } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { inputClass } from "../components/Field.jsx";
import { swalConfirm, swalErr, swalOk, swalWarn } from "../lib/swal.js";
import { StatusBadge, STATUS_LABELS } from "../components/StatusBadge.jsx";
import { ErrorState, Loading } from "../components/StateViews.jsx";

// Transisi berikutnya per status, harus sama dengan aturan server.
const NEXT = {
  pending: ["diproses", "batal"],
  diproses: ["selesai", "batal"],
  selesai: ["diambil"],
  diambil: [],
  batal: [],
};

export default function OrderDetail() {
  const { id } = useParams();
  useTitle("Detail pesanan: BubbleWash");
  const { data: tx, loading, error, retry } = useApi(`/transactions/${id}`);

  const [cashOpen, setCashOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <Loading label="Memuat pesanan" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!tx) return null;

  const move = async (status) => {
    // Validasi + konfirmasi sebelum tiap perubahan status.
    const ok = await swalConfirm({
      title: "Ubah status pesanan?",
      text:
        status === "batal"
          ? "Pesanan yang dibatalkan tidak bisa dibayar dan tidak bisa lanjut diproses."
          : `Pesanan akan ditandai "${STATUS_LABELS[status]}".`,
      confirmText: `Ya, tandai ${STATUS_LABELS[status]}`,
      danger: status === "batal",
    });
    if (!ok) return;
    setBusy(true);
    try {
      await api.patch(`/transactions/${tx.id}/status`, { status });
      swalOk(`Status pesanan jadi ${STATUS_LABELS[status]}.`);
      retry();
    } catch (err) {
      swalErr(err.message);
    } finally {
      setBusy(false);
    }
  };

  const payCash = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/payments/cash", { transactionId: tx.id, amountPaid: Number(amount) });
      swalOk("Pembayaran cash dicatat.");
      setCashOpen(false);
      setAmount("");
      retry();
    } catch (err) {
      swalErr(err.message);
    } finally {
      setBusy(false);
    }
  };

  const payMidtrans = async () => {
    setBusy(true);
    try {
      const res = await api.post("/payments/midtrans", { transactionId: tx.id });
      const url = res.data?.snap_url;
      if (url && !window.open(url, "_blank", "noopener")) {
        swalErr("Popup diblokir browser. Izinkan popup lalu coba lagi.");
      }
      retry();
    } catch (err) {
      swalErr(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/pesanan" className="inline-flex min-h-11 items-center gap-2 font-bold text-primary dark:text-sky-300 hover:underline">
          <ArrowLeft size={18} aria-hidden="true" /> Semua pesanan
        </Link>
        <Link
          to={`/app/pesanan/${tx.id}/nota`}
          className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
        >
          <Printer size={18} aria-hidden="true" /> Cetak Nota
        </Link>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <section className="rounded-[14px] border border-line bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold tabular-nums">{tx.invoiceNumber || "-"}</h1>
                <p className="mt-1 text-sm text-muted">{formatTanggal(tx.transactionDate)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={tx.status} />
                <StatusBadge status={tx.paymentStatus} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted">Pelanggan</p>
                <p className="font-bold">{tx.customer?.fullName}</p>
              </div>
              <div>
                <p className="text-muted">Telepon</p>
                <p className="font-semibold tabular-nums">{tx.customer?.phoneNumber}</p>
              </div>
            </div>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {tx.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.service?.serviceName || "Layanan"}</p>
                    <p className="text-xs text-muted">
                      {item.quantity.toLocaleString("id-ID")} {item.service?.unit === "kg" ? "kg" : "item"} ×{" "}
                      {formatRp(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold tabular-nums">{formatRp(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-extrabold tabular-nums">{formatRp(tx.totalAmount)}</span>
            </div>
          </section>

          <section className="rounded-[14px] border border-line bg-surface p-4 sm:p-5">
            <h2 className="mb-3 font-bold">Riwayat status</h2>
            {tx.statusHistory?.length ? (
              <ol className="space-y-3">
                {[...tx.statusHistory].reverse().map((ev, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? "bg-primary" : "bg-line"}`}
                    />
                    <div className="text-sm">
                      <p className="font-bold">{STATUS_LABELS[ev.status] ?? ev.status}</p>
                      <p className="text-muted">
                        {formatTanggal(ev.at)}
                        {ev.by ? ` · oleh ${ev.by}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">Belum ada perubahan status.</p>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-[14px] border border-line bg-surface p-4 sm:p-5 lg:sticky lg:top-5">
          <div>
            <h2 className="font-bold">Pembayaran</h2>
            {tx.status === "batal" ? (
              <p className="mt-2 rounded-input bg-danger-soft px-3 py-2.5 text-sm text-danger">
                Pesanan dibatalkan, pembayaran ditutup.
              </p>
            ) : tx.paymentStatus === "paid" ? (
              <div className="mt-2 rounded-input bg-ok-soft px-3 py-2.5 text-sm text-ok">
                <p className="font-bold">Lunas</p>
                <p>
                  {tx.paymentMethod === "cash" ? "Cash" : tx.paymentMethod || "Digital"}
                  {tx.paidAt ? ` · ${formatTanggal(tx.paidAt)}` : ""}
                </p>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                {!cashOpen ? (
                  <>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setCashOpen(true)}
                      className="min-h-11 w-full rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
                    >
                      Bayar Cash
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={payMidtrans}
                      className="min-h-11 w-full rounded-input border border-line bg-surface px-4 font-bold text-ink hover:bg-primary-soft disabled:opacity-60"
                    >
                      Bayar via Midtrans
                    </button>
                  </>
                ) : (
                  <form onSubmit={payCash}>
                    <label htmlFor="amount" className="mb-1.5 block text-sm font-semibold">
                      Uang diterima
                    </label>
                    <input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      className={inputClass + " tabular-nums"}
                      placeholder={String(tx.totalAmount)}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                    {amount !== "" && Number(amount) < tx.totalAmount && (
                      <p className="mt-1 text-xs font-semibold text-danger" role="alert">
                        Kurang {formatRp(tx.totalAmount - Number(amount))}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="submit"
                        disabled={busy}
                        className="min-h-11 flex-1 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
                      >
                        Simpan Bayar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashOpen(false)}
                        className="min-h-11 rounded-input border border-line px-4 font-bold text-ink hover:bg-primary-soft"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {NEXT[tx.status]?.length > 0 && (
            <div className="border-t border-line pt-4">
              <h2 className="font-bold">Ubah status</h2>
              <div className="mt-2 grid gap-2">
                {NEXT[tx.status].map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => move(s)}
                    className={`min-h-11 rounded-input px-4 font-bold disabled:opacity-60 ${
                      s === "batal"
                        ? "border border-line bg-surface text-danger hover:bg-danger-soft"
                        : "bg-primary px-4 text-white hover:bg-primary-deep"
                    }`}
                  >
                    Tandai {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
