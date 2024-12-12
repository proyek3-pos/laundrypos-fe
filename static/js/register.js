// Event listener untuk form submit
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Mencegah submit form secara default

    // Mengambil nilai dari form
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
        const response = await fetch('http://localhost:8082/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Mengecek response dari server
        if (response.ok) {
            const result = await response.json();
            alert('Registration successful!');
            console.log(result);
            // Redirect atau lakukan sesuatu setelah berhasil
        } else {
            const error = await response.json();
            alert('Registration failed: ' + error.message);
            console.error(error);
        }
    } catch (err) {
        alert('Error occurred: ' + err.message);
        console.error(err);
    }
});

document.getElementById('back-btn').addEventListener('click', function (e) {
    e.preventDefault(); // Mencegah default button behavior
    window.location.href = 'index.html'; // Redirect ke halaman LP.html
});