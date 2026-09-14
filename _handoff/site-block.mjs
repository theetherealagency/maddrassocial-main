/**
 * Madras Social — SITE block.
 * Drop-in replacement for the SITE / OPENING_HOURS / HOURS_TEXT /
 * FULL_ADDRESS exports at the top of seo/site.mjs.
 *
 * Values marked PENDING are not yet supplied. See PENDING.md handling in the
 * build plan: components read them through a fallback, and schema.mjs must
 * omit the field rather than emit the string.
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

  // Mains run $16–$38.50 with a full bar. Madras Mami was '$$'; this sits
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

  cuisines: ['South Indian', 'Tamil', 'Kerala', 'Indian'],

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

/* ───────────────────────────────────────────────────────────────────────────
   NOTE — the Facebook URL is a numeric profile.php link. It resolves, but a
   vanity URL (facebook.com/madrassocial) is a stronger sameAs signal for
   entity matching. Worth claiming before launch; swap the value if you do.

   NOTE — Madras Mami's SITE carried `containedInPlace: 'Mayfield Plaza'`.
   Dropped here: 8 Erb Street West is a street address, not a plaza unit. Add
   it back only if the unit genuinely sits inside a named complex.
   ─────────────────────────────────────────────────────────────────────────── */
