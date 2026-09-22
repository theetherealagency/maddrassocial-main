import { useEffect, useRef, useState } from "react";
import GoldOrnament from "./GoldOrnament";
import storyMapDesktop from "@/assets/about-story-map-desktop.jpg";
import storyMapMobile from "@/assets/about-story-map-mobile.jpg";

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
    <section className="pt-4 pb-0 md:pt-[100px] relative overflow-hidden" style={{ backgroundColor: '#F2EDE4' }} id="about-us">
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
          South Indian food,
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          and somewhere to sit with it.
        </h2>

        <p className="body-text max-w-[580px] mx-auto mb-4 md:mb-5 text-[14px] md:text-[14px] leading-[1.6] md:leading-[1.85]">
          Kerala and Tamil cooking, a full bar, and a table you book rather
          than a counter you queue at. Rasam and roots to open. Dosas off the
          tava. Biryani for the middle of the table.
        </p>

        <p className="body-text max-w-[580px] mx-auto mb-6 md:mb-10 text-[14px] md:text-[14px] leading-[1.6] md:leading-[1.85]">
          South Indian food is on menus from Times Square to Singapore.
          Waterloo Region has the appetite for it. What it did not have was
          the room. That is Madras Social, on Erb Street West.
        </p>
      </div>

      {/* Chennai-to-Waterloo map graphic — closes the section on the same
          visual it opens with in the copy above: the two skylines, the
          Madras Social wordmark's home. Full-bleed, own crop per breakpoint. */}
      <img
        src={storyMapDesktop}
        alt="A map of Tamil Nadu traced over the streets of Chennai and Waterloo"
        className="hidden md:block w-full h-auto"
        loading="lazy"
      />
      <img
        src={storyMapMobile}
        alt="A map of Tamil Nadu traced over the streets of Chennai and Waterloo"
        className="block md:hidden w-full h-auto"
        loading="lazy"
      />
    </section>
  );
};

export default HomeOurStory;
