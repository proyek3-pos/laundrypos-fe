import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client.js";

// Ambil satu endpoint GET: state {data, meta, loading, error} + retry.
// Path boleh null/undefined supaya pemanggil bisa menunggu parameter.
export function useApi(path) {
  const [state, setState] = useState({ data: null, meta: null, loading: Boolean(path), error: null });
  const [tick, setTick] = useState(0);
  const retry = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(path)
      .then((payload) => {
        if (!alive) return;
        setState({ data: payload?.data ?? payload, meta: payload?.meta ?? null, loading: false, error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });
    return () => {
      alive = false;
    };
  }, [path, tick]);

  return { ...state, retry };
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
