document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Funções Globais e Utilitárias
    // =============================================
    
    // Controle de Áudio
    function initAudioPlayer() {
        const audio = document.getElementById('background-music');
        const volumeSlider = document.getElementById('volume-slider');
        const muteToggle = document.getElementById('mute-toggle');
        
        if (!audio || !volumeSlider || !muteToggle) return;

        // Configuração inicial
        audio.volume = volumeSlider.value;
        
        // Tenta reproduzir automaticamente
        const playAudio = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay bloqueado. Requer interação do usuário.");
                    if (muteToggle) muteToggle.style.display = 'none';
                    if (volumeSlider) volumeSlider.style.display = 'none';
                });
            }
        };
        
        // Ativa com primeiro clique
        document.body.addEventListener('click', function initOnClick() {
            playAudio();
            document.body.removeEventListener('click', initOnClick);
        }, { once: true });
        
        // Controles de volume
        volumeSlider.addEventListener('input', function() {
            audio.volume = this.value;
            localStorage.setItem('volume', this.value);
            updateVolumeIcon(this.value);
        });
        
        muteToggle.addEventListener('click', function() {
            if (audio.volume > 0) {
                localStorage.setItem('lastVolume', audio.volume);
                audio.volume = 0;
                volumeSlider.value = 0;
            } else {
                const lastVolume = localStorage.getItem('lastVolume') || 0.7;
                audio.volume = lastVolume;
                volumeSlider.value = lastVolume;
            }
            updateVolumeIcon(volumeSlider.value);
        });
        
        // Restaura configurações salvas
        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) {
            audio.volume = savedVolume;
            volumeSlider.value = savedVolume;
            updateVolumeIcon(savedVolume);
        }
        
        function updateVolumeIcon(volume) {
            if (!muteToggle) return;
            const icon = muteToggle.querySelector('i') || muteToggle;
            if (volume == 0) {
                icon.classList.replace('fa-volume-up', 'fa-volume-mute');
            } else {
                icon.classList.replace('fa-volume-mute', 'fa-volume-up');
            }
        }
    }

    // =============================================
    // Página de Personagens (character.html)
    // =============================================
    
    function initCharacterPage() {
        const buttons = document.querySelectorAll('.character-buttons .button, .buttons .button');
        const characters = document.querySelectorAll('.character');
        
        if (buttons.length === 0 || characters.length === 0) return;

        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Remove seleções atuais
                buttons.forEach(btn => btn.classList.remove('selected'));
                characters.forEach(char => char.classList.remove('selected'));
                
                // Adiciona novas seleções
                button.classList.add('selected');
                characters[index].classList.add('selected');
                
                // Controle de vídeos
                document.querySelectorAll('.character-media, .video').forEach(media => {
                    if (media.tagName === 'VIDEO') {
                        media.pause();
                    }
                });
                
                // Play no vídeo selecionado
                const selectedMedia = characters[index].querySelector('.character-media, .video');
                if (selectedMedia && selectedMedia.tagName === 'VIDEO') {
                    selectedMedia.play().catch(e => console.log("Erro ao reproduzir vídeo:", e));
                }
            });
        });
    }

    // =============================================
    // Página de Wallpapers (wallpapers.html)
    // =============================================
    
    function initWallpapersPage() {
        // Sistema de Likes
        document.querySelectorAll('.btn-like').forEach(button => {
            button.addEventListener('click', function() {
                const wallpaperId = this.closest('.wallpaper-card, .wallpaper')?.querySelector('img')?.getAttribute('src') || 'default';
                const likeCount = this.nextElementSibling;
                
                if (localStorage.getItem(`liked_${wallpaperId}`)) {
                    // Remove like
                    likeCount.textContent = parseInt(likeCount.textContent) - 1;
                    localStorage.removeItem(`liked_${wallpaperId}`);
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    this.classList.remove('liked');
                } else {
                    // Adiciona like
                    likeCount.textContent = parseInt(likeCount.textContent) + 1;
                    localStorage.setItem(`liked_${wallpaperId}`, 'true');
                    this.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
                    this.classList.add('liked');
                }
            });
            
            // Carrega likes salvos
            const wallpaperId = button.closest('.wallpaper-card, .wallpaper')?.querySelector('img')?.getAttribute('src') || 'default';
            if (localStorage.getItem(`liked_${wallpaperId}`)) {
                button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
                button.classList.add('liked');
                const likeCount = button.nextElementSibling;
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            }
        });

        // Download de Wallpapers
        document.querySelectorAll('.btn-download').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const imageUrl = this.getAttribute('data-image') || this.closest('.wallpaper-card, .wallpaper')?.querySelector('img')?.src;
                if (imageUrl) {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = imageUrl.split('/').pop();
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });

        // Modal de Wallpaper
        const wallpaperModal = document.getElementById('wallpaperModal') ? 
            new bootstrap.Modal(document.getElementById('wallpaperModal')) : null;
        
        if (wallpaperModal) {
            const modalImg = document.getElementById('modalWallpaper');
            const downloadBtn = document.getElementById('downloadBtn');
            
            document.querySelectorAll('.wallpaper-img, .wallpaper-image').forEach(img => {
                img.addEventListener('click', function() {
                    if (modalImg) modalImg.src = this.src;
                    if (downloadBtn) {
                        downloadBtn.href = this.src;
                        downloadBtn.download = this.alt?.replace(/\s+/g, '_').toLowerCase() + '.jpg' || 'wallpaper.jpg';
                    }
                    if (wallpaperModal) wallpaperModal.show();
                });
            });
        } else {
            // Fallback para modal customizado (caso não use Bootstrap)
            const modal = document.getElementById('modal');
            const modalImage = document.getElementById('modal-image');
            const closeModal = document.getElementById('close-modal');
            
            if (modal && modalImage) {
                document.querySelectorAll('.wallpaper-img, .wallpaper-image').forEach(img => {
                    img.addEventListener('click', function() {
                        modal.style.display = 'block';
                        modalImage.src = this.src;
                    });
                });
                
                if (closeModal) {
                    closeModal.addEventListener('click', () => modal.style.display = 'none');
                }
                
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) modal.style.display = 'none';
                });
            }
        }
    }

    // =============================================
    // Efeitos e Comportamentos Globais
    // =============================================
    
    function initGlobalEffects() {
        // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Preloader (opcional)
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.prepend(preloader);
        
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.remove(), 500);
            }, 500);
        });

        // Menu Mobile
        const toggleButton = document.getElementById('toggleButton');
        const navList = document.getElementById('nav-list');
        
        if (toggleButton && navList) {
            toggleButton.addEventListener('click', () => {
                navList.classList.toggle('active');
                toggleButton.classList.toggle('active');
            });
            
            document.querySelectorAll('.nav-list a').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    toggleButton.classList.remove('active');
                });
            });
        }
    }

    // =============================================
    // Inicialização
    // =============================================
    
    initAudioPlayer();
    initCharacterPage();
    initWallpapersPage();
    initGlobalEffects();
});