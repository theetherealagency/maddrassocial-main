import heroBanner from "@/assets/homepage-banner-desktop.jpg";
import heroBannerMobile from "@/assets/homepage-banner-mobile.jpg";
import ScallopDivider from "./ScallopDivider";

const HomeHero = () => {
  return (
    <section className="relative w-full md:overflow-hidden" id="home">
      <h1 className="sr-only">Madras Social — A South Indian Kitchen and Bar in Waterloo</h1>
      {/* Desktop banner */}
      <img
        src={heroBanner}
        alt="Madras Social — Southern roots. Social plates."
        className="hidden md:block w-full h-auto relative"
        loading="eager"
      />
      {/* Mobile banner — full width, no cropping */}
      <img
        src={heroBannerMobile}
        alt="Madras Social — Southern roots. Social plates."
        className="block md:hidden w-full h-auto"
        loading="eager"
      />

      {/* Scalloped bottom edge */}
      <div className="absolute bottom-0 left-0 w-full z-[20]">
        <ScallopDivider color="#F2EDE4" direction="down" />
      </div>
    </section>
  );
};

export default HomeHero;
