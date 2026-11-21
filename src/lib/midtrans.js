import { swalErr, swalInfo, swalOk } from "./swal.js";

const SNAP_JS_URL =
  import.meta.env.VITE_SNAP_JS_URL || "https://app.sandbox.midtrans.com/assets/js/snap.js";

function loadSnapJs() {
  if (window.snap) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SNAP_JS_URL;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Gagal memuat skrip pembayaran Midtrans."));
    document.body.appendChild(s);
  });
}

// Buka Midtrans Snap Popup (iframe di atas halaman, bukan tab baru).
// Resolve setelah popup ditutup dengan hasil pembayaran.
export function bayarMidtrans(snapToken) {
  return loadSnapJs().then(
    () =>
      new Promise((resolve) => {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            swalOk("Pembayaran berhasil", "Status pesanan diperbarui otomatis.");
            resolve("paid");
          },
          onPending: () => {
            swalInfo(
              "Menunggu pembayaran",
              "Selesaikan pembayaran; status pesanan akan diperbarui otomatis.",
            );
            resolve("pending");
          },
          onError: () => {
            swalErr("Pembayaran gagal atau ditolak Midtrans.");
            resolve("error");
          },
          onClose: () => resolve("closed"),
        });
      }),
    (err) => {
      swalErr(err.message);
      return "error";
    },
  );
}
