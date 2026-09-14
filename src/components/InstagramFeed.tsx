import { useInView } from '@/hooks/useInView';
import { Instagram } from 'lucide-react';
import igRow1 from '@/assets/ig-home-1.png';
import igRow2 from '@/assets/ig-home-2.png';

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

        <div className={`flex flex-col gap-3 md:gap-4 max-w-5xl mx-auto transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[igRow1, igRow2].map((src, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-sm border border-border/30 hover:border-accent/40 transition-all duration-500"
              aria-label="Visit @madrassocial.ca on Instagram"
            >
              <img src={src} alt="Madras Social on Instagram" className="w-full h-auto block" loading="lazy" />
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
