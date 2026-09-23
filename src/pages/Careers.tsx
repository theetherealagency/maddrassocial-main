import { useRef, useState } from 'react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import { useToast } from '@/hooks/use-toast';
import careersBg from '@/assets/careers-brand-bg.jpg';

/**
 * Rebuilt 2026-09-23 (round 2) to match the real page visually, not just in
 * content — client: "like you did for reservation page do it for careers
 * page as well." Pulled styles.css straight off the live hiring site
 * (madrassocial.ca/hiring/styles.css: `.careers-page`, `.careers-bg`,
 * `.c-block`/`.c-panel`, `.role-open`, the form/chip/upload rules) and the
 * fixed duotone background (`assets/brand-bg.jpg` — a Chennai street photo
 * in the brand's terracotta duotone, "not stock restaurant photography" per
 * that file's own comment).
 *
 * The real page's whole visual identity is: fixed full-bleed duotone
 * background, dark Carbon page, glass panels (semi-transparent Carbon +
 * gold border) floating over it for the open-positions list and the form.
 * That's reproduced here. What ISN'T reproduced is the real page's own
 * sticky dark nav and footer — this site has one shared header/footer
 * everywhere (client instruction, 2026-09-23, same thread as "same website,
 * not a separate landing page"), so HomeNavbar/HomeFooter stay.
 *
 * GOLD IS A REAL, DISTINCT COLOUR HERE — #c9a55c, antique gold — not this
 * codebase's `--color-gold` CSS variable, which actually holds the
 * terracotta hex (a leftover mislabel from the Madras Mami clone this site
 * started from). Used as a literal hex below rather than perpetuating that
 * mislabel onto a page where the real design calls for actual gold.
 *
 * Content/backend logic — real current roles, the real application form
 * fields, the real Google Apps Script endpoint — is unchanged from the
 * previous pass; see that commit for where each of those came from.
 */
const GOLD = '#c9a55c';
const GOLD_SOFT = '#dac49a';
const CARBON = '#1f1b1a';
const LINEN = '#ece4d8';
const OLIVE = '#a59976';
const UMBER = '#a83d24';

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxy2Q5nKclp3SPw4LWrt8naSzSyeq0ypWarHYGULBOhasG9WlALVc6ay7ZcrB7nET49/exec';
const REF_PREFIX = 'MS-2026';
const RESUME_MAX_MB = 5;
const TALENT_POOL = 'Talent pool — keep me on file';

type Role = { title: string; openings: number; type: string; urgent?: boolean };

const ROLES: Role[] = [
  { title: 'Bartender', openings: 1, type: 'Full / part time', urgent: true },
  { title: 'Front of House (FOH)', openings: 2, type: 'Full / part time' },
  { title: 'Kitchen Helper', openings: 2, type: 'Full / part time' },
];

const AVAILABILITY_OPTIONS = ['Days', 'Evenings', 'Weekends'];
const TYPE_OPTIONS = ['Full time', 'Part time', 'Either works'];
const EXPERIENCE_OPTIONS = [
  'None yet — willing to learn',
  'Under 1 year',
  '1–3 years',
  '3–5 years',
  '5+ years',
];

type Resume = { name: string; mime: string; data: string };

const fileToResume = (file: File): Promise<Resume> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve({ name: file.name, mime: file.type || 'application/octet-stream', data: result.split(',')[1] });
    };
    reader.onerror = () => reject(new Error('read-failed'));
    reader.readAsDataURL(file);
  });

/** Field label, in the real page's own style: small, uppercase, Seruni,
    olive — `label{font-family:var(--font-accent);...color:var(--olive)}`. */
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label
    className="font-accent block uppercase mb-2"
    style={{ fontSize: '11px', letterSpacing: '0.22em', color: OLIVE }}
  >
    {children}
  </label>
);

/** `input,select,textarea{...border:1px solid rgba(31,27,26,.25)}` plus the
    dark-page override `.careers-page input{background-color:rgba(23,20,19,.7)}`. */
const fieldClass =
  'font-body w-full text-[15px] font-light px-4 py-3.5 border transition-colors focus:outline-none';
const fieldStyle: React.CSSProperties = {
  backgroundColor: 'rgba(23,20,19,.7)',
  borderColor: 'rgba(236,228,216,.25)',
  color: LINEN,
};

