// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://agenciazava.com.br',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    // O Tailwind traz uma versão do Vite mais nova que a do Astro; os tipos divergem, mas funciona.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  // URLs antigas do WordPress que mudaram de endereço.
  redirects: {
    '/home': '/',
    '/jdemilia': '/trabalhos/jardim-emilia/',
    '/free-audit': '/contato/',
  },
});
