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
 * Briefly pointed at the live madrassocial.ca/reservations booking page
 * (2026-09-23), then reverted the same day — client: "incorporate these
 * pages to current website and not a different landing page," with the
 * same header/footer as everywhere else. Back to this repo's own
 * /reservations route.
 */
export const RESERVE_URL = "/reservations";

/**
 * Careers link.
 *
 * Same reversal as RESERVE_URL above — briefly pointed at the external
 * hiring.madrassocial.ca site, reverted the same day so Careers stays an
 * internal page on this site with the shared header/footer.
 */
export const CAREERS_URL = "/careers";
