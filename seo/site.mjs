/**
 * Single source of truth for Madras Mami SEO / GEO data.
 *
 * Imported by BOTH:
 *   - scripts/build-seo.mjs  (Node, at build time — writes per-route static HTML)
 *   - src/seo/useRouteSeo.ts (browser, on SPA route change — keeps the head in sync)
 *
 * Plain .mjs with no TS/JSX so Node can import it directly without a transpile step.
 */

export const SITE = {
  origin: 'https://www.madrasmami.ca',
  name: 'Madras Mami',
  legalName: 'Madras Mami',
  phone: '+19059135900',
  phoneDisplay: '(905) 913-5900',
  email: 'hello@madrasmami.ca',
  priceRange: '$$',
  currency: 'CAD',
  ogImage: 'https://www.madrasmami.ca/og-banner.jpg',
  logo: 'https://www.madrasmami.ca/logo.png',
  // Both files were 404 until 2026-09-04 — every share and every schema
  // image/logo field pointed at nothing. Generated from brand assets.
  ogImageMeta: { width: 1200, height: 630, type: 'image/jpeg' },
  logoMeta: { width: 1200, height: 461, type: 'image/png' },
  // The unit sits inside this plaza; used for containedInPlace.
  containedInPlace: 'Mayfield Plaza',
  address: {
    street: '6261 Mayfield Rd, Unit 145',
    locality: 'Brampton',
    region: 'ON',
    postalCode: 'L6P 0X9',
    country: 'CA',
  },
  geo: { lat: 43.7587, lng: -79.7612 },
  // Verified 2026-09-04. Zomato (404) and Yelp (unverified) links were removed —
  // broken sameAs targets weaken entity matching rather than help it.
  sameAs: [
    'https://www.instagram.com/madrasmami.ca/',
    'https://www.facebook.com/madrasmami',
    'https://share.google/US5bWLfnTKIab8p5V',
  ],
  // Google Knowledge Graph entity id for the business, resolved from the
  // client's own Google share link.
  kgmid: '/g/11zjp7gn6g',
  map: 'https://share.google/US5bWLfnTKIab8p5V',
  orderUrl: 'https://order.toasttab.com/online/madras-mami-6261-mayfield-road-unit-145',
  reserveUrl: 'https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime',
  cuisines: ['South Indian', 'Tamil', 'Indian', 'Vegetarian'],
  areaServed: [
    'Brampton', 'Mississauga', 'Vaughan', 'Caledon', 'Bolton',
    'Woodbridge', 'Etobicoke', 'Malton', 'Georgetown', 'Orangeville',
  ],
};

/** Machine-readable hours. Mon–Fri 4pm–11pm, Sat–Sun 10am–11pm. */
export const OPENING_HOURS = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '16:00',
    closes: '23:00',
  },
  {
    days: ['Saturday', 'Sunday'],
    opens: '10:00',
    closes: '23:00',
  },
];

/** Same hours in prose, for visible page text and llms.txt. */
export const HOURS_TEXT =
  'Monday to Friday 4:00pm to 11:00pm. Saturday and Sunday 10:00am to 11:00pm.';

export const FULL_ADDRESS =
  '6261 Mayfield Rd, Unit 145, Brampton, ON L6P 0X9';

/**
 * The menu, by section. Powers the Menu JSON-LD on /menu so the dishes are
 * machine-readable even though the page itself presents the menu as images.
 */
export const MENU_SECTIONS = [
  {
    name: "Mami's Dosa Classics",
    description:
      'Served with veg sambar, coconut chutney, tomato chutney and Nilgiri chutney.',
    items: [
      'Sada Dosa', 'Masala Dosa', 'Mysore Masala Dosa', 'Ghee Roast Masala Dosa',
      'Podi Masala Dosa', 'Amul Cheese and Chilli Dosa', 'Garlic Butter Dosa',
      'Mushroom Sukka Dosa', 'Ghotala Dosa', 'Manglorean Paneer Dosa',
      'Pav Bhaaji Dosa', 'Paneer Burji Dosa',
    ],
  },
  {
    name: 'Bangalore Benne',
    description:
      'A Bengaluru street specialty — its own batter, fenugreek and desi white butter.',
    items: ['Benne Classic', 'Benne Masala Dosa', 'Benne Mysore Masala', 'Benne Paneer Burji'],
  },
  {
    name: 'Rava Dosa and Uthappam',
    items: [
      'Rava Masala', 'Onion Rava Masala', 'Paneer Rava Masala Dosa',
      'Onion Uthappam', 'Mushroom Ghee Roast Uthappam', 'Pesto Uthappam',
    ],
  },
  {
    name: 'Idli',
    items: [
      'Steamed Idli', 'Mami Thatte Idli', 'Gunpowder Idli Fries',
      'Barbeque Idli Skewers', 'Dunked Junior Idlis',
    ],
  },
  {
    name: 'The Vada Bar',
    items: [
      'The Everything Vada', 'The Curd Bomb (Thayir Vada)',
      'Great Rasa Vada (Rasam Vada)', 'Amazing Medhu Vada Poutine',
    ],
  },
  {
    name: 'Munchies',
    items: [
      'Edamame and Soundal Hummus', 'Chilli Bhajji', 'Ghee Roast Paneer Tacos',
      'Chettinad Soya Chaap Momo', 'Roadstyle Kalan Mushroom', 'Truffle Fries',
    ],
  },
  {
    name: 'The Coupled Plates',
    description: 'A curry and its companion, the way South Indian food gets eaten at home.',
    items: [
      'Nunku Paya and Malabar Parotta', 'Comforting Vada Curry and Kal Dosa',
      'Yennegai Badenkayi and Steamed Ghee Rice',
      'Village Style Paneer Korma and Malabar Parotta',
      'Curry Leaf Tofu and Zesty Lemon Rice',
    ],
  },
  {
    name: "Mami's Fuel",
    items: ['Bisi Bele Bath Risotto', 'Idiyappam Ramen', 'Patta Biryani'],
  },
  {
    name: 'Extra Affairs',
    items: [
      'Temple Tamarind Rice', 'Heritage Lemon Rice', 'Cold Curd Rice',
      'Steamed Ghee Rice', 'Malabar Parotta',
    ],
  },
  {
    name: 'Soup and Salad',
    items: ['Rasam Soup', 'Avocado Kosambari'],
  },
  {
    name: 'Desserts and Sweets',
    items: [
      'Filter Kapi Tiramisu', 'Elaneer Payasam Classic',
      'Chocolate Dosa Waffle and Cardamom Berrie Combot',
      'Mango Panna Cotta', 'Silk Coconut Gelato',
    ],
  },
  {
    name: 'Beverages',
    items: [
      'Madras Filter Kapi', 'Iced Madras Filter Kapi', 'Cutting Chai',
      'Fresh Coconut Water', 'Black Kokum Cooler', 'Coconut Matcha',
      'Fresh Mango Slush', 'Tamarindo', 'Rosie Darling',
    ],
  },
];

