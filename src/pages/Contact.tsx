import { useState } from 'react';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import MandalaBackground from '@/components/MandalaBackground';
import { useToast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Mail, Phone, Instagram, Facebook, CheckCircle, Send } from 'lucide-react';
import { trackFormSuccess } from '@/lib/analytics';

const Contact = () => {
  const { toast } = useToast();
  const { ref: formRef, isInView: formInView } = useInView({ threshold: 0.1 });
  const { ref: infoRef, isInView: infoInView } = useInView({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured — see .env.example');
      const { error } = await supabase.from('leads').insert({
        form_type: 'contact', name: formData.name, email: formData.email,
        phone: formData.phone || null, subject: formData.subject || null, message: formData.message,
      });
      if (error) throw error;
      trackFormSuccess('contact');
      setIsSubmitted(true);
      toast({ title: "Message Sent!", description: "We'll get back to you soon." });
    } catch (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <h2 className="font-kugile text-2xl text-primary mb-3">Message Sent</h2>
            <p className="text-muted-foreground text-sm mb-8">Like a letter from home, we received it with warmth. We'll respond soon.</p>
            <a href="/" className="btn-cta">Return Home</a>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero — unified off-white background */}
      <section className="relative min-h-[25vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden pt-16">
        <MandalaBackground position="center-left" opacity={0.08} scale={0.8} rotate={-15} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative z-10 text-center px-5 py-10 md:py-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 md:mb-4 font-gotham font-medium">Get in Touch</p>
          <h1 className="font-kugile text-2xl sm:text-3xl md:text-5xl text-primary mb-3 md:mb-4">Contact</h1>
          <div className="w-10 h-px bg-accent/50 mx-auto mb-3 md:mb-4" />
          <p className="text-muted-foreground text-xs max-w-sm mx-auto font-gotham tracking-wide">
            Come say hello.
          </p>
        </div>
      </section>

      <main className="py-12 md:py-32 relative overflow-hidden">
        <MandalaBackground position="bottom-right" opacity={0.08} scale={0.7} rotate={20} />
        <MandalaBackground position="top-left" opacity={0.06} scale={0.5} rotate={-15} />

        <div className="container mx-auto px-4 md:px-6 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Contact Info */}
            <div ref={infoRef} className={`transition-all duration-[1.2s] ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="font-kugile text-xl md:text-2xl text-primary mb-3">
                Get in touch
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-8">
                An event, a table, or a question about the menu. Write to us and we will come back to you.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  // Google Maps share link is PENDING — the address renders as
                  // plain text (href undefined) rather than a dead link.
                  { icon: MapPin, title: 'Location', content: '8 Erb Street West, Waterloo, ON N2L 1S7', href: undefined, external: false },
                  { icon: Mail, title: 'Email', content: 'hello@madrassocial.ca', href: 'mailto:hello@madrassocial.ca', external: false },
                  // Phone is PENDING — the row is omitted entirely until the number lands.
                ].map((item) => {
                  const Comp = item.href ? 'a' : 'div';
                  return (
                  <Comp
                    key={item.title}
                    {...(item.href
                      ? {
                          href: item.href,
                          target: item.external ? '_blank' : undefined,
                          rel: item.external ? 'noopener noreferrer' : undefined,
                        }
                      : {})}
                    className="group flex items-start gap-3 py-3 border-b border-border/30 hover:border-accent/30 transition-all duration-300"
                  >
                    <item.icon className="w-4 h-4 text-accent/70 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-0.5 font-gotham">{item.title}</p>
                      <p className="text-xs text-foreground group-hover:text-primary transition-colors">{item.content}</p>
                    </div>
                  </Comp>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <a href="https://instagram.com/madrassocial" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-all">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a href="https://facebook.com/profile.php?id=61592799734722" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-all">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Form */}
            <div ref={formRef} className={`transition-all duration-[1.2s] delay-200 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-2 mb-8">
                <Send className="w-4 h-4 text-accent/70" />
                <h2 className="font-kugile text-lg text-primary">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-[10px]">Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="form-input text-sm py-2.5" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">Email *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="form-input text-sm py-2.5" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-[10px]">Phone</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="form-input text-sm py-2.5" placeholder="(Optional)" />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">Subject</label>
                    <select value={formData.subject} onChange={e => setFormData(p => ({...p, subject: e.target.value}))} className="form-input text-sm py-2.5">
                      <option value="">Select...</option>
                      <option>General Inquiry</option>
                      <option>Catering Request</option>
                      <option>Reservation</option>
                      <option>Feedback</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label text-[10px]">Message *</label>
                  <textarea value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} rows={4} className="form-input text-sm resize-none" placeholder="Tell us what's on your mind..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-cta w-full py-3">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
      <FloatingOrderCTA />
    </div>
  );
};

export default Contact;
