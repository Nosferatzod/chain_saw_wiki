// Seleciona os elementos do DOM
const backgroundMusic = document.getElementById('background-music');
const muteToggle = document.getElementById('mute-toggle');
const volumeSlider = document.getElementById('volume-slider');

// Função para salvar o estado atual do áudio
function saveAudioState() {
    localStorage.setItem('audioTime', backgroundMusic.currentTime);
    localStorage.setItem('audioVolume', backgroundMusic.volume);
    localStorage.setItem('audioMuted', backgroundMusic.muted);
}

// Função para restaurar o estado do áudio
function restoreAudioState() {
    const savedTime = localStorage.getItem('audioTime');
    const savedVolume = localStorage.getItem('audioVolume');
    const savedMuted = localStorage.getItem('audioMuted');
    
    if (savedTime !== null) {
        backgroundMusic.currentTime = parseFloat(savedTime);
    }
    
    if (savedVolume !== null) {
        backgroundMusic.volume = parseFloat(savedVolume);
        volumeSlider.value = parseFloat(savedVolume);
    }
    
    if (savedMuted === 'true') {
        backgroundMusic.muted = true;
        muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        backgroundMusic.muted = false;
        muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Função para iniciar a música após a primeira interação do usuário
function startMusicOnInteraction() {
    document.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    console.log('Música iniciada após interação do usuário.');
                    // Restaura o estado após o primeiro play
                    restoreAudioState();
                })
                .catch((error) => console.error('Erro ao iniciar a música:', error));
        }
    }, { once: true });
}

// Evento para ajustar o volume conforme o controle deslizante
volumeSlider.addEventListener('input', () => {
    backgroundMusic.volume = volumeSlider.value;
    backgroundMusic.muted = (volumeSlider.value == 0);
    saveAudioState();
    
    // Atualiza o ícone
    if (backgroundMusic.volume == 0 || backgroundMusic.muted) {
        muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Evento para alternar entre mudo e com som
muteToggle.addEventListener('click', () => {
    backgroundMusic.muted = !backgroundMusic.muted;
    saveAudioState();
    
    if (backgroundMusic.muted) {
        muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Salva o estado periodicamente e ao sair da página
setInterval(saveAudioState, 1000); // Salva a cada segundo
window.addEventListener('beforeunload', saveAudioState);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configuração inicial do volume
    backgroundMusic.volume = 0.5;
    volumeSlider.value = 0.5;
    
    // Tenta restaurar o estado salvo
    restoreAudioState();
    
    // Prepara para iniciar após interação
    startMusicOnInteraction();
});