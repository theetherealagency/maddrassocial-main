import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import igFooterGrid from "@/assets/ig-footer-grid.png";

const quickLinks = [
  { name: "Home",         href: "/" },
  { name: "Menu",         href: "/menu" },
  { name: "About Us",     href: "/about" },
  { name: "Reservations", href: "/reservations" },
  { name: "Contact",      href: "/contact" },
];

const cream = "rgba(242,235,214,0.85)";
const creamFull = "rgb(242,235,214)";

const INSTAGRAM_URL = "https://www.instagram.com/madrasmami.ca/";

const InstagramGrid = () => (
  <a
    href={INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="block overflow-hidden rounded-sm group"
    aria-label="View on Instagram"
  >
    <img
      src={igFooterGrid}
      alt="Madras Mami on Instagram"
      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
      loading="lazy"
    />
  </a>
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
      style={{ backgroundColor: "#3d2210" }}
    >
      {/* ── DESKTOP layout (lg+) ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8 mb-12">
          {/* Col 1: Logo + tagline */}
          <div>
            <div className="mb-4">
              <img src="/lovable-uploads/mm-logo-web-01.png" alt="Madras Mami" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="font-body text-[13px] leading-[1.7]" style={{ color: cream }}>
              Authentic South Indian cuisine. Tradition reimagined for modern Brampton.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <p className="font-body font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Quick Links</p>
            <div className="flex flex-col gap-[10px]">
              {quickLinks.map((link) => (
                <Link key={link.name} to={link.href} className="font-body text-[13px] transition-opacity hover:opacity-100" style={{ color: cream }}>{link.name}</Link>
              ))}
            </div>
          </div>

          {/* Col 3: Contact Us */}
          <div>
            <p className="font-body font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Contact Us</p>
            <address className="not-italic flex flex-col gap-3">
              <p className="font-body text-[13px] leading-[1.7]" style={{ color: cream }}>6261 Mayfield Rd, Unit 145<br />Brampton, ON L6P 0X9</p>
              <a href="mailto:info@madrasmami.ca" className="font-body text-[13px] hover:opacity-100 transition-opacity" style={{ color: cream }}>info@madrasmami.ca</a>
              <a href="tel:+19059135900" className="font-body text-[13px] hover:opacity-100 transition-opacity" style={{ color: cream }}>(905) 913-5900</a>
              <a href="https://www.google.com/maps/dir//Madras+Mami+%7C+Brampton,+6261+Mayfield+Rd+%23145,+Brampton,+ON+L6P+0X9/@43.6436992,-79.54432,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x882b19c4613ff137:0x6a096f1e87ed3e5d!2m2!1d-79.7569055!2d43.7895056" target="_blank" rel="noopener noreferrer" className="font-body text-[13px] hover:opacity-100 transition-opacity" style={{ color: cream }}>View on Google Maps</a>
            </address>
          </div>

          {/* Col 4: Follow Us */}
          <div className="overflow-hidden">
            <p className="font-body font-semibold text-[11px] uppercase tracking-[0.25em] mb-5" style={{ color: creamFull }}>Follow Us</p>
            <InstagramGrid />
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-body text-[12px]"
              style={{ color: cream }}>
              <Instagram className="w-3.5 h-3.5" /> @madrasmami.ca
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6" style={{ borderTop: "1px solid #C8922A" }}>
          <p className="font-body text-[12px] text-center" style={{ color: "rgba(242,235,214,0.5)" }}>© 2026 Madras Mami. All rights reserved.</p>
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
            <p className="font-body font-semibold uppercase mb-1" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Quick Links</p>
            <div className="flex flex-col">
              {quickLinks.map((link) => (
                <Link key={link.name} to={link.href} className="font-body transition-opacity hover:opacity-100" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>{link.name}</Link>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-body font-semibold uppercase mb-1" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Contact Us</p>
            <address className="not-italic flex flex-col" style={{ gap: '2px' }}>
              <p className="font-body" style={{ color: cream, fontSize: '12px', lineHeight: 1.5 }}>6261 Mayfield Rd, Unit 145, Brampton, ON L6P 0X9</p>
              <a href="mailto:info@madrasmami.ca" className="font-body" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>info@madrasmami.ca</a>
              <a href="tel:+19059135900" className="font-body" style={{ color: cream, fontSize: '12px', lineHeight: 1.6 }}>(905) 913-5900</a>
            </address>
          </div>
        </div>

        {/* ROW 2: Follow Us + Instagram */}
        <div className="text-center">
          <p className="font-body font-semibold uppercase mb-2" style={{ color: creamFull, fontSize: '10px', letterSpacing: '2px' }}>Follow Us</p>
          <div className="mx-auto" style={{ maxWidth: '280px', width: '100%' }}>
            <InstagramGrid />
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 font-body"
            style={{ color: cream, fontSize: '11px' }}>
            <Instagram className="w-3 h-3" /> @madrasmami.ca
          </a>
        </div>

        {/* ROW 3: Copyright */}
        <div className="pt-2 text-center" style={{ borderTop: "1px solid #C8922A" }}>
          <p className="font-body" style={{ color: "rgba(242,235,214,0.5)", fontSize: '10px' }}>© 2026 Madras Mami. All rights reserved.</p>
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
