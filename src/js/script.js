const buttons = document.querySelectorAll('.button');
const characters = document.querySelectorAll('.character');

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        characters.forEach(char => char.classList.remove('selected'));

        button.classList.add('selected');
        characters[index].classList.add('selected');

        characters.forEach(character => {
            const imageOrVideo = character.querySelector('.image, .video');
            imageOrVideo.style.transition = 'opacity 0.5s ease-in-out';
            imageOrVideo.style.opacity = '0';
        });

        setTimeout(() => {
            const selectedCharacter = characters[index];
            const selectedImageOrVideo = selectedCharacter.querySelector('.image, .video');
            selectedImageOrVideo.style.opacity = '1';
        }, 50);
    });
});

//WALLPAPER
document.addEventListener('DOMContentLoaded', function () {
    const likeButtons = document.querySelectorAll('.btn-like');
    const downloadButtons = document.querySelectorAll('.btn-download');

    // Função para carregar o estado do like ao carregar a página
    function loadLikes() {
        likeButtons.forEach(button => {
            const imageId = button.closest('.wallpaper').querySelector('.wallpaper-image').getAttribute('data-id');
            const likeCount = button.nextElementSibling;

            // Verifica se o usuário já deu like
            if (localStorage.getItem(`liked_${imageId}`) === 'true') {
                button.disabled = true;
                button.style.color = '#ff4757'; // Cor do like ativo
                likeCount.textContent = 1; // Define a contagem de likes como 1
            } else {
                likeCount.textContent = 0; // Define a contagem de likes como 0
            }
        });
    }

    // Função para dar like
    likeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const imageId = button.closest('.wallpaper').querySelector('.wallpaper-image').getAttribute('data-id');
            const likeCount = button.nextElementSibling;

            if (localStorage.getItem(`liked_${imageId}`) !== 'true') {
                likeCount.textContent = 1; // Incrementa a contagem de likes
                localStorage.setItem(`liked_${imageId}`, 'true'); // Marca como like dado
                button.disabled = true;
                button.style.color = '#ff4757'; // Cor do like ativo
            }
        });
    });

    // Função para baixar a imagem
    downloadButtons.forEach(button => {
        button.addEventListener('click', function () {
            const imageUrl = this.getAttribute('data-image');
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = imageUrl.split('/').pop(); // Nome do arquivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    // Carrega os likes ao carregar a página
    loadLikes();
});

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.wallpaper-image');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    // Abre o modal ao clicar na imagem
    images.forEach(image => {
        image.addEventListener('click', function () {
            modal.style.display = 'block';
            modalImage.src = this.src;
        });
    });

    // Fecha o modal ao clicar no botão de fechar
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Fecha o modal ao clicar fora da imagem
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

images.forEach(image => {
    image.addEventListener('click', function () {
        console.log('Imagem clicada:', this.src); // Verifique se esta mensagem aparece no console
        modal.style.display = 'block';
        modalImage.src = this.src;
    });
});