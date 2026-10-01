/**
 * Single source of truth for Madras Social SEO / GEO data.
 *
 * Imported by BOTH:
 *   - scripts/build-seo.mjs  (Node, at build time — writes per-route static HTML)
 *   - src/seo/useRouteSeo.ts (browser, on SPA route change — keeps the head in sync)
 *
 * Plain .mjs with no TS/JSX so Node can import it directly without a transpile step.
 */

export const SITE = {
  // Inferred from the hello@madrassocial.ca address — CONFIRM before launch.
  // Every canonical URL, the sitemap and all JSON-LD are built from this.
  origin: 'https://www.madrassocial.ca',

  name: 'Madras Social',
  legalName: 'Madras Social',

  phone: 'PENDING',          // E.164, e.g. +15195550100
  phoneDisplay: 'PENDING',   // e.g. (519) 555-0100

  email: 'hello@madrassocial.ca',

  // Mains run $16–$38.50 with a full bar. Madras Social was '$$'; this sits
  // higher. Confirm with the client — it shows in Google's listing.
  priceRange: '$$$',
  currency: 'CAD',

  ogImage: 'https://www.madrassocial.ca/og-banner.jpg',
  logo: 'https://www.madrassocial.ca/logo.png',
  ogImageMeta: { width: 1200, height: 630, type: 'image/jpeg' },
  logoMeta: { width: 1200, height: 461, type: 'image/png' },

  address: {
    street: '8 Erb Street West',
    locality: 'Waterloo',
    region: 'ON',
    postalCode: 'N2L 1S7',
    country: 'CA',
  },

  // PENDING — take the exact lat/lng from the Google Business Profile once
  // the listing is claimed. Do not approximate: geo drives map pin accuracy
  // and local-pack ranking.
  geo: { lat: 'PENDING', lng: 'PENDING' },

  sameAs: [
    'https://www.instagram.com/madrassocial/',
    'https://www.facebook.com/profile.php?id=61592799734722',
  ],

  kgmid: 'PENDING',      // Google Knowledge Graph id — exists once the listing is verified
  map: 'PENDING',        // Google share link for the listing

  orderUrl: 'PENDING',   // online ordering — FloatingOrderCTA hides until set
  reserveUrl: 'PENDING', // reservations — /reservations CTA disabled until set

  cuisines: ['South Indian', 'Tamil', 'Indian'],

  areaServed: [
    'Waterloo', 'Kitchener', 'Cambridge', 'Guelph',
    'Elmira', 'St. Jacobs', 'Breslau', 'Baden',
  ],
};

/**
 * PENDING — opening hours not supplied.
 * Shape kept from the source so it drops straight in. Both the machine-readable
 * array and the prose version must match when filled.
 */
export const OPENING_HOURS = [
  // { days: ['Monday','Tuesday','Wednesday','Thursday'], opens: 'HH:MM', closes: 'HH:MM' },
  // { days: ['Friday','Saturday'], opens: 'HH:MM', closes: 'HH:MM' },
  // { days: ['Sunday'], opens: 'HH:MM', closes: 'HH:MM' },
];

export const HOURS_TEXT = 'PENDING';

export const FULL_ADDRESS = '8 Erb Street West, Waterloo, ON N2L 1S7';

/**
 * The menu, by section. Powers the Menu JSON-LD on /menu so the dishes are
 * machine-readable even though the page itself presents the menu as images.
 */
export const MENU_TAGLINE = 'Southern roots. Social plates.';

