import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import EventEnquiryForm from './EventEnquiryForm';
import { TornEdge } from './ornaments';
import type { EventPanel } from './types';
import templeLineArt from '@/assets/temple-line-art.png';

/* The enquiry modal: story on the left, that event's form on the right.
   Shared by the collage and the cards grid so there is only one copy. */

const cream = 'hsl(var(--color-cream))';
const brown = 'hsl(var(--color-brown))';
const green = 'hsl(var(--color-green))';
const gold = 'hsl(var(--color-gold))';

interface EventModalProps {
  panels: EventPanel[];
  activeIndex: number | null;
  onChange: (index: number | null) => void;
}

const EventModal = ({ panels, activeIndex, onChange }: EventModalProps) => {
  const isOpen = activeIndex !== null;
  const active = isOpen ? panels[activeIndex] : null;

  const step = (delta: number) => {
    if (activeIndex === null) return;
    onChange((activeIndex + delta + panels.length) % panels.length);
  };

  /* Escape closes, arrows move between events, and the page behind stays put. */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') onChange((activeIndex + 1) % panels.length);
      if (e.key === 'ArrowLeft') onChange((activeIndex - 1 + panels.length) % panels.length);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, activeIndex, onChange, panels.length]);

  return (
    <AnimatePresence>
      {isOpen && active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
          style={{
            backgroundColor: 'hsl(var(--color-green) / 0.85)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => onChange(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto lg:overflow-hidden grid lg:grid-cols-2"
            style={{
              backgroundColor: cream,
              border: '1px solid hsl(var(--color-gold) / 0.35)',
              boxShadow: 'var(--shadow-large)',
            }}
          >
            {/* Controls */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
              <span
                className="font-gotham text-[11px] tracking-[0.15em] px-2.5 py-1 mr-1"
                style={{ backgroundColor: 'hsl(var(--color-green) / 0.9)', color: gold }}
              >
                {activeIndex + 1} / {panels.length}
              </span>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous event"
                className="p-1.5 transition-opacity hover:opacity-75"
                style={{ backgroundColor: 'hsl(var(--color-green) / 0.9)', color: cream }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next event"
                className="p-1.5 transition-opacity hover:opacity-75"
                style={{ backgroundColor: 'hsl(var(--color-green) / 0.9)', color: cream }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label="Close"
                className="p-1.5 transition-opacity hover:opacity-75"
                style={{ backgroundColor: gold, color: brown }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Left — header + story */}
            <div className="relative flex flex-col min-h-0 lg:overflow-y-auto">
              <div
                className="relative h-44 sm:h-52 lg:h-60 shrink-0 flex items-end"
                style={{ backgroundColor: green }}
              >
                {active.image ? (
                  <>
                    <img
                      src={active.image}
                      alt={active.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, hsl(var(--color-green) / 0.92) 0%, hsl(var(--color-green) / 0.3) 100%)',
                      }}
                    />
                  </>
                ) : (
                  /* No photograph for this event — use the gopuram instead. */
                  <img
                    src={templeLineArt}
                    alt=""
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[85%] w-auto opacity-60"
                  />
                )}

                <div className="relative w-full p-6 lg:p-8">
                  <h3
                    id="event-modal-title"
                    className="heading-display text-[23px] lg:text-[30px] pr-28"
                    style={{ color: cream }}
                  >
                    {active.title}
                  </h3>
                </div>
                <TornEdge color={cream} position="bottom" />
              </div>

              <div className="p-6 lg:p-8">
                <p className="body-text mb-6 italic">{active.blurb}</p>
                <ul className="space-y-3">
                  {active.highlights.map((h) => (
                    <li key={h} className="flex gap-3.5 items-start">
                      <span
                        className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: green }}
                        aria-hidden="true"
                      />
                      <span className="body-text">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — the enquiry form. Keyed so state resets per event. */}
            <div
              className="relative p-6 lg:p-8 lg:overflow-y-auto min-h-0 border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: 'hsl(var(--color-gold) / 0.35)' }}
            >
              <h4 className="heading-display text-[21px] lg:text-[25px]">
                {active.def.formTitle}
              </h4>
              <EventEnquiryForm key={active.def.id} def={active.def} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
