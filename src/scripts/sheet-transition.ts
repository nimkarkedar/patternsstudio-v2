// /work → post transition (Kedar, 2026-11-06: "elegant and mature, but cool and modern"). Approved motion.
//  1. On /work, a click on a post: a white sheet with a rounded top rises from the bottom and covers the screen
//     (--motion-sheet-cover), then the post loads.
//  2. On the post, the same white sheet starts over the whole screen and slides down (--motion-sheet-reveal)
//     until its rounded top sits exactly on the post's white section, uncovering the title and story cards.
//     Same colour, same corners: the hand-off to the real section is invisible.
// One curve for both (--ease-sheet). Skipped for reduced motion, modified clicks (new tab) and direct visits.
// The post page shows its cover before first paint (inline script in PostLayout) using this flag.
const FLAG = 'sheet-cover';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
// Durations in milliseconds. The production CSS minifier rewrites "700ms" as ".7s", so read both units.
const ms = (name: string) => {
  const v = css(name);
  return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000;
};

// ── /work: rise ─────────────────────────────────────────
for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-sheet-link]')) {
  link.addEventListener('click', (e) => {
    if (reduced() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const cover = document.createElement('div');
    cover.className = 'sheet-cover';
    cover.setAttribute('aria-hidden', 'true');
    document.body.append(cover);
    const rise = cover.animate(
      [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
      { duration: ms('--motion-sheet-cover'), easing: css('--ease-sheet'), fill: 'forwards' },
    );
    const go = () => {
      try { sessionStorage.setItem(FLAG, '1'); } catch { /* private mode: no reveal, still navigates */ }
      location.href = link.href;
    };
    rise.finished.then(go, go);
  });
}
// Back from a post (page restored from the back/forward cache): take the cover away.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) document.querySelectorAll('.sheet-cover').forEach((c) => c.remove());
});

// ── Post: settle ────────────────────────────────────────
const cover = document.querySelector<HTMLElement>('[data-sheet-cover]');
const sheet = document.querySelector<HTMLElement>('.post .sheet');
let arrived = false;
try { arrived = Boolean(sessionStorage.getItem(FLAG)); sessionStorage.removeItem(FLAG); } catch { /* ignore */ }

if (cover && arrived) {
  const done = () => cover.remove();
  if (reduced() || !sheet) done();
  else {
    // Wait for the fonts, so the title and cards have their final height before measuring where the sheet sits.
    const fonts = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 400))]);
    fonts.then(() => requestAnimationFrame(() => {
      const to = Math.min(sheet.getBoundingClientRect().top, window.innerHeight);
      cover.animate(
        [{ transform: 'translateY(0)' }, { transform: `translateY(${to}px)` }],
        { duration: ms('--motion-sheet-reveal'), easing: css('--ease-sheet'), fill: 'forwards' },
      ).finished.then(done, done);
    }));
  }
}
