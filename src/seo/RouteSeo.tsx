import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SITE } from '../../seo/site.mjs';
import { routeFor } from '../../seo/routes.mjs';
import { graphFor } from '../../seo/schema.mjs';

/**
 * Keeps the document head correct across client-side navigation.
 *
 * scripts/build-seo.mjs already writes the right head into each route's static
 * HTML, so a cold load or a crawler gets it without JavaScript. This handles
 * the other half: once React takes over routing, no new document is fetched,
 * so the head has to be updated in place.
 *
 * Must be mounted ABOVE <RouteTracker /> — RouteTracker reads document.title
 * when it pushes the pageview, so the title has to be set first or GA4 records
 * the previous page's title.
 */

const upsertMeta = (selector: string, create: () => HTMLMetaElement, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const byName = (name: string, content: string) =>
  upsertMeta(`meta[name="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('name', name);
    return el;
  }, content);

const byProperty = (property: string, content: string) =>
  upsertMeta(`meta[property="${property}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('property', property);
    return el;
  }, content);

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routeFor(pathname);

    // Unknown path — the SPA renders NotFound, so keep it out of the index
    // instead of leaving the previous route's tags in place.
    if (!route) {
      document.title = 'Page not found | Madras Mami';
      byName('robots', 'noindex, follow');
      return;
    }

    const url =
      route.path === '/' ? `${SITE.origin}/` : `${SITE.origin}${route.path}`;
    const canonical = route.canonicalTo
      ? `${SITE.origin}${route.canonicalTo}`
      : url;

    document.title = route.title;
    byName('description', route.description);
    byName(
      'robots',
      route.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    byProperty('og:title', route.title);
    byProperty('og:description', route.description);
    byProperty('og:url', canonical);
    byName('twitter:title', route.title);
    byName('twitter:description', route.description);

    // Swap the structured data for this route's graph. Tagged with a data
    // attribute so we only ever replace our own block.
    const existing = document.head.querySelector('script[data-route-schema]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-route-schema', '');
    script.textContent = JSON.stringify(graphFor(route));
    document.head.appendChild(script);
  }, [pathname]);

  return null;
};

export default RouteSeo;
