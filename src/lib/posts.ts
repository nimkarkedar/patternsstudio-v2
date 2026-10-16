// Published, written case studies — the ones search engines, RSS and AI crawlers should see.
import { getCollection } from 'astro:content';

export async function writtenPosts() {
  const posts = await getCollection('work', ({ data }) => !data.draft);
  return posts
    .filter((p) => Boolean(p.body?.trim()))
    .sort((a, b) => (b.data.publishedDate?.valueOf() ?? 0) - (a.data.publishedDate?.valueOf() ?? 0));
}
