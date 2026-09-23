import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoldOrnament from "./GoldOrnament";
import menuPunugulu from "@/assets/menu-punugulu.jpg";
import menuArancini from "@/assets/menu-arancini.jpg";
import menuShrimpWrap from "@/assets/menu-shrimp-wrap.jpg";
import menuParotta from "@/assets/menu-parotta.jpg";
import menuSlide1 from "@/assets/menu-slide-1.jpg";
import menuSlide2 from "@/assets/menu-slide-2.jpg";
import menuSlide3 from "@/assets/menu-slide-3.jpg";
import menuSlide4 from "@/assets/menu-slide-4.jpg";
import menuSlide5 from "@/assets/menu-slide-5.jpg";
import menuCocktailChettinad from "@/assets/menu-cocktail-chettinad.jpg";
import menuCocktailCoromandel from "@/assets/menu-cocktail-coromandel.jpg";
import menuCocktailMule from "@/assets/menu-cocktail-mule.jpg";

/**
 * Two food cards, two drink cards — client request, 2026-09-23: "keep 2
 * cards for food and 2 for drinks... take original category names from the
 * menu" (was four cards, all food, with copy that didn't come from the real
 * menu at all).
 *
 * Names/taglines below are the real section names and taglines from
 * `src/data/menuBookData.ts` (the file transcribed from the client's own
 * menu PDFs), not invented:
 *   - "Madras Tapas" — "Small plates with a southern attitude."
 *   - "Dosa District" — "Crisp, comforting and made to tear & share."
 *   - "Signature Cocktails" — "Six Regions • Six Stories • One Taste"
 *     (the same tagline Menu.tsx already uses above this section)
 *   - "Madras Refreshers" — no tagline in the source PDF, so the line here
 *     just names three real items from that section rather than inventing
 *     a claim.
 *
 * Photos, client-supplied 2026-09-23 ("use these images for to share -
 * cheese chicken pungullu, soya chaap archni, honey chilli shrimp then for
 * from the tawa - parotta, dosa, benne"): these are real dish photography
 * from the "Named Photos" batch (same Drive drop as the Instagram tiles),
 * which earlier in this project used an old TIFF/JPEG variant no tool could
 * decode (ImageMagick, PIL, sips, ffmpeg all failed) — `tifffile` +
 * `imagecodecs` (installed this session) finally opened it. Only Parotta
 * was actually supplied for "From the Tava" — there is no Dosa or Benne
 * photo in the batch, so that card's slideshow is Parotta alone rather than
 * a fabricated substitute.
 *
 * Cocktail photos, client-supplied same day from a Downloads/ALCOHOLIC
 * folder ("use for cocktails the images from alcoholic folder all three"):
 * Chettinad and Coromandel are named after real drinks on the Signature
 * Cocktails list (`SIGNATURE_COCKTAILS` in menuBookData.ts — Vodka • Rasam
 * • Citrus • Floral • South Indian Spices; Rum • Coconut • Pineapple • Lime
 * • Herbs, respectively), matching what's in each shot. The third (copper
 * mule mugs, ginger and mint) has no name in the file but fits the same
 * list's Mangaluru (Curry Leaves Reposado • Ginger Lime • Tropical Fruits).
 * The non-alcoholic card has no drink-specific photography, so it keeps the
 * general food-photography pool (real Madras Social photos, just not
 * drink-specific) for ambiance.
 */
const SLIDE_INTERVAL_MS = 3200;
const GENERAL_SLIDES = [menuSlide1, menuSlide2, menuSlide3, menuSlide4, menuSlide5];
const COCKTAIL_SLIDES = [menuCocktailChettinad, menuCocktailCoromandel, menuCocktailMule];

type Category = {
  label: string;
  title: string;
  blurb: string;
  slides: string[];
};

