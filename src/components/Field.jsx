export const inputClass =
  "w-full min-h-11 rounded-[10px] border border-line bg-surface px-3 py-2.5 text-ink placeholder:text-muted/70 " +
  "focus:border-primary focus:outline-none disabled:opacity-60";

export function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
