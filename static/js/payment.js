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
        alert('Terjadi kesalahan saat mengambil data pelanggan!');
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

        // Debug detail items dan service
        if (transaction.items) {
            console.log("Transaction items:", transaction.items);
            if (transaction.items.length > 0) {
                console.log("First item details:", transaction.items[0]);
                console.log("Service details:", transaction.items[0].service);
            }
        } else {
            console.warn("Transaction does not contain items.");
        }

        return transaction;
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data transaksi!');
        return null;
    }
}

// Fungsi untuk menginisialisasi form pembayaran
async function initializePaymentForm() {
    const customerId = getQueryParam('customerId');
    const transactionId = getQueryParam('transactionId');

    // Validasi parameter URL
    if (!customerId || !transactionId) {
        alert('Data tidak lengkap. Pastikan semua parameter URL tersedia.');
        window.history.back();
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

    // Ambil data transaksi
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
            alert('Tidak ada item atau layanan dalam transaksi ini!');
        }
    } else {
        alert('Data transaksi tidak ditemukan!');
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

    // Lakukan proses pembayaran
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
                // payment_method: "Cash", // Contoh pembayaran dengan metode Cash
            }),
        });

        if (!response.ok) throw new Error('Gagal memproses pembayaran');

        const result = await response.json();
        console.log("Payment result:", result);

        // Redirect ke halaman snap_url jika tersedia
        if (result.snap_url) {
            alert("Pembayaran berhasil! Anda akan diarahkan ke halaman pembayaran.");
            window.location.href = result.snap_url;
        } else {
            alert("Pembayaran berhasil tetapi tidak ada snap_url yang ditemukan!");
        }
    } catch (error) {
        console.error('Error during payment process:', error);
        alert("Terjadi kesalahan: " + error.message);
    }
});

