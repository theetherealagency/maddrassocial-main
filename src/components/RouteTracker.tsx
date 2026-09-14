import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview, initAttribution } from '@/lib/analytics';

/**
 * Pushes a virtual_pageview on every client-side route change, including the
 * first render. Must sit inside <BrowserRouter>.
 *
 * document.title is read in an effect so it reflects whatever the routed page
 * set, not the previous route's title.
 */
const RouteTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Must run before the first pageview so the landing page is recorded
    // as the entry point rather than whatever route comes later.
    initAttribution();
    trackPageview(pathname + search, document.title);
  }, [pathname, search]);

  return null;
};

export default RouteTracker;
