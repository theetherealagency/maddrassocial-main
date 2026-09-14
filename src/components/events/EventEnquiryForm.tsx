import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { EventFormDef, FieldDef } from './eventForms';
import { trackFormSuccess } from '@/lib/analytics';

/* One renderer for every catering enquiry form.

   Each submission goes to two places: the Google Sheet (which also sends the
   confirmation to the enquirer and the notification to the business — see
   apps-script/catering/Code.gs) and the site's Supabase `leads` table. A lead is
   only lost if both fail, so that is the only case that blocks the success
   state. Follows the same shape as BrunchTasting.tsx. */

/* Apps Script web app URL. Without it the sheet write simply fails and the
   Supabase row still saves, so the form keeps working before setup. */
const SHEET_ENDPOINT = import.meta.env.VITE_CATERING_SHEET_ENDPOINT as string | undefined;
const SHEET_TOKEN = 'mami-catering-2026';

async function postToSheet(payload: Record<string, unknown>) {
  if (!SHEET_ENDPOINT) throw new Error('catering sheet endpoint not configured');
  /* text/plain keeps this a "simple" request, so there is no CORS preflight —
     which Apps Script cannot answer. */
  const res = await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, token: SHEET_TOKEN }),
  });
  if (!res.ok) throw new Error('sheet endpoint returned ' + res.status);
  /* Apps Script answers 200 even when it fails, so the body is the real signal. */
  const text = await res.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error('sheet endpoint returned non-JSON: ' + text.slice(0, 120));
  }
  if (!body.ok) throw new Error('sheet endpoint rejected: ' + (body.error || 'unknown'));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return d;
};

/* Textareas and checkbox groups need the full row; everything else pairs up. */
const isWide = (f: FieldDef) => f.type === 'textarea' || f.type === 'checkboxes';

/* Required-field wording per input type — "enter your date" reads badly. */
const requiredMessage = (f: FieldDef) => {
  if (f.type === 'date') return 'Please choose a date.';
  if (f.type === 'number') return 'Please tell us how many guests.';
  if (f.type === 'select') return `Please choose a ${f.label.toLowerCase()}.`;
  if (f.type === 'tel') return 'Please enter your phone number.';
  if (f.type === 'email') return 'Please enter your email address.';
  return `Please enter your ${f.label.toLowerCase()}.`;
};

const validate = (f: FieldDef, value: string): string => {
  const v = value.trim();
  if (f.required && !v) return requiredMessage(f);
  if (!v) return '';
  if (f.type === 'email' && !EMAIL_RE.test(v)) return 'Please enter a valid email address.';
  if (f.type === 'tel') {
    const d = v.replace(/\D/g, '');
    if (d.length < 10 || d.length > 11) return 'Please enter a 10-digit phone number.';
  }
  if (f.type === 'number' && Number(v) < 1) return 'Please enter at least 1 guest.';
  return '';
};

