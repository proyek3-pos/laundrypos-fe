import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

const saveButton = document.getElementById("save-btn");
const customerForm = document.getElementById("customer-form");
const orderTableBody = document.querySelector("#order-table tbody");

// Fungsi untuk mengambil semua pelanggan
async function getCustomers() {
    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/customers');
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
        return [];
    }
}

// Fungsi untuk menambahkan pelanggan baru
async function addCustomer() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const email = document.getElementById("customer-email").value.trim();

    if (!name || !phone || !email) {
        Swal.fire('Peringatan', 'Semua field wajib diisi!', 'warning');
        return;
    }

    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: name, phoneNumber: phone, email: email })
        });

        if (!response.ok) throw new Error('Gagal menambahkan pelanggan');
        Swal.fire('Sukses', 'Pelanggan berhasil ditambahkan!', 'success');
        displayCustomers();
        customerForm.reset();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}

// Fungsi untuk mengedit pelanggan
async function editCustomer(customerId) {
    console.log('Edit Customer ID:', customerId); // Debugging
    if (!customerId) {
        Swal.fire('Error', 'ID pelanggan tidak ditemukan', 'error');
        return;
    }

    try {
        const response = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`);
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        
        const customer = await response.json();
        console.log('Customer data:', customer); // Debugging

        const { value: formValues } = await Swal.fire({
            title: 'Edit Data Pelanggan',
            html: `
                <input id="swal-name" class="swal2-input" value="${customer.fullName}" placeholder="Nama">
                <input id="swal-phone" class="swal2-input" value="${customer.phoneNumber}" placeholder="Telepon">
                <input id="swal-email" class="swal2-input" value="${customer.email}" placeholder="Email">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    fullName: document.getElementById('swal-name').value.trim(),
                    phoneNumber: document.getElementById('swal-phone').value.trim(),
                    email: document.getElementById('swal-email').value.trim(),
                };
            }
        });

        if (formValues) {
            const updateResponse = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            if (!updateResponse.ok) throw new Error('Gagal memperbarui data pelanggan');
            Swal.fire('Sukses', 'Data pelanggan diperbarui!', 'success');
            displayCustomers();
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}



// Fungsi untuk menghapus pelanggan
async function deleteCustomer(customerId) {
    console.log('Delete Customer ID:', customerId); // Debugging
    if (!customerId) {
        Swal.fire('Error', 'ID pelanggan tidak ditemukan', 'error');
        return;
    }

    try {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data pelanggan akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            const deleteResponse = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) {
                const errorMessage = await deleteResponse.text();
                Swal.fire('Error', errorMessage, 'error');
                return;
            }
            
            Swal.fire('Sukses', 'Data pelanggan berhasil dihapus!', 'success');
            displayCustomers();
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}




// Fungsi untuk menampilkan data pelanggan di tabel
async function displayCustomers() {
    const customers = await getCustomers();
    console.log('Customers:', customers); // Debugging: pastikan atribut ID terlihat dengan nama yang benar

        orderTableBody.innerHTML = "";

        customers.forEach(customer => {
        console.log('Customer:', customer); // Debugging
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${customer.fullName}</td>
            <td>${customer.phoneNumber}</td>
            <td>${customer.email}</td>
            <td>
            <button class="btn btn-sm btn-warning" onclick="editCustomer('${customer.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.id}')">
                <i class="fas fa-trash"></i>
            </button>
            </td>

        `;
        orderTableBody.appendChild(row);
    });
}

// Event listener untuk menambahkan pelanggan
saveButton.addEventListener("click", addCustomer);

// Tampilkan pelanggan saat halaman dimuat
document.addEventListener("DOMContentLoaded", displayCustomers);
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;



/// Sidebar
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const content = document.querySelector('.content');

// Fungsi untuk menyembunyikan sidebar
function hideSidebar() {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('visible');
    content.classList.add('full-width');
    sidebar.setAttribute('inert', ''); // Mencegah fokus dan interaksi
    document.activeElement.blur(); // Hapus fokus dari elemen sidebar
    toggleSidebar.focus(); // Alihkan fokus ke tombol toggle
}

// Fungsi untuk menampilkan sidebar
function showSidebar() {
    sidebar.classList.remove('hidden');
    sidebar.classList.add('visible');
    content.classList.remove('full-width');
    sidebar.removeAttribute('inert'); // Aktifkan kembali interaksi
    closeSidebar.focus(); // Fokus pada tombol close
}

// Event listener untuk tombol toggle
toggleSidebar.addEventListener('click', () => {
    if (sidebar.classList.contains('hidden')) {
        showSidebar();
    } else {
        hideSidebar();
    }
});

// Event listener untuk tombol close
closeSidebar.addEventListener('click', hideSidebar);



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
                            // Hapus token dan lakukan redirect
                            localStorage.removeItem('authToken');
                            sessionStorage.removeItem('authToken');
                            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

                            Swal.fire('Logout Berhasil!', 'Anda telah keluar.', 'success');
                            let baseURL = window.location.hostname === '127.0.0.1' ? '' : '/laundrypos-fe';
                            setTimeout(() => window.location.href = `/laundrypos-fe`, 1500);
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
