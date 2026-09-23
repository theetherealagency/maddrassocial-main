#!/usr/bin/env node
/**
 * Post-build SEO / GEO generator.
 *
 * Vite emits one dist/index.html for the whole SPA, so every route used to
 * serve the same <title> and the same canonical (pointing at the homepage),
 * which told Google to drop every inner page from the index. And because the
 * app is client-rendered, crawlers that do not run JavaScript — GPTBot,
 * PerplexityBot, ClaudeBot and friends — saw an empty <div id="root">.
 *
 * This script fixes both. For every route in seo/routes.mjs it writes a real
 * static HTML file with that route's own head, its own JSON-LD graph, and a
 * crawlable text version of the page inside #root. React replaces that text
 * the moment it mounts, so visitors get the normal app; crawlers and no-JS
 * visitors get the content and the NAP.
 *
 * Run automatically by `npm run build`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE, HOURS_TEXT, FULL_ADDRESS } from '../seo/site.mjs';
import { ROUTES, INDEXABLE } from '../seo/routes.mjs';

/**
 * PENDING guard — mirrors seo/schema.mjs and seo/routes.mjs. Values not yet
 * supplied are the literal string 'PENDING' (see PENDING.md); the meta tag is
 * dropped entirely rather than emitting the word into every page's head.
 */
const isSet = (v) =>
  v != null && v !== 'PENDING' && !(typeof v === 'string' && v.trim() === '');
/** Emit a whole meta line only when the value is real. */
const metaIf = (cond, line) => (cond ? line : '');
import { graphFor } from '../seo/schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SHELL = join(DIST, 'index.html');

const HEAD_START = '<!-- SEO:START -->';
const HEAD_END = '<!-- SEO:END -->';
const CONTENT_START = '<!-- SEO:CONTENT:START -->';
const CONTENT_END = '<!-- SEO:CONTENT:END -->';

