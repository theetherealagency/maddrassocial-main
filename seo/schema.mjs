import {
  SITE, OPENING_HOURS, MENU_SECTIONS, FAQS,
  MENUS, OFFERINGS, KNOWS_ABOUT, BRUNCH_VIDEO,
} from './site.mjs';

const O = SITE.origin;
const ID = {
  restaurant: `${O}/#restaurant`,
  website: `${O}/#website`,
  org: `${O}/#organization`,
  menu: `${O}/menu#menu`,
  menuJain: `${O}/menu#menu-jain`,
  menuTasting: `${O}/menu#menu-tasting`,
  ogImage: `${O}/#primaryimage`,
  logo: `${O}/#logo`,
  place: `${O}/#place`,
  giftCard: `${O}/gift-cards#giftcard`,
  video: `${O}/brunch-tasting#video`,
};

/** Build stamp, so every page carries a freshness signal. */
const MODIFIED = new Date().toISOString().slice(0, 10);

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
};

const openingHours = OPENING_HOURS.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
  opens: h.opens,
  closes: h.closes,
}));

const amenities = [
  '100% Pure Vegetarian',
  'Cooked with Pure Desi Ghee',
  'Authentic Heritage Recipes',
  'Dine In',
  'Takeout',
  'Delivery',
  'Catering Available',
  'Live Dosa Counter',
  'Private Events',
  'Wedding Catering',
  'Jain Menu Available',
  'Family Friendly',
  'Wheelchair Accessible Entrance',
].map((name) => ({
  '@type': 'LocationFeatureSpecification',
  name,
  value: true,
}));

/**
 * The share image and the logo as real ImageObjects rather than bare URLs, so
 * their dimensions and captions are declared. Both files were 404 until
 * 2026-09-04, which meant no social preview and no usable schema image.
 */
export const imageNodes = () => [
  {
    '@type': 'ImageObject',
    '@id': ID.ogImage,
    url: SITE.ogImage,
    contentUrl: SITE.ogImage,
    width: SITE.ogImageMeta.width,
    height: SITE.ogImageMeta.height,
    encodingFormat: SITE.ogImageMeta.type,
    caption:
      'A South Indian spread at Madras Mami in Brampton — ghee roast dosa, medhu vada, idli, chutneys and Madras filter coffee in brass.',
    representativeOfPage: true,
  },
  {
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: SITE.logo,
    contentUrl: SITE.logo,
    width: SITE.logoMeta.width,
    height: SITE.logoMeta.height,
    encodingFormat: SITE.logoMeta.type,
    caption: 'Madras Mami',
  },
];

/** The plaza the unit sits in — helps disambiguate the address locally. */
export const placeNode = () => ({
  '@type': 'Place',
  '@id': ID.place,
  name: SITE.containedInPlace,
  address: postalAddress,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.lat,
    longitude: SITE.geo.lng,
  },
});

