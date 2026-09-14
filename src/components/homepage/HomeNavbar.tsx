import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ONLINE_ORDER_URL } from "@/lib/links";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "MENU", href: "/menu" },
  { name: "BRUNCH TASTING", href: "/brunch-tasting" },
  { name: "ABOUT US", href: "/about" },
  { name: "RESERVATIONS", href: "/reservations" },
  { name: "CATERING", href: "/catering" },
  { name: "GIFT CARDS", href: "/gift-cards" },
  { name: "CONTACT", href: "/contact" },
];

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

  const textColor = scrolled ? '#452E18' : '#DBB640';

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
            src="/lovable-uploads/mm-logo-web-01.png"
            alt="Madras Mami"
            className="h-10 w-auto"
          />
        </Link>

        {/* Center Nav Links — desktop */}
        <div className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`nav-link whitespace-nowrap ${location.pathname === link.href ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Online ordering — desktop */}
          <a
            href={ONLINE_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-block border-[1.5px] border-gold rounded-sm px-5 py-[9px] font-body font-medium text-[11px] uppercase tracking-[0.3em] text-gold transition-all duration-250 hover:bg-gold hover:text-brown-brand"
          >
            ORDER ONLINE
          </a>

          {/* CTA — desktop */}
          <a
            href="/reservations"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-block border-[1.5px] border-gold rounded-sm px-5 py-[9px] font-body font-medium text-[11px] uppercase tracking-[0.3em] text-gold transition-all duration-250 hover:bg-gold hover:text-brown-brand"
          >
            RESERVE NOW
          </a>

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
          backgroundColor: scrolled ? 'rgba(244,239,227,0.98)' : 'rgba(244,239,227,0.98)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-6 py-3 flex flex-col gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className="px-3 py-3 text-sm tracking-[0.1em] uppercase font-body font-medium rounded transition-all duration-300 min-h-[44px] flex items-center"
                style={{
                  color: isActive ? '#452E18' : 'rgba(69,46,24,0.7)',
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <a
            href={ONLINE_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-body font-medium border border-[#452E18] text-[#452E18] rounded-sm text-center"
            onClick={() => setMobileOpen(false)}
          >
            Order Online
          </a>
          <a
            href="/reservations"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-body font-medium border border-[#452E18] text-[#452E18] rounded-sm text-center"
            onClick={() => setMobileOpen(false)}
          >
            Reserve Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
