const toggleButton = document.getElementById('toggleButton');
const navList = document.getElementById('nav-list');

toggleButton.addEventListener('click', () => {
    if (navList.style.display === 'flex') {
        navList.style.display = 'none'; // Oculta o menu
    } else {
        navList.style.display = 'flex'; // Mostra o menu
    }
});
toggleButton.addEventListener('click', () => {
    navList.classList.toggle('active'); // Adiciona ou remove a classe 'active' ao menu
});