import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackFormSuccess } from '@/lib/analytics';

const SignupForm = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        form_type: 'newsletter_signup', name: formData.name, email: formData.email, phone: formData.phone,
      });
      if (error) throw error;
      trackFormSuccess('newsletter_signup');
      setIsSubmitted(true);
      toast({ title: "Welcome to the family!", description: "We'll keep you posted on Mami's latest creations." });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section ref={ref} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-6 text-center">
          <div className={`max-w-md mx-auto transition-all duration-[1.2s] ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="font-kugile text-2xl text-primary mb-3">You're part of the family now</h3>
            <p className="text-sm text-muted-foreground">Like a warm cup of filter kapi, good things are coming your way.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-8 md:py-12 relative">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className={`text-center mb-10 transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-gotham font-medium">Stay Close</p>
          <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-4">
            A seat at Mami's table is always reserved for you
          </h2>
          <div className="w-8 h-px bg-accent/50 mx-auto mb-4" />
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Be the first to know about new dishes, special events, and the stories behind our recipes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`max-w-sm mx-auto transition-all duration-[1.2s] delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="space-y-3">
            <input type="text" placeholder="Your Name" value={formData.name}
              onChange={e => setFormData(p => ({...p, name: e.target.value}))}
              className="form-input text-sm py-3" required />
            <input type="email" placeholder="Email Address" value={formData.email}
              onChange={e => setFormData(p => ({...p, email: e.target.value}))}
              className="form-input text-sm py-3" required />
            <input type="tel" placeholder="Phone" value={formData.phone}
              onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
              className="form-input text-sm py-3" required />
            <button type="submit" disabled={isSubmitting} className="btn-cta w-full py-3 text-xs tracking-wider">
              {isSubmitting ? 'Joining...' : 'Join the Family'}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4 tracking-wide">No spam. Just love letters from Mami's kitchen.</p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
