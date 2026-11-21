import { ArrowClockwise, SpinnerGap } from "@phosphor-icons/react";
import { Wave } from "./Wave.jsx";

export function Loading({ label = "Memuat data" }) {
  return (
    <div className="py-16 text-center" role="status">
      <SpinnerGap size={28} className="mx-auto animate-spin text-primary dark:text-sky-300" aria-hidden="true" />
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

// Empty state dengan motif gelombang sabun dan satu aksi nyata.
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto mb-3 w-40 text-primary-soft">
        <Wave />
      </div>
      {icon && <div className="mb-2 text-primary dark:text-sky-300">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="py-14 text-center" role="alert">
      <p className="font-semibold text-danger">Gagal memuat data</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-input border border-line bg-surface px-4 font-semibold text-ink hover:bg-primary-soft"
        >
          <ArrowClockwise size={18} aria-hidden="true" /> Coba lagi
        </button>
      )}
    </div>
  );
}
