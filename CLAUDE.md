# Patterns Studio website — project notes

The single reference for how this site is built. **Read before changing anything; update it whenever a decision changes.**
Agent-specific Astro tips are in [AGENTS.md](AGENTS.md).

## Owner & intent
- Kedar Nimkar's one-person design studio, Singapore. Portfolio + services site.
- Wants it: mobile-first, cheap, steady, low-maintenance.
- Source designs: Figma frames, 1280 wide. Current set (2026-11-04): "MacBook Air - 22, 23, 24, 26, 27, 29, 30, 31, 32" (PDFs on Kedar's Desktop). Kedar supplies assets one by one; we build **page by page** and he reviews each.

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
- **After editing `src/lib/rehype-prose.mjs` or anything else that changes how Markdown renders:** run `npx astro dev stop`, delete `.astro/data-store.json`, then `npm run dev`. Dev serves posts from that cache and doesn't notice plugin changes, and `--force` doesn't help because Astro runs dev as a detached server and drops the flag (seen 2026-11-05). Builds use a separate cache in `node_modules/.astro`.
- `npm run check:tokens` → fails on any hardcoded value outside tokens.css.
- `npm run build` → token check + `astro check` + build.

## Pages
| Route | Design | Source | Status |
|---|---|---|---|
| `/` Homepage | MacBook Air - 22 (2026-11-04) | `src/pages/index.astro` — hero (H1 "Growth has a pattern. Let's find yours.", lead, "Explore our work" → /work) + `ClientReviews` (9 review cards drifting right → left; no button or arrows under the strip) | ✅ built |
| `/reviews` | MacBook Air - 33 (2026-11-04) | `src/pages/reviews.astro` — "How do you become successful?", lead "Make people happy." (no button), every `ReviewCard` (3 across from 64rem; 2 from 48rem; 1 on phones; all on top, Kedar 2026-11-11: the frame's second block of cards under the logos is gone), then "We’ve worked with wide range of industries" + `ClientLogoGrid` (20 logos in an invisible grid, 4 across, 2 on phones, no lines, logos at 70%) at the end, "Explore our work" | ✅ built |
| `/work` All work | MacBook Air - 37 (2026-11-06; replaces 31) | `src/pages/work/index.astro` — "Doing good work", then one row per post (`PostCard row`): post title `.t-h2` + small ghost button "View details" in 5 columns on the left, Kedar's 1200:630 graphic in 7 columns on the right (frame: 4/8; Kedar 2026-11-06 tried a fifth text size, dropped it, went 5/7); rows 48 apart. Phones: graphic, then title + link under it | ✅ built |
| `/work/[slug]` Case study | MacBook Air - 38 (2026-11-06; replaces 32) | `src/pages/work/[slug].astro` → `PostLayout.astro`: title + `PostStory` carousel on blue, then a white sheet (rounded top) with the post's Markdown (visuals) | ✅ built |
| `/styleguide` | — | `src/pages/styleguide.md` — every case-study block + how to write it; noindex, not in sitemap | ✅ |
| `/approach` | MacBook Air - 35 (2026-11-06) | `src/pages/approach.astro` (was /wow "Our Way" until 2026-11-04) — hero "We know when to re-invent the wheel" + lead (no button), `IconGrid` (9 cells, no heading), "There are 2 ways of working with us" + one card: Playing Jazz \| Conducting a Symphony (blue Phosphor icon, bold name + promise, `.t-p` text; icons `src/icons/ways/`, Claude's pick for the frame's grey circles), then a row "We’ve made a questionnaire to get things started." + underlined "Questions we ask clients" (Kedar's Google Doc, `brief` in `site.ts`; must stay "anyone with the link can view"), then "We also have a rate card for clients who know it all" (link → /rate-card) | ✅ built; Kedar's copy verbatim, incl. "WCGA complaint", "you’ve have", "Idea for startups" — he may want to fix them |
| `/rate-card` | MacBook Air - 36 (2026-11-06) | `src/pages/rate-card.astro` — blue page (Kedar 2026-11-06), × → /approach; letter on cream paper (`--color-letter`, two sheets peeking out behind) "Hello!" … "With love, Team Patterns Studio!" beside a white till receipt (zigzag torn edges via CSS mask, "Receipt" `.t-h2`, dashed rules, 6 rates $100 → $20,000 with dotted leaders, thin barcode, "Thank you!"; after Kedar's receipt reference); phones: receipt under the letter. The joke prices are Kedar's design, the one exception to "no budgets on the site" | ✅ built; copy verbatim |
| `/services` | MacBook Air - 30 | `src/pages/services.astro` — "Different problems. Familiar patterns.", lead, "Explore our work", `ProblemList` (pale-blue header band, P-Bold headers, P cells; phones: one-line band "Problem → Our solution", bold solution under each problem behind an ink →, Kedar 2026-11-06), "In other words, we do" + `IconGrid` (6 cells; the frame repeats one label as a placeholder, the six services + icons stay), "Explore our work" | ✅ built |
| `/about` | MacBook Air - 23 (reworked 2026-11-06) | `src/pages/about.astro` — "An independent design studio from SEA" (Kedar 2026-11-12; was "based in Asia", before that "… in 🇸🇬"), lead, "Explore our services", 2 `TeamCard`s (Kedar: Co-founder & Principal Designer (was Designer until 2026-11-10), John: Co-founder & Head of Growth (was Storyteller)), "Advisors" + 2 `TeamCard`s (Andrew: Product, Raena: Growth (was Finance until 2026-11-09); Manav removed 2026-11-06), "Explore our work". One card per row, bio always visible | ✅ built; John's bio drafted by Claude 2026-11-10 (Kedar to confirm), his logos wanted; company logos wanted (Kedar 2026-11-06), waiting on files |
| `/contact` | MacBook Air - 26 | `src/pages/contact.astro` — "Hello!", "Best way to get in touch is, email us at" + hello@patternsstudio.co (`routes.email`), "We hope you value good design" | ✅ built |

## Writing posts in Notion (Kedar, 2026-11-01)
- Kedar writes posts (and dumps old work) in the Notion database **Patterns Work Blog Posts** (Patterns teamspace → Patterns OS, next to Projects): https://app.notion.com/p/7737b16bf5674fa584e6c5e93aae0955 — data source `collection://6072dff8-8bd0-4d60-9d0b-bcb910c34222`.
- Columns not shown on the site, kept for publishing + SEO + accessibility: Title, Status (Idea → Draft → Ready → Live; workflow only), Summary (= `description`), Card graphic (= `ogImage`, 2400×1260), Card alt, Slug, Order, Published.
- **Project details panel, one column each (Kedar, 2026-11-05):** Client name (`client`), Client logo (`logo`, file downloaded beside the post), Industry (`industry`, multi-select → YAML list, shown comma-separated; Kedar 2026-11-07), Duration (`duration`, e.g. "1 month"; Kedar 2026-11-06), Review (`review`: a reviewer's name, a select of the `reviews` in site.ts; add new reviewers to both), Live link (`live`: shows as "Status (Live)" + an underlined "View work" link to it, same words on every post; Kedar 2026-11-09), Scope, Client testimonial, Impact (one point per line → a YAML list; 1 line = sentence). **Story cards (Kedar, 2026-11-06):** About the client (`about`), Situation (`situation`, card "The gap"), Task (`task`, "The brief"), Action (`action`, "The approach"), Result (`result`, "The outcome") — STAR, max 40 words each. The Title is the question shown big on the post and /work (e.g. "How does a brand become a visual language?"). **Blank = not shown.** Brand, Project, Role & Responsibilities and Time frame were removed from Notion 2026-11-05. Location and Budget are deliberately not shown (Kedar 2026-11-01: budgets are the client's business and anchor future prices).
- "Publish the ready posts" = Claude fetches every **Ready** page, writes `src/content/work/<slug>/index.md`, downloads images into the post folder (Notion file URLs expire), shows Kedar the SEO fields, then sets Status → Live. Manual, no sync script.
- Only pages in this database are ever published — never pull from project pages (they hold client-confidential notes).
- Supported blocks: H2/H3, paragraphs, lists, bold/italic/links, quote (last line `— Name`), image + caption, table, divider, YouTube/Vimeo link alone on a line. Toggles/callouts/columns get flattened.

## Design system — the rules
**Phones first (Kedar, 2026-11-05): assume 98% of visitors are on a phone.** In `tokens.css` the base values are the phone design; a `@media (min-width: 48rem)` block at the end of the file holds the desktop values (the Figma frames, unchanged). On phones: headings, leads, footer on the left edge (`--align-page`), card radius 20 (desktop 24), tighter glow, slim header, icon grids as rows (icon beside text), Services answers in bold, contact address as a big button, every tap target 44+. No frames for this: Claude's polish, Kedar reviews.

**Nothing hardcoded. Ever.** Every colour, size, space, radius, duration and easing comes from `src/styles/tokens.css`. `npm run check:tokens` enforces it (only `@media` breakpoints are exempt, because CSS can't use variables there).

### Grid (from Figma)
12 columns × 64px, **32px gutter**, centred → content width **1120px** (`--width-content`). (Figma was 60/20 → 940; Kedar widened the gutter 2026-10-15, then widened the container to 1120 on 2026-11-01 — 80px of blue each side at 1280 instead of 170. The 2026-11-04 frames are still drawn at ~940; the 1120 stays. Kedar: "Work details page will be full width as per viewport. Rest all as of today." **Exception, posts (2026-11-05):** title sits on the frame's 940 (`--width-post-details`), details panel at the content width, text 552 wide (`--width-post`; the frame's 460 + 20%, Kedar 2026-11-05); images stay edge to edge.) Gutter eases 20 → 32 between 768 and 1280. Card gap = gutter (`--rhythm-card-gap`). Big display headings (hero, statements) stay inside the content width too (`--width-hero`); the homepage headline fits in 2 lines. Card inner padding 40px desktop (`--rhythm-card-pad`). Page side gutter `--rhythm-gutter` (16 → 32).

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
| `--color-surface-panel` | #F5F5F7 | post details panel (Kedar, 2026-11-05: more premium than pale blue) |
| `--color-letter` | #FDF6E3 cream | /rate-card letter paper |
| `--color-line-on-surface` | #D9D9D9 | hairlines on white (pull quote, `---`) |
| `--color-placeholder` | #D9D9D9 | image placeholders |
All text pairs must pass WCAG AA.

**Card glow:** every card has a soft light-violet glow (`--shadow-glow`, from `--violet-300` #B9A4FF at 35%, 64px blur). Hover shadows are layered on top of it. Exception: the post story cards on blue use a layered drop shadow instead (`--shadow-story`, Kedar 2026-11-06).

### Typography — the ONLY text styles (Kedar, 2026-11-05: "less variations the better"; replaces the 2026-11-04 Figma styles). No other family, size or weight.
**Five sizes** (the fifth, `.t-h3`, added 2026-11-11 for the post story cards). Two families: **Montserrat ExtraBold** for headlines only (they must be loud and clear), **Lato** Regular + Bold for everything else. Hierarchy comes from weight, not extra sizes. Each style is defined once in `global.css`; case-study Markdown is mapped onto the same styles. The Figma text styles still show the old set; the code is ahead of them.

| Class | Spec (desktop) | Phone (at 390) | Used for |
|---|---|---|---|
| `.t-h1` | Montserrat ExtraBold 64/70 | 46/1.06, -2% tracking | page + post titles, phone menu |
| `.t-h2` | Montserrat ExtraBold 48/60 | 37/1.12, -1% tracking | section headings ("Advisors"…), post `##` |
| `.t-h3` | Montserrat ExtraBold 32/1.2 | 26 | post story card headings only (Kedar 2026-11-11: card titles must anchor the card) |
| `.t-p` | Lato Regular 20/28 | same | everything you read: leads, running text, buttons, captions, tables, pull quotes |
| `.t-p-bold` | Lato Bold 20/28 | same | names, card + table headings, post `###` |
| `.t-small` | Lato Regular 15/21 | same | navigation, footer, roles, labels |
| `.t-answer` | `.t-p` | `.t-p-bold` | Services solutions (weight only) |
**Rules:** one line height for all Lato (`--leading-p`, 1.4), no exceptions for posts or bios. Letter spacing 0 on desktop; H1/H2 tighten slightly on phones. Lato 400 *italic* is loaded for `*emphasis*`. Never set `font-*` outside `global.css` (`npm run check:tokens` enforces). H1 and H2 are fluid `clamp()` from phone → spec at 1280. Need a new text style? Don't: use weight or space.

### Spacing
Use `--rhythm-*` role tokens (page-top, title-to-lead, lead-to-actions, action-pair, hero-to-content, section, card-gap, card-pad, label, stack, paragraph, list, row, nav, footer). Need a new gap? **Add a rhythm role**, don't pick a number.
**Affinity (Kedar, 2026-11-05):** a heading sits closer to what it introduces than to what came before it. Section headings: `--rhythm-heading-above` (64 → 96), `--rhythm-heading-below` (32). Never equal gaps on both sides. Applies to every new section.

### Breakpoints (mobile-first, `min-width` only)
- `48rem` (768) — desktop nav, 2-column card grids, 3-cell icon grids + post details, side-by-side portrait cards.
- `64rem` (1024) — 3-column card grids (/reviews).
(Add more here if introduced; keep the list short.)

### Header
Nav (2026-11-04): Work (/work) · Services (/services) · Approach (/approach) · About · Reviews (/reviews), and "Let's Talk" (/contact) on the right. Full-bleed: logo and Let's Talk at the viewport edges (only the gutter between). **Sticky** with the page colour. A soft line (`--color-line-on-page`, same as footer) fades in under it (`--motion-header-line`, 250 ms) only when the first content on the page slides beneath it; fades out when it doesn't. Nav links centred, 48 apart. Phone: logo + "Menu" → full-screen sheet with big links.
**On blog posts** (Kedar, 2026-11-01; `postTitle` prop via `BaseLayout`): the bar never moves (Apple-style; hide-on-scroll was tried 2026-11-01 and dropped — it fought the title swap and trackpad bounce). (a) Once the big title is under it, the centre nav cross-fades to the post title (`.t-small`, ≤512 wide, ends in …; click = top; ≥48rem only); (b) a 2px white reading-progress line along its bottom (0 at the article top, full when the article's end reaches the bottom of the screen).

## Components (`src/components/`)
- `Header`, `Footer`, `Logo` (wordmark SVG, `currentColor`)
- `Hero` (H1 + `.t-p` lead, at most 680 wide (`--width-lead`) + slot; designed line breaks apply ≥48rem only), `Actions` (primary + ghost pill, stacked, always equal width: full content width on phones, width of the wider label ≥48rem), `Button` (`primary` | `ghost` (faint outline `--color-line-on-page`, Kedar 2026-11-06); height `--size-button-h`, side padding `--rhythm-button-x`; `small` = `.t-small` in a 44 pill, `--size-button-small-h` / `--rhythm-button-small-x`), `Statement` (big centred heading block)
- `Card` (white surface; a link with raised hover shadow only when given `href`; tilts with `tilt`), `PostCard` (/work card: Kedar's graphic only, 1200:630), `ClientLogoGrid` (/reviews), `ClientLogos` (scrolling strip, unused since 2026-11-01, kept in case), `PortraitCard` (unused since 2026-11-06, kept with the Hitchcock + Wong Kar-wai photos; was Approach: cut-out photo, nothing over it; beside it heading `.t-p-bold`, text `.t-p`, then a grey `.t-small` credit "Name, Role" (Kedar, 2026-11-05); phones: under the photo), `ProblemList` (Services table; tilts; a row turns soft grey under the mouse, `--color-surface-hover`, instant), `IconGrid` (Services + Approach: one white card, hairlines between cells, 3 across, 44px blue Phosphor Regular icon above `.t-p` (every Phosphor icon on the site is 0.5px heavier: `.glyph` + `--icon-weight-add`, Kedar 2026-11-06); a cell turns soft grey under the mouse, instant; icons in `src/icons/<set>/`; the frames' grey circles mark where icons go, Claude picked the Approach icons; tilts).
- `TeamCard` (About; Kedar 2026-11-06: no clicking, everyone reads the bios directly; replaces the flip + bio modal): one white card per person at the content width. Name `.t-p-bold` + role `.t-small` (grey) and the black LinkedIn mark (LinkedIn blue on hover; new tab; URLs = `linkedin` in `src/data/site.ts`), then the bio `.t-p` (opens with the name in bold), portrait standing on the bottom edge. Phones: text, portrait under it. From 48rem: portrait on the left, 300 wide (`--width-team-card`), text beside it. Portraits `src/assets/about/*.webp`; 12 of white trimmed above the head. Optional `companies`: a row of full-colour logos under the bio (`src/assets/companies/*.svg`, one scale for all: `--size-company-unit`); Kedar: Cleartrip, BookMyShow, Jupiter, PropertyGuru; Andrew: Google, Indeed, PropertyGuru; Raena: AUD’NCO, Style Theory, Goldman Sachs (2× PNGs, sized with `h`) (Kedar 2026-11-09). Tilts. Review cards are 58 shorter than the frame (Kedar, 2026-11-05: they looked too long): 27 off the white above the head, 31 off the bottom of the person (`--ratio-review-photo`, `--position-review-photo`).
- `ReviewCard` (used by `ClientReviews` on the homepage and the /reviews grid; MacBook Air - 22, 2026-11-04, replaces the white-on-photo fade): on white, quote `.t-p` (3 lines tall on phones, 4 from 48rem, so names line up: `--lines-review-quote`), name `.t-p-bold`, role `.t-small` (grey), portrait on the bottom edge. Homepage card 341 wide; first card starts on the content edge; strip bleeds off both sides. Data = `reviews` in `src/data/site.ts`; portraits `src/assets/reviews/<file>.webp`. All portraits were cropped from the frames' embedded images at Figma's exact placement; do the same for new ones (Rahool's source is low-res: a better file is wanted).
- Site data (nav, email, footer, Amazon link, client list, shared button labels): `src/data/site.ts` — never inline URLs/labels in pages.

## Content: posts (blog posts / case studies)
- Since 2026-10-30 the cards live on `/work` (header "Work", homepage "Explore our work", case-study back button all go there). Each card opens `/work/<slug>`. Nothing after the cards (Kedar 2026-11-01). Links that stand alone are buttons, never underlined text.
- One folder per post: `src/content/work/<slug>/index.md` (+ its image beside it). Schema: `src/content.config.ts`.
- **Cards (Kedar, 2026-11-01; replaces the 2026-10-16 vertical/horizontal templates):** a stack of full-width cards (content width), one per post. **Each card is only Kedar's graphic** at the link-preview ratio 1200:630 (`--ratio-cover`) — the same image (`ogImage`) is the WhatsApp/LinkedIn/X preview. Export **2400 × 1260** (2× for sharp screens; previews are resized to 1200 × 630). No text inside the card, no arrow cue, no title under it (MacBook Air - 31, 2026-11-04); 48 between cards (`--rhythm-work-card`). Text inside the graphic must be large: a phone card is ~345 wide. No graphic → plain white card of the same shape.
- Fields: `order`, `ogImage` + `ogImageAlt` (card graphic), `client`, `title`, `description`, dates, `draft`. Old teaser copy is in `docs/old-card-teasers.md`.
- Card UI: `PostCard.astro` (graphic, corners 12 on phones / 16 from 48rem (`--radius-post-card`, Kedar 2026-11-06: less round than other cards) + the approved hover lift; with `row` it adds the title + "View details" beside it, MacBook Air - 37, 2026-11-06, on /work only; Next post uses the same row since 2026-11-09).

## Case studies (blog posts)
- **Design: MacBook Air - 38** (2026-11-06; replaces 32): title + story carousel on the blue page, then a white sheet (rounded top, `--radius-sheet`) at full viewport width holding the visuals. The story lives in the carousel; the Notion body is visuals only (images, videos).
- Write in plain Markdown in `src/content/work/<slug>/index.md`; images sit beside it with **descriptive file names** (e.g. `creating-a-jupiter-pot-in-under-30-seconds.png`) and real alt text.
- Frontmatter for SEO: `title` (≤60 chars), `description` (140–160 chars; shown as the summary under the title + in Google), `publishedDate`, `ogImage` + `ogImageAlt` (= the /work card graphic; link preview resized to 1200×630).
- Blocks (see `/styleguide`): `##` sections, `###` sub-sections, paragraphs/lists, `>` pull quote → `.t-p` with hairlines (last line `> — Name` = attribution), image + `"caption"` → full-width figure, table → scrollable on phones, YouTube/Vimeo link alone on a line → embedded player, `---` divider.
- Layout: on blue: "← Back" (→ /work; small ghost pill, `.back`, Kedar 2026-11-06: replaces the black × top right) above the title, both left on phones and centred from 48rem → title `.t-h1` → story carousel → white sheet: body in Notion's order, images **edge to edge up to 1280** → one primary button "Impressed? Let’s talk" (→ /contact). No summary/byline shown; `description` is for Google + link previews only.
- **Story carousel** (`PostStory.astro`, Kedar 2026-11-06, MacBook Air - 38): up to 8 cards in one row on blue. Static (Kedar 2026-11-06: no drift, no loop): starts with Client details on the content edge (blank left), and after the last card the blue shows on the right. Swipe/trackpad with scroll-snap, or ← → buttons under the row on the right (thin 44 circles, one card per press, smooth scroll, greyed at either end). **Client colour (Kedar, 2026-11-09):** every card is tinted with the client's colour, read at build time from the logo SVG in the post folder (`src/lib/brand-colour.ts`: most-used non-grey fill → `--brand` on `[data-brand]`); tokens mix it with white (`--story-wash`, `--story-wash-client`, `--story-mark`, `--story-icon`, `--story-label`) so it stays whitish; no SVG colour → lilac. Each text card: Phosphor icon in Patterns blue, no background, 40 → 44 (`--size-story-icon`; never the client's colour; replaced the big pale corner icon, Kedar 2026-11-11). Text cards 400 wide from 48rem. Client details = two stacked cards in the space of one (after Apple's tiles): top = logo + Status (Live) on plain white (Kedar 2026-11-11), below = Client, Industry, Duration. (1) Client details: narrower (`--width-story-client`), soft lavender wash (`--gradient-story-client`), logo (28 tall on phones, 32 from 48rem; Kedar 2026-11-09), then grey `.t-small` label over `.t-p` value for Client, Industry, Duration, Status (Live). (2) Scope, (3) Client’s testimonial — or, when Notion "Review" names someone from `reviews` (site.ts), that person's `ReviewCard` (quote, name, role, portrait; no tilt, story width + shadow; Kedar 2026-11-06) — or Impact when neither, (4) About <first word of client>, (5) The gap, (6) The brief, (7) The approach, (8) The outcome: white cards (`--width-story-card`), one height (`--size-story-card-h`), the blue icon on top (`src/icons/story/`, Claude's pick), heading `.t-h3` (Montserrat, Kedar 2026-11-11), text `.t-p`. Blank fields = no card. Frontmatter: **quote any value containing a comma or a colon** (YAML). Scope and Impact are YAML lists. (Replaces the grey `PostIntro` details panel, deleted 2026-11-06.)
- **Next post** (Kedar, 2026-11-09; replaces the 2026-11-01 graphic inside the white sheet): after the white sheet, back on blue: "Read next" (Kedar 2026-11-09; was "Next post") `.t-h2` (section-heading spacing), then the next post as the same row as /work (`PostCard row level={3}`: title + "View details" left, graphic right; opens with the sheet transition). Next by Notion `Order`, wrapping to the first.
- **Floating button** (Kedar, 2026-11-01): one black 44px circle bottom-right (↑ to top; the floating ← was removed the same day), shown only once the Back button has scrolled out of view (appear instantly; ↑ jumps, no smooth scroll). `--z-float`, `--rhythm-float`.
- **Captions** (MacBook Air - 32): Notion image caption → Markdown title (`![alt](./x.png "Caption")`) → `.t-p` figcaption, centred under the image, grey (`--color-on-surface-muted`), at most the reading-column width. 80 (`--rhythm-figure`) above every image and below its caption (a heading right above keeps its tight 12). Plain text only (links in a Notion caption are dropped).
- **Image sizes to export (Kedar, 2026-11-05):** body images 2880 wide, any height (the site makes phone, laptop and desktop sizes: `IMAGE_WIDTHS` in `rehype-prose.mjs`). Card graphic 2400 × 1260.
- Images: edge to edge up to 1280 (`--width-post-image`, Kedar 2026-11-06: too big on a 27" screen), then centred on the full-width white; square corners. No enlarge button or lightbox (removed, Kedar 2026-11-05).
- **Reading rhythm** (revised 2026-11-05): text column 552 (`--width-post`); images break out to the full viewport, videos to the content width; running text `--color-on-prose` `.t-p`; `##` = `.t-h2`, `###` = `.t-p-bold`; every block 24 apart (`--rhythm-prose`); tables/quotes/dividers 40 (`--rhythm-prose-block`); h2 gets `--rhythm-heading-above` (64 → 96) above and `--rhythm-heading-below` (24 → 32) below; h3 40 above, 12 below; list items 4 apart. Implemented with margin-top "owl" rules in `global.css` (`.prose > * + *`), no grid gaps.
- A post with an empty body (no images yet) shows the title, story cards and button, and is noindex (Kedar 2026-11-10: story cards show regardless).
- Pull quote = `.t-p`, centred, hairlines above + below. `---` = hairline. Tables = compact light-blue panel (cells 12 × 16), white row lines, values right-aligned (regular weight).
- The card graphic (`ogImage`) is the /work card and the link preview only; **it is never shown on the post page** (Kedar, 2026-11-05).
- **The post body follows Notion's sequence of text and images exactly, on every screen size** (Kedar, 2026-11-05). Nothing is moved or lifted out.
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
  3. **Every card except /work** tilts in 3D toward the mouse (Kedar, 2026-10-30; was WOW only): Approach portrait cards, About team/advisor cards, homepage + /reviews review cards, Services cards, Approach grid. Max 3° each axis (`--motion-tilt-max`), perspective `--motion-tilt-depth`, eased 150 ms. One script `src/scripts/tilt.ts` + `[data-tilt]` rule in `global.css`; `Card` opts in with `tilt`. /work post cards keep their own lift (item 4). Mouse only — off on touch and for reduced motion.
  4. /work post cards hover ("elegant, like Apple"): rise 6px + scale 1.01, shadow deepens (`--shadow-rest` → `--shadow-lifted`); 500 ms `--ease-lift`. Mouse only; off for reduced motion.
  5. *(Not on any page since 2026-11-01.)* /work client logos scroll continuously **inside the content container**, edges faded (`ClientLogos.astro`, tokens `--motion-logo-per-item` (speed), `--rhythm-logo-strip` (space below; above = hero's bottom space)). Static wrapped row under `prefers-reduced-motion`.
  6. **Homepage review cards** (Kedar, 2026-10-30, "gentle… manual scrolling also, like Apple"): a real horizontal scroller (swipe / trackpad; the ← → buttons left with MacBook Air - 22) that also drifts right → left at `--motion-review-speed` (24 px/s), easing in/out (`--motion-review-ease`). Drift stops while hovered or keyboard-focused, and for `--motion-review-resume` (3 s) after any manual scroll. Loops forever: list rendered 5×, lives in the middle copy and jumps back by one set once a scroll settles (invisible). Two copies weren't enough — a fast swipe on a wide screen hit the end, stopped, then jumped. Reduced motion: no drift.
  7. *(Removed 2026-11-04: homepage word swap; MacBook Air - 22 has plain "scale-up". `WordSwap.astro` is in git history.)*
  8. *(Removed 2026-11-06: About cards no longer open; bios are on the cards.)*
  9. **Post header nav ⇄ title cross-fade** (Kedar, 2026-11-01, "best Apple style"): 250 ms (`--motion-header-line`) when the big title passes under the header. Reduced motion: instant. The progress line just follows the scroll. The header itself never moves.
  10. **/work → post transition** (Kedar, 2026-11-06, "elegant and mature, but cool and modern"): click a post on /work → a white sheet with a rounded top rises over the screen (`--motion-sheet-cover`, 450 ms); the post loads under it and the sheet slides down (`--motion-sheet-reveal`, 700 ms) until it sits exactly on the post's white section. One curve, `--ease-sheet` (Apple's sheet curve). `src/scripts/sheet-transition.ts` + `.sheet-cover` in `global.css`; links opt in with `data-sheet-link`. Skipped for reduced motion, cmd/ctrl-click and direct visits. **Gotcha:** the production CSS minifier rewrites `700ms` as `.7s`, so any script reading a duration token must handle both units (it ran instantly on the live preview until 2026-11-07).
- Item 6's drift lives in `src/scripts/drift.ts` (homepage reviews only; the post carousel was tried with it and made static, Kedar 2026-11-06).
  11. **Post story carousel ← →** (Kedar, 2026-11-06): the arrows smooth-scroll one card. Reduced motion: instant.
- Adding anything to this list needs his explicit OK first.

## Copy rules
- **Locked (Kedar, 2026-10-30):** homepage headline = "Growth has a pattern. Let's find yours." Don't change without his say. (The old one, "An independent design studio with taste and AI chops.", is no longer used; /work is headed "Doing good work".)
- Use Kedar's words **verbatim** from the designs. Never invent copy. Typos stay unless he fixes them.
- No all-caps / `text-transform: uppercase`.
- Placeholders must be plainly labelled (`TODO(Kedar)`, "Image: …").

## Open items / waiting on Kedar
- **Reviews (2026-11-04):** Kedar's wording from MacBook Air - 22 + 33. Better photos of Rahool, Bogdan and Audrey wanted (Bogdan's and Audrey's sources are ~300 wide).
- **Status at end of 2026-10-16:** design system, all 6 page types and GitHub preview done. Waiting on content: case-study texts, vertical card art + text for PropertyGuru, Jupiter debit card, Lumosity, BookMyShow, BookMyShow R&R, Project Pratima; covers (1200×630); `site.sameAs` profiles; Amazon book link; domain launch.
- Clean-up 2026-10-16: removed unused `Media`, `WaveMark`, `quote-mark.svg` and their tokens. If the wave mark is wanted again, it's in the logo SVG.
- Images: all card photos/covers, client logo FILES (19 names listed in `src/data/site.ts`; drop files in `src/assets/clients/` named as `file`), testimonial brand logos, About app icons, WOW portraits.
- Amazon book link (`src/data/site.ts`). Email is set: hello@patternsstudio.co (`routes.email` = mailto link).
- Which projects get detail pages, and their content.
