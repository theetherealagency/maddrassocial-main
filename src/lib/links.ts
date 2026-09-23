/**
 * External ordering link.
 *
 * PENDING — Madras Social has no online-ordering URL yet (see PENDING.md).
 * While this is null every consumer must render its fallback: a disabled
 * button carrying the real label, or an internal link to /menu. Never a dead
 * link and never a placeholder URL.
 *
 * When the URL arrives, set it here and the buttons re-enable on their own.
 */
export const ONLINE_ORDER_URL: string | null = null;

/**
 * Reservations link.
 *
 * Client instruction, 2026-09-23: reservations must go to the real, live
 * booking page at madrassocial.ca/reservations (a separate Next.js project,
 * with the actual OpenTable widget) — not this repo's own /reservations
 * route. Every nav item and CTA that used to point at the internal route
 * now opens this URL instead.
 */
export const RESERVE_URL = "https://www.madrassocial.ca/reservations";

/**
 * Careers link.
 *
 * Client instruction, 2026-09-23: "this has to be the careers page" — the
 * real, live hiring site, same pattern as RESERVE_URL above. Every nav item
 * that used to point at this repo's own /careers route now opens this
 * instead.
 */
export const CAREERS_URL = "https://hiring.madrassocial.ca";
