function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = sidebar.style.display === "flex" ? "none" : "flex";
  }
  
  window.onscroll = function() {
    const header = document.getElementById("main-header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  // Loading screen
  window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
  });

  // dark mode
  const toggle = document.getElementById('darkModeToggle');
  const icon = document.getElementById('darkModeIcon');
  const body = document.body;

  // Cek jika pengguna pernah menyimpan preferensi dark mode
  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

  toggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('dark-mode', 'disabled');
    } else {
      body.classList.add('dark-mode');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('dark-mode', 'enabled');
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("pVF9tp7Ko0g2KlVMF"); // Ganti dengan Public Key dari EmailJS
  });

  function sendEmail(event) {
    event.preventDefault(); // Mencegah reload halaman setelah submit

    let params = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value
    };

    emailjs.send("service_nur5zxw", "template_0wrdb97", params)
      .then(function(response) {
        alert("Pesan berhasil dikirim!");
        document.getElementById("contactForm").reset();
      }, function(error) {
        alert("Gagal mengirim pesan, coba lagi.");
        console.error("Error:", error);
      });
  }