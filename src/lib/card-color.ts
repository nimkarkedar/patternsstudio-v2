// Vertical homepage cards: picks the text panel's "base colour" from the card image at build time
// (App Store "Today" cards) — the most common colour in the bottom 30% of the image, and whether
// light or dark text reads better on it. Text always passes WCAG AA (4.5:1) — if neither
// light nor dark text reaches it, the colour is darkened/lightened until one does.
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';

export interface CardColor {
  /** Panel colour, e.g. "#d8939e". Use as a CSS custom property, never in a stylesheet. */
  bg: string;
  /** Text tone that reads on `bg`. */
  tone: 'light' | 'dark';
}

// Text colours the tones map to (must match --white / --ink-900 in tokens.css).
const LIGHT: RGB = [255, 255, 255];
const DARK: RGB = [23, 20, 20];
const AA = 4.5;

type RGB = [number, number, number];

const luminance = ([r, g, b]: RGB) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: RGB, b: RGB) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const hex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (c: RGB, to: RGB, t: number): RGB => c.map((v, i) => v + (to[i] - v) * t) as RGB;

const cache = new Map<string, CardColor>();

export async function cardColor(image: ImageMetadata): Promise<CardColor> {
  const path = (image as ImageMetadata & { fsPath?: string }).fsPath;
  if (!path) throw new Error('cardColor: image has no file path');
  if (cache.has(path)) return cache.get(path)!;

  // Small copy, cropped like the card (4:5); only the bottom 30%, where the panel sits.
  const W = 40, H = 50;
  const { data, info } = await sharp(path)
    .flatten({ background: '#ffffff' })
    .resize(W, H, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Most common colour (coarse buckets), averaged within its bucket.
  const buckets = new Map<number, { n: number; sum: RGB }>();
  for (let y = Math.round(H * 0.7); y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * info.channels;
      const px: RGB = [data[i], data[i + 1], data[i + 2]];
      const k = (px[0] >> 4) * 256 + (px[1] >> 4) * 16 + (px[2] >> 4);
      const b = buckets.get(k) ?? { n: 0, sum: [0, 0, 0] };
      b.n++;
      b.sum = b.sum.map((v, j) => v + px[j]) as RGB;
      buckets.set(k, b);
    }
  }
  const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
  let bg = top.sum.map((v) => v / top.n) as RGB;

  // Pick the tone with more contrast; nudge the colour until that tone passes AA.
  const tone: CardColor['tone'] = contrast(bg, LIGHT) >= contrast(bg, DARK) ? 'light' : 'dark';
  const text = tone === 'light' ? LIGHT : DARK;
  const away = tone === 'light' ? DARK : LIGHT;
  for (let step = 0; contrast(bg, text) < AA && step < 20; step++) bg = mix(bg, away, 0.05);

  const result = { bg: hex(bg), tone };
  cache.set(path, result);
  return result;
}
