const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const closeSidebar = document.getElementById('closeSidebar');

// Toggle sidebar on and off
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
});

// Set the active page in the sidebar
document.addEventListener("DOMContentLoaded", () => {
    // Dapatkan nama halaman saat ini
    const currentPage = window.location.pathname.split('/').pop(); // Mengambil nama file dari URL

    // Dapatkan tautan sidebar
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');

    // Tentukan halaman yang aktif dan beri kelas 'active' pada tautan
    if (currentPage === 'dashboard.html') {
        dashboardLink.classList.add('active'); // Menambahkan kelas 'active' untuk tautan dashboard
    }
});
