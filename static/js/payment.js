document.addEventListener("DOMContentLoaded", function() {
    // Menangani submit form
    document.getElementById("payment-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Mencegah form untuk submit secara default

        // Ambil data dari form
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;
        var grossAmount = parseFloat(document.getElementById("gross_amount").value);

        // Validasi input
        if (!name || !email || !phone || !grossAmount) {
            alert("Mohon lengkapi semua data!");
            return;
        }

        // Log data yang dikirim ke backend
        console.log({
            order_id: "", // Bisa diganti dengan ID unik lain
            gross_amount: grossAmount,
            customer: {
                name: name,
                email: email,
                phone: phone
            }
        });

        // Kirim data ke backend untuk mendapatkan Snap Token
        fetch('https://laundry-pos-ten.vercel.app/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: "",  // Bisa diganti dengan ID unik lain
                gross_amount: grossAmount,
                customer: {
                    name: name,
                    email: email,
                    phone: phone
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.snap_url) {
                // Redirect ke halaman Midtrans Snap
                window.location.href = data.snap_url;
            } else {
                alert("Gagal membuat pembayaran!");
            }
        })
        .catch(error => {
            alert("Terjadi kesalahan: " + error);
        });
    });
});
