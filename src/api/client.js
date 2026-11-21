const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiCall(method, path, body) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("authToken");
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Tidak bisa menghubungi server. Cek koneksi internet.");
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Respons kosong (mis. 204) diperlakukan sukses.
  }
  if (!res.ok) {
    const err = new Error(payload?.message || `Terjadi kesalahan (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return payload;
}

export const api = {
  get: (path) => apiCall("GET", path),
  post: (path, body) => apiCall("POST", path, body ?? {}),
  put: (path, body) => apiCall("PUT", path, body),
  patch: (path, body) => apiCall("PATCH", path, body),
  del: (path) => apiCall("DELETE", path),
};

export function formatRp(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatTanggal(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
