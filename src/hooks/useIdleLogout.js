import { useEffect, useRef } from "react";

const IDLE_MS = 15 * 60 * 1000;

// shortcut: idle logout hanya ditegakkan di client (server tak tahu aktivitas
// kasir); server-side tetap aman karena logout mencabut token. Upgrade kalau
// butuh kepatuhan lebih ketat.
export function useIdleLogout(onIdle, enabled = true) {
  const last = useRef(Date.now());
  const cb = useRef(onIdle);
  cb.current = onIdle;

  useEffect(() => {
    if (!enabled) return;
    const bump = () => {
      last.current = Date.now();
    };
    const evts = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    evts.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const iv = setInterval(() => {
      if (Date.now() - last.current >= IDLE_MS) {
        clearInterval(iv);
        cb.current();
      }
    }, 15000);

    return () => {
      evts.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(iv);
    };
  }, [enabled]);
}
