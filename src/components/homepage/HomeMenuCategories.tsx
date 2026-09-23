import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoldOrnament from "./GoldOrnament";
import menuSlide1 from "@/assets/menu-slide-1.jpg";
import menuSlide2 from "@/assets/menu-slide-2.jpg";
import menuSlide3 from "@/assets/menu-slide-3.jpg";
import menuSlide4 from "@/assets/menu-slide-4.jpg";
import menuSlide5 from "@/assets/menu-slide-5.jpg";

/**
 * Four categories, one shared photo backdrop.
 *
 * Replaces the old "Discover the Menu" section (alternating wide panels,
 * each with its own image slideshow) at the client's request, 2026-09-22.
 *
 * Revised 2026-09-23 (round 2) — client: "pictures as slideshow behind the
 * cards with an overlay." The previous version had each card carry its own
 * crossfading photo; this instead runs ONE crossfading slideshow across the
 * whole section, with a dark scrim over it for legibility, and the four
 * cards sit on top as translucent glass panels (label/title/blurb only, no
 * photo of their own). Same 5-photo pool as before — the client's own food
 * photography, see InstagramFeed.tsx for provenance — just one shared
 * background layer instead of four independent ones.
 */
const SLIDES = [menuSlide1, menuSlide2, menuSlide3, menuSlide4, menuSlide5];
const SLIDE_INTERVAL_MS = 4000;

type Category = {
  label: string;
  title: string;
  blurb: string;
};

// Client-supplied copy, 2026-09-23 — replaced the old label/title/blurb set
// for three of the four cards (Small Plates, Mains, Desserts); "From the
// Tava" wasn't included in that pass, so it keeps its existing copy.
const CATEGORIES: Category[] = [
  { label: "To Share", title: "The First Round", blurb: "A good place to begin." },
  { label: "From the Tava", title: "Dosa District", blurb: "Crisp at the edge, made to tear." },
  { label: "For Dinner", title: "The Main Event", blurb: "Settle in for something more." },
  { label: "To Finish", title: "One More Thing", blurb: "Because the night is not over yet." },
];

const MenuCard = ({ category }: { category: Category }) => (
  <Link
    to="/menu"
    className="group relative flex flex-col justify-center items-center text-center w-full overflow-hidden rounded-lg md:rounded-xl border border-offwhite/25 bg-brown-brand/45 backdrop-blur-[3px] px-4 py-8 md:px-6 md:py-10 transition-colors duration-300 hover:bg-brown-brand/60"
    style={{ aspectRatio: "1080 / 1440" }}
    aria-label={`View the ${category.title} menu`}
  >
    <p className="font-body font-medium text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-offwhite/75 mb-2 md:mb-3">
      {category.label}
    </p>
    <h3 className="font-display text-[18px] md:text-[24px] lg:text-[28px] text-offwhite leading-[1.15]">
      {category.title}
    </h3>
    <p className="hidden md:block font-body text-[11px] text-offwhite/70 mt-2">
      {category.blurb}
    </p>
  </Link>
);

const HomeMenuCategories = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden py-10 md:py-[80px] lg:py-[100px] px-4 md:px-6" id="menu">
      {/* Shared background slideshow, one crossfade for the whole section. */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
            style={{ opacity: i === active ? 1 : 0, transitionDuration: "1500ms" }}
            loading="lazy"
          />
        ))}
        {/* Overlay — the photos are full-bleed and busy; heading, ornament
            and the card text all need one consistent contrast layer over
            whatever frame is showing. */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(rgba(31,27,26,0.6), rgba(31,27,26,0.72))" }}
        />
      </div>

      <div className="relative z-10">
        <h2 className="heading-display text-[26px] md:text-[44px] lg:text-[52px] text-center mb-2 md:mb-3 text-offwhite">
          What's on the Table
        </h2>
        <GoldOrnament className="mb-6 md:mb-10 mx-auto" />

        {/*
          "4 times in the same line" from md up — a plain 4-col grid.
          Below md, a 390px phone cannot hold four readable cards side by side,
          so it becomes a horizontal swipe of two pages, two cards each: the
          page on open shows cards 1-2, one swipe reveals 3-4 (client spec,
          2026-09-22).

          `md:contents` is what makes one markup serve both layouts: below md
          each wrapper is a real element — a snap-locked, full-width flex child
          holding its own 2-col grid. At md and up `display:contents` removes
          the wrapper from layout entirely, so its two cards become direct
          children of the outer `md:grid md:grid-cols-4` and fall into the
          single row like the other pair's cards do.
        */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-4 md:overflow-visible gap-3 md:gap-4 max-w-[1200px] mx-auto">
          <div className="flex-none w-full snap-start grid grid-cols-2 gap-3 md:contents">
            <MenuCard category={CATEGORIES[0]} />
            <MenuCard category={CATEGORIES[1]} />
          </div>
          <div className="flex-none w-full snap-start grid grid-cols-2 gap-3 md:contents">
            <MenuCard category={CATEGORIES[2]} />
            <MenuCard category={CATEGORIES[3]} />
          </div>
        </div>

        {/* Two dots, mobile only — the only hint that there is a second page to
            swipe to, since the cards fill the screen edge to edge and leave no
            peek of the next one showing. */}
        <div className="flex md:hidden justify-center gap-1.5 mt-4">
          <span className="h-1.5 w-1.5 rounded-full bg-offwhite/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-offwhite/40" />
        </div>

        <div className="text-center mt-6 md:mt-10">
          <Link to="/menu" className="cta-link text-[11px] text-offwhite" aria-label="View the full menu">
            VIEW FULL MENU <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeMenuCategories;
