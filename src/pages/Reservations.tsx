import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import reservationsBg from '@/assets/reservations-bg-desktop.png';
import reservationsBgMobile from '@/assets/reservations-bg-mobile-v2.webp';

/**
 * Cleaned up 2026-09-23 — this file carried a whole second, unreachable
 * reservation flow (a name/email/phone form, a Supabase insert, and on
 * success a `window.location.href` redirect + a "Continue to Booking"
 * link out to tables.toasttab.com) left over from an earlier version.
 * Nothing in the actual JSX below ever rendered that form or called its
 * submit handler, so it never ran for a real visitor — but it was the
 * kind of leftover that reads as "this page tries to send you somewhere
 * else," which is exactly what the client flagged: "not opening on a
 * different landing page... has to be in the same website." Removed
 * entirely. The Toast Tables widget below is a normal embedded iframe,
 * the same pattern as an OpenTable widget — it stays in the page, on
 * this site, with this site's own header and footer.
 */
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
          <iframe src="https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime" style={{ width: "100%", height: "500px", border: "none" }} title="Reserve a Table" />
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
        {/* The Toast widget is taller than the panel it sits in, so the date and
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
          <iframe src="https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime" style={{ width: '100%', height: '100%', border: 'none' }} title="Reserve a Table" />
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Reservations;
