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
| Writing | **Notion** — posts are written in a Notion database and Claude converts them to Markdown (see "Writing posts in Notion"). The Sveltia CMS (`public/admin/`) was removed 2026-11-01; it's in git history if ever wanted back. |
| Styling | Plain CSS + tokens. No Tailwind. |
| Motion | None by default. Only animations Kedar explicitly approves (see Motion). No GSAP/Lenis/View Transitions installed. |
| Fonts | Self-hosted via @fontsource (only the weights listed below). |
| Hosting | **Preview live (2026-10-16):** repo `nimkarkedar/patternsstudio-v2` (public) → GitHub Actions (`.github/workflows/deploy.yml`) → https://nimkarkedar.github.io/patternsstudio-v2/ on every push to `main`. Preview build = `SITE_URL` + `BASE_PATH=/patternsstudio-v2` + `PREVIEW=true` (every page noindex, robots.txt blocks all). The live site patternsstudio.co still comes from the OLD repo `nimkarkedar/patternsstudio.co` — untouched. **Launch:** in deploy.yml drop BASE_PATH/PREVIEW, set SITE_URL=https://patternsstudio.co, move the custom domain from the old repo to this one. |
| Paths | Every internal link/asset goes through `path()` in `src/data/site.ts` (adds `import.meta.env.BASE_URL`), so the same code works at a domain root and under `/patternsstudio-v2/`. Never write a root-relative `'/…'` link by hand. |

## Commands
- `npm run dev` → http://localhost:4322 (port 4322 is this project; never touch 4321). If styles look stale: stop it and restart with `-- --force`.
- **After adding/removing any npm package, restart the dev server with `--force`.** Otherwise Vite serves "504 Outdated Optimize Dep" and client JS silently fails.
- `npm run check:tokens` → fails on any hardcoded value outside tokens.css.
- `npm run build` → token check + `astro check` + build.

