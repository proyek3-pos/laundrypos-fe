// static/js/pos.js

// Harga per layanan (per kg) dalam Rupiah
const servicePrices = {
    cuci: 5000,                    // Harga per kg untuk Cuci
    cuci_kering: 6000,            // Harga per kg untuk Cuci Kering
    setrika: 7000,                 // Harga per kg untuk Setrika
    cuci_cuci_kering: 10000,       // Harga per kg untuk Cuci + Cuci Kering
    cuci_cuci_kering_setrika: 16000 // Harga per kg untuk Cuci + Cuci Kering + Setrika
};

// Ambil elemen-elemen form
const serviceType = document.getElementById('serviceType');
const weight = document.getElementById('weight');
const price = document.getElementById('price');
const orderButton = document.getElementById('orderButton');

// Fungsi untuk menghitung harga otomatis
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

// Tambahkan event listener
serviceType.addEventListener('change', calculatePrice);
weight.addEventListener('input', calculatePrice);

// Fungsi untuk navigasi ke halaman pembayaran
orderButton.addEventListener('click', function () {
    // Ambil nilai dari form
    const customerName = document.getElementById('customerName').value; // Ambil dari input form
    const selectedService = serviceType.value;
    const weightValue = parseFloat(weight.value);
    const totalPrice = servicePrices[selectedService] * weightValue;

    if (!selectedService || isNaN(weightValue) || weightValue <= 0) {
        alert('Harap isi jenis layanan dan berat dengan benar!');
        return;
    }

    // Redirect ke halaman pembayaran dengan query params
    window.location.href = `payment.html?customerName=${customerName}&price=${totalPrice}`;
});
