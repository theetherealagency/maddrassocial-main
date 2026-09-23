import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoldOrnament from "./GoldOrnament";
import menuSlide1 from "@/assets/menu-slide-1.jpg";
import menuSlide2 from "@/assets/menu-slide-2.jpg";
import menuSlide3 from "@/assets/menu-slide-3.jpg";
import menuSlide4 from "@/assets/menu-slide-4.jpg";
import menuSlide5 from "@/assets/menu-slide-5.jpg";

/**
 * Four categories, one card style, one line.
 *
 * Replaces the old "Discover the Menu" section (alternating wide panels,
 * each with its own image slideshow) at the client's request, 2026-09-22.
 *
 * Client request, 2026-09-23: "show images behind the overlay sliding as a
 * video" — the old single static photo (`homepage-menu-tapas.png`, with a
 * solid colour bar baked into the bottom 25% of the frame for the label and
 * title) is replaced by a crossfading slideshow of the client's own real
 * food photography, supplied via Drive ("Edited" folder — the same Sony
 * ILCE-7M4 shoot used for the Instagram tiles; see InstagramFeed.tsx for
 * the provenance note and the RAW batch that had to be skipped). Since
 * these photos have no baked-in bar, the label/title now sit on a CSS
 * gradient scrim instead.
 *
 * All four cards draw from the same 5-photo pool, each starting at a
 * different offset (`SLIDES.length` doesn't divide 4 evenly, so no two
 * cards ever show the same photo at the same moment) — a shared rotation
 * reads as one continuous, alive motion across the grid rather than four
 * separate slideshows ticking in sync. Categories are the real menu
 * section names from `seo/site.mjs`, not invented ones.
 */
const SLIDES = [menuSlide1, menuSlide2, menuSlide3, menuSlide4, menuSlide5];
const SLIDE_INTERVAL_MS = 3200;

type Category = {
  label: string;
  title: string;
  blurb: string;
};

const CATEGORIES: Category[] = [
  { label: "Small Plates", title: "Madras Tapas", blurb: "For the middle of the table." },
  { label: "From the Tava", title: "Dosa District", blurb: "Crisp at the edge, made to tear." },
  { label: "Mains", title: "Main Affairs", blurb: "Built for the centre of the table." },
  { label: "Desserts", title: "Sweet Social", blurb: "Save room." },
];

const MenuCard = ({ category, offset }: { category: Category; offset: number }) => {
  const [active, setActive] = useState(offset % SLIDES.length);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <Link
      to="/menu"
      className="group relative block w-full overflow-hidden rounded-lg md:rounded-xl shadow-card bg-brown-brand"
      style={{ aspectRatio: "1080 / 1440" }}
      aria-label={`View the ${category.title} menu`}
    >
      {SLIDES.map((src, i) => (
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
        Discover the Menu
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
