import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/works' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    location: z.string(),
    locationUrl: z.string(),
    pieces: z.number(),
    cover: z.string(),
    date: z.string(),
    excerpt: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
});

export const collections = { works };
