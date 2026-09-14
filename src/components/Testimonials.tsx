import { useInView } from '@/hooks/useInView';

const testimonials = [
  {
    quote: 'The moment I walked in, I smelled amma\'s kitchen. The filter kapi took me straight back to Mylapore mornings.',
    name: 'Priya S.',
    location: 'Mississauga, ON',
  },
  {
    quote: 'This isn\'t just dosa — it\'s the dosa that makes you close your eyes and remember home. My paati would approve.',
    name: 'Karthik R.',
    location: 'Waterloo, ON',
  },
  {
    quote: 'The Bisibelebath Risotto is pure genius. Heritage flavours in a way I\'ve never experienced before. We come every weekend now.',
    name: 'Lakshmi & Venkat',
    location: 'Toronto, ON',
  },
];

const Testimonials = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-8 md:py-12 relative" style={{ backgroundColor: '#452E18' }}>
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className={`text-center mb-12 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xs tracking-[0.4em] uppercase mb-4 font-gotham font-medium" style={{ color: '#DBB640' }}>
            What Our Guests Say
          </p>
          <h2 className="font-kugile text-3xl md:text-4xl" style={{ color: '#F2EBD6' }}>
            Voices from the Table
          </h2>
          <div className="w-8 h-px mx-auto mt-6" style={{ backgroundColor: 'rgba(219,182,64,0.5)' }} />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className={`text-center transition-all duration-[1s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="text-4xl font-kugile mb-4 leading-none" style={{ color: 'rgba(219,182,64,0.5)' }}>"</div>
              <p className="font-kugile text-base md:text-lg leading-[1.9] mb-6 italic" style={{ color: 'rgba(242,235,214,0.85)' }}>
                {testimonial.quote}
              </p>
              <div className="w-6 h-px mx-auto mb-4" style={{ backgroundColor: 'rgba(219,182,64,0.3)' }} />
              <p className="text-xs tracking-[0.15em] uppercase font-gotham font-medium" style={{ color: '#DBB640' }}>
                {testimonial.name}
              </p>
              <p className="text-[10px] font-gotham mt-0.5" style={{ color: 'rgba(242,235,214,0.5)' }}>
                {testimonial.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