/** The business itself — the anchor every other node points at. */
export const restaurantNode = () => ({
  '@type': 'Restaurant',
  '@id': ID.restaurant,
  name: SITE.name,
  alternateName: 'Madras Mami Brampton',
  description:
    'Authentic South Indian restaurant in Brampton, Ontario — 100% pure vegetarian, every dish cooked with pure desi ghee. Heritage dosas, idli, vada, uthappam, Bangalore Benne dosas, thali, filter coffee and catering, drawn from Tamil Nadu, Kerala, Andhra Pradesh, Karnataka and Telangana.',
  url: `${O}/`,
  image: { '@id': ID.ogImage },
  logo: { '@id': ID.logo },
  photo: { '@id': ID.ogImage },
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: SITE.priceRange,
  currenciesAccepted: SITE.currency,
  paymentAccepted: 'Cash, Credit Card, Debit Card',
  servesCuisine: SITE.cuisines,
  address: postalAddress,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.lat,
    longitude: SITE.geo.lng,
  },
  hasMap: SITE.map,
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Google Knowledge Graph MID',
    value: SITE.kgmid,
  },
  areaServed: SITE.areaServed.map((n) => ({ '@type': 'City', name: n })),
  openingHoursSpecification: openingHours,
  acceptsReservations: SITE.reserveUrl,
  hasMenu: [
    { '@id': ID.menu },
    { '@id': ID.menuJain },
    { '@id': ID.menuTasting },
  ],
  menu: `${O}/menu`,
  containedInPlace: { '@id': ID.place },
  knowsAbout: KNOWS_ABOUT,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'What Madras Mami offers',
    itemListElement: OFFERINGS.map(([name, description]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description },
      priceCurrency: SITE.currency,
      availability: 'https://schema.org/InStock',
      areaServed: SITE.areaServed.map((n) => ({ '@type': 'City', name: n })),
    })),
  },
  smokingAllowed: false,
  publicAccess: true,
  isAccessibleForFree: false,
  keywords:
    'south indian restaurant brampton, pure vegetarian restaurant brampton, dosa brampton, idli brampton, filter coffee brampton, south indian catering brampton',
  amenityFeature: amenities,
  sameAs: SITE.sameAs,
  parentOrganization: { '@id': ID.org },
  potentialAction: [
    {
      '@type': 'OrderAction',
      name: 'Order South Indian food online from Madras Mami',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE.orderUrl,
        inLanguage: 'en-CA',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: [
        'https://schema.org/OnSitePickup',
        'https://schema.org/ParcelService',
      ],
    },
    {
      '@type': 'ReserveAction',
      name: 'Book a table at Madras Mami',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE.reserveUrl,
        inLanguage: 'en-CA',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'FoodEstablishmentReservation', name: 'Table reservation' },
    },
  ],
});

export const organizationNode = () => ({
  '@type': 'Organization',
  '@id': ID.org,
  name: SITE.legalName,
  url: `${O}/`,
  logo: { '@id': ID.logo },
  image: { '@id': ID.ogImage },
  email: SITE.email,
  telephone: SITE.phone,
  address: postalAddress,
  sameAs: SITE.sameAs,
  knowsAbout: KNOWS_ABOUT,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'reservations',
      areaServed: 'CA',
      availableLanguage: ['English', 'Tamil', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'catering',
      areaServed: 'CA',
      availableLanguage: ['English', 'Tamil', 'Hindi'],
    },
  ],
});

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  name: SITE.name,
  url: `${O}/`,
  inLanguage: 'en-CA',
  description:
    'Authentic South Indian restaurant in Brampton — 100% pure vegetarian, cooked in pure desi ghee.',
  publisher: { '@id': ID.org },
  about: { '@id': ID.restaurant },
});

export const menuNodes = () => {
  const byId = { main: ID.menu, jain: ID.menuJain, tasting: ID.menuTasting };
  return MENUS.map((m) => ({
    '@type': 'Menu',
    '@id': byId[m.id],
    name: m.name,
    url: `${O}/menu`,
    inLanguage: 'en-CA',
    description: m.description,
    mainEntityOfPage: `${O}/menu`,
    ...(m.sectioned
      ? {
          hasMenuSection: MENU_SECTIONS.map((sec) => ({
            '@type': 'MenuSection',
            name: sec.name,
            ...(sec.description ? { description: sec.description } : {}),
            hasMenuItem: sec.items.map((item) => ({
              '@type': 'MenuItem',
              name: item,
              suitableForDiet: 'https://schema.org/VegetarianDiet',
            })),
          })),
        }
      : {}),
  }));
};

/** The gift card as a real purchasable product. */
export const giftCardNode = () => ({
  '@type': 'Product',
  '@id': ID.giftCard,
  name: 'Madras Mami Gift Card',
  description:
    'A Madras Mami gift card, redeemable in the restaurant at 6261 Mayfield Rd, Unit 145, Brampton — for family who miss the food they grew up with, and friends who moved away.',
  category: 'Gift Card',
  image: { '@id': ID.ogImage },
  brand: { '@id': ID.org },
  url: `${O}/gift-cards`,
  offers: {
    '@type': 'Offer',
    url: `${O}/gift-cards`,
    priceCurrency: SITE.currency,
    availability: 'https://schema.org/InStock',
    seller: { '@id': ID.restaurant },
    areaServed: SITE.areaServed.map((n) => ({ '@type': 'City', name: n })),
  },
});

