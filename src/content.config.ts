import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/works' }),
  schema: z.object({
    title: z.string(),
    year: z.number().optional(),
    location: z.string().optional().default(''),
    locationUrl: z.string().optional().default(''),
    pieces: z.number().default(1),
    cover: z.string().optional().default(''),
    date: z.string().optional(),
    excerpt: z.string().optional().default(''),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
});

export const collections = { works };
