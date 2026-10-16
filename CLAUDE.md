# Patterns Studio website — project notes

The single reference for how this site is built. **Read before changing anything; update it whenever a decision changes.**
Agent-specific Astro tips are in [AGENTS.md](AGENTS.md).

## Owner & intent
- Kedar Nimkar's one-person design studio, Singapore. Portfolio + services site.
- Wants it: mobile-first, cheap, steady, low-maintenance.
- Source designs: 6 Figma frames ("MacBook Air - 4…9", 1280 wide). Kedar supplies assets one by one; we build **page by page** and he reviews each.

## Stack
| Part | Choice |
|---|---|
| Framework | Astro 7 (static output). Node 22 via nvm (`.nvmrc`). |
| Content | Astro content collection `work` (`src/content/work/<slug>/index.md`, schema in `src/content.config.ts`). |
| CMS | **Sveltia CMS** 0.227.0 (open source, Decap-compatible) — just `public/admin/index.html` + `public/admin/config.yml`. No Astro code. See "CMS" below. |
| Styling | Plain CSS + tokens. No Tailwind. |
| Motion | None by default. Only animations Kedar explicitly approves (see Motion). No GSAP/Lenis/View Transitions installed. |
| Fonts | Self-hosted via @fontsource (only the weights listed below). |
| Hosting | **Preview live (2026-10-16):** repo `nimkarkedar/patternsstudio-v2` (public) → GitHub Actions (`.github/workflows/deploy.yml`) → https://nimkarkedar.github.io/patternsstudio-v2/ on every push to `main` (incl. CMS saves). Preview build = `SITE_URL` + `BASE_PATH=/patternsstudio-v2` + `PREVIEW=true` (every page noindex, robots.txt blocks all). The live site patternsstudio.co still comes from the OLD repo `nimkarkedar/patternsstudio.co` — untouched. **Launch:** in deploy.yml drop BASE_PATH/PREVIEW, set SITE_URL=https://patternsstudio.co, move the custom domain from the old repo to this one. |
| Paths | Every internal link/asset goes through `path()` in `src/data/site.ts` (adds `import.meta.env.BASE_URL`), so the same code works at a domain root and under `/patternsstudio-v2/`. Never write a root-relative `'/…'` link by hand. |

## Commands
- `npm run dev` → http://localhost:4322 (port 4322 is this project; never touch 4321). If styles look stale: stop it and restart with `-- --force`.
- **After adding/removing any npm package, restart the dev server with `--force`.** Otherwise Vite serves "504 Outdated Optimize Dep" and client JS silently fails.
- `npm run check:tokens` → fails on any hardcoded value outside tokens.css.
- `npm run build` → token check + `astro check` + build.

## Pages
| Route | Design | Source | Status |
|---|---|---|---|
| `/` Homepage (= Work) | MacBook Air - 4, cards reworked 2026-10-16 | `src/pages/index.astro` — hero, logo strip, 10 post cards (8 vertical art + headline, 2 horizontal testimonials) | ✅ built, awaiting card images |
| `/work/[slug]` Case study | MacBook Air - 11 (2026-10-16; PDF with notes on Kedar's Desktop) | `src/pages/work/[slug].astro` → `PostLayout.astro`; body = the post's Markdown | ✅ template built; all posts empty (noindex) — Kedar rewriting Jupiter Pots (2026-10-16) |
| `/styleguide` | — | `src/pages/styleguide.md` — every case-study block + how to write it; noindex, not in sitemap | ✅ |
| `/wow` Ways of working | MacBook Air - 5 | `src/pages/wow.astro` — `PortraitCard` ×2 (photos in `src/assets/wow/`), `Statement`, `ListCard` ×2; card headings mapped to `.t-heading` | ✅ built |
| `/services` | MacBook Air - 6 | `src/pages/services.astro` — `ProblemList` (grey band + 5 problem rows), `Statement` "Beyond this?"; problems mapped to `.t-heading` | ✅ built |
| `/about` | MacBook Air - 7 | `src/pages/about.astro` — `PortraitCard` (Kedar), story card (4 paragraphs + app-icon grid image `src/assets/about/app-icons.png`); book block removed until the book is ready (label `labels.buyBook` + `site.bookUrl` kept for later) | ✅ built |
| `/contact` | MacBook Air - 8 | `src/pages/contact.astro` — "Email me" = mailto via `routes.email`; "I hope you value design" mapped to `.t-body` | ✅ built |

## CMS (Sveltia CMS, chosen 2026-10-16)
- Why: two static files, no server, no custom Astro code; edits the same Markdown files the site builds from; works on GitHub Pages.
- **Local (now):** `npm run dev` → http://localhost:4322/admin/index.html in Chrome/Arc → "Work with Local Repository" → pick the project folder (the project is the git repo of `nimkarkedar/patternsstudio-v2`). Saves straight to disk; the dev server picks it up.
- **Online:** https://nimkarkedar.github.io/patternsstudio-v2/admin/ → "Sign In Using Access Token" (GitHub fine-grained token with Contents read/write on `patternsstudio-v2`). Each save = a commit → Actions rebuilds the preview (~2 min). ("Sign in with GitHub" button would need the Sveltia auth worker.)
- Post images upload into the post's own folder (`media_folder: ""`), saved as bare file names — Astro resolves them relative to the post (tested). Name files descriptively for SEO.
- **Keep `config.yml` fields in sync with `src/content.config.ts`.** Fields the CMS doesn't know may be dropped on save — old card teaser copy was moved to `docs/old-card-teasers.md` for that reason.
- `/admin/` is disallowed in robots.txt and has `noindex`.
- **Writing experience** (Kedar, 2026-10-16: "feels underwhelming… full page, like a proper editor"): preview pane off (`editor: { preview: false }`); the Post field is up to 1280 wide (other fields keep Sveltia's 768); its text area is ~a full screen tall and typeset like the live post (Lato 20/32 in a 720 column, Montserrat headings, Baskerville quotes) via a small `<style>` in `public/admin/index.html` (fonts from Google Fonts, admin only). Field order = card first (position → shape → image → alt → brand), then post (title → summary → cover → dates → Post), "Hide" last.
- **Save** is top-right (or **Cmd+S**). It's greyed out until something changes; restyled bigger + outlined so it stays visible when greyed (light and dark mode).
- Test the CMS headlessly: copy `public/admin` to a temp folder with `backend: { name: test-repo }` and load it (Sveltia's built-in test mode). Delete the copy after.

## Design system — the rules
**Nothing hardcoded. Ever.** Every colour, size, space, radius, duration and easing comes from `src/styles/tokens.css`. `npm run check:tokens` enforces it (only `@media` breakpoints are exempt, because CSS can't use variables there).

### Grid (from Figma)
12 columns × 49px, **32px gutter**, centred → content width **940px** (`--width-content`). (Figma was 60/20; Kedar widened the gutter for breathing room, 2026-10-15, keeping 940 so 170px of blue shows each side at 1280.) Gutter eases 20 → 32 between 768 and 1280. Card gap = gutter (`--rhythm-card-gap`). Big display headings (hero, statements) stay inside the 940 card width too (`--width-hero`); at 58px the homepage headline fits in 2 lines within 940. Card inner padding 40px desktop (`--rhythm-card-pad`). Page side gutter `--rhythm-gutter` (16 → 32).

### Colour roles (components use roles only)
| Role | Value | Use |
|---|---|---|
| `--color-page` | #2B18D7 brand blue (matched to the exported logo tiles) | page background, header |
| `--color-on-page` | white | text on blue |
| `--color-on-page-muted` | #C9C7F2 | inactive nav, footer (5.78:1 ✓ AA) |
| `--color-surface` / `--color-on-surface` | white / #171414 | cards |
| `--color-surface-muted` | #F7F7F7 | Services table header band |
| `--color-button` / `--color-on-button` | #171414 / white | the pill button |
| `--color-accent` | brand blue | links in case studies |
| `--color-surface-tint` | #EBF6FF | case-study table panel (from Kedar's design) |
| `--color-line-on-surface` | #D9D9D9 | hairlines on white (pull quote, `---`) |
| `--color-lightbox` | ink 92% | behind an enlarged image |
| `--color-placeholder` | #D9D9D9 | image placeholders |
All text pairs must pass WCAG AA.

**Card glow:** every card has a soft light-violet glow (`--shadow-glow`, from `--violet-300` #B9A4FF at 35%, 64px blur). Hover shadows are layered on top of it.

### Typography — EXACTLY 7 styles (Kedar, 2026-10-15). No other family, size or weight.
| Class | Spec (desktop) | Phone | Used for |
|---|---|---|---|
| `.t-display` | Montserrat 58 ExtraBold (was 64; changed 2026-10-16) | 40 | page heroes, big statements, mobile menu links |
| `.t-title` | Montserrat 49 ExtraBold, line-height 1.25 (design says 48/60; 49 kept) | 32 | case-study title |
| `.t-nav` | Montserrat 16 Bold | 16 | navigation only |
| `.t-heading` | Lato 32 Black | 24 | headings inside cards/sections (WOW card titles, Services problems, About role line, detail section heads), brand names until logos arrive |
| `.t-body` | Lato 20 Regular | 18 | ALL running text, buttons, links, names, roles |
| `.t-tiny` | Lato 12 Regular | 12 | footer only |
| `.t-quote` | **Libre Baskerville 32 Regular / 45, centred** (MacBook Air - 11) | 24 | case-study pull quotes: hairline above + below, optional `— Person name` (Montserrat Bold 20) |
| `.t-body-strong` | Lato 20 Black | 18 | **bold** inside case-study paragraphs. Lato 400 *italic* also loaded for `*emphasis*`. |

**Case-study page only** (Kedar's design MacBook Air - 11, 2026-10-16) — styled via `.prose` in `global.css`:
h2 Montserrat 32 Bold / 40 · h3 Montserrat 24 Bold / 30 · paragraphs + lists Lato 20 / 32, list spacing 4 (spec 5) · table heading Lato Black 20, rows Lato 20 / 28 · image caption Lato 12, centred, ink.
Never set `font-*` outside `global.css`. Sizes are fluid `clamp()` from phone → spec at 1280.

### Spacing
Use `--rhythm-*` role tokens (page-top, title-to-lead, lead-to-actions, action-pair, hero-to-content, section, card-gap, card-pad, label, stack, paragraph, list, row, nav, footer). Need a new gap? **Add a rhythm role**, don't pick a number.

### Breakpoints (mobile-first, `min-width` only)
- `48rem` (768) — desktop nav, 2-column card grid + 2:1 horizontal cards, side-by-side portrait cards.
(Add more here if introduced; keep the list short.)

### Header
Full-bleed: logo and Contact at the viewport edges (only the gutter between). **Sticky** with the page colour. A soft line (`--color-line-on-page`, same as footer) fades in under it (`--motion-header-line`, 250 ms) only when the first content on the page slides beneath it; fades out when it doesn't. Nav links centred, 48 apart. Phone: logo + "Menu" → full-screen sheet with big links.

## Components (`src/components/`)
- `Header`, `Footer`, `Logo` (wordmark SVG, `currentColor`), `WaveMark` (wave from the logo symbol — divider)
- `Hero` (display title + lead + slot), `Actions` (primary + ghost pill, stacked, always equal width: full content width on phones, width of the wider label ≥48rem), `Button` (`primary` | `ghost`; height `--size-button-h`, side padding `--rhythm-button-x`), `Statement` (big centred heading block)
- `Card` (white surface; a link with raised hover shadow only when given `href`; tilts only with `tilt`, WOW page only), `Media` (optimised image **or labelled placeholder**; `fixed` = 5:4 crop), `PostCard` (homepage card: vertical art + headline panel, horizontal testimonial), `ClientLogos` (scrolling logo strip), `PortraitCard` (WOW + About: cut-out photo + name label over it, text beside; phones: name + role under the photo, aligned with the text), `ListCard` (heading + bullets), `ProblemList` (Services problem/solution card — plain: no tilt, no colour play).
- Site data (nav, email, footer, Amazon link, client list, shared button labels `labels.explore` / `labels.connect`): `src/data/site.ts` — never inline URLs/labels in pages.

## Content: posts (blog posts / case studies)
- Homepage IS the work page (no separate /work listing). Header "Work" → `/`. Each card opens `/work/<slug>`. After the cards: "More work coming soon." + "Meanwhile... know my" line with a **ghost button** "Ways of working (WOW)" (no underlined text links — links that stand alone are buttons).
- One folder per post: `src/content/work/<slug>/index.md` (+ its image beside it). Schema: `src/content.config.ts`.
- **Card templates (locked by Kedar, 2026-10-16) — text is live, never baked into the image** (baked text went blurry when resized):
  - **Vertical** (half row, 4:5): Kedar's art fills the card (export **908 × 1135**, no text on it). Fields `eyebrow` (supporting line) + `headline` sit on an **App-Store-style panel**: the art melts into the image's own base colour, with a soft blur under the text. The colour is picked at build time from the bottom 30% of the image (`src/lib/card-color.ts`, sharp); text turns white or ink, AA-checked. ~25 characters of headline per line, two lines max.
  - **Horizontal** (full row): **testimonial on white** — `quote` (`.t-body`, Lato — Baskerville is for blog posts only), `name`, `role` as one unit, vertically centred — beside the person's photo (`image`: **square, on white, e.g. 940 × 940** — the slot is a square as tall as the card; the photo is shown whole (never cropped, so corner logos keep their margin), standing on the bottom edge), `imageSide: left | right`. At least 2:1 on desktop and grows with a long quote (`--height-card-horizontal: 50cqw`; the homepage `.span-full` cell is the size container). Phones: square photo above (left) / below (right) the quote. No photo → quote spans the card.
  - Empty card (no image, no text) = plain white.
- Fields: `order`, `size`, `brand` (screen-reader name + page title), `title`, `image` + `imageAlt`, vertical `eyebrow`/`headline`, horizontal `quote`/`name`/`role`/`imageSide`, `draft`. Old teaser copy is in `docs/old-card-teasers.md`.
- Vertical cards come in pairs between horizontal ones (build warns otherwise).
- Card UI: `PostCard.astro` — arrow-in-circle bottom-right, always visible (on a coloured panel it takes the panel's colours).

## Case studies (blog posts)
- **Design: MacBook Air - 11** (`/Users/kedar/Desktop/MacBook Air - 11.pdf`, notes are written inside the design).
- Write in plain Markdown in `src/content/work/<slug>/index.md`; images sit beside it with **descriptive file names** (e.g. `creating-a-jupiter-pot-in-under-30-seconds.png`) and real alt text.
- Frontmatter for SEO: `title` (≤60 chars), `description` (140–160 chars; shown as the summary under the title + in Google), `publishedDate`, `ogImage` + `ogImageAlt` (link preview; cropped to 1200×630).
- Blocks (see `/styleguide`): `##` sections, `###` sub-sections, paragraphs/lists, `>` pull quote → `.t-quote` with hairlines (last line `> — Name` = attribution), image + `"caption"` → full-width figure, table → scrollable on phones, YouTube/Vimeo link alone on a line → embedded player, `---` divider.
- Layout: on the blue page — black round back button in grid column 1, title from column 2 (no summary/byline shown; `description` is for Google + link previews only) → **cover card = the `ogImage`**, cropped to 1200×630 (`--ratio-cover`), so export covers at 1200×630 → 32 gap → white sheet (padding `--rhythm-sheet-pad`), everything in one 664px column (`--width-post`) → "Impressed? See all work" (→ home) / "Connect anytime" (→ email).
- Images: rounded, with a black enlarge button bottom-right (`--size-expand` 36); clicking the image opens it in a lightbox (`<dialog>`, no animation; Esc / × / click closes). Built by `rehype-prose.mjs` + script in `PostLayout.astro`.
- **Reading rhythm** (2026-10-16, "Medium/Substack feel"): column 720 (`--width-post`); body Lato 20/32 (`--leading-prose` 1.6); every block 24 apart (`--rhythm-prose`); images/video/tables/quotes/dividers 40 (`--rhythm-prose-block`); h2 gets 48→64 above, h3 40 above, both only 12 below (proximity: a heading belongs to its text); list items 4 apart; quote Baskerville 32/45. Sheet sides `--rhythm-sheet-x` (16 phone → 40). Implemented with margin-top "owl" rules in `global.css` (`.prose > * + *`), no grid gaps.
- A post with an empty body shows only the title + buttons (no cover, no white sheet), and is noindex.
- Pull quote = hairlines above + below. `---` = hairline. Tables = compact light-blue panel (cells 12 × 16), white row lines, values right-aligned (regular weight).
- The cover is shown at the top, so don't repeat it as the first image in the body.
- Markdown → blocks is done by `src/lib/rehype-prose.mjs` (needs `@astrojs/markdown-remark`, pinned 7.3.2 — Astro 7's default Markdown engine doesn't run plugins).
- A post with an empty body stays live (homepage card links to it) but is `noindex` and left out of sitemap / RSS / llms.txt until written.

## SEO & AI crawling
- `astro.config.mjs` `site: https://patternsstudio.co` (TODO confirm domain). Every page: unique title + description, canonical (trailing slash), Open Graph + X cards (default image `public/og-default.png`), RSS link.
- JSON-LD on every page (`src/lib/seo.ts`): Organization/ProfessionalService (UEN, Singapore, email), WebSite, Person (Kedar). Case studies add BlogPosting + BreadcrumbList.
- `/sitemap-index.xml` (@astrojs/sitemap), `/rss.xml`, `/robots.txt` (all search + AI crawlers explicitly allowed), `/llms.txt` (plain summary for AI assistants) — all generated from site data, never hand-edited.
- TODO Kedar: add public profiles to `site.sameAs` (LinkedIn, Substack, Gyaan Project) — strongest single boost for being recognised as an entity.

## Motion — NO animation unless Kedar asks for it
Kedar (2026-10-15): "Don't add any animation unless I say. I hate random movements just for the sake of it."
- No reveals, fades, hover lifts/zooms, smooth scroll, page transitions or CSS `transition`s. Hover = instant state change only.
- Approved list (the ONLY motion on the site):
  2. Header line fades in (250 ms) only while content is beneath the header.
  3. **WOW page cards only** tilt in 3D toward the mouse (max 3° each axis, `--motion-tilt-max`, perspective `--motion-tilt-depth`, eased 150 ms). Opt-in via `tilt` on `Card`/`PortraitCard`/`ListCard`; default off. No tilt on Home, Services, About (Kedar, 2026-10-16). Mouse only — off on touch and for reduced motion.
  4. Homepage cards hover ("elegant, like Apple"): rise 6px + scale 1.01, shadow deepens (`--shadow-rest` → `--shadow-lifted`), arrow nudges 2px right; 500 ms `--ease-lift`. Mouse only; off for reduced motion.
  5. Homepage client logos scroll continuously **inside the content container**, edges faded (`ClientLogos.astro`, tokens `--motion-logo-per-item` (speed), `--rhythm-logo-strip` (space below; above = hero's bottom space)). Static wrapped row under `prefers-reduced-motion`.
- Adding anything to this list needs his explicit OK first.

## Copy rules
- **Locked (Kedar, 2026-10-15):** homepage headline = "An independent design studio with taste and AI chops." Don't change without his say.
- Use Kedar's words **verbatim** from the designs. Never invent copy. Typos stay unless he fixes them.
- No all-caps / `text-transform: uppercase`.
- Placeholders must be plainly labelled (`TODO(Kedar)`, "Image: …").

## Open items / waiting on Kedar
- Images: all card photos/covers, client logo FILES (19 names listed in `src/data/site.ts`; drop files in `src/assets/clients/` named as `file`), testimonial brand logos, About app icons, WOW portraits.
- Amazon book link (`src/data/site.ts`). Email is set: kedar@patternsstudio.co (`routes.email` = mailto link).
- Homepage: Jupiter goals card and Lumosity card reuse the Cleartrip text in the design — real summaries needed.
- Which projects get detail pages, and their content.
