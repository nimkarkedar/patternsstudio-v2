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
  // Who we are, for structured data / llms.txt / RSS (Kedar's homepage headline + intro, verbatim).
  description:
    'Growth has a pattern. Let’s find yours. We help scale-up businesses with brand, communications, product design and strategic growth advice.',
  // TODO(Kedar): public profiles (LinkedIn, Substack, The Gyaan Project…) — they strengthen search + AI entity matching.
  sameAs: [] as string[],
};

// UI labels. `readCase` is screen-reader text for the card arrow (not shown visually).
export const labels = {
  readCase: 'Read case study',
  connect: 'Connect with me',
  explore: 'Explore how I can help',
  exploreWork: 'Explore our work',       // homepage hero
  exploreWow: 'Explore my ways of working',
  exploreWhatWeDo: 'Explore what we do',          // About, under the team
  exploreOurWow: 'Explore our ways of working',   // About, under the advisors
  checkOutWork: 'Check out what we have done',    // Our Way, under the cards
  solvedBefore: 'We’ve solved problems like these before.',   // What we do, micro-copy under the problem table (Claude's draft — Kedar to approve)
  seeOurWork: 'See our work',                                 // What we do, button under the problem table
  buyBook: 'Buy on Amazon',
  back: 'Back',
  toTop: 'Back to top',                  // floating button on posts (screen readers)
  seeAllWork: 'Impressed? See all work', // end of every case study
  connectAnytime: 'Connect anytime',
  enlarged: 'Enlarged image',            // lightbox (screen readers)
  close: 'Close',
  seeAllReviews: 'See all client reviews', // homepage, under the review cards
  reviewsTitle: 'Client reviews',          // /reviews heading (from the CTA wording)
  previous: 'Previous reviews',          // review strip arrows (screen readers)
  next: 'Next reviews',
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
  wow: path('/wow'),
  services: path('/services'),
  about: path('/about'),
  contact: path('/contact'),
  email: `mailto:${site.email}`, // opens the visitor's email app
  work: (slug: string) => path(`/work/${slug}`),
};

// Labels from Kedar's homepage design (MacBook Air - 16, 2026-10-30).
export const nav = [
  { label: 'Work', href: routes.workList },
  { label: 'What We Do', href: routes.services },
  { label: 'Our Way', href: routes.wow },
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

// Client reviews on the homepage, in display order (Kedar's design, MacBook Air - 16).
// `file` = portrait in src/assets/reviews/<file>.png (person on white, no text, cropped to the same headroom
// above the head so all heads line up). TODO(Kedar): 2× exports (760 wide) for Retina-sharp photos.
// `advisor: true` = also on the About page as an advisor → left out of the homepage strip and /reviews (Kedar, 2026-10-30).
// Quotes: max three lines on the card. Kedar's sample wording, shortened
// (2026-10-30). TODO(Kedar): replace each with the person's approved words before launch.
export const reviews = [
  { name: 'Raena Lim', role: 'Co-Founder & COO', quote: 'No jargon. Only sharp work.', file: 'raena-lim' },
  { name: 'Andrew McGlinchey', role: 'Product guy', quote: 'Creative minds who get the business side.', file: 'andrew-mcglinchey', advisor: true },
  { name: 'Jeremy Williams', role: 'MD | COO | CFO', quote: 'Clarity out of chaos, and focus on what matters.', file: 'jeremy-williams', advisor: true },
  { name: 'John Lua', role: 'CTO', quote: 'Not just beautiful design. Real business impact.', file: 'john-lua' },
  { name: 'Viveck Kumar', role: 'VP of Product', quote: 'Fresh eyes. Sharp insight.', file: 'viveck-kumar' },
  { name: 'Rahool Gadkari', role: 'Co-Founder', quote: 'Big-picture thinking, and an eye for detail.', file: 'rahool-gadkari' },
  { name: 'Manav Kamboj', role: 'CTO', quote: 'Creative, commercial, and they get it done.', file: 'manav-kamboj', advisor: true },
  { name: 'Audrey Woo', role: 'Founder', quote: 'More than great ideas. Ideas that actually worked.', file: 'audrey-woo', advisor: true },
  // Not from Kedar's samples — written to match them.
  { name: 'Yashwanth Belvadi', role: 'Co-Founder', quote: 'Design partners who move as fast as we do.', file: 'yashwanth-belvadi' },
] as const;

/** Reviews shown on the homepage strip and /reviews: everyone except the advisors (they're on About). */
export const clientReviews = reviews.filter((r) => !('advisor' in r && r.advisor));
