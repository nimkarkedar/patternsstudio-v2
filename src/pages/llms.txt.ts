// /llms.txt — a plain-language summary of the site for AI assistants (llmstxt.org convention).
// Built from the same site data + case studies, so it never drifts from the real pages.
import type { APIContext } from 'astro';
import { site, nav, routes, path } from '../data/site';
import { writtenPosts } from '../lib/posts';

export async function GET({ site: origin }: APIContext) {
  // Trailing slash matches each page's canonical URL.
  const url = (path: string) => new URL(path.endsWith('/') || path.includes('.') ? path : `${path}/`, origin).href;
  const posts = await writtenPosts();
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} (${site.legalName}, UEN ${site.uenNumber}) is an independent design studio in ${site.locality}, founded by ${site.founder}. Contact: ${site.email}.`,
    '',
    '## Pages',
    ...nav.map((n) => `- [${n.label}](${url(n.href)})`),
    `- [Contact](${url(routes.contact)})`,
    '',
    '## Case studies',
    ...posts.map((p) => `- [${p.data.title ?? p.data.brand}](${url(routes.work(p.id))})${p.data.description ? `: ${p.data.description}` : ''}`),
    '',
    '## Optional',
    `- [RSS feed](${url(path('/rss.xml'))})`,
    `- [Sitemap](${url(path('/sitemap-index.xml'))})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
