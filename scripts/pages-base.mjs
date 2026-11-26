// Prepara o build para a prévia no GitHub Pages, que fica numa subpasta
// (https://jonathanmenino.github.io/site-zava/). Prefixa os caminhos absolutos ("/contato/")
// com a subpasta e marca a prévia como "noindex" para não concorrer com o site oficial no Google.
// Uso: node scripts/pages-base.mjs dist /site-zava
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [dir = 'dist', base = '/site-zava'] = process.argv.slice(2);
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const fix = (v) => (v.startsWith('/') && !v.startsWith('//') && !v.startsWith(base + '/') ? base + v : v);

for (const file of walk(dir)) {
  if (file.endsWith('.html')) {
    let s = readFileSync(file, 'utf8');
    s = s.replace(/(\s(?:href|src|action|data-full|poster)=")([^"]*)"/g, (_, a, v) => `${a}${fix(v)}"`);
    s = s.replace(/(\ssrcset=")([^"]*)"/g, (_, a, v) => a + v.split(',').map((p) => p.trim()).map((p) => fix(p)).join(', ') + '"');
    s = s.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`);
    // Redirecionamentos do Astro usam meta refresh.
    s = s.replace(/(content="\d+;url=)(\/[^"]*)"/g, (_, a, v) => `${a}${fix(v)}"`);
    s = s.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
    writeFileSync(file, s);
  } else if (file.endsWith('.css')) {
    const s = readFileSync(file, 'utf8').replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`);
    writeFileSync(file, s);
  }
}
writeFileSync(join(dir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(join(dir, '.nojekyll'), '');
console.log('Prévia pronta em', base);
