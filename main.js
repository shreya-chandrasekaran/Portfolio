// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Lazy reveal for model-viewer
const viewers = Array.from(document.querySelectorAll('model-viewer'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const mv = e.target;
    if (e.isIntersecting) mv.setAttribute('reveal', 'auto');
  });
}, { rootMargin: '200px' });
viewers.forEach(v => io.observe(v));

// Simple dialog controller
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-dialog]');
  if (btn) {
    const id = btn.getAttribute('data-dialog');
    const dlg = document.getElementById(id);
    if (dlg) dlg.showModal();
  }
  if (e.target.matches('.modal-close')) {
    const dlg = e.target.closest('dialog');
    if (dlg) dlg.close();
  }
});

// Click-to-zoom for gallery images (open in new tab)
document.querySelectorAll('.gallery-grid img').forEach(img => {
  img.addEventListener('click', () => {
    window.open(img.src, '_blank');
  });
});

// ---- Shopping Cart toggle (Open / Folded) ----
const cartVariants = {
  open: {
    src: 'models/cartOpen.glb',
  },
  folded: {
    src: 'models/cartFold.glb',
  },
};

function setCartVariant(key) {
  const mv = document.getElementById('sc-viewer');
  if (!mv) return;
  const cfg = cartVariants[key];
  mv.setAttribute('src', cfg.src);
  if (cfg.poster) mv.setAttribute('poster', cfg.poster);
  document.querySelectorAll('.sc-toggle [data-sc-variant]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scVariant === key);
  });
}

// Wire up buttons
document.querySelectorAll('.sc-toggle [data-sc-variant]').forEach(btn => {
  btn.addEventListener('click', () => setCartVariant(btn.dataset.scVariant));
});

// Initial state
setCartVariant('open');


