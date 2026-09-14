import { useState } from 'react';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import MandalaBackground from '@/components/MandalaBackground';
import { ONLINE_ORDER_URL } from '@/lib/links';
import menuPage1 from '@/assets/menu-page-1.png.asset.json';
import menuPage2 from '@/assets/menu-page-2.png.asset.json';
import menuPage3 from '@/assets/menu-page-3.png.asset.json';
import jainMenu1 from '@/assets/jain-menu-1.png.asset.json';
import tastingMenu1 from '@/assets/tasting-menu-1.png.asset.json';

const assetBaseUrl = 'https://madrasmami.lovable.app';
const menuAssetUrl = (url: string) =>
  url.startsWith('/__l5e/assets-v1/') ? `${assetBaseUrl}${url}` : url;

const tabs = [
  {
    id: 'main',
    title: 'Madras Mami Menu',
    pages: [menuPage1.url, menuPage2.url, menuPage3.url].map(menuAssetUrl),
  },
  {
    id: 'jain',
    title: 'Madras Mami Jain Menu',
    pages: [jainMenu1.url].map(menuAssetUrl),
  },
  {
    id: 'tasting',
    title: 'Madras Mami Tasting Menu',
    pages: [tastingMenu1.url].map(menuAssetUrl),
  },
];

const Menu = () => {
  const [activeId, setActiveId] = useState('main');
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="relative overflow-hidden pt-16">
        <h1 className="sr-only">Madras Mami Menu — Authentic South Indian Food in Brampton, 100% Pure Vegetarian, Made with Pure Desi Ghee</h1>
        <MandalaBackground position="top-right" opacity={0.08} scale={0.7} rotate={15} />
        <MandalaBackground position="bottom-left" opacity={0.06} scale={0.6} rotate={-20} />

        {/* Tab buttons */}
        <div
          role="tablist"
          aria-label="Menus"
          className="sticky top-16 z-30 bg-[hsl(var(--color-cream))] border-b border-[hsl(var(--color-gold))]/30 px-4 md:px-8 py-4"
        >
          <div className="max-w-5xl mx-auto flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-visible md:justify-center scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(tab.id)}
                  className={`whitespace-nowrap shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-gotham text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 border ${
                    isActive
                      ? 'bg-[hsl(var(--color-brown))] text-[hsl(var(--color-cream))] border-[hsl(var(--color-brown))] shadow-md'
                      : 'bg-transparent text-[hsl(var(--color-brown))] border-[hsl(var(--color-brown))]/30 hover:border-[hsl(var(--color-brown))] hover:bg-[hsl(var(--color-beige))]/40'
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area — keep all panels mounted to prevent layout jump */}
        <div className="bg-white min-h-screen">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                aria-hidden={!isActive}
                className={`flex flex-col bg-white ${isActive ? 'block' : 'hidden'}`}
              >
                {tab.pages.map((src, i) => (
                  <div key={i} className="overflow-hidden bg-white">
                    <img
                      src={src}
                      alt={`${tab.title} page ${i + 1}`}
                      className="w-full h-auto block"
                      loading={tab.id === 'main' && i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>

      <HomeFooter />
      <FloatingOrderCTA href={ONLINE_ORDER_URL} />
    </div>
  );
};

export default Menu;
