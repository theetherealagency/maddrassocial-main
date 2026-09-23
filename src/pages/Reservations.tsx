import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import reservationsBgDesk from '@/assets/reservations-bg-desk.webp';
import reservationsBgMob from '@/assets/reservations-bg-mob-v2.webp';

/**
 * Rebuilt 2026-09-23 (round 3) to match the client's real live reservations
 * page pixel-for-pixel — pulled directly from the Next.js site's own source
 * (~/madras-social/main-source/src/app/reservations/page.tsx and
 * src/lib/content.ts), not scraped, since the client offered the repo.
 *
 * The previous version of this page used an old artwork (a dining-room photo
 * with "Your Table is Waiting" baked into the image itself) that didn't match
 * what's actually live. The real page's artwork — bar interior torn into a
 * terracotta ground with a gold tray and a blank cream card — is real, and
 * the headline/standfirst are NOT baked into the picture: they're overlaid
 * text, positioned in the calm band between the lit sign and the tray, so
 * copy is a two-line change here rather than a re-export of the artwork.
 *
 * Measurements (card position, hero band, the OpenTable ref) are copied
 * exactly from content.ts's `reservations.art` and `reservations.booking` —
 * see the inline comments there for why each number is what it is. The
 * desktop artwork is portrait (1366×2021) and 110 of its top rows are dead
 * ceiling above the lit sign, which pushes the booking card below the fold
 * on a normal window — real site's fix (`-mt-[8.05vw]`, 110/1366) is
 * reproduced here too.
 */
const HEADING = 'Take a seat, Waterloo. Madras has arrived.';
const STANDFIRST = 'Kerala spice, Tamil comfort, and a table that keeps the evening going.';

const ART = {
  desktop: {
    src: reservationsBgDesk,
    card: { left: (413 / 1366) * 100, top: (778 / 2021) * 100, width: (541 / 1366) * 100, height: (714 / 2021) * 100 },
    hero: { top: (330 / 2021) * 100, height: (310 / 2021) * 100 },
  },
  mobile: {
    src: reservationsBgMob,
    card: { left: (248 / 1366) * 100, top: (1150 / 2813) * 100, width: (877 / 1366) * 100, height: (1165 / 2813) * 100 },
    hero: { top: (300 / 2813) * 100, height: (430 / 2813) * 100 },
  },
};

const OPENTABLE_EMBED_SRC =
  'https://www.opentable.ca/booking/restref/availability?lang=en-CA&restRef=1557355&otSource=Restaurant+website';
const OPENTABLE_DIRECT_LINK = 'https://www.opentable.com/r/madras-social-waterloo';
const MIN_WIDTH = 380;

/**
 * OpenTable's flow does not reflow below ~380px CSS — it overflows sideways
 * instead of shrinking. Fitted to the card by laying the iframe out at its
 * natural minimum width and scaling the whole thing down with a measured
 * transform (the real site's own BookingWidget.tsx technique). After 7
 * seconds with no load event, offers a direct link instead of a blank card.
 */
const OpenTableWidget = () => {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.min(1, w / MIN_WIDTH));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setTimedOut(true), 7000);
    return () => clearTimeout(t);
  }, [loaded]);

  if (timedOut && !loaded) {
    return (
      <div ref={box} className="flex h-full w-full flex-col items-center justify-center gap-3 px-[8%] text-center">
        <p className="font-display text-[clamp(13px,3cqw,20px)] text-[hsl(var(--color-brown))]">
          Booking opens in a new window.
        </p>
        <a
          href={OPENTABLE_DIRECT_LINK}
          target="_blank"
          rel="noreferrer"
          className="border border-[hsl(var(--color-gold))]/70 px-5 py-2.5 text-[clamp(10px,1.6cqw,13px)] uppercase tracking-[0.15em] font-body text-[hsl(var(--color-gold))] transition-colors hover:bg-[hsl(var(--color-gold))] hover:text-[hsl(var(--color-cream))]"
        >
          Book on OpenTable
        </a>
      </div>
    );
  }

  const size = scale === null ? '100%' : `${100 / scale}%`;
  const transform = scale === null ? 'scale(1)' : `scale(${scale})`;

  return (
    <div ref={box} className="h-full w-full overflow-hidden" style={{ containerType: 'inline-size' }}>
      <iframe
        src={OPENTABLE_EMBED_SRC}
        title="Book a table at Madras Social"
        className="block border-0"
        onLoad={() => setLoaded(true)}
        style={{ width: size, height: size, transform, transformOrigin: 'top left' }}
      />
      <noscript>
        <a href={OPENTABLE_DIRECT_LINK} target="_blank" rel="noreferrer" className="text-[hsl(var(--color-brown))] underline">
          Book on OpenTable
        </a>
      </noscript>
    </div>
  );
};