/** The brunch hero video that actually ships at public/brunch/hero.mp4. */
export const videoNode = () => ({
  '@type': 'VideoObject',
  '@id': ID.video,
  name: BRUNCH_VIDEO.name,
  description: BRUNCH_VIDEO.description,
  contentUrl: BRUNCH_VIDEO.contentUrl,
  thumbnailUrl: BRUNCH_VIDEO.thumbnailUrl,
  uploadDate: BRUNCH_VIDEO.uploadDate,
  inLanguage: 'en-CA',
  publisher: { '@id': ID.org },
  isFamilyFriendly: true,
});

export const faqNode = (url) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const cateringNode = () => ({
  '@type': 'Service',
  '@id': `${O}/catering#service`,
  name: 'South Indian Catering — Madras Mami',
  serviceType: 'South Indian catering',
  description:
    'Pure vegetarian South Indian catering for weddings, receptions, birthdays, baby showers, kitty parties and corporate events across the Greater Toronto Area.',
  provider: { '@id': ID.restaurant },
  areaServed: SITE.areaServed.map((n) => ({ '@type': 'City', name: n })),
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: `${O}/catering`,
    servicePhone: SITE.phone,
    serviceLocation: { '@id': ID.restaurant },
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Madras Mami catering packages',
    itemListElement: [
      ['Live Dosa Counter', 'Dosas hand-rolled to order in front of your guests.'],
      ['Wedding and Reception Catering', 'A full South Indian spread built around your guest count.'],
      ['Private Events and House Parties', 'Birthdays, baby showers, kitty parties and corporate lunches.'],
      ['Curated Packages', 'Tiffin menus, thali spreads, chaat counters and dessert stations.'],
    ].map(([name, description]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description },
      priceCurrency: SITE.currency,
      availability: 'https://schema.org/InStock',
    })),
  },
});

const breadcrumbFor = (route, url) => {
  const trail = [{ name: 'Home', item: `${O}/` }];
  if (route.path !== '/') {
    trail.push({ name: route.breadcrumb || route.h1?.split('—')[0].trim() || route.title, item: url });
  }
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.item,
    })),
  };
};

const webPageNode = (route, url, type) => ({
  '@type': type,
  '@id': `${url}#webpage`,
  url,
  name: route.title,
  description: route.description,
  inLanguage: 'en-CA',
  isPartOf: { '@id': ID.website },
  about: { '@id': ID.restaurant },
  primaryImageOfPage: { '@id': ID.ogImage },
  datePublished: '2026-05-25',
  dateModified: MODIFIED,
  isFamilyFriendly: true,
  ...(route.path === '/menu' ? { mainEntity: { '@id': ID.menu } } : {}),
});

/**
 * Build the @graph for one route. Every page carries the WebPage + Restaurant
 * anchor so an engine landing on any single URL can resolve the business.
 */
export const graphFor = (route) => {
  const url = route.path === '/' ? `${O}/` : `${O}${route.path}`;
  const want = new Set(route.schema || []);

  const pageType = want.has('contactpage')
    ? 'ContactPage'
    : want.has('aboutpage')
      ? 'AboutPage'
      : 'WebPage';

  const graph = [webPageNode(route, url, pageType), ...imageNodes()];

  if (want.has('restaurant')) graph.push(restaurantNode(), placeNode());
  if (want.has('organization')) graph.push(organizationNode());
  if (want.has('website')) graph.push(websiteNode());
  if (want.has('menu')) graph.push(...menuNodes());
  if (want.has('faq')) graph.push(faqNode(url));
  if (want.has('catering')) graph.push(cateringNode());
  if (want.has('giftcard')) graph.push(giftCardNode());
  if (want.has('video')) graph.push(videoNode());
  if (want.has('breadcrumb')) graph.push(breadcrumbFor(route, url));

  // Pages that carry the restaurant node but not the website/org node still
  // need those resolvable, so include the light versions once.
  if (want.has('restaurant') && !want.has('website')) graph.push(websiteNode());
  if (want.has('restaurant') && !want.has('organization')) graph.push(organizationNode());

  return { '@context': 'https://schema.org', '@graph': graph };
};
