import { useEffect, useRef, useState } from "react";
import traditionDesktop from "@/assets/tradition-section-desktop.png";
import traditionMobile from "@/assets/tradition-section-mobile.png";

/**
 * Heritage-inspired polaroid collage + the Chennai-to-Waterloo route,
 * "Where Tradition Meets Design." Two crops: the mobile file stacks the
 * photos over the route instead of running them side by side, which is
 * what the desktop crop does across the full width.
 *
 * Client request, 2026-09-23: the eyebrow + heading ("Chennai to Waterloo" /
 * "The flavours came with us.") sit at the TOP of the green field now, the
 * body paragraph at the BOTTOM, and the route map on the cream half gets
 * "Madras · Chennai" and "Waterloo" written on it. All four zones are
 * measured, not eyeballed — row-intersection scans of the flat background
 * colour, same method as every other in-image text block on this site:
 *  - desktop top-green strip: x 0–56%, y 0–16% (flat green, std 0)
 *  - desktop bottom-green strip: x 0–56%, y 80–99% (flat green, std 0)
 *  - desktop Madras/Chennai label: x 60–79%, y 51–62%, clear cream directly
 *    below the Tamil Nadu shape (std 0)
 *  - desktop Waterloo label: x 85–99%, y 39–46%, clear cream in the right
 *    margin above the Waterloo-region shape (the shape itself runs too
 *    close to the right edge lower down for a label to fit beside it)
 *  - mobile top-green strip: y 0–10% full width (flat green, std 0)
 *  - mobile bottom band: y 33.5–46.5% full width (flat green, at the seam
 *    with the map — unchanged from the original placement)
 *  - mobile Madras/Chennai label: x 0–14.5%, y 50–70%, left of the Tamil
 *    Nadu shape
 *  - mobile Waterloo label: x 80–99%, y 55–78%, right of the Waterloo shape
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
      {/* Section heading — this block had none before; everything lived
          inside the artwork itself. */}
      <div className="text-center px-4 pt-10 md:pt-16 pb-6 md:pb-8">
        <p className="section-label mb-2">Our Space</p>
        <h2 className="heading-display text-[28px] md:text-[40px]">
          Where Tradition Meets Design
        </h2>
      </div>

      {/* Everything below is positioned relative to the ARTWORK only — a
          dedicated wrapper, separate from the heading block above, so the
          percentage offsets measured against the source images stay correct
          regardless of how tall the heading renders. */}
      <div className="relative">
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

      {/* Desktop — eyebrow + heading at the top of the green field. */}
      <div
        className="hidden md:flex absolute flex-col justify-center px-[3%] transition-all duration-700 ease-out"
        style={{
          left: 0, width: "56%", top: "0%", height: "16%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-16px)",
        }}
      >
        <p className="section-label mb-2" style={{ color: "#a59976", fontSize: "11px" }}>
          Chennai to Waterloo
        </p>
        <h2 className="font-display italic text-cream" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.25 }}>
          The flavours came with us.
        </h2>
      </div>

      {/* Desktop — the body paragraph at the bottom of the green field, under the polaroids. */}
      <div
        className="hidden md:flex absolute flex-col justify-center px-[3%] transition-all duration-700 ease-out"
        style={{
          left: 0, width: "56%", top: "80%", height: "19%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <p className="font-body text-cream/80" style={{ fontSize: "13px", lineHeight: 1.6, maxWidth: "42ch" }}>
          Temple bells, tiffin carriers, the corner flower seller — everyday
          Madras, not a postcard of it. We packed the taste and brought it
          to Waterloo Region.
        </p>
      </div>

      {/* Desktop — map label, Tamil Nadu shape. */}
      <div
        className="hidden md:flex absolute flex-col items-center justify-start text-center transition-all duration-700 ease-out"
        style={{
          left: "60%", width: "19%", top: "52%", height: "9%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span className="font-accent italic uppercase tracking-[0.15em]" style={{ color: "#a83d24", fontSize: "13px" }}>
          Madras · Chennai
        </span>
      </div>

      {/* Desktop — map label, Waterloo-region shape. */}
      <div
        className="hidden md:flex absolute flex-col items-center justify-start text-center transition-all duration-700 ease-out"
        style={{
          left: "85%", width: "14%", top: "39%", height: "8%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span className="font-accent italic uppercase tracking-[0.15em]" style={{ color: "#414c2a", fontSize: "13px" }}>
          Waterloo
        </span>
      </div>

      {/* Mobile — eyebrow + heading at the top of the green field. */}
      <div
        className="flex md:hidden absolute flex-col justify-center px-6 text-center transition-all duration-700 ease-out"
        style={{
          left: 0, right: 0, top: "0%", height: "10%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-16px)",
        }}
      >
        <p className="section-label mb-1" style={{ color: "#a59976", fontSize: "9px" }}>
          Chennai to Waterloo
        </p>
        <h2 className="font-display italic text-cream" style={{ fontSize: "18px", lineHeight: 1.2 }}>
          The flavours came with us.
        </h2>
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
        <p className="font-body text-cream/80" style={{ fontSize: "11px", lineHeight: 1.45 }}>
          Everyday Madras, not a postcard of it — packed up and brought to
          Waterloo Region.
        </p>
      </div>

      {/* Mobile — map label, Tamil Nadu shape. */}
      <div
        className="flex md:hidden absolute flex-col items-center justify-center px-1 text-center transition-all duration-700 ease-out"
        style={{
          left: 0, width: "14%", top: "50%", height: "20%",
          opacity: visible ? 1 : 0,
        }}
      >
        <span className="font-accent italic uppercase tracking-[0.1em]" style={{ color: "#a83d24", fontSize: "9px", lineHeight: 1.3 }}>
          Madras · Chennai
        </span>
      </div>

      {/* Mobile — map label, Waterloo-region shape. */}
      <div
        className="flex md:hidden absolute flex-col items-center justify-center px-1 text-center transition-all duration-700 ease-out"
        style={{
          left: "80%", width: "19%", top: "55%", height: "23%",
          opacity: visible ? 1 : 0,
        }}
      >
        <span className="font-accent italic uppercase tracking-[0.1em]" style={{ color: "#414c2a", fontSize: "9px" }}>
          Waterloo
        </span>
      </div>
      </div>
    </section>
  );
};

export default HomeOurSpace;