export const MENU_SECTIONS = [
  {
    name: 'Rasam & Roots',
    description: 'Bowls, greens and bright beginnings.',
    items: [
      {
        name: 'Nattu Kozhi Rasam',
        price: 12,
        veg: false,
        description:
          'A peppery country-chicken broth simmered with garlic — the South Indian answer to chicken soup.',
      },
      {
        name: 'Banana Stem Hotpot',
        price: 10.5,
        veg: true,
        description:
          'A comforting Burmese-style bowl of banana stem and chickpeas, finished with crisp plantain fritters.',
      },
      {
        name: 'Madras Karamani Bowl',
        price: 9,
        veg: true,
        description:
          'Black-eyed peas and fresh sprouts tossed with coconut, mustard and bright South Indian seasoning.',
      },
      {
        name: 'Mango & Clementine Salad',
        price: 12.5,
        veg: true,
        description:
          'Sweet mango, juicy clementine and mixed greens with a zingy mango-ginger dressing.',
      },
    ],
  },

  {
    name: 'Madras Tapas',
    description: 'Small plates with a southern attitude.',
    items: [
      {
        name: 'Mango Pickle Guac & Tapioca Chips',
        price: 7,
        veg: true,
        description:
          'Creamy guacamole with a tangy mango-pickle kick, served with crisp tapioca chips.',
      },
      {
        name: 'Beet Poriyal Hummus & Edamame Varuval',
        price: 12.5,
        veg: true,
        description:
          'Beetroot, coconut and green chilli blended into hummus, paired with honey-glazed edamame.',
      },
      {
        name: 'Mangalorean Soya Chaap Arancini',
        price: 13,
        veg: true,
        description:
          'Crisp, mozzarella-filled soya chaap rice bites with creamy curry mayo.',
      },
      {
        name: 'Cheesy Chicken Punugulu',
        price: 13.5,
        veg: false,
        description:
          'Andhra-style fritters packed with minced chicken and a gooey cheese centre.',
      },
      {
        name: 'Honey Chilli Shrimp Lettuce Wrap',
        price: 13.5,
        veg: false,
        description:
          'Juicy shrimp and bell peppers in tangy Tangra sauce, tucked into crisp lettuce with peanuts.',
      },
      {
        name: 'Rum-my Kozhi Roast',
        price: 18,
        veg: false,
        description:
          'Tender chicken roasted with dark rum, curry leaves and smoky black cardamom.',
      },
      {
        name: 'Madurai Mutton Sukka',
        price: 20,
        veg: false,
        description:
          'Bone-in mutton slow-roasted with coconut, red chilli and star anise.',
      },
    ],
  },

  {
    name: 'Main Affairs',
    description: 'Built for the centre of the table.',
    items: [
      {
        name: 'Malabar Chicken Steak',
        price: 28,
        veg: false,
        description:
          'Seared chicken breast with ghee sadam, podi mash, charred asparagus and roasted baby carrots.',
      },
      {
        name: 'Madras Lamb Shank',
        price: 36.5,
        veg: false,
        description:
          'Pepper-braised lamb shank with ghee sadam, podi mash, charred asparagus and roasted baby carrots.',
      },
      {
        name: 'Baked Kari Dosa Lasagne',
        price: 22,
        veg: false,
        description:
          'Layers of soft kal dosa, spiced mutton kheema, coconut vegetable sauce and bubbling mozzarella.',
      },
      {
        name: 'Lobster & Shrimp Moilee',
        price: 38.5,
        veg: false,
        description:
          'Lobster tail and jumbo shrimp in a gentle coconut moilee, with ghee sadam, podi mash, charred asparagus and roasted baby carrots.',
      },
      {
        name: 'Fish Pollichathu',
        price: 27.5,
        veg: false,
        description:
          'Whole golden pomfret roasted with South Indian spices, served with ghee sadam, charred asparagus and roasted baby carrots.',
      },
      {
        name: 'Ghee Roast Patta Paneer',
        price: 23,
        veg: true,
        description:
          'Paneer wrapped in banana leaf, roasted with ghee and served with ghee sadam, charred asparagus and roasted baby carrots.',
      },
      {
        name: 'Kalan Mushroom Sambar Risotto',
        price: 22,
        veg: true,
        description:
          'Coimbatore-style mushroom mash over creamy, buttered sambar rice, finished with crunchy corn chips.',
      },
      {
        name: 'Roasted Pineapple Steak',
        price: 23,
        veg: true,
        description:
          'Caramelized pineapple steak with coconut reduction, ghee sadam, charred asparagus and roasted baby carrots.',
      },
    ],
  },

  {
    name: 'Pottalam Club',
    description: 'Celebration rice, layered and loaded.',
    items: [
      {
        name: 'Wedding Mutton Biryani',
        price: 21,
        veg: false,
        description:
          'Celebration-style goat pilaf with brinjal salna, onion raita and a boiled egg.',
      },
      {
        name: 'Ambur Chicken Biryani',
        price: 19,
        veg: false,
        description:
          'Ambur-style chicken and fragrant seeraga samba rice, served with egg, onion raita and brinjal salna.',
      },
      {
        name: 'Madurai Veg Brinji',
        price: 17,
        veg: true,
        description:
          'A fragrant rice pot with mixed vegetables and soya chunks, served with brinjal salna and onion raita.',
      },
    ],
  },

  {
    name: 'Tiffin Tales',
    description: 'Breakfast classics, welcome all day.',
    items: [
      {
        name: 'Medu Vada',
        price: 9,
        veg: true,
        description:
          'Golden lentil doughnuts — crisp outside, fluffy inside — with coconut chutney, tomato chutney and sambar.',
      },
      {
        name: 'Sambar Vada',
        price: 11,
        veg: true,
        description:
          'Crisp vada soaked in warm vegetable sambar and finished with a spoon of ghee.',
      },
      {
        name: 'Steamed Idli',
        price: 9,
        veg: true,
        description:
          'Soft steamed rice-and-lentil cakes with sambar, coconut chutney and tomato chutney.',
      },
      {
        name: 'KGF Thatte Idli',
        price: 11,
        veg: true,
        description:
          'A big, flat Karnataka-style idli with melted ghee and podi, served with chutneys and sambar.',
      },
    ],
  },

  {
    name: 'Dosa District',
    description:
      'Crisp, comforting and made to tear and share. Dosas and uthappams are served with coconut chutney, tomato chutney and vegetable sambar.',
    items: [
      {
        name: 'Masala Dosa',
        price: 15,
        veg: true,
        description:
          'A crisp rice-and-lentil crepe filled with classic spiced potato masala.',
      },
      {
        name: 'Mysore Masala Dosa',
        price: 16.5,
        veg: true,
        description:
          'Our crisp dosa spread with fiery Mysore chutney and filled with potato masala.',
      },
      {
        name: 'Paneer Bhurji Dosa',
        price: 19.5,
        veg: true,
        description:
          'A crisp dosa filled with grated paneer, onion, tomato and chaat masala.',
      },
      {
        name: 'Pepper Chicken Dosa',
        price: 19.5,
        veg: false,
        description: 'A crisp dosa loaded with bold black-pepper chicken.',
      },
      {
        name: 'Onion Uthappam',
        price: 15,
        veg: true,
        description:
          'A thick, fluffy savoury pancake topped with red onion, tomato, green chilli and cilantro.',
      },
      {
        name: 'Madurai Kari Uthappam',
        price: 18,
        veg: false,
        description:
          'A thick uthappam topped with rich, slow-cooked Madurai-style mutton kari.',
      },
    ],
  },

  {
    name: 'Benne Bistro',
    description: 'Bangalore butter dosas with a Madras Social spin.',
    items: [
      {
        name: 'Benne Masala',
        price: 16,
        veg: true,
        description:
          'Bangalore-style thick dosa with potato masala, house podi and a generous gloss of ghee.',
      },
      {
        name: 'Benne Mysore',
        price: 17,
        veg: true,
        description:
          'Thick benne dosa layered with spicy Mysore chutney, potato masala, house podi and ghee.',
      },
      {
        name: 'Paneer Bhurji Benne',
        price: 19,
        veg: true,
        description:
          'Thick benne dosa filled with spiced paneer bhurji, Mysore chutney, house podi and ghee.',
      },
    ],
  },

  {
    name: 'The Curry Club',
    description: 'Southern gravies made for scooping. Served with ghee sadam.',
    items: [
      {
        name: 'Chicken Chettinad',
        price: 22,
        veg: false,
        description:
          'Boneless chicken simmered in a bold Chettinad curry with roasted spices and coconut.',
      },
      {
        name: 'Uthukuli Butter Chicken',
        price: 22,
        veg: false,
        description:
          'Our southern butter chicken — cashew-rich, coconut-creamy and made for scooping.',
      },
      {
        name: 'Guntur Kara Mutton',
        price: 23,
        veg: false,
        description:
          'Slow-braised mutton with fiery Guntur chilli, shallots and garlic.',
      },
      {
        name: 'Malabar Veg Kurma',
        price: 16,
        veg: true,
        description:
          'Mixed vegetables in a creamy coconut-cashew sauce scented with poppy seeds.',
      },
      {
        name: 'Gutti Vankaya Kura',
        price: 17,
        veg: true,
        description:
          'Baby eggplant stuffed with peanut, coconut and chilli, cooked Andhra-style.',
      },
    ],
  },

  {
    name: 'Beyond South',
    description: 'North Indian favourites, our way. Served with ghee rice.',
    items: [
      {
        name: 'Chicken Tikka Masala',
        price: 22,
        veg: false,
        description:
          'Charred chicken tikka folded into a silky tomato-butter masala.',
      },
      {
        name: 'Garlic Lamb Saag',
        price: 22.5,
        veg: false,
        description: 'Slow-braised lamb in a garlicky spinach sauce.',
      },
      {
        name: 'Paneer Tikka Lababdar',
        price: 19,
        veg: true,
        description:
          'Charred paneer in a rich, slightly smoky tomato and cashew gravy.',
      },
      {
        name: 'Masala Chole',
        price: 16,
        veg: true,
        description:
          'Chickpeas simmered with onion, tomato and warming North Indian spices.',
      },
    ],
  },

  {
    name: 'Side-Chicks',
    description: 'The extras that never stay extra.',
    items: [
      {
        name: 'Ghee Sadam',
        price: 7,
        veg: true,
        description: 'Steamed rice glossed with fragrant ghee.',
      },
      {
        name: 'Bisi Bele Bhath',
        price: 11,
        veg: true,
        description:
          'Karnataka-style rice and lentils cooked with vegetables and warm spices.',
      },
      {
        name: 'Garlic Naan',
        price: 5,
        veg: true,
        description: 'Soft flatbread brushed with garlic butter.',
      },
      {
        name: 'Flaky Parotta',
        price: 5,
        veg: true,
        description:
          'Layered South Indian flatbread, crisp at the edges and soft inside.',
      },
      {
        name: 'Onion Raita',
        price: 4,
        veg: true,
        description: 'Cool yogurt with sliced onion and gentle spices.',
      },
      { name: 'Mango Pickle', price: 4, veg: true },
      { name: 'Tapioca Chips', price: 5, veg: true },
    ],
  },

  {
    name: 'Sweet Social',
    description: 'Save room. Seriously.',
    items: [
      {
        name: 'Tirunelveli Halwa',
        price: 11,
        veg: true,
        description: 'Glossy wheat halwa with roasted cashews and rich ghee finish.',
      },
      {
        name: 'Pistachio Semiya Kunafa',
        price: 10,
        veg: true,
        addOn: { name: 'Add ice cream', price: 2 },
        description:
          'Crisp vermicelli, creamy kunafa filling and pistachio sauce in every bite.',
      },
      {
        name: 'Blueberry Bliss',
        price: 12.5,
        veg: true,
        description:
          'Warm blueberries and white-chocolate melt with bright berry compote.',
      },
      {
        name: 'Filter Kaapi Tiramisu',
        price: 8.5,
        veg: true,
        description:
          'Coffee-soaked ladyfingers layered with cream and finished with bold South Indian filter coffee.',
      },
    ],
  },
];

