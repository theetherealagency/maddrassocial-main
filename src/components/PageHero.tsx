import { useInView } from '@/hooks/useInView';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHero = ({ title, subtitle, backgroundImage }: PageHeroProps) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="page-hero pt-20">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Decorative gold line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 h-px bg-accent/60" />
            <div className="w-2 h-2 rotate-45 border border-accent/60" />
            <span className="w-12 h-px bg-accent/60" />
          </div>

          <h1 className="font-kugile text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="w-16 md:w-24 h-px bg-accent/40" />
            <div className="w-3 h-3 rotate-45 border-2 border-accent/40" />
            <span className="w-16 md:w-24 h-px bg-accent/40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
