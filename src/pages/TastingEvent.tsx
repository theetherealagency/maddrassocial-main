import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import tastingSlide2 from '@/assets/tasting-slide-2.png';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import MandalaBackground from '@/components/MandalaBackground';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import { trackFormSuccess } from '@/lib/analytics';

const Newsletter = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        form_type: 'newsletter',
        name: formData.name,
        email: formData.email,
        subject: 'Newsletter Signup',
        message: 'Signed up for Madras Mami newsletter',
      });
      if (error) throw error;
      trackFormSuccess('newsletter');
      setIsSubmitted(true);
      toast({ title: "Welcome to the family!", description: "Mami will be in touch soon." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData(p => ({ ...p, [k]: e.target.value }));

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 font-gotham font-medium">
              Welcome to Mami's Circle
            </p>
            <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-3">
              You're part of the family now
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Like a seat at the family table — you're in. Expect the good stuff straight to your inbox.
            </p>
            <a href="/" className="btn-cta">Back to Home</a>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[30vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden pt-16">
        <img src={tastingSlide2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DBB640]/30 to-transparent z-[2]" />
        <div className="relative z-10 text-center px-5 py-12 md:py-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#DBB640] mb-3 font-gotham font-medium">
            Brampton's South Indian Table
          </p>
          <h1 className="font-kugile text-2xl sm:text-3xl md:text-5xl text-[#F2EBD6] mb-3">
            Mami's Circle
          </h1>
          <div className="w-10 h-px bg-[#DBB640]/50 mx-auto mb-3" />
          <p className="text-[#F2EBD6]/80 text-xs max-w-md mx-auto font-gotham tracking-wide leading-relaxed">
            Pull up a chair. Be the first to know about new dishes, events, seasonal specials, and everything happening at Madras Mami — straight from Mami's kitchen to your inbox.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="py-12 md:py-16 px-6 border-b border-border/20">
        <div className="container mx-auto max-w-3xl">
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-gotham font-medium text-center mb-8">
            What's in it for you
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="py-6 px-4">
              <p className="font-kugile text-lg text-primary mb-2">Early Access</p>
              <p className="text-xs text-muted-foreground font-gotham leading-relaxed">
                New menu drops, seasonal specials, and limited dishes — you hear about them before anyone else walks through the door.
              </p>
            </div>
            <div className="py-6 px-4 md:border-x border-border/20">
              <p className="font-kugile text-lg text-primary mb-2">Exclusive Offers</p>
              <p className="text-xs text-muted-foreground font-gotham leading-relaxed">
                Members-only deals, birthday treats, and the kind of discounts Mami only shares with family.
              </p>
            </div>
            <div className="py-6 px-4">
              <p className="font-kugile text-lg text-primary mb-2">Events & Tastings</p>
              <p className="text-xs text-muted-foreground font-gotham leading-relaxed">
                Cultural nights, community gatherings, food tastings — get priority invites before seats fill up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <main className="py-16 md:py-24 relative overflow-hidden">
        <MandalaBackground position="top-left" opacity={0.08} scale={0.7} rotate={-10} />
        <MandalaBackground position="bottom-right" opacity={0.06} scale={0.5} rotate={35} />

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div
            ref={ref}
            className={`max-w-sm mx-auto transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 font-gotham font-medium">
                Join Free
              </p>
              <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-3">
                Get on the list
              </h2>
              <div className="w-8 h-px bg-accent/50 mx-auto mb-4" />
              <p className="text-xs text-muted-foreground font-gotham leading-relaxed">
                No spam. Just dosas, deals, and Mami's stories. Unsubscribe anytime.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={update("name")}
                  className="form-input text-sm py-3 w-full"
                  placeholder="Your name *"
                />
                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={update("email")}
                  className="form-input text-sm py-3 w-full"
                  placeholder="Email address *"
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-cta w-full py-3">
                {isSubmitting ? "Adding you to the family…" : "Join Mami's Circle"}
              </button>
              <p className="text-[10px] text-center text-muted-foreground font-gotham tracking-wide pt-1">
                By signing up you agree to receive emails from Madras Mami. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </main>

      <HomeFooter />
      <FloatingOrderCTA />
    </div>
  );
};

export default Newsletter;