const attr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const urlFor = (path) => (path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`);

/** The full managed head block for one route. */
function headFor(route) {
  const url = urlFor(route.path);
  const canonical = route.canonicalTo ? urlFor(route.canonicalTo) : url;
  const robots = route.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const graph = JSON.stringify(graphFor(route), null, 2);

  return `${HEAD_START}
    <title>${attr(route.title)}</title>
    <meta name="description" content="${attr(route.description)}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${attr(canonical)}">
    <meta http-equiv="content-language" content="en-CA">

    <meta property="og:type"         content="${route.path === '/' ? 'restaurant.restaurant' : 'website'}">
    <meta property="og:site_name"    content="${attr(SITE.name)}">
    <meta property="og:url"          content="${attr(canonical)}">
    <meta property="og:locale"       content="en_CA">
    <meta property="og:title"        content="${attr(route.title)}">
    <meta property="og:description"  content="${attr(route.description)}">
    <meta property="og:image"            content="${attr(SITE.ogImage)}">
    <meta property="og:image:secure_url" content="${attr(SITE.ogImage)}">
    <meta property="og:image:type"       content="${SITE.ogImageMeta.type}">
    <meta property="og:image:width"      content="${SITE.ogImageMeta.width}">
    <meta property="og:image:height"     content="${SITE.ogImageMeta.height}">
    <meta property="og:image:alt"        content="A South Indian spread at Madras Social in Waterloo.">
${SITE.sameAs.map((u) => `    <meta property="og:see_also"         content="${attr(u)}">`).join('\n')}

    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:title"       content="${attr(route.title)}">
    <meta name="twitter:description" content="${attr(route.description)}">
    <meta name="twitter:image"       content="${attr(SITE.ogImage)}">
    <meta name="twitter:image:alt"   content="A South Indian spread at Madras Social in Waterloo.">
    <meta name="twitter:label1"      content="Cuisine">
    <meta name="twitter:data1"       content="South Indian kitchen &amp; bar">
    ${metaIf(isSet(HOURS_TEXT), `<meta name="twitter:label2"      content="Open">
    <meta name="twitter:data2"       content="${attr(HOURS_TEXT)}">`)}

    <!-- Open Graph restaurant + place namespace: fills in the business card
         Facebook and other consumers render beside a shared link. -->
    ${metaIf(isSet(SITE.geo.lat) && isSet(SITE.geo.lng), `<meta property="place:location:latitude"           content="${SITE.geo.lat}">
    <meta property="place:location:longitude"          content="${SITE.geo.lng}">`)}
    <meta property="restaurant:menu"                   content="${SITE.origin}/menu">
    <meta property="restaurant:price_range"            content="${attr(SITE.priceRange)}">
    <meta property="restaurant:category"               content="South Indian">
    <meta property="restaurant:contact_info:street_address" content="${attr(SITE.address.street)}">
    <meta property="restaurant:contact_info:locality"       content="${attr(SITE.address.locality)}">
    <meta property="restaurant:contact_info:region"         content="${attr(SITE.address.region)}">
    <meta property="restaurant:contact_info:postal_code"    content="${attr(SITE.address.postalCode)}">
    <meta property="restaurant:contact_info:country_name"   content="Canada">
    ${metaIf(isSet(SITE.phoneDisplay), `<meta property="restaurant:contact_info:phone_number"   content="${attr(SITE.phoneDisplay)}">`)}
    <meta property="restaurant:contact_info:email"          content="${attr(SITE.email)}">
    <meta property="restaurant:contact_info:website"        content="${SITE.origin}/">

    <meta name="geo.region"    content="CA-ON">
    <meta name="geo.placename" content="Waterloo, Ontario, Canada">
    ${metaIf(isSet(SITE.geo.lat) && isSet(SITE.geo.lng), `<meta name="geo.position"  content="${SITE.geo.lat};${SITE.geo.lng}">
    <meta name="ICBM"          content="${SITE.geo.lat}, ${SITE.geo.lng}">`)}
    <meta name="geo.country"   content="CA">
    ${metaIf(isSet(HOURS_TEXT), `<meta name="business:hours" content="${attr(HOURS_TEXT)}">`)}
    <meta name="address"        content="${attr(FULL_ADDRESS)}">

    <link rel="alternate" hreflang="en-ca"    href="${attr(canonical)}">
    <link rel="alternate" hreflang="x-default" href="${attr(canonical)}">

    <link rel="alternate" type="text/plain" href="${SITE.origin}/llms.txt" title="Plain-text summary for AI crawlers">

    <script type="application/ld+json">
${graph}
    </script>
    ${HEAD_END}`;
}

/**
 * Crawlable text for one route, injected inside #root.
 *
 * Lightly styled so that the whole visit for a no-JS client reads as a clean
 * text page rather than raw HTML.
 *
 * HIDDEN IMMEDIATELY FOR EVERYONE ELSE. This used to be visible for "the
 * split second before React mounts" by design — but with GTM, GA4, Meta
 * Pixel and Clarity all loading in <head> ahead of the app bundle, that
 * split second was sometimes a full second or more, and a real visitor
 * would see this plain, unstyled block flash on screen before the actual
 * site appeared (client, 2026-09-23 — "why is there text coming when i
 * load the website"). The inline script right after the div runs
 * synchronously, before the browser paints anything further, and hides it
 * for any client that executes JS at all — which is every real visitor and
 * every crawler that renders the page (Googlebot included). A client that
 * never runs JS never runs this script either, so it still sees the full
 * text, unchanged.
 */
function contentFor(route) {
  return `${CONTENT_START}<div id="seo-static" style="max-width:52rem;margin:0 auto;padding:2rem 1.25rem;font-family:Jost,system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.65;color:#1B3A2D;background:#F2EDE4">
  <h1 style="font-size:1.5rem;line-height:1.3;margin:0 0 1rem">${route.h1}</h1>
  ${route.content.trim()}
</div><script>document.getElementById('seo-static').style.display='none'</script>${CONTENT_END}`;
}

// ---------------------------------------------------------------------------

if (!existsSync(SHELL)) {
  console.error(`[seo] dist/index.html not found — run vite build first.`);
  process.exit(1);
}

const shell = readFileSync(SHELL, 'utf8');

for (const marker of [HEAD_START, HEAD_END, CONTENT_START, CONTENT_END]) {
  if (!shell.includes(marker)) {
    console.error(`[seo] marker ${marker} missing from index.html — cannot generate.`);
    process.exit(1);
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const region = (start, end) =>
  new RegExp(`${escape(start)}[\\s\\S]*?${escape(end)}`);

const headRegion = region(HEAD_START, HEAD_END);
const contentRegion = region(CONTENT_START, CONTENT_END);

let written = 0;
const warnings = [];

for (const route of ROUTES) {
  const html = shell
    .replace(headRegion, () => headFor(route))
    .replace(contentRegion, () => contentFor(route));

  const out =
    route.path === '/' ? SHELL : join(DIST, route.path.replace(/^\//, ''), 'index.html');

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  written += 1;

  // Length guidance: Google truncates around these points.
  if (route.title.length > 62) warnings.push(`${route.path} title is ${route.title.length} chars`);
  if (route.description.length > 158)
    warnings.push(`${route.path} description is ${route.description.length} chars`);

  // Fail loudly on invalid JSON-LD rather than shipping it.
  try {
    JSON.parse(JSON.stringify(graphFor(route)));
  } catch (err) {
    console.error(`[seo] invalid JSON-LD for ${route.path}: ${err.message}`);
    process.exit(1);
  }
}

// --- routing guard --------------------------------------------------------
// vercel.json is read at deploy time, so it cannot be generated here. Warn
// loudly if a route was added to seo/routes.mjs without a matching rewrite,
// which would silently serve that route the homepage head again.
try {
  const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const sources = new Set((vercel.rewrites || []).map((r) => r.source));
  const missing = ROUTES.filter((r) => r.path !== '/' && !sources.has(r.path));
  if (missing.length) {
    console.error(
      `[seo] vercel.json is missing rewrites for: ${missing.map((r) => r.path).join(', ')}`,
    );
    process.exit(1);
  }
} catch (err) {
  console.error(`[seo] could not verify vercel.json rewrites: ${err.message}`);
  process.exit(1);
}

// --- sitemap ---------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE.map(
  (r) => `  <url>
    <loc>${urlFor(r.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority || '0.5'}</priority>
  </url>`,
).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

console.log(`[seo] wrote ${written} route pages + sitemap.xml (${INDEXABLE.length} urls)`);
for (const w of warnings) console.log(`[seo] note: ${w}`);
