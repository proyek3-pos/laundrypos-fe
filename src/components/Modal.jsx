import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";

// Dialog sederhana: tutup dengan Escape atau klik backdrop.
export function Modal({ open, onClose, title, children, wide }) {
  const panelRef = useRef(null);
  // onClose dipisah ke ref supaya efek hanya jalan saat open berubah,
  // bukan setiap re-render (yang akan mencuri fokus dari input form).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-t-[14px] bg-surface p-5 shadow-lg outline-none sm:rounded-[14px] sm:p-6 ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-input p-2 text-muted hover:bg-primary-soft hover:text-ink"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
