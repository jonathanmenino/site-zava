// Animações do site principal: rolagem suave (Lenis), entradas com fade, títulos palavra por palavra,
// texto que acende com a rolagem e parallax. Tudo respeita "reduzir movimento" do sistema.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Rolagem suave ----------
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
  (window as any).__lenis = lenis;
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  // Links internos (#ancora) também rolam suave.
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target as HTMLElement, { offset: -90 });
      history.replaceState(null, '', url.hash);
    });
  });
}

// ---------- Quebra em palavras ----------
function splitWords(el: HTMLElement, cls: string, inner: boolean) {
  let i = 0;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) return frag.append(document.createTextNode(p));
          const w = document.createElement('span');
          w.className = cls;
          w.style.setProperty('--i', String(i++));
          if (inner) {
            const s = document.createElement('span');
            s.textContent = p;
            w.append(s);
          } else w.textContent = p;
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).matches('br,svg,img')) {
        walk(child);
      }
    });
  };
  walk(el);
  return i;
}

document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
  el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  splitWords(el, 'w', true);
  [...el.children].forEach((c) => c.setAttribute('aria-hidden', 'true'));
});

// Seções sem animação marcada (páginas internas): os blocos abaixo da primeira tela ganham fade in.
document.querySelectorAll<HTMLElement>('main section').forEach((section) => {
  if (section.querySelector('[data-reveal],[data-split],[data-scrub-words]') || section.closest('[data-no-reveal]')) return;
  if (section.getBoundingClientRect().top < window.innerHeight) return;
  const host = section.querySelector<HTMLElement>(':scope > .container-zava, :scope > div') ?? section;
  const kids = [...host.children].filter((el) => !(el instanceof HTMLScriptElement)) as HTMLElement[];
  const targets = kids.length === 1 && kids[0].children.length > 1 && kids[0].children.length < 10 ? [...kids[0].children] as HTMLElement[] : kids;
  targets.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 90}ms`);
  });
});

// Filhos de [data-stagger] entram em sequência.
document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
  const step = Number(parent.dataset.stagger) || 90;
  parent.querySelectorAll<HTMLElement>(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * step}ms`);
  });
});

// ---------- Entradas ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
);
document.querySelectorAll('[data-reveal], [data-split]').forEach((el) => io.observe(el));

// ---------- Texto que acende com a rolagem ----------
const scrubs = [...document.querySelectorAll<HTMLElement>('[data-scrub-words]')].map((el) => {
  const total = splitWords(el, 'sw', false);
  return { el, total, words: [...el.querySelectorAll<HTMLElement>('.sw')] };
});

// ---------- Parallax ----------
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];

// Textura fixa do fundo: cada camada se repete a cada "tile" px, então basta deslocar o resto da divisão.
const textura = [
  { el: document.querySelector<HTMLElement>('#page-texture .pt-glow'), speed: 0.3, tile: 1800 },
  { el: document.querySelector<HTMLElement>('#page-texture .pt-grain'), speed: 0.15, tile: 240 },
];

let ticking = false;
function onScroll() {
  ticking = false;
  const vh = window.innerHeight;
  if (!reduce) {
    for (const t of textura) {
      if (t.el) t.el.style.transform = `translate3d(0, ${(-((window.scrollY * t.speed) % t.tile)).toFixed(1)}px, 0)`;
    }
    for (const el of parallax) {
      const speed = Number(el.dataset.parallax) || 0.15;
      const host = (el.parentElement ?? el).getBoundingClientRect();
      if (host.bottom < -200 || host.top > vh + 200) continue;
      const offset = (host.top + host.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }
  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const lit = Math.round(p * s.total);
    s.words.forEach((w, i) => w.classList.toggle('on', i < lit));
  }
}
const request = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
};
if (lenis) lenis.on('scroll', request);
window.addEventListener('scroll', request, { passive: true });
window.addEventListener('resize', request);
onScroll();
