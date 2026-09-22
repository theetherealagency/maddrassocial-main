import { useEffect, useRef, useState } from "react";
import GoldOrnament from "./GoldOrnament";
import storyMapDesktop from "@/assets/about-story-map-desktop.png";
import storyMapMobile from "@/assets/about-story-map-mobile.png";

/**
 * The copy sits ON the map now, not stacked above it (client request,
 * 2026-09-22 — the section used to be text on cream, then the map full-bleed
 * below it as a separate closing visual).
 *
 * The map's white Tamil Nadu silhouette is hand-drawn and irregular — it
 * touches the top and bottom edges of the frame at its temple-tower points,
 * so there is no clean rectangle inside it wide enough for a heading and two
 * paragraphs without the shape clipping a line somewhere. Measured instead:
 * both crops have a comfortably wide, roughly rectangular zone through their
 * vertical middle (desktop ~y 35–56%, mobile ~y 33–62%, both far short of the
 * pointed tips). A solid card in the site's own cream, centered on the image,
 * sits inside that zone on both crops without touching a silhouette edge —
 * verified against each crop's own measurements, not just eyeballed.
 */
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
    <section className="relative overflow-hidden" id="about-us">
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

      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-6">
        <div
          ref={ref}
          className="w-full max-w-[300px] sm:max-w-[380px] md:max-w-[520px] lg:max-w-[600px] rounded-lg md:rounded-xl shadow-card px-4 py-5 sm:px-6 sm:py-7 md:px-10 md:py-10 text-center transition-all duration-700 ease-out"
          style={{
            backgroundColor: "#F2EDE4",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="section-label mb-2 md:mb-[14px] text-[9px] md:text-[11px]">OUR STORY</p>
          <GoldOrnament className="mb-2 md:mb-4 scale-75 md:scale-100" />

          <h2 className="heading-display text-[16px] sm:text-[19px] md:text-[28px] lg:text-[34px] mb-2 md:mb-4 leading-[1.25]">
            South Indian food,
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            and somewhere to sit with it.
          </h2>

          <p className="body-text mx-auto mb-2 md:mb-3 text-[10px] sm:text-[11px] md:text-[13px] leading-[1.5] md:leading-[1.7]">
            Kerala and Tamil cooking, a full bar, and a table you book rather
            than a counter you queue at. Rasam and roots to open. Dosas off the
            tava. Biryani for the middle of the table.
          </p>

          <p className="body-text mx-auto text-[10px] sm:text-[11px] md:text-[13px] leading-[1.5] md:leading-[1.7]">
            South Indian food is on menus from Times Square to Singapore.
            Waterloo Region has the appetite for it. What it did not have was
            the room. That is Madras Social, on Erb Street West.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeOurStory;
