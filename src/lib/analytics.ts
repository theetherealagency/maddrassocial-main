/**
 * dataLayer helpers for Google Tag Manager (GTM-TCQRBQ8D).
 *
 * The site is a React Router SPA, so GTM's built-in Page View and Form
 * Submission triggers are not usable:
 *   - Page View fires once, on the initial document load only.
 *   - Form Submission fires on the DOM submit event, which happens *before*
 *     the Supabase insert resolves — it would count failures as conversions.
 *
 * So route changes and form successes are pushed explicitly from app code.
 * Click tracking (phone, email, outbound order) is handled by GTM's native
 * click triggers and needs nothing here.
 */

import { getAttribution, captureAttribution } from './attribution';

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

/** Push an event to the dataLayer. No-ops if GTM never loaded (blocked, SSR). */
export const pushEvent = (event: string, params: DataLayerObject = {}): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

/**
 * Virtual pageview for a client-side route change.
 *
 * The GA4 config tag in GTM must set send_page_view: false, otherwise the
 * initial load is counted twice — once by the config tag, once by this.
 */
export const trackPageview = (path: string, title: string): void => {
  pushEvent('virtual_pageview', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

/**
 * A form that actually persisted. Call only after the write succeeds —
 * never on submit.
 *
 * `formType` mirrors the `form_type` column on the Supabase `leads` table, so
 * GTM/GA4 segments line up with the rows in the database.
 */
export const trackFormSuccess = (formType: string, params: DataLayerObject = {}): void => {
  // First-touch attribution rides along on every lead, so GA4 can report which
  // source produced which kind of enquiry without waiting on a schema change.
  pushEvent('form_success', { form_type: formType, ...getAttribution(), ...params });
};

/**
 * First interaction with a form. Paired with form_success this gives the
 * abandonment rate: how many people start typing versus actually submit.
 */
export const trackFormStart = (formId: string): void => {
  pushEvent('form_start', { form_id: formId });
};

/** Newsletter popup lifecycle: 'shown' | 'dismissed'. */
export const trackPopup = (action: string, name: string): void => {
  pushEvent('popup_interaction', { popup_action: action, popup_name: name });
};

/** Capture the session's source. Safe to call repeatedly; only the first counts. */
export const initAttribution = (): void => {
  captureAttribution();
};
