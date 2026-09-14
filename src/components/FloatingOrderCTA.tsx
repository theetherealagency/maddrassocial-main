import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FloatingOrderCTAProps {
  /** External ordering URL. When set, opens in a new tab instead of linking to /menu. */
  href?: string;
  label?: string;
}

const FloatingOrderCTA = ({ href, label = 'Order Now' }: FloatingOrderCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);

    const handleFooter = (e: Event) => {
      setFooterVisible((e as CustomEvent).detail.visible);
    };
    window.addEventListener('footer-visibility', handleFooter);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('footer-visibility', handleFooter);
    };
  }, []);

  const show = isVisible && !footerVisible;

  const className = `fixed bottom-6 right-6 z-40 px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-gotham font-medium bg-accent text-foreground rounded-sm shadow-lg hover:bg-accent/90 transition-all duration-500 ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
  }`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to="/menu" className={className}>
      {label}
    </Link>
  );
};

export default FloatingOrderCTA;
