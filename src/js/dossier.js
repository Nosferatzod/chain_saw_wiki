/* =========================================================
   dossier.js — carrossel de personagens (sem dependências)
   ========================================================= */
(() => {
    'use strict';

    const stage = document.getElementById('stage');
    if (!stage) return;

    const slides  = [...stage.querySelectorAll('.slide')];
    const thumbs  = [...document.querySelectorAll('.thumb')];
    const now     = document.getElementById('counterNow');
    const all     = document.getElementById('counterAll');
    const bar     = document.getElementById('dossierProgress');
    const hint    = document.querySelector('.dossier__hint');

    let index = slides.findIndex(s => s.classList.contains('is-active'));
    if (index < 0) index = 0;

    const pad = n => String(n + 1).padStart(2, '0');
    if (all) all.textContent = pad(slides.length - 1);

    function playMedia(slide) {
        const v = slide.querySelector('video');
        if (!v) return;
        if (v.preload === 'none') v.preload = 'auto';
        v.play().catch(() => {});
    }

    function go(next, { silent = false } = {}) {
        const total = slides.length;
        next = (next + total) % total;
        if (next === index && !silent) return;

        slides[index].classList.remove('is-active');
        slides[index].setAttribute('aria-hidden', 'true');
        slides[index].querySelector('video')?.pause();

        index = next;

        slides[index].classList.add('is-active');
        slides[index].setAttribute('aria-hidden', 'false');
        playMedia(slides[index]);

        thumbs.forEach((t, i) => {
            const on = i === index;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            if (on) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });

        if (now) now.textContent = pad(index);
        if (bar) bar.style.width = `${((index + 1) / slides.length) * 100}%`;

        // pré-carrega o próximo vídeo
        const upcoming = slides[(index + 1) % slides.length].querySelector('video');
        if (upcoming && upcoming.preload === 'none') upcoming.preload = 'metadata';
    }

    /* ---- controles: miniaturas, teclado, swipe e roda ---- */
    const dismissHint = () => hint && (hint.style.opacity = '0');

    thumbs.forEach(t => t.addEventListener('click', () => {
        go(Number(t.dataset.go));
        dismissHint();
    }));

    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea')) return;
        if (e.key === 'ArrowRight') { go(index + 1); dismissHint(); }
        if (e.key === 'ArrowLeft')  { go(index - 1); dismissHint(); }
        if (e.key === 'Home')       { go(0); }
        if (e.key === 'End')        { go(slides.length - 1); }
    });

    /* ---- swipe ---- */
    let startX = null, startY = null;
    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; startY = e.clientY; });
    stage.addEventListener('pointerup', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            go(index + (dx < 0 ? 1 : -1));
            dismissHint();
        }
        startX = startY = null;
    });

    /* ---- roda do mouse na área do dossiê (com trava) ---- */
    let wheelLock = false;
    stage.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) < 25 || wheelLock) return;
        wheelLock = true;
        go(index + (e.deltaY > 0 ? 1 : -1));
        dismissHint();
        setTimeout(() => { wheelLock = false; }, 700);
    }, { passive: true });

    /* ---- estado inicial ---- */
    go(index, { silent: true });
    setTimeout(dismissHint, 7000);
})();
