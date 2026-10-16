// Site-wide data. Every URL, label and legal line lives here — never inline in a page.

export const site = {
  name: 'Patterns Studio',
  email: 'kedar@patternsstudio.co',
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
  // Default meta description (Kedar's homepage headline + intro, verbatim).
  description:
    'An independent design studio with taste and AI chops. At Patterns, we design software, build brands, and bring products to market.',
  // TODO(Kedar): public profiles (LinkedIn, Substack, The Gyaan Project…) — they strengthen search + AI entity matching.
  sameAs: [] as string[],
};

// UI labels. `readCase` is screen-reader text for the card arrow (not shown visually).
export const labels = {
  readCase: 'Read case study',
  connect: 'Connect with me',
  explore: 'Explore how I can help',
  exploreWow: 'Explore my ways of working',
  buyBook: 'Buy on Amazon',
  back: 'Back',
  seeAllWork: 'Impressed? See all work', // end of every case study
  connectAnytime: 'Connect anytime',
  enlarged: 'Enlarged image',            // lightbox (screen readers)
  close: 'Close',
} as const;

// Every internal link goes through `path()`, so the site works at the domain root and under a
// sub-folder (the GitHub preview, /patternsstudio-v2/). BASE_URL comes from `base` in astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (p: string) => `${BASE}${p}`;
/** GitHub preview build: every page noindex, robots.txt blocks all. */
export const isPreview = import.meta.env.PREVIEW;

export const routes = {
  home: path('/'),
  wow: path('/wow'),
  services: path('/services'),
  about: path('/about'),
  contact: path('/contact'),
  email: `mailto:${site.email}`, // opens the visitor's email app
  work: (slug: string) => path(`/work/${slug}`),
};

export const nav = [
  { label: 'Work', href: routes.home },
  { label: 'WOW', href: routes.wow },
  { label: 'Services', href: routes.services },
  { label: 'About', href: routes.about },
];

export const contactLink = { label: 'Contact', href: routes.contact };

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
  { name: 'Sleek', file: 'sleek' },
  { name: 'Surge', file: 'surge' },
  { name: 'The Gyaan Project', file: 'the-gyaan-project' },
  { name: 'Vipassana Meditation App', file: 'vipassana-meditation-app' },
  { name: 'zipdial', file: 'zipdial' },
] as const;
