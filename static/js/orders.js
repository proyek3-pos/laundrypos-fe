const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const closeSidebar = document.getElementById('closeSidebar');

toggleSidebar.addEventListener('click', () => {
sidebar.classList.toggle('hidden');
sidebar.classList.toggle('visible');
document.querySelector('.content').classList.toggle('full-width');
});

closeSidebar.addEventListener('click', () => {
sidebar.classList.toggle('hidden');
sidebar.classList.toggle('visible');
document.querySelector('.content').classList.toggle('full-width');
});


function filterOrders() {
    const status = document.getElementById('filterOrderStatus').value;
    const date = document.getElementById('filterDate').value;

    // Anda dapat menambahkan logika fetch API atau filter data di sini
    alert(`Filter Applied!\nStatus: ${status}\nDate: ${date}`);
}