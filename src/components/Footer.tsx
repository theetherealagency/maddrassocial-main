import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';


const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About Us', href: '/about' },
  { name: 'Reservations', href: '/reservations' },
  { name: 'Gift Cards', href: '/gift-cards' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="text-primary-foreground" style={{ backgroundColor: "#3d2210" }}>
      <div className="container mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img src="/lovable-uploads/mm-logo-web-01.png" alt="Madras Mami" className="h-10 w-auto" />
            </Link>
            <p className="text-primary-foreground/40 text-xs leading-relaxed">
              Authentic South Indian cuisine.<br />Tradition reimagined for modern Brampton.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary-foreground/70 text-[10px] tracking-[0.2em] uppercase mb-5 font-gotham font-medium">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/40 hover:text-accent transition-colors duration-300 text-xs">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-primary-foreground/70 text-[10px] tracking-[0.2em] uppercase mb-5 font-gotham font-medium">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://share.google/US5bWLfnTKIab8p5V" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 text-primary-foreground/40 hover:text-accent transition-colors text-xs">
                  <MapPin className="w-3.5 h-3.5 text-accent/70 shrink-0 mt-0.5" />
                  <span>6261 Mayfield Rd, Unit 145<br />Brampton, ON L6P 0X9</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@madrasmami.ca" className="flex items-center gap-2 text-primary-foreground/40 hover:text-accent transition-colors text-xs">
                  <Mail className="w-3.5 h-3.5 text-accent/70" />
                  info@madrasmami.ca
                </a>
              </li>
              <li>
                <a href="tel:+19059135900" className="flex items-center gap-2 text-primary-foreground/40 hover:text-accent transition-colors text-xs">
                  <Phone className="w-3.5 h-3.5 text-accent/70" />
                  (905) 913-5900
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-primary-foreground/70 text-[10px] tracking-[0.2em] uppercase mb-5 font-gotham font-medium">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/madrasmami.ca" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-primary-foreground/15 flex items-center justify-center text-primary-foreground/40 hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Instagram">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com/madrasmami" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-primary-foreground/15 flex items-center justify-center text-primary-foreground/40 hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Facebook">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/8">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <p className="text-[10px] text-primary-foreground/30 text-center tracking-wide">
            © {new Date().getFullYear()} Madras Mami. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
