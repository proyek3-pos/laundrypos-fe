import { useState } from "react";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { api, formatRp } from "../api/client.js";
import { useApi, useTitle } from "../hooks/useApi.js";
import { Field, inputClass } from "../components/Field.jsx";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/Toast.jsx";
import { EmptyState, ErrorState, Loading } from "../components/StateViews.jsx";

const emptyForm = { id: null, serviceName: "", description: "", unitPrice: "", unit: "kg" };

export default function Services() {
  useTitle("Layanan: BubbleWash");
  const toast = useToast();
  const { data, loading, error, retry } = useApi("/services");
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    const price = Number(String(form.unitPrice).replace(",", "."));
    if (!price || price <= 0) {
      toast("Harga harus lebih dari 0.", "error");
      return;
    }
    setBusy(true);
    try {
      const body = { serviceName: form.serviceName, description: form.description, unitPrice: price, unit: form.unit };
      if (form.id) {
        await api.put(`/services/${form.id}`, body);
        toast("Layanan diperbarui.");
      } else {
        await api.post("/services", body);
        toast("Layanan ditambahkan.");
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
      await api.del(`/services/${toDelete.id}`);
      toast("Layanan dihapus.");
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
          <h1 className="text-2xl font-extrabold tracking-tight">Layanan</h1>
          <p className="mt-1 text-sm text-muted">Daftar harga yang dipakai kasir saat mencatat pesanan.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...emptyForm })}
          className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
        >
          <Plus size={18} aria-hidden="true" /> Tambah Layanan
        </button>
      </div>

      <div className="mt-4 rounded-[14px] border border-line bg-surface">
        {loading ? (
          <Loading label="Memuat layanan" />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            title="Belum ada layanan"
            description="Kasir tidak bisa mencatat pesanan sebelum ada layanan. Tambahkan layanan pertama, misalnya Cuci Kering per kg."
            action={
              <button
                type="button"
                onClick={() => setForm({ ...emptyForm })}
                className="inline-flex min-h-11 items-center gap-2 rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep"
              >
                <Plus size={18} aria-hidden="true" /> Tambah Layanan
              </button>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="font-bold">{s.serviceName}</p>
                  <p className="text-sm text-muted">
                    {formatRp(s.unitPrice)}/{s.unit}
                    {s.description ? ` · ${s.description}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ id: s.id, serviceName: s.serviceName, description: s.description || "", unitPrice: String(s.unitPrice), unit: s.unit })
                    }
                    aria-label={`Edit ${s.serviceName}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-input px-3 font-semibold text-primary-deep dark:text-sky-300 hover:bg-primary-soft"
                  >
                    <PencilSimple size={18} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(s)}
                    aria-label={`Hapus ${s.serviceName}`}
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

      <Modal open={form !== null} onClose={() => setForm(null)} title={form?.id ? "Edit layanan" : "Tambah layanan"}>
        {form && (
          <form onSubmit={save}>
            <Field label="Nama layanan" htmlFor="sName">
              <input
                id="sName"
                type="text"
                className={inputClass}
                value={form.serviceName}
                onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              />
            </Field>
            <Field label="Deskripsi" htmlFor="sDesc" hint="Opsional">
              <input
                id="sDesc"
                type="text"
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga" htmlFor="sPrice">
                <input
                  id="sPrice"
                  type="text"
                  inputMode="decimal"
                  className={inputClass + " tabular-nums"}
                  placeholder="8000"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                />
              </Field>
              <Field label="Satuan" htmlFor="sUnit">
                <select id="sUnit" className={inputClass} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  <option value="kg">kg (boleh desimal)</option>
                  <option value="item">item (bilangan bulat)</option>
                </select>
              </Field>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-input bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? "Menyimpan..." : "Simpan Layanan"}
            </button>
          </form>
        )}
      </Modal>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} title="Hapus layanan?">
        {toDelete && (
          <div>
            <p className="text-sm text-muted">
              Layanan <span className="font-bold text-ink">{toDelete.serviceName}</span> tidak akan muncul lagi di kasir.
              Pesanan lama yang memakai layanan ini tetap tersimpan.
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
