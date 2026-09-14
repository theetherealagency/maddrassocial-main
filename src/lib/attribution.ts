/**
 * First-touch attribution, captured once per session.
 *
 * Why first-touch and not last: someone finds the site via a Google Ad, leaves,
 * comes back later by typing the URL, and only then submits. Reading the
 * referrer at submit time would credit that lead to "direct" and lose the ad
 * entirely. So the source is captured on the first page of the session and held
 * for its duration.
 *
 * sessionStorage (not localStorage) is deliberate: a visit next week is a new
 * source worth recording, not a stale one worth preserving.
 *
 * Organic search keywords are NOT here and cannot be — Google encrypts them.
 * gclid is the exception: it maps back to the exact paid keyword in Google Ads.
 */

const KEY = 'mm_attribution';

export interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;        // Google Ads click -> exact paid keyword
  fbclid: string | null;       // Meta ads click
  referrer: string | null;
  landing_page: string | null;
  first_seen: string | null;
}

const EMPTY: Attribution = {
  utm_source: null, utm_medium: null, utm_campaign: null,
  utm_content: null, utm_term: null, gclid: null, fbclid: null,
  referrer: null, landing_page: null, first_seen: null,
};

/**
 * Classify untagged traffic so it does not all collapse into "direct".
 * Only used when no utm_source is present.
 */
const inferSource = (referrer: string): { source: string; medium: string } => {
  if (!referrer) return { source: 'direct', medium: 'none' };
  let host = '';
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return { source: 'direct', medium: 'none' };
  }
  if (host.endsWith('madrassocial.ca')) return { source: 'internal', medium: 'internal' };
  if (/google\./.test(host))    return { source: 'google',    medium: 'organic' };
  if (/bing\./.test(host))      return { source: 'bing',      medium: 'organic' };
  if (/duckduckgo\./.test(host))return { source: 'duckduckgo',medium: 'organic' };
  if (/instagram\./.test(host)) return { source: 'instagram', medium: 'social' };
  if (/facebook\.|fb\./.test(host)) return { source: 'facebook', medium: 'social' };
  if (/t\.co|twitter\.|x\.com/.test(host)) return { source: 'twitter', medium: 'social' };
  if (/tiktok\./.test(host))    return { source: 'tiktok',    medium: 'social' };
  if (/yelp\./.test(host))      return { source: 'yelp',      medium: 'referral' };
  if (/zomato\./.test(host))    return { source: 'zomato',    medium: 'referral' };
  if (/toasttab\./.test(host))  return { source: 'toast',     medium: 'referral' };
  return { source: host, medium: 'referral' };
};

/** Capture on the first page of the session; later calls are no-ops. */
export const captureAttribution = (): Attribution => {
  if (typeof window === 'undefined') return EMPTY;

  const stored = sessionStorage.getItem(KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      /* corrupt value — fall through and re-capture */
    }
  }

  const q = new URLSearchParams(window.location.search);
  const get = (k: string) => q.get(k) || null;
  const referrer = document.referrer || '';
  const inferred = inferSource(referrer);

  const attr: Attribution = {
    utm_source:   get('utm_source')   ?? inferred.source,
    utm_medium:   get('utm_medium')   ?? inferred.medium,
    utm_campaign: get('utm_campaign'),
    utm_content:  get('utm_content'),
    utm_term:     get('utm_term'),
    gclid:        get('gclid'),
    fbclid:       get('fbclid'),
    referrer:     referrer || null,
    landing_page: window.location.pathname + window.location.search,
    first_seen:   new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    /* private browsing — attribution stays in-memory for this page only */
  }
  return attr;
};

export const getAttribution = (): Attribution =>
  typeof window === 'undefined' ? EMPTY : captureAttribution();
