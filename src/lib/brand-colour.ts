// The client's brand colour, read from the logo SVG in the post's folder (Kedar, 2026-11-09).
// The story cards are tinted with it (soft shades are mixed in tokens.css from --brand).
// Picks the most-used colour that isn't white, black or grey. No SVG / no colour → undefined (cards stay lavender).
const logos = import.meta.glob<string>('/src/content/work/*/*.svg', { query: '?raw', import: 'default', eager: true });

const hex6 = (h: string) => (h.length === 4 ? '#' + [...h.slice(1)].map((c) => c + c).join('') : h).toLowerCase();

function saturation(h: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  return max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
}

export function brandColour(postId: string): string | undefined {
  const entry = Object.entries(logos).find(([path]) => path.startsWith(`/src/content/work/${postId}/`));
  if (!entry) return;
  const counts = new Map<string, number>();
  for (const m of entry[1].matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)) {
    const h = hex6(m[0]);
    if (saturation(h) < 0.25) continue; // white, black, greys
    counts.set(h, (counts.get(h) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
}
