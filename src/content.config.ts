import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imageSettingsSchema = z.object({
  fit: z.enum(['contain', 'cover', 'fill', 'none']).default('contain'),
  position: z.string().default('center'),
  scale: z.number().default(1),
});

const workEntrySchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  description: z.string().optional().default(''),
  location: z.string().optional(),
  locationUrl: z.string().optional(),
  imageSettings: z.record(z.string(), imageSettingsSchema).optional().default({}),
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
