document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Mencegah perilaku default form submit

    // Mengambil nilai input dari form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Membuat objek untuk kredensial login
    const credentials = {
        username: username,
        password: password
    };

    try {
        // Mengirim POST request ke endpoint backend
        const response = await fetch('https://laundry-pos-ten.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'example',
                password: 'password123',
            }),
            credentials: 'include' // Pastikan menyertakan kredensial
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        
        

        if (response.ok) {
            // Jika login berhasil
            const result = await response.json();

            // Melihat token di console browser untuk debugging
            console.log(result.token); // <<== Tambahkan baris ini di sini

            // Simpan token di localStorage
            localStorage.setItem('authToken', result.token);

            // Periksa role dari token yang diterima
            const tokenPayload = JSON.parse(atob(result.token.split('.')[1])); // Decode token
            if (tokenPayload.role === 'admin') {
                window.location.href = 'admin.html'; // Redirect ke halaman admin
            } else if (tokenPayload.role === 'staff') {
                window.location.href = 'staff.html'; // Redirect ke halaman staff
            } else {
                alert('Unknown role, please contact administrator'); // Jika role tidak dikenal
            }
        } else {
            // Jika login gagal
            const error = await response.json();
            alert('Login failed: ' + error.message);
        }
    } catch (err) {
        alert('Error occurred: ' + err.message); // Menampilkan error jika terjadi masalah
    }
});
