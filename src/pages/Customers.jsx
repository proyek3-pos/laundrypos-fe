import { useEffect, useMemo, useState } from "react";
import { PencilSimple, Trash, UserPlus } from "@phosphor-icons/react";
import { api } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { Field, inputClass } from "../components/Field.jsx";
import { Modal } from "../components/Modal.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { useToast } from "../components/Toast.jsx";
import { EmptyState, ErrorState, Loading } from "../components/StateViews.jsx";

const emptyForm = { id: null, fullName: "", phoneNumber: "", email: "" };

export default function Customers() {
  useTitle("Pelanggan: BubbleWash");
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: "10" });
    if (q.trim()) p.set("q", q.trim());
    return `/customers?${p.toString()}`;
  }, [page, q]);
  const { data, meta, loading, error, retry } = useApi(query);

  const [form, setForm] = useState(null); // null = tutup, objek = mode edit/tambah
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 0);
    return () => clearTimeout(t);
  }, [q]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (form.id) {
        await api.put(`/customers/${form.id}`, { fullName: form.fullName, phoneNumber: form.phoneNumber, email: form.email });
        toast("Data pelanggan diperbarui.");
      } else {
        await api.post("/customers", { fullName: form.fullName, phoneNumber: form.phoneNumber, email: form.email });
        toast("Pelanggan ditambahkan.");
      }
      setForm(null);
      retry();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`/customers/${toDelete.id}`);
      toast("Pelanggan dihapus.");
      setToDelete(null);
      retry();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pelanggan</h1>
          <p className="mt-1 text-sm text-muted">Daftar pelanggan laundry yang pernah dicatat.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...emptyForm })}
          className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
        >
          <UserPlus size={18} aria-hidden="true" /> Tambah Pelanggan
        </button>
      </div>

      <input
        type="search"
        className={inputClass + " mt-4"}
        placeholder="Cari nama pelanggan"
        aria-label="Cari nama pelanggan"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="mt-4 rounded-[14px] border border-line bg-surface">
        {loading ? (
          <Loading label="Memuat pelanggan" />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            title={q ? "Tidak ada pelanggan yang cocok" : "Belum ada pelanggan"}
            description={
              q
                ? "Coba kata kunci lain."
                : "Pelanggan bisa ditambah dari sini atau langsung saat mencatat pesanan di kasir."
            }
            action={
              !q && (
                <button
                  type="button"
                  onClick={() => setForm({ ...emptyForm })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
                >
                  <UserPlus size={18} aria-hidden="true" /> Tambah Pelanggan
                </button>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="font-bold">{c.fullName}</p>
                  <p className="text-sm text-muted tabular-nums">
                    {c.phoneNumber}
                    {c.email ? ` · ${c.email}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setForm({ id: c.id, fullName: c.fullName, phoneNumber: c.phoneNumber, email: c.email })}
                    aria-label={`Edit ${c.fullName}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-input px-3 font-semibold text-primary-deep dark:text-sky-300 hover:bg-primary-soft"
                  >
                    <PencilSimple size={18} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(c)}
                    aria-label={`Hapus ${c.fullName}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-input px-3 font-semibold text-danger hover:bg-danger-soft"
                  >
                    <Trash size={18} aria-hidden="true" /> Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination meta={meta} onPage={setPage} />

      <Modal open={form !== null} onClose={() => setForm(null)} title={form?.id ? "Edit pelanggan" : "Tambah pelanggan"}>
        {form && (
          <form onSubmit={save}>
            <Field label="Nama lengkap" htmlFor="cName">
              <input
                id="cName"
                type="text"
                className={inputClass}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </Field>
            <Field label="Nomor telepon" htmlFor="cPhone" hint="8-15 digit, mis. 081234567890">
              <input
                id="cPhone"
                type="tel"
                className={inputClass}
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="cEmail" hint="Opsional">
              <input
                id="cEmail"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? "Menyimpan..." : "Simpan Pelanggan"}
            </button>
          </form>
        )}
      </Modal>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} title="Hapus pelanggan?">
        {toDelete && (
          <div>
            <p className="text-sm text-muted">
              Data <span className="font-bold text-ink">{toDelete.fullName}</span> akan dihapus dari daftar. Pesanan yang
              sudah ada tetap tersimpan.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={remove}
                className="min-h-11 flex-1 rounded-input bg-danger px-4 font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={() => setToDelete(null)}
                className="min-h-11 rounded-input border border-line px-4 font-bold text-ink hover:bg-primary-soft"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
