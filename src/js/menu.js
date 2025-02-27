// Seleciona o botão de hambúrguer e o menu
const toggleButton = document.getElementById('toggleButton');
const navbar = document.querySelector('.navbar');

// Adiciona um evento de clique ao botão de hambúrguer
toggleButton.addEventListener('click', () => {
    navbar.classList.toggle('active'); // Alterna a classe 'active' no menu
    console.log('Classe "active" adicionada/removida:', navbar.classList.contains('active')); // Debug no console
});