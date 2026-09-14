import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import journeyVideo from '@/assets/journey-video.mp4';

const JourneySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(0.6);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, windowHeight - rect.top);
      const maxScroll = containerHeight + windowHeight;
      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);
      setScrollScale(0.6 + (progress * 0.4));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldReduceMotion]);

  return (
    <section ref={ref} className="py-32 md:py-40 bg-background relative">
      <div ref={containerRef} className="container mx-auto px-6 lg:px-12">
        <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm tracking-[0.25em] uppercase text-accent mb-4 font-medium">Follow Along</p>
          <h2 className="text-4xl md:text-5xl font-kugile text-primary mb-6">Be a Part of Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A South Indian kitchen and bar in Waterloo Region
          </p>
        </div>

        <div className={`max-w-4xl mx-auto transition-opacity duration-1000 delay-200 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-lg border border-border"
            style={{ scale: shouldReduceMotion ? 1 : scrollScale, transformOrigin: 'center center' }}
          >
            <video className="w-full h-auto" controls playsInline preload="metadata">
              <source src={journeyVideo} type="video/mp4" />
            </video>
          </motion.div>
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a 
            href="https://www.instagram.com/madrassocial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-primary/20 hover:border-accent rounded-full text-primary hover:text-accent transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-base font-medium tracking-wide">@madrassocial.ca</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
