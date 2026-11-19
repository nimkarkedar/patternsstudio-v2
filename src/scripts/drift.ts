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
    let touching = false;         // a finger is on the strip: never write scrollLeft (it fights the swipe)
    let visible = true;
    let idleUntil = 0;            // a swipe holds the drift until this time
    let written = -1;             // the scrollLeft we last set, to tell our own scroll events from the visitor's
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
      if (Math.round(x) !== Math.round(track.scrollLeft)) { written = Math.round(x); track.scrollLeft = x; }
    };
    // Start on the middle copy (looks identical to the first). On phones the strip can open on a chosen card
    // (data-start-phone = its index in one set; Kedar 2026-11-19: Eva first on mobile).
    const desktop = matchMedia('(min-width: 48rem)');
    const startAt = () => {
      const i = !desktop.matches ? Number(root.dataset.startPhone ?? 0) : 0;
      return home * loop() + (items[i].offsetLeft - items[0].offsetLeft);
    };
    jump(startAt());
    // Layout can settle after this script runs (fonts, styles): measure again, unless the visitor already scrolled.
    window.addEventListener('load', () => { if (!idleUntil) jump(startAt()); });

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const running = !reduced.matches && !hovering && !focused && !touching && visible && now >= idleUntil;
      velocity += ((running ? speed : 0) - velocity) * Math.min(1, dt * ease);
      if (running && velocity > 0.5) jump(wrapped(pos + velocity * dt));
      requestAnimationFrame(frame);
    };

    // Once a scroll has fully stopped (finger up, momentum done), move back into the middle copy. Never sooner:
    // writing scrollLeft mid-fling cancels the fling on iOS.
    const settled = () => { if (!touching) jump(wrapped(track.scrollLeft)); };
    const hasScrollEnd = 'onscrollend' in window; // older Safari: fall back to a short quiet period
    const hold = () => { idleUntil = performance.now() + resumeAfter; velocity = 0; };

    track.addEventListener('scroll', () => {
      if (written >= 0 && Math.abs(track.scrollLeft - written) <= 1) return; // our own write
      written = -1;
      // The visitor scrolled: hold the drift, then carry on from where they left it.
      hold();
      pos = track.scrollLeft;
      if (!hasScrollEnd) { clearTimeout(settle); settle = setTimeout(settled, 200) as unknown as number; }
    }, { passive: true });
    track.addEventListener('scrollend', settled);

    track.addEventListener('touchstart', () => { touching = true; hold(); }, { passive: true });
    const release = () => { touching = false; hold(); };
    track.addEventListener('touchend', release, { passive: true });
    track.addEventListener('touchcancel', release, { passive: true });

    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
    root.addEventListener('pointerleave', () => { hovering = false; });
    // Keyboard focus only.
    root.addEventListener('focusin', (e) => { focused = (e.target as HTMLElement).matches(':focus-visible'); });
    root.addEventListener('focusout', () => { focused = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);

    requestAnimationFrame(frame);
  }
}
