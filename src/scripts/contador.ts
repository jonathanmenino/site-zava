// Conta de zero até o valor quando o número aparece na tela ([data-count], com data-decimals opcional).
// Pode ser importado por várias seções da mesma página: cada número só é animado uma vez.
const fmt = (v: number, d: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

export function contarNumeros() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-count]:not([data-count-pronto])')];
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const end = Number(el.dataset.count);
      const d = Number(el.dataset.decimals ?? 0);
      const t0 = performance.now();
      const dur = 1800;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)), d);
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = fmt(0, d);
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  els.forEach((el) => {
    el.dataset.countPronto = '';
    io.observe(el);
  });
}