## Pages
| Route | Design | Source | Status |
|---|---|---|---|
| `/` Homepage | MacBook Air - 16 (2026-10-30) | `src/pages/index.astro` — hero ("Growth has a pattern. Let's find yours.", 22px lead `.t-lead`, one button "Explore our work" → /work) + `ClientReviews` (5 review cards drifting right → left — advisors (`advisor: true` in `reviews`) are left out here and on /reviews, they're on About, "See all client reviews" ghost button centred + ← → buttons right) | ✅ built; quotes are sample wording |
| `/reviews` Client reviews | — (no design yet) | `src/pages/reviews.astro` — headline "We don’t like blowing our own trumpet. But how else can we explain?", `ClientLogoGrid` (all client logos, static, 4 per row / 2 on phones, hairlines `--color-line-on-page` between logos only — none on the outer edges, straight on the blue), then all `ReviewCard`s (advisors excluded) in a 2-column grid | ✅ placeholder layout |
| `/work` All work | MacBook Air - 4 (the old homepage, moved 2026-10-30) | `src/pages/work/index.astro` — heading "Work that speaks for itself" only (Kedar 2026-11-01: no lead, buttons or logo strip), then a stack of full-width `PostCard`s (each = Kedar's graphic at 1200:630, opens its post; Kedar 2026-11-01). Nothing after the cards ("More work coming soon" + WOW button removed 2026-11-01) | ✅ built; first post: Neufin Energy (2026-11-01) |
| `/work/[slug]` Case study | MacBook Air - 11 (2026-10-16; PDF with notes on Kedar's Desktop) | `src/pages/work/[slug].astro` → `PostLayout.astro`; body = the post's Markdown | ✅ template built; all posts empty (noindex) — Kedar rewriting Jupiter Pots (2026-10-16) |
| `/styleguide` | — | `src/pages/styleguide.md` — every case-study block + how to write it; noindex, not in sitemap | ✅ |
| `/wow` Our Way | MacBook Air - 19 (2026-10-30) | `src/pages/wow.astro` — hero ("There are just 2 ways of working. We are fine either way.", 22px lead, "Explore what we do" → /services), `PortraitCard` ×2 (Hitchcock / Wong Kar-wai, 288 → 384 tall, was 440), ghost "Check out what we have done" → /work. Statement + ListCards removed | ✅ built |
| `/services` What we do | MacBook Air - 20 (2026-10-30) | `src/pages/services.astro` — hero ("Different problems. Familiar patterns.", 22px lead, no button), `ProblemList` (table card: pale-blue `--color-surface-tint` header band, header `.t-subheading`, cells `.t-lead` (22), problem + solution as plain ink text — no pills/tags, no blue (blue = links only)), micro-copy "We’ve solved problems like these before." + primary "See our work" → /work (Claude's wording, Kedar to approve), "Traditionally what we do is called" + `ServiceGrid` (Apple-style: 6 separate white cards, 2 columns, bare 48px brand-blue Phosphor Regular icon (outline, SF Symbols-like; no tile — SF Symbols can't be used on the web) above a `.t-heading`, `src/icons/services/`), ghost "Check out what we have done" → /work | ✅ built |
| `/about` | MacBook Air - 17 (+ 18 = open card), 2026-10-30 | `src/pages/about.astro` — hero (title + 22px lead), 2 `TeamCard`s (Kedar, John) → "Explore what we do" (→ /services), "Advisors" + 4 `TeamCard`s (Andrew, Audrey, Jeremy, Manav; roles pulled from `reviews`) → ghost "Explore our ways of working" (→ /wow). Old story card / app icons removed | ✅ built; John + Audrey bios TODO, LinkedIn URLs TODO |
| `/contact` | MacBook Air - 8 | `src/pages/contact.astro` — "Email me" = mailto via `routes.email`; "I hope you value design" mapped to `.t-body` | ✅ built |

## Writing posts in Notion (Kedar, 2026-11-01)
- Kedar writes posts (and dumps old work) in the Notion database **Patterns Work Blog Posts** (Patterns teamspace → Patterns OS, next to Projects): https://app.notion.com/p/7737b16bf5674fa584e6c5e93aae0955 — data source `collection://6072dff8-8bd0-4d60-9d0b-bcb910c34222`.
- Columns map to the post schema: Title, Status (Idea → Draft → Ready → Live), Brand, Project (two-way link to Projects; shows there as "Blog posts"), Summary (= `description`), Card graphic (= `ogImage`, 2400×1260), Card alt, Slug, Order, Published.
- **Post header details are columns too** (2026-11-01; were a table in the page body): Client, Industry (select), Time frame, View work (URL → `href`), Scope (multi-select → joined "A, B, C and D"), Role & Responsibilities, Impact (one point per line in Notion → a YAML list; 1 line = sentence, 2+ = bullets, always full row). They become `facts` in that order. **Blank in Notion = not shown on the site.** Location and Budget are deliberately not shown (Kedar 2026-11-01: budgets are the client's business and anchor future prices).
- "Publish the ready posts" = Claude fetches every **Ready** page, writes `src/content/work/<slug>/index.md`, downloads images into the post folder (Notion file URLs expire), shows Kedar the SEO fields, then sets Status → Live. Manual, no sync script.
- Only pages in this database are ever published — never pull from project pages (they hold client-confidential notes).
- Supported blocks: H2/H3, paragraphs, lists, bold/italic/links, quote (last line `— Name`), image + caption, table, divider, YouTube/Vimeo link alone on a line. Toggles/callouts/columns get flattened.

## Design system — the rules
**Nothing hardcoded. Ever.** Every colour, size, space, radius, duration and easing comes from `src/styles/tokens.css`. `npm run check:tokens` enforces it (only `@media` breakpoints are exempt, because CSS can't use variables there).

### Grid (from Figma)
12 columns × 64px, **32px gutter**, centred → content width **1120px** (`--width-content`). (Figma was 60/20 → 940; Kedar widened the gutter 2026-10-15, then widened the container to 1120 on 2026-11-01 — 80px of blue each side at 1280 instead of 170.) Gutter eases 20 → 32 between 768 and 1280. Card gap = gutter (`--rhythm-card-gap`). Big display headings (hero, statements) stay inside the content width too (`--width-hero`); at 58px the homepage headline fits in 2 lines. Card inner padding 40px desktop (`--rhythm-card-pad`). Page side gutter `--rhythm-gutter` (16 → 32).

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

### Typography — the ONLY text styles (consolidated 2026-10-16; scale reset 2026-10-30). No other family, size or weight.
**Scale (Kedar, 2026-10-30, whole site):** title 42/52 · excerpt 22/28 · H2 30/36 · H3 22/28 · body 20/32 · caption 14/20. Only the hero display (58) and nav (16) sit outside it.
Three families: **Montserrat** (headlines, nav), **Lato** (everything you read), **Libre Baskerville** (case-study pull quotes ONLY — nowhere else, not on cards).
Each style is defined once in `global.css`; case-study Markdown (`.prose h2/h3/p/li/td/th`, captions, quote names) is mapped onto the same styles.

| Class | Spec (desktop) | Phone | Used for |
|---|---|---|---|
| `.t-display` | Montserrat 58 ExtraBold | 40 | page heroes, big statements, phone menu |
| `.t-title` | Montserrat 42/52 Bold, tight tracking | 32 | case-study title (H1) |
| `.t-section` | Montserrat 30/36 Bold | 24 | review-card quotes (case-study `##` uses the same face at 26/32) |
| `.t-subheading` | Montserrat 22/28 Bold | 20 | case-study `###`, work vertical-card headline |
| `.t-nav` | Montserrat 16 Bold | 16 | navigation only |
| `.t-heading` | Lato 30/36 Black | 24 | headings inside cards (WOW, Services, About) |
| `.t-lead` | Lato 22/28 Regular | 20 | subtitle / excerpt; homepage hero intro (`bigLead` on `Hero`) |
| `.t-body` | Lato 20/32 Regular | 18 | ALL running text, buttons, links, card quotes, roles, supporting lines |
| `.t-body-strong` | Lato 20 Black | 18 | people's names (cards, pull-quote name), **bold** |
| `.t-tiny` | Lato 14/20 Regular | 14 | footer, image captions |
| `.t-quote` | Libre Baskerville 32 Regular / 45, centred | 24 | case-study pull quotes only |
Lato 400 *italic* is loaded for `*emphasis*`. Never set `font-*` outside `global.css` (`npm run check:tokens` enforces). Sizes are fluid `clamp()` from phone → spec at 1280.

### Spacing
Use `--rhythm-*` role tokens (page-top, title-to-lead, lead-to-actions, action-pair, hero-to-content, section, card-gap, card-pad, label, stack, paragraph, list, row, nav, footer). Need a new gap? **Add a rhythm role**, don't pick a number.

### Breakpoints (mobile-first, `min-width` only)
- `48rem` (768) — desktop nav, 2-column card grid + 2:1 horizontal cards, side-by-side portrait cards.
(Add more here if introduced; keep the list short.)

### Header
Nav (from MacBook Air - 16, 2026-10-30): Work (/work) · What We Do (/services) · Our Way (/wow) · About · Reviews (/reviews), and "Let's Talk" (/contact) on the right. Full-bleed: logo and Let's Talk at the viewport edges (only the gutter between). **Sticky** with the page colour. A soft line (`--color-line-on-page`, same as footer) fades in under it (`--motion-header-line`, 250 ms) only when the first content on the page slides beneath it; fades out when it doesn't. Nav links centred, 48 apart. Phone: logo + "Menu" → full-screen sheet with big links.
**On blog posts** (Kedar, 2026-11-01; `postTitle` prop via `BaseLayout`): the bar never moves (Apple-style; hide-on-scroll was tried 2026-11-01 and dropped — it fought the title swap and trackpad bounce). (a) Once the big title is under it, the centre nav cross-fades to the post title (`.t-nav`, ≤512 wide, ends in …; click = top; ≥48rem only); (b) a 2px white reading-progress line along its bottom (0 at the article top, full when the article's end reaches the bottom of the screen).

## Components (`src/components/`)
- `Header`, `Footer`, `Logo` (wordmark SVG, `currentColor`)
- `Hero` (display title + lead + slot), `Actions` (primary + ghost pill, stacked, always equal width: full content width on phones, width of the wider label ≥48rem), `Button` (`primary` | `ghost`; height `--size-button-h`, side padding `--rhythm-button-x`), `Statement` (big centred heading block)
- `Card` (white surface; a link with raised hover shadow only when given `href`; tilts with `tilt`), `PostCard` (/work card: Kedar's graphic only, 1200:630), `ClientLogos` (scrolling logo strip — unused since 2026-11-01, kept in case), `PortraitCard` (Our Way: cut-out photo + name `.t-body-strong` / role `.t-tiny` over it, text beside; phones: name + role under the photo, aligned with the text), `ProblemList` (What we do: problem → probable-solution table card, pale-blue header band, plain-text solutions; tilts), `ServiceGrid` (What we do: 2-column grid of service cards, bare blue icon + heading, Apple-style; tilts).
- `TeamCard` (About): 460 × 428 min (grows with a long bio), photo from the top, LinkedIn mark (24) + name `.t-body-strong` + role `.t-tiny` in white on the review-card black fade; mark turns LinkedIn blue while the card is hovered. Click anywhere (or the black + button) → ≥48rem: 3D flip to a white bio side (name `.t-heading`, role, bio `.t-body`; card grows to fit), × flips back. Phones: the card turns edge-on, then a centred modal (`<dialog>`, all one height `--height-modal`) carries on the turn while growing out of the card's spot; closing runs it backwards back onto the card (×, Esc, tap outside). Card width = grid column (`container-type: inline-size`); the 460 × 428 ratio is a min-height — never `aspect-ratio`, which let a long bio widen the card. `photoAlign` keeps an off-centre person in view when a tall card crops the photo's sides. Portraits: ~3% of the width above the head. Andrew's photo is shared with his review card (`src/assets/reviews/`).
- `ReviewCard` (one review; used by `ClientReviews` on the homepage and the /reviews grid). `ClientReviews` (homepage): 380 × 488 white cards (design 506; 18px shorter, Kedar 2026-10-30) — quote `.t-section` (**max 3 lines**; the quote box is always 3 lines tall so every photo/head starts at the same height), then the portrait (fills the rest from the top), with name `.t-body-strong` + role `.t-body` **in white on the photo, bottom-left, over a short soft black fade** (`--gradient-review-shade`, eased many-stop, fixed 144px tall `--size-review-shade` — a % went tall and muddy on the bigger /reviews cards (Kedar 2026-10-30) — ~66–72% ink behind the text). **LOCKED by Kedar 2026-10-30** ("elegant soft black, short height, white text") after trying and rejecting: white fade, white strip under the photo, per-photo ink/white text with halos, progressive blur + frost. Don't revisit unasked. Portraits are cropped so there's exactly 12px above each head — do the same for new ones. First card starts on the content edge; strip bleeds off both sides; space above = `--rhythm-hero-to-reviews`. Data = `reviews` in `src/data/site.ts`; portraits `src/assets/reviews/<file>.png` (person on white, no text, 380 × 321 now — 2× exports wanted).
- Site data (nav, email, footer, Amazon link, client list, shared button labels `labels.explore` / `labels.connect`): `src/data/site.ts` — never inline URLs/labels in pages.

## Content: posts (blog posts / case studies)
- Since 2026-10-30 the cards live on `/work` (header "Work", homepage "Explore our work", case-study back button all go there). Each card opens `/work/<slug>`. Nothing after the cards (Kedar 2026-11-01). Links that stand alone are buttons, never underlined text.
- One folder per post: `src/content/work/<slug>/index.md` (+ its image beside it). Schema: `src/content.config.ts`.
- **Cards (Kedar, 2026-11-01; replaces the 2026-10-16 vertical/horizontal templates):** a stack of full-width cards (content width, same width as the Our Way Hitchcock card), one per post. **Each card is only Kedar's graphic** at the link-preview ratio 1200:630 (`--ratio-cover`) — the same image (`ogImage`) is the post's cover and the WhatsApp/LinkedIn/X preview. Export **2400 × 1260** (2× for sharp screens; previews are resized to 1200 × 630). No text inside the card, no arrow cue. **The post title sits under each card** (Kedar 2026-11-01): styled exactly like an image caption inside a post: `.t-tiny`, centred, 12 below (`--rhythm-caption`), in `--color-on-page-muted` (the page's grey); 80 to the next card (`--rhythm-figure`); card + title are one link. Text inside the graphic must be large: a phone card is ~345 wide. No graphic → plain white card of the same shape.
- Kedar deleted all old posts on 2026-11-01 to start fresh; `src/content/work/` is empty until the first post is pulled from Notion (the build is fine with none).
- Fields: `order`, `ogImage` + `ogImageAlt` (card graphic), `brand` (screen-reader fallback + page title), `title`, `description`, dates, `draft`. Old teaser copy is in `docs/old-card-teasers.md`.
- Card UI: `PostCard.astro` (image only + the approved hover lift).

## Case studies (blog posts)
- **Design: MacBook Air - 11** (`/Users/kedar/Desktop/MacBook Air - 11.pdf`, notes are written inside the design).
- Write in plain Markdown in `src/content/work/<slug>/index.md`; images sit beside it with **descriptive file names** (e.g. `creating-a-jupiter-pot-in-under-30-seconds.png`) and real alt text.
- Frontmatter for SEO: `title` (≤60 chars), `description` (140–160 chars; shown as the summary under the title + in Google), `publishedDate`, `ogImage` + `ogImageAlt` (= the /work card graphic; link preview resized to 1200×630).
- Blocks (see `/styleguide`): `##` sections, `###` sub-sections, paragraphs/lists, `>` pull quote → `.t-quote` with hairlines (last line `> — Name` = attribution), image + `"caption"` → full-width figure, table → scrollable on phones, YouTube/Vimeo link alone on a line → embedded player, `---` divider.
- Layout: on the blue page — black round back button in grid column 1, title from column 2 (no summary/byline shown; `description` is for Google + link previews only) → white sheet (padding `--rhythm-sheet-pad`) → one primary button "Impressed? Let’s talk" (→ /contact; Kedar 2026-11-01, was See all work + Connect anytime). The /work card graphic is shown as the cover under the title (Kedar, 2026-11-01).
- **Post top** (Kedar, 2026-11-01, revised same day): title → **cover = the /work card graphic** (`ogImage`, content width, 1200:630) → white sheet starting with the project details (`PostIntro.astro`, no logo — the cover shows the brand): grey `.t-tiny` label (`--color-on-surface-muted`) over a `.t-lead` value, hairline above each, **four across** (two on phones); values over 32 characters and lists (Scope, Impact) take the whole row; `href` makes a value a link. Hairline under it, then the body. `facts` come from the Notion columns — **quote any value containing a comma or a colon** (YAML).
- **Next post** (Kedar, 2026-11-01): under the CTA, "Next post" + the next post's /work card (next by Notion `Order`, wrapping to the first).
- **Floating button** (Kedar, 2026-11-01): one black 44px circle bottom-right (↑ to top; the floating ← was removed the same day), shown only once the top back button has scrolled out of view (appear instantly; ↑ jumps, no smooth scroll). `--z-float`, `--rhythm-float`.
- **Captions** (Kedar, 2026-11-01): Notion image caption → Markdown title (`![alt](./x.png "Caption")`) → `.t-tiny` figcaption, centred under the image, grey `--color-on-surface-muted`, at most the reading-column width. 80 (`--rhythm-figure`) above every image and below its caption (a heading right above keeps its tight 12). Plain text only (links in a Notion caption are dropped).
- Images: rounded, with a black enlarge button bottom-right (`--size-expand` 36) that shows only while the image is hovered or keyboard-focused (Kedar 2026-11-01); clicking the image opens it in a lightbox (`<dialog>`, no animation; Esc / × / click closes). Built by `rehype-prose.mjs` + script in `PostLayout.astro`.
- **Reading rhythm** (2026-10-16, "Medium/Substack feel"; revised 2026-11-01): text column 680 (`--width-post`, Medium's width); images + videos break out to the full sheet width; first paragraph is a 22/34 lede; running text `--color-on-prose` (ink-800, a touch softer); h2 Montserrat 22→26/32 (`--size-prose-h2`); body Lato 20/32 (`--leading-prose` 1.6); every block 24 apart (`--rhythm-prose`); images/video/tables/quotes/dividers 40 (`--rhythm-prose-block`); h2 gets 48→64 above, h3 40 above, both only 12 below (proximity: a heading belongs to its text); list items 4 apart; quote Baskerville 32/45. Sheet sides `--rhythm-sheet-x` (16 phone → 40). Implemented with margin-top "owl" rules in `global.css` (`.prose > * + *`), no grid gaps.
- A post with an empty body shows only the title + buttons (no cover, no white sheet), and is noindex.
- Pull quote = hairlines above + below. `---` = hairline. Tables = compact light-blue panel (cells 12 × 16), white row lines, values right-aligned (regular weight).
- The card graphic (`ogImage`) is the /work card, the post cover and the link preview — don't repeat it as the first image in the body.
- Markdown → blocks is done by `src/lib/rehype-prose.mjs` (needs `@astrojs/markdown-remark`, pinned 7.3.2 — Astro 7's default Markdown engine doesn't run plugins).
- A post with an empty body stays live (homepage card links to it) but is `noindex` and left out of sitemap / RSS / llms.txt until written.

## SEO & AI crawling
- **Meta descriptions** (2026-10-16) = Kedar's own page copy, ~120–150 chars: home = hero intro; WOW/Services/About = headline + lead; Contact = "Hello! Email me at … I hope you value design." Case studies: `description` field, else the card's words (testimonial "quote — name, role", or supporting line + headline), else the site description. Open Graph / X use the same title + description; image = post cover (1200×630) or `public/og-default.png`.
- `astro.config.mjs` `site: https://patternsstudio.co` (TODO confirm domain). Every page: unique title + description, canonical (trailing slash), Open Graph + X cards (default image `public/og-default.png`), RSS link.
- JSON-LD on every page (`src/lib/seo.ts`): Organization/ProfessionalService (UEN, Singapore, email), WebSite, Person (Kedar). Case studies add BlogPosting + BreadcrumbList.
- `/sitemap-index.xml` (@astrojs/sitemap), `/rss.xml`, `/robots.txt` (all search + AI crawlers explicitly allowed), `/llms.txt` (plain summary for AI assistants) — all generated from site data, never hand-edited.
- TODO Kedar: add public profiles to `site.sameAs` (LinkedIn, Substack, Gyaan Project) — strongest single boost for being recognised as an entity.

## Motion — NO animation unless Kedar asks for it
Kedar (2026-10-15): "Don't add any animation unless I say. I hate random movements just for the sake of it."
- No reveals, fades, hover lifts/zooms, smooth scroll, page transitions or CSS `transition`s. Hover = instant state change only.
- Approved list (the ONLY motion on the site):
  2. Header line fades in (250 ms) only while content is beneath the header.
  3. **Every card except /work** tilts in 3D toward the mouse (Kedar, 2026-10-30; was WOW only): Our Way portrait cards, About team/advisor cards, homepage + /reviews review cards, Services card. Max 3° each axis (`--motion-tilt-max`), perspective `--motion-tilt-depth`, eased 150 ms. One script `src/scripts/tilt.ts` + `[data-tilt]` rule in `global.css`; `Card` opts in with `tilt`. /work post cards keep their own lift (item 4). Mouse only — off on touch and for reduced motion.
  4. /work post cards hover ("elegant, like Apple"): rise 6px + scale 1.01, shadow deepens (`--shadow-rest` → `--shadow-lifted`); 500 ms `--ease-lift`. Mouse only; off for reduced motion.
  5. *(Not on any page since 2026-11-01.)* /work client logos scroll continuously **inside the content container**, edges faded (`ClientLogos.astro`, tokens `--motion-logo-per-item` (speed), `--rhythm-logo-strip` (space below; above = hero's bottom space)). Static wrapped row under `prefers-reduced-motion`.
  6. **Homepage review cards** (Kedar, 2026-10-30, "gentle… manual scrolling also, like Apple"): a real horizontal scroller (swipe / trackpad / ← → round buttons, smooth glide) that also drifts right → left at `--motion-review-speed` (24 px/s), easing in/out (`--motion-review-ease`). Drift stops while hovered or keyboard-focused, and for `--motion-review-resume` (3 s) after any manual scroll. Loops forever: list rendered 5×, lives in the middle copy and jumps back by one set once a scroll settles (invisible). Two copies weren't enough — a fast swipe on a wide screen hit the end, stopped, then jumped. Reduced motion: no drift, buttons jump.
  7. **Homepage lead word swap** (Kedar, 2026-10-30): "scale-up" ⇄ "start-up" in a white highlight (blue text), the word slides up and out while the next slides in, every `--motion-swap-hold` (2.8 s), slide `--motion-swap` 600 ms. Highlight never moves/resizes. `WordSwap.astro`, via Hero's `lead` slot. Reduced motion: "scale-up" only. Screen readers hear "scale-up / start-up" once.
  8. **About team cards flip in 3D** (Kedar, 2026-10-30): click → rotateY 180° to the bio, `--motion-flip` 700 ms, `--ease-flip`, perspective `--motion-flip-depth`. Phones: card → edge → modal and back (`--motion-modal-flip` 350 ms per half, `--ease-flip-in/out`), backdrop fades. Reduced motion: instant.
  9. **Post header nav ⇄ title cross-fade** (Kedar, 2026-11-01, "best Apple style"): 250 ms (`--motion-header-line`) when the big title passes under the header. Reduced motion: instant. The progress line just follows the scroll. The header itself never moves.
- Adding anything to this list needs his explicit OK first.

## Copy rules
- **Locked (Kedar, 2026-10-30):** homepage headline = "Growth has a pattern. Let's find yours." Don't change without his say. (The old one, "An independent design studio with taste and AI chops.", is no longer used; /work is headed "Work that speaks for itself".)
- Use Kedar's words **verbatim** from the designs. Never invent copy. Typos stay unless he fixes them.
- No all-caps / `text-transform: uppercase`.
- Placeholders must be plainly labelled (`TODO(Kedar)`, "Image: …").

## Open items / waiting on Kedar
- **Homepage reviews (2026-10-30):** quotes are Kedar's sample wording, shortened to fit 3 lines (Yashwanth's written to match; Hrush, Ashish, Jitendra removed by Kedar) — each person must approve their words before launch. 2× portraits for sharpness. Designs for /work and /reviews.
- **Status at end of 2026-10-16:** design system, all 6 page types and GitHub preview done. Waiting on content: case-study texts, vertical card art + text for PropertyGuru, Jupiter debit card, Lumosity, BookMyShow, BookMyShow R&R, Project Pratima; covers (1200×630); `site.sameAs` profiles; Amazon book link; domain launch.
- Clean-up 2026-10-16: removed unused `Media`, `WaveMark`, `quote-mark.svg` and their tokens. If the wave mark is wanted again, it's in the logo SVG.
- Images: all card photos/covers, client logo FILES (19 names listed in `src/data/site.ts`; drop files in `src/assets/clients/` named as `file`), testimonial brand logos, About app icons, WOW portraits.
- Amazon book link (`src/data/site.ts`). Email is set: kedar@patternsstudio.co (`routes.email` = mailto link).
- Homepage: Jupiter goals card and Lumosity card reuse the Cleartrip text in the design — real summaries needed.
- Which projects get detail pages, and their content.
