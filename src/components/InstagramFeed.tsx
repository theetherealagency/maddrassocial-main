import { useInView } from '@/hooks/useInView';
import { Instagram } from 'lucide-react';
import igTile1 from '@/assets/ig-tile-1.jpg';
import igTile2 from '@/assets/ig-tile-2.jpg';
import igTile3 from '@/assets/ig-tile-3.jpg';
import igTile4 from '@/assets/ig-tile-4.jpg';

/**
 * ONE ROW OF FOUR, NOT TWO ROWS OF UP TO EIGHT (client request, 2026-09-22).
 * The second row (`ig-home-2.png`) also carried real Madras Mami content —
 * a "win a limited-edition Madras Mami playing card deck" promo tile — not
 * just a bad filename, an actual Mami Instagram post. It has been dropped
 * entirely rather than patched.
 *
 * Revised 2026-09-23 (round 2) — client: "use images or posts from
 * [instagram.com/madrassocial] for instagram cards." The previous four
 * tiles were the client's own food photography (real, but never actually
 * posted) — these four are pulled directly from the live @madrassocial
 * feed itself: the Beet Poriyal Hummus & Edamame Varuval post, the
 * storefront-opening announcement, a real guest photographed mid-bite at
 * the restaurant, and the Marina Beach brand illustration post. Cropped to
 * square from each post's own image, nothing else changed.
 *
 * Still not a live embed — that needs Meta/Instagram API access this repo
 * does not have — but the actual posts, not a mockup or unrelated photos.
 */

const INSTAGRAM_URL = 'https://www.instagram.com/madrassocial/';
const TILES = [
  { src: igTile1, alt: "Madras Social's Beet Poriyal Hummus & Edamame Varuval, from the @madrassocial Instagram" },
  { src: igTile2, alt: "The Madras Social storefront on Erb Street West, from the restaurant's opening announcement on Instagram" },
  { src: igTile3, alt: "A guest enjoying a dish at Madras Social, from the @madrassocial Instagram" },
  { src: igTile4, alt: "Madras Social's Marina Beach illustration post, from the @madrassocial Instagram" },
];

const InstagramFeed = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-10 md:py-14 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-16">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-accent font-medium">
            The Social Side
          </p>
          <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-4">
            @madrassocial
          </h2>
          <div className="w-8 h-px bg-accent/50 mx-auto" />
        </div>

        <div className={`max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {TILES.map((tile) => (
            <a
              key={tile.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded-sm border border-border/30 hover:border-accent/40 transition-all duration-500"
              aria-label="Visit @madrassocial on Instagram"
            >
              <img
                src={tile.src}
                alt={tile.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </a>
          ))}
        </div>

        <div className={`text-center mt-8 transition-all duration-[1.2s] delay-400 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2" style={{ fontFamily: "var(--font-accent)" }}>
            <Instagram className="w-3.5 h-3.5" />
            Follow Along
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
