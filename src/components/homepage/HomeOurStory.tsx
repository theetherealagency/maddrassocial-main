import { useEffect, useRef, useState } from "react";
import storyMapDesktop from "@/assets/about-story-map-desktop.webp";
import storyMapMobile from "@/assets/about-story-map-mobile.webp";

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

      {/*
        Desktop — the reveal is observed on the <section> above, not on
        either of these two — each is display:none on the other breakpoint,
        and an element with no layout box never reports as intersecting, so
        the fade-in silently never fired on whichever one wasn't watched.

        Re-verified against the new 2880px export: same shape, same safe
        rectangle (33.6-58.9% top, 34.0-62.8% left) — re-exporting bigger
        did not create more room, since the silhouette narrows fast above
        and below this band. What changed is the type: bigger, more
        line-height, a drawn rule under the eyebrow, so the block reads as
        composed copy instead of a huddle of small text (client feedback,
        2026-09-22 — "spread this text out... make it better"). cqw units
        off a container-type wrapper scale it with the box, not the viewport.
      */}
      <div
        className="hidden md:flex absolute flex-col justify-center text-center transition-all duration-700 ease-out overflow-hidden"
        style={{ top: "32.5%", height: "27%", left: "34%", width: "29%", containerType: "inline-size", ...fade }}
      >
        <p className="section-label mb-2" style={{ fontSize: "clamp(9px, 2.6cqw, 13px)", letterSpacing: "0.32em" }}>
          Madras Social
        </p>
        <span aria-hidden className="block mx-auto mb-3" style={{ width: "15%", height: "1px", backgroundColor: "currentColor", opacity: 0.35 }} />
        <h2 className="heading-display" style={{ fontSize: "clamp(17px, 6cqw, 32px)", lineHeight: 1.2 }}>
          A different kind of night out.
        </h2>
        <p className="body-text mx-auto mt-3" style={{ fontSize: "clamp(10px, 2.5cqw, 13px)", lineHeight: 1.55, maxWidth: "94%" }}>
          Madras Social is a place to meet, settle in, and enjoy the evening
          without rushing through it.
        </p>
        <p className="body-text mx-auto mt-2" style={{ fontSize: "clamp(10px, 2.5cqw, 13px)", lineHeight: 1.55, maxWidth: "94%" }}>
          Inspired by the warmth and energy of South India, we have created a
          space for good food, good drinks, and the people you came with.
          Come in for dinner, stay because the table feels right.
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
        <p className="section-label mb-1 text-[7px] tracking-[0.22em]">MADRAS SOCIAL</p>
        <h2 className="heading-display text-[13px] leading-[1.15]">
          A different kind of night out.
        </h2>
      </div>
    </section>
  );
};

export default HomeOurStory;
