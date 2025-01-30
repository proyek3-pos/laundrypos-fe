import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Fungsi untuk mengambil query parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi untuk mengambil data pelanggan berdasarkan customerId
async function fetchCustomerById(customerId) {
    console.log("Fetching data for customerId:", customerId);
    try {
        const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        const response = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const customer = await response.json();
        console.log("Customer data:", customer);
        return customer;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Terjadi kesalahan saat mengambil data pelanggan!', 'error');
        return null;
    }
}

// Fungsi untuk mengambil data transaksi berdasarkan transactionId
async function fetchTransactionById(transactionId) {
    console.log("Fetching data for transactionId:", transactionId);
    try {
        const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        const response = await fetch(`https://laundry-pos-ten.vercel.app/transaction-id?id=${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data transaksi');
        const transaction = await response.json();
        console.log("Transaction data:", transaction);

        if (transaction.items && transaction.items.length > 0) {
            console.log("Transaction items:", transaction.items);
            console.log("First item details:", transaction.items[0]);
            console.log("Service details:", transaction.items[0].service);
        } else {
            console.warn("Transaction does not contain items.");
        }

        return transaction;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Terjadi kesalahan saat mengambil data transaksi!', 'error');
        return null;
    }
}

// Fungsi untuk menginisialisasi form pembayaran
async function initializePaymentForm() {
    const customerId = getQueryParam('customerId');
    const transactionId = getQueryParam('transactionId');

    if (!customerId || !transactionId) {
        Swal.fire('Error', 'Data tidak lengkap. Pastikan semua parameter URL tersedia.', 'error').then(() => {
            window.history.back();
        });
        return;
    }

    const customer = await fetchCustomerById(customerId);
    if (customer) {
        document.getElementById('customerName').value = customer.fullName || '';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phoneNumber || '';
    } else {
        Swal.fire('Error', 'Data pelanggan tidak ditemukan!', 'error');
    }

    const transaction = await fetchTransactionById(transactionId);
    if (transaction) {
        if (transaction.items && transaction.items.length > 0) {
            const serviceDetails = transaction.items[0];
            const serviceName = serviceDetails.service?.serviceName || 'Layanan tidak ditemukan';

            document.getElementById('service').value = serviceName;
            document.getElementById('weight').value = serviceDetails.quantity || 0;
            document.getElementById('gross_amount').value = `Rp ${transaction.totalAmount.toLocaleString('id-ID')}`;
            document.getElementById('transactionId').value = transactionId;
        } else {
            Swal.fire('Error', 'Tidak ada item atau layanan dalam transaksi ini!', 'error');
        }
    } else {
        Swal.fire('Error', 'Data Transaksi Tidak Ditemukan!', 'error');
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    initializePaymentForm();
});

// Handle form submit untuk mengirim data ke backend
document.getElementById("payment-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const transactionId = document.getElementById("transactionId").value;

    Swal.fire({
        title: 'Memproses Pembayaran...',
        text: 'Mohon tunggu sebentar.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        const response = await fetch('https://laundry-pos-ten.vercel.app/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
            },
            body: JSON.stringify({
                transactionId: transactionId,
            }),
        });

        if (!response.ok) throw new Error('Gagal memproses pembayaran');

        const result = await response.json();
        console.log("Payment result:", result);
        Swal.close();


        // Pastikan Anda mendapatkan token dari response
        if (result.token) {
            // Menampilkan popup Midtrans dengan token yang diterima
            snap.pay(result.token, {
                onSuccess: function (result) {
                    Swal.fire('Pembayaran Berhasil!', 'Terima kasih telah melakukan pembayaran.', 'success').then(() => {
                        window.location.href = `payment-staff.html`;
                    });
                },
                onPending: function (result) {
                    Swal.fire('Pembayaran Pending', 'Pembayaran Anda masih dalam proses.', 'info');
                    console.log(result);
                },
                onError: function (result) {
                    Swal.fire('Error', 'Terjadi kesalahan pada pembayaran.', 'error');
                    console.log(result);
                }
            });
        } else {
            Swal.fire('Error', 'Tidak ada token pembayaran yang diterima.', 'error');
        }
    } catch (error) {
        console.error('Error during payment process:', error);
        Swal.fire('Error', `Terjadi kesalahan: ${error.message}`, 'error');
    }
});
