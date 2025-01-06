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