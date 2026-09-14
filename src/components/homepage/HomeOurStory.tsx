import { useEffect, useRef, useState } from "react";
import GoldOrnament from "./GoldOrnament";

const HomeOurStory = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-4 pb-6 md:py-[100px] md:pb-[80px] relative overflow-hidden" style={{ backgroundColor: '#F2EDE4' }} id="about-us">
      <div className="hidden md:block pt-[80px]" />

      <div
        ref={ref}
        className="relative z-[1] max-w-[720px] mx-auto px-5 md:px-6 text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <p className="section-label mb-[14px]">OUR STORY</p>
        <GoldOrnament className="mb-4 md:mb-7" />

        <h2 className="heading-display text-[22px] md:text-[42px] lg:text-[52px] mb-4 md:mb-7 leading-[1.3] md:leading-[1.25]">
          The comforting whistle of the pressure cooker...
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          The ritual of the first morning filter kapi....
        </h2>

        <p className="body-text max-w-[580px] mx-auto mb-4 md:mb-5 text-[14px] md:text-[14px] leading-[1.6] md:leading-[1.85]">
          Every dish at Madras Mami is a love letter written by Mami's hands,
          the same hands that ground fresh batter before dawn, that tempered
          mustard seeds till they danced in hot oil, that rolled perfect idlis
          while the whole house still slept in the warmth of a Chennai morning.
        </p>

        <p className="body-text max-w-[580px] mx-auto mb-6 md:mb-10 text-[14px] md:text-[14px] leading-[1.6] md:leading-[1.85]">
          Heritage recipes passed down through Mami's kitchen, from the temple
          towns of Tamil Nadu to the coffee houses of Bengaluru, from the spice
          markets of Chettinad to the tiffin stalls of Mylapore, we bring that
          warmth, that taste of home, right here to Brampton.
        </p>
      </div>
    </section>
  );
};

export default HomeOurStory;
