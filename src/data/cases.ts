import type { ImageMetadata } from 'astro';

// Criativos das campanhas (src/assets/criativos/<case>/) e avulsos (src/assets/galeria/).
const criativos = import.meta.glob<{ default: ImageMetadata }>('../assets/criativos/*/*.{jpg,jpeg,png,webp}', { eager: true });
const avulsos = import.meta.glob<{ default: ImageMetadata }>('../assets/galeria/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const jardim = import.meta.glob<{ default: ImageMetadata }>('../assets/cases/jardim-emilia/*.{jpg,jpeg,png,webp}', { eager: true });

const pick = (map: Record<string, { default: ImageMetadata }>, path: string) => {
  const hit = Object.entries(map).find(([k]) => k.endsWith(path));
  if (!hit) throw new Error(`Imagem não encontrada: ${path}`);
  return hit[1].default;
};
const c = (path: string) => pick(criativos, `/criativos/${path}`);
const j = (file: string) => pick(jardim, `/jardim-emilia/${file}`);

export const categorias = ['Campanha', 'Audiovisual', 'Fotografia', 'Design', 'Social Media', 'Impressos', 'Sites', 'Tráfego Pago'] as const;
export type Categoria = (typeof categorias)[number];

export interface Criativo { src: ImageMetadata; alt: string }
export interface CaseItem {
  slug: string;
  client: string;
  title: string;
  year?: string;
  segment: string;
  summary: string;
  categorias: Categoria[];
  cover: ImageMetadata;
  coverAlt: string;
  // Página do case. Sem link = card mostra "case completo em breve".
  href?: string;
  // Melhores peças (usadas nos quadros rolando e na galeria).
  criativos: Criativo[];
  featured?: boolean;
}

export const cases: CaseItem[] = [
  {
    slug: 'jardim-emilia',
    client: 'Jardim Emília',
    title: 'R$8 milhões no primeiro dia',
    segment: 'Lançamento imobiliário',
    summary: 'Campanha 360° de lançamento: identidade, impressos, outdoor, site, audiovisual e tráfego pago. 90% dos lotes vendidos no dia.',
    categorias: ['Campanha', 'Design', 'Impressos', 'Sites', 'Tráfego Pago', 'Audiovisual'],
    cover: j('mockup-site.jpg'),
    coverAlt: 'Site do Jardim Emília no celular e no notebook',
    href: '/trabalhos/jardim-emilia/',
    featured: true,
    criativos: [
      { src: j('outdoor.jpeg'), alt: 'Outdoor do Jardim Emília à beira da estrada' },
      { src: j('mockup-mobile.jpg'), alt: 'Site do Jardim Emília no celular' },
      { src: j('folder-1.jpeg'), alt: 'Folder dobrável do Jardim Emília' },
      { src: j('capa.jpg'), alt: 'Folder do Jardim Emília sobre fundo verde' },
      { src: j('flyer.jpg'), alt: 'Flyer do Jardim Emília com mapa' },
      { src: j('aerea.jpg'), alt: 'Vista aérea do loteamento Jardim Emília' },
    ],
  },
  {
    slug: 'bravus',
    client: 'Bravus',
    title: 'Uma Missão de Amor',
    year: '2025',
    segment: 'Hamburgueria',
    summary: 'Campanha de Dia dos Namorados com estética de filme de ação: vídeos, fotos de produto, posts, display e embalagem de presente.',
    categorias: ['Campanha', 'Audiovisual', 'Fotografia', 'Social Media', 'Impressos', 'Design'],
    cover: c('bravus/key-visual.jpg'),
    coverAlt: 'Pôster "Uma Missão de Amor" da Bravus com o casal protagonista',
    featured: true,
    criativos: [
      { src: c('bravus/key-visual.jpg'), alt: 'Key visual "Uma Missão de Amor"' },
      { src: c('bravus/arte-dia-dos-namorados.jpg'), alt: 'Arte de Dia dos Namorados da Bravus' },
      { src: c('bravus/produto-1.jpg'), alt: 'Hambúrguer da Bravus em foto de produto' },
      { src: c('bravus/combo.jpg'), alt: 'Post do combo de Dia dos Namorados' },
      { src: c('bravus/produto-4.jpg'), alt: 'Casal brindando na Bravus' },
      { src: c('bravus/feliz-dia-dos-namorados.jpg'), alt: 'Arte "Feliz Dia dos Namorados" da Bravus' },
      { src: c('bravus/produto-2.jpg'), alt: 'Hambúrguer e fritas da Bravus' },
      { src: c('bravus/caixa-presente.jpg'), alt: 'Caixa de presente da Bravus' },
      { src: c('bravus/produto-3.jpg'), alt: 'Frango crocante da Bravus' },
      { src: c('bravus/capa-video-oficial.jpg'), alt: 'Capa do vídeo oficial da campanha' },
      { src: c('bravus/display.jpg'), alt: 'Display de balcão da campanha' },
      { src: c('bravus/panfleto.jpg'), alt: 'Panfleto de Dia dos Namorados' },
      { src: c('bravus/capa-spoiler.jpg'), alt: 'Capa do vídeo spoiler da campanha' },
    ],
  },
  {
    slug: 'kombina',
    client: 'Kombina',
    title: 'É o BR no Kombina',
    year: '2025',
    segment: 'Hamburgueria',
    summary: 'Lançamento dos burgers regionais com identidade própria, vídeos spoiler, filmes de produto e carrossel para as redes.',
    categorias: ['Campanha', 'Audiovisual', 'Fotografia', 'Social Media', 'Design'],
    cover: c('kombina/carrossel-2.jpg'),
    coverAlt: 'Arte "É o burger que te leva para qualquer lugar" com três hambúrgueres',
    featured: true,
    criativos: [
      { src: c('kombina/identidade.jpg'), alt: 'Identidade da campanha "É o BR no Kombina"' },
      { src: c('kombina/carioca.jpg'), alt: 'Burger Carioca do Kombina' },
      { src: c('kombina/carrossel-1.jpg'), alt: 'Carrossel com os burgers regionais' },
      { src: c('kombina/paulista.jpg'), alt: 'Burger Paulista do Kombina' },
      { src: c('kombina/spoiler.jpg'), alt: 'Capa do vídeo spoiler do Kombina' },
      { src: c('kombina/mineiro.jpg'), alt: 'Burger Mineiro do Kombina' },
      { src: c('kombina/carrossel-2.jpg'), alt: 'Arte com os três burgers da campanha' },
      { src: c('kombina/komegg.jpg'), alt: 'Burger KomEgg' },
      { src: c('kombina/video-oficial.jpg'), alt: 'Capa do vídeo oficial do Kombina' },
    ],
  },
  {
    slug: 'bamu',
    client: 'BAMU Kids',
    title: 'Conforto em Movimento',
    year: '2025',
    segment: 'Moda infantil',
    summary: 'Lançamento da coleção de tênis infantis: identidade colorida, ensaio fotográfico, reels, posts e banners do site.',
    categorias: ['Campanha', 'Fotografia', 'Audiovisual', 'Social Media', 'Design', 'Sites'],
    cover: c('bamu/look-passeio-1.jpg'),
    coverAlt: 'Menina sentada na pedra com tênis BAMU rosa metal',
    featured: true,
    criativos: [
      { src: c('bamu/identidade.jpg'), alt: 'Identidade da campanha "Conforto em Movimento"' },
      { src: c('bamu/look-passeio-1.jpg'), alt: 'Menina com tênis BAMU rosa metal' },
      { src: c('bamu/lacos.jpg'), alt: 'Menina com laços no cabelo em ensaio BAMU' },
      { src: c('bamu/bicicleta.jpg'), alt: 'Menino de bicicleta com tênis BAMU' },
      { src: c('bamu/banner-conforto.jpg'), alt: 'Banner com os tênis da coleção' },
      { src: c('bamu/rosa-metal-1.jpg'), alt: 'Tênis BAMU rosa metal' },
      { src: c('bamu/tenis-branco.jpg'), alt: 'Menino no parquinho com tênis branco' },
      { src: c('bamu/carrossel-3.jpg'), alt: 'Detalhe do tênis dourado BAMU' },
      { src: c('bamu/carrossel-4.jpg'), alt: 'Crianças brincando no parque' },
      { src: c('bamu/look-passeio-2.jpg'), alt: 'Detalhe do tênis rosa metal' },
      { src: c('bamu/carrossel-2.jpg'), alt: 'Detalhe do tênis 100% couro' },
      { src: c('bamu/rosa-metal-2.jpg'), alt: 'Tênis rosa metal em movimento' },
      { src: c('bamu/carrossel-1.jpg'), alt: 'Capa do carrossel "Todos os calçados"' },
    ],
  },
];

// Galeria: peças das campanhas + avulsos enviados para src/assets/galeria/.
export interface GaleriaItem extends Criativo { case?: string; caseSlug?: string }

const nomeDoArquivo = (path: string) =>
  path.split('/').pop()!.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+\d+$/, '').trim();

export const galeriaAvulsos: GaleriaItem[] = Object.entries(avulsos)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => ({ src: mod.default, alt: nomeDoArquivo(path) }));

// Intercala as peças dos cases para a galeria não ficar em blocos por cliente.
export function galeria(): GaleriaItem[] {
  const listas = cases.map((cs) => cs.criativos.map((cr) => ({ ...cr, case: cs.client, caseSlug: cs.slug })));
  const out: GaleriaItem[] = [];
  const max = Math.max(...listas.map((l) => l.length));
  for (let i = 0; i < max; i++) listas.forEach((l) => l[i] && out.push(l[i]));
  // Avulsos entram espalhados (a cada 4 peças), começando pelos mais recentes no nome do arquivo.
  galeriaAvulsos.forEach((a, k) => out.splice(Math.min(out.length, 2 + k * 4), 0, a));
  return out;
}

// Seleção para o carrossel 3D da home: as peças mais fortes de cada case, intercaladas.
export const destaquesHero: Criativo[] = [
  c('bravus/key-visual.jpg'), c('bamu/look-passeio-1.jpg'), c('kombina/carioca.jpg'), j('outdoor.jpeg'),
  c('bravus/produto-1.jpg'), c('bamu/identidade.jpg'), c('kombina/carrossel-2.jpg'), c('bravus/produto-4.jpg'),
  c('bamu/lacos.jpg'), c('kombina/identidade.jpg'), j('mockup-mobile.jpg'), c('bravus/arte-dia-dos-namorados.jpg'),
  c('bamu/bicicleta.jpg'), c('kombina/paulista.jpg'),
].map((src) => ({ src, alt: cases.flatMap((cs) => cs.criativos).find((cr) => cr.src === src)?.alt ?? 'Criativo da Zava' }));
