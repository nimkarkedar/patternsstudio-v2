// Site-wide data. Every URL, label and legal line lives here — never inline in a page.

export const site = {
  name: 'Patterns Studio',
  email: 'hello@patternsstudio.co',
  legal: '© 2026 Patterns Studio Pte. Ltd.',
  flag: '🇸🇬',
  uen: 'UEN 202640285H',
  // TODO(Kedar): Amazon link for "The Design in Everything".
  bookUrl: '#',
  legalName: 'Patterns Studio Pte. Ltd.',
  themeColor: '#2b18d7', // browser UI colour — must match --blue-600 in tokens.css
  uenNumber: '202640285H',
  locality: 'Singapore',
  country: 'SG',
  founder: 'Kedar Nimkar',
  founderRole: 'Founder of Patterns Studio Pte Ltd',
  // Who we are, for structured data / llms.txt / RSS (Kedar's homepage headline + intro, verbatim).
  description:
    'Growth has a pattern. Let’s find yours. We help scale-up businesses with brand, communication, product design and strategic growth advisory.',
  // TODO(Kedar): public profiles (LinkedIn, Substack, The Gyaan Project…) — they strengthen search + AI entity matching.
  sameAs: [] as string[],
};

// UI labels.
export const labels = {
  exploreWork: 'Explore our work',
  exploreServices: 'Explore our services',
  back: 'Back',
  toTop: 'Back to top',                  // floating button on posts (screen readers)
  nextPost: 'Next post',                 // label above the next post's card at the end of a post
  impressedTalk: 'Impressed? Let’s talk',  // end of every case study (Kedar, 2026-11-01: one CTA, → /contact)
  enlarged: 'Enlarged image',            // lightbox (screen readers)
  close: 'Close',
  reviewsTitle: 'Client reviews',        // /reviews tab title and section label
  moreAbout: 'More about',               // About cards, + button (screen readers): "More about Kedar Nimkar"
  onLinkedIn: 'on LinkedIn',             // About cards, LinkedIn mark (screen readers)
} as const;

// Every internal link goes through `path()`, so the site works at the domain root and under a
// sub-folder (the GitHub preview, /patternsstudio-v2/). BASE_URL comes from `base` in astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (p: string) => `${BASE}${p}`;
/** GitHub preview build: every page noindex, robots.txt blocks all. */
export const isPreview = import.meta.env.PREVIEW;

export const routes = {
  home: path('/'),
  workList: path('/work'), // all case-study cards
  reviews: path('/reviews'),
  approach: path('/approach'),
  services: path('/services'),
  about: path('/about'),
  contact: path('/contact'),
  email: `mailto:${site.email}`, // opens the visitor's email app
  work: (slug: string) => path(`/work/${slug}`),
};

// Labels from Kedar's frames (MacBook Air - 22 onwards, 2026-11-04).
export const nav = [
  { label: 'Work', href: routes.workList },
  { label: 'Services', href: routes.services },
  { label: 'Approach', href: routes.approach },
  { label: 'About', href: routes.about },
  { label: 'Reviews', href: routes.reviews },
];

export const contactLink = { label: 'Let’s Talk', href: routes.contact };

// Client logo strip on the homepage, in display order.
// `file` = file name (without extension) in src/assets/clients/ — .svg, .png or .webp.
// Until the file exists, the name renders as text.
export const clients = [
  { name: 'Cleartrip', file: 'cleartrip' },
  { name: 'Government of India', file: 'government-of-india' },
  { name: 'Jupiter', file: 'jupiter' },
  { name: 'Legends of India', file: 'legends-of-india' },
  { name: 'Lumosity', file: 'lumosity' },
  { name: 'Myopal', file: 'myopal' },
  { name: 'Neufin Energy', file: 'neufin-energy' },
  { name: 'NH8 Films', file: 'nh8-films' },
  { name: 'Omnicuris', file: 'omnicuris' },
  { name: 'Practo', file: 'practo' },
  { name: 'Prithvi Theatre', file: 'prithvi-theatre' },
  { name: 'PropertyGuru', file: 'propertyguru' },
  { name: 'quant', file: 'quant' },
  { name: 'Samwoh', file: 'samwoh' },
  { name: 'Sinch', file: 'sinch' },
  { name: 'Sleek', file: 'sleek' },
  { name: 'Surge', file: 'surge' },
  { name: 'The Gyaan Project', file: 'the-gyaan-project' },
  { name: 'Vipassana Meditation App', file: 'vipassana-meditation-app' },
  { name: 'zipdial', file: 'zipdial' },
] as const;

// Client reviews, in display order: Kedar's words from MacBook Air - 22 (2026-11-04), verbatim.
// `file` = portrait in src/assets/reviews/<file>.webp, cropped from the frame, so every head sits as designed.
export const reviews = [
  { name: 'Viveck P Kumar', role: 'Chief Product Officer, Sleek', quote: 'No jargon, no unnecessary complexity. Just sharp thinking and work that delivers.', file: 'viveck-kumar' },
  { name: 'Nishant Choudhary', role: 'Co-founder and CEO, Prabhavi Learning', quote: 'Creative geniuses with phenomenal "learning mindset" and high integrity.', file: 'nishant-choudhary' },
  { name: 'Subramanya Sharma', role: 'Founder at Better Ed.', quote: 'Big-picture thinking with an incredible eye for the little details that matter.', file: 'subramanya-sharma' },
  { name: 'Jeremy Williams', role: 'Former COO, PropertyGuru', quote: 'Rare to find creative minds who understand the commercial side of things so well.', file: 'jeremy-williams' },
  { name: 'Rahool Gadkari', role: 'Co-Founder @ Neufin Energy', quote: 'Kedar’s thinking brought the “X\u2060-\u2060factor” we needed for a distinctive brand architecture.', file: 'rahool-gadkari' },
  { name: 'Eva Weidinger', role: 'Marketing Director, ELSA, Corp', quote: 'Complex problems became simple, practical solutions. Exactly what was needed at PG.', file: 'eva-weidinger' },
] as const;
