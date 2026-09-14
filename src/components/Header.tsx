import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ONLINE_ORDER_URL } from '@/lib/links';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Reservations', href: '/reservations' },
  { name: 'Events', href: '/events' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
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
      ? 'rgba(242, 237, 228, 0.95)'
      : '#F4EFE3'
    : 'transparent';

  const headerStyle: React.CSSProperties = {
    backgroundColor: headerBg,
    boxShadow: isScrolled ? '0 1px 8px rgba(69,46,24,0.08)' : 'none',
    backdropFilter: isScrolled && isMobile ? 'blur(8px)' : 'none',
    WebkitBackdropFilter: isScrolled && isMobile ? 'blur(8px)' : 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
  };

  const textColor = isScrolled ? '#452E18' : '#DBB640';
  const activeColor = isScrolled ? '#452E18' : '#DBB640';
  const inactiveColor = isScrolled ? 'rgba(69,46,24,0.7)' : 'rgba(219,182,64,0.7)';

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
              src="/lovable-uploads/mm-logo-web-01.png"
              alt="Madras Social"
              className="h-10 w-auto transition-all duration-500 group-hover:scale-105"
              style={{
                filter: isScrolled
                  ? 'brightness(0.3) sepia(1) saturate(2) hue-rotate(15deg)'
                  : 'none',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase font-gotham font-medium transition-all duration-500"
                  style={{ color: isActive ? activeColor : inactiveColor }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Order CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              {...(ONLINE_ORDER_URL
                ? { href: ONLINE_ORDER_URL, target: '_blank', rel: 'noopener noreferrer' }
                : { 'aria-disabled': true, title: 'Online ordering is not available yet' })}
              className="hidden md:inline-block px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm transition-all duration-500"
              style={{
                borderColor: textColor,
                color: textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = textColor;
                e.currentTarget.style.color = isScrolled ? '#F4EFE3' : '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textColor;
              }}
            >
              Order Online
            </a>
            <a
              href="/reservations"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm transition-all duration-500"
              style={{
                borderColor: textColor,
                color: textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = textColor;
                e.currentTarget.style.color = isScrolled ? '#F4EFE3' : '#1a1a1a';
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
          backgroundColor: isScrolled ? 'rgba(244,239,227,0.98)' : 'rgba(69,46,24,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3 py-3 text-sm tracking-[0.1em] uppercase font-gotham font-medium rounded transition-all duration-300 min-h-[44px] flex items-center"
                  style={{
                    color: isScrolled
                      ? isActive ? '#452E18' : 'rgba(69,46,24,0.7)'
                      : isActive ? '#DBB640' : '#F2EBD6',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              {...(ONLINE_ORDER_URL
                ? { href: ONLINE_ORDER_URL, target: '_blank', rel: 'noopener noreferrer' }
                : { 'aria-disabled': true, title: 'Online ordering is not available yet' })}
              className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm text-center transition-all duration-300"
              style={{
                borderColor: isScrolled ? '#452E18' : '#DBB640',
                color: isScrolled ? '#452E18' : '#DBB640',
              }}
            >
              Order Online
            </a>
            <a
              href="/reservations"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 text-sm tracking-[0.15em] uppercase font-gotham font-medium border rounded-sm text-center transition-all duration-300"
              style={{
                borderColor: isScrolled ? '#452E18' : '#DBB640',
                color: isScrolled ? '#452E18' : '#DBB640',
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
