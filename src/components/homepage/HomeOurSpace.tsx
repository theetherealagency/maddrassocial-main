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
 * "Madras · Chennai" and "Waterloo" written on it.
 *
 * Revised 2026-09-23 (round 2) — two client corrections:
 *  1. The standalone heading block above the artwork, and the in-image top
 *     text zone below it, left too much dead air. Both are tighter now —
 *     less padding on the heading block, and the in-image zone hugs the top
 *     edge (`justify-start` + a small top offset) instead of being centred
 *     in a tall box.
 *  2. The map labels read as floating, disconnected from the shapes they
 *     name — they were placed in the nearest fully-clear patch of cream,
 *     which for Waterloo was well above the actual shape. Re-measured to
 *     sit immediately beside each location dot instead, even where that
 *     means sharing space with a few thin (very light) road lines — a
 *     text-shadow halo keeps the label legible over them, same trick real
 *     printed maps use.
 *
 * All zones measured, not eyeballed — row-intersection scans of the flat
 * background colour (or, where noted, fraction-clear scans right at each
 * location dot):
 *  - desktop top-green strip: x 0–56%, y 0–16% (flat green, std 0)
 *  - desktop bottom-green strip: x 0–56%, y 80–99% (flat green, std 0)
 *  - desktop Madras/Chennai label: x 78–90%, y 20–30%, clear cream
 *    immediately right of the Tamil Nadu location dot (std 0)
 *  - desktop Waterloo label: x 68–78%, y 65.5–68.5%, clear cream
 *    immediately left of the Waterloo-region location dot (std 0)
 *  - mobile top-green strip: y 0–10% full width (flat green, std 0)
 *  - mobile bottom band: y 33.5–46.5% full width (flat green, at the seam
 *    with the map — unchanged from the original placement)
 *  - mobile Madras/Chennai label: x 47–70%, y 56–62%, right of the Tamil
 *    Nadu location dot
 *  - mobile Waterloo label: x 35–49%, y 78–84%, left of the Waterloo
 *    location dot
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
          inside the artwork itself. Kept tight (client feedback: the first
          pass left too much empty cream above the artwork). */}
      <div className="text-center px-4 pt-6 md:pt-8 pb-3 md:pb-4">
        <p className="section-label mb-1">Our Space</p>
        <h2 className="heading-display text-[24px] md:text-[32px]">
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

      {/* Desktop — eyebrow + heading, hugging the top edge of the green field. */}
      <div
        className="hidden md:flex absolute flex-col justify-start px-[3%] pt-[5%] transition-all duration-700 ease-out"
        style={{
          left: 0, width: "56%", top: "0%", height: "11%",
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

      {/* Desktop — map label, Tamil Nadu shape. Sits immediately right of
          the shape's own location dot, not off in a distant clear patch. */}
      <div
        className="hidden md:flex absolute flex-col items-start justify-center text-left transition-all duration-700 ease-out"
        style={{
          left: "78%", width: "14%", top: "20%", height: "9%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span
          className="font-accent italic uppercase tracking-[0.1em]"
          style={{ color: "#a83d24", fontSize: "12px", textShadow: "0 0 6px #e8e0d7, 0 0 6px #e8e0d7" }}
        >
          Madras
          <br />
          Chennai
        </span>
      </div>

      {/* Desktop — map label, Waterloo-region shape. Sits immediately left
          of the shape's own location dot. */}
      <div
        className="hidden md:flex absolute flex-col items-end justify-center text-right transition-all duration-700 ease-out"
        style={{
          left: "68%", width: "10%", top: "63.5%", height: "6%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span
          className="font-accent italic uppercase tracking-[0.1em]"
          style={{ color: "#414c2a", fontSize: "12px", textShadow: "0 0 6px #e8e0d7, 0 0 6px #e8e0d7" }}
        >
          Waterloo
        </span>
      </div>

      {/* Mobile — eyebrow + heading, hugging the top edge of the green field. */}
      <div
        className="flex md:hidden absolute flex-col justify-start pt-[3%] px-6 text-center transition-all duration-700 ease-out"
        style={{
          left: 0, right: 0, top: "0%", height: "8%",
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

      {/* Mobile — map label, Tamil Nadu shape. Right beside the shape's
          own location dot. */}
      <div
        className="flex md:hidden absolute flex-col items-start justify-center px-1 text-left transition-all duration-700 ease-out"
        style={{
          left: "47%", width: "22%", top: "56%", height: "6%",
          opacity: visible ? 1 : 0,
        }}
      >
        <span
          className="font-accent italic uppercase tracking-[0.08em]"
          style={{ color: "#a83d24", fontSize: "9px", lineHeight: 1.3, textShadow: "0 0 5px #e8e0d7, 0 0 5px #e8e0d7" }}
        >
          Madras · Chennai
        </span>
      </div>

      {/* Mobile — map label, Waterloo-region shape. Right beside the
          shape's own location dot. */}
      <div
        className="flex md:hidden absolute flex-col items-end justify-center px-1 text-right transition-all duration-700 ease-out"
        style={{
          left: "35%", width: "14%", top: "78%", height: "6%",
          opacity: visible ? 1 : 0,
        }}
      >
        <span
          className="font-accent italic uppercase tracking-[0.08em]"
          style={{ color: "#414c2a", fontSize: "9px", textShadow: "0 0 5px #e8e0d7, 0 0 5px #e8e0d7" }}
        >
          Waterloo
        </span>
      </div>
      </div>
    </section>
  );
};

export default HomeOurSpace;
