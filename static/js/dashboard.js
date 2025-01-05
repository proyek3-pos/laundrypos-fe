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


document.querySelector('.logout').addEventListener('click', () => {
fetch('/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
})
    .then(response => {
        if (response.ok) {
            console.log('Logout berhasil');
            // Hapus token dari semua lokasi penyimpanan
            localStorage.removeItem('token'); 
            sessionStorage.removeItem('token'); 
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            
            // Redirect ke halaman login
            window.location.href = '/login.html';
        } else {
            console.error('Logout gagal', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
});


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