const RoleCard = ({ role, onApply }: { role: Role; onApply: (title: string) => void }) => (
  <div
    className="flex flex-wrap items-center gap-3 px-5 py-4 border transition-colors"
    style={{ borderColor: 'rgba(201,165,92,.34)', backgroundColor: 'rgba(236,228,216,.05)' }}
  >
    <span className="font-display" style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: LINEN }}>
      {role.title}
    </span>
    {role.urgent && (
      <span
        className="text-[10px] uppercase tracking-[0.18em] font-body font-bold rounded-full px-3 py-1.5"
        style={{ backgroundColor: UMBER, color: LINEN }}
      >
        Urgent — Immediate Hire
      </span>
    )}
    <span
      className="text-[10px] uppercase tracking-[0.18em] font-body font-bold rounded-full px-3 py-1.5"
      style={{ backgroundColor: 'rgba(201,165,92,.18)', color: GOLD_SOFT }}
    >
      {role.openings} opening{role.openings > 1 ? 's' : ''}
    </span>
    <span
      className="text-[10px] uppercase tracking-[0.18em] font-body font-bold rounded-full px-3 py-1.5"
      style={{ backgroundColor: 'rgba(65,76,42,.28)', color: '#9fa08a' }}
    >
      {role.type}
    </span>
    <button
      type="button"
      onClick={() => onApply(role.title)}
      className="ml-auto text-[11px] uppercase tracking-[0.24em] font-body font-semibold px-6 py-3 border transition-colors"
      style={{ borderColor: GOLD, color: GOLD }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = CARBON; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = GOLD; }}
    >
      Apply
    </button>
  </div>
);

