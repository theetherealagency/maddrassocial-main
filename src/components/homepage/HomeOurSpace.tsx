import { useEffect, useRef, useState } from "react";
import traditionDesktop from "@/assets/tradition-section-desktop.png";
import traditionMobile from "@/assets/tradition-section-mobile.png";

/**
 * Heritage-inspired polaroid collage + the Chennai-to-Waterloo route,
 * "Where Tradition Meets Design." Two crops: the mobile file stacks the
 * photos over the route instead of running them side by side, which is
 * what the desktop crop does across the full width.
 *
 * Client request, 2026-09-22: put copy on the olive-green half, about
 * Madras culture and the flavours this kitchen is bringing to Waterloo.
 * The polaroids do not sit flush to the bottom of the green field — there
 * is a genuine clear strip of it below them on both crops. Measured, not
 * eyeballed, same method as the map sections: desktop's clear band is
 * roughly the bottom 20% of the frame (y 80–99%, x 0–56%); mobile's is a
 * full-width band around a third of the way down (y 33–46%). Text sits in
 * those bands only — the green is real photograph-adjacent background,
 * not a flat card, so anywhere outside the measured zone risks crossing
 * onto a polaroid or its cast shadow.
 */
const HomeOurSpace = () => {
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
    <section ref={ref} className="relative overflow-hidden" id="our-space">
      <img
        src={traditionDesktop}
        alt="Where Tradition Meets Design — heritage-inspired polaroid collage of Chennai, and the route from Chennai to Waterloo"
        className="hidden md:block w-full h-auto"
        loading="lazy"
      />
      <img
        src={traditionMobile}
        alt="Where Tradition Meets Design — heritage-inspired polaroid collage of Chennai, and the route from Chennai to Waterloo"
        className="block md:hidden w-full h-auto"
        loading="lazy"
      />

      {/* Desktop — bottom-left strip of the green field, under the polaroids. */}
      <div
        className="hidden md:flex absolute flex-col justify-center px-[3%] transition-all duration-700 ease-out"
        style={{
          left: 0, width: "56%", top: "80%", height: "19%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <p className="section-label mb-2" style={{ color: "#a59976", fontSize: "11px" }}>
          Chennai to Waterloo
        </p>
        <h2 className="font-display italic text-cream" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.25 }}>
          The flavours came with us.
        </h2>
        <p className="font-body text-cream/80 mt-2" style={{ fontSize: "13px", lineHeight: 1.6, maxWidth: "42ch" }}>
          Temple bells, tiffin carriers, the corner flower seller — everyday
          Madras, not a postcard of it. We packed the taste and brought it
          to Waterloo Region.
        </p>
      </div>

      {/* Mobile — full-width band below the polaroids, above the map. */}
      <div
        className="flex md:hidden absolute flex-col justify-center px-6 text-center transition-all duration-700 ease-out"
        style={{
          left: 0, right: 0, top: "33.5%", height: "13%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <p className="section-label mb-1" style={{ color: "#a59976", fontSize: "9px" }}>
          Chennai to Waterloo
        </p>
        <h2 className="font-display italic text-cream" style={{ fontSize: "18px", lineHeight: 1.2 }}>
          The flavours came with us.
        </h2>
        <p className="font-body text-cream/80 mt-1" style={{ fontSize: "11px", lineHeight: 1.45 }}>
          Everyday Madras, not a postcard of it — packed up and brought to
          Waterloo Region.
        </p>
      </div>
    </section>
  );
};

export default HomeOurSpace;
