import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * `work` = blog posts / case studies. Every homepage card is one post; the card is ONLY an image
 * (custom-designed per case study) and links to /work/<folder>.
 *
 *   src/content/work/<slug>/index.md   ← frontmatter = the card; Markdown body = the case study
 *   src/content/work/<slug>/<descriptive-name>.png  ← card image + case-study images.
 *   File names are part of SEO: describe the image (e.g. creating-a-jupiter-pot-in-under-30-seconds.png).
 *
 * SEO fields: `title` (≤ 60 chars ideal), `description` (the short summary shown under the title,
 * used for search results and link previews; ~140–160 chars), `publishedDate`, `ogImage` (wide image
 * for link previews; 1.9:1 works best).
 *
 * size: vertical (half row, 4:5): art + eyebrow/headline | horizontal (full row): testimonial + person photo.
 * Old card teaser copy lives in docs/old-card-teasers.md.
 */
// The CMS can save a cleared optional field as '' (or null) — treat that as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);

const work = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/work',
    generateId: ({ entry }) => entry.split('/')[0], // folder name = URL slug
  }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      size: z.enum(['vertical', 'horizontal']),
      brand: z.string(), // used for the link's accessible name and page title
      title: z.string().optional(), // case-study title; falls back to brand
      description: z.string().optional(), // SEO summary / subtitle under the title
      publishedDate: z.preprocess(blank, z.coerce.date().optional()),
      updatedDate: z.preprocess(blank, z.coerce.date().optional()),
      ogImage: z.preprocess(blank, image().optional()), // link-preview image; falls back to the site default
      ogImageAlt: z.string().optional(),
      image: z.preprocess(blank, image().optional()), // empty white card until supplied
      imageAlt: z.string(),
      // Vertical card text (live, on the App-Store panel): supporting line above, headline below.
      eyebrow: z.string().optional(),
      headline: z.string().optional(),
      // Horizontal card = testimonial on white; `image` is the person's photo.
      quote: z.string().optional(),
      name: z.string().optional(),
      role: z.string().optional(),
      imageSide: z.enum(['left', 'right']).default('right'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
