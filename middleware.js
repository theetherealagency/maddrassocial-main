// Routing Middleware: one Vercel project serves all three Madras Social hosts.
//
//   www.madrassocial.ca / madrassocial.ca  -> the Vite app in src/ (passes through)
//   hiring.madrassocial.ca                 -> hiring/  (copied to dist/_sites/hiring)
//   rsvp.madrassocial.ca                   -> rsvp/    (copied to dist/_sites/rsvp)
//
// Middleware runs before the filesystem, which is why this can't be done with
// vercel.json rewrites: those only apply after a file match, so "/" on the
// hiring host would serve the main site's index.html.
//
// The hiring rules copy what its old standalone vercel.json did: cleanUrls,
// no trailing slash, "/" shows the careers page, a week of cache on /assets.
import { next, rewrite } from '@vercel/functions';

const SITES = {
  'hiring.madrassocial.ca': 'hiring',
  'rsvp.madrassocial.ca': 'rsvp',
};

const PREFIX = '/_sites';

export function route(hostname, pathname) {
  const site = SITES[hostname];

  if (!site) {
    // Main site: keep the copied subsites from showing up under www.
    if (pathname === PREFIX || pathname.startsWith(PREFIX + '/')) return { status: 404 };
    return { next: true };
  }

  if (site === 'hiring') {
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return { redirect: pathname.replace(/\/+$/, '') || '/' };
    }
    if (pathname.endsWith('.html')) {
      const clean = pathname.slice(0, -'.html'.length);
      return { redirect: clean === '/index' || clean === '/careers' ? '/' : clean };
    }
    let file = pathname;
    if (pathname === '/' || pathname === '/careers') file = '/careers.html';
    else if (!/\.[^/]+$/.test(pathname)) file = pathname + '.html';
    const cache = pathname.startsWith('/assets/')
      ? { 'Cache-Control': 'public, max-age=604800' }
      : undefined;
    return { rewrite: `${PREFIX}/hiring${file}`, headers: cache };
  }

  // rsvp: plain static site, no clean URLs.
  const file = pathname === '/' ? '/index.html' : pathname;
  return { rewrite: `${PREFIX}/rsvp${file}` };
}

export default function middleware(request) {
  const url = new URL(request.url);
  let hostname = url.hostname;

  // Lets a preview deployment be checked as a subdomain before the domain moves.
  const override = request.headers.get('x-ms-site');
  if (override && process.env.VERCEL_ENV !== 'production') {
    hostname = `${override}.madrassocial.ca`;
  }

  const r = route(hostname, url.pathname);
  if (r.next) return next();
  if (r.status) return new Response('Not found', { status: r.status });
  if (r.redirect) {
    return new Response(null, {
      status: 308,
      headers: { Location: r.redirect + url.search },
    });
  }
  return rewrite(new URL(r.rewrite + url.search, url), r.headers ? { headers: r.headers } : undefined);
}
