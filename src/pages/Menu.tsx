import { useState, useRef, useEffect } from "react";
import HomeNavbar from "@/components/homepage/HomeNavbar";
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
 *
 * Client feedback, 2026-09-23: "the cards has to be the size where it
 * covers the names as pdf does" — the source art (menu-cover-madras.png /
 * menu-cover-social.png) is a very tall panel (900×2720, the giant letters
 * cascading the full height of the PDF page); `object-cover` inside this
 * box's much wider aspect was cropping most of that away. Switched to
 * `object-contain` so the whole tall panel — every letter — is always
 * visible, uncropped, at the source's own proportions. `bg` fills
 * whatever pillarboxing that leaves on the sides with the art's own flat
 * background colour (sampled from the PNG itself), so the letterboxing is
 * invisible rather than showing as bars. The small "MADRAS SOCIAL"
 * wordmark that used to sit over the top of the giant "M"/"S" has been
 * removed from the art entirely per the same feedback.
 */
const CoverFace = ({
  src,
  alt,
  label,
  bg,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  bg: string;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={`Open the ${label} menu`}
    className="absolute inset-0 [backface-visibility:hidden] overflow-hidden text-left w-full h-full"
    style={{ backgroundColor: bg, touchAction: "pan-y" }}
  >
    <img src={src} alt={alt} className="w-full h-full object-contain" loading="eager" />
    <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-10 pointer-events-none">
      <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--offwhite))]/80 border border-[hsl(var(--offwhite))]/40 rounded-full px-4 py-2 backdrop-blur-sm">
        Open the {label} menu
      </span>
    </div>
  </button>
);

/**
 * What sits behind a cover once it has flipped open — real, scrollable menu.
 *
 * Client, 2026-09-23: "menu page on mobile is not getting scrolled when
 * card is closed or open and we want to go to 2nd card" — reproduced: once
 * this div's own scroll reaches its bottom, further scroll/swipe does
 * nothing at all, trapping the page instead of continuing on to reveal the
 * second (Social) card below it. The cause is the 3D flip transform on the
 * ancestor card (`perspective` + `transform-style: preserve-3d` +
 * `backface-visibility: hidden`, needed for the open/close flip animation):
 * browsers don't reliably chain wheel/touch scroll from a nested
 * `overflow-y-auto` out to the page when it's inside that kind of 3D
 * transform context, even though the outer page has plenty of room to
 * scroll (confirmed — document scroll height is unchanged, only the
 * scroll *event* stops propagating). Fixed by watching this div's own
 * scroll boundary and, once reached, forwarding wheel/touch scroll to
 * `window` by hand instead of relying on the browser's default chaining.
 */
const MenuPages = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const atTop = () => el.scrollTop <= 0;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    const onWheel = (e: WheelEvent) => {
      if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBottom())) {
        window.scrollBy(0, e.deltaY);
        e.preventDefault();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY; // positive = finger moving up = scrolling down
      if ((deltaY < 0 && atTop()) || (deltaY > 0 && atBottom())) {
        window.scrollBy(0, deltaY);
        e.preventDefault();
      }
      touchStartY.current = currentY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto"
      style={{ backgroundColor: "hsl(var(--color-cream))", touchAction: "pan-y" }}
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
};

const Menu = () => {
  const [open, setOpen] = useState<OpenSide>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HomeNavbar />

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
            className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            style={{ perspective: "2400px" }}
          >
            {/* MADRAS — the food menu.
                touchAction: "pan-y" — client, 2026-09-24: "if i scroll from
                the card on menu i am not able to." A touch scroll STARTING
                on the closed cover (not yet opened) was also getting
                trapped by the same 3D-transform-blocks-scroll-chaining
                issue as the open panel, just with no JS boundary check to
                fall back on since there's no scrollable content here — the
                gesture just needs to reach the page underneath untouched.
                Explicit touch-action tells the browser to treat vertical
                drags here as normal page panning regardless of the 3D
                transform context. */}
            <div
              className="relative w-full rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              style={{
                height: "min(78vh, 780px)",
                transformStyle: "preserve-3d",
                transition: "transform 0.9s cubic-bezier(0.65,0,0.35,1)",
                transform: open === "madras" ? "rotateY(180deg)" : "rotateY(0deg)",
                touchAction: "pan-y",
              }}
            >
              <CoverFace
                src={madrasCover}
                alt="Madras — the food menu cover, as printed"
                label="Madras"
                bg="#414c2a"
                onOpen={() => setOpen("madras")}
              />
              <MenuPages title="Madras — Food" onClose={() => setOpen(null)}>
                {FOOD_SECTIONS.map((section) => (
                  <SectionBlock key={section.name} section={section} />
                ))}
              </MenuPages>
            </div>

            {/* SOCIAL — the drinks menu. Same touchAction fix as Madras. */}
            <div
              className="relative w-full rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              style={{
                height: "min(78vh, 780px)",
                transformStyle: "preserve-3d",
                transition: "transform 0.9s cubic-bezier(0.65,0,0.35,1)",
                transform: open === "social" ? "rotateY(180deg)" : "rotateY(0deg)",
                touchAction: "pan-y",
              }}
            >
              <CoverFace
                src={socialCover}
                alt="Social — the drinks menu cover, as printed"
                label="Social"
                bg="#a83d24"
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
