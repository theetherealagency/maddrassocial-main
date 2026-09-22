import traditionDesktop from "@/assets/tradition-section-desktop.png";
import traditionMobile from "@/assets/tradition-section-mobile.png";

const HomeOurSpace = () => {
  return (
    <section id="our-space">
      {/* Heritage-inspired polaroid collage + the Chennai-to-Waterloo route,
          "Where Tradition Meets Design." Two crops: the mobile file stacks
          the photos over the route instead of running them side by side,
          which is what the desktop crop does across the full width. */}
      <img
        src={traditionDesktop}
        alt="Where Tradition Meets Design — heritage-inspired polaroid collage of Chennai, and the route from Chennai to Waterloo"
        className="hidden md:block w-full h-auto"
        loading="lazy"
      />
      <img
        src={traditionMobile}
        alt="Where Tradition Meets Design — heritage-inspired polaroid collage of Chennai, and the route from Chennai to Waterloo"
        className="block md:hidden w-full h-auto"
        loading="lazy"
      />
    </section>
  );
};

export default HomeOurSpace;