const CATEGORIES: Category[] = [
  {
    label: "To Share",
    title: "Madras Tapas",
    blurb: "Small plates with a southern attitude.",
    slides: [menuPunugulu, menuArancini, menuShrimpWrap],
  },
  {
    label: "From the Tava",
    title: "Dosa District",
    blurb: "Crisp, comforting and made to tear & share.",
    slides: [menuParotta],
  },
  {
    label: "To Drink",
    title: "Signature Cocktails",
    blurb: "Six Regions • Six Stories • One Taste",
    slides: COCKTAIL_SLIDES,
  },
  {
    label: "Non-Alcoholic",
    title: "Madras Refreshers",
    blurb: "Filter kapi, nannari sharbat, mango moru.",
    slides: GENERAL_SLIDES,
  },
];

const MenuCard = ({ category, offset }: { category: Category; offset: number }) => {
  const { slides } = category;
  const [active, setActive] = useState(offset % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <Link
      to="/menu"
      className="group relative block w-full overflow-hidden rounded-lg md:rounded-xl shadow-card bg-brown-brand"
      style={{ aspectRatio: "1080 / 1440" }}
      aria-label={`View the ${category.title} menu`}
    >
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === active ? `${category.title} — ${category.blurb}` : ""}
          aria-hidden={i !== active}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out group-hover:scale-105"
          style={{
            opacity: i === active ? 1 : 0,
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms, 500ms",
          }}
          loading="lazy"
        />
      ))}
      {/* Gradient scrim — the photos have no baked-in bar the way the old
          single card image did, so the label/title need their own contrast
          layer over whatever frame is showing. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(31,27,26,0.88), rgba(31,27,26,0) 100%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-3 pb-3 md:px-5 md:pb-5"
        style={{ height: "45%" }}
      >
        <p className="font-body font-medium text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-offwhite/75 mb-1 md:mb-1.5">
          {category.label}
        </p>
        <h3 className="font-display text-[16px] md:text-[22px] lg:text-[26px] text-offwhite leading-[1.15]">
          {category.title}
        </h3>
        <p className="hidden md:block font-body text-[11px] text-offwhite/70 mt-1">
          {category.blurb}
        </p>
      </div>
    </Link>
  );
};

const HomeMenuCategories = () => {
  return (
    <section className="py-10 md:py-[80px] lg:py-[100px] px-4 md:px-6" style={{ backgroundColor: "#F2EDE4" }} id="menu">
      <h2 className="heading-display text-[26px] md:text-[44px] lg:text-[52px] text-center mb-2 md:mb-3">
        What's on the Table
      </h2>
      <GoldOrnament className="mb-6 md:mb-10 mx-auto" />

      {/*
        Exactly 4 cards now (2 food, 2 drinks) — the same "swipe two pages of
        two" mobile layout still fits perfectly, no change needed there.
        `md:contents` is what makes one markup serve both layouts: below md
        each wrapper is a real element — a snap-locked, full-width flex child
        holding its own 2-col grid. At md and up `display:contents` removes
        the wrapper from layout entirely, so its two cards become direct
        children of the outer `md:grid md:grid-cols-4` and fall into the
        single row like the other pair's cards do.
      */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-4 md:overflow-visible gap-3 md:gap-4 max-w-[1200px] mx-auto">
        <div className="flex-none w-full snap-start grid grid-cols-2 gap-3 md:contents">
          <MenuCard category={CATEGORIES[0]} offset={0} />
          <MenuCard category={CATEGORIES[1]} offset={1} />
        </div>
        <div className="flex-none w-full snap-start grid grid-cols-2 gap-3 md:contents">
          <MenuCard category={CATEGORIES[2]} offset={2} />
          <MenuCard category={CATEGORIES[3]} offset={3} />
        </div>
      </div>

      {/* Two dots, mobile only — the only hint that there is a second page to
          swipe to, since the cards fill the screen edge to edge and leave no
          peek of the next one showing. */}
      <div className="flex md:hidden justify-center gap-1.5 mt-4">
        <span className="h-1.5 w-1.5 rounded-full bg-brown-brand/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-brown-brand/30" />
      </div>

      <div className="text-center mt-6 md:mt-10">
        <Link to="/menu" className="cta-link text-[11px]" aria-label="View the full menu">
          VIEW FULL MENU <span className="cta-arrow">→</span>
        </Link>
      </div>
    </section>
  );
};

export default HomeMenuCategories;
