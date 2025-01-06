import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Event listener untuk login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const credentials = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const result = await response.json();

            // Simpan token dan role di localStorage
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userRole', result.role);

            // Tampilkan notifikasi login berhasil
            Swal.fire({
                title: 'Login Berhasil!',
                text: `Selamat datang, ${username}!`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Redirect berdasarkan role setelah notifikasi selesai
                if (result.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else if (result.role === 'staff') {
                    window.location.href = 'customer-staff.html';
                } else {
                    Swal.fire('Error', 'Unknown role, please contact administrator!', 'error');
                }
            });

        } else {
            const error = await response.json();
            Swal.fire({
                title: 'Login Gagal!',
                text: error.message || 'Username atau password salah!',
                icon: 'error'
            });
        }
    } catch (err) {
        Swal.fire({
            title: 'Terjadi Kesalahan!',
            text: err.message || 'Silakan coba lagi nanti.',
            icon: 'error'
        });
    }
});

// Tombol kembali ke halaman utama
document.getElementById('back-btn').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'index.html';
});
