import { SITE, HOURS_TEXT, FULL_ADDRESS, MENU_SECTIONS, MENU_TAGLINE, FAQS } from './site.mjs';

/**
 * PENDING guard — mirrors seo/schema.mjs. A value that has not been supplied is
 * the literal string 'PENDING' (see PENDING.md). Crawlable copy must omit the
 * line entirely rather than print the word, and must never emit a dead link.
 */
const isSet = (v) =>
  v != null && v !== 'PENDING' && !(typeof v === 'string' && v.trim() === '');

/** Name, address, phone block. Phone and hours drop out while pending. */
const NAP = `
  <h2>Madras Social — Waterloo</h2>
  <p><strong>Address:</strong> ${FULL_ADDRESS}</p>${
    isSet(SITE.phone)
      ? `\n  <p><strong>Phone:</strong> <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></p>`
      : ''
  }
  <p><strong>Email:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a></p>${
    isSet(HOURS_TEXT) ? `\n  <p><strong>Hours:</strong> ${HOURS_TEXT}</p>` : ''
  }
  <p>A South Indian kitchen and bar in Waterloo Region.</p>`;

const LINKS = `
  <nav aria-label="Madras Social pages">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/menu">Menu</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/reservations">Reservations</a></li>
      <li><a href="/events">Events</a></li>
      <li><a href="/careers">Careers</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>`;

const faqHtml = (subset) => `
  <h2>Frequently asked questions</h2>
  <dl>${subset
    .map((f) => `\n    <dt>${f.q}</dt>\n    <dd>${f.a}</dd>`)
    .join('')}
  </dl>`;

/** Menu items are objects — name them explicitly or every item renders as
 *  [object Object]. Prices come straight from MENU_SECTIONS. */
const itemLine = (i) =>
  isSet(i.price) ? `${i.name} ${SITE.currency === 'CAD' ? '$' : ''}${i.price.toFixed(2)}` : i.name;

const menuHtml = `
  <h2>What is on the menu</h2>
  <p>${MENU_TAGLINE} Kerala and Tamil cooking, served as plates for the middle of
  the table. Vegetarian dishes are marked. The kitchen also cooks chicken, mutton,
  lamb, pomfret, lobster and shrimp.</p>
  ${MENU_SECTIONS.map(
    (s) => `
  <h3>${s.name}</h3>${s.description ? `\n  <p>${s.description}</p>` : ''}
  <p>${s.items.map(itemLine).join(', ')}.</p>`,
  ).join('')}`;

/** Order / reserve links, omitted entirely while the URLs are pending. */
const actions = () => {
  const out = [];
  if (isSet(SITE.orderUrl)) out.push(`<a href="${SITE.orderUrl}">Order online</a>`);
  if (isSet(SITE.reserveUrl)) out.push(`<a href="${SITE.reserveUrl}">Check table availability</a>`);
  out.push('<a href="/reservations">Request a table</a>');
  out.push('<a href="/menu">See the menu</a>');
  return `\n  <p>${out.join(' · ')}</p>`;
};

/**
 * Every indexable route, with the head it should serve and the crawlable text
 * an AI crawler sees when it does not execute JavaScript.
 *
 * `content` must stay a faithful text representation of what a visitor sees on
 * the rendered page — it is an accessible/no-JS alternative, not extra content.
 */
