import { useState } from 'react';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import MandalaBackground from '@/components/MandalaBackground';
import EventsBanner from '@/components/events/EventsBanner';
import ScallopDivider from '@/components/homepage/ScallopDivider';
import EventGallery from '@/components/events/EventGallery';
import EventModal from '@/components/events/EventModal';
import type { EventPanel } from '@/components/events/types';
import { eventTypes } from '@/components/events/eventForms';
import weddingsImage from '@/assets/event-private-events.jpg';
import kittyPartyImage from '@/assets/event-kitty-parties.jpg';
import corporateImage from '@/assets/event-corporate-events.jpg';
import festivalsImage from '@/assets/event-catering.jpg';
import menuSecBg from '@/assets/menu-sec-bg.png';
import mamiCharacter from '@/assets/mami-character-thali.png';

/* Catering landing page — banner, then the four kinds of catering as expandable
   panels, each opening its enquiry modal. */

const cream = 'hsl(var(--color-cream))';
const green = 'hsl(var(--color-green))';
/* Scallop fill must match the neighbouring section; SVG presentation attributes
   cannot resolve var(), so --color-cream is inlined as hex. */
const CREAM_HEX = '#F0ECE6';

/* Brand photography, one per gathering. */
const eventImages: Record<string, string> = {
  weddings: weddingsImage,
  'kitty-parties': kittyPartyImage,
  corporate: corporateImage,
  festivals: festivalsImage,
};

const panels: EventPanel[] = eventTypes.map((type) => ({
  ...type,
  image: eventImages[type.def.id],
}));

const Events = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: cream }}>
      <Header />

      {/* ---------------- 1. Opening banner ---------------- */}
      <section className="pt-16">
        <h1 className="sr-only">
          Madras Mami Catering — 100% pure vegetarian South Indian catering for weddings,
          kitty parties, corporate lunches, festivals and poojas in Brampton and the GTA
        </h1>

        <EventsBanner />
      </section>

      {/* ---------------- 2. The four gatherings ---------------- */}
      {/* Scalloped cream edges on green, matching the homepage's menu section. */}
      <section id="events" className="relative scroll-mt-20">
        <div className="bg-green-brand leading-[0]">
          <ScallopDivider color={CREAM_HEX} direction="down" />
        </div>

        <div
          className="relative py-16 md:py-24 px-6"
          style={{
            backgroundColor: green,
            backgroundImage: `url(${menuSecBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-[1180px] mx-auto">
            <div className="text-center mb-12">
              <p className="section-label mb-5">Catering</p>
              <h2 className="heading-display-gold text-[28px] md:text-[40px] mb-5">
                Four ways we come to you
              </h2>
              <p
                className="font-gotham text-[14px] leading-[1.9] max-w-[540px] mx-auto opacity-90"
                style={{ color: cream }}
              >
                We cook at your venue, not ours. Pick the occasion and its enquiry form opens
                with it.
              </p>
            </div>

            <EventGallery panels={panels} onOpen={setActiveIndex} />
          </div>
        </div>

        <div className="bg-green-brand leading-[0]">
          <ScallopDivider color={CREAM_HEX} direction="up" />
        </div>
      </section>

      {/* ---------------- 3. Who we are ---------------- */}
      {/* pb-0 and items-end so Mami stands on the footer with no gap beneath. */}
      <section
        className="relative overflow-hidden pt-20 md:pt-28 pb-0 px-6"
        style={{ backgroundColor: cream }}
      >
        <MandalaBackground position="bottom-left" opacity={0.06} scale={0.7} rotate={-15} />

        <div className="relative max-w-[1100px] mx-auto grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-14 items-end">
          {/* Mami, presenting the coffee and thali toward the copy. `block`
              removes the inline-image descender gap under her hem. */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={mamiCharacter}
              alt="The Madras Mami character holding a brass filter coffee tumbler and a thali of idli, vada, sambar and chutney"
              className="block w-[220px] sm:w-[280px] lg:w-full lg:max-w-[340px] h-auto align-bottom"
              loading="lazy"
            />
          </div>

          {/* Padded off the footer, since the column is bottom-aligned. */}
          <div className="text-center lg:text-left pb-16 md:pb-24">
            <p className="section-label mb-5">Who we are</p>
            <h2 className="heading-display text-[28px] md:text-[40px] mb-3">
              A Home, Wherever You Gather
            </h2>
            {/* Explicit margins rather than .section-divider's my-12, which
                previously needed a negative pull to close the gap. */}
            <div
              className="w-24 h-px my-6 mx-auto lg:mx-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)',
              }}
            />

            <p className="body-text mb-5">
              At Madras Mami, we don’t just cater — we serve stories of the South. Born from
              the nostalgia of home-cooked comfort and the vibrant chaos of Chennai streets, every
              menu blends heritage, warmth and personality, so each celebration tastes distinctly
              yours.
            </p>
            <p className="body-text">
              It begins before sunrise — batter left overnight to rise, mustard seeds cracking in
              hot ghee, the first decoction of filter coffee filling the kitchen. None of that
              changes when we cook for four hundred instead of four. From intimate kitty parties to
              weddings of five hundred, every detail is handled with care, and every plate is 100%
              pure vegetarian.
            </p>
          </div>
        </div>
      </section>

      <HomeFooter />

      {/* One modal, shared by every panel. */}
      <EventModal panels={panels} activeIndex={activeIndex} onChange={setActiveIndex} />
    </div>
  );
};

export default Events;
