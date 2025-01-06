document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const credentials = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8082/login', {
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

            // Redirect berdasarkan role
            if (result.role === 'admin') {
                window.location.href = 'dashboard.html';
            } else if (result.role === 'staff') {
                window.location.href = 'pos.html';
            } else {
                alert('Unknown role, please contact administrator!');
            }
        } else {
            const error = await response.json();
            alert('Login failed: ' + error.message);
        }
    } catch (err) {
        alert('Error occurred: ' + err.message);
    }
});

document.getElementById('back-btn').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'index.html';
});
