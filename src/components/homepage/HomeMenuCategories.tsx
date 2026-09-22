import { Link } from "react-router-dom";
import GoldOrnament from "./GoldOrnament";
import menuCardImage from "@/assets/homepage-menu-tapas.png";

/**
 * Four categories, one card style, one line.
 *
 * Replaces the old "Discover the Menu" section (alternating wide panels,
 * each with its own image slideshow) at the client's request, 2026-09-22.
 * The card design comes from the client's own supplied asset
 * (`home page/homepage menu food card.png`) — a portrait photo with a solid
 * bar baked into the bottom 25% of the frame, sized for a category label and
 * a title. The bar shipped Carbon (#1f1b1a); recoloured to terracotta
 * (#9c3821, sampled from the Our Story map's own ground) at the client's
 * request the same day, so the card matches the section above it. Edit
 * `homepage-menu-tapas.png` directly if that ever needs to change again —
 * the color is baked into the photo, not drawn by this component.
 * `menuCardImage` is the only real Madras Social food photo supplied so far,
 * so all four cards use it for now; swap each card's `image` in
 * `CATEGORIES` below as real photography per category arrives — nothing
 * else about the layout changes.
 *
 * Categories are the real menu section names from `seo/site.mjs`, not
 * invented ones, so the labels stay true even before each has its own photo.
 */
type Category = {
  label: string;
  title: string;
  blurb: string;
  image: string;
};

const CATEGORIES: Category[] = [
  {
    label: "Small Plates",
    title: "Madras Tapas",
    blurb: "For the middle of the table.",
    image: menuCardImage,
  },
  {
    label: "From the Tava",
    title: "Dosa District",
    blurb: "Crisp at the edge, made to tear.",
    image: menuCardImage,
  },
  {
    label: "Mains",
    title: "Main Affairs",
    blurb: "Built for the centre of the table.",
    image: menuCardImage,
  },
  {
    label: "Desserts",
    title: "Sweet Social",
    blurb: "Save room.",
    image: menuCardImage,
  },
];

const MenuCard = ({ category }: { category: Category }) => (
  <Link
    to="/menu"
    className="group relative block w-full overflow-hidden rounded-lg md:rounded-xl shadow-card"
    style={{ aspectRatio: "1080 / 1440" }}
    aria-label={`View the ${category.title} menu`}
  >
    <img
      src={category.image}
      alt={`${category.title} — ${category.blurb}`}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
    {/* Sits inside the Carbon bar already painted into the bottom 25% of the
        source photo — see the note above. Positioned as a percentage of the
        card, not fixed pixels, so it tracks that bar at every card size. */}
    <div
      className="absolute inset-x-0 bottom-0 flex flex-col justify-center px-3 md:px-5"
      style={{ height: "25%" }}
    >
      {/* Gold read fine on the bar's old Carbon; it nearly disappears on
          terracotta (too close in hue/luminance). Offwhite at reduced
          opacity keeps the same visual hierarchy — quieter than the title —
          without losing contrast. */}
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
