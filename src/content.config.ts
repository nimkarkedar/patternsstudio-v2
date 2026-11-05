import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * `work` = blog posts / case studies. Every /work card is one post (Kedar, 2026-11-01): the card is ONLY
 * Kedar's graphic, at the link-preview ratio 1200:630, and links to /work/<folder>. The same graphic is
 * the cover at the top of the post and the image shown when the link is shared (WhatsApp, LinkedIn, X).
 *
 *   src/content/work/<slug>/index.md   ← frontmatter = card + SEO; Markdown body = the post
 *   src/content/work/<slug>/<descriptive-name>.png  ← card graphic + post images.
 *   File names are part of SEO: describe the image (e.g. creating-a-jupiter-pot-in-under-30-seconds.png).
 *
 * SEO fields: `title` (≤ 60 chars ideal), `description` (Google + link previews, not shown on the page;
 * ~140–160 chars), `publishedDate`, `ogImage` (the card graphic).
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
      client: z.string(), // Notion "Client name"; also the card's fallback accessible name
      title: z.string(), // post title; the CMS also makes the folder name (= URL) from it
      description: z.string().optional(), // Google + link previews
      publishedDate: z.preprocess(blank, z.coerce.date().optional()),
      updatedDate: z.preprocess(blank, z.coerce.date().optional()),
      ogImage: z.preprocess(blank, image().optional()), // card graphic = post cover = link preview; empty white card until supplied
      ogImageAlt: z.string().optional(),
      // Project details panel (Kedar, 2026-11-05), one Notion column each. Blank = not shown.
      logo: z.preprocess(blank, image().optional()), // Notion "Client logo": colour logo that works on pale blue
      industry: z.string().optional(),
      live: z.preprocess(blank, z.url().optional()), // Notion "Live link": shows as "Status (Live)" + the address
      scope: z.array(z.string()).default([]),
      testimonial: z.preprocess(blank, z.string().optional()),
      impact: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
