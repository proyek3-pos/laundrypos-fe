import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function Pagination({ meta, onPage }) {
  if (!meta) return null;
  const pages = Math.max(1, Math.ceil(meta.total / meta.limit));
  if (pages <= 1) return null;

  return (
    <nav className="mt-4 flex items-center justify-between gap-4" aria-label="Navigasi halaman">
      <button
        type="button"
        onClick={() => onPage(meta.page - 1)}
        disabled={meta.page <= 1}
        aria-label="Halaman sebelumnya"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-input border border-line bg-surface text-ink hover:bg-primary-soft disabled:opacity-40"
      >
        <CaretLeft size={18} aria-hidden="true" />
      </button>
      <p className="text-sm text-muted">
        Halaman {meta.page} dari {pages}
      </p>
      <button
        type="button"
        onClick={() => onPage(meta.page + 1)}
        disabled={meta.page >= pages}
        aria-label="Halaman berikutnya"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-input border border-line bg-surface text-ink hover:bg-primary-soft disabled:opacity-40"
      >
        <CaretRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
