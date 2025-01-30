import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Fungsi untuk mengambil query parameter dari URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Ambil `customerId` dari query parameter
const customerId = getQueryParam("customerId");
console.log("Customer ID:", customerId);

// Fungsi untuk mengambil data pelanggan berdasarkan ID
async function fetchCustomerById(customerId) {
  try {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    const response = await fetch(
      `https://laundry-pos-ten.vercel.app/customer-id?id=${customerId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
        }
      }
    );
    if (!response.ok) throw new Error("Gagal mengambil data pelanggan");
    const customer = await response.json();
    console.log("Customer Data:", customer);
    return customer;
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Terjadi kesalahan saat mengambil data pelanggan!",
      icon: "error"
    });
    return null;
  }
}

// Fungsi untuk mengambil daftar layanan dari API
async function fetchServices() {
  try {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    const response = await fetch("https://laundry-pos-ten.vercel.app/services", {
      headers: {
        'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
      }
    });
    if (!response.ok) throw new Error("Gagal mengambil data layanan");
    const services = await response.json();
    console.log("Services Data:", services);
    return services; // Mengembalikan data layanan
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Terjadi kesalahan saat mengambil data layanan!",
      icon: "error"
    });
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
      document.getElementById("customerName").value = customer.fullName;
    }
  }

  // Mengambil dan memuat daftar layanan ke dropdown
  services = await fetchServices(); // Menyimpan data layanan ke variabel global
  const serviceSelect = document.getElementById("serviceType");
  services.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.id; // ID layanan
    option.textContent = service.serviceName; // Nama layanan
    serviceSelect.appendChild(option); // Menambahkan option ke select
  });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", initializePOS);

// Ambil elemen-elemen form
const serviceType = document.getElementById("serviceType");
const weight = document.getElementById("weight");
const price = document.getElementById("price");
const orderButton = document.getElementById("orderButton");

// Fungsi untuk menghitung harga otomatis berdasarkan layanan yang dipilih dan berat
function calculatePrice() {
  const selectedService = serviceType.value; // Ambil ID layanan yang dipilih
  const weightValue = parseFloat(weight.value); // Ambil nilai berat dari input

  if (selectedService && weightValue > 0) {
    // Cek apakah layanan valid
    const selectedServiceData = services.find(
      (service) => service.id === selectedService
    );
    if (selectedServiceData) {
      const totalPrice = selectedServiceData.unitPrice * weightValue;
      price.value = `Rp ${totalPrice.toLocaleString("id-ID")}`; // Format Rupiah
    } else {
      price.value = ""; // Kosongkan jika layanan tidak ditemukan
      Swal.fire("Error", "Layanan tidak valid!", "error");
    }
  } else {
    price.value = ""; // Kosongkan jika input tidak valid
    if (!selectedService) {
      Swal.fire("Peringatan", "Harap pilih jenis layanan!", "warning");
    } else if (isNaN(weightValue) || weightValue <= 0) {
      Swal.fire("Peringatan", "Harap masukkan berat yang valid!", "warning");
    }
  }
}

// Tambahkan event listener untuk menghitung harga otomatis saat jenis layanan atau berat berubah
serviceType.addEventListener("change", calculatePrice);
weight.addEventListener("input", calculatePrice);

// Fungsi untuk mengirim data transaksi ke API
async function createTransaction(transactionData) {
  try {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    const response = await fetch(
      "https://laundry-pos-ten.vercel.app/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // Menambahkan token ke header Authorization
        },
        body: JSON.stringify(transactionData), // Kirim data transaksi dalam bentuk JSON
      }
    );

    if (!response.ok) throw new Error("Gagal membuat transaksi");
    const result = await response.json();
    console.log("Transaksi berhasil dibuat:", result);
    return result; // Mengembalikan data transaksi (termasuk _id yang berupa ObjectId)
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Terjadi kesalahan saat membuat transaksi!", "error");
  }
}

// Fungsi untuk navigasi ke halaman pembayaran saat orderButton diklik
orderButton.addEventListener("click", async function () {
  // Ambil nilai dari form
  const customerName = document.getElementById("customerName").value;
  const selectedService = serviceType.value;
  const weightValue = parseFloat(weight.value);

  // Cek apakah layanan dan berat valid
  if (!selectedService || isNaN(weightValue) || weightValue <= 0) {
    Swal.fire("Peringatan", "Harap isi jenis layanan dan berat dengan benar!", "warning");
    return;
  }

  // Dapatkan harga per layanan dari layanan yang dipilih
  const selectedServiceData = services.find(
    (service) => service.id === selectedService
  );
  const totalPrice = selectedServiceData
    ? selectedServiceData.unitPrice * weightValue
    : 0;

  // Buat objek transaksi
  const transactionData = {
    customerId: customerId, // ID pelanggan yang didapat dari query params
    transactionDate: new Date(), // Tanggal transaksi
    items: [
      {
        serviceId: selectedServiceData.id, // ID layanan yang dipilih
        quantity: weightValue, // Berat yang dimasukkan
        unitPrice: selectedServiceData.unitPrice, // Harga per kg
        totalPrice: totalPrice, // Total harga
      },
    ],
    totalAmount: totalPrice, // Total harga transaksi
    paymentMethod: "Midtrans", // Misalnya metode pembayaran Cash
    status: "Pending", // Status transaksi
    snapURL: "", // Anda bisa menambahkan URL pembayaran jika menggunakan sistem pembayaran lain
  };

  // Kirim data transaksi ke API dan dapatkan response
  const transaction = await createTransaction(transactionData);

  // Debug: Pastikan transaksi berhasil dibuat
//   console.log("Transaction Created:", transaction);

  // Cek apakah transaksi berhasil dibuat
  // Cek apakah transaksi berhasil dibuat
  if (transaction && transaction.id) {
    Swal.fire({
      title: "Transaksi Berhasil!",
      text: "Pesanan Anda telah dibuat.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = `payment.html?customerId=${customerId}&price=${totalPrice}&transactionId=${transaction.id}`;
    });
  } else {
    Swal.fire("Error", "Transaction ID is missing or invalid", "error");
  }
});
