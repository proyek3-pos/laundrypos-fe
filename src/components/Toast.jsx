import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const push = useCallback((message, kind = "ok") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="no-print fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2 rounded-[10px] px-3 py-2.5 text-sm shadow-lg ${
              t.kind === "ok" ? "bg-surface text-ink border border-line" : "bg-danger-soft text-danger"
            }`}
          >
            {t.kind === "ok" ? (
              <CheckCircle size={18} weight="fill" className="text-ok shrink-0" aria-hidden="true" />
            ) : (
              <WarningCircle size={18} weight="fill" className="shrink-0" aria-hidden="true" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
