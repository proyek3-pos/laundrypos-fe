import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Sidebar
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const closeSidebar = document.getElementById('closeSidebar');

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('visible');
    document.querySelector('.content').classList.toggle('full-width');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('visible');
    document.querySelector('.content').classList.toggle('full-width');
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('.logout');
    const sidebar = document.getElementById('sidebar'); // Ambil sidebar

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah pengalihan halaman langsung

            // Menampilkan SweetAlert konfirmasi logout
            Swal.fire({
                title: 'Apakah Anda yakin ingin logout?',
                text: 'Setelah logout, Anda harus login kembali untuk mengakses aplikasi.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, logout!',
                cancelButtonText: 'Batal',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Tutup sidebar secara otomatis sebelum logout
                    sidebar.classList.add('hidden');

                    // Cek token yang tersimpan di localStorage/sessionStorage
                    let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

                    // Cek apakah token ada dan formatnya benar
                    if (token && !token.startsWith('Bearer ')) {
                        token = 'Bearer ' + token;  // Tambahkan 'Bearer ' jika belum ada
                    }

                    if (!token) {
                        Swal.fire('Error', 'Token tidak ditemukan', 'error');
                        return;
                    }

                    // Lakukan logout menggunakan token yang benar
                    fetch('https://laundry-pos-ten.vercel.app/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token // Kirim token dalam header Authorization
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            // Hapus token, userRole, dan cookie
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('userRole');
                            sessionStorage.removeItem('authToken');
                            sessionStorage.removeItem('userRole');
                            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                            document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

                            Swal.fire('Logout Berhasil!', 'Anda telah keluar.', 'success');
                            let baseURL = window.location.hostname === '127.0.0.1' ? '' : '/laundrypos-fe';
                            setTimeout(() => window.location.href = `/laundrypos-fe`, 1500);
                        } else {
                            Swal.fire('Error', 'Gagal logout, coba lagi.', 'error');
                        }
                    })
                    .catch(error => Swal.fire('Error', 'Terjadi kesalahan saat logout.', 'error'));
                } else {
                    // Jika batal logout, tampilkan kembali sidebar jika di mode responsif
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('hidden');
                        sidebar.classList.add('visible');
                        document.querySelector('.content').classList.remove('full-width');
                    }
                }
            });
        });
    } else {
        console.log('logoutButton element not found');
    }
});

// Ambil data transaksi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    // Fungsi untuk mengambil data transaksi
    const getTransactions = async (status = '', date = '') => {
        try {
            let url = 'https://laundry-pos-ten.vercel.app/transactions';
            if (status || date) {
                url += `?status=${status}&date=${date}`;
            }
            
            let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (token && !token.startsWith('Bearer ')) {
                token = 'Bearer ' + token;  // Menambahkan 'Bearer ' jika belum ada
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': token // Menambahkan token dalam header Authorization
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal memuat transaksi: ${response.statusText}`);
            }

            const transactions = await response.json();
            renderTransactions(transactions);
        } catch (error) {
            if (error.name === 'TypeError') {
                console.error('Network error:', error.message);
                alert('Terjadi kesalahan jaringan saat memuat data transaksi');
            } else {
                console.error('Error fetching transactions:', error.message);
                alert('Terjadi kesalahan saat memuat data transaksi');
            }
        }
    };

    // Fungsi untuk menghapus transaksi
    window.deleteTransaction = async (transactionId) => {
        // Menampilkan SweetAlert konfirmasi penghapusan
        const result = await Swal.fire({
            title: 'Apakah Anda yakin ingin menghapus transaksi ini?',
            text: 'Data transaksi yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                if (token && !token.startsWith('Bearer ')) {
                    token = 'Bearer ' + token;
                }

                const response = await fetch(`https://laundry-pos-ten.vercel.app/transaction-id?id=${transactionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token // Menambahkan token dalam header Authorization
                    }
                });

                if (!response.ok) {
                    throw new Error('Gagal menghapus transaksi');
                }

                Swal.fire('Berhasil', 'Transaksi berhasil dihapus', 'success');
                getTransactions(); // Refresh data transaksi setelah penghapusan
            } catch (error) {
                console.error('Error deleting transaction:', error.message);
                Swal.fire('Error', 'Terjadi kesalahan saat menghapus transaksi', 'error');
            }
        } else {
            Swal.fire('Dibatalkan', 'Transaksi tidak dihapus', 'info');
        }
    };

    // Fungsi untuk merender data transaksi ke dalam tabel
    const renderTransactions = (transactions) => {
        const tableBody = document.getElementById('transactionsTableBody');
        tableBody.innerHTML = ''; // Bersihkan tabel sebelumnya

        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            const transactionDate = new Date(transaction.transactionDate).toLocaleDateString();
            const statusClass = getStatusClass(transaction.status);
            const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.totalAmount);

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.id}</td>
                <td>${transaction.customer.fullName}</td>
                <td>${transactionDate}</td>
                <td>${formattedAmount}</td>
                <td><span class="badge ${statusClass}">${capitalizeFirstLetter(transaction.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${transaction.id}')"><i class="fa fa-trash"></i></button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    };

    // Fungsi untuk mendapatkan class status sesuai dengan status transaksi
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-warning';
            case 'completed':
                return 'bg-success';
            case 'canceled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    // Fungsi untuk memodifikasi huruf pertama menjadi kapital
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Ambil data transaksi saat halaman dimuat
    getTransactions();
});

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