// Structured data (schema.org JSON-LD) shared by every page. Search engines and AI crawlers use
// this to understand WHO Patterns Studio is, WHO Kedar is, and WHAT each page is about.
import { site, path } from '../data/site';

export const ids = (origin: URL) => ({
  org: new URL(path('/#organization'), origin).href,
  website: new URL(path('/#website'), origin).href,
  founder: new URL(path('/about/#kedar-nimkar'), origin).href,
});

export function siteGraph(origin: URL) {
  const id = ids(origin);
  return [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': id.org,
      name: site.name,
      legalName: site.legalName,
      url: new URL(path('/'), origin).href,
      logo: new URL(path('/logo.png'), origin).href,
      image: new URL(path('/og-default.png'), origin).href,
      email: site.email,
      description: site.description,
      identifier: { '@type': 'PropertyValue', propertyID: 'UEN', value: site.uenNumber },
      address: { '@type': 'PostalAddress', addressLocality: site.locality, addressCountry: site.country },
      areaServed: 'Worldwide',
      founder: { '@id': id.founder },
      ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': id.website,
      url: new URL(path('/'), origin).href,
      name: site.name,
      inLanguage: 'en',
      publisher: { '@id': id.org },
    },
    {
      '@type': 'Person',
      '@id': id.founder,
      name: site.founder,
      jobTitle: 'Founder',
      worksFor: { '@id': id.org },
      url: new URL(path('/about/'), origin).href,
    },
  ];
}

/** Absolute, trailing-slash canonical URL (GitHub Pages serves /page/ for /page). */
export function canonicalFor(pathname: string, origin: URL) {
  const path = pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
  return new URL(path, origin).href;
}

export const readingMinutes = (markdown = '') =>
  Math.max(1, Math.round(markdown.replace(/<!--[\s\S]*?-->/g, '').split(/\s+/).filter(Boolean).length / 225));
