// robots.txt — open to all search engines AND AI crawlers (Kedar wants the work found and cited).
// The GitHub preview build blocks everything (and every page is noindex) so it never competes with the real site.
import type { APIContext } from 'astro';
import { path, isPreview } from '../data/site';

export function GET({ site }: APIContext) {
  if (isPreview) {
    return new Response('# Preview build — not for search engines.\nUser-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const body = [
    '# Patterns Studio — everyone is welcome to read and cite this work.',
    'User-agent: *',
    'Allow: /',
    `Disallow: ${path('/styleguide/')}`,
    `Disallow: ${path('/admin/')}`,
    '',
    '# AI crawlers, explicitly allowed',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Bingbot']
      .flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', `Disallow: ${path('/styleguide/')}`, `Disallow: ${path('/admin/')}`, '']),
    `Sitemap: ${new URL(path('/sitemap-index.xml'), site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