/**
 * FAQs. Answers must be true and must never depend on a PENDING value —
 * hours, phone, ordering and reservation links are not supplied yet, so no
 * FAQ here asserts them. Add those questions back when the values land.
 */
export const FAQS = [
  {
    q: 'Is Madras Social vegetarian?',
    a: 'Not entirely. There is a large vegetarian section on every part of the menu, and the kitchen also cooks chicken, mutton, lamb, pomfret, lobster and shrimp. Vegetarian dishes are marked on the menu.',
  },
  {
    q: 'Does Madras Social have a bar?',
    a: 'Yes. Madras Social is a South Indian kitchen and a bar — a room you book a table in, not a takeout counter.',
  },
  {
    q: 'Where is Madras Social located?',
    a: `Madras Social is at ${FULL_ADDRESS}, in Waterloo Region.`,
  },
  {
    q: 'What kind of food does Madras Social serve?',
    a: 'Kerala and Tamil cooking. Rasam and roots, small plates, dosas and uthappams, Bangalore butter dosas, southern gravies, biryani, and a few North Indian dishes cooked our way.',
  },
  {
    q: 'Which areas does Madras Social serve?',
    a: `${SITE.areaServed.join(', ')}.`,
  },
  {
    q: 'Can I book Madras Social for an event?',
    a: `Yes. Send the details to ${SITE.email} and we will come back to you.`,
  },
];

