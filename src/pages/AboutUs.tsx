import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";

// Our Space collage — replaced the Madras Mami placeholder (mm-about.jpg)
// 2026-09-22. Same shared map graphic as the homepage's Our Story section:
// see storyMapDesktop/Mobile there.
import spaceCollageDesktop from "@/assets/about-photo-collage-desktop.png";
import spaceCollageMobile from "@/assets/about-photo-collage-mobile.png";
import storyMapDesktop from "@/assets/about-story-map-desktop.png";
import storyMapMobile from "@/assets/about-story-map-mobile.png";
import bottomIllustrationDesktop from "@/assets/about-bottom-illustration-desktop.png";
import bottomIllustrationMobile from "@/assets/about-bottom-illustration-mobile.png";

// ── Public image paths (served from /public) ─────────────────────


// ── Design tokens ────────────────────────────────────────────────
const CREAM  = "#F5EDD8";
const BROWN  = "#3B2314";



// ── Animation variants ───────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);


// ── Page ─────────────────────────────────────────────────────────
const AboutUs = () => {
  const storyRef = useRef<HTMLElement>(null);
  const [storyVisible, setStoryVisible] = useState(false);

  useEffect(() => {
    const el = storyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStoryVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: CREAM }}>
      {/* Shared site header — added 2026-09-22. This page had none before:
          no way back to the rest of the site short of the browser's back
          button. Every other page uses this same component. */}
      <Header />

      {/* ── SECTION 2: HOW IT ALL BEGAN ─────────────────────────── */}
      {/*
        REBUILT 2026-09-22 to match the homepage's Our Story section: no box,
        copy directly on the map's white Tamil Nadu silhouette (client
        instruction — "the box is the map shape"). Same shared asset as Home
        (about-story-map-desktop/mobile.png IS storyMapDesktop/Mobile there),
        same measured safe zones — see HomeOurStory.tsx for how those were
        found and why they are this tight.

        The copy here is condensed from the original three paragraphs to one,
        for the same reason Home's was: the desktop zone is 390 x 194 CSS px
        at most, and mobile's silhouette renders at roughly a third of that.
        Nothing invented — this is the original wording, shortened, not new
        claims.
      */}
      <section ref={storyRef} className="relative overflow-hidden" id="story">
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
          Desktop — the same measured rectangle as before (re-verified
          against the new 2880px export: 33.6-58.9% top, 34.0-62.8% left,
          same shape, just sharper). It was already close to the widest safe
          box this silhouette allows — target widths above ~830px source-px
          start losing height fast, since the shape narrows above and below
          this band. What changed is the type: bigger, more line-height,
          a drawn rule under the eyebrow instead of a cramped stack, so the
          block reads as composed copy rather than a huddle of small text
          (client feedback, 2026-09-22 — "spread this text out... make it
          better"). Uses cqw units off a container-type wrapper so it scales
          with the box itself, not the viewport.
        */}
        <div
          className="hidden md:flex absolute flex-col justify-center text-center overflow-hidden transition-all duration-700 ease-out"
          style={{
            top: "32.5%", height: "27%", left: "34%", width: "29%",
            containerType: "inline-size",
            color: BROWN,
            opacity: storyVisible ? 1 : 0,
            transform: storyVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p
            className="section-label mb-3"
            style={{ fontSize: "clamp(9px, 2.6cqw, 13px)", letterSpacing: "0.32em" }}
          >
            How It All Began
          </p>
          <span
            aria-hidden
            className="block mx-auto mb-3"
            style={{ width: "15%", height: "1px", backgroundColor: BROWN, opacity: 0.35 }}
          />
          <h2
            className="font-display italic"
            style={{ fontSize: "clamp(20px, 7.5cqw, 40px)", lineHeight: 1.15 }}
          >
            A room for it
          </h2>
          <p
            className="font-body mx-auto mt-4"
            style={{ fontSize: "clamp(11px, 3.1cqw, 16px)", lineHeight: 1.65, maxWidth: "92%" }}
          >
            Waterloo Region had the appetite for South Indian food. What it
            did not have was the room — a real bar, an evening you do not
            rush, a table that is yours for as long as you want it.
          </p>
        </div>

        {/* Mobile — same measured band as HomeOurStory.tsx's mobile fix:
            the silhouette renders too small here for more than a heading. */}
        <div
          className="flex md:hidden absolute flex-col justify-center text-center px-1 transition-all duration-700 ease-out"
          style={{
            top: "35.8%", height: "13.3%", left: "22.3%", width: "54%",
            color: BROWN,
            opacity: storyVisible ? 1 : 0,
            transform: storyVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="section-label mb-1 text-[7px] tracking-[0.22em]">How It All Began</p>
          <h2 className="font-display italic" style={{ fontSize: "13px", lineHeight: 1.15 }}>
            A room for it
          </h2>
        </div>
      </section>

      {/* ── OUR SPACE (heritage polaroid collage) ───────────────── */}
      <section id="our-space">
        <img
          src={spaceCollageDesktop}
          alt="Our Space — a heritage-inspired polaroid collage: temple towers, spice and kumkum, a Thanjavur dancing doll, drying chillies, and the day's catch"
          className="hidden md:block w-full h-auto"
          loading="lazy"
        />
        <img
          src={spaceCollageMobile}
          alt="Our Space — a heritage-inspired polaroid collage: temple towers, spice and kumkum, a Thanjavur dancing doll, drying chillies, and the day's catch"
          className="block md:hidden w-full h-auto"
          loading="lazy"
        />
      </section>

      {/* New closing statement, added 2026-09-22, right above the skyline
          illustration below it — a short bridge between the two, on the
          same cream ground the illustration sits on. */}
      <section className="w-full pt-16 pb-2 px-6" style={{ backgroundColor: CREAM }}>
        <FadeUp className="max-w-[480px] mx-auto text-center">
          <p className="section-label mb-4">Still Home</p>
          <h2
            className="font-display italic leading-[1.25]"
            style={{ fontSize: "clamp(24px, 3.2vw, 34px)", color: BROWN }}
          >
            Chennai never really left.
            <br />
            It just found a second address.
          </h2>
        </FadeUp>
      </section>

      {/* ── SECTION 6: CHENNAI SKYLINE ──────────────────────────── */}
      <section className="w-full" style={{ backgroundColor: CREAM }} id="skyline">
        <img
          src={bottomIllustrationDesktop}
          alt="A line-drawn skyline of Chennai landmarks: temple gopurams, a lighthouse, a Bharatanatyam dancer, and the shore"
          className="hidden md:block w-full h-auto"
          loading="lazy"
        />
        <img
          src={bottomIllustrationMobile}
          alt="A line-drawn skyline of Chennai landmarks: temple gopurams, a lighthouse, a Bharatanatyam dancer, and the shore"
          className="block md:hidden w-full h-auto"
          loading="lazy"
        />
      </section>

      {/* ── SECTION 7: FOOTER ───────────────────────────────────── */}
      <HomeFooter />
    </div>
  );
};

export default AboutUs;
