document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Capture the values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create an object to hold the login credentials
    const credentials = {
        username: username,
        password: password
    };

    try {
        // Send a POST request to your backend login endpoint
        const response = await fetch('http://localhost:8082/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials) // Send the credentials in the request body
        });

        if (response.ok) {
            // If login is successful, get the response (which might include a token)
            const result = await response.json();

            // Example: Save the token to localStorage (if your backend returns a JWT token)
            localStorage.setItem('authToken', result.token);

            // Redirect to the dashboard or home page after successful login
            window.location.href = 'dashboard.html'; // You can change this to your desired page
        } else {
            // If the login failed, show an error message
            const error = await response.json();
            alert('Login failed: ' + error.message);
        }
    } catch (err) {
        // If there's a network or other error, show an alert
        alert('Error occurred: ' + err.message);
    }
});