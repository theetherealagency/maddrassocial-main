import { useEffect, useState } from "react";
import heroBanner from "@/assets/homepage-banner-desktop.png";
import heroBannerMobile from "@/assets/homepage-banner-mobile.png";
import ScallopDivider from "./ScallopDivider";

/**
 * Client feedback, 2026-09-23: the hero had no visible text at all — the
 * banner's own alt copy never made it onto the page as something a visitor
 * could actually read, and it wanted an animation, not a static drop-in.
 * Copy replaced again the same day with client-supplied lines: eyebrow
 * "South Indian Kitchen & Bar · Waterloo Region", headline "Spice has a
 * social life." (was the site's `MENU_TAGLINE`, "Southern roots. Social
 * plates.", which is still used elsewhere — Menu.tsx, seo/site.mjs).
 *
 * The artwork's top band is a flat, empty cream field with plenty of room —
 * measured, not eyeballed: full width, y 0–28% on the desktop crop and
 * y 0–34% on the mobile crop, before the dancer's crown or either skyline
 * silhouette begins. Text sits centred in that band.
 *
 * MOBILE STARTS BELOW THE FIXED NAVBAR, NOT AT Y=0. HomeNavbar is
 * `fixed`/`bg-transparent` until scrolled, so anything placed at the very
 * top of the hero collides with the logo and nav links sitting on top of
 * it. On the desktop crop this never showed: at typical desktop widths the
 * 28%-tall band is comfortably taller than the 70px navbar, so centred text
 * clears it with room to spare. On the mobile crop the same band is only
 * ~100–120px tall at typical phone widths — barely more than the navbar
 * itself — so mobile text is anchored to a fixed 78px offset (just past the
 * 70px nav) instead of centred in the band, and the eyebrow is shortened to
 * fit the width without needing the desktop copy's full tracking.
 *
 * The animation runs on mount, not on scroll — this is the first thing on
 * the page, already in view at load, so an IntersectionObserver (used
 * everywhere else on this site for scroll-reveals) would never fire until
 * the user scrolled away and back. A one-shot "mounted" flag staggers the
 * eyebrow in just ahead of the heading.
 */
const HomeHero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative w-full md:overflow-hidden" id="home">
      <h1 className="sr-only">Madras Social — A South Indian Kitchen and Bar in Waterloo</h1>
      {/* Desktop banner */}
      <img
        src={heroBanner}
        alt="Madras Social — spice has a social life"
        className="hidden md:block w-full h-auto relative"
        loading="eager"
      />
      {/* Mobile banner — full width, no cropping */}
      <img
        src={heroBannerMobile}
        alt="Madras Social — spice has a social life"
        className="block md:hidden w-full h-auto"
        loading="eager"
      />

      {/* Desktop hero text — was vertically centred in the empty top 28% of
          the artwork, which for a short one-line headline put it right up
          against the nav (client feedback, 2026-09-23 — "very attached to
          the header... should be a bit lower"). Anchored to a fixed
          top offset instead, same fix as the mobile block already used. */}
      <div
        className="hidden md:flex absolute inset-x-0 flex-col items-center justify-start text-center px-6"
        style={{ top: "110px" }}
        aria-hidden="true"
      >
        <p
          className="section-label mb-3 transition-all duration-700 ease-out"
          style={{
            color: "#a83d24",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
          }}
        >
          South Indian Kitchen &amp; Bar · Waterloo Region
        </p>
        <p
          className="font-display italic text-brown-brand transition-all duration-700 ease-out delay-150"
          style={{
            fontSize: "clamp(30px, 4vw, 52px)",
            lineHeight: 1.2,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Spice has a social life.
        </p>
      </div>

      {/* Mobile hero text — anchored just below the fixed navbar (see note
          above), not centred in the artwork's clear band. */}
      <div
        className="flex md:hidden absolute inset-x-0 flex-col items-center text-center px-5"
        style={{ top: "78px" }}
        aria-hidden="true"
      >
        <p
          className="mb-1 transition-all duration-700 ease-out"
          style={{
            color: "#a83d24",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "9px",
            lineHeight: 1.5,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
          }}
        >
          South Indian Kitchen &amp; Bar · Waterloo Region
        </p>
        <p
          className="font-display italic text-brown-brand transition-all duration-700 ease-out delay-150"
          style={{
            fontSize: "24px",
            lineHeight: 1.2,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
          }}
        >
          Spice has a social life.
        </p>
      </div>

      {/* Scalloped bottom edge */}
      <div className="absolute bottom-0 left-0 w-full z-[20]">
        <ScallopDivider color="#F2EDE4" direction="down" />
      </div>
    </section>
  );
};

export default HomeHero;
