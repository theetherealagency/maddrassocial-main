import { useInView } from '@/hooks/useInView';
import { Instagram } from 'lucide-react';
import igRow1 from '@/assets/ig-home-1.png';

/**
 * ONE ROW OF FOUR, NOT TWO ROWS OF UP TO EIGHT (client request, 2026-09-22).
 * The second row (`ig-home-2.png`) also carried real Madras Mami content —
 * a "win a limited-edition Madras Mami playing card deck" promo tile — not
 * just a bad filename, an actual Mami Instagram post. It has been dropped
 * entirely rather than patched.
 *
 * `ig-home-1.png` is a mockup of a Madras Social feed, not a live one — the
 * "@madrassocial.ca" heading below and the tiles here are placeholder
 * content pending either real supplied posts or a live embed. Ask before
 * treating this as done: a live embed needs Meta/Instagram API access this
 * repo does not have.
 */

const INSTAGRAM_URL = 'https://www.instagram.com/madrassocial/';

const InstagramFeed = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-10 md:py-14 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-16">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-gotham font-medium">
            From Our Kitchen to Your Feed
          </p>
          <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-4">
            @madrassocial.ca
          </h2>
          <div className="w-8 h-px bg-accent/50 mx-auto" />
        </div>

        <div className={`max-w-5xl mx-auto transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-sm border border-border/30 hover:border-accent/40 transition-all duration-500"
            aria-label="Visit @madrassocial.ca on Instagram"
          >
            <img src={igRow1} alt="Madras Social on Instagram" className="w-full h-auto block" loading="lazy" />
          </a>
        </div>

        <div className={`text-center mt-8 transition-all duration-[1.2s] delay-400 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2">
            <Instagram className="w-3.5 h-3.5" />
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
