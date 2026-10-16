// RSS feed of written case studies (/rss.xml) — also a clean, machine-readable index for crawlers.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site, routes } from '../data/site';
import { writtenPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await writtenPosts();
  return rss({
    title: `${site.name} — case studies`,
    description: site.description,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title ?? p.data.brand,
      description: p.data.description,
      pubDate: p.data.publishedDate,
      link: `${routes.work(p.id)}/`,
      author: `${site.email} (${site.founder})`,
    })),
    customData: '<language>en</language>',
  });
}
