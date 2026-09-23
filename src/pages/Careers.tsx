import { useRef, useState } from 'react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import { useToast } from '@/hooks/use-toast';

/**
 * Rebuilt 2026-09-23 to match the client's own live hiring page —
 * madrassocial.ca/hiring/careers — client instruction: "I want
 * [that page] as career page not as a separate page but in the same
 * website we are building." That page is a real, working application
 * form wired to the client's own Google Apps Script backend
 * (config.js's ENDPOINT), not a mockup — so this isn't a redesign from
 * scratch, it's the same copy, the same fields, the same submission
 * target, rebuilt as a React page with this site's own header and footer
 * instead of a separate hiring.madrassocial.ca landing page.
 *
 * ROLES below mirrors that site's config.js `CONFIG.ROLES` — the "one
 * file the agency edits day-to-day" there. Keep this in sync with it:
 * to close a role, delete its entry; to add one, copy the shape. The
 * previous version of this page (Head Chef / Line Cook / Server /
 * Restaurant Manager, with invented requirements and responsibilities)
 * was PENDING placeholder content that never matched what the client
 * was actually hiring for — replaced entirely.
 */
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

const RoleCard = ({ role, onApply }: { role: Role; onApply: (title: string) => void }) => (
  <div className="flex flex-wrap items-center gap-2 py-4 border-b border-border/30 last:border-b-0">
    <span className="font-display text-[15px] text-primary mr-1">{role.title}</span>
    {role.urgent && (
      <span className="text-[9px] uppercase tracking-[0.15em] font-body font-medium text-[hsl(var(--color-cream))] bg-[hsl(var(--color-gold))] rounded-full px-2 py-1">
        Urgent — Immediate Hire
      </span>
    )}
    <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground border border-border/50 rounded-full px-2 py-1">
      {role.openings} opening{role.openings > 1 ? 's' : ''}
    </span>
    <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground border border-border/50 rounded-full px-2 py-1">
      {role.type}
    </span>
    <button
      type="button"
      onClick={() => onApply(role.title)}
      className="ml-auto text-[10px] uppercase tracking-[0.2em] font-body font-medium text-[hsl(var(--color-gold))] border border-[hsl(var(--color-gold))]/50 rounded-full px-4 py-1.5 hover:bg-[hsl(var(--color-gold))] hover:text-[hsl(var(--color-cream))] transition-colors"
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HomeNavbar />

      {/* Hero — "Before we open" / "Help us open Madras Social. Floor and
          kitchen." is the client's own copy, verbatim. */}
      <section className="relative min-h-[36vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative z-10 text-center px-6 py-16">
          <p className="section-label mb-4">Before we open</p>
          <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-primary leading-tight">
            Help us open Madras Social.
            <br />
            <span style={{ color: 'hsl(var(--color-gold))' }}>Floor and kitchen.</span>
          </h1>
        </div>
      </section>

      <main className="pb-24 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl mx-auto">

            {/* Open positions */}
            <div className="mb-10">
              <p className="section-label mb-4">Open positions</p>
              {ROLES.map((role) => (
                <RoleCard key={role.title} role={role} onApply={scrollToForm} />
              ))}
            </div>

            {/* Apply */}
            <div ref={formRef} className="scroll-mt-24">
              <p className="section-label mb-4">Apply</p>

              {submitted ? (
                <div className="text-center py-12 border border-border/40 rounded-md">
                  <p className="section-label mb-3">Application received</p>
                  <p className="font-display text-2xl text-primary mb-3">{refNumber}</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    That's your reference number. We read everything and we text — keep an eye on your phone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-[10px]">Full name</label>
                      <input type="text" autoComplete="name" value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="form-input text-sm py-2.5" />
                      {errors.name && <p className="text-[11px] text-destructive mt-1">We'll need your name.</p>}
                    </div>
                    <div>
                      <label className="form-label text-[10px]">Phone</label>
                      <input type="tel" autoComplete="tel" value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="form-input text-sm py-2.5" />
                      {errors.phone && <p className="text-[11px] text-destructive mt-1">A phone number we can text.</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-[10px]">Email</label>
                    <input type="email" autoComplete="email" value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="form-input text-sm py-2.5" />
                    {errors.email && <p className="text-[11px] text-destructive mt-1">That email doesn't look right.</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-[10px]">Role</label>
                      <select value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        className="form-input text-sm py-2.5">
                        <option value="" disabled>Choose a role</option>
                        {ROLES.map((r) => <option key={r.title}>{r.title}</option>)}
                        <option>{TALENT_POOL}</option>
                      </select>
                      {errors.role && <p className="text-[11px] text-destructive mt-1">Pick a role — or the talent pool.</p>}
                    </div>
                    <div>
                      <label className="form-label text-[10px]">Full or part time</label>
                      <select value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        className="form-input text-sm py-2.5">
                        {TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-[10px]">Availability</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <button type="button" key={option} onClick={() => toggleAvailability(option)}
                          className={`px-3 py-1.5 rounded-sm border transition-all duration-300 text-[10px] tracking-wide ${
                            availability.includes(option)
                              ? 'bg-accent/15 border-accent text-accent'
                              : 'bg-transparent border-border text-muted-foreground hover:border-accent/40'
                          }`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-[10px]">Years of experience</label>
                      <select value={form.experience}
                        onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                        className="form-input text-sm py-2.5">
                        {EXPERIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label text-[10px]">Earliest start date</label>
                      <input type="date" value={form.start}
                        onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                        className="form-input text-sm py-2.5" />
                      {errors.start && <p className="text-[11px] text-destructive mt-1">The one field we really need.</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-[10px]">Resume</label>
                    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-md px-4 py-6 text-center cursor-pointer hover:border-accent/50 transition-colors">
                      <span className="text-xs text-muted-foreground">
                        Drop a PDF or Word file here, or tap to choose · max {RESUME_MAX_MB} MB
                      </span>
                      {resume && <span className="text-xs text-accent">✓ {resume.name}</span>}
                      <input type="file" accept=".pdf,.doc,.docx" className="sr-only"
                        onChange={(e) => handleFile(e.target.files?.[0])} />
                    </label>
                    {resumeError && <p className="text-[11px] text-destructive mt-1">{resumeError}</p>}
                  </div>

                  <div>
                    <label className="form-label text-[10px]">Referred by someone here? <span className="text-muted-foreground">(optional)</span></label>
                    <input type="text" placeholder="Their name" value={form.referral}
                      onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value }))}
                      className="form-input text-sm py-2.5" />
                  </div>

                  <div>
                    <label className="form-label text-[10px]">Anything else? <span className="text-muted-foreground">(optional)</span></label>
                    <textarea rows={3} placeholder="A line or two is plenty." value={form.note}
                      onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                      className="form-input text-sm resize-none" />
                  </div>

                  {/* Honeypot — hidden from real applicants, catches simple bots. */}
                  <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1} autoComplete="off" aria-hidden="true"
                    style={{ position: 'absolute', left: '-5000px' }} />

                  <div className="text-center pt-2">
                    <button type="submit" disabled={submitting} className="btn-cta w-full md:w-auto md:min-w-[280px] py-3">
                      {submitting ? 'Sending…' : 'Send it in'}
                    </button>
                    <p className="text-[11px] text-muted-foreground mt-4">
                      We read everything and we text — keep an eye on your phone.
                    </p>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <HomeFooter />
      <FloatingOrderCTA />
    </div>
  );
};

export default Careers;
