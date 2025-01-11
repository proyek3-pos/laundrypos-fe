// Fungsi untuk mengambil query parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi untuk mengambil data pelanggan berdasarkan customerId
async function fetchCustomerById(customerId) {
    try {
        const response = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`);
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const customer = await response.json();
        return customer;
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data pelanggan!');
        return null;
    }
}

// Fungsi untuk inisialisasi data pada halaman pembayaran
async function initializePaymentForm() {
    const customerId = getQueryParam('customerId'); // Ambil customerId dari query string
    const price = getQueryParam('price'); // Ambil price dari query string

    if (!customerId || !price) {
        alert('Data tidak lengkap! Kembali ke halaman sebelumnya.');
        window.history.back();
        return;
    }

    // Ambil data pelanggan dari backend
    const customer = await fetchCustomerById(customerId);
    if (customer) {
        // Isi form dengan data pelanggan
        document.getElementById('customerName').value = customer.fullName || '';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phoneNumber || '';
    } else {
        alert('Data pelanggan tidak ditemukan!');
    }

    // Set total harga (price) dari query string
    document.getElementById('gross_amount').value = price;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    initializePaymentForm();
});

// Handle form submit untuk mengirim data ke backend
document.getElementById("payment-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const grossAmount = parseFloat(document.getElementById("gross_amount").value);

    if (!name || !email || !phone || isNaN(grossAmount) || grossAmount <= 0) {
        alert("Harap isi semua data dengan benar!");
        return;
    }

    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: `order-${Date.now()}`, // Order ID unik
                gross_amount: grossAmount,
                customer: { name, email, phone },
            }),
        });

        const data = await response.json();
        if (data.snap_url) {
            window.location.href = data.snap_url; // Redirect ke URL pembayaran
        } else {
            alert("Gagal membuat pembayaran!");
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }
});
