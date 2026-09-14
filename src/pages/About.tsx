import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";
import FloatingOrderCTA from "@/components/FloatingOrderCTA";
import ScallopDivider from "@/components/homepage/ScallopDivider";
import heroBanner from '../assets/madras mami our story banner 2.png';
import heroBannerMobile from '../assets/about-hero-mobile.png';
import grungeTexture from '../assets/grunge-wall-texture.jpg';
import blackGradient from '../assets/black gradient.png';
import aboutOurSpace from '../assets/about-our-space.png';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const reveal = (visible: boolean) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: "opacity 600ms ease-out, transform 600ms ease-out",
} as React.CSSProperties);

const About = () => {
  const story = useReveal();

  return (
    <div className="min-h-screen overflow-x-hidden w-full" style={{ backgroundColor: "#f3ead3" }}>
      <Header />

      {/* ── HERO BANNER ── */}
      <h1 className="sr-only">About Madras Mami — Authentic South Indian Restaurant in Brampton</h1>
      <section className="relative overflow-hidden md:h-[380px]">
        {/* Desktop */}
        <img src={heroBanner} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center hidden md:block" loading="eager" />
        {/* Mobile - full width, no cropping */}
        <img src={heroBannerMobile} alt="" aria-hidden="true" className="block md:hidden w-full h-auto" loading="eager" />
        <img src={grungeTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none hidden md:block" style={{ opacity: 0.08 }} />
        <img src={blackGradient} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none hidden md:block" style={{ opacity: 0.5 }} />
        <div className="absolute bottom-0 left-0 w-full z-[8]">
          <ScallopDivider color="#f3ead3" direction="down" />
        </div>
      </section>

      {/* ── HOW IT ALL BEGAN ── */}
      <section className="py-8 md:py-24 px-5 md:px-6" style={{ backgroundColor: "#f3ead3" }}>
        <div ref={story.ref} className="max-w-[680px] mx-auto text-center" style={reveal(story.visible)}>
          <p className="font-body font-medium text-[10px] uppercase tracking-[0.4em] mb-4 md:mb-5" style={{ color: "hsl(46,70%,55%)" }}>
            How It All Began
          </p>
          <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
            <div style={{ width: "48px", height: "1px", backgroundColor: "hsl(46,70%,55%)", opacity: 0.5 }} />
            <span style={{ color: "hsl(46,70%,55%)", fontSize: "18px" }}>✦</span>
            <div style={{ width: "48px", height: "1px", backgroundColor: "hsl(46,70%,55%)", opacity: 0.5 }} />
          </div>
          <h2 className="font-display leading-[1.2] md:leading-[1.15] mb-6 md:mb-10 text-[24px] md:text-[clamp(36px,5vw,52px)]" style={{ color: "hsl(var(--mud))" }}>
            From Chennai to Brampton
          </h2>
          <div className="space-y-4 md:space-y-6 font-body leading-[1.6] md:leading-[1.8] text-[14px] md:text-[15px]" style={{ color: "hsl(29,30%,32%)" }}>
            <p>
              Madras Mami was born from a craving that every South Indian living abroad knows too well — the craving
              for amma's filter coffee on a cold Canadian morning, for the sound of dough batter sizzling on a cast iron
              tava, for sambar that tastes like it was simmered by generations before us.
            </p>
            <p>
              We realised that thousands of us in the GTA shared this same longing. Not just for the food, but for the
              feeling — the warmth of a home kitchen, the chaos of a Chennai eatery, the quiet ritual of breaking idlis
              in sambar while amma watches you eat.
            </p>
            <p>
              That is what Madras Mami brings to your table. Not just dishes, but memories. Not just flavors, but the
              feeling of being home.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR SPACE ── */}
      <img src={aboutOurSpace} alt="Our Space — restaurant interior collage" style={{ width: "100%", height: "auto", display: "block", margin: 0, padding: 0 }} loading="lazy" />

      {/* ── OUR VALUES ── */}
      <div className="px-4 md:px-20" style={{ backgroundColor: "#f3ead3", position: "relative", zIndex: 2 }}>
        <img src="/lovable-uploads/mm-about-21.png" alt="Our Values" style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
      </div>

      <HomeFooter />
      <FloatingOrderCTA />
    </div>
  );
};

export default About;
