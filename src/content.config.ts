import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const coverPositionSchema = z.object({
  x: z.number().min(0).max(100).default(50),
  y: z.number().min(0).max(100).default(50),
});

const workEntrySchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  description: z.string().optional().default(''),
  locationUrl: z.string().optional(),
  coverPosition: coverPositionSchema.optional().default({ x: 50, y: 50 }),
});

const _collections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/collections' }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional().default(''),
    locationUrl: z.string().optional().default(''),
    excerpt: z.string().optional().default(''),
    works: z.array(workEntrySchema).default([]),
  }),
});

export const collections = { collections: _collections };
