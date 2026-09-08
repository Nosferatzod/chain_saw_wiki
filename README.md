# Chainsaw Man Wiki — フロントエンド

Wiki fan-made de **Chainsaw Man** construída em HTML, CSS e JavaScript puros —
sem framework, sem bundler, sem dependência de UI.

O conceito visual é **página de mangá impressa**: tinta preta, papel envelhecido,
retícula de meio-tom (*screentone*), linhas de velocidade, bordas serrilhadas de
motosserra e vermelho sangue como cor de ação — com o amarelo `#EAAC15` mantido
como assinatura do projeto.

---

## Páginas

| Página | O que tem |
| --- | --- |
| `index.html` | Hero com vídeo em duotone + halftone, título vazado, ticker rotativo, grade do elenco, bloco de citação em "papel", CTA dividido |
| `character.html` | Dossiê em tela cheia dos 7 personagens: vídeo por slide, ficha com barras animadas, miniaturas, teclado, swipe e roda do mouse |
| `wallpapers.html` | Galeria em mosaico com filtros, favoritos persistentes, download e lightbox próprio |
| `where_watch.html` | Guia de streaming / leitura / mídia física em cartões de painel de mangá |

---

## Destaques técnicos

- **Zero dependências de UI** — carrossel, lightbox, menu mobile, filtros e
  transição de página escritos do zero em JS vanilla.
- **Texturas em CSS puro** — halftone com `radial-gradient`, grão com
  `feTurbulence` inline em `data:` URI, dentes de serra com máscara
  `conic-gradient`, linhas de velocidade com `repeating-conic-gradient`.
- **Transição entre páginas** — cortina de sangue com interceptação de links.
- **Áudio contínuo** — a trilha mantém tempo, volume e mudo entre as páginas via
  `localStorage`, respeitando as regras de autoplay do navegador.
- **Reveal on scroll** com `IntersectionObserver` (substituiu a lib AOS).
- **Acessibilidade** — navegação por teclado no carrossel e no lightbox,
  `aria-*` nos componentes, `:focus-visible` visível e suporte completo a
  `prefers-reduced-motion`.
- **Responsivo** de 320px a ultrawide, com `clamp()` em toda a escala tipográfica.

### O detalhe da seleção de texto

Os títulos são vazados (`-webkit-text-stroke`, preenchimento transparente).
**Ao selecionar o texto, as letras se preenchem com o amarelo do projeto** —
efeito original preservado e estendido para todos os títulos do site:

```css
.outline-title::selection {
    background: rgba(234, 172, 21, .14);
    color: #EAAC15;
    text-shadow: 0 0 26px rgba(234, 172, 21, .65);
}
```

---

## Estrutura

```
├── index.html · character.html · wallpapers.html · where_watch.html
├── _backup_original/        # versão anterior do projeto (HTML/CSS/JS)
└── src
    ├── css   base.css (design system) + 1 arquivo por página
    ├── js    app.js (compartilhado) · dossier.js · gallery.js
    ├── audio · images · videos · wallpapers · icon
```

## Rodando localmente

Precisa de servidor HTTP (os vídeos não carregam via `file://`):

```bash
npx serve .
# ou
python -m http.server 5500
```

---

## Autor

Projetado e desenvolvido por **Nosferatzod**.

- GitHub — [@Nosferatzod](https://github.com/Nosferatzod)
- LinkedIn — [perfil](https://www.linkedin.com/in/kaua-francino-85b154183/)
- Instagram — [@Nosferat_zod](https://instagram.com/Nosferat_zod)

## Licença

**© 2025–2026 Nosferatzod. Todos os direitos reservados.**

Este código é público **apenas para visualização e avaliação de portfólio**.
Copiar, modificar, redistribuir, hospedar ou reutilizar — no todo ou em parte —
exige autorização prévia e por escrito do autor. Os avisos de autoria presentes
nos arquivos não podem ser removidos. Detalhes em [LICENSE](LICENSE).

> Chainsaw Man é obra de Tatsuki Fujimoto, publicada pela Shueisha; o anime é
> produzido pelo estúdio MAPPA. Imagens, vídeos e áudio da obra pertencem aos
> seus respectivos detentores de direitos e não são cobertos por esta licença.
> Projeto de fã, sem fins lucrativos, feito para estudo de front-end.
