import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Lesson schema — intentionally lenient for the initial migration. Some
 * legacy lessons may have non-standard frontmatter; `.passthrough()` allows
 * extra keys, and most fields are optional. Phase 3 follow-up tightens
 * this once the migration is verified.
 */
const lessonSchema = z
  .object({
    title: z.string().optional(),
    order: z.number().optional(),
    videoUrl: z.string().optional(),
    videoDuration: z.string().optional(),
    isPreview: z.boolean().optional(),
  })
  .passthrough();

/**
 * Gated paid course content (AccessGate required). Lives at /learn/*.
 * Currently: ai-bootcamp (26 lessons), ai-pro (29 lessons incl. customer-profile module).
 */
const learn = defineCollection({
  loader: glob({ base: './src/content/learn', pattern: '**/*.md' }),
  schema: lessonSchema,
});

/**
 * Public free course content. Lives at /courses/*.
 * Currently: python, java, html-css, sql, angular (~700 lessons).
 */
const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '**/*.md' }),
  schema: lessonSchema,
});

export const collections = { learn, courses };
