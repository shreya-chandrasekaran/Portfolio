// main.js — site behavior (year, modals, shopping cart toggle, passions)

/* 1) Footer year */
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* 2) Modals (open via [data-dialog], close via .modal-close / backdrop / Esc) */
(() => {
  // Open
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dialog]');
    if (!btn) return;
    const id = btn.getAttribute('data-dialog');
    const dlg = document.getElementById(id);
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
    }
  });

  // Close (X button)
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.modal-close');
    if (!closeBtn) return;
    const dlg = closeBtn.closest('dialog');
    if (dlg && dlg.open) dlg.close();
  });

  // Backdrop click to close
  document.addEventListener('click', (e) => {
    const dlg = e.target.closest('dialog');
    if (!dlg) return;
    const rect = dlg.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inDialog && dlg.open) dlg.close();
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
    }
  });
})();

/* 3) model-viewer debug + Shopping cart toggle (Open/Folded) */
document.addEventListener('DOMContentLoaded', () => {
  // Optional: log model-viewer load/errors for quick debug
  document.querySelectorAll('model-viewer').forEach(mv => {
    mv.addEventListener('load', () => console.debug('[model-viewer] loaded:', mv.src));
    mv.addEventListener('error', (ev) => console.error('[model-viewer] error for', mv.src, ev));
  });

  // Toggle cart glb via buttons with data-src
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.sc-toggle [data-src]');
    if (!btn) return;

    const card = btn.closest('.card');
    const mv = card?.querySelector('model-viewer');
    const nextSrc = btn.getAttribute('data-src');

    if (!mv) { console.warn('[Cart toggle] No model-viewer found in card'); return; }
    if (!nextSrc) { console.warn('[Cart toggle] Button missing data-src'); return; }

    // Update UI states
    const group = btn.closest('.sc-toggle');
    group.querySelectorAll('[data-src]').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // Swap the model
    console.debug('[Cart toggle] Setting src ->', nextSrc);
    mv.src = nextSrc;
    mv.setAttribute('reveal', 'auto');
  });
});

/* 4) Passions: toggle + carousel + spotify (scoped & safe) */
(() => {
  // Elements (guard if section not present)
  const stage = document.getElementById('stage');
  const dots = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const tabDigital = document.getElementById('tab-digital');
  const tabHand = document.getElementById('tab-hand');
  const playToggle = document.getElementById('playToggle');
  const spotify = document.getElementById('spotify');

  if (!stage || !tabDigital || !tabHand || !prev || !next || !dots) return;

  // Replace with YOUR images + captions
  const DIGITAL = [
    {src:"img/kalyanam.jpg", alt:"Digital artwork 1", title:"Kalyanam", caption:"Wedding Poster — Cultural motifs.",  mw:'82%', mh:'80%', op:'50% 50%' },
    {src:"img/sangeet.jpg", alt:"Digital artwork 2", title:"Sangeet", caption:"Event Poster — Exploring light & shadow.",  mw:'82%', mh:'80%', op:'50% 50%' },
    {src:"img/toastParty.jpg", alt:"Digital artwork 3", title:"Toast & Roast", caption:"Event Poster — Comic-style narrative.", mw:'70%', mh:'70%', op:'50% 50%'}
  ];
  const HAND = [
    {src:"img/pineapple.jpg", alt:"Handmade artwork 1", title:"Fragmented Bloom", caption:"Acrylics — Colour & distortion.", mw:'70%', mh:'70%', op:'50% 50%'},
    {src:"img/orange.jpg", alt:"Handmade artwork 2", title:"Burnt Orange", caption:"Oil — Glow and contrast.", mw:'70%', mh:'70%', op:'50% 50%'},
    {src:"img/whiskey.jpg", alt:"Handmade artwork 3", title:"Liquid Geometry", caption:"Watercolour — Light & Refraction.", mw:'70%', mh:'70%', op:'50% 50%'},
    {src:"img/banana.jpg", alt:"Handmade artwork 4", title:"Tender Arc", caption:"Watercolour — Still life study.", mw:'70%', mh:'70%', op:'50% 50%'}
  ];

  let current = 'digital';
  let i = 0;
  const data = () => (current === 'digital' ? DIGITAL : HAND);

  function renderSlide() {
    const item = data()[i];
    stage.innerHTML = `
      <figure>
        <img src="${item.src}" alt="${item.alt}" loading="lazy" />
        <figcaption><strong>${item.title}</strong> — ${item.caption}</figcaption>
      </figure>`;
    renderDots();
    function renderSlide(slide){
      const stage = document.getElementById('stage');
      stage.innerHTML = '';

      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.title;

      // apply size/position via CSS variables:
      if (slide.mw) img.style.setProperty('--mw', slide.mw);
      if (slide.mh) img.style.setProperty('--mh', slide.mh);
      if (slide.op) img.style.setProperty('--op', slide.op);

      const cap = document.createElement('figcaption');
      cap.innerHTML = `<strong>${slide.title}</strong> — ${slide.caption}`;

      fig.append(img, cap);
      stage.appendChild(fig);
    }

    // Preload neighbors for snappy arrows
    [i-1, i+1].forEach(k => {
      const j = (k + data().length) % data().length;
      const img = new Image(); img.src = data()[j].src;
    });
  }

  function renderDots() {
    dots.innerHTML = '';
    data().forEach((_, idx) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-current', idx === i ? 'true' : 'false');
      d.setAttribute('aria-label', `Go to slide ${idx+1}`);
      d.addEventListener('click', () => { i = idx; renderSlide(); });
      dots.appendChild(d);
    });
  }

  function setSet(which) {
    current = which;
    i = 0;
    tabDigital.classList.toggle('is-active', which === 'digital');
    tabDigital.setAttribute('aria-selected', which === 'digital');
    tabHand.classList.toggle('is-active', which === 'hand');
    tabHand.setAttribute('aria-selected', which === 'hand');
    renderSlide();
  }

  prev.addEventListener('click', () => { i = (i - 1 + data().length) % data().length; renderSlide(); });
  next.addEventListener('click', () => { i = (i + 1) % data().length; renderSlide(); });

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });

  // Tabs
  tabDigital.addEventListener('click', () => setSet('digital'));
  tabHand.addEventListener('click', () => setSet('hand'));

  // Spotify toggle (optional)
  playToggle?.addEventListener('click', () => {
    const open = spotify.classList.toggle('is-open');
    playToggle.setAttribute('aria-expanded', String(open));
  });
  

  // Init
  setSet('digital');
})();
