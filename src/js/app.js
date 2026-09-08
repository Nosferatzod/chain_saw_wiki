/* =========================================================
   CHAINSAW MAN WIKI — app.js
   Camada compartilhada: preloader, transicao de pagina, nav,
   audio persistente, reveal on scroll e cursor customizado.
   ========================================================= */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---------------------------------------------------------
       1. PRELOADER
       --------------------------------------------------------- */
    const preloader = $('.preloader');
    if (preloader) {
        const finish = () => {
            preloader.classList.add('is-done');
            document.body.classList.add('is-ready');
            setTimeout(() => preloader.remove(), 900);
        };
        if (document.readyState === 'complete') setTimeout(finish, 350);
        else window.addEventListener('load', () => setTimeout(finish, 450));
        // rede lenta nao pode travar a pagina
        setTimeout(finish, 4500);
    } else {
        document.body.classList.add('is-ready');
    }

    /* ---------------------------------------------------------
       2. TRANSICAO ENTRE PAGINAS (cortina de sangue)
       --------------------------------------------------------- */
    const wipe = document.createElement('div');
    wipe.className = 'wipe';
    wipe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wipe);

    if (!reduceMotion) {
        // saida em links internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const url = link.getAttribute('href');
            if (!url || url.startsWith('#') || link.target === '_blank' ||
                link.hasAttribute('download') || /^(https?:|mailto:|tel:)/i.test(url)) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

            e.preventDefault();
            Audio_.save();
            wipe.classList.remove('is-out');
            wipe.classList.add('is-in');
            setTimeout(() => { window.location.href = url; }, 400);
        });

        // volta pelo botao "voltar" (bfcache): abre a cortina
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                wipe.classList.remove('is-in');
                wipe.classList.add('is-out');
                setTimeout(() => wipe.classList.remove('is-out'), 600);
            }
        });
    }

    /* ---------------------------------------------------------
       3. NAVBAR
       --------------------------------------------------------- */
    const nav = $('.nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const burger = $('.nav__burger', nav);
        const panel  = $('.nav__panel', nav);
        if (burger && panel) {
            const toggle = (force) => {
                const open = force ?? !nav.classList.contains('is-open');
                nav.classList.toggle('is-open', open);
                burger.setAttribute('aria-expanded', String(open));
                document.body.style.overflow = open ? 'hidden' : '';
            };
            burger.addEventListener('click', () => toggle());
            $$('a', panel).forEach(a => a.addEventListener('click', () => toggle(false)));
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
            });
        }

        // marca o link da pagina atual
        const here = location.pathname.split('/').pop() || 'index.html';
        $$('.nav__link, .nav__panel a', nav).forEach(a => {
            const target = (a.getAttribute('href') || '').split('/').pop();
            if (target === here) a.setAttribute('aria-current', 'page');
        });
    }

    /* ---------------------------------------------------------
       4. AUDIO PERSISTENTE ENTRE PAGINAS
       --------------------------------------------------------- */
    const Audio_ = {
        el: $('#background-music'),
        btn: $('#mute-toggle'),
        slider: $('#volume-slider'),
        KEY: 'csm.audio',

        read() {
            try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; }
            catch { return {}; }
        },
        save() {
            if (!this.el) return;
            try {
                localStorage.setItem(this.KEY, JSON.stringify({
                    t: this.el.currentTime,
                    v: this.el.volume,
                    m: this.el.muted
                }));
            } catch { /* storage indisponivel */ }
        },
        paint() {
            if (!this.el) return;
            const muted = this.el.muted || this.el.volume === 0;
            if (this.btn) {
                this.btn.innerHTML = `<i class="fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
                this.btn.setAttribute('aria-label', muted ? 'Ativar som' : 'Silenciar');
            }
            if (this.slider) {
                this.slider.value = muted ? 0 : this.el.volume;
                this.slider.style.setProperty('--fill', `${(muted ? 0 : this.el.volume) * 100}%`);
            }
        },
        init() {
            if (!this.el) return;
            const s = this.read();
            this.el.volume = typeof s.v === 'number' ? s.v : 0.45;
            this.el.muted  = !!s.m;
            const seek = () => {
                if (typeof s.t === 'number' && isFinite(this.el.duration)) {
                    this.el.currentTime = Math.min(s.t, this.el.duration - 0.2);
                }
            };
            if (this.el.readyState >= 1) seek();
            else this.el.addEventListener('loadedmetadata', seek, { once: true });

            this.paint();

            const tryPlay = () => this.el.play().catch(() => {});
            tryPlay();
            ['pointerdown', 'keydown'].forEach(ev =>
                document.addEventListener(ev, tryPlay, { once: true })
            );

            this.slider?.addEventListener('input', () => {
                this.el.volume = +this.slider.value;
                this.el.muted = +this.slider.value === 0;
                this.paint();
                this.save();
            });

            this.btn?.addEventListener('click', () => {
                if (this.el.muted || this.el.volume === 0) {
                    this.el.muted = false;
                    if (this.el.volume === 0) this.el.volume = this.read().v || 0.45;
                } else {
                    this.el.muted = true;
                }
                this.paint();
                this.save();
                this.el.play().catch(() => {});
            });

            setInterval(() => this.save(), 1500);
            window.addEventListener('pagehide', () => this.save());
        }
    };
    Audio_.init();

    /* ---------------------------------------------------------
       5. REVEAL ON SCROLL
       --------------------------------------------------------- */
    const revealables = $$('[data-reveal]');
    if (revealables.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealables.forEach(el => el.classList.add('is-visible'));
        } else {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
            revealables.forEach(el => io.observe(el));
        }
    }

    /* ---------------------------------------------------------
       6. CURSOR SEGUIDOR (so em ponteiro fino)
       --------------------------------------------------------- */
    if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        ring.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);

        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

        window.addEventListener('pointermove', (e) => {
            mx = e.clientX; my = e.clientY;
            ring.classList.add('is-active');
            const interactive = e.target.closest('a, button, .thumb, .card, input, [data-hover]');
            ring.classList.toggle('is-hover', !!interactive);
        }, { passive: true });

        document.addEventListener('pointerleave', () => ring.classList.remove('is-active'));

        (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            requestAnimationFrame(loop);
        })();
    }

    /* ---------------------------------------------------------
       7. PARALAXE LEVE (data-parallax="0.15")
       --------------------------------------------------------- */
    const layers = $$('[data-parallax]');
    if (layers.length && !reduceMotion) {
        let ticking = false;
        const run = () => {
            const y = window.scrollY;
            layers.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.15;
                el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
            });
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { requestAnimationFrame(run); ticking = true; }
        }, { passive: true });
    }

    /* expoe utilitarios para os scripts de pagina */
    window.CSM = { $, $$, reduceMotion };
})();
