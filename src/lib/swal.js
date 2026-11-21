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
