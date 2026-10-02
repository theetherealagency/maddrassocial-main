import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import { OpenTableWidget, OPENTABLE_DIRECT_LINK } from '@/pages/Reservations';
import ambianceBar from '@/assets/res-v2/ambiance-bar.webp';
import ambianceRoom from '@/assets/res-v2/ambiance-room.webp';
import moilee from '@/assets/res-v2/moilee.webp';
import punugulu from '@/assets/res-v2/punugulu.webp';
import moileeTall from '@/assets/res-v2/moilee-tall.webp';
import chettinad from '@/assets/res-v2/chettinad.webp';
import mangaluru from '@/assets/res-v2/mangaluru.webp';
import ambur from '@/assets/res-v2/ambur.webp';
import kozhiRoast from '@/assets/res-v2/kozhi-roast.webp';
import kunafa from '@/assets/res-v2/kunafa.webp';

/**
 * The /reservations page (live from 2026-10-02) — editorial layout the client asked for,
 * modelled on a product-page reference: ambiance photo up top, then a
 * three-column row with the booking widget as the big middle piece, two
 * food + two drink categories, a loud story block, and a big-wordmark
 * footer. Replaced the artwork-card page in Reservations.tsx, which is kept
 * (and still exports the booking widget) as the rollback.
 *
 * Client rules for this page (2026-10-02): copy must be new — not repeated
 * from elsewhere on the site — and short; never name OpenTable in our own
 * text (the button says "Reserve your table"). The widget's own iframe
 * still carries OpenTable's branding; that is theirs and can't be styled.
 *
 * Photos: bar band cropped from the client's reservation artwork, the room
 * is "ms web banner - interior MOB.png", food and drink are from
 * Downloads/madras social images.
 */

const CARBON = '#1f1b1a';
const LINEN = '#ece4d8';
const TERRACOTTA = '#a83d24';
const OLIVE = '#a59976';

// Section names are the menu's own (src/data/menuBookData.ts).
const CATEGORIES = [
  { kind: 'Food', title: 'Madras Tapas', blurb: 'Small plates. Get a few for the table.', alt: 'Cheesy Chicken Punugulu', src: punugulu },
  { kind: 'Food', title: 'Main Affairs', blurb: 'Bigger plates, meant for sharing.', alt: 'Lobster & Shrimp Moilee', src: moileeTall },
  { kind: 'Drinks', title: 'Signature Cocktails', blurb: 'Every drink is named after a place down south.', alt: 'The Chettinad cocktail', src: chettinad },
  { kind: 'Drinks', title: 'Madras Refreshers', blurb: 'For whoever is driving home.', alt: 'The Mangaluru, served in copper mugs', src: mangaluru },
];

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Madras+Social+8+Erb+Street+West+Waterloo+ON';
const INSTAGRAM_URL = 'https://www.instagram.com/madrassocial/';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61592799734722';

const label = 'font-accent text-[10px] md:text-[11px] uppercase tracking-[0.22em]';
const rule = { borderColor: 'rgba(31,27,26,.18)' };

const Detail = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex gap-2 font-body text-[12.5px] leading-[1.6]">
    <span className="opacity-55 shrink-0">{k}:</span>
    <span>{v}</span>
  </div>
);