const EventEnquiryForm = ({ def }: { def: EventFormDef }) => {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...(def.initialValues ?? {}),
  }));
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fieldId = (name: string) => `${def.id}-${name}`;

  const setValue = (f: FieldDef, raw: string) => {
    const value = f.type === 'tel' ? formatPhone(raw) : raw;
    setValues((p) => ({ ...p, [f.name]: value }));
    /* Only clear a live error — don't start complaining mid-typing. */
    if (errors[f.name]) setErrors((p) => ({ ...p, [f.name]: validate(f, value) }));
  };

  const toggleCheckbox = (f: FieldDef, option: string) => {
    setPicked((p) => {
      const current = p[f.name] ?? [];
      return {
        ...p,
        [f.name]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: Record<string, string> = {};
    def.fields.forEach((f) => {
      const msg = validate(f, values[f.name] ?? '');
      if (msg) next[f.name] = msg;
    });
    if (!consent) next.consent = 'Please tick the box so we can contact you.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = def.fields.find((f) => next[f.name]);
      if (first) document.getElementById(fieldId(first.name))?.focus();
      return;
    }

    setIsSubmitting(true);

    /* Every answered field goes into the message body so nothing is lost, even
       though a few also land in their own columns. */
    const summary = def.fields
      .map((f) => {
        const answer = f.type === 'checkboxes' ? (picked[f.name] ?? []).join(', ') : values[f.name];
        return answer?.trim() ? `${f.label}: ${answer.trim()}` : null;
      })
      .filter(Boolean)
      .join('\n');

    const arrayField = def.fields.find((f) => f.column === 'dietary_preferences');
    const dishField = def.fields.find((f) => f.column === 'dish_suggestions');
    const val = (name: string) => (values[name] ?? '').trim();

    const [sheet, db] = await Promise.allSettled([
      postToSheet({
        formName: def.formTitle.replace(/ Enquiry$/, ''),
        occasion: val('occasion'),
        fullName: val('fullName'),
        email: val('email'),
        phone: val('phone'),
        eventDate: val('eventDate'),
        guests: val('guests'),
        budget: val('budget'),
        description: val('description'),
        consent,
      }),
      supabase
        .from('leads')
        .insert({
          form_type: def.formType,
          name: val(def.nameField),
          email: val('email'),
          phone: val('phone'),
          subject: def.subject,
          message: summary,
          dietary_preferences: arrayField ? (picked[arrayField.name] ?? null) : null,
          dish_suggestions: dishField ? val(dishField.name) || null : null,
        })
        .then(({ error }) => {
          if (error) throw error;
        }),
    ]);

    if (sheet.status === 'rejected') console.error('catering sheet write failed:', sheet.reason);
    if (db.status === 'rejected') console.error('leads insert failed:', db.reason);
    const bothFailed = sheet.status === 'rejected' && db.status === 'rejected';

    setIsSubmitting(false);

    if (bothFailed) {
      toast({
        title: "That didn't go through",
        description: 'Please try again, or call us at (905) 913-5900.',
        variant: 'destructive',
      });
      return;
    }

    trackFormSuccess(def.formType);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-10 px-4">
        <CheckCircle
          className="w-10 h-10 mx-auto mb-5"
          style={{ color: 'hsl(var(--color-green))' }}
          aria-hidden="true"
        />
        <p className="heading-display text-[22px] md:text-[26px] mb-3">Thank you</p>
        <p className="body-text max-w-sm mx-auto">
          Your enquiry is with us and a confirmation is on its way to your inbox. Our team will
          be in touch shortly to shape the menu around your gathering. For urgent bookings,
          call{' '}
          <a href="tel:+19059135900" className="underline">
            (905) 913-5900
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6">
      {def.formIntro && <p className="body-text mb-6 italic">{def.formIntro}</p>}

      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
        {def.fields.map((f) => {
          const id = fieldId(f.name);
          const error = errors[f.name];
          const described = [f.helper ? `${id}-helper` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={f.name} className={isWide(f) ? 'sm:col-span-2' : ''}>
              <label
                htmlFor={id}
                className="block font-gotham text-[11px] uppercase tracking-[0.18em] mb-2"
                style={{ color: 'hsl(var(--color-brown))' }}
              >
                {f.label}
                {f.required && (
                  <span style={{ color: 'hsl(var(--color-green))' }} aria-hidden="true">
                    {' '}
                    *
                  </span>
                )}
              </label>

              {f.helper && (
                <p
                  id={`${id}-helper`}
                  className="font-gotham text-[12px] leading-[1.6] mb-2 opacity-70"
                >
                  {f.helper}
                </p>
              )}

              {f.type === 'textarea' ? (
                <textarea
                  id={id}
                  rows={3}
                  value={values[f.name] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => setValue(f, e.target.value)}
                  onBlur={() => setErrors((p) => ({ ...p, [f.name]: validate(f, values[f.name] ?? '') }))}
                  aria-invalid={!!error}
                  aria-describedby={described || undefined}
                  className="form-input resize-y font-gotham text-sm"
                />
              ) : f.type === 'select' ? (
                <select
                  id={id}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setValue(f, e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={described || undefined}
                  className="form-input font-gotham text-sm"
                >
                  <option value="">Select an option</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === 'checkboxes' ? (
                <div
                  id={id}
                  role="group"
                  aria-label={f.label}
                  className="flex flex-wrap gap-x-6 gap-y-3 pt-1"
                >
                  {f.options?.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2.5 cursor-pointer font-gotham text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={(picked[f.name] ?? []).includes(o)}
                        onChange={() => toggleCheckbox(f, o)}
                        className="w-4 h-4 shrink-0 accent-[hsl(var(--color-green))]"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  id={id}
                  type={f.type}
                  inputMode={f.type === 'tel' ? 'tel' : undefined}
                  min={f.type === 'number' ? 1 : undefined}
                  value={values[f.name] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => setValue(f, e.target.value)}
                  onBlur={() => setErrors((p) => ({ ...p, [f.name]: validate(f, values[f.name] ?? '') }))}
                  aria-invalid={!!error}
                  aria-describedby={described || undefined}
                  className="form-input font-gotham text-sm"
                />
              )}

              {error && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="font-gotham text-[12px] mt-1.5"
                  style={{ color: 'hsl(var(--destructive))' }}
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <label className="flex items-start gap-3 mt-7 cursor-pointer font-gotham text-[13px] leading-[1.6]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setErrors((p) => ({ ...p, consent: '' }));
          }}
          aria-invalid={!!errors.consent}
          className="mt-0.5 w-4 h-4 shrink-0 accent-[hsl(var(--color-green))]"
        />
        <span>{def.consentLabel}</span>
      </label>
      {errors.consent && (
        <p
          role="alert"
          className="font-gotham text-[12px] mt-1.5"
          style={{ color: 'hsl(var(--destructive))' }}
        >
          {errors.consent}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-cta w-full mt-7 disabled:opacity-60">
        {isSubmitting ? 'Sending…' : def.submitLabel}
      </button>
    </form>
  );
};

export default EventEnquiryForm;
