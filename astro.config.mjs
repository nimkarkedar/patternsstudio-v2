// @ts-check
import { readFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeProse from './src/lib/rehype-prose.mjs';

// Case studies with no written body yet are "thin" pages: keep them out of the sitemap
// (they are also marked noindex in the page itself) until Kedar writes them.
/** @param {string} slug */
const hasBody = (slug) => {
  const file = `./src/content/work/${slug}/index.md`;
  if (!existsSync(file)) return true;
  return readFileSync(file, 'utf8').split(/^---$/m).slice(2).join('---').trim().length > 0;
};

// Where the site is served. Defaults = the live domain at its root.
// The GitHub preview build (.github/workflows/deploy.yml) sets SITE_URL, BASE_PATH=/patternsstudio-v2 and PREVIEW=true.
const SITE_URL = process.env.SITE_URL ?? 'https://patternsstudio.co';
const BASE_PATH = process.env.BASE_PATH ?? '/';
const BASE = BASE_PATH.replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  vite: { define: { 'import.meta.env.PREVIEW': JSON.stringify(process.env.PREVIEW === 'true') } },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.slice(BASE.length);
        if (path.startsWith('/styleguide')) return false;
        const m = path.match(/^\/work\/([^/]+)\/?$/);
        return m ? hasBody(m[1]) : true;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeProse],
  },
});
