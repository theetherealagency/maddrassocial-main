import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ScallopDivider from "./ScallopDivider";
import menuSecBg from "@/assets/menu-sec-bg.png";

import menuSlide1 from "@/assets/menu-slide-1.jpg";
import menuSlide2 from "@/assets/menu-slide-2.jpg";
import menuSlide3 from "@/assets/menu-slide-3.jpg";
import dessertMangoPannaCotta from "@/assets/dessert-mango-panna-cotta.jpg";
import menuSlide5 from "@/assets/menu-slide-5.jpg";

import menuSlide7 from "@/assets/menu-slide-7.jpg";
import menuSlide8 from "@/assets/menu-slide-8.jpg";
import menuSlide9 from "@/assets/menu-slide-9.jpg";
/** The one real Madras Social food photo supplied so far (2026-09-22) —
 *  fried okra, pappadam and a beet chutney. Leads the Tapas card's
 *  slideshow; the rest of the pool below is still Madras Mami stock,
 *  pending the real menu shoot. */
import homepageMenuTapas from "@/assets/homepage-menu-tapas.jpg";

const menuCards = [
  {
    category: "FOOD",
    title: "Southern Roots, Social Plates",
    body: "Kerala and Tamil cooking, served for the middle of the table. Rasam and roots to open, small plates with a southern attitude, and mains built to share. Vegetarian dishes are marked.",
    imageLeft: false,
    images: [homepageMenuTapas, menuSlide2, menuSlide8],
    imageAlt: "Madras Social — South Indian plates for the middle of the table",
  },
  {
    category: "FROM THE TAVA",
    title: "Dosa District",
    body: "Dosas and uthappams, crisp at the edge and made to tear and share. Served with coconut chutney, tomato chutney and vegetable sambar. Bangalore butter dosas have a section of their own.",
    imageLeft: true,
    images: [menuSlide1, menuSlide3],
    imageAlt: "Dosas and uthappams from the tava",
  },
  {
    category: "MAINS",
    title: "Main Affairs",
    body: "Built for the centre of the table: Malabar chicken steak, a pepper-braised Madras lamb shank, and a whole Fish Pollichathu roasted in South Indian spices. Kalan mushroom sambar risotto and ghee roast paneer cover the table's vegetarians.",
    imageLeft: false,
    images: [menuSlide5, menuSlide7],
    imageAlt: "Madras Social mains, built for the centre of the table",
  },
  {
    category: "DESSERTS",
    title: "Sweet Social",
    body: "Tirunelveli halwa with roasted cashews. Pistachio semiya kunafa. Filter kaapi tiramisu, with ladyfingers soaked in South Indian filter coffee. Save room.",
    imageLeft: true,
    images: [dessertMangoPannaCotta, menuSlide9],
    imageAlt: "Madras Social desserts",
  },
];

const ImageSlideshow = ({ images, alt }: { images: string[]; alt: string }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#1a2e1a" }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "center center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
          loading={i === 0 ? "eager" : "lazy"}
          width={800}
          height={500}
        />
      ))}
    </div>
  );
};

const MenuCard = ({
  card,
  index,
}: {
  card: (typeof menuCards)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const textPanel = (
    <div className="bg-beige p-4 md:p-8 lg:p-10 flex flex-col justify-center w-full lg:w-[38%]">
      <p className="font-body font-medium text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gold mb-2 md:mb-3">
        {card.category}
      </p>
      <h3 className="font-display text-[20px] md:text-[28px] lg:text-[32px] text-brown-brand leading-[1.2] mb-2 md:mb-4">
        {card.title}
      </h3>
      <p className="font-body text-[12px] md:text-[13px] text-brown-brand leading-[1.5] md:leading-[1.75] mb-3 md:mb-6">
        {card.body}
      </p>
      <Link to="/menu" className="cta-link text-[11px]" aria-label="View menu">
        VIEW MENU <span className="cta-arrow">→</span>
      </Link>
    </div>
  );

  const imagePanel = (
    <div className="w-full lg:w-[62%] h-[180px] md:h-[320px] lg:h-auto overflow-hidden relative lg:min-h-[480px]">
      <ImageSlideshow images={card.images} alt={card.imageAlt} />
    </div>
  );

  return (
    <div
      ref={ref}
      className="max-w-[1200px] mx-auto mb-4 md:mb-6 lg:mb-10 flex flex-col lg:flex-row gap-0 rounded-xl md:rounded-2xl overflow-hidden shadow-card transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Mobile: always image on top */}
      <div className="lg:hidden flex flex-col gap-0">
        {imagePanel}
        {textPanel}
      </div>
      {/* Desktop: alternating */}
      <div className="hidden lg:flex gap-0 w-full">
        {card.imageLeft ? (
          <>
            {imagePanel}
            {textPanel}
          </>
        ) : (
          <>
            {textPanel}
            {imagePanel}
          </>
        )}
      </div>
    </div>
  );
};

const HomeDiscoverMenu = () => {
  return (
    <section className="relative" id="menu">
      <div className="bg-green-brand leading-[0]">
        <ScallopDivider color="#F2EBD6" direction="down" />
      </div>

      <div className="py-6 md:py-[80px] lg:py-[100px] px-3 md:px-6 relative" style={{ backgroundImage: `url(${menuSecBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h2 className="heading-display-gold text-[28px] md:text-[52px] lg:text-[60px] text-center mb-2 md:mb-3">
          Discover the Menu
        </h2>
        <p className="font-body font-normal italic text-[13px] md:text-[17px] text-gold text-center mb-8 md:mb-[60px]">
          A modern expression of South Indian cuisine, rooted in tradition.
        </p>

        {menuCards.map((card, i) => (
          <MenuCard key={i} card={card} index={i} />
        ))}
      </div>

      <div className="bg-green-brand leading-[0]">
        <ScallopDivider color="#F2EBD6" direction="up" />
      </div>
    </section>
  );
};

export default HomeDiscoverMenu;
