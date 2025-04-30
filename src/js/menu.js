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
// Carrossel Personalizado
function initCarousel() {
    const buttons = document.querySelectorAll('.buttons .button');
    const characters = document.querySelectorAll('.character');
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove seleção atual
            characters.forEach(char => char.classList.remove('selected'));
            buttons.forEach(btn => btn.classList.remove('selected'));
            
            // Adiciona seleção
            characters[index].classList.add('selected');
            button.classList.add('selected');
            
            // Controle de vídeos
            document.querySelectorAll('video').forEach(video => {
                video.pause();
            });
            
            const selectedVideo = characters[index].querySelector('video');
            if (selectedVideo) {
                selectedVideo.play();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    
    // Restante do código do volume...
});