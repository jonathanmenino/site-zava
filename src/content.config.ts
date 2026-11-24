import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Título curto usado nos cards da home e no rodapé.
      shortTitle: z.string(),
      order: z.number(),
      icon: z.enum(['social', 'ads', 'web', 'brand', 'camera', 'strategy']),
      summary: z.string(),
      seoDescription: z.string(),
      // true = rascunho: aparece no `npm run dev`, mas não vai para o site publicado (ver src/lib/servicos.ts).
      draft: z.boolean().default(false),
      hero: z.object({
        intro: z.string(),
        image: image(),
        imageAlt: z.string(),
      }),
      headline: z.array(z.string()).min(1),
      features: z.array(
        z.object({
          title: z.string(),
          text: z.string(),
        }),
      ),
      why: z.object({
        items: z.array(z.string()),
        image: image(),
        imageAlt: z.string(),
      }),
      faq: z.array(z.object({ q: z.string(), a: z.string() })),
    }),
});

const trabalhos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trabalhos' }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      highlight: z.string(),
      highlightLabel: z.string(),
      summary: z.string(),
      order: z.number().default(0),
      cover: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()),
      results: z.array(z.object({ value: z.string(), label: z.string() })),
      gallery: z.array(z.object({ image: image(), alt: z.string(), wide: z.boolean().default(false) })),
    }),
});

const depoimentos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/depoimentos' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      company: z.string(),
      quote: z.string(),
      photo: image().optional(),
      // Serviços onde o depoimento aparece (slugs). Vazio = só na home.
      services: z.array(z.string()).default([]),
      // Depoimentos marcados como placeholder nunca aparecem no site.
      placeholder: z.boolean().default(false),
    }),
});

export const collections = { servicos, trabalhos, depoimentos };
