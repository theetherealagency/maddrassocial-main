import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import reservationsBg from '@/assets/reservations-bg-desktop.png';
import reservationsBgMobile from '@/assets/reservations-bg-mobile-v2.webp';

/**
 * Revised 2026-09-23 (round 2) — the embedded widget here was Toast Tables,
 * but the client's own live reservations page (madrassocial.ca/reservations)
 * actually runs on OpenTable, restaurant ref 1557355 ("Madras Social —
 * Waterloo", opentable.com/r/madras-social-waterloo). Toast Tables was
 * never the real booking system; swapped for the real one so a booking made
 * here actually lands in the same place a booking made on the client's own
 * site does.
 *
 * OPENTABLE'S FLOW DOES NOT REFLOW BELOW ~380PX — it overflows sideways
 * instead of shrinking. `OpenTableWidget` below fits it into whatever card
 * width the surrounding artwork gives it (58% of the desktop image, 64% of
 * the mobile one) by laying the iframe out at its natural minimum width and
 * scaling the whole thing down with a measured CSS transform, the same
 * inverse-scale trick the client's own Next.js site uses (its
 * BookingWidget.tsx) — full credit, this is not an original technique.
 *
 * IT NEVER LEAVES A BLANK CARD. The iframe is third-party: an ad blocker,
 * tracking prevention, or a slow network can all stop it loading, and a
 * card that just stays empty forever is worse than useless. After 7 seconds
 * with no load event, the card offers a direct link to book on
 * opentable.com instead.
 */
const OPENTABLE_EMBED_SRC =
  'https://www.opentable.ca/booking/restref/availability?lang=en-CA&restRef=1557355&otSource=Restaurant+website';
const OPENTABLE_DIRECT_LINK = 'https://www.opentable.com/r/madras-social-waterloo';
const MIN_WIDTH = 380;

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
        <p className="font-display text-[clamp(13px,3cqw,20px)] text-[#4a3728]">
          Booking opens in a new window.
        </p>
        <a
          href={OPENTABLE_DIRECT_LINK}
          target="_blank"
          rel="noreferrer"
          className="border border-[#b8902a]/70 px-5 py-2.5 text-[clamp(10px,1.6cqw,13px)] uppercase tracking-[0.15em] font-body text-[#b8902a] transition-colors hover:bg-[#b8902a] hover:text-[#f3e4ce]"
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
        title="Reserve a table on OpenTable"
        className="block border-0"
        onLoad={() => setLoaded(true)}
        style={{ width: size, height: size, transform, transformOrigin: 'top left' }}
      />
      <noscript>
        <a href={OPENTABLE_DIRECT_LINK} target="_blank" rel="noreferrer" className="text-[#4a3728] underline">
          Book on OpenTable
        </a>
      </noscript>
    </div>
  );
};

const Reservations = () => {
  return (
    <div style={{ backgroundColor: '#efe9db', overflowX: 'hidden' }}>
      <HomeNavbar />
      <h1 className="sr-only">Reservations at Madras Social — A South Indian Kitchen and Bar in Waterloo</h1>

      {/* ══ DESKTOP ══ */}
      <div className="hidden md:block" style={{ position: 'relative', width: '100%', paddingTop: '64px' }}>
        <img src={reservationsBg} alt="" style={{ width: '100%', display: 'block' }} />

        <div style={{
          position: 'absolute',
          top: 'calc(64px + 11% * 1.9385)',
          left: '26%', width: '58%',
          height: 'calc(24% * 1.9385)',
          padding: '1.5vw 2vw',
          zIndex: 10,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          overflow: 'auto',
        }}>
          <OpenTableWidget />
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="md:hidden" style={{ position: 'relative', width: '100%', paddingTop: '64px' }}>
        <img
          src={reservationsBgMobile}
          alt=""
          width={1440}
          height={6340}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {/* The widget is taller than the panel it sits in, so the date and
            time controls start below the fold and the guest has to scroll inside
            it. Until the panel is made tall enough to show the whole form, this
            tells them where to look. It sits in the clear strip to the right of
            the character art's hanging fingers (which occupy 36%-42% of the width down to
            103vw), so it costs the widget no height. */}
        <div className="font-body" style={{
          position: 'absolute',
          top: 'calc(64px + 93.5vw)',
          left: '44%', width: '42%',
          zIndex: 11,
          textAlign: 'center',
          fontSize: 'clamp(10px, 3vw, 13px)',
          lineHeight: 1.25,
          color: '#4a3728',
        }}>
          Pick your date &amp; time
          <br />
          Swipe inside the box
          <span aria-hidden="true" style={{ color: '#b8902a', fontWeight: 600 }}> ↓</span>
        </div>

        {/* The booking widget sits inside the blank cream panel painted into the
            artwork above. These offsets are measured off that panel: it starts
            90.6vw down and ends 176.8vw down, spanning 18.7%–88.5% of the width.
            The top is inset past the character art's arm, which overlaps the panel's top-left
            corner. Re-measure these if the artwork is ever replaced. */}
        <div style={{
          position: 'absolute',
          top: 'calc(64px + 102vw)',
          left: '21.5%', width: '64%',
          height: '70vw',
          zIndex: 10,
        }}>
          <OpenTableWidget />
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Reservations;
