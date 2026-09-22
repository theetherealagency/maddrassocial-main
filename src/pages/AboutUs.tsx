import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import ScallopDivider from "@/components/homepage/ScallopDivider";
import GoldOrnament from "@/components/homepage/GoldOrnament";
import HomeFooter from "@/components/homepage/HomeFooter";
import socialCharacter from "@/assets/social-character-hero.png";

import heroBg from "@/assets/hero-temple-street.png";
import ambientBg from "@/assets/entrance-3d-view.png";
import valuesBg from "@/assets/our-values-bg.jpg";

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
const GREEN  = "#2C4A2E";
const GOLD   = "#C8922A";
const BROWN  = "#3B2314";

/**
 * The four values, as they have always read on this page — MINUS the one
 * line that named a different restaurant's history ("Mami never used
 * shortcuts"). See the note in § SECTION 4 below for why and where it lived.
 * Everything else here is unchanged, real, live copy.
 */
const VALUES = [
  {
    title: "Authenticity First",
    body: "No shortcuts. Ground fresh, cooked slow, served with love.",
  },
  {
    title: "Community at the Core",
    body: "We're not just a restaurant. We're your neighbour, your gathering place, your home away from home.",
  },
  {
    title: "Modern Presentation",
    body: "Heritage cuisine deserves a beautiful stage. We present tradition with contemporary grace.",
  },
  {
    title: "Sustainability",
    body: "We source locally, minimize waste, and cook with respect, for the ingredients, the earth, and the hands that grew them.",
  },
];


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
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFloating(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: CREAM }}>
      <style>{`
        @keyframes mamiAboutFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "80vh" }} id="hero">
        <img
          src={heroBg}
          alt="Split scene: a South Indian street on the left, Waterloo on the right"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <h1
            className="font-display italic text-center leading-[1.05] px-4"
            style={{ fontSize: "clamp(52px, 8vw, 80px)", color: "hsl(var(--offwhite))" }}
          >
            Our Story
          </h1>
        </div>

        <div
          className="absolute bottom-0 left-1/2 z-[10]"
          style={{ transform: "translateX(-50%)", height: "72vh" }}
        >
          <img
            src={socialCharacter}
            alt="Illustrated Social character standing proudly"
            className="h-full w-auto object-contain object-bottom will-change-transform"
            loading="eager"
            style={{
              animation: floating ? "mamiAboutFloat 4s ease-in-out infinite" : "none",
              filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.45))",
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full z-[20]">
          <ScallopDivider color={CREAM} direction="down" />
        </div>
      </section>

      {/* ── SECTION 2: HOW IT ALL BEGAN ─────────────────────────── */}
      <section className="pt-24 pb-0" style={{ backgroundColor: CREAM }} id="story">
        <FadeUp className="max-w-[560px] mx-auto text-center px-6">
          <p className="section-label mb-5">How It All Began</p>
          <GoldOrnament className="mb-7" />
          <h2
            className="font-display italic leading-[1.2] mb-10"
            style={{ fontSize: "clamp(32px, 4.5vw, 44px)", color: BROWN }}
          >
            A room for it
          </h2>
          <div className="space-y-6 font-body text-[14px] leading-[1.85] mb-14" style={{ color: BROWN }}>
            <p>
              South Indian food is on menus from Times Square to Singapore. Waterloo Region has
              the appetite for it, and the people. What it did not have was the room.
            </p>
            <p>
              Not a dosa counter with a liquor licence. A South Indian kitchen with a real bar,
              where the evening is the point and the table is yours for as long as you want it.
            </p>
            <p>
              Kerala and Tamil cooking, plates built for the middle of the table, and somewhere
              to sit with all of it. That is Madras Social, on Erb Street West.
            </p>
          </div>
        </FadeUp>

        {/* Chennai to Waterloo, the same graphic that closes this story on the
            homepage teaser. Full-bleed, own crop per breakpoint. */}
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

      {/* ── SECTION 4: OUR VALUES ───────────────────────────────── */}
      {/*
        REBUILT 2026-09-22. The old asset (`values-full.png`) had this whole
        section — heading, all four values, every word — baked into the image
        as pixels, including "No shortcuts. Mami never used shortcuts, and
        neither do we." A raster claim about someone else's restaurant's
        history is not fixable by cropping; the source PNG genuinely had no
        text-free version. It does now: `our-values-bg.jpg` is the same
        illustration with nothing baked in but the character and the mustard
        ground (found the studio's own textless export, in
        public/images/about/, at 6605x4088 — the version this page never
        actually used). The one thing still drawn onto the art is the small
        flower medallion on her tumbler, which is fine: it is Madras Social's
        own mark, the same shape as the site favicon.

        The four values keep their original wording, minus that one false
        line — "No shortcuts. Ground fresh, cooked slow, served with love."
        reads the same without a company that has no connection to this one.
        Nothing else here is invented; ask before adding anything that is not
        already live copy.

        Real text now, not a picture of text — this was the strategy the
        original comment described and never built. Desktop overlays it on
        the image, positioned to land in the plain mustard ground beside her,
        the same place the old baked-in copy did. Mobile gets the same words
        stacked in a mustard panel below the image, per that same original
        plan, because there is nowhere on a phone-width crop of this
        illustration to lay out four value blocks and keep them legible.
      */}
      <section id="values" className="relative overflow-hidden">
        <img
          src={valuesBg}
          alt="Our Values"
          className="w-full h-auto block"
          loading="lazy"
        />

        {/* Desktop overlay — positioned as percentages of the image, so it
            tracks the art at any width. */}
        <div className="hidden lg:block absolute inset-0" style={{ color: BROWN }}>
          <div className="absolute" style={{ left: "6%", bottom: "8%", maxWidth: "20%" }}>
            <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-2 opacity-70">
              What We Believe
            </p>
            <h2 className="font-display italic" style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}>
              Our Values
            </h2>
          </div>

          <div className="absolute flex flex-col justify-between" style={{ left: "63%", right: "4%", top: "8%", bottom: "8%" }}>
            {VALUES.map((v) => (
              <div key={v.title} className="flex items-start gap-4">
                <GoldOrnament className="mt-2 shrink-0 scale-75 origin-top-left" />
                <div>
                  <h3 className="font-display" style={{ fontSize: "clamp(18px, 1.6vw, 26px)" }}>
                    {v.title}
                  </h3>
                  <p className="font-body text-[13px] leading-[1.6] mt-1 max-w-[34ch]">
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile — same values, stacked below the image instead of overlaid on
          it (the original plan for this breakpoint; see the note above). */}
      <section className="lg:hidden px-6 py-12" style={{ backgroundColor: "#C9A55C" }}>
        <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-1 text-center" style={{ color: BROWN, opacity: 0.7 }}>
          What We Believe
        </p>
        <h2 className="font-display italic text-center mb-8" style={{ fontSize: "34px", color: BROWN }}>
          Our Values
        </h2>
        <div className="flex flex-col gap-7 max-w-[420px] mx-auto">
          {VALUES.map((v) => (
            <div key={v.title} className="flex items-start gap-4">
              <GoldOrnament className="mt-1 shrink-0 scale-75 origin-top-left" />
              <div>
                <h3 className="font-display text-[19px]" style={{ color: BROWN }}>{v.title}</h3>
                <p className="font-body text-[13px] leading-[1.6] mt-1" style={{ color: BROWN }}>
                  {v.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: AMBIENT PHOTO BANNER ─────────────────────── */}
      <section className="w-full overflow-hidden" style={{ height: "50vh" }} id="ambient">
        <img
          src={ambientBg}
          alt="Madras Social restaurant dining room — warm, welcoming atmosphere"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
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
