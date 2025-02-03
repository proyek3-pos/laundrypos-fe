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

    // Fungsi untuk mengambil data pembayaran
    const getPayments = async () => {
        try {
            let url = 'https://laundry-pos-ten.vercel.app/payments';
            
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
                throw new Error(`Gagal memuat pembayaran: ${response.statusText}`);
            }

            const payments = await response.json();
            renderPayments(payments);
        } catch (error) {
            if (error.name === 'TypeError') {
                console.error('Network error:', error.message);
                alert('Terjadi kesalahan jaringan saat memuat data pembayaran');
            } else {
                console.error('Error fetching payments:', error.message);
                alert('Terjadi kesalahan saat memuat data pembayaran');
            }
        }
    };

    // Fungsi untuk merender data pembayaran ke dalam tabel
    const renderPayments = (payments) => {
        const tableBody = document.getElementById('salesReportTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Bersihkan tabel sebelumnya

        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            const paymentDate = new Date(payment.paymentDate).toLocaleDateString();
            const statusClass = getStatusClass(payment.status);

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(payment.created_at).toLocaleDateString()}</td>
                <td>${payment.id}</td>
                <td><span class="badge ${statusClass}">${capitalizeFirstLetter(payment.status)}</span></td>
                <td>Rp ${payment.gross_amount.toLocaleString('id-ID')}</td>
            `;

            tableBody.appendChild(row);
        });
    };

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

    // Ambil data pembayaran saat halaman dimuat
    getPayments();
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