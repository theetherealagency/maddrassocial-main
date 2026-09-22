import { useState } from "react";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";
import FloatingOrderCTA from "@/components/FloatingOrderCTA";
import { ONLINE_ORDER_URL } from "@/lib/links";
import madrasCover from "@/assets/menu-cover-madras.png";
import socialCover from "@/assets/menu-cover-social.png";
import {
  FOOD_SECTIONS,
  DRINKS_SECTIONS,
  SIGNATURE_COCKTAILS,
  type MenuSection,
  type MenuItem,
} from "@/data/menuBookData";

/**
 * A book, not a page of tabs — client request, 2026-09-22: "the menu page
 * should show a book menu style with a leather cover with madras and social
 * written as it is on menu pdf."
 *
 * MADRAS IS THE FOOD MENU, SOCIAL IS THE DRINKS MENU — that split, and the
 * exact cover art, comes straight from the client's own two PDFs
 * (`Madras Social Menu - FOOD.pdf` / `... - DRINKS.pdf`). Each PDF opens on
 * a two-tone spread — the food PDF's is green "MADRAS" panel / terracotta
 * right half; the drinks PDF's is terracotta "SOCIAL" panel / green right
 * half. `menu-cover-madras.png` and `menu-cover-social.png` are the two
 * giant-letter panels, cropped straight out of those PDFs at 300dpi — not
 * redrawn, so the wordmark and the etched dancer motif are the client's own.
 *
 * The closed book shows both covers side by side, Madras on the left,
 * Social on the right, exactly as asked. Clicking a cover flips it open
 * on a CSS 3D hinge (perspective + rotateY, transform-style: preserve-3d,
 * backface-visibility: hidden on both faces) — a real flip, not a fade —
 * and the flipped-open cover reveals that menu, scrollable, in the space
 * behind it. The other cover stays closed; either can be opened
 * independently, and closing one puts the book back to its landing state.
 */

type OpenSide = "madras" | "social" | null;

const ItemRow = ({ item }: { item: MenuItem }) => (
  <li className="border-b border-[hsl(var(--color-brown))]/10 pb-3">
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-body font-medium text-[14px] text-[hsl(var(--color-brown))]">
        {item.name}
        {item.veg && (
          <span
            className="ml-2 text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "hsl(var(--color-green))" }}
            title="Vegan"
          >
            vegan
          </span>
        )}
      </span>
      <span className="font-body text-[13px] whitespace-nowrap text-[hsl(var(--color-gold))]">
        {item.price}
      </span>
    </div>
    {item.description && (
      <p className="font-body text-[12.5px] mt-1 leading-[1.5] text-[hsl(var(--color-brown))]/70">
        {item.description}
      </p>
    )}
  </li>
);

const SectionBlock = ({ section }: { section: MenuSection }) => (
  <section className="mb-10">
    <h3 className="font-display text-[20px] md:text-[24px] mb-1 text-[hsl(var(--color-brown))]">
      {section.name}
    </h3>
    {section.tagline && (
      <p className="font-accent italic text-[13px] mb-1 text-[hsl(var(--color-gold))]">
        {section.tagline}
      </p>
    )}
    {section.note && (
      <p className="font-body text-[10px] uppercase tracking-[0.1em] mb-4 text-[hsl(var(--color-brown))]/60">
        {section.note}
      </p>
    )}
    <ul className="flex flex-col gap-3 mt-4">
      {section.items.map((item) => (
        <ItemRow key={item.name} item={item} />
      ))}
    </ul>
  </section>
);

/**
 * The book's front cover, before it opens — the client's own PDF art.
 * This is the ONLY clickable surface on the closed side. It is a real
 * `<button>`; the card around it (and the open menu behind it) is not,
 * because a scrollable menu nested inside one giant clickable wrapper
 * would re-toggle closed on every scroll or tap while reading it.
 */
const CoverFace = ({
  src,
  alt,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={`Open the ${label} menu`}
    className="absolute inset-0 [backface-visibility:hidden] overflow-hidden text-left w-full h-full"
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" loading="eager" />
    <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-10 pointer-events-none">
      <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--offwhite))]/80 border border-[hsl(var(--offwhite))]/40 rounded-full px-4 py-2 backdrop-blur-sm">
        Open the {label} menu
      </span>
    </div>
  </button>
);

/** What sits behind a cover once it has flipped open — real, scrollable menu. */
const MenuPages = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div
    className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto"
    style={{ backgroundColor: "hsl(var(--color-cream))" }}
  >
    <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[hsl(var(--color-gold))]/25" style={{ backgroundColor: "hsl(var(--color-cream))" }}>
      <p className="font-display italic text-[18px] md:text-[22px] text-[hsl(var(--color-brown))]">
        {title}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="font-body text-[11px] uppercase tracking-[0.2em] border border-[hsl(var(--color-brown))]/30 rounded-full px-3 py-1.5 text-[hsl(var(--color-brown))] hover:bg-[hsl(var(--color-brown))] hover:text-[hsl(var(--color-cream))] transition-colors"
      >
        Close ✕
      </button>
    </div>
    <div className="px-5 md:px-8 py-6 md:py-8">{children}</div>
  </div>
);

const Menu = () => {
  const [open, setOpen] = useState<OpenSide>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="relative pt-16">
        <h1 className="sr-only">Madras Social Menu — South Indian Food and Drink in Waterloo</h1>

        <div className="py-10 md:py-16 px-4">
          <p className="section-label text-center mb-2">The Menu</p>
          <h2 className="heading-display text-[28px] md:text-[40px] text-center mb-10 md:mb-14">
            Let's get into it.
          </h2>

          {/*
            The book. `perspective` lives on this wrapper so both covers
            hinge in the same 3D space. Each cover is its own flip card:
            a fixed-aspect box holding two faces glued back-to-back
            (front = PDF cover art, back = the scrollable menu), rotated
            as one unit. Height is a fixed vh figure rather than aspect-
            ratio because the OPEN state needs real scroll height for a
            long menu, not the cover's own portrait aspect.
          */}
          <div
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            style={{ perspective: "2400px" }}
          >
            {/* MADRAS — the food menu */}
            <div
              className="relative w-full rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              style={{
                height: "min(78vh, 780px)",
                transformStyle: "preserve-3d",
                transition: "transform 0.9s cubic-bezier(0.65,0,0.35,1)",
                transform: open === "madras" ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <CoverFace
                src={madrasCover}
                alt="Madras — the food menu cover, as printed"
                label="Madras"
                onOpen={() => setOpen("madras")}
              />
              <MenuPages title="Madras — Food" onClose={() => setOpen(null)}>
                {FOOD_SECTIONS.map((section) => (
                  <SectionBlock key={section.name} section={section} />
                ))}
              </MenuPages>
            </div>

            {/* SOCIAL — the drinks menu */}
            <div
              className="relative w-full rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              style={{
                height: "min(78vh, 780px)",
                transformStyle: "preserve-3d",
                transition: "transform 0.9s cubic-bezier(0.65,0,0.35,1)",
                transform: open === "social" ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <CoverFace
                src={socialCover}
                alt="Social — the drinks menu cover, as printed"
                label="Social"
                onOpen={() => setOpen("social")}
              />
              <MenuPages title="Social — Drinks" onClose={() => setOpen(null)}>
                <section className="mb-10">
                  <h3 className="font-display text-[20px] md:text-[24px] mb-1 text-[hsl(var(--color-brown))]">
                    Signature Cocktails
                  </h3>
                  <p className="font-accent italic text-[13px] mb-4 text-[hsl(var(--color-gold))]">
                    Six Regions • Six Stories • One Taste
                  </p>
                  <ul className="flex flex-col gap-3 mt-4">
                    {SIGNATURE_COCKTAILS.map((item) => (
                      <ItemRow key={item.name} item={item} />
                    ))}
                  </ul>
                  <div
                    className="mt-6 rounded-md p-4"
                    style={{ backgroundColor: "hsl(var(--color-gold))", color: "hsl(var(--color-cream))" }}
                  >
                    <p className="font-display text-[16px] mb-1">Feeling Adventurous?</p>
                    <p className="font-body text-[12.5px] leading-[1.5]">
                      Ask our bar team for something unique. Tell us what
                      flavours you love, and we'll create a little Madras
                      magic just for you.
                    </p>
                  </div>
                </section>
                {DRINKS_SECTIONS.map((section) => (
                  <SectionBlock key={section.name} section={section} />
                ))}
              </MenuPages>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
      <FloatingOrderCTA href={ONLINE_ORDER_URL} />
    </div>
  );
};

export default Menu;
