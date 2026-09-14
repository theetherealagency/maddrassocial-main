import { useEffect } from 'react';
import { trackFormStart } from '@/lib/analytics';

/**
 * Fires form_start the first time someone focuses a field inside any <form>.
 *
 * Done with one delegated listener rather than an onFocus on every field, so
 * new forms are covered automatically. The WeakSet dedupes per form element —
 * tabbing between fields must not re-fire, and entries are collected when the
 * form unmounts.
 *
 * The form is identified by its nearest id/name/aria-label, falling back to the
 * route, since these forms carry no consistent identifier of their own.
 */
const EngagementTracker = () => {
  useEffect(() => {
    const started = new WeakSet<HTMLFormElement>();

    const onFocusIn = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;

      const field = target.closest('input, textarea, select');
      if (!field) return;

      const form = field.closest('form');
      if (!form || started.has(form)) return;

      started.add(form);
      const id =
        form.id ||
        form.getAttribute('name') ||
        form.getAttribute('aria-label') ||
        window.location.pathname;
      trackFormStart(id);
    };

    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  return null;
};

export default EngagementTracker;
