// Motif identitas: gelombang sabun (DESIGN.md).
// Hanya dipakai di halaman auth, empty state, dan header nota.
export function Wave({ className }) {
  return (
    <svg viewBox="0 0 1440 64" className={className} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 32 C 240 64 480 0 720 24 C 960 48 1200 16 1440 32 L1440 64 L0 64 Z" fill="currentColor" />
    </svg>
  );
}
