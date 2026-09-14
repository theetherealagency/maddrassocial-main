import { useInView } from '@/hooks/useInView';

const StorySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-8 md:py-10 relative">
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-8 font-gotham font-medium">
            The Story
          </p>

          <h2 className="font-kugile text-2xl md:text-3xl lg:text-4xl text-primary leading-snug mb-8">
            The comforting whistle of the pressure cooker. The ritual of the first morning filter kapi.
          </h2>

          <div className="w-10 h-px bg-accent/50 mx-auto mb-10" />

          <div className="space-y-5 text-sm text-muted-foreground leading-[1.9]">
            <p>
              Kerala and Tamil cooking, a full bar, and a table you book rather than a
              the same hands that ground fresh batter before dawn, that tempered mustard seeds
              till they danced in hot oil, that rolled perfect idlis while the whole house
              still slept in the warmth of a Chennai morning.
            </p>
            <p>
              South Indian food is on menus from Times Square to Singapore. Waterloo
              of Tamil Nadu to the coffee houses of Bangalore, from the spice markets
              of Chettinad to the tiffin stalls of Mylapore — we bring that warmth,
              Region has the appetite for it. What it did not have was the room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
