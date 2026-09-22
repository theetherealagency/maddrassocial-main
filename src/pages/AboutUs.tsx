import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import ScallopDivider from "@/components/homepage/ScallopDivider";
import GoldOrnament from "@/components/homepage/GoldOrnament";
import HomeFooter from "@/components/homepage/HomeFooter";
import mamiCharacter from "@/assets/social-character-hero.png";

import heroBg from "@/assets/hero-temple-street.png";
import ambientBg from "@/assets/entrance-3d-view.png";
import valuesFull from "@/assets/values-full.png";

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
            src={mamiCharacter}
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
        Image used: /images/about/madras social about us page_about us values sec without text.png
        Shows: Social character (woman in white saree with sunglasses, drinking from brass tumbler)
               on warm mustard/gold background with cream scalloped borders at top and bottom.
        Strategy: full-width image as section visual, text overlaid absolutely on lg screens.
                  On mobile: image shown + values rendered below in mustard block.
      */}
      <section id="values">
        <img
          src={valuesFull}
          alt="Our values"
          className="w-full h-auto block"
          loading="lazy"
        />
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