/** The menus, as schema entities. */
export const MENUS = [
  {
    id: 'main',
    name: 'Madras Social Menu',
    description:
      'The full menu — rasam and roots, small plates, dosas and uthappams, Bangalore butter dosas, southern gravies, biryani, sides and desserts. Vegetarian dishes are marked; the kitchen also serves chicken, mutton, lamb, pomfret, lobster and shrimp.',
    sectioned: true,
  },
];

/** What the restaurant actually sells, as an offer catalogue. */
export const OFFERINGS = [
  ['Dine In', `Table service at ${FULL_ADDRESS}.`],
  ['Bar', 'A full bar alongside the kitchen.'],
  ['Private Events', 'Enquiries by email.'],
];

/** Topics the kitchen is genuinely expert in — entity grounding, not keywords. */
export const KNOWS_ABOUT = [
  'South Indian cuisine',
  'Tamil Nadu cooking',
  'Dosa and uthappam',
  'Bangalore Benne dosa',
  'Chettinad spice blends',
  'Biryani',
  'South Indian filter coffee',
  'Restaurant bar programme',
];

/** LEGACY — Madras Mami brunch video. No Madras Social equivalent supplied;
 *  kept so nothing importing it breaks, but it must not be emitted as schema.
 *  See PENDING.md.
 *  Original note: the real video on the brunch page — public/brunch/hero.mp4 with its poster. */
export const BRUNCH_VIDEO = {
  name: 'Madras Social',
  description:
    'PENDING — no Madras Social video supplied.',
  contentUrl: 'https://www.madrassocial.ca/brunch/hero.mp4',
  thumbnailUrl: 'https://www.madrassocial.ca/brunch/hero-poster.jpg',
  uploadDate: '2026-07-27',
};
