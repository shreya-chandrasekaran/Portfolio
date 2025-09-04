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
    {src:"img/kalyanam.jpg", alt:"Digital artwork 1", title:"Kalyanam", caption:"Wedding Poster — Cultural motifs.",  mw:'40%', mh:'60%', op:'50% 50%' },
    {src:"img/sangeet.jpg", alt:"Digital artwork 2", title:"Sangeet", caption:"Event Poster — Exploring light & shadow.",  mw:'40%', mh:'60%', op:'50% 50%' },
    {src:"img/toastParty.jpg", alt:"Digital artwork 3", title:"Toast & Roast", caption:"Event Poster — Comic-style narrative.", mw:'70%', mh:'70%', op:'50% 50%'},
    {src:"img/book.JPEG", alt:"Digital artwork 4", title:"Lotus", caption:"Book Cover Design",  mw:'40%', mh:'60%', op:'50% 50%' }
  ];
  const HAND = [
    {src:"img/pineapple.jpg", alt:"Handmade artwork 1", title:"Fragmented Bloom", caption:"Acrylics — Colour & distortion.", mw:'60%', mh:'60%', op:'50% 50%'},
    {src:"img/orange.jpg", alt:"Handmade artwork 2", title:"Burnt Orange", caption:"Oil — Glow and contrast.", mw:'70%', mh:'60%', op:'50% 50%'},
    {src:"img/whiskey.jpg", alt:"Handmade artwork 3", title:"Liquid Geometry", caption:"Watercolour — Light & Refraction.", mw:'60%', mh:'60%', op:'50% 50%'},
    {src:"img/banana.jpg", alt:"Handmade artwork 4", title:"Tender Arc", caption:"Watercolour — Still life study.", mw:'70%', mh:'60%', op:'50% 50%'}
  ];

  let current = 'digital';
  let i = 0;
  const data = () => (current === 'digital' ? DIGITAL : HAND);

function renderSlide() {
  const slide = data()[i];

  // clear stage
  stage.innerHTML = '';

  // figure
  const fig = document.createElement('figure');

  // white frame wrapper so any extra space is WHITE, not dark
  const frame = document.createElement('div');
  frame.className = 'art-frame';

  // image
  const img = document.createElement('img');
  img.src = slide.src;
  img.alt = slide.alt || slide.title || 'Artwork';

  // per-slide sizing hints -> CSS vars
  if (slide.mw) img.style.setProperty('--mw', slide.mw);
  if (slide.mh) img.style.setProperty('--mh', slide.mh);
  if (slide.op) img.style.setProperty('--op', slide.op);

  frame.appendChild(img);

  // caption
  const cap = document.createElement('figcaption');
  cap.innerHTML = `<strong>${slide.title}</strong> — ${slide.caption}`;

  fig.append(frame, cap);
  stage.appendChild(fig);

  // dots + preload neighbors
  renderDots();
  [i - 1, i + 1].forEach(k => {
    const j = (k + data().length) % data().length;
    new Image().src = data()[j].src;
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

// Projects dropdown: click/tap toggle + outside click close
document.addEventListener('click', e => {
  const dd = e.target.closest('.dropdown');
  // close all
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  if (!dd) return;
  // if you clicked the button, toggle this one
  if (e.target.closest('.dropbtn')) {
    dd.classList.toggle('open');
    e.stopPropagation();
  }
});


  
  
  // Init
  setSet('hand');
})();

// Projects dropdown: tap-to-open on mobile, click-to-scroll on desktop
(() => {
  const dd = document.querySelector('.dropdown');
  const trigger = dd?.querySelector('.dropbtn');
  if (!dd || !trigger) return;

  const isTouchOrSmall = () =>
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) ||
    window.matchMedia('(max-width: 900px)').matches;

  // Click handler for the "Projects" link
  trigger.addEventListener('click', (e) => {
    if (!isTouchOrSmall()) {
      // Desktop: let it navigate to #projects
      return;
    }
    // Mobile/small: first tap opens menu (don’t navigate yet)
    if (!dd.classList.contains('open')) {
      e.preventDefault();
      dd.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      // Second tap: close and allow navigation to #projects
      dd.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      // no preventDefault -> browser follows href="#projects"
    }
  });

  // Close if you tap/click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dd.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* 3) Image Lightbox for Art Studio + Gallery */
(() => {
  const dlg = document.getElementById('img-lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const capEl = document.getElementById('lightbox-caption');
  if (!dlg || !imgEl) return;

  // Adjust these selectors to match your markup:
  const selectors = [
    '.art-studio img',
    '.gallery img',
    '.handmade-gallery img',
    '.digital-gallery img'
  ].join(',');

  // Delegate clicks on images
  document.addEventListener('click', (e) => {
    const img = e.target.closest(selectors);
    if (!img) return;

    // Prefer full-size if you use srcset; otherwise use img.src
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
    if (capEl) capEl.textContent = img.alt || '';

    if (typeof dlg.showModal === 'function') dlg.showModal();
  });

  // Close on backdrop click
  dlg.addEventListener('click', (e) => {
    const rect = dlg.querySelector('.modal-inner')?.getBoundingClientRect();
    if (!rect) return;
    const clickInside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!clickInside) dlg.close();
  });
  
  // Close on Escape is handled by <dialog> natively
})();

document.querySelectorAll('.gallery img, .art-studio img')
  .forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const dlg = document.getElementById('lightbox');
      const dlgImg = document.getElementById('lightbox-img');
      dlgImg.src = img.src;
      dlg.showModal();
    });
  });

document.getElementById('lightbox')
  .addEventListener('click', e => e.currentTarget.close());

// Ultra-small image lightbox (works even if images load later)
(() => {
  const ready = fn =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    // 1) Ensure dialog exists
    let dlg = document.getElementById('lightbox');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'lightbox';
      dlg.innerHTML = '<img id="lightbox-img" alt="" />';
      document.body.appendChild(dlg);
    }
    const imgEl = dlg.querySelector('#lightbox-img');

    // 2) Inject minimal CSS once
    if (!document.getElementById('lightbox-css')) {
      const css = document.createElement('style');
      css.id = 'lightbox-css';
      css.textContent = `
        #lightbox::backdrop{background:rgba(0,0,0,.7)}
        #lightbox{border:none;padding:0;background:transparent}
        #lightbox img{max-width:90vw;max-height:90vh;display:block;margin:auto;border-radius:10px}
        img[data-zoom]{cursor:zoom-in}
      `;
      document.head.appendChild(css);
    }

    // 3) Delegate clicks for images (add more classes if needed)
    const SEL = 'img[data-zoom], .gallery img, .art-studio img, .handmade-gallery img, .digital-gallery img';
    document.addEventListener('click', (e) => {
      const img = e.target.closest(SEL);
      if (!img) return;

      // Stop link navigation if <a><img></a>
      const a = img.closest('a');
      if (a) e.preventDefault();

      imgEl.src = img.currentSrc || img.src;
      dlg.showModal?.();
    });

    // 4) Close when clicking backdrop
    dlg.addEventListener('click', (e) => {
      const r = imgEl.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close();
    });
  });
})();
