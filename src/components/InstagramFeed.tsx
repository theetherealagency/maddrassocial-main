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
 * Client request, 2026-09-23: replace the mockup feed image with real
 * Madras Social photography. These four tiles are the client's own shoot
 * (Sony ILCE-7M4 RAW captures, supplied via Drive — "Edited" folder),
 * centre-cropped to square. A "Named Photos" batch was also supplied but
 * uses an old, now-unsupported TIFF/JPEG variant no available tool
 * (ImageMagick, PIL, sips, ffmpeg) could decode; the "Edited" folder's
 * already-processed PNGs were used instead. A handful of loose video files
 * in the same Drive drop ("Christine"/"Marietta") were checked and are a
 * different client's hospitality-training content (REVclass/REVacademy) —
 * excluded, not Madras Social's.
 *
 * Still not a live embed — that needs Meta/Instagram API access this repo
 * does not have — but real photos of real Madras Social dishes, not a
 * placeholder mockup.
 */

const INSTAGRAM_URL = 'https://www.instagram.com/madrassocial/';
const TILES = [
  { src: igTile1, alt: "A crunchy Madras Social salad plated in a gold bowl, with crisp puris on the side" },
  { src: igTile2, alt: "Madras Social's sprout and pomegranate salad, garnished with curry leaf and radish" },
  { src: igTile3, alt: "Nattu kozhi rasam at Madras Social, served with a crisp Malabar paratha stick" },
  { src: igTile4, alt: "Beet poriyal hummus with masala edamame and papadum, on a Madras Social sharing platter" },
];

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

        <div className={`max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {TILES.map((tile) => (
            <a
              key={tile.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded-sm border border-border/30 hover:border-accent/40 transition-all duration-500"
              aria-label="Visit @madrassocial.ca on Instagram"
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
