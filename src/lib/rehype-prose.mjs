// Turns plain Markdown into the case-study "atoms" — so posts stay plain Markdown (CMS-friendly).
//
//   ![Alt text](./image.png "Caption")        → <figure><button.zoom><img alt>(enlarge icon)</button><figcaption>Caption</figcaption></figure>
//                                                (the button opens the image larger — lightbox script in PostLayout)
//   https://www.youtube.com/watch?v=ID         → privacy-friendly YouTube embed (link alone on its line)
//   https://vimeo.com/ID                       → Vimeo embed
//   | Markdown | table |                       → wrapped so it scrolls sideways on phones
//   > Quote                                    → pull quote (hairlines above/below)
//   >
//   > — Person name                            → optional name under the quote

const isWhitespace = (n) => n.type === 'text' && !n.value.trim();
const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

// "Enlarge" icon (four corner arrows) shown on every case-study image.
const svgAttrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', ariaHidden: 'true' };
const zoomIcon = () =>
  el('span', { className: ['zoom-icon'] }, [
    el('svg', svgAttrs, ['M15 15l6 6', 'M15 9l6-6', 'M21 16v5h-5', 'M21 8V3h-5', 'M3 16v5h5', 'M3 21l6-6', 'M3 8V3h5', 'M3 3l6 6'].map((d) => el('path', { d }))),
  ]);

function videoEmbedUrl(href) {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' && u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`;
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed${u.pathname}`;
    if (host === 'vimeo.com' && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video${u.pathname}`;
  } catch {}
  return null;
}

function transform(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type !== 'element') return child;

    if (child.tagName === 'p') {
      const kids = child.children.filter((k) => !isWhitespace(k));

      // Image alone in a paragraph → figure (+ caption from the Markdown title).
      if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
        const img = kids[0];
        const caption = img.properties.title;
        delete img.properties.title;
        const zoom = el('button', { type: 'button', className: ['zoom'], ariaHaspopup: 'dialog' }, [img, zoomIcon()]);
        return el('figure', {}, caption ? [zoom, el('figcaption', {}, [text(String(caption))])] : [zoom]);
      }

      // Bare YouTube / Vimeo link alone in a paragraph → embedded player.
      if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'a') {
        const a = kids[0];
        const label = a.children.map((c) => c.value ?? '').join('');
        const src = videoEmbedUrl(String(a.properties.href));
        if (src && label === a.properties.href) {
          return el('div', { className: ['embed'] }, [
            el('iframe', {
              src,
              title: 'Embedded video',
              loading: 'lazy',
              allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
              allowFullScreen: true,
              referrerPolicy: 'strict-origin-when-cross-origin',
            }),
          ]);
        }
      }
    }

    if (child.tagName === 'table') return el('div', { className: ['table-scroll'] }, [child]);

    if (child.tagName === 'blockquote') {
      const paras = child.children.filter((k) => k.type === 'element' && k.tagName === 'p');
      const last = paras.at(-1);
      const first = last?.children[0];
      let caption = null;
      if (paras.length > 1 && first?.type === 'text' && /^\s*[—–-]{1,2}\s+/.test(first.value)) {
        first.value = first.value.replace(/^\s*[—–-]{1,2}\s+/, '— ');
        caption = el('figcaption', {}, last.children);
        child.children = child.children.filter((k) => k !== last);
      }
      return el('figure', { className: ['pull-quote'] }, caption ? [child, caption] : [child]);
    }

    transform(child);
    return child;
  });
}

export default function rehypeProse() {
  return (tree) => transform(tree);
}
