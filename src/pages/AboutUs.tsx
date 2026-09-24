import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import HomeNavbar from "@/components/homepage/HomeNavbar";
import HomeFooter from "@/components/homepage/HomeFooter";

// Our Space collage — replaced the Madras Mami placeholder (mm-about.jpg)
// 2026-09-22. Same shared map graphic as the homepage's Our Story section:
// see storyMapDesktop/Mobile there.
import spaceCollageDesktop from "@/assets/about-photo-collage-desktop.webp";
import spaceCollageMobile from "@/assets/about-photo-collage-mobile.webp";
import storyMapDesktop from "@/assets/about-story-map-desktop.webp";
import storyMapMobile from "@/assets/about-story-map-mobile.webp";
import bottomIllustrationDesktop from "@/assets/about-bottom-illustration-desktop.webp";
import bottomIllustrationMobile from "@/assets/about-bottom-illustration-mobile.webp";

// ── Public image paths (served from /public) ─────────────────────


// ── Design tokens ────────────────────────────────────────────────
// CREAM was '#F5EDD8' — visibly lighter/more yellow than the actual
// background baked into the surrounding section images (measured from
// about-photo-collage-desktop.webp and about-bottom-illustration-desktop.webp:
// rgb(232,224,215) at every sampled corner). That mismatch is what made the
// "Still Home" section between them look like a different, flatter cream
// (client feedback, 2026-09-23). Matched to the images now.
const CREAM  = "#E8E0D7";
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
      {/* Shared site header — same transparent-until-scrolled component and
          behaviour as every other page (client instruction, 2026-09-23).
          See HomeNavbar.tsx for how legibility over this page's dark red
          section is handled without special-casing this page. */}
      <HomeNavbar />

      {/* ── OPENING STORY — new, client-supplied copy, 2026-09-23 ──
          This is now the first thing under the fixed nav, so it carries the
          nav-clearance padding that used to sit on the map section below
          (which no longer needs it, now that it isn't first — see that
          section's own comment). Same plain-text treatment as "Still Home"
          further down the page: eyebrow, big italic heading, body copy. */}
      <section className="w-full pt-[110px] pb-12 md:pb-16 px-6" style={{ backgroundColor: CREAM }}>
        <FadeUp className="max-w-[620px] mx-auto text-center">
          <p className="section-label mb-4">Why Madras Social</p>
          <h2
            className="font-display leading-[1.15] font-semibold text-[30px] sm:text-[38px] md:text-[48px] lg:text-[56px]"
            style={{ color: BROWN }}
          >
            We wanted to create a place people would return to.
          </h2>
          <p
            className="font-body mt-6 mx-auto"
            style={{ fontSize: "17px", lineHeight: 1.7, color: BROWN, maxWidth: "46ch", opacity: 0.9 }}
          >
            Madras Social was not created to be another restaurant you visit
            once. It was created to become part of your plans.
          </p>
          <p
            className="font-body mt-4 mx-auto"
            style={{ fontSize: "17px", lineHeight: 1.7, color: BROWN, maxWidth: "46ch", opacity: 0.9 }}
          >
            A place for a first dinner, a regular Friday table, a celebration
            with friends, a drink after work, or an evening when you do not
            feel like going home yet. We want every guest to feel welcome,
            looked after, and comfortable enough to stay awhile.
          </p>
        </FadeUp>
      </section>

      {/* ── SECTION 2: HOW IT ALL BEGAN ─────────────────────────── */}
      {/*
        REBUILT 2026-09-22 to match the homepage's Our Story section: no box,
        copy directly on the map's white Tamil Nadu silhouette (client
        instruction — "the box is the map shape"). Same shared asset as Home
        (about-story-map-desktop/mobile.webp IS storyMapDesktop/Mobile there),
        same measured safe zones — see HomeOurStory.tsx for how those were
        found and why they are this tight.

        The copy here is condensed from the original three paragraphs to one,
        for the same reason Home's was: the desktop zone is 390 x 194 CSS px
        at most, and mobile's silhouette renders at roughly a third of that.
        Nothing invented — this is the original wording, shortened, not new
        claims.
      */}
      {/* pt-8: the map artwork's white Tamil Nadu shape touches row 0 of the
          source file with no headroom above it (measured — the "white"
          shape colour starts at y=0%). That used to need a 90px spacer to
          clear the fixed nav, back when this was the first section on the
          page; now the new "Opening Story" section above carries that
          clearance instead, so this only needs a plain section-to-section
          gap. Still a padding-top on a non-positioned wrapper, not on the
          relative image container itself, so it doesn't shift the measured
          percentage-based text-overlay math below. */}
      <section ref={storyRef} className="overflow-hidden pt-8" id="story">
      <div className="relative">
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
            the silhouette renders too small here for more than a heading.
            Client, 2026-09-23: "make sure this is visible on mobile"
            (quoting the body paragraph) — placement on the artwork was the
            constraint, not the copy itself, so the paragraph now renders
            below the map image in normal flow, mobile-only, same pattern
            as HomeOurStory.tsx. */}
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
      </div>

      <div className="block md:hidden px-6 pt-6 pb-8 text-center" style={{ backgroundColor: CREAM }}>
        <p className="font-body text-[13px] leading-[1.55]" style={{ color: BROWN }}>
          Waterloo Region had the appetite for South Indian food. What it did
          not have was the room — a real bar, an evening you do not rush, a
          table that is yours for as long as you want it.
        </p>
      </div>
      </section>

      {/* ── OUR SPACE (heritage polaroid collage) ───────────────── */}
      {/* Client request, 2026-09-23: "make the doll moving like a toy, like
          Thanjavur dancing doll" — briefly animated the Thalaiyatti Bommai
          in the centre polaroid (GrabCut cutout overlaid on a matching hole
          punched in the collage), through several rounds fixing ghosting and
          seam artefacts. Client then clarified, same day: "dont move the
          doll on about us page only home page hero section" — reverted to
          the plain static collage. The wobble treatment lives only on
          `HomeHero.tsx` now; `about-space-doll-desktop.png` / `-mobile.png`
          (the cutouts) and the collage's punched-hole alpha are unused here
          but left on disk in case the doll animation comes back to this page. */}
      <section id="our-space" className="relative overflow-hidden">
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

      {/* Closing statement, right above the skyline illustration below it —
          a short bridge between the two, on the same cream ground the
          illustration sits on.
          Revised 2026-09-23 (round 2): dropped the "Still Home" eyebrow
          (client: remove it) and the "second address" line for "found a
          new home" instead. The body line was flagged as "very very very
          generic" — swapped the vague "chicken and mutton alongside the
          vegetarian plates, a full bar" for two named dishes off the actual
          menu (menuBookData.ts) and the one cocktail built on a rasam,
          which says the same thing (non-veg, real bar) without reading like
          boilerplate. Padding cut too — pt-16/pb-16 plus this being sandwiched
          between two other cream sections read as dead air.
          Revised again, 2026-09-23 (round 3): client called the copy flat
          and asked for it bigger and bolder — heading roughly doubled
          (24-34px → 40-64px, weight up), body sized up and darkened from
          85% opacity to full ink, and the line itself rewritten to lead
          with the dish rather than the geography lesson. */}
      <section className="w-full pt-8 pb-2 px-6" style={{ backgroundColor: CREAM }}>
        <FadeUp className="max-w-[600px] mx-auto text-center">
          <h2
            className="font-display leading-[1.15] text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px]"
            style={{ color: BROWN }}
          >
            Chennai never really left.
            <br className="hidden sm:block" />{" "}
            It just found a new home.
          </h2>
          <p
            className="font-body mt-6 mx-auto"
            style={{ fontSize: "19px", lineHeight: 1.6, color: BROWN, maxWidth: "36ch" }}
          >
            The lamb shank still gets its pepper crust. The rasam still
            turns up in a cocktail before it turns up in a bowl. Madras
            Social is that same kitchen — just moved to Waterloo Region.
          </p>
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
