import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackFormSuccess, trackPopup } from '@/lib/analytics';

const TastingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('newsletterPopupShown');
    if (hasSeenPopup) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      trackPopup('shown', 'newsletter');
      sessionStorage.setItem('newsletterPopupShown', 'true');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured — see .env.example');
      const { error } = await supabase.from('leads').insert({
        form_type: 'newsletter',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        subject: 'Newsletter Signup — Popup',
        message: 'Signed up via homepage popup',
      });
      if (error) throw error;
      trackFormSuccess('newsletter');
      setIsSubmitted(true);
      toast({ title: "You're in!", description: "We'll be in touch." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(p => ({ ...p, [k]: e.target.value }));
      if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
    };

  /* Backdrop and the X are dismissals; closing from the success screen is not. */
  const dismiss = () => {
    trackPopup('dismissed', 'newsletter');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      <div
        className="relative w-full max-w-sm rounded-sm border bg-background p-6 md:p-8"
        style={{ borderColor: "rgba(219,182,64,0.2)" }}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-4">
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 font-gotham font-medium">
              You're on the list
            </p>
            <h2 className="font-kugile text-2xl text-primary mb-3">
              Thanks — see you soon
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed mb-6">
              We'll email you when the doors open, and when something worth coming in for lands on the menu.
            </p>
            <button onClick={() => setIsOpen(false)} className="btn-cta px-6 py-2.5">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-2 font-gotham font-medium">
                Madras Social, Waterloo
              </p>
              <h2 className="font-kugile text-2xl text-primary mb-2">
                Opening in Waterloo Region
              </h2>
              <div className="w-8 h-px bg-accent/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                A South Indian kitchen and bar on Erb Street West. Leave your email and we'll tell you when to book.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={update("firstName")}
                    className={`form-input text-sm py-2.5 w-full ${errors.firstName ? "border-destructive" : ""}`}
                    placeholder="First name *"
                  />
                  {errors.firstName && <p className="text-destructive text-[10px] mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={update("lastName")}
                    className={`form-input text-sm py-2.5 w-full ${errors.lastName ? "border-destructive" : ""}`}
                    placeholder="Last name *"
                  />
                  {errors.lastName && <p className="text-destructive text-[10px] mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={update("email")}
                  className={`form-input text-sm py-2.5 w-full ${errors.email ? "border-destructive" : ""}`}
                  placeholder="Email address *"
                />
                {errors.email && <p className="text-destructive text-[10px] mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={update("phone")}
                  className={`form-input text-sm py-2.5 w-full ${errors.phone ? "border-destructive" : ""}`}
                  placeholder="Phone number *"
                />
                {errors.phone && <p className="text-destructive text-[10px] mt-1">{errors.phone}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-cta w-full py-3">
                {isSubmitting ? "Adding you…" : "Keep me posted"}
              </button>

              <p className="text-center text-muted-foreground/60 text-[10px] font-gotham">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TastingPopup;
