import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { RESERVE_URL, CAREERS_URL } from "@/lib/links";
/**
 * Reuses the same four tiles InstagramFeed.tsx shows on the homepage,
 * rather than this section's own separate six-tile grid (`ig-footer-grid.png`,
 * removed 2026-09-22). That grid's bottom-left tile was a photograph of the
 * actual Madras Mami storefront sign — not fixable by cropping text, the
 * whole tile was a picture of someone else's restaurant. One clean, verified
 * set of tiles now backs both places this teaser appears.
 *
 * Client request, 2026-09-23: swapped the placeholder mockup for the same
 * four real Madras Social photos InstagramFeed.tsx uses (see that file's
 * comment for provenance and what was excluded).
 */
import igTile1 from "@/assets/ig-tile-1.jpg";
import igTile2 from "@/assets/ig-tile-2.jpg";
import igTile3 from "@/assets/ig-tile-3.jpg";
import igTile4 from "@/assets/ig-tile-4.jpg";

const FOOTER_TILES = [
  { src: igTile1, alt: "Madras Social's Beet Poriyal Hummus & Edamame Varuval, from the @madrassocial Instagram" },
  { src: igTile2, alt: "The Madras Social storefront on Erb Street West, from the restaurant's opening announcement on Instagram" },
  { src: igTile3, alt: "A guest enjoying a dish at Madras Social, from the @madrassocial Instagram" },
  { src: igTile4, alt: "Madras Social's Marina Beach illustration post, from the @madrassocial Instagram" },
];

// Events and Contact removed from navigation, client instruction 2026-09-23
// ("remove events page for now" / "even contact and order online page").
const quickLinks = [
  { name: "Home",         href: "/" },
  { name: "Menu",         href: "/menu" },
  { name: "About",        href: "/about" },
  { name: "Reservations", href: RESERVE_URL },
  { name: "Careers",      href: CAREERS_URL },
];

// Warm Linen — the real Madras Social palette (see CLAUDE.md § Brand).
// These were rgb(242,235,214), a close-but-not-exact leftover value.
const cream = "rgba(236,228,216,0.85)";
const creamFull = "rgb(236,228,216)";

const INSTAGRAM_URL = "https://www.instagram.com/madrassocial/";

const InstagramGrid = () => (
  <div className="grid grid-cols-4 gap-1">
    {FOOTER_TILES.map((tile) => (
      <a
        key={tile.src}
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square overflow-hidden rounded-sm group"
        aria-label="View on Instagram"
      >
        <img
          src={tile.src}
          alt={tile.alt}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.05]"
          loading="lazy"
        />
      </a>
    ))}
  </div>
);

const HomeFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('footer-visibility', { detail: { visible: footerVisible } }));
  }, [footerVisible]);

  return (
    <footer
      ref={footerRef}
      className="footer-root lg:px-20 lg:pt-[60px] lg:pb-10"
      style={{ backgroundColor: "#1f1b1a" }} // Carbon — was a leftover Madras Mami brown (#3d2210)
    >
      {/* ── DESKTOP layout (lg+) ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8 mb-12">
          {/* Col 1: Logo + tagline */}
          <div>
            <div className="mb-4">
              <img src="/brand/madras-social-logo.png" alt="Madras Social" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="font-accent text-[13px] leading-[1.7]" style={{ color: cream }}>
              A South Indian kitchen and bar in Waterloo Region.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <p className="font-accent font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Quick Links</p>
            <div className="flex flex-col gap-[10px]">
              {quickLinks.map((link) => (
                link.external ? (
                  <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="font-accent text-[13px] transition-opacity hover:opacity-100" style={{ color: cream }}>{link.name}</a>
                ) : (
                  <Link key={link.name} to={link.href} className="font-accent text-[13px] transition-opacity hover:opacity-100" style={{ color: cream }}>{link.name}</Link>
                )
              ))}
            </div>
          </div>

          {/* Col 3: Contact Us */}
          <div>
            <p className="font-accent font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Contact Us</p>
            <address className="not-italic flex flex-col gap-3">
              <p className="font-accent text-[13px] leading-[1.7]" style={{ color: cream }}>8 Erb Street West<br />Waterloo, ON N2L 1S7</p>
              <a href="mailto:hello@madrassocial.ca" className="font-accent text-[13px] hover:opacity-100 transition-opacity" style={{ color: cream }}>hello@madrassocial.ca</a>
            </address>
          </div>

          {/* Col 4: Follow Us */}
          <div className="overflow-hidden">
            <p className="font-accent font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Follow Us</p>
            <InstagramGrid />
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-body text-[12px]"
              style={{ color: cream }}>
              <Instagram className="w-3.5 h-3.5" /> @madrassocial.ca
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6" style={{ borderTop: "1px solid #a83d24" }}>
          <p className="font-body text-[12px] text-center" style={{ color: "rgba(236,228,216,0.5)" }}>© 2026 Madras Social. All rights reserved.</p>
          <a href="https://etherealpr.com/" target="_blank" rel="noopener noreferrer"
            style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', textDecoration:'none', display:'block', textAlign:'center', marginTop:'8px'}}
            onMouseOver={e => (e.currentTarget.style.color='rgba(255,255,255,0.8)')}
            onMouseOut={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
            Managed by The Ethereal Agency
          </a>
        </div>
      </div>

      {/* ── MOBILE layout (<lg) ── */}
      <div className="lg:hidden flex flex-col" style={{ padding: '16px 16px', gap: '12px' }}>
        {/* ROW 1: Quick Links + Contact side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="font-accent font-semibold uppercase mb-1" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Quick Links</p>
            <div className="flex flex-col">
              {quickLinks.map((link) => (
                link.external ? (
                  <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="font-accent transition-opacity hover:opacity-100" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>{link.name}</a>
                ) : (
                  <Link key={link.name} to={link.href} className="font-accent transition-opacity hover:opacity-100" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>{link.name}</Link>
                )
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-accent font-semibold uppercase mb-1" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Contact Us</p>
            <address className="not-italic flex flex-col" style={{ gap: '2px' }}>
              <p className="font-accent" style={{ color: cream, fontSize: '12px', lineHeight: 1.5 }}>8 Erb Street West, Waterloo, ON N2L 1S7</p>
              <a href="mailto:hello@madrassocial.ca" className="font-accent" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>hello@madrassocial.ca</a>
            </address>
          </div>
        </div>

        {/* ROW 2: Follow Us + Instagram */}
        <div className="text-center">
          <p className="font-accent font-semibold uppercase mb-2" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Follow Us</p>
          <div className="mx-auto" style={{ maxWidth: '280px', width: '100%' }}>
            <InstagramGrid />
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 font-body"
            style={{ color: cream, fontSize: '11px' }}>
            <Instagram className="w-3 h-3" /> @madrassocial.ca
          </a>
        </div>

        {/* ROW 3: Copyright */}
        <div className="pt-2 text-center" style={{ borderTop: "1px solid #a83d24" }}>
          <p className="font-body" style={{ color: "rgba(236,228,216,0.5)", fontSize: '10px' }}>© 2026 Madras Social. All rights reserved.</p>
          <a href="https://etherealpr.com/" target="_blank" rel="noopener noreferrer"
            style={{color:'rgba(255,255,255,0.5)', fontSize:'10px', textDecoration:'none', display:'block', marginTop:'4px'}}
            onMouseOver={e => (e.currentTarget.style.color='rgba(255,255,255,0.8)')}
            onMouseOut={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
            Managed by The Ethereal Agency
          </a>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
