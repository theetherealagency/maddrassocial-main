import { useEffect, useRef, useState } from "react";
import storyMapDesktop from "@/assets/about-story-map-desktop.png";
import storyMapMobile from "@/assets/about-story-map-mobile.png";

/**
 * No box. The map's own white Tamil Nadu silhouette IS the background —
 * client instruction, 2026-09-22: "the box is the map shape". So this only
 * works inside a rectangle that is genuinely white at every row it covers;
 * outside that rectangle there is nothing under the text but the terracotta
 * ground, and dark brown copy on terracotta does not read.
 *
 * The silhouette is hand-drawn and irregular — it touches the frame's top
 * and bottom edges at its temple-tower points — so that rectangle was found
 * by measurement, not eyeballed: for every row in a candidate vertical band,
 * take the widest white run, then intersect those runs across the band to
 * get one x-range guaranteed white at every row in it. The tallest band that
 * still clears ~380px of width:
 *
 *   desktop (1366×768):  top 33.1% / height 25.2% / left 34.1% / width 28.6%
 *   mobile  (1366×1351): top 18.7% / height 42.9% / left 40.4% / width 27.8%
 *
 * Desktop's budget is tight — 194px tall at that width — which is why this
 * version has no gold ornament and tighter line-height than the boxed one
 * did: the ornament plus its margins alone were most of the spare room.
 * Mobile's silhouette is wider through its middle, so it keeps more breathing
 * room. Re-run the same measurement if either artwork is ever re-exported.
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

  const fade = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
  } as const;

  return (
    <section ref={ref} className="relative overflow-hidden" id="about-us">
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

      {/* Desktop — the tight band. No ornament; every px is spent on copy.
          The reveal is observed on the <section> above, not on either of
          these two — each is display:none on the other breakpoint, and an
          element with no layout box never reports as intersecting, so the
          fade-in silently never fired on whichever one wasn't watched. */}
      <div
        className="hidden md:flex absolute flex-col justify-center text-center transition-all duration-700 ease-out overflow-hidden"
        style={{ top: "33.1%", height: "25.2%", left: "34.1%", width: "28.6%", ...fade }}
      >
        <p className="section-label mb-1 text-[9px] tracking-[0.3em]">OUR STORY</p>
        <h2 className="heading-display text-[19px] leading-[1.15] mb-2">
          South Indian food,
          <br />
          and somewhere to sit with it.
        </h2>
        <p className="body-text text-[10px] leading-[1.35] mb-1.5">
          Kerala and Tamil cooking, a full bar, and a table you book rather
          than a counter you queue at. Rasam and roots to open. Dosas off the
          tava. Biryani for the middle of the table.
        </p>
        <p className="body-text text-[10px] leading-[1.35]">
          South Indian food is on menus from Times Square to Singapore.
          Waterloo Region has the appetite for it. What it did not have was
          the room. That is Madras Social, on Erb Street West.
        </p>
      </div>

      {/*
        Mobile is a different problem, not just a smaller version of desktop's.
        The artwork is 1366px wide but a phone displays it at ~390px CSS —
        roughly 3.5x smaller — so ANY safe rectangle inside the silhouette
        shrinks by that same factor once it is actually on a screen. The
        widest band that still holds a couple of lines renders at only about
        211 x 51 CSS px (measured, not eyeballed — same row-intersection
        method as desktop, at several candidate heights). That is room for an
        eyebrow and a two-line heading. It is not room for two paragraphs at
        any font size a person can read; shrinking type to force the fit was
        tried and was not legible.
        So mobile drops the two paragraphs and keeps the heading — the same
        simplification the client already accepted once for this section (it
        shipped heading-only for a while during earlier iteration). The full
        story still reads on desktop and on the About Us page.
      */}
      <div
        className="flex md:hidden absolute flex-col justify-center text-center transition-all duration-700 ease-out px-1"
        style={{ top: "35.8%", height: "13.3%", left: "22.3%", width: "54%", ...fade }}
      >
        <p className="section-label mb-1 text-[7px] tracking-[0.22em]">OUR STORY</p>
        <h2 className="heading-display text-[13px] leading-[1.15]">
          South Indian food, and somewhere to sit with it.
        </h2>
      </div>
    </section>
  );
};

export default HomeOurStory;
