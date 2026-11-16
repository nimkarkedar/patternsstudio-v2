// Search + link-preview details for each main page (Kedar, 2026-11-15: "index high on Google in SEA, Singapore and India").
// metaTitle: the full <title> Google shows (≤ 60 characters). description: 140–160 characters, names the places we serve.
// image: Kedar's 2400 × 1260 preview card (src/assets/og/), resized to 1200 × 630 for WhatsApp / LinkedIn / X.
// Posts don't use this: they take their title, Summary and card graphic from Notion.
import type { ImageMetadata } from 'astro';
import about from '../assets/og/about.png';
import approach from '../assets/og/approach.png';
import contact from '../assets/og/contact.png';
import reviews from '../assets/og/reviews.png';
import services from '../assets/og/services.png';
import work from '../assets/og/work.png';

type PageSeo = { title?: string; metaTitle: string; description: string; image: ImageMetadata; imageAlt: string };
const card = (words: string) => `Patterns logo on brand blue, with the words “${words}”`;

export const pageSeo = {
  // Home uses the About card (Kedar, 2026-11-15: same visual).
  home: {
    metaTitle: 'Patterns Studio — Brand & Product Design Studio, Singapore',
    description: 'Independent design studio in Singapore. Brand, communication, product design and growth advisory for scale-ups across Southeast Asia and India.',
    image: about,
    imageAlt: card('An independent design studio based in Southeast Asia.'),
  },
  about: {
    title: 'About',
    metaTitle: 'About Patterns Studio — Design Studio in Singapore',
    description: 'Patterns Studio is an independent design studio based in Southeast Asia, led by senior designers and growth leaders from PropertyGuru, Cleartrip and Microsoft.',
    image: about,
    imageAlt: card('An independent design studio based in Southeast Asia.'),
  },
  services: {
    title: 'Services',
    metaTitle: 'Brand, Product Design & Growth Services — Patterns Studio',
    description: 'Brand identity, product design, UX, communication and growth advisory for startups and scale-ups in Singapore, Southeast Asia and India.',
    image: services,
    imageAlt: card('Different problems. Know how we solve them.'),
  },
  approach: {
    title: 'Approach',
    metaTitle: 'Our Approach to Design — Patterns Studio',
    description: 'There are 2 ways of working with us. Senior, hands-on designers who make real prototypes and accessible, measurable work. Based in Singapore, working across Asia.',
    image: approach,
    imageAlt: card('There are 2 ways of working with us.'),
  },
  reviews: {
    title: 'Client reviews',
    metaTitle: 'Client Reviews — Patterns Studio, Singapore',
    description: 'How do you become successful? Make people happy. Read what founders and leaders from PropertyGuru, Sleek and Neufin Energy say about working with Patterns Studio.',
    image: reviews,
    imageAlt: card('How do you become successful? Make people happy.'),
  },
  work: {
    title: 'Work',
    metaTitle: 'Case Studies: Brand & Product Design — Patterns Studio',
    description: 'Design case studies from Patterns Studio: PropertyGuru, Jupiter, Cleartrip, BookMyShow and more. Brand and product design for Southeast Asia and India.',
    image: work,
    imageAlt: card('Doing good work. Explore our case studies.'),
  },
  // /overview: the one-pager sent to prospects (MacBook Air - 40, 2026-11-16). Uses the About card.
  overview: {
    title: 'tl;dr',
    metaTitle: 'Patterns Studio tl;dr — Design Studio in Singapore',
    description: 'Patterns Studio on one page: who we are, what we do, who we work with and how. An independent design studio in Singapore, serving Southeast Asia and India.',
    image: about,
    imageAlt: card('An independent design studio based in Southeast Asia.'),
  },
  contact: {
    title: 'Contact',
    metaTitle: 'Contact Patterns Studio — Design Studio in Singapore',
    description: 'Hello! Let’s talk. Email hello@patternsstudio.co to work with an independent design studio in Singapore, serving Southeast Asia and India.',
    image: contact,
    imageAlt: card('Hello! Lets talk?'),
  },
} satisfies Record<string, PageSeo>;
