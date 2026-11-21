import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass, Plus, Trash, UserPlus } from "@phosphor-icons/react";
import { api, formatRp } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { Field, inputClass } from "../components/Field.jsx";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/Toast.jsx";
import { ErrorState, Loading } from "../components/StateViews.jsx";

export default function Kasir() {
  useTitle("Kasir: BubbleWash");
  const navigate = useNavigate();
  const toast = useToast();

  // Pelanggan: cari yang terdaftar, atau tambah cepat kalau belum ada.
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const { data: services, loading: svcLoading, error: svcError, retry: svcRetry } = useApi("/services");

  const [cart, setCart] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [qty, setQty] = useState("");
  const [method, setMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = (services ?? []).find((s) => s.id === serviceId);
  const total = useMemo(() => cart.reduce((s, i) => s + i.subtotal, 0), [cart]);
  const paid = Number(amountPaid || 0);
  const change = method === "cash" && amountPaid !== "" ? paid - total : null;

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setSearchError(false);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      setSearchError(false);
      try {
        const res = await api.get(`/customers?limit=5&q=${encodeURIComponent(search.trim())}`);
        setResults(res.data ?? []);
      } catch {
        // Bedakan gagal-jaringan dari "tidak ada hasil": kasir tidak harus
        // menyangka pelanggan belum terdaftar padahal server tak terjangkau.
        setResults([]);
        setSearchError(true);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const quickAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customers", { fullName: newName, phoneNumber: newPhone, email: "" });
      setCustomer(res.data);
      setSearch("");
      setResults([]);
      setAddOpen(false);
      setNewName("");
      setNewPhone("");
      toast("Pelanggan ditambahkan.");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    const q = Number(qty.replace(",", "."));
    if (!selected) {
      toast("Pilih layanan dulu.", "error");
      return;
    }
    if (!q || q <= 0) {
      toast("Isi jumlah dengan benar.", "error");
      return;
    }
    if (selected.unit === "item" && !Number.isInteger(q)) {
      toast("Layanan per item harus bilangan bulat.", "error");
      return;
    }
    setCart((c) => {
      const i = c.findIndex((x) => x.serviceId === selected.id);
      if (i >= 0) {
        const copy = [...c];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + q, subtotal: (copy[i].quantity + q) * selected.unitPrice };
        return copy;
      }
      return [
        ...c,
        {
          serviceId: selected.id,
          name: selected.serviceName,
          unit: selected.unit,
          unitPrice: selected.unitPrice,
          quantity: q,
          subtotal: q * selected.unitPrice,
        },
      ];
    });
    setQty("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!customer) {
      toast("Pilih pelanggan dulu.", "error");
      return;
    }
    if (cart.length === 0) {
      toast("Tambahkan minimal satu item.", "error");
      return;
    }
    if (method === "cash" && paid < total) {
      toast("Uang diterima kurang dari total.", "error");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post("/transactions", {
        customerId: customer.id,
        items: cart.map((i) => ({ serviceId: i.serviceId, quantity: i.quantity })),
      });
      const tx = res.data;
      if (method === "cash") {
        await api.post("/payments/cash", { transactionId: tx.id, amountPaid: paid });
      } else {
        const pay = await api.post("/payments/midtrans", { transactionId: tx.id });
        const url = pay.data?.snap_url;
        if (url && !window.open(url, "_blank", "noopener")) {
          toast("Popup pembayaran diblokir. Buka tautan dari detail pesanan.", "error");
        }
      }
      navigate(`/app/pesanan/${tx.id}/nota`);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Kasir</h1>
      <p className="mt-1 text-sm text-muted">Catat pesanan baru: pelanggan, item, lalu bayar.</p>

      <form onSubmit={submit} className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]" noValidate>
        <div className="space-y-5">
          <section className="rounded-[14px] border border-line bg-surface p-4 sm:p-5">
            <h2 className="mb-3 font-bold">1. Pelanggan</h2>
            {customer ? (
              <div className="flex items-center justify-between gap-3 rounded-input bg-primary-soft px-3 py-2.5">
                <div>
                  <p className="font-bold">{customer.fullName}</p>
                  <p className="text-xs text-muted">{customer.phoneNumber}</p>
                </div>
                <button type="button" onClick={() => setCustomer(null)} className="font-bold text-primary-deep dark:text-white hover:underline">
                  Ganti
                </button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    className={inputClass + " pl-10"}
                    placeholder="Cari nama pelanggan"
                    aria-label="Cari nama pelanggan"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {searching && <p className="mt-2 text-xs text-muted">Mencari...</p>}
                {results.length > 0 && (
                  <ul className="mt-2 divide-y divide-line rounded-input border border-line bg-surface">
                    {results.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomer(c);
                            setSearch("");
                            setResults([]);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-primary-soft"
                        >
                          <span className="font-semibold">{c.fullName}</span>
                          <span className="text-xs text-muted">{c.phoneNumber}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {search.trim() && !searching && results.length === 0 && searchError && (
                  <p className="mt-2 text-sm font-semibold text-danger" role="alert">
                    Gagal mencari. Periksa koneksi internet lalu coba lagi.
                  </p>
                )}
                {search.trim() && !searching && results.length === 0 && !searchError && (
                  <p className="mt-2 text-sm text-muted">
                    Tidak ada yang cocok.{" "}
                    <button type="button" onClick={() => setAddOpen(true)} className="font-bold text-primary dark:text-sky-300 hover:underline">
                      Tambah pelanggan baru
                    </button>
                  </p>
                )}
                {!search && (
                  <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-sky-300 hover:underline"
                  >
                    <UserPlus size={18} aria-hidden="true" /> Pelanggan belum terdaftar? Tambah cepat
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="rounded-[14px] border border-line bg-surface p-4 sm:p-5">
            <h2 className="mb-3 font-bold">2. Item pesanan</h2>
            {svcLoading ? (
              <Loading label="Memuat layanan" />
            ) : svcError ? (
              <ErrorState message={svcError} onRetry={svcRetry} />
            ) : (services ?? []).length === 0 ? (
              <p className="text-sm text-muted">Belum ada layanan. Minta admin menambahkan layanan di menu Layanan.</p>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Field label="Layanan" htmlFor="service">
                      <select id="service" className={inputClass} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                        <option value="">Pilih layanan</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.serviceName} ({formatRp(s.unitPrice)}/{s.unit})
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="w-full sm:w-36">
                    <Field label={selected?.unit === "item" ? "Jumlah (item)" : "Berat (kg)"} htmlFor="qty">
                      <input
                        id="qty"
                        type="text"
                        inputMode="decimal"
                        className={inputClass}
                        placeholder={selected?.unit === "item" ? "mis. 2" : "mis. 4,5"}
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
                  >
                    <Plus size={18} aria-hidden="true" /> Tambah
                  </button>
                </div>
                {cart.length > 0 && (
                  <ul className="mt-3 divide-y divide-line border-t border-line">
                    {cart.map((i) => (
                      <li key={i.serviceId} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{i.name}</p>
                          <p className="text-xs text-muted">
                            {i.quantity.toLocaleString("id-ID")} {i.unit === "kg" ? "kg" : "item"} × {formatRp(i.unitPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold tabular-nums">{formatRp(i.subtotal)}</span>
                          <button
                            type="button"
                            onClick={() => setCart((c) => c.filter((x) => x.serviceId !== i.serviceId))}
                            aria-label={`Hapus ${i.name} dari pesanan`}
                            className="rounded-input p-2 text-danger hover:bg-danger-soft"
                          >
                            <Trash size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-[14px] border border-line bg-surface p-4 sm:p-5 lg:sticky lg:top-5">
          <h2 className="mb-3 font-bold">3. Ringkasan & bayar</h2>
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <span className="text-sm text-muted">Total</span>
            <span className="text-2xl font-extrabold tabular-nums">{formatRp(total)}</span>
          </div>
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-semibold">Metode bayar</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "cash", label: "Cash" },
                { v: "midtrans", label: "Midtrans" },
              ].map((m) => (
                <label
                  key={m.v}
                  className={`flex min-h-11 cursor-pointer items-center justify-center rounded-input border px-3 font-semibold has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-primary-deep dark:has-[:checked]:text-white ${
                    method === m.v ? "border-primary bg-primary-soft text-primary-deep dark:text-white" : "border-line bg-surface text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.v}
                    checked={method === m.v}
                    onChange={() => setMethod(m.v)}
                    className="sr-only"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>
          {method === "cash" ? (
            <div className="mt-4">
              <Field label="Uang diterima" htmlFor="amountPaid" hint="Klik total untuk mengisi uang pas">
                <input
                  id="amountPaid"
                  type="text"
                  inputMode="numeric"
                  className={inputClass + " tabular-nums"}
                  placeholder={String(total)}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </Field>
              {change !== null && (
                <div
                  className={`flex items-baseline justify-between rounded-input px-3 py-2.5 ${
                    change < 0 ? "bg-danger-soft text-danger" : "bg-ok-soft text-ok"
                  }`}
                >
                  <span className="text-sm font-semibold">{change < 0 ? "Kurang bayar" : "Kembalian"}</span>
                  <span className="text-lg font-extrabold tabular-nums">{formatRp(Math.abs(change))}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 rounded-input bg-primary-soft px-3 py-2.5 text-sm text-primary-deep dark:text-white">
              Setelah pesanan dibuat, halaman pembayaran Midtrans terbuka di tab baru.
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !customer || cart.length === 0}
            className="mt-4 min-h-11 w-full rounded-input bg-accent px-4 font-extrabold text-ink hover:bg-accent-deep hover:text-white disabled:opacity-50"
          >
            {busy ? "Menyimpan..." : "Buat Pesanan"}
          </button>
          <p className="mt-2 text-xs text-muted">Harga dihitung ulang oleh server dari daftar harga resmi.</p>
        </aside>
      </form>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tambah pelanggan">
        <form onSubmit={quickAdd}>
          <Field label="Nama lengkap" htmlFor="newName">
            <input id="newName" type="text" className={inputClass} value={newName} onChange={(e) => setNewName(e.target.value)} />
          </Field>
          <Field label="Nomor telepon" htmlFor="newPhone" hint="8-15 digit, mis. 081234567890">
            <input id="newPhone" type="tel" className={inputClass} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          </Field>
          <button type="submit" className="min-h-11 w-full rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep">
            Simpan Pelanggan
          </button>
        </form>
      </Modal>
    </div>
  );
}
