import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Event listener untuk form submit
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Mencegah submit form secara default

    // Mengambil nilai dari form
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validasi form sederhana
    if (!name || !username || !password) {
        Swal.fire('Peringatan', 'Semua field wajib diisi!', 'warning');
        return;
    }

    // Peran default menjadi "staff"
    const role = 'staff';

    // Membuat object untuk dikirim ke backend
    const data = {
        name: name,
        username: username,
        password: password,
        role: role
    };

    try {
        const response = await fetch('https://laundry-pos-ten.vercel.app/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Mengecek response dari server
        if (response.ok) {
            const result = await response.json();
            console.log(result);

            // Notifikasi sukses menggunakan SweetAlert
            await Swal.fire({
                title: 'Registrasi Berhasil!',
                text: 'Akun Anda telah berhasil dibuat.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Redirect ke halaman login atau halaman lain
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            Swal.fire('Registrasi Gagal', error.message || 'Terjadi kesalahan pada server.', 'error');
            console.error(error);
        }
    } catch (err) {
        Swal.fire('Error', 'Terjadi kesalahan: ' + err.message, 'error');
        console.error(err);
    }
});

// Event listener untuk tombol kembali
document.getElementById('back-btn').addEventListener('click', function (e) {
    e.preventDefault(); // Mencegah default button behavior
    window.location.href = 'index.html'; // Redirect ke halaman index.html
});
