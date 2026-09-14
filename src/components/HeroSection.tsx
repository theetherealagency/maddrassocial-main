import { useState, useEffect, useRef } from 'react';
import fullLogo from '@/assets/gold-logo.png';
import entranceView from '@/assets/entrance-3d-view.png';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex items-end justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${entranceView})`,
          transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
        }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-primary/30" />

      {/* Content — positioned at bottom like Ammakai */}
      <div className="relative z-10 text-center px-6 pb-20 md:pb-28 w-full max-w-4xl mx-auto">
        <div className={`transition-all duration-[1.8s] ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <img
            src={fullLogo}
            alt="Madras Mami"
            className="w-52 md:w-72 mx-auto object-contain mb-8"
          />
        </div>

        <div className={`transition-all duration-[1.8s] delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-kugile text-3xl md:text-4xl lg:text-5xl text-white/90 mb-6 tracking-wide">
            Tradition, Reimagined.
          </h1>
        </div>

        <div className={`transition-all duration-[1.8s] delay-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-sm md:text-base font-gotham max-w-lg mx-auto leading-relaxed tracking-wide">
            Where the aroma of amma's kitchen meets the elegance of modern Brampton.
            Every bite, a memory. Every meal, a homecoming.
          </p>
        </div>
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
