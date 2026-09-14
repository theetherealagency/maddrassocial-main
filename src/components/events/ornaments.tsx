/* Shared decorative primitives for the Events page, drawn rather than imported
   so they tint with the brand tokens and cost no extra assets. */

/** Deckled paper edge, drawn in the neighbouring background colour. */
export const TornEdge = ({
  color,
  position = 'bottom',
}: {
  color: string;
  position?: 'top' | 'bottom';
}) => (
  <svg
    viewBox="0 0 100 5"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`absolute left-0 w-full h-[10px] pointer-events-none ${
      position === 'bottom' ? 'bottom-0' : 'top-0 rotate-180'
    }`}
  >
    <path
      d="M0 5 L0 2.6 L4 1.7 L8 2.9 L12 1.4 L16 2.5 L20 1.6 L24 3.0 L28 1.9 L32 2.6 L36 1.5
         L40 2.8 L44 1.8 L48 2.9 L52 1.6 L56 2.7 L60 2.0 L64 3.0 L68 1.7 L72 2.5 L76 1.9
         L80 2.8 L84 1.5 L88 2.6 L92 1.8 L96 2.7 L100 1.6 L100 5 Z"
      fill={color}
    />
  </svg>
);
