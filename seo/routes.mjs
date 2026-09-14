import { SITE, HOURS_TEXT, FULL_ADDRESS, MENU_SECTIONS, FAQS } from './site.mjs';

const NAP = `
  <h2>Madras Mami — Brampton</h2>
  <p><strong>Address:</strong> ${FULL_ADDRESS}</p>
  <p><strong>Phone:</strong> <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></p>
  <p><strong>Email:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  <p><strong>Hours:</strong> ${HOURS_TEXT}</p>
  <p>100% pure vegetarian. Every dish cooked with pure desi ghee.</p>`;

const LINKS = `
  <nav aria-label="Madras Mami pages">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/menu">Menu</a></li>
      <li><a href="/about">Our story</a></li>
      <li><a href="/reservations">Reservations</a></li>
      <li><a href="/catering">Catering</a></li>
      <li><a href="/gift-cards">Gift cards</a></li>
      <li><a href="/brunch-tasting">Brunch at Mami's Table</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>`;

const faqHtml = (subset) => `
  <h2>Frequently asked questions</h2>
  <dl>${subset
    .map((f) => `\n    <dt>${f.q}</dt>\n    <dd>${f.a}</dd>`)
    .join('')}
  </dl>`;

const menuHtml = `
  <h2>What is on the menu</h2>
  <p>Twelve dosa varieties, a Bangalore Benne section, a vada bar, idli, uthappam,
  coupled plates, rice dishes, South Indian desserts and filter coffee. Everything is
  100% pure vegetarian and made with pure desi ghee. Dosa batter is fermented fresh
  daily and the coconut, tomato and Nilgiri chutneys are ground the same morning.</p>
  ${MENU_SECTIONS.map(
    (s) => `
  <h3>${s.name}</h3>${s.description ? `\n  <p>${s.description}</p>` : ''}
  <p>${s.items.join(', ')}.</p>`,
  ).join('')}`;

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
    title: 'Authentic South Indian Restaurant in Brampton | Madras Mami',
    description:
      "Brampton's authentic South Indian restaurant. 100% pure vegetarian, cooked in pure desi ghee. Dosas, idli and filter coffee at 6261 Mayfield Rd.",
    priority: '1.0',
    schema: ['restaurant', 'website', 'organization', 'faq', 'breadcrumb'],
    h1: 'Madras Mami — Authentic South Indian Restaurant in Brampton, 100% Pure Vegetarian, Made with Pure Desi Ghee',
    content: `
  <h2>Our story</h2>
  <p>The comforting whistle of the pressure cooker. The ritual of the first morning
  filter kapi. Every dish at Madras Mami is a love letter written by Mami's hands —
  the same hands that ground fresh batter before dawn, that tempered mustard seeds
  till they danced in hot oil, that rolled perfect idlis while the whole house still
  slept in the warmth of a Chennai morning.</p>
  <p>Heritage recipes passed down through Mami's kitchen, from the temple towns of
  Tamil Nadu to the coffee houses of Bengaluru, from the spice markets of Chettinad
  to the tiffin stalls of Mylapore — we bring that warmth, that taste of home, right
  here to Brampton.</p>
  <h2>What we cook</h2>
  <p>Rich South Indian flavours with creative flair: heritage dosas, elevated pairings
  built around coconut appetisers and idli ghee, and modern desserts that reimagine
  South Indian pantry staples — ladyfingers soaked in Madras filter coffee among them.</p>
  ${NAP}
  <p><a href="${SITE.orderUrl}">Order online</a> ·
     <a href="/reservations">Book a table</a> ·
     <a href="/menu">See the menu</a></p>
  ${faqHtml(FAQS)}
  ${LINKS}`,
  },
  {
    path: '/menu',
    title: 'Menu — Dosas, Idli & Filter Coffee | Madras Mami Brampton',
    description:
      'Dosas, idli, vada, uthappam, Bangalore Benne dosa and filter coffee — the full Madras Mami menu. 100% pure vegetarian, made with pure desi ghee.',
    priority: '0.9',
    schema: ['menu', 'restaurant', 'breadcrumb'],
    h1: 'Madras Mami Menu — Authentic South Indian Food in Brampton, 100% Pure Vegetarian, Made with Pure Desi Ghee',
    content: `
  <p>The main menu, the Jain menu and the tasting menu.</p>
  ${menuHtml}
  <p><a href="${SITE.orderUrl}">Order online</a> ·
     <a href="/reservations">Book a table</a></p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/about',
    title: 'Our Story — A South Indian Kitchen in Brampton | Madras Mami',
    description:
      'How Madras Mami brought recipes from Tamil Nadu, Kerala, Andhra Pradesh, Karnataka and Telangana to Brampton — 100% pure vegetarian, cooked in pure desi ghee.',
    priority: '0.8',
    schema: ['aboutpage', 'restaurant', 'breadcrumb'],
    h1: 'About Madras Mami — Authentic South Indian Restaurant in Brampton',
    content: `
  <h2>How it all began</h2>
  <p>Mami is what you call the woman in the neighbourhood whose kitchen always smells
  like something is on the stove. The one who feeds you without asking. The one whose
  sambar you spent years trying to recreate and never quite could. Madras Mami is that
  kitchen, brought to Brampton.</p>
  <p>Every dish comes from a specific place and a specific tradition: Tamil Nadu's
  tiffin culture, where the dosa tava never cools down. Bengaluru's Benne dosa lanes,
  where the butter is real. Chettinad's spice vocabulary. Kerala's coconut-softened
  curries. Andhra's heat. Telangana's depth. Five states, one menu, one kitchen in
  Brampton.</p>
  <h2>What does not change</h2>
  <p>Everything is 100% pure vegetarian and everything is made with pure desi ghee.
  Not as a selling point — as a non-negotiable. Signature Mami's Podi is blended
  in-house, dosa batter is fermented fresh every day, three chutneys are ground daily,
  and the sambar is slow-cooked from scratch every morning.</p>
  <h2>Our values</h2>
  <p>Authenticity first. Community at the core. Modern presentation. Sustainability.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/reservations',
    title: 'Book a Table in Brampton | Madras Mami',
    description:
      "Reserve a table at Madras Mami, Brampton's South Indian vegetarian restaurant. Open Mon–Fri from 4pm, Sat–Sun from 10am. 6261 Mayfield Rd, Unit 145.",
    priority: '0.8',
    schema: ['reserve', 'restaurant', 'breadcrumb'],
    h1: 'Reserve a Table at Madras Mami — Authentic South Indian Restaurant in Brampton',
    content: `
  <p>A seat at Mami's table awaits. Request a booking below, or call
  <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a>.</p>
  ${NAP}
  <p><a href="${SITE.reserveUrl}">Check table availability</a></p>
  ${faqHtml(FAQS.filter((f) => /hours|located|reservation|phone/i.test(f.q)))}
  ${LINKS}`,
  },
  {
    path: '/catering',
    title: 'South Indian Catering in Brampton & the GTA | Madras Mami',
    description:
      'South Indian catering for weddings, receptions, birthdays and corporate events across the GTA. Live dosa counter, thali spreads and tiffin menus.',
    priority: '0.9',
    schema: ['catering', 'restaurant', 'breadcrumb'],
    h1: 'South Indian Catering in Brampton and the GTA — Madras Mami',
    content: `
  <p>Madras Mami caters weddings, receptions, birthdays, baby showers, kitty parties
  and corporate events across the GTA. The food travels well because it is built on
  technique: slow-cooked curries, freshly made dosa batter, chutneys ground the same
  morning. All of it 100% pure vegetarian, all of it cooked in pure desi ghee.</p>
  <h2>What we cater</h2>
  <h3>Live dosa counter</h3>
  <p>Hand-rolled at your event, golden and made to order in front of your guests.</p>
  <h3>Wedding and reception catering</h3>
  <p>A full South Indian spread built around your guest count.</p>
  <h3>Private events and house parties</h3>
  <p>Birthdays, baby showers, kitty parties and corporate lunches.</p>
  <h3>Curated packages</h3>
  <p>Tiffin menus, thali spreads, chaat counters and dessert stations.</p>
  <h2>Where we cater</h2>
  <p>${SITE.areaServed.join(', ')}.</p>
  <h2>Book catering</h2>
  <p>Email <a href="mailto:${SITE.email}">${SITE.email}</a> or call
  <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a>.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/gift-cards',
    title: 'Gift Cards | Madras Mami Brampton',
    description:
      'Madras Mami gift cards — South Indian food in Brampton for family who miss the food they grew up with, and friends who moved away.',
    priority: '0.6',
    schema: ['giftcard', 'restaurant', 'breadcrumb'],
    h1: 'Madras Mami Gift Cards — South Indian Food in Brampton',
    content: `
  <p>A Madras Mami gift card, for family who miss the food they grew up with and for
  friends who moved away and are still finding their own spots. Redeemable in the
  restaurant at ${FULL_ADDRESS}.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/brunch-tasting',
    title: "South Indian Brunch at Mami's Table | Madras Mami Brampton",
    description:
      "South Indian brunch at Madras Mami in Brampton. Request a seat at Mami's Table for the tasting, help shape the menu, and hear about it first.",
    priority: '0.7',
    schema: ['video', 'restaurant', 'breadcrumb'],
    h1: "A South Indian Brunch, The Mami Way — Request Your Seat At Mami's Table",
    content: `
  <h2>Why join brunch at Mami's Table</h2>
  <h3>Be first</h3>
  <p>Hear about the brunch before it opens to everyone else.</p>
  <h3>Enjoy it on us</h3>
  <p>Seats at the tasting are our treat.</p>
  <h3>Shape the menu</h3>
  <p>Tell us what works and what should change before brunch goes on the menu.</p>
  ${NAP}
  ${LINKS}`,
  },
  {
    path: '/contact',
    title: 'Contact & Hours — 6261 Mayfield Rd, Brampton | Madras Mami',
    description:
      'Madras Mami, 6261 Mayfield Rd Unit 145, Brampton ON. Call (905) 913-5900 or email hello@madrasmami.ca. Open Mon–Fri 4–11pm, Sat–Sun 10am–11pm.',
    priority: '0.7',
    schema: ['contactpage', 'restaurant', 'faq', 'breadcrumb'],
    h1: 'Contact Madras Mami — South Indian Restaurant in Brampton',
    content: `
  <p>Mami's door is always open. Come say hello.</p>
  ${NAP}
  <p><a href="${SITE.map}">View on Google Maps</a></p>
  ${faqHtml(FAQS)}
  ${LINKS}`,
  },

  // ---- Consolidated / non-indexed routes -------------------------------
  // Orphaned duplicate of /about (nothing links to it). Canonicalised so the
  // two pages stop competing for the same "about Madras Mami" query.
  {
    path: '/about-us',
    title: 'How It All Began | Madras Mami Brampton',
    description:
      'How Madras Mami brought South Indian heritage recipes to Brampton — 100% pure vegetarian, cooked in pure desi ghee.',
    canonicalTo: '/about',
    sitemap: false,
    schema: ['restaurant'],
    h1: 'How It All Began — Madras Mami',
    content: `
  <p>Madras Mami's story, from Chennai to Brampton. See
  <a href="/about">our story</a> for the full version.</p>
  ${NAP}
  ${LINKS}`,
  },
  // Thin lead-capture page, not linked from the nav. Kept live for campaigns
  // but out of the index so it cannot outrank a real page.
  {
    path: '/newsletter',
    title: 'Newsletter | Madras Mami Brampton',
    description:
      'Join the Madras Mami list for events, tastings and offers in Brampton.',
    noindex: true,
    sitemap: false,
    schema: [],
    h1: 'Madras Mami Newsletter — Events, Tastings and Offers',
    content: `
  <p>Sign up for Madras Mami events, tastings and exclusive offers.</p>
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
