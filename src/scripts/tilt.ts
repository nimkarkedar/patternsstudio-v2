// 3D tilt toward the cursor for every element with [data-tilt] (all cards except /work — Kedar, 2026-10-30).
// Sets --tilt-x / --tilt-y; the transform itself is in global.css. Angles come from --motion-tilt-max in tokens.css.
// Mouse only; off on touch and for reduced motion.
const canTilt = matchMedia('(hover: hover) and (pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  const max = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-tilt-max'));
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--tilt-y', `${x * 2 * max}deg`);
      card.style.setProperty('--tilt-x', `${-y * 2 * max}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}
