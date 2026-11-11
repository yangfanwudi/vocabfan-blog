import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['独立开发', 'AI 开发', '技术实践', '数字实验室']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    projectName: z.string().optional(),
    projectUrl: z.string().url().optional(),
  }),
});

export const collections = { posts };
