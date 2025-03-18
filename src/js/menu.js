const toggleButton = document.getElementById('toggleButton');
const navList = document.getElementById('nav-list');
const header = document.querySelector('.header');

toggleButton.addEventListener('click', () => {
    if (navList.style.display === 'flex') {
        navList.style.display = 'none'; // Oculta o menu
    } else {
        navList.style.display = 'flex'; // Mostra o menu
    }
});
toggleButton.addEventListener('click', () => {
    // Alterna a classe 'active' no menu
    navList.classList.toggle('active');

    // Alterna a classe 'active' no header
    header.classList.toggle('active');

    // Alterna a classe 'active' no botão de hambúrguer
    toggleButton.classList.toggle('active');
});