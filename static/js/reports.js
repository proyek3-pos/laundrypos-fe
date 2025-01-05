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
                            // Hapus token dan lakukan redirect
                            localStorage.removeItem('authToken');
                            sessionStorage.removeItem('authToken');
                            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

                            Swal.fire('Logout Berhasil!', 'Anda telah keluar.', 'success');
                            setTimeout(() => window.location.href = '/index.html', 1500);
                        } else {
                            Swal.fire('Error', 'Gagal logout, coba lagi.', 'error');
                        }
                    })
                    .catch(error => Swal.fire('Error', 'Terjadi kesalahan saat logout.', 'error'));
                }
            });
        });
    } else {
        console.log('logoutButton element not found');
    }
});
