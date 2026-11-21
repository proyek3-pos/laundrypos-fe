import Swal from "sweetalert2";

// Semua feedback event memakai SweetAlert, satu gaya untuk app.
const base = Swal.mixin({
  confirmButtonColor: "#0e7490",
  cancelButtonColor: "#64748b",
});

export function swalOk(title, text) {
  return base.fire({
    icon: "success",
    title,
    text,
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function swalErr(message) {
  return base.fire({ icon: "error", title: "Ups, gagal", text: message });
}

export function swalInfo(title, text) {
  return base.fire({ icon: "info", title, text });
}

export function swalWarn(message) {
  return base.fire({
    icon: "warning",
    title: "Cek dulu",
    text: message,
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

// Daftar masalah validasi dalam satu dialog; errors = array string.
export function swalValidasi(errors) {
  const items = errors.map((e) => `<li>${e}</li>`).join("");
  return base.fire({
    icon: "warning",
    title: "Lengkapi dulu",
    html: `<ul style="list-style:disc;text-align:left;padding-left:1.25rem;margin:0">${items}</ul>`,
    confirmButtonText: "Oke",
  });
}

// Tagihan Midtrans dibuat: buka Snap lewat klik tombol dialog, bukan
// window.open pasca-await (popup browser akan memblokirnya).
export function swalMidtrans(snapUrl) {
  return base.fire({
    icon: "success",
    title: "Tagihan Midtrans dibuat",
    text: "Klik tombol di bawah untuk membuka halaman pembayaran di tab baru.",
    confirmButtonText: "Buka Halaman Bayar",
    cancelButtonText: "Nanti saja",
    showCancelButton: true,
  }).then((r) => {
    if (r.isConfirmed && !window.open(snapUrl, "_blank", "noopener")) {
      base.fire({ icon: "error", title: "Popup diblokir", text: "Buka tautan dari detail pesanan." });
      return false;
    }
    return r.isConfirmed;
  });
}

// confirm = true kalau user menyetujui aksi.
export function swalConfirm({ title, text, confirmText = "Ya, lanjut", danger = false }) {
  return base
    .fire({
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
      confirmButtonColor: danger ? "#b91c1c" : "#0e7490",
    })
    .then((r) => Boolean(r.isConfirmed));
}
