import spaceCollage from "@/assets/homepage-space-collage.jpg";

const HomeOurSpace = () => {
  return (
    <section id="our-space">
      <img
        src={spaceCollage}
        alt="Our Space — Where Tradition Meets Design. Heritage-inspired polaroid collage."
        style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
      />
    </section>
  );
};

export default HomeOurSpace;
