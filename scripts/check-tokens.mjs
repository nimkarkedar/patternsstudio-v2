// Fails if any raw design value (colour, length, duration, font) appears outside src/styles/tokens.css.
// Run: npm run check:tokens  (also runs before every build)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const ALLOWED_FILE = 'styles/tokens.css';
const RAW = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|(?<![\w-])\d*\.?\d+(px|rem|em|vw|vh|ms|s)\b/;
const FONT = /font-(family|size|weight)\s*:/;
const TEXT_STYLES_FILE = 'styles/global.css'; // the only place font-* properties may be set (via tokens)

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|css)$/.test(name)) files.push(p);
  }
};
walk(ROOT);

const problems = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  if (rel === ALLOWED_FILE) continue;
  const src = readFileSync(file, 'utf8');
  // Only inspect CSS: whole .css files, or <style> blocks in .astro files.
  const blocks = rel.endsWith('.css') ? [[src, 0]] : [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => [m[1], m.index]);
  for (const [css, offset] of blocks) {
    css.split('\n').forEach((line, i) => {
      const code = line.replace(/\/\*.*?\*\//g, '').trim();
      if (!code || code.startsWith('@media') || code.startsWith('@import') || code.startsWith('*') || code.startsWith('/*')) return;
      const lineNo = src.slice(0, offset).split('\n').length + i;
      if (RAW.test(code)) problems.push(`${rel}:${lineNo}  raw value → use a token: ${code}`);
      if (FONT.test(code) && rel !== TEXT_STYLES_FILE) problems.push(`${rel}:${lineNo}  font property → use a .t-* text style: ${code}`);
    });
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} hardcoded value(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`✔ tokens: ${files.length} files clean`);
