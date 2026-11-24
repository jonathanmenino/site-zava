// Círculo que segue o mouse com atraso suave. Fica laranja sobre algo clicável e encolhe no clique.
const ring = document.getElementById('cursor-ring');
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (ring && fine) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x = -100, y = -100, cx = -100, cy = -100;
  const clickable = 'a, button, [role="button"], summary, label, input, select, textarea, [data-cursor="hover"]';

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!ring.classList.contains('is-visible')) {
      cx = x;
      cy = y;
      ring.classList.add('is-visible');
    }
    const target = e.target as Element | null;
    ring.classList.toggle('is-hover', !!target?.closest?.(clickable));
  }, { passive: true });

  document.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
  window.addEventListener('blur', () => ring.classList.remove('is-visible'));
  window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'));

  const ease = reduce ? 1 : 0.18;
  const tick = () => {
    cx += (x - cx) * ease;
    cy += (y - cy) * ease;
    ring.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
