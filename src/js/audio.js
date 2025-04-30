// Seleciona os elementos do DOM
const backgroundMusic = document.getElementById('background-music');
const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');


// Função para iniciar a música após a primeira interação do usuário
function startMusicOnInteraction() {
    document.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => console.log('Música iniciada após interação do usuário.'))
                .catch((error) => console.error('Erro ao iniciar a música:', error));
        }
    }, { once: true }); // O evento só será executado uma vez
}

// Função para restaurar o volume e o tempo da música
function restoreMusicState() {
    const savedVolume = localStorage.getItem('musicVolume');
    const savedTime = localStorage.getItem('musicTime');

    if (savedVolume !== null) {
        backgroundMusic.volume = parseFloat(savedVolume);
        volumeSlider.value = savedVolume;
    }

    if (savedTime !== null) {
        backgroundMusic.currentTime = parseFloat(savedTime);
    }
}

// Função para salvar o estado da música (volume e tempo)
function saveMusicState() {
    localStorage.setItem('musicVolume', backgroundMusic.volume);
    localStorage.setItem('musicTime', backgroundMusic.currentTime);
}

// Evento para ajustar o volume conforme o controle deslizante
volumeSlider.addEventListener('input', () => {
    backgroundMusic.volume = volumeSlider.value;
    saveMusicState(); // Salva o volume atualizado

    // Muda a cor do ícone quando mudo ou com som
    if (backgroundMusic.volume == 0) {
        volumeIcon.style.fill = '#ccc'; // Mudo
    } else {
        volumeIcon.style.fill = '#fff'; // Com som
    }
});

// Evento para alternar entre mudo e com som ao clicar no ícone
volumeIcon.addEventListener('click', () => {
    if (backgroundMusic.volume > 0) {
        backgroundMusic.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.style.fill = '#ccc'; // Mudo
    } else {
        backgroundMusic.volume = 1;
        volumeSlider.value = 1;
        volumeIcon.style.fill = '#fff'; // Com som
    }
    saveMusicState(); // Salva o volume atualizado
});

// Evento para salvar o estado da música ao sair da página
window.addEventListener('beforeunload', saveMusicState);

// Inicialização
window.addEventListener('load', () => {
    restoreMusicState(); // Restaura o volume e o tempo da música
    startMusicOnInteraction(); // Inicia a música após a primeira interação do usuário
});


