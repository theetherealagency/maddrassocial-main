import { useInView } from '@/hooks/useInView';

const mocktails = [
  { name: 'Chilli Mami', description: 'Bold and fiery — the kind of warmth that reminds you of amma\'s ginger kashayam on a rainy day.', price: '$7.99' },
  { name: 'Kovalam Kokum Splash', description: 'Tangy kokum, coconut whispers, and citrus — like a breeze off the Marina.', price: '$9.99' },
  { name: 'Southern Martini', description: 'Malabar spices meet sophisticated restraint. Sip slowly, savour deeply.', price: '$9.99' },
  { name: 'Malabar Mule', description: 'Ginger, lime, and the spice of the Malabar coast — refreshing as monsoon rain.', price: '$8.99' },
  { name: 'Namma Ooru', description: 'Our hometown in a glass — fresh fruits, herbs, and subtle spices from back home.', price: '$8.99' },
];

const MixologySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-8 md:py-12 relative" style={{ backgroundColor: '#452E18' }}>
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className={`text-center mb-12 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xs tracking-[0.4em] uppercase mb-4 font-gotham font-medium" style={{ color: '#DBB640' }}>
            Mami's Mixology
          </p>
          <h2 className="font-kugile text-3xl md:text-4xl" style={{ color: '#F2EBD6' }}>
            Craft Mocktails
          </h2>
          <div className="w-10 h-px mx-auto mt-6" style={{ backgroundColor: 'rgba(219,182,64,0.5)' }} />
        </div>

        <div className={`max-w-md mx-auto text-center transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rotate-45 border" style={{ borderColor: 'rgba(219,182,64,0.35)' }} />
            ))}
          </div>
          <h3 className="font-kugile text-xl md:text-2xl mb-4" style={{ color: '#F2EBD6' }}>
            Revealing Soon
          </h3>
          <div className="w-10 h-px mx-auto mb-5" style={{ backgroundColor: 'rgba(219,182,64,0.4)' }} />
          <p className="text-xs md:text-sm font-gotham tracking-wide leading-relaxed" style={{ color: 'rgba(242,235,214,0.6)' }}>
            Mami is shaking up something special. Our signature mocktail menu will be unveiled shortly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MixologySection;
