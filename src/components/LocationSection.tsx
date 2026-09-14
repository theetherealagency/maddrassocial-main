import { useInView } from '@/hooks/useInView';
import { MapPin } from 'lucide-react';

const LocationSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-28 md:py-36 bg-card relative">
      <div className="container mx-auto px-6">
        <div className={`text-center transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <MapPin className="w-4 h-4 text-accent mx-auto mb-4" />
          <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-6">Visit Us</h2>
          <a
            href="https://share.google/US5bWLfnTKIab8p5V"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors block leading-relaxed"
          >
            <span className="text-foreground">8 Erb Street West</span><br />
            Waterloo, ON N2L 1S7
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
          </p>
          <div className="w-8 h-px bg-accent/40 mx-auto mt-8" />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
