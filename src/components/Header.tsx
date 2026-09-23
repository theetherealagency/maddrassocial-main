import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { RESERVE_URL, CAREERS_URL } from '@/lib/links';

// Events, Contact and the Order Online CTA removed from navigation, client
// instruction 2026-09-23 ("remove events page for now" / "even contact and
// order online page"). The page components and routes are untouched —
// this only takes them out of the site's own nav so they're not reachable
// from it while pending.
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Reservations', href: RESERVE_URL },
  { name: 'Careers', href: CAREERS_URL },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isMobile ? 50 : 80;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Desktop: solid bg when scrolled. Mobile: frosted glass when scrolled.
  const headerBg = isScrolled
    ? isMobile
      ? 'rgba(236, 228, 216, 0.95)' // Warm Linen
      : '#ece4d8'
    : 'transparent';

  const headerStyle: React.CSSProperties = {
    backgroundColor: headerBg,
    boxShadow: isScrolled ? '0 1px 8px rgba(31,27,26,0.08)' : 'none', // Carbon
    backdropFilter: isScrolled && isMobile ? 'blur(8px)' : 'none',
    WebkitBackdropFilter: isScrolled && isMobile ? 'blur(8px)' : 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
  };

  // Carbon / Burnt Terracotta — the real Madras Social palette (see
  // CLAUDE.md § Brand). These were '#452E18' / '#DBB640' before, which are
  // neither: leftover Madras Mami hex values hardcoded past the rebrand.
  const textColor = isScrolled ? '#1f1b1a' : '#a83d24';
  const activeColor = isScrolled ? '#1f1b1a' : '#a83d24';
  const inactiveColor = isScrolled ? 'rgba(31,27,26,0.7)' : 'rgba(168,61,36,0.7)';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={headerStyle}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/brand/madras-social-logo.png"
              alt="Madras Social"
              className="h-10 w-auto transition-all duration-500 group-hover:scale-105"
              // No filter: the old logo asset needed this to fake a colour
              // change on scroll (brightness/sepia/hue-rotate tuned to that
              // specific gold). The real Madras Social logo is Burnt
              // Terracotta already and does not need to shift colour here.
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const className = "relative px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase font-gotham font-medium transition-all duration-500";
              const style = { color: isActive ? activeColor : inactiveColor };
              return link.external ? (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.href} className={className} style={style}>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Order CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm transition-all duration-500"
              style={{
                borderColor: textColor,
                color: textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = textColor;
                e.currentTarget.style.color = isScrolled ? '#ece4d8' : '#1f1b1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textColor;
              }}
            >
              Reserve Now
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 transition-colors duration-500"
              style={{ color: textColor }}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(236,228,216,0.98)' : 'rgba(31,27,26,0.95)', // Warm Linen / Carbon
          backdropFilter: 'blur(12px)',
        }}
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const className = "px-3 py-3 text-sm tracking-[0.1em] uppercase font-gotham font-medium rounded transition-all duration-300 min-h-[44px] flex items-center";
              const style = {
                color: isScrolled
                  ? isActive ? '#1f1b1a' : 'rgba(31,27,26,0.7)'
                  : isActive ? '#a83d24' : '#ece4d8',
              };
              return link.external ? (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={className}
                  style={style}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href={RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm text-center transition-all duration-300"
              style={{
                borderColor: isScrolled ? '#1f1b1a' : '#a83d24',
                color: isScrolled ? '#1f1b1a' : '#a83d24',
              }}
            >
              Reserve Now
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
