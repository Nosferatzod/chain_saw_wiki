/* =========================================================
   gallery.js — filtros, favoritos (localStorage), download
   e lightbox acessível. Sem dependências.
   ========================================================= */
(() => {
    'use strict';

    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    const shots      = [...gallery.querySelectorAll('.shot')];
    const chips      = [...document.querySelectorAll('.chip')];
    const favCountEl = document.getElementById('favCount');
    const emptyMsg   = document.getElementById('galleryEmpty');

    const KEY = 'csm.favs';

    /* ---------- favoritos ---------- */
    const readFavs = () => {
        try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []); }
        catch { return new Set(); }
    };
    const writeFavs = (set) => {
        try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* noop */ }
    };

    let favs = readFavs();

    function paintFav(shot) {
        const on = favs.has(shot.dataset.id);
        const btn = shot.querySelector('.tool--fav');
        shot.classList.toggle('is-fav', on);
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-label', on ? 'Remover dos favoritos' : 'Favoritar');
        btn.setAttribute('aria-pressed', String(on));
        btn.innerHTML = `<i class="${on ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>`;
    }

    function paintCount() {
        if (favCountEl) favCountEl.textContent = String(favs.size).padStart(2, '0');
    }

    /* ---------- filtros ---------- */
    let filter = 'all';

    function applyFilter() {
        let visible = 0;
        shots.forEach(shot => {
            const show =
                filter === 'all' ? true :
                filter === 'fav' ? favs.has(shot.dataset.id) :
                shot.dataset.cat === filter;
            shot.hidden = !show;
            if (show) visible++;
        });
        if (emptyMsg) emptyMsg.hidden = visible !== 0;
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => {
                const on = c === chip;
                c.classList.toggle('is-active', on);
                c.setAttribute('aria-selected', String(on));
            });
            filter = chip.dataset.filter;
            applyFilter();
        });
    });

    /* ---------- download ---------- */
    function download(url, title) {
        const a = document.createElement('a');
        a.href = url;
        const ext = url.split('.').pop().split('?')[0];
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    /* ---------- lightbox ---------- */
    const box     = document.getElementById('lightbox');
    const boxImg  = document.getElementById('lightboxImg');
    const boxTtl  = document.getElementById('lightboxTitle');
    const boxDl   = document.getElementById('lightboxDownload');
    const closeBt = box?.querySelector('.lightbox__close');
    const prevBt  = box?.querySelector('.lightbox__nav--prev');
    const nextBt  = box?.querySelector('.lightbox__nav--next');

    let current = 0;
    let lastFocus = null;

    const visibleShots = () => shots.filter(s => !s.hidden);

    function openBox(shot) {
        const list = visibleShots();
        current = list.indexOf(shot);
        lastFocus = document.activeElement;
        render(list[current]);
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBt?.focus();
    }

    function render(shot) {
        if (!shot) return;
        boxImg.src = shot.dataset.full;
        boxImg.alt = shot.dataset.title;
        boxTtl.textContent = shot.dataset.title;
        boxDl.href = shot.dataset.full;
        boxDl.setAttribute('download', shot.dataset.title.toLowerCase().replace(/\s+/g, '-'));
    }

    function step(dir) {
        const list = visibleShots();
        if (!list.length) return;
        current = (current + dir + list.length) % list.length;
        render(list[current]);
    }

    function closeBox() {
        box.hidden = true;
        document.body.style.overflow = '';
        lastFocus?.focus();
    }

    closeBt?.addEventListener('click', closeBox);
    prevBt?.addEventListener('click', () => step(-1));
    nextBt?.addEventListener('click', () => step(1));
    box?.addEventListener('click', (e) => { if (e.target === box) closeBox(); });

    document.addEventListener('keydown', (e) => {
        if (!box || box.hidden) return;
        if (e.key === 'Escape')     closeBox();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft')  step(-1);
    });

    /* ---------- eventos dos cards ---------- */
    shots.forEach(shot => {
        paintFav(shot);

        shot.addEventListener('click', (e) => {
            const fav = e.target.closest('.tool--fav');
            const dl  = e.target.closest('.tool--dl');

            if (fav) {
                e.stopPropagation();
                const id = shot.dataset.id;
                favs.has(id) ? favs.delete(id) : favs.add(id);
                writeFavs(favs);
                paintFav(shot);
                paintCount();
                if (filter === 'fav') applyFilter();
                return;
            }
            if (dl) {
                e.stopPropagation();
                download(shot.dataset.full, shot.dataset.title);
                return;
            }
            openBox(shot);
        });

        // acessível pelo teclado
        shot.tabIndex = 0;
        shot.setAttribute('role', 'button');
        shot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target !== shot) return;
                e.preventDefault();
                openBox(shot);
            }
        });
    });

    paintCount();
    applyFilter();
})();