const Fold = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={rule}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${label} flex w-full items-center justify-between py-3 text-left`}
        aria-expanded={open}
      >
        {title}
        {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      </button>
      {open && <div className="pb-4 font-body text-[12.5px] leading-[1.6]">{children}</div>}
    </div>
  );
};

const scrollToBooking = () =>
  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

const ReservationsV2 = () => (
  <div style={{ backgroundColor: LINEN, color: CARBON, overflowX: 'hidden' }}>
    <HomeNavbar />
    <h1 className="sr-only">Reservations at Madras Social — A South Indian Kitchen and Bar in Waterloo</h1>

    <main className="pt-16">
      {/* ── 1. Ambiance ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-4 md:pt-6">
        <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[3px]">
          <img
            src={ambianceBar}
            alt="The bar at Madras Social — terracotta pendants, brass and cane screens, the wordmark lit on the back wall"
            className="block w-full h-[42vw] md:h-[28vw] max-h-[400px] min-h-[200px] object-cover"
            loading="eager"
          />
        </div>
      </section>

      {/* ── 2. Booking row: details · widget · aside ─────────────────── */}
      <section className="px-4 md:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1320px] grid gap-8 lg:gap-6 lg:grid-cols-[260px_minmax(0,1fr)_230px]">
          {/* left — `contents` below lg so the widget can slot between
              the heading and the details on a phone */}
          <div className="contents lg:flex lg:flex-col">
            <div className="order-1 lg:order-none">
              <p className={`${label} opacity-60`}>
                <Link to="/" className="hover:opacity-100">Home</Link> / <span className="opacity-100">Reservations</span>
              </p>
              <h2 className="font-display mt-5 text-[44px] md:text-[60px] leading-[0.98]">Take a seat, Waterloo.</h2>
              <p className="font-display italic mt-3 text-[24px] md:text-[28px] leading-[1.15]" style={{ color: TERRACOTTA }}>
                Madras has arrived.
              </p>
            </div>

            <div className="order-3 lg:order-none lg:mt-auto">
              <div className="border-t pt-3" style={rule}>
                <p className={`${label} mb-2`}>The details</p>
                <Detail k="Where" v="8 Erb Street West, Uptown Waterloo" />
                <Detail k="Kitchen" v="South Indian" />
                <Detail k="Bar" v="Full bar" />
              </div>
              <div className="mt-3 border-t" style={rule}>
                <Fold title="Getting here">
                  We're on Erb Street West, in Uptown Waterloo.{' '}
                  <a href={MAPS_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">Open in Maps</a>
                </Fold>
                <Fold title="Questions">
                  Email us at{' '}
                  <a href="mailto:hello@madrassocial.ca" className="underline underline-offset-2">hello@madrassocial.ca</a>
                </Fold>
              </div>
            </div>
          </div>

          {/* middle — the widget */}
          <div
            id="book"
            className="order-2 lg:order-none relative h-[640px] md:h-[680px] overflow-hidden rounded-[3px] border p-2 md:p-3"
            style={{ backgroundColor: '#f6f1e8', borderColor: 'rgba(31,27,26,.12)' }}
          >
            <OpenTableWidget fallbackLabel="Reserve your table" />
          </div>

          {/* right */}
          <div className="order-4 lg:order-none flex flex-col">
            <p className="font-body text-[12.5px] leading-[1.6]">
              Pick a date, a time and how many of you are coming. We'll take care of the rest.
            </p>
            <a
              href={OPENTABLE_DIRECT_LINK}
              target="_blank"
              rel="noreferrer"
              className={`${label} mt-5 block py-3 text-center transition-opacity hover:opacity-90`}
              style={{ backgroundColor: TERRACOTTA, color: LINEN }}
            >
              Reserve your table
            </a>

            <div className="mt-8 lg:mt-auto grid grid-cols-3 gap-2">
              {[
                { src: ambur, alt: 'The Ambur cocktail' },
                { src: kozhiRoast, alt: 'Rum-my Kozhi Roast' },
                { src: kunafa, alt: 'Pistachio Semiya Kunafa' },
              ].map((t) => (
                <img key={t.src} src={t.src} alt={t.alt} className="aspect-square w-full object-cover rounded-[2px]" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Two food, two drinks ──────────────────────────────────── */}
      <section className="px-4 md:px-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="font-display italic mb-5 text-[30px] md:text-[40px] leading-none">What's on the Table</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((c) => (
              <Link key={c.title} to="/menu" className="group block" aria-label={`See ${c.title} on the menu`}>
                <div className="aspect-[3/4] overflow-hidden rounded-[2px]">
                  <img src={c.src} alt={c.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                </div>
                {/* tag above the title on phones, beside it from md up — long titles
                    like "Signature Cocktails" would otherwise squeeze against it */}
                <div className="mt-2 flex flex-col-reverse md:flex-row md:items-baseline md:justify-between gap-0.5 md:gap-2">
                  <span className="font-body font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.08em]">{c.title}</span>
                  <span className={`${label} opacity-55 shrink-0`}>{c.kind}</span>
                </div>
                <p className="font-body text-[12px] opacity-65 mt-0.5">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. The experience — same linen ground as the rest of the page;
          it stands out through scale, not a colour change (client, 2026-10-02). */}
      <section className="px-4 md:px-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1320px] grid gap-8 md:grid-cols-2 md:gap-14 items-center">
          <img
            src={ambianceRoom}
            alt="Inside Madras Social — tables in front of the bar under terracotta pendants"
            className="w-full aspect-[4/5] md:aspect-[4/4.6] object-cover rounded-[3px]"
            loading="lazy"
          />
          <div>
            <p className={label} style={{ color: TERRACOTTA }}>The Madras Social experience</p>
            <h2 className="font-display mt-5 leading-[0.95]" style={{ fontSize: 'clamp(44px, 6vw, 92px)' }}>
              Dinner and drinks,
              <span className="block italic mt-2" style={{ color: TERRACOTTA }}>the Madras way.</span>
            </h2>
            <p className="font-body mt-7 text-[16px] md:text-[18px] leading-[1.6] max-w-[38ch]">
              South Indian food, cocktails named after towns down south, and a room on Erb Street
              that is easy to settle into. Come for dinner and bring whoever you like.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={scrollToBooking}
                className={`${label} px-7 py-3.5 transition-opacity hover:opacity-90`}
                style={{ backgroundColor: TERRACOTTA, color: LINEN }}
              >
                Reserve your table
              </button>
              <Link to="/menu" className={`${label} border-b pb-0.5`} style={{ borderColor: CARBON }}>
                See the menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* ── 5. Footer ─────────────────────────────────────────────────── */}
    <footer style={{ backgroundColor: CARBON, color: LINEN }}>
      <div className="px-4 md:px-8 pt-10 md:pt-14">
        <div className="mx-auto max-w-[1320px]">
          <p
            className="font-display uppercase text-center leading-[0.9] whitespace-nowrap"
            style={{ fontSize: 'clamp(48px, 13.5vw, 196px)', letterSpacing: '-0.01em' }}
            aria-label="Madras Social"
          >
            Madras <span className="normal-case italic" style={{ color: TERRACOTTA }}>Social</span>
          </p>

          <div className="mt-8 md:mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr] pb-10 md:pb-14">
            <div>
              <p className={`${label} opacity-60 mb-3`}>Visit</p>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="font-body text-[13px] leading-[1.7] hover:opacity-80">
                8 Erb Street West<br />Waterloo, ON N2L 1S7
              </a>
            </div>
            <div>
              <p className={`${label} opacity-60 mb-3`}>Contact</p>
              <a href="mailto:hello@madrassocial.ca" className="font-body text-[13px] hover:opacity-80">hello@madrassocial.ca</a>
            </div>
            <div>
              <p className={`${label} opacity-60 mb-3`}>Follow us</p>
              <div className="flex flex-col gap-1 font-body text-[13px]">
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:opacity-80">Instagram</a>
                <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="hover:opacity-80">Facebook</a>
              </div>
            </div>
            <p className="font-display italic text-[28px] md:text-[36px] leading-[1.1] lg:text-right" style={{ color: OLIVE }}>
              See you on Erb Street.
            </p>
          </div>
        </div>
      </div>

      <img
        src={moilee}
        alt="Lobster & Shrimp Moilee at Madras Social"
        className="block w-full h-[56vw] max-h-[420px] object-cover"
        loading="lazy"
      />

      <div className="px-4 md:px-8 py-5">
        <div className="mx-auto max-w-[1320px] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <nav className={`${label} flex flex-wrap gap-x-5 gap-y-1 opacity-75 [&>a]:py-1.5 md:[&>a]:py-0`}>
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/about">About</Link>
            <Link to="/reservations">Reservations</Link>
            <Link to="/careers">Careers</Link>
          </nav>
          <p className="font-body text-[11px] opacity-50">
            Managed by{' '}
            <a href="https://etherealpr.com" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-80">The Ethereal Agency</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default ReservationsV2;
