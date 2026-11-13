// Site-wide data. Every URL, label and legal line lives here — never inline in a page.

export const site = {
  name: 'Patterns Studio',
  email: 'hello@patternsstudio.co',
  // Google Tag Manager container (Kedar, 2026-11-13). It holds the GA4 tag (G-LX0J19K221); add or change
  // tracking in tagmanager.google.com, not here. Empty = no tracking on any page.
  gtmId: 'GTM-KQGMR6F3',
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

// LinkedIn profiles of the team and advisors (About cards).
export const linkedin = {
  kedar: 'https://www.linkedin.com/in/nimkarkedar/',
  john: 'https://www.linkedin.com/in/johnpathrose/',
  andrew: 'https://www.linkedin.com/in/andrewmcglinchey/',
  raena: 'https://www.linkedin.com/in/raenalim/',
};

// UI labels.
export const labels = {
  exploreWork: 'Explore our work',
  exploreServices: 'Explore our services',
  back: 'Back',
  toTop: 'Back to top',                  // floating button on posts (screen readers)
  viewDetails: 'View details',           // /work: link beside each post's graphic (MacBook Air - 37)
  viewWork: 'View work',                 // post client card: link to the live work (Kedar, 2026-11-09)
  // Cookie banner (Kedar, 2026-11-13: "be creative"). Claude's draft, for Kedar's review.
  cookies: {
    region: 'Cookies',
    text: 'We bake a few cookies to see which work you enjoy. No tracking for ads, and we never sell a crumb.',
    accept: 'Sounds good',
    decline: 'No thanks',
  },
  newTab: 'opens in a new tab',
  nextPost: 'Read next',                // label above the next post's card at the end of a post
  impressedTalk: 'Impressed? Let’s talk',  // end of every case study (Kedar, 2026-11-01: one CTA, → /contact)
  reviewsTitle: 'Client reviews',        // /reviews tab title and section label
  client: 'Client',                      // post details panel
  clientLogo: 'Client logo',
  industry: 'Industry',
  duration: 'Duration',
  status: 'Status (Live)',
  scope: 'Scope',
  testimonial: 'Client testimonial',
  impact: 'Impact',
  testimonialCard: 'Client’s testimonial', // story card headings (MacBook Air - 38)
  about: (client: string) => `About ${client.split(' ')[0]}`, // "About Neufin": the first word of the client name, as the frame
  situation: 'The gap',
  task: 'The brief',
  action: 'The approach',
  result: 'The outcome',
  story: 'About the project',            // the carousel (screen readers)
  previous: 'Previous',                  // carousel arrows (screen readers)
  next: 'Next',
  onLinkedIn: 'on LinkedIn',             // About cards, LinkedIn mark (screen readers)
  workedAt: (name: string) => `Where ${name.split(' ')[0]} has worked`, // About cards: company logos (screen readers)
} as const;

// The questionnaire Kedar shares with every new client (Google Doc, 2026-11-06). Must be shared as
// "Anyone with the link can view", or visitors hit a sign-in wall. Linked from /approach ("Questions we ask clients").
const briefDocId = '1ZKk41rNKhbTUfEMpmFkTzSW6pzCMm1kcZK21uMCC5LA';
export const brief = {
  doc: `https://docs.google.com/document/d/${briefDocId}/edit?usp=sharing`,
};

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
  rateCard: path('/rate-card'), // the rate card, linked from /approach (MacBook Air - 36)
  // Opens the visitor's email app with a draft ready (Kedar, 2026-11-13): subject "Hello!", body as below.
  email: `mailto:${site.email}?subject=${encodeURIComponent('Hello!')}&body=${encodeURIComponent('You can add your details here...')}`,
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

// Client reviews, in display order: Kedar's words from MacBook Air - 22 (2026-11-04), verbatim. Women spread through the men (Kedar 2026-11-11).
// `file` = portrait in src/assets/reviews/<file>.webp, cropped from the frame, so every head sits as designed.
export const reviews = [
  { name: 'Viveck P Kumar', role: 'Chief Product Officer, Sleek', quote: 'No jargon, no unnecessary complexity. Just sharp thinking and work that delivers.', file: 'viveck-kumar' },
  { name: 'Eva Weidinger', role: 'Marketing Director, ELSA, Corp', quote: 'Complex problems became simple, practical solutions. Exactly what was needed at PG.', file: 'eva-weidinger' },
  { name: 'Nishant Choudhary', role: 'Co-founder, Prabhavi Learning', quote: 'Creative geniuses with phenomenal "learning mindset" and high integrity.', file: 'nishant-choudhary' },
  { name: 'Subramanya Sharma', role: 'Founder at Better Ed.', quote: 'Big-picture thinking with an incredible eye for the little details that matter.', file: 'subramanya-sharma' },
  { name: 'Jeremy Williams', role: 'Former COO, PropertyGuru', quote: 'Rare to find creative minds who understand the commercial side of things so well.', file: 'jeremy-williams' },
  { name: 'Audrey Woo', role: 'Co-Founder of Audn’co & Entrepreneur', quote: 'Working with Patterns felt less like hiring consultants and more like gaining great colleagues.', file: 'audrey-woo' }, // Kedar 2026-11-11; source photo 324 wide, a bigger one is wanted
  { name: 'Rahool Gadkari', role: 'Co-Founder @ Neufin Energy', quote: 'Kedar’s thinking brought the “X\u2060-\u2060factor” we needed for a distinctive brand architecture.', file: 'rahool-gadkari' },
  { name: 'Ian Tan', role: 'CMO | Social Entrepreneur', quote: 'It\'s rare to find people who care equally about the details and the bigger picture.', file: 'ian-tan' }, // Kedar 2026-11-11
  { name: 'Bogdan M.', role: '2x Founder, 2x Exit | Venture Investor', quote: 'No nonsense team. They get it right the first time and make building products feel effortless.', file: 'bogdan-m' }, // Kedar 2026-11-11; source photo 288 wide, a bigger one is wanted
] as const;
