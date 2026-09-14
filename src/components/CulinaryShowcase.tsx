import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { Link } from 'react-router-dom';
import showcaseDosa from '@/assets/showcase-dosa.png';
import showcaseRasam from '@/assets/showcase-rasam.png';
import showcaseCoffee from '@/assets/showcase-coffee.png';
import showcasePayasam from '@/assets/showcase-payasam.png';


const dishes = [
  {
    name: 'Coastal Traditions Reimagined',
    subtitle: 'Food',
    description:
      'Step into Madras Mami where rich South Indian flavours meet creative flair, authentic coastal spices elevated with modern touches for a dining experience that delights every sense.',
    images: [showcaseDosa, showcaseRasam],
    imageAlt: 'The Everything Vada',
    align: 'left' as const,
  },
  {
    name: 'Elevated Pairings',
    subtitle: 'Heritage Fusion',
    description:
      'Thoughtfully curated combinations that complement our bold South Indian plates — Bisibelebath Risotto, millet-based lentil rice with coconut, appalam, and desi ghee — tradition with a modern twist.',
    images: [showcaseCoffee, showcasePayasam],
    imageAlt: 'Bisibelebath Risotto',
    align: 'right' as const,
  },
  {
    name: 'Modern Spice Mixes',
    subtitle: 'Desserts',
    description:
      'Playful creations reimagining South Indian pantry staples — Filter Kapi Tiramisu with ladyfingers soaked in Madras filter coffee, layered with cream cheese, a heritage flavour fused with inventive, contemporary craft.',
    images: [showcasePayasam, showcaseCoffee],
    imageAlt: 'Filter Kapi Tiramisu',
    align: 'left' as const,
  },
];

const ImageSlideshow = ({ images, alt }: { images: string[]; alt: string }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${alt} ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          loading="lazy"
        />
      ))}
    </div>
  );
};

const ShowcaseItem = ({
  dish,
  index,
}: {
  dish: (typeof dishes)[0];
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const isLeft = dish.align === 'left';

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 transition-all duration-[1s] mb-10 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 100}ms`, gap: '48px' }}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          isLeft ? 'lg:order-1' : 'lg:order-2'
        }`}
        style={{ aspectRatio: '4/3', maxHeight: '360px' }}
      >
        <ImageSlideshow images={dish.images} alt={dish.imageAlt} />
      </div>

      {/* Content */}
      <div
        className={`flex items-center ${
          isLeft ? 'lg:order-2' : 'lg:order-1'
        } px-6 py-6 lg:px-0`}
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-gotham font-medium" style={{ color: '#DBB640' }}>
            {dish.subtitle}
          </p>
          <h3 className="font-kugile text-2xl md:text-3xl mb-5 leading-tight" style={{ color: '#F2EBD6' }}>
            {dish.name}
          </h3>
          <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(242,235,214,0.7)' }}>
            {dish.description}
          </p>
          <Link
            to="/menu"
            className="inline-block px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-gotham font-medium rounded-sm transition-all duration-300 hover:bg-[#DBB640] hover:text-[#452E18]"
            style={{ border: '1px solid rgba(219,182,64,0.6)', color: '#DBB640' }}
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

const CulinaryShowcase = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="py-8 md:py-10 relative" style={{ backgroundColor: '#452E18' }}>
      <div
        ref={ref}
        className={`text-center mb-16 px-6 transition-all duration-[1s] relative z-10 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="font-kugile text-2xl md:text-3xl mb-3" style={{ color: '#F2EBD6' }}>
          Discover the Menu
        </h2>
        <p className="text-xs font-gotham tracking-wide max-w-md mx-auto" style={{ color: 'rgba(242,235,214,0.6)' }}>
          A modern expression of South Indian cuisine, rooted in tradition.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {dishes.map((dish, i) => (
          <ShowcaseItem key={dish.name} dish={dish} index={i} />
        ))}
      </div>
    </section>
  );
};

export default CulinaryShowcase;
