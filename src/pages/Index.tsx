import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeHero from '@/components/homepage/HomeHero';
import HomeOurStory from '@/components/homepage/HomeOurStory';
import HomeDiscoverMenu from '@/components/homepage/HomeDiscoverMenu';
import HomeOurSpace from '@/components/homepage/HomeOurSpace';
import HomeFooter from '@/components/homepage/HomeFooter';
import InstagramFeed from '@/components/InstagramFeed';
import TastingPopup from '@/components/TastingPopup';

const Index = () => {
  return (
    <div className="overflow-x-hidden w-full">
      <HomeNavbar />
      <HomeHero />
      <HomeOurStory />
      <HomeDiscoverMenu />
      <HomeOurSpace />
      <InstagramFeed />
      <HomeFooter />
      {/* Tasting event popup — appears after 5s, once per session */}
      <TastingPopup />
    </div>
  );
};

export default Index;