const Reservations = () => {
  return (
    <div style={{ backgroundColor: '#1f1b1a', overflowX: 'hidden' }}>
      <HomeNavbar />
      <h1 className="sr-only">Reservations at Madras Social — A South Indian Kitchen and Bar in Waterloo</h1>

      <main className="relative pt-16">
        {/* Carbon behind the artwork's own torn/transparent edges — same
            reasoning as the real page: the cut only reads as a cut against
            something darker than the terracotta ground it's cut out of. */}
        <section className="relative pb-5 md:pb-7" style={{ backgroundColor: '#1f1b1a' }}>
          <div className="relative w-full overflow-hidden">
            {/* 110/1366 = 8.05vw of dead ceiling above the lit sign, trimmed
                on desktop only — without this the card sits below the fold
                on a normal window. */}
            <div className="relative md:-mt-[8.05vw]">
              <img
                src={ART.desktop.src}
                alt="The Madras Social room — terracotta pendants over the bar, the wordmark lit on the back wall — above a gold tray holding a blank card, on a terracotta ground drawn with the Chennai skyline"
                className="hidden md:block h-auto w-full"
                loading="eager"
              />
              <img
                src={ART.mobile.src}
                alt="The Madras Social room — terracotta pendants over the bar, the wordmark lit on the back wall — above a gold tray holding a blank card, on a terracotta ground drawn with the Chennai skyline"
                className="block md:hidden h-auto w-full"
                loading="eager"
              />

              {/* ---- hero: desktop ---- */}
              <div
                className="hidden md:flex absolute inset-x-0 flex-col items-center justify-center px-[6%] text-center"
                style={{ top: `${ART.desktop.hero.top}%`, height: `${ART.desktop.hero.height}%`, containerType: 'inline-size' }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-[8%] -inset-y-[32%]"
                  style={{ background: 'radial-gradient(ellipse 60% 42% at 50% 50%, rgba(23,20,19,.95) 0%, rgba(23,20,19,.9) 40%, rgba(23,20,19,.62) 66%, rgba(23,20,19,.22) 85%, rgba(23,20,19,0) 100%)' }}
                />
                <h2
                  className="font-display relative m-0 text-[hsl(var(--color-cream))]"
                  style={{ fontSize: 'clamp(1.3rem, 4.4cqw, 3.2rem)', textShadow: '0 2px 22px rgba(23,20,19,.9)' }}
                >
                  {HEADING}
                </h2>
                <p
                  className="font-body relative m-0 mt-[1.4%] max-w-[46ch] text-[hsl(var(--color-cream))]/90"
                  style={{ fontSize: 'clamp(0.85rem, 1.6cqw, 1.2rem)', lineHeight: 1.45, textShadow: '0 2px 16px rgba(23,20,19,.9)' }}
                >
                  {STANDFIRST}
                </p>
              </div>

              {/* ---- hero: mobile ---- */}
              <div
                className="flex md:hidden absolute inset-x-0 flex-col items-center justify-center px-[6%] text-center"
                style={{ top: `${ART.mobile.hero.top}%`, height: `${ART.mobile.hero.height}%`, containerType: 'inline-size' }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-[8%] -inset-y-[32%]"
                  style={{ background: 'radial-gradient(ellipse 60% 42% at 50% 50%, rgba(23,20,19,.95) 0%, rgba(23,20,19,.9) 40%, rgba(23,20,19,.62) 66%, rgba(23,20,19,.22) 85%, rgba(23,20,19,0) 100%)' }}
                />
                <h2
                  className="font-display relative m-0 text-[hsl(var(--color-cream))]"
                  style={{ fontSize: 'clamp(1.05rem, 6.2cqw, 1.9rem)', textShadow: '0 2px 22px rgba(23,20,19,.9)' }}
                >
                  {HEADING}
                </h2>
                <p
                  className="font-body relative m-0 mt-[1.4%] max-w-[46ch] text-[hsl(var(--color-cream))]/90"
                  style={{ fontSize: 'clamp(0.74rem, 3.4cqw, 1rem)', lineHeight: 1.45, textShadow: '0 2px 16px rgba(23,20,19,.9)', textWrap: 'balance' as const }}
                >
                  {STANDFIRST}
                </p>
              </div>

              {/* ---- the card: desktop ---- nothing else goes on it. */}
              <div
                className="hidden md:block absolute"
                style={{
                  left: `${ART.desktop.card.left}%`, top: `${ART.desktop.card.top}%`,
                  width: `${ART.desktop.card.width}%`, height: `${ART.desktop.card.height}%`,
                  padding: '14px',
                }}
              >
                <OpenTableWidget />
              </div>

              {/* ---- the card: mobile ---- */}
              <div
                className="block md:hidden absolute"
                style={{
                  left: `${ART.mobile.card.left}%`, top: `${ART.mobile.card.top}%`,
                  width: `${ART.mobile.card.width}%`, height: `${ART.mobile.card.height}%`,
                  padding: '8px',
                }}
              >
                <OpenTableWidget />
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Reservations;
