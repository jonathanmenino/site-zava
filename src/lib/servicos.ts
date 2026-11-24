import { getCollection } from 'astro:content';

// Serviços publicados, em ordem. Um serviço com `draft: true` aparece no `npm run dev`
// (para revisão), mas fica fora do site gerado por `npm run build`: sem página, sem card,
// sem link no rodapé. Para publicar, apague a linha `draft: true` do arquivo.
export async function getServicos() {
  const all = await getCollection('servicos', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}