/**
 * Questions real guests actually ask. Rendered as FAQPage JSON-LD on the pages
 * where the answer belongs, and as crawlable text in the static block.
 */
export const FAQS = [
  {
    q: 'Is Madras Mami 100% vegetarian?',
    a: 'Yes. Madras Mami is 100% pure vegetarian. No meat, no fish, no eggs, anywhere on the menu.',
  },
  {
    q: 'Do you cook with desi ghee?',
    a: 'Yes. Every dish is made with pure desi ghee, not oil substitutes.',
  },
  {
    q: 'What are Madras Mami’s hours?',
    a: 'Monday to Friday 4:00pm to 11:00pm. Saturday and Sunday 10:00am to 11:00pm.',
  },
  {
    q: 'Where is Madras Mami located?',
    a: 'At 6261 Mayfield Rd, Unit 145, Brampton, ON L6P 0X9, in Mayfield Plaza in north Brampton.',
  },
  {
    q: 'What is Madras Mami’s phone number?',
    a: 'Call (905) 913-5900, or email hello@madrasmami.ca.',
  },
  {
    q: 'Does Madras Mami do catering?',
    a: 'Yes. Madras Mami caters weddings, receptions, birthdays, baby showers, kitty parties and corporate events across the GTA, including a live dosa counter, thali spreads, tiffin menus, chaat counters and dessert stations.',
  },
  {
    q: 'Can I order South Indian food online from Madras Mami?',
    a: 'Yes. Takeout and delivery are available through the online ordering page, and you can also call (905) 913-5900.',
  },
  {
    q: 'Do you take reservations?',
    a: 'Yes. Tables can be booked on the reservations page or by calling (905) 913-5900.',
  },
];

/**
 * The three menus the /menu page actually presents as tabs. Previously modelled
 * as a single Menu, which understated the Jain and tasting offerings — both of
 * which are their own search demand ("jain south indian brampton").
 */
export const MENUS = [
  {
    id: 'main',
    name: 'Madras Mami Menu',
    description:
      'The full South Indian menu — dosas, idli, vada, uthappam, coupled plates, rice, desserts and filter coffee. 100% pure vegetarian, cooked in pure desi ghee.',
    sectioned: true,
  },
  {
    id: 'jain',
    name: 'Madras Mami Jain Menu',
    description:
      'A separate Jain menu, prepared without onion or garlic, drawn from the same South Indian kitchen.',
    diets: ['https://schema.org/VegetarianDiet'],
  },
  {
    id: 'tasting',
    name: "Madras Mami Tasting Menu",
    description:
      'A guided tasting through the South Indian regions the kitchen cooks from.',
    diets: ['https://schema.org/VegetarianDiet'],
  },
];

/** What the restaurant actually sells, as an offer catalogue. */
export const OFFERINGS = [
  ['Dine In', 'Table service at 6261 Mayfield Rd, Unit 145, Brampton.'],
  ['Takeout', 'Order ahead online or by phone and collect in the restaurant.'],
  ['Delivery', 'South Indian delivery across north Brampton and the surrounding GTA.'],
  ['Catering', 'Weddings, receptions, birthdays, baby showers and corporate events.'],
  ['Live Dosa Counter', 'Dosas hand-rolled to order at your event.'],
  ['Gift Cards', 'Redeemable in the restaurant, in any amount.'],
];

/** Topics the kitchen is genuinely expert in — entity grounding, not keywords. */
export const KNOWS_ABOUT = [
  'South Indian cuisine',
  'Tamil Nadu tiffin cooking',
  'Dosa and dosa batter fermentation',
  'Bangalore Benne dosa',
  'Chettinad spice blends',
  'Kerala coconut curries',
  'Andhra and Telangana cooking',
  'Pure vegetarian cooking',
  'Desi ghee cooking',
  'South Indian filter coffee',
  'Jain cooking without onion or garlic',
  'South Indian wedding catering',
];

/** The real video on the brunch page — public/brunch/hero.mp4 with its poster. */
export const BRUNCH_VIDEO = {
  name: "Brunch at Mami's Table — Madras Mami, Brampton",
  description:
    "A look at the South Indian brunch service at Madras Mami in Brampton, from the dosa tava to the filter coffee.",
  contentUrl: 'https://www.madrasmami.ca/brunch/hero.mp4',
  thumbnailUrl: 'https://www.madrasmami.ca/brunch/hero-poster.jpg',
  uploadDate: '2026-07-27',
};
