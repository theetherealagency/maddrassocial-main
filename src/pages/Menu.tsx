import { useState } from 'react';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import MandalaBackground from '@/components/MandalaBackground';
import { ONLINE_ORDER_URL } from '@/lib/links';
import { MENU_SECTIONS, MENU_TAGLINE } from '../../seo/site.mjs';

/**
 * MENU ARTWORK IS PENDING.
 *
 * The source presented the menu as designed boards. Its image pointers were
 * .asset.json files resolving to a Lovable CDN path that does not exist on
 * this domain, so they rendered as a blank page — and the artwork they point
 * at is Madras Mami's anyway. The food and bar boards are an outstanding
 * design deliverable (see PENDING.md).
 *
 * Until they land, the page falls back to rendering MENU_SECTIONS — the real
 * supplied menu — as text. Drop the board images into `pages` below and the
 * image presentation takes over with no other change.
 */
type MenuTab = { id: string; title: string; pages: string[] };

const tabs: MenuTab[] = [
  {
    id: 'main',
    title: 'Madras Social Menu',
    pages: [],
  },
];

type MenuItem = { name: string; price?: number; veg?: boolean; description?: string };
type MenuSection = { name: string; description?: string; items: MenuItem[] };

/** Text fallback, shown while the designed boards are outstanding. */
const MenuAsText = () => (
  <div className="max-w-3xl mx-auto px-6 py-14">
    <p className="section-label text-center mb-10">{MENU_TAGLINE}</p>
    {(MENU_SECTIONS as MenuSection[]).map((section) => (
      <section key={section.name} className="mb-12">
        <h2 className="heading-display text-[24px] md:text-[30px] mb-1">{section.name}</h2>
        {section.description && (
          <p className="body-text mb-5 opacity-80">{section.description}</p>
        )}
        <ul className="flex flex-col gap-4">
          {section.items.map((item) => (
            <li key={item.name} className="border-b border-border/30 pb-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-body font-medium text-[14px]">
                  {item.name}
                  {item.veg && (
                    <span
                      className="ml-2 text-[10px] uppercase tracking-[0.2em] opacity-60"
                      title="Vegetarian"
                    >
                      veg
                    </span>
                  )}
                </span>
                {item.price != null && (
                  <span className="font-body text-[14px] whitespace-nowrap opacity-80">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="body-text text-[13px] mt-1 opacity-75">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

const Menu = () => {
  const [activeId, setActiveId] = useState('main');
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="relative overflow-hidden pt-16">
        <h1 className="sr-only">Madras Social Menu — South Indian Food and Drink in Waterloo</h1>
        <MandalaBackground position="top-right" opacity={0.08} scale={0.7} rotate={15} />
        <MandalaBackground position="bottom-left" opacity={0.06} scale={0.6} rotate={-20} />

        {/* Tab buttons */}
        <div
          role="tablist"
          aria-label="Menus"
          hidden={tabs.length < 2}
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
                {tab.pages.length === 0 && <MenuAsText />}
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
