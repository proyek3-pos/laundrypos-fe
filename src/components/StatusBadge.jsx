const STATUS_STYLES = {
  pending: "bg-primary-soft text-primary-deep dark:text-white",
  diproses: "bg-warn-soft text-warn",
  selesai: "bg-ok-soft text-ok",
  diambil: "bg-surface text-muted border border-line",
  batal: "bg-danger-soft text-danger",
  unpaid: "bg-danger-soft text-danger",
  paid: "bg-ok-soft text-ok",
  failed: "bg-danger-soft text-danger",
};

export const STATUS_LABELS = {
  pending: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  diambil: "Diambil",
  batal: "Batal",
  unpaid: "Belum lunas",
  paid: "Lunas",
  failed: "Gagal",
};

// Chip status: warna + teks (bukan warna saja, R-39).
export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-surface text-muted border border-line";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${style}`}>
      {label}
    </span>
  );
}