const Careers = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState(REF_PREFIX);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [resumeError, setResumeError] = useState('');
  const [resume, setResume] = useState<Resume | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', role: '', type: TYPE_OPTIONS[0],
    experience: EXPERIENCE_OPTIONS[0], start: '', referral: '', note: '',
  });

  const scrollToForm = (prefillRole?: string) => {
    if (prefillRole) setForm((f) => ({ ...f, role: prefillRole }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleAvailability = (option: string) =>
    setAvailability((a) => (a.includes(option) ? a.filter((x) => x !== option) : [...a, option]));

  const handleFile = async (file: File | undefined) => {
    setResumeError('');
    if (!file) return;
    if (file.size > RESUME_MAX_MB * 1024 * 1024) {
      setResumeError(`That file is over ${RESUME_MAX_MB} MB — a smaller PDF works best.`);
      return;
    }
    if (!/\.(pdf|docx?|DOCX?|PDF)$/i.test(file.name)) {
      setResumeError('PDF or Word files only, please.');
      return;
    }
    try {
      setResume(await fileToResume(file));
    } catch {
      setResumeError('That file could not be read — try another.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) { setSubmitted(true); return; }

    const nextErrors: Record<string, boolean> = {
      name: form.name.trim().length < 2,
      phone: form.phone.replace(/\D/g, '').length < 10,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()),
      start: !form.start,
      role: !form.role,
    };
    setErrors(nextErrors);
    if (!resume) setResumeError(`Please attach your resume — PDF or Word, max ${RESUME_MAX_MB} MB.`);
    if (Object.values(nextErrors).some(Boolean) || !resume) return;

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          kind: 'application',
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          role: form.role,
          type: form.type,
          availability: availability.join(', '),
          experience: form.experience,
          start: form.start,
          referral: form.referral.trim(),
          note: form.note.trim(),
          source: 'website',
          page: '/careers',
          resume,
        }),
      });
      const data = await res.json().catch(() => null);
      if (data?.duplicate) {
        toast({ title: 'Already on file', description: 'Looks like you already applied with this number — one application covers you. We have it.' });
        setSubmitting(false);
        return;
      }
      if (data?.ok === false) throw new Error('backend-failed');
      setRefNumber(data?.ref || REF_PREFIX);
      setSubmitted(true);
    } catch {
      toast({
        title: 'Something hiccuped',
        description: "Try once more, or email hello@madrassocial.ca with your name and number.",
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: CARBON }}>
      {/* Fixed full-bleed duotone background — the real page's own
          `.careers-bg`: a Chennai street photo in the brand's terracotta
          duotone, not stock restaurant photography. */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <img src={careersBg} alt="" className="h-full w-full object-cover" style={{ backgroundColor: '#792c1a' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(23,20,19,.82) 0%, rgba(23,20,19,.7) 38%, rgba(23,20,19,.86) 100%)' }}
        />
      </div>

      <div className="relative z-10">
        <HomeNavbar />
        <h1 className="sr-only">Careers at Madras Social — Join the Opening Team</h1>

        <main className="mx-auto px-6" style={{ maxWidth: '840px', paddingTop: 'clamp(96px,10vw,132px)', paddingBottom: 'clamp(56px,8vw,88px)' }}>

          {/* Hero — real copy verbatim: "Before we open" eyebrow, "Help us
              open Madras Social." / "Floor and kitchen." heading, with a
              radial vignette behind the type so it holds up over the photo. */}
          <div className="relative text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-[24%] -inset-y-[140%] -z-10"
              style={{ background: 'radial-gradient(50% 46% at 50% 50%, rgba(23,20,19,.7) 0%, rgba(23,20,19,.42) 55%, rgba(23,20,19,0) 78%)' }}
            />
            <p className="font-accent uppercase mb-4" style={{ fontSize: '11px', letterSpacing: '0.22em', color: OLIVE }}>
              Before we open
            </p>
            <h2
              className="font-display leading-[1.26]"
              style={{ fontSize: 'clamp(1.6rem,3.1vw,2.35rem)', color: LINEN, textShadow: '0 2px 22px rgba(23,20,19,.7)' }}
            >
              Help us open Madras Social.
              <br />
              <span style={{ color: GOLD }}>Floor and kitchen.</span>
            </h2>
          </div>

          {/* Open positions — real page's `.c-block` + `.c-panel`: a glass
              panel (semi-transparent Carbon, gold border) over the photo. */}
          <div style={{ marginTop: 'clamp(28px,4vw,48px)' }}>
            <p
              className="font-accent uppercase pb-3 mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.22em', color: OLIVE, borderBottom: '1px solid rgba(165,153,118,.25)' }}
            >
              Open positions
            </p>
            <div
              className="grid gap-3"
              style={{ backgroundColor: 'rgba(23,20,19,.82)', border: '1px solid rgba(201,165,92,.4)', padding: 'clamp(26px,4.5vw,44px)' }}
            >
              {ROLES.map((role) => (
                <RoleCard key={role.title} role={role} onApply={scrollToForm} />
              ))}
            </div>
          </div>

          {/* Apply — same glass-panel treatment. */}
          <div ref={formRef} className="scroll-mt-24" style={{ marginTop: 'clamp(28px,4vw,48px)' }}>
            <p
              className="font-accent uppercase pb-3 mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.22em', color: OLIVE, borderBottom: '1px solid rgba(165,153,118,.25)' }}
            >
              Apply
            </p>

            <div style={{ backgroundColor: 'rgba(23,20,19,.82)', border: '1px solid rgba(201,165,92,.4)', padding: 'clamp(26px,4.5vw,44px)' }}>
              {submitted ? (
                <div className="text-center py-6">
                  <p className="font-accent uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '0.22em', color: OLIVE }}>
                    Application received
                  </p>
                  <p className="font-display" style={{ fontSize: '1.9rem', letterSpacing: '0.05em', color: GOLD_SOFT, margin: '16px 0' }}>
                    {refNumber}
                  </p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'rgba(236,228,216,.85)', fontWeight: 300 }}>
                    That's your reference number. We read everything and we text — keep an eye on your phone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel>Full name</FieldLabel>
                      <input type="text" autoComplete="name" value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={fieldClass} style={{ ...fieldStyle, borderColor: errors.name ? UMBER : fieldStyle.borderColor }} />
                      {errors.name && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>We'll need your name.</p>}
                    </div>
                    <div>
                      <FieldLabel>Phone</FieldLabel>
                      <input type="tel" autoComplete="tel" value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={fieldClass} style={{ ...fieldStyle, borderColor: errors.phone ? UMBER : fieldStyle.borderColor }} />
                      {errors.phone && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>A phone number we can text.</p>}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input type="email" autoComplete="email" value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={fieldClass} style={{ ...fieldStyle, borderColor: errors.email ? UMBER : fieldStyle.borderColor }} />
                    {errors.email && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>That email doesn't look right.</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel>Role</FieldLabel>
                      <select value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        className={fieldClass} style={{ ...fieldStyle, borderColor: errors.role ? UMBER : fieldStyle.borderColor }}>
                        <option value="" disabled>Choose a role</option>
                        {ROLES.map((r) => <option key={r.title}>{r.title}</option>)}
                        <option>{TALENT_POOL}</option>
                      </select>
                      {errors.role && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>Pick a role — or the talent pool.</p>}
                    </div>
                    <div>
                      <FieldLabel>Full or part time</FieldLabel>
                      <select value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        className={fieldClass} style={fieldStyle}>
                        {TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Availability</FieldLabel>
                    <div className="flex flex-wrap gap-2.5">
                      {AVAILABILITY_OPTIONS.map((option) => {
                        const on = availability.includes(option);
                        return (
                          <button type="button" key={option} onClick={() => toggleAvailability(option)}
                            className="text-[13px] font-body font-medium px-5 py-2.5 rounded-full border transition-colors"
                            style={on
                              ? { backgroundColor: GOLD, color: CARBON, borderColor: GOLD, fontWeight: 600 }
                              : { backgroundColor: 'transparent', color: LINEN, borderColor: 'rgba(236,228,216,.35)' }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel>Years of experience</FieldLabel>
                      <select value={form.experience}
                        onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                        className={fieldClass} style={fieldStyle}>
                        {EXPERIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Earliest start date</FieldLabel>
                      <input type="date" value={form.start}
                        onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                        className={fieldClass} style={{ ...fieldStyle, borderColor: errors.start ? UMBER : fieldStyle.borderColor, colorScheme: 'dark' }} />
                      {errors.start && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>The one field we really need.</p>}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Resume</FieldLabel>
                    <label
                      className="flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-7 text-center cursor-pointer transition-colors"
                      style={{ borderColor: 'rgba(236,228,216,.4)', backgroundColor: 'rgba(23,20,19,.6)' }}
                    >
                      <span className="text-[13px] font-light" style={{ color: 'rgba(236,228,216,.75)' }}>
                        Drop a PDF or Word file here, or tap to choose · max {RESUME_MAX_MB} MB
                      </span>
                      {resume && <span className="text-[13px] font-medium mt-1" style={{ color: GOLD_SOFT }}>✓ {resume.name}</span>}
                      <input type="file" accept=".pdf,.doc,.docx" className="sr-only"
                        onChange={(e) => handleFile(e.target.files?.[0])} />
                    </label>
                    {resumeError && <p className="text-[11px] mt-1.5" style={{ color: UMBER }}>{resumeError}</p>}
                  </div>

                  <div>
                    <FieldLabel>Referred by someone here? <span style={{ opacity: 0.55, textTransform: 'none', letterSpacing: '0.05em' }}>(optional)</span></FieldLabel>
                    <input type="text" placeholder="Their name" value={form.referral}
                      onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value }))}
                      className={fieldClass} style={fieldStyle} />
                  </div>

                  <div>
                    <FieldLabel>Anything else? <span style={{ opacity: 0.55, textTransform: 'none', letterSpacing: '0.05em' }}>(optional)</span></FieldLabel>
                    <textarea rows={3} placeholder="A line or two is plenty." value={form.note}
                      onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                      className={`${fieldClass} resize-none`} style={fieldStyle} />
                  </div>

                  {/* Honeypot — hidden from real applicants, catches simple bots. */}
                  <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1} autoComplete="off" aria-hidden="true"
                    style={{ position: 'absolute', left: '-5000px' }} />

                  <div className="text-center pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full md:w-auto font-body font-semibold uppercase text-[12px] px-9 py-4 transition-colors"
                      style={{ minWidth: 'min(100%, 300px)', backgroundColor: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, letterSpacing: '0.26em' }}
                      onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = CARBON; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = GOLD; }}
                    >
                      {submitting ? 'Sending…' : 'Send it in'}
                    </button>
                    <p className="text-[13px] mt-4 font-light" style={{ color: 'rgba(236,228,216,.6)' }}>
                      We read everything and we text — keep an eye on your phone.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </main>

        <HomeFooter />
      </div>
    </div>
  );
};

export default Careers;
