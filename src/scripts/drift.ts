// Gentle right → left drift for a horizontal scroller (approved motion: homepage reviews, Kedar 2026-10-30;
// post story cards, Kedar 2026-11-06). Markup: [data-drift data-sets=N] > [data-drift-track] > [data-drift-item]…,
// the list rendered N times (copies aria-hidden). The strip lives in the middle copy and jumps back by one set once
// a scroll settles, which looks identical. It eases to a stop while hovered or keyboard-focused, holds for a few
// seconds after a swipe, and never runs under reduced motion (then it's a plain scroller).

for (const root of document.querySelectorAll<HTMLElement>('[data-drift]')) {
  const track = root.querySelector<HTMLElement>('[data-drift-track]');
  const items = track ? [...track.querySelectorAll<HTMLElement>('[data-drift-item]')] : [];

  if (track && items.length > 1) {
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => parseFloat(css.getPropertyValue(name));
    const speed = token('--motion-review-speed');      // px per second
    const ease = token('--motion-review-ease');        // 1/seconds
    const resumeAfter = token('--motion-review-resume'); // ms
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    const sets = Number(root.dataset.sets);
    const perSet = items.length / sets;
    const home = Math.floor(sets / 2); // the middle copy
    const loop = () => items[perSet].offsetLeft - items[0].offsetLeft; // width of one full set

    let pos = 0;                  // float position (scrollLeft may round)
    let velocity = 0;
    let hovering = false;
    let focused = false;
    let visible = true;
    let idleUntil = 0;            // a swipe holds the drift until this time
    let driving = false;          // true while we set scrollLeft ourselves
    let settle = 0;
    let last = 0;

    // Bring the position back into the middle copy, so there's plenty of room both ways.
    const wrapped = (x: number) => {
      const d = loop();
      const offset = (((x - home * d) % d) + d) % d;
      return home * d + offset;
    };
    const jump = (x: number) => {
      pos = x;
      if (Math.round(x) !== track.scrollLeft) { driving = true; track.scrollLeft = x; }
    };
    jump(home * loop()); // start on the middle copy — looks identical to the first
    // Layout can settle after this script runs (fonts, styles): measure again, unless the visitor already scrolled.
    window.addEventListener('load', () => { if (!idleUntil) jump(home * loop()); });

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const running = !reduced.matches && !hovering && !focused && visible && now >= idleUntil;
      velocity += ((running ? speed : 0) - velocity) * Math.min(1, dt * ease);
      if (velocity > 0.5 && now >= idleUntil) jump(wrapped(pos + velocity * dt));
      requestAnimationFrame(frame);
    };

    track.addEventListener('scroll', () => {
      if (driving) { driving = false; return; }
      // The visitor scrolled: hold the drift, then carry on from where they left it.
      // Wrap only once the scroll has settled, so a swipe is never cut short.
      idleUntil = performance.now() + resumeAfter;
      velocity = 0;
      pos = track.scrollLeft;
      clearTimeout(settle);
      settle = window.setTimeout(() => jump(wrapped(track.scrollLeft)), 150);
    }, { passive: true });

    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
    root.addEventListener('pointerleave', () => { hovering = false; });
    // Keyboard focus only.
    root.addEventListener('focusin', (e) => { focused = (e.target as HTMLElement).matches(':focus-visible'); });
    root.addEventListener('focusout', () => { focused = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);

    requestAnimationFrame(frame);
  }
}
