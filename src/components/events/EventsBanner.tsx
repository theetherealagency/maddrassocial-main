import eventsBanner from '@/assets/events-banner.jpg';

/* Opening banner: the artwork with the arch copy set into it.

   Arch geometry measured off events-banner.jpg (2400×1154): the arch is only
   ~15% of the width near its apex, widening to ~18.3% by 24% down, and the door
   lintel starts at 37%. Hence the text at top 21% and 1.95vw — that keeps the
   widest line ~20% narrower than the arch at every viewport width. */

const ARCH_LINES = ['Open the door', 'to Madras'];
const TAGLINE = 'Ghar ka swaad';

const EventsBanner = () => (
  <>
    <div className="relative">
      <img
        src={eventsBanner}
        alt="Madras Mami catering and events — a carved temple doorway framed by South Indian dishes"
        className="w-full h-auto block"
        loading="eager"
      />

      {/* Arch text, from md up */}
      <div className="hidden md:block" aria-hidden="true">
        <div
          className="absolute text-center"
          style={{ top: '21%', left: '50%', transform: 'translateX(-50%)' }}
        >
          {ARCH_LINES.map((line) => (
            <p
              key={line}
              className="heading-display whitespace-nowrap"
              style={{ fontSize: 'clamp(15px, 1.95vw, 42px)', lineHeight: 1.16 }}
            >
              {line}
            </p>
          ))}
          {/* Brown, not gold: measured against the wall behind it, --gold-dark
              scored 1.40:1 and --color-gold 1.02:1 — invisible. Brown is 7.46:1. */}
          <p
            className="font-display italic whitespace-nowrap opacity-85"
            style={{
              fontSize: 'clamp(13px, 1.7vw, 36px)',
              lineHeight: 1.15,
              marginTop: '0.18em',
              color: 'hsl(var(--color-brown))',
            }}
          >
            {TAGLINE}
          </p>
        </div>
      </div>
    </div>

    {/* Mobile: the arch copy, stacked under the artwork */}
    <div className="md:hidden px-6 py-8 text-center">
      <p className="heading-display text-[26px] leading-[1.2]">{ARCH_LINES.join(' ')}</p>
      <p
        className="font-display italic text-[20px] mt-1 opacity-85"
        style={{ color: 'hsl(var(--color-brown))' }}
      >
        {TAGLINE}
      </p>
    </div>
  </>
);

export default EventsBanner;
