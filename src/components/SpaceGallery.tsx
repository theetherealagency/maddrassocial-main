import { useInView } from '@/hooks/useInView';
import socialHero from '@/assets/madras-social-hero.png';
import sitarImg from '@/assets/sitar.png';
import stoneImg from '@/assets/stone.png';

const SpaceGallery = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-8 md:py-10 relative">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className={`text-center mb-16 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-gotham font-medium">
            The Space
          </p>
          <h2 className="font-kugile text-2xl md:text-3xl text-primary">
            Where Tradition Meets Design
          </h2>
        </div>

        {/* Asymmetrical Gallery */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 max-w-6xl mx-auto transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="md:col-span-7 aspect-[4/3] overflow-hidden rounded group">
            <img src={socialHero} alt="Madras Social" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          </div>

          <div className="md:col-span-5 grid grid-rows-2 gap-3 md:gap-5">
            <div className="overflow-hidden rounded aspect-[16/9] md:aspect-auto group">
              <img src={sitarImg} alt="Sitar & Veena Art" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded aspect-[16/9] md:aspect-auto group">
              <img src={stoneImg} alt="Temple Motifs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Design features */}
        <div className={`grid md:grid-cols-3 gap-10 max-w-4xl mx-auto mt-20 transition-all duration-[1.2s] delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { title: 'Rattan Textures', desc: 'Natural weaves and warm wood tones bring the organic feel of a South Indian home.' },
            { title: 'Jali Patterns', desc: 'Geometric lattice work inspired by Dravidian temple architecture.' },
            { title: 'Brass Accents', desc: 'Traditional brass lanterns and fixtures creating an atmosphere of quiet elegance.' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-kugile text-base text-primary mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaceGallery;
