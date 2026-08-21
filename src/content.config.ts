import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const logsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/logs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'logs': logsCollection,
};
