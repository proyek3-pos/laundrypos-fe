// Fungsi untuk mengambil query parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Ambil `customerId` dari query parameter
const customerId = getQueryParam('customerId');
console.log('Customer ID:', customerId);

// Fungsi untuk mengambil data pelanggan berdasarkan ID
async function fetchCustomerById(customerId) {
    try {
        const response = await fetch(`https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`);
        if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
        const customer = await response.json();
        console.log('Customer Data:', customer);
        return customer;
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data pelanggan!');
        return null;
    }
}

// Fungsi untuk menginisialisasi POS dan memuat data pelanggan
async function initializePOS() {
    if (customerId) {
        const customer = await fetchCustomerById(customerId);
        if (customer) {
            // Isi form dengan data pelanggan
            document.getElementById('customerName').value = customer.fullName;
        }
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', initializePOS);

// Harga per layanan (per kg) dalam Rupiah
const servicePrices = {
    cuci: 5000,                    // Harga per kg untuk Cuci
    cuci_kering: 6000,              // Harga per kg untuk Cuci Kering
    setrika: 7000,                  // Harga per kg untuk Setrika
    cuci_cuci_kering: 10000,        // Harga per kg untuk Cuci + Cuci Kering
    cuci_cuci_kering_setrika: 16000 // Harga per kg untuk Cuci + Cuci Kering + Setrika
};

// Ambil elemen-elemen form
const serviceType = document.getElementById('serviceType');
const weight = document.getElementById('weight');
const price = document.getElementById('price');
const orderButton = document.getElementById('orderButton');

// Fungsi untuk menghitung harga otomatis berdasarkan layanan yang dipilih dan berat
function calculatePrice() {
    const selectedService = serviceType.value;
    const weightValue = parseFloat(weight.value);

    if (selectedService && weightValue > 0) {
        const totalPrice = servicePrices[selectedService] * weightValue;
        price.value = `Rp ${totalPrice.toLocaleString('id-ID')}`; // Format Rupiah
    } else {
        price.value = ''; // Kosongkan jika input tidak valid
    }
}

// Tambahkan event listener untuk menghitung harga otomatis saat jenis layanan atau berat berubah
serviceType.addEventListener('change', calculatePrice);
weight.addEventListener('input', calculatePrice);

// Fungsi untuk menghasilkan ID unik berbasis timestamp
function createTransactionId() {
    // Hanya menggunakan timestamp untuk ID unik
    return Date.now().toString(); // ID berbasis waktu dalam milidetik
}

// Fungsi untuk navigasi ke halaman pembayaran saat orderButton diklik
orderButton.addEventListener('click', function () {
    // Ambil nilai dari form
    const customerName = document.getElementById('customerName').value;
    const selectedService = serviceType.value;
    const weightValue = parseFloat(weight.value);
    const totalPrice = servicePrices[selectedService] * weightValue;

    if (!selectedService || isNaN(weightValue) || weightValue <= 0) {
        alert('Harap isi jenis layanan dan berat dengan benar!');
        return;
    }

    // Buat transactionId unik
    const transactionId = createTransactionId();  // ID berbasis timestamp, tanpa awalan 'txn-'

    // Redirect ke halaman pembayaran dengan query params
    window.location.href = `payment.html?customerId=${customerId}&price=${totalPrice}&transactionId=${transactionId}`;
});
