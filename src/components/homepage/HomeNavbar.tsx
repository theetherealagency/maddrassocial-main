import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { RESERVE_URL, CAREERS_URL } from "@/lib/links";

// Events, Contact and the Order Online CTA removed from navigation, client
// instruction 2026-09-23 ("remove events page for now" / "even contact and
// order online page"). The page components and routes are untouched —
// this only takes them out of the site's own nav so they're not reachable
// from it while pending.
const navLinks = [
  { name: "HOME", href: "/" },
  { name: "MENU", href: "/menu" },
  { name: "ABOUT", href: "/about" },
  { name: "RESERVATIONS", href: RESERVE_URL },
  { name: "CAREERS", href: CAREERS_URL },
];

/**
 * Same transparent-until-scrolled behaviour on every page (client
 * instruction, 2026-09-23 — "keep header same as on home page... till then
 * transparent"). An earlier `forceSolid` variant special-cased AboutUs,
 * whose "How It All Began" section is a dark red duotone image that made
 * the transparent state's terracotta text unreadable — reverted per that
 * instruction. A follow-up fix added a soft light `drop-shadow` halo behind
 * the unscrolled nav row to keep it legible on dark backgrounds, but the
 * client called it out as "a weird white colour effect" and asked for it
 * gone (2026-09-23) — removed. Legibility on a dark hero is back to resting
 * on the terracotta text colour alone, same as before either fix.
 */
const HomeNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Carbon / Burnt Terracotta — the real Madras Social palette (see
  // CLAUDE.md § Brand). These were '#452E18' / '#DBB640' before, which are
  // neither: leftover Madras Mami hex values hardcoded past the rebrand.
  const textColor = scrolled ? '#1f1b1a' : '#a83d24';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-cream shadow-nav" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[70px]">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/brand/madras-social-logo.png"
            alt="Madras Social"
            className="h-10 w-auto"
          />
        </Link>

        {/* Center Nav Links — desktop */}
        <div className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link whitespace-nowrap"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link whitespace-nowrap ${location.pathname === link.href ? "active" : ""}`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CTA — desktop */}
          <Link
            to={RESERVE_URL}
            className="hidden xl:inline-block border-[1.5px] border-gold rounded-sm px-5 py-[9px] font-body font-medium text-[11px] uppercase tracking-[0.3em] text-gold transition-all duration-250 hover:bg-gold hover:text-brown-brand"
          >
            RESERVE NOW
          </Link>

          {/* Order Now — mobile */}
          <Link
            to="/menu"
            className="xl:hidden inline-block px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-medium border rounded-sm transition-all duration-500"
            style={{
              borderColor: textColor,
              color: textColor,
            }}
          >
            ORDER NOW
          </Link>

          {/* Hamburger — mobile */}
          <button
            className="xl:hidden p-1.5 transition-colors duration-500"
            style={{ color: textColor }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`xl:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          backgroundColor: 'rgba(236,228,216,0.98)', // Warm Linen
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-6 py-3 flex flex-col gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const linkClassName = "px-3 py-3 text-sm tracking-[0.1em] uppercase font-body font-medium rounded transition-all duration-300 min-h-[44px] flex items-center";
            const linkStyle = { color: isActive ? '#1f1b1a' : 'rgba(31,27,26,0.7)' }; // Carbon
            return link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
                style={linkStyle}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={linkClassName}
                style={linkStyle}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            to={RESERVE_URL}
            className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-body font-medium border border-[#1f1b1a] text-[#1f1b1a] rounded-sm text-center"
            onClick={() => setMobileOpen(false)}
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
