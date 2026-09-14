import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { EventPanel } from './types';

/* The three gatherings as expandable panels. Built on the framer-motion
   flex-expand technique from components/ui/gallery-animation.tsx, restyled to
   the Madras Mami palette; clicking a panel opens its enquiry form. */

const cream = 'hsl(var(--color-cream))';
const gold = 'hsl(var(--color-gold))';

interface EventGalleryProps {
  panels: EventPanel[];
  onOpen: (index: number) => void;
}

const EventGallery = ({ panels, onOpen }: EventGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) return 1;
    return hoveredIndex === index ? 2 : 0.5;
  };

  return (
    <>
      {/* ---------- Desktop: horizontal expandable panels ---------- */}
      <div className="hidden md:flex gap-3 h-[520px] w-full">
        {panels.map((panel, index) => {
          const squeezed = hoveredIndex !== null && hoveredIndex !== index;
          return (
            <motion.button
              key={panel.def.id}
              type="button"
              className="relative cursor-pointer overflow-hidden text-left"
              style={{ flex: 1, border: '1px solid hsl(var(--color-gold) / 0.35)' }}
              animate={{ flex: getFlexValue(index) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onOpen(index)}
              aria-label={`${panel.title} — view details and enquiry form`}
            >
              <img
                src={panel.image}
                alt={panel.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Emerald wash keeps the gold type legible over photography. */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, hsl(var(--color-green) / 0.95) 0%, hsl(var(--color-green) / 0.55) 45%, hsl(var(--color-green) / 0.2) 100%)',
                }}
                animate={{ opacity: hoveredIndex === index ? 0.82 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Label fades out on the squeezed panels so type never clips. */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-7 lg:p-8"
                animate={{ opacity: squeezed ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  className="heading-display text-[26px] lg:text-[32px] mb-3 whitespace-nowrap"
                  style={{ color: cream }}
                >
                  {panel.title}
                </h3>

                <motion.p
                  className="font-gotham text-[11px] uppercase leading-[1.9] tracking-[0.14em] max-w-[320px] mb-4"
                  style={{ color: cream }}
                  animate={{ opacity: hoveredIndex === index ? 0.9 : 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {panel.blurb}
                </motion.p>

                <span
                  className="inline-flex items-center gap-2 font-gotham text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: gold }}
                >
                  Enquire
                  <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* ---------- Mobile: stacked tiles ---------- */}
      <div className="md:hidden space-y-4">
        {panels.map((panel, index) => (
          <button
            key={panel.def.id}
            type="button"
            onClick={() => onOpen(index)}
            className="relative block w-full h-60 overflow-hidden text-left"
            style={{ border: '1px solid hsl(var(--color-gold) / 0.35)' }}
            aria-label={`${panel.title} — view details and enquiry form`}
          >
            <img
              src={panel.image}
              alt={panel.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, hsl(var(--color-green) / 0.95) 0%, hsl(var(--color-green) / 0.5) 60%, hsl(var(--color-green) / 0.2) 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="heading-display text-[23px] mb-2" style={{ color: cream }}>
                {panel.title}
              </h3>
              <p
                className="font-gotham text-[9.5px] uppercase leading-[1.9] tracking-[0.14em] mb-3 opacity-85"
                style={{ color: cream }}
              >
                {panel.blurb}
              </p>
              <span
                className="inline-flex items-center gap-2 font-gotham text-[9.5px] uppercase tracking-[0.22em]"
                style={{ color: gold }}
              >
                Enquire
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default EventGallery;
