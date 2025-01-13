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

// Fungsi untuk mengambil daftar layanan dari API
async function fetchServices() {
    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/services');
        if (!response.ok) throw new Error('Gagal mengambil data layanan');
        const services = await response.json();
        console.log('Services Data:', services);
        return services; // Mengembalikan data layanan
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data layanan!');
        return [];
    }
}

// Variabel global untuk menyimpan data layanan
let services = [];

// Fungsi untuk menginisialisasi POS dan memuat data pelanggan serta layanan
async function initializePOS() {
    if (customerId) {
        const customer = await fetchCustomerById(customerId);
        if (customer) {
            // Isi form dengan data pelanggan
            document.getElementById('customerName').value = customer.fullName;
        }
    }

    // Mengambil dan memuat daftar layanan ke dropdown
    services = await fetchServices();  // Menyimpan data layanan ke variabel global
    const serviceSelect = document.getElementById('serviceType');
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id; // ID layanan
        option.textContent = service.serviceName; // Nama layanan
        serviceSelect.appendChild(option); // Menambahkan option ke select
    });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', initializePOS);

// Ambil elemen-elemen form
const serviceType = document.getElementById('serviceType');
const weight = document.getElementById('weight');
const price = document.getElementById('price');
const orderButton = document.getElementById('orderButton');

// Fungsi untuk menghitung harga otomatis berdasarkan layanan yang dipilih dan berat
function calculatePrice() {
    const selectedService = serviceType.value; // Ambil ID layanan yang dipilih
    const weightValue = parseFloat(weight.value); // Ambil nilai berat dari input

    if (selectedService && weightValue > 0) {
        // Cek apakah layanan valid
        const selectedServiceData = services.find(service => service.id === selectedService);
        if (selectedServiceData) {
            const totalPrice = selectedServiceData.unitPrice * weightValue;
            price.value = `Rp ${totalPrice.toLocaleString('id-ID')}`; // Format Rupiah
        } else {
            price.value = ''; // Kosongkan jika layanan tidak ditemukan
            alert('Layanan tidak valid!');
        }
    } else {
        price.value = ''; // Kosongkan jika input tidak valid
        if (!selectedService) {
            alert('Harap pilih jenis layanan!');
        } else if (isNaN(weightValue) || weightValue <= 0) {
            alert('Harap masukkan berat yang valid!');
        }
    }
}

// Tambahkan event listener untuk menghitung harga otomatis saat jenis layanan atau berat berubah
serviceType.addEventListener('change', calculatePrice);
weight.addEventListener('input', calculatePrice);

// Fungsi untuk menghasilkan ID transaksi dengan UUID
function createTransactionId() {
    return uuid.v4(); // Menghasilkan ID unik berbentuk string UUID
}

// Fungsi untuk navigasi ke halaman pembayaran saat orderButton diklik
orderButton.addEventListener('click', function () {
    // Ambil nilai dari form
    const customerName = document.getElementById('customerName').value;
    const selectedService = serviceType.value;
    const weightValue = parseFloat(weight.value);

    // Cek apakah layanan dan berat valid
    if (!selectedService || isNaN(weightValue) || weightValue <= 0) {
        alert('Harap isi jenis layanan dan berat dengan benar!');
        return;
    }

    // Dapatkan harga per layanan dari layanan yang dipilih
    const selectedServiceData = services.find(service => service.id === selectedService);
    const totalPrice = selectedServiceData ? selectedServiceData.unitPrice * weightValue : 0;

    // Buat transactionId unik dengan UUID
    const transactionId = createTransactionId();  // ID berbasis UUID

    // Redirect ke halaman pembayaran dengan query params
    window.location.href = `payment.html?customerId=${customerId}&price=${totalPrice}&transactionId=${transactionId}`;
});