export const ROUTES = [
  {
    path: '/',
    title: 'Madras Social — South Indian Kitchen & Bar in Waterloo',
    description:
      'A South Indian kitchen and bar in Waterloo Region. Kerala and Tamil cooking, a full bar, and a table worth booking. 8 Erb Street West, Waterloo.',
    priority: '1.0',
    schema: ['restaurant', 'website', 'organization', 'faq', 'breadcrumb'],
    h1: 'Madras Social — A South Indian Kitchen and Bar in Waterloo',
    content: `
  <h2>The room</h2>
  <p>South Indian food, and somewhere to sit with it. Kerala and Tamil cooking,
  a full bar, and a table you book rather than a counter you queue at.</p>
  <p>${MENU_TAGLINE}</p>
  <h2>What we cook</h2>
  <p>Rasam and roots. Small plates. Dosas and uthappams from the tava. Bangalore
  butter dosas. Southern gravies with ghee sadam. Biryani, layered and loaded.
  Vegetarian dishes are marked. The kitchen also cooks chicken, mutton, lamb,
  pomfret, lobster and shrimp.</p>
  <h2>Where we are</h2>
  <p>${FULL_ADDRESS}. We serve ${SITE.areaServed.join(', ')}.</p>
  ${NAP}${actions()}
  ${faqHtml(FAQS)}
  ${LINKS}`,
  },
  {
    path: '/menu',
    title: 'Menu — Dosas, Biryani & Southern Gravies | Madras Social Waterloo',
    description:
      'The full Madras Social menu. Dosas, uthappams, Bangalore butter dosas, southern gravies, biryani and small plates, with a full bar. Waterloo, Ontario.',
    priority: '0.9',
    schema: ['menu', 'restaurant', 'breadcrumb'],
    h1: 'Madras Social Menu — South Indian Food and Drink in Waterloo',
    content: `
  <p>${MENU_TAGLINE}</p>
  ${menuHtml}${actions()}
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/about',
    title: 'About — A South Indian Room in Waterloo Region | Madras Social',
    description:
      'Madras Social is a South Indian kitchen and bar in Waterloo Region. Kerala and Tamil cooking, turned into an evening out rather than a takeout order.',
    priority: '0.8',
    schema: ['aboutpage', 'restaurant', 'breadcrumb'],
    h1: 'About Madras Social',
    content: `
  <h2>The idea</h2>
  <p>South Indian food is on menus from Times Square to Singapore. Waterloo Region
  has the appetite for it. What it did not have was the room — a South Indian
  kitchen with a real bar, where the evening is the point.</p>
  <p>That is Madras Social. Kerala and Tamil cooking, a full bar, and a table for
  the night rather than a bag to carry home.</p>
  <h2>The food</h2>
  <p>The menu reads across the south: rasam, roots and small plates to open;
  dosas and uthappams from the tava; Bangalore butter dosas; southern gravies
  served with ghee sadam; biryani built for the centre of the table. Vegetarian
  dishes are marked. The kitchen also cooks chicken, mutton, lamb, pomfret,
  lobster and shrimp.</p>
  <h2>Where we are</h2>
  <p>${FULL_ADDRESS}, serving ${SITE.areaServed.join(', ')}.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/reservations',
    title: 'Book a Table in Waterloo | Madras Social',
    description:
      'Request a table at Madras Social, a South Indian kitchen and bar at 8 Erb Street West, Waterloo. Tell us the date, the time and how many.',
    priority: '0.8',
    schema: ['reserve', 'restaurant', 'breadcrumb'],
    h1: 'Book a Table at Madras Social',
    content: `
  <p>Tell us the date, the time and how many. We will confirm by email.</p>
  ${NAP}${actions()}
  ${faqHtml(FAQS.filter((f) => /located|areas|bar|event/i.test(f.q)))}
  ${LINKS}`,
  },
  {
    path: '/events',
    title: 'Events & Private Dining in Waterloo Region | Madras Social',
    description:
      'Private dining and events at Madras Social, a South Indian kitchen and bar in Waterloo. Send us the date and the numbers and we will come back to you.',
    priority: '0.8',
    schema: ['catering', 'restaurant', 'breadcrumb'],
    h1: 'Events at Madras Social',
    content: `
  <p>Birthdays, work dinners, a long table for people who like each other.
  Send us the date, the numbers and what the evening is for.</p>
  <h2>Where we are</h2>
  <p>${FULL_ADDRESS}. We serve ${SITE.areaServed.join(', ')}.</p>
  <h2>Enquiries</h2>
  <p>Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/careers',
    title: 'Careers — Join the Team | Madras Social Waterloo',
    description:
      'Work at Madras Social, a South Indian kitchen and bar opening in Waterloo Region. Kitchen, bar and floor. Tell us what you do.',
    priority: '0.6',
    schema: ['restaurant', 'breadcrumb'],
    h1: 'Careers at Madras Social',
    content: `
  <p>We are opening a South Indian kitchen and bar in Waterloo Region, and we are
  hiring for the kitchen, the bar and the floor.</p>
  <p>Tell us what you do and where you have done it. Send it to
  <a href="mailto:${SITE.email}">${SITE.email}</a> or use the form on this page.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/contact',
    title: 'Contact — 8 Erb Street West, Waterloo | Madras Social',
    description:
      'Madras Social, 8 Erb Street West, Waterloo ON N2L 1S7. Email hello@madrassocial.ca. A South Indian kitchen and bar in Waterloo Region.',
    priority: '0.7',
    schema: ['contactpage', 'restaurant', 'faq', 'breadcrumb'],
    h1: 'Contact Madras Social',
    content: `
  <p>Come say hello.</p>
  ${NAP}${
    isSet(SITE.map) ? `\n  <p><a href="${SITE.map}">View on Google Maps</a></p>` : ''
  }
  ${faqHtml(FAQS)}
  ${LINKS}`,
  },

  // ---- Consolidated / non-indexed routes -------------------------------
  // The Events page also answers to /catering, which is where the source
  // mounted it. Canonicalised so the two paths stop competing.
  {
    path: '/catering',
    title: 'Events & Private Dining | Madras Social Waterloo',
    description:
      'Private dining and events at Madras Social, a South Indian kitchen and bar in Waterloo Region.',
    canonicalTo: '/events',
    sitemap: false,
    schema: ['restaurant'],
    h1: 'Events at Madras Social',
    content: `
  <p>See <a href="/events">events</a> for the full version.</p>
  ${NAP}
  ${LINKS}`,
  },
  // Orphaned duplicate of /about (nothing links to it). Canonicalised so the
  // two pages stop competing for the same "about Madras Social" query.
  {
    path: '/about-us',
    title: 'About | Madras Social Waterloo',
    description:
      'Madras Social is a South Indian kitchen and bar in Waterloo Region.',
    canonicalTo: '/about',
    sitemap: false,
    schema: ['restaurant'],
    h1: 'About Madras Social',
    content: `
  <p>See <a href="/about">about</a> for the full version.</p>
  ${NAP}
  ${LINKS}`,
  },
];

export const INDEXABLE = ROUTES.filter((r) => !r.noindex && r.sitemap !== false);

/** Look up a route by pathname, tolerating a trailing slash. */
export const routeFor = (pathname) => {
  const clean =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((r) => r.path === clean);
};
