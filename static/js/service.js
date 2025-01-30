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

    // Ensure elements exist before setting properties
    const servicesContainer = document.getElementById('servicesContainer');
    if (servicesContainer) {
        displayServices();
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

document.addEventListener("DOMContentLoaded", () => {
    // Fetch the list of services
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    fetch('https://laundry-pos-ten.vercel.app/services', { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Get response as text
        })
        .then(text => {
            if (!text) {
                throw new Error('Response text is empty');
            }
            try {
                return JSON.parse(text); // Try to parse JSON
            } catch (error) {
                throw new Error('Failed to parse JSON');
            }
        })
        .then(data => {
            const tbody = document.querySelector('#order-table tbody');
            tbody.innerHTML = ''; // Clear existing rows

            data.forEach(service => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${service.serviceName}</td>
                    <td>${service.description}</td>
                    <td>${service.unitPrice}</td>
                    <td>${service.unit}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${service.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${service.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        })
        .catch(error => console.error('Error fetching services:', error));
    
    // Handle form submission
    document.getElementById('save-btn').addEventListener('click', addService);
});

async function addService() {
    const serviceName = document.getElementById('service-name').value.trim();
    const serviceDescription = document.getElementById('description').value.trim();
    const servicePrice = parseFloat(document.getElementById('price').value.trim());
    const serviceWeight = document.getElementById('weight').value.trim();

    if (!serviceName || !serviceDescription || isNaN(servicePrice) || !serviceWeight) {
        Swal.fire('Peringatan', 'Semua field wajib diisi dengan benar!', 'warning');
        return;
    }

    const newService = {
        serviceName,
        description: serviceDescription,
        unitPrice: servicePrice,
        unit: serviceWeight
    };

    // Cek token yang tersimpan di localStorage/sessionStorage
    let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token && !token.startsWith('Bearer ')) {
        token = 'Bearer ' + token;  // Tambahkan 'Bearer ' jika belum ada
    }

    // Konfirmasi sebelum menyimpan data
    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data service akan disimpan.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan!',
        cancelButtonText: 'Batal',
        reverseButtons: true
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch('https://laundry-pos-ten.vercel.app/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token // Menambahkan token di header Authorization
                },
                body: JSON.stringify(newService)
            });

            if (!response.ok) throw new Error('Gagal menambahkan service');
            Swal.fire('Sukses', 'Service berhasil ditambahkan!', 'success');
            displayServices();
            document.getElementById('service-form').reset();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message, 'error');
        }
    } else {
        Swal.fire('Batal', 'Data tidak disimpan.', 'info');
    }
}

async function handleEdit(event) {
    const serviceId = event.target.getAttribute('data-id');
    if (!serviceId) {
        Swal.fire('Error', 'ID service tidak ditemukan', 'error');
        return;
    }

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch(`https://laundry-pos-ten.vercel.app/service-id?id=${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Menambahkan token di header Authorization
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data service');

        const service = await response.json();

        const { value: formValues } = await Swal.fire({
            title: 'Edit Data Service',
            html: `
                <input id="swal-name" class="swal2-input" value="${service.serviceName}" placeholder="Nama Service">
                <input id="swal-description" class="swal2-input" value="${service.description}" placeholder="Deskripsi">
                <input id="swal-price" class="swal2-input" value="${service.unitPrice}" placeholder="Harga">
                <input id="swal-weight" class="swal2-input" value="${service.unit}" placeholder="Berat">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    serviceName: document.getElementById('swal-name').value.trim(),
                    description: document.getElementById('swal-description').value.trim(),
                    unitPrice: parseFloat(document.getElementById('swal-price').value.trim()) || 0,
                    unit: document.getElementById('swal-weight').value.trim(),
                };
            }
        });

        if (formValues) {
            const updateResponse = await fetch(`https://laundry-pos-ten.vercel.app/service-id?id=${serviceId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Menambahkan token di header Authorization
                },
                body: JSON.stringify(formValues)
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Gagal memperbarui data service: ${errorText}`);
            }

            Swal.fire('Sukses', 'Data service diperbarui!', 'success');
            displayServices();
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}

async function handleDelete(event) {
    const serviceId = event.target.getAttribute('data-id');
    if (!serviceId) {
        Swal.fire('Error', 'ID service tidak ditemukan', 'error');
        return;
    }

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data service akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            const deleteResponse = await fetch(`https://laundry-pos-ten.vercel.app/service-id?id=${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Menambahkan token di header Authorization
                },
            });

            if (!deleteResponse.ok) {
                const errorMessage = await deleteResponse.text();
                Swal.fire('Error', errorMessage, 'error');
                return;
            }
            
            Swal.fire('Sukses', 'Data service berhasil dihapus!', 'success');
            displayServices();
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}

async function displayServices() {
    const servicesContainer = document.getElementById('servicesContainer');
    if (!servicesContainer) {
        console.error('servicesContainer element not found');
        return;
    }

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch('https://laundry-pos-ten.vercel.app/services', {
            headers: {
                'Authorization': `Bearer ${token}` // Menambahkan token di header Authorization
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get response as text
        if (!text) {
            throw new Error('Response text is empty');
        }
        let services;
        try {
            services = JSON.parse(text); // Try to parse JSON
        } catch (error) {
            throw new Error('Failed to parse JSON');
        }

        const tbody = document.querySelector('#order-table tbody');
        tbody.innerHTML = ''; // Clear existing rows

        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.serviceName}</td>
                <td>${service.description}</td>
                <td>${service.unitPrice}</td>
                <td>${service.unit}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${service.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${service.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}

// Tampilkan services saat halaman dimuat
document.addEventListener("DOMContentLoaded", displayServices);

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