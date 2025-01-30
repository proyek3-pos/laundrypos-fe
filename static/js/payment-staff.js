import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Fungsi untuk mengambil semua pelanggan
async function getPayments() {
    try {
        const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        const response = await fetch('https://laundry-pos-ten.vercel.app/payments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Tambahkan token ke header Authorization
            }
        });

        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const payments = await response.json();
        return payments;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
        return [];
    }
}

// Fungsi untuk menampilkan data pelanggan di tabel
async function displayPayments() {
    const payments = await getPayments();
    console.log('Payments:', payments);

    const orderTableBody = document.getElementById('order-table-body');
    orderTableBody.innerHTML = "";

    payments.forEach((payment, index) => {
        const row = document.createElement('tr');
        const paymentDate = new Date(payment.created_at).toLocaleDateString();
        const statusClass = getStatusClass(payment.status);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${paymentDate}</td>
            <td>${payment.id}</td>
            <td><span class="badge ${statusClass}">${capitalizeFirstLetter(payment.status)}</span></td>
            <td>Rp ${payment.gross_amount.toLocaleString('id-ID')}</td>
        `;

        orderTableBody.appendChild(row);
    });
}

// Fungsi untuk mendapatkan class status sesuai dengan status pembayaran
const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-warning';
        case 'settlement':
            return 'bg-success';
        case 'expire':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
};

// Fungsi untuk memodifikasi huruf pertama menjadi kapital
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

displayPayments();

const logoutButton = document.querySelector('.logout');

if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Apakah Anda yakin ingin logout?',
            text: 'Setelah logout, Anda harus login kembali.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, logout!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('userRole');
                Swal.fire('Logout Berhasil!', 'Anda telah keluar.', 'success');
                setTimeout(() => window.location.href = '/laundrypos-fe', 1500);
            }
        });
    });
}

 // Fungsi untuk melakukan validasi localStorage
 function validateLogin() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire({
        title: "Akses Ditolak",
        text: "Silahkan login terlebih dahulu",
        icon: "warning",
        confirmButtonText: "Login",
      }).then(() => {
        // Redirect ke halaman login jika diperlukan
        window.location.href = "/laundrypos-fe";
      });
    }
  }

  // Panggil fungsi untuk menyimpan token dan validasi saat halaman dimuat
  document.addEventListener("DOMContentLoaded", () => {
    validateLogin();
  });