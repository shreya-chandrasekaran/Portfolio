// main.js — site behavior (year, modals, shopping cart toggle)

// 1) Footer year
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 2) Modals (open via [data-dialog], close via .modal-close / backdrop / Esc)
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

// 3) Shopping cart Open/Folded toggle
(() => {
  // Delegate clicks from any ".sc-toggle" group
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.sc-toggle [data-sc-variant]');
    if (!btn) return;

    const group = btn.closest('.sc-toggle');
    const card = btn.closest('.card');
    const mv = card?.querySelector('model-viewer.sc-model');
    if (!group || !mv) return;

    const variant = btn.getAttribute('data-sc-variant'); // "open" or "folded"
    const openSrc = mv.getAttribute('data-open-src');
    const foldedSrc = mv.getAttribute('data-folded-src');

    const nextSrc = variant === 'folded' ? foldedSrc : openSrc;
    if (!nextSrc) return;

    // Optional: Preload the next model once (cache helps avoid flicker)
    if (!mv.__preloaded) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = nextSrc;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      mv.__preloaded = true;
    }

    // UI: active state + aria
    group.querySelectorAll('[data-sc-variant]').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // Swap the model
    mv.setAttribute('src', nextSrc);

    // Optional niceties: briefly enable poster-style reveal
    mv.setAttribute('reveal', 'auto');

    // If you want to adjust exposure/env per variant, do it here:
    // if (variant === 'folded') {
    //   mv.setAttribute('exposure', '0.9');
    // } else {
    //   mv.setAttribute('exposure', '1');
    // }
  });
})();

// --- Simple toggle for any ".sc-toggle" group ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.sc-toggle [data-src]');
  if (!btn) return;

  const card = btn.closest('.card');
  const mv = card?.querySelector('model-viewer');
  const nextSrc = btn.dataset.src;

  if (!mv || !nextSrc) return;

  // Update active state + a11y
  const group = btn.closest('.sc-toggle');
  group.querySelectorAll('[data-src]').forEach(b => {
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
  });

  // Swap the model (property assign is most reliable for custom elements)
  mv.src = nextSrc;

  // Optional: log for quick debugging
  console.debug('[Cart toggle] Set src ->', nextSrc);
});
