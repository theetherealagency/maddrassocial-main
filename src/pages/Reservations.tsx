import { useState } from 'react';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import { useToast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import reservationsBg from '@/assets/reservations-bg-desktop.png';
import reservationsBgMobile from '@/assets/reservations-bg-mobile-v2.webp';
import { trackFormSuccess } from '@/lib/analytics';



const RESERVATION_BOOKING_URL =
  'https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime';

const Reservations = () => {
  const { toast } = useToast();
  const { ref: formRef, isInView: formInView } = useInView({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [numGuests, setNumGuests] = useState(2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', date: '' });

  const update = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid phone required';
    if (!formData.date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        form_type: 'reservation',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email, phone: formData.phone,
        subject: `Reservation — ${formData.date} (party of ${numGuests})`,
        message: `Date: ${formData.date}\nGuests: ${numGuests}`,
      });
      if (error) throw error;
      trackFormSuccess('reservation');
      setIsSubmitted(true);
      toast({ title: 'Reservation request received', description: 'Redirecting you to confirm your booking…' });
      setTimeout(() => { window.location.href = RESERVATION_BOOKING_URL; }, 1200);
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
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
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 font-gotham font-medium">Reservation Received</p>
            <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-3">A seat at Mami's table awaits</h2>
            <h1 className="sr-only">Reserve a Table at Madras Mami — Authentic South Indian Restaurant in Brampton</h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">Taking you to confirm your booking now.</p>
            <a href={RESERVATION_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-cta">Continue to Booking</a>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '5px 8px',
    background: 'rgba(255,255,255,0.65)',
    border: 'none', borderBottom: '1.5px solid #b8902a',
    fontFamily: 'Jost, sans-serif',
    fontSize: 'clamp(8px,0.75vw,11px)',
    color: '#0b1e14', outline: 'none',
    boxSizing: 'border-box' as const, borderRadius: 0,
  };

  return (
    <div style={{ backgroundColor: '#efe9db', overflowX: 'hidden' }}>
      <Header />

      {/* ══ DESKTOP ══ */}
      <div className="hidden md:block" style={{ position: 'relative', width: '100%', paddingTop: '64px' }}>
        <img src={reservationsBg} alt="" style={{ width: '100%', display: 'block' }} />

        <div ref={formRef} style={{
          position: 'absolute',
          top: 'calc(64px + 11% * 1.9385)',
          left: '26%', width: '58%',
          height: 'calc(24% * 1.9385)',
          padding: '1.5vw 2vw',
          zIndex: 10,
          opacity: 1,
          transform: 'translateY(0)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          overflow: 'auto',
        }}>

          <iframe src="https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime" style={{ width: "100%", height: "500px", border: "none" }} title="Reserve a Table" />
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="md:hidden" style={{ position: 'relative', width: '100%', paddingTop: '64px' }}>
        <img
          src={reservationsBgMobile}
          alt=""
          width={1440}
          height={6340}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {/* The Toast widget is taller than the panel it sits in, so the date and
            time controls start below the fold and the guest has to scroll inside
            it. Until the panel is made tall enough to show the whole form, this
            tells them where to look. It sits in the clear strip to the right of
            Mami's hanging fingers (which occupy 36%–42% of the width down to
            103vw), so it costs the widget no height. */}
        <div style={{
          position: 'absolute',
          top: 'calc(64px + 93.5vw)',
          left: '44%', width: '42%',
          zIndex: 11,
          textAlign: 'center',
          fontFamily: 'Jost, sans-serif',
          fontSize: 'clamp(10px, 3vw, 13px)',
          lineHeight: 1.25,
          color: '#4a3728',
        }}>
          Pick your date &amp; time
          <br />
          Swipe inside the box
          <span aria-hidden="true" style={{ color: '#b8902a', fontWeight: 600 }}> ↓</span>
        </div>

        {/* The booking widget sits inside the blank cream panel painted into the
            artwork above. These offsets are measured off that panel: it starts
            90.6vw down and ends 176.8vw down, spanning 18.7%–88.5% of the width.
            The top is inset past Mami's arm, which overlaps the panel's top-left
            corner. Re-measure these if the artwork is ever replaced. */}
        <div style={{
          position: 'absolute',
          top: 'calc(64px + 102vw)',
          left: '21.5%', width: '64%',
          height: '70vw',
          zIndex: 10,
        }}>
          <iframe src="https://tables.toasttab.com/restaurants/c2d848f2-293b-430d-af30-e9d996b1ed2b/findTime" style={{ width: '100%', height: '100%', border: 'none' }} title="Reserve a Table" />
        </div>
      </div>



      <HomeFooter />
    </div>
  );
};

export default Reservations;
