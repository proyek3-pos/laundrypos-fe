// Fungsi untuk mengambil query parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi untuk mengambil data pelanggan berdasarkan customerId
async function fetchCustomerById(customerId) {
    console.log("Fetching data for customerId:", customerId);
    try {
        const response = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`);
        console.log("Response status:", response.status);
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const customer = await response.json();
        console.log("Customer data:", customer);
        return customer;
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data pelanggan!');
        return null;
    }
}


async function initializePaymentForm() {
    const customerId = getQueryParam('customerId');
    const price = getQueryParam('price');
    const transactionId = getQueryParam('transactionId');  // Ganti 'transaction_id' dengan 'transactionId'

    // Debugging: Log query parameters
    console.log("Query String:", window.location.search);
    console.log("CustomerId:", customerId);
    console.log("Price:", price);
    console.log("TransactionId:", transactionId);

    if (!customerId || !price || !transactionId) {
        alert('Data tidak lengkap. Pastikan semua parameter URL tersedia.');
        window.history.back(); // Arahkan kembali jika parameter tidak lengkap
        return;
    }

    // Ambil data pelanggan
    const customer = await fetchCustomerById(customerId);
    if (customer) {
        document.getElementById('customerName').value = customer.fullName || '';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phoneNumber || '';
    } else {
        alert('Data pelanggan tidak ditemukan!');
    }

    document.getElementById('gross_amount').value = price;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    initializePaymentForm();
});

// Handle form submit untuk mengirim data ke backend
document.getElementById("payment-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const grossAmount = parseFloat(document.getElementById("gross_amount").value.trim());
    const transactionId = getQueryParam('transactionId'); // Ganti 'transaction_id' dengan 'transactionId'
    const customerId = getQueryParam('customerId'); // Tetapkan dari query parameter

    // Debugging: Log transactionId
    console.log("TransactionId during form submit:", transactionId);

    if (!name || !email || !phone || isNaN(grossAmount) || grossAmount <= 0 || !transactionId) {
        alert("Harap isi semua data dengan benar!");
        return;
    }

    // Kirim data ke backend
    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transaction_id: transactionId,  // Gunakan 'transaction_id' untuk pengiriman data
                customer_id: customerId,
                gross_amount: grossAmount,
                order_id: `order-${Date.now()}`,
                customer: { name, email, phone },
            }),
        });
        if (!response.ok) throw new Error('Gagal membuat pembayaran');
        const result = await response.json();
        console.log("Payment result:", result);
        alert("Pembayaran berhasil!");
    } catch (error) {
        console.error('Error during payment process:', error);
        alert("Terjadi kesalahan: " + error.message);
    }
});