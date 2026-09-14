import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import FloatingOrderCTA from '@/components/FloatingOrderCTA';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { trackFormSuccess } from '@/lib/analytics';

interface JobPosition {
  id: string;
  title: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const jobPositions: JobPosition[] = [
  {
    id: 'head-chef', title: 'Head Chef', type: 'Full-time',
    description: 'Lead our kitchen team and bring Mami\'s authentic South Indian flavors to life every single day.',
    requirements: ['5+ years in South Indian cuisine', 'Strong leadership skills', 'Food safety certification'],
    responsibilities: ['Oversee all kitchen operations', 'Develop and refine menu items', 'Train and mentor kitchen staff'],
  },
  {
    id: 'line-cook', title: 'Line Cook', type: 'Full-time / Part-time',
    description: 'Join our kitchen brigade — where every dish is made with the same care as Mami\'s home kitchen.',
    requirements: ['1+ years kitchen experience', 'Familiarity with South Indian cuisine preferred', 'Team player'],
    responsibilities: ['Prepare ingredients and dishes', 'Maintain station cleanliness', 'Follow food safety protocols'],
  },
  {
    id: 'server', title: 'Server', type: 'Full-time / Part-time',
    description: 'Be the warmth that greets every guest — like welcoming family into our home.',
    requirements: ['Previous restaurant experience preferred', 'Excellent communication', 'Smart Serve certification'],
    responsibilities: ['Welcome and seat guests', 'Present menu and take orders', 'Ensure guest satisfaction'],
  },
  {
    id: 'manager', title: 'Restaurant Manager', type: 'Full-time',
    description: 'Lead our front-of-house team and ensure every guest leaves feeling like they just visited home.',
    requirements: ['3+ years management experience', 'POS system proficiency', 'Strong leadership'],
    responsibilities: ['Oversee daily operations', 'Hire and train staff', 'Handle customer feedback'],
  },
];

const JobCard = ({ job, onApply }: { job: JobPosition; onApply: (job: JobPosition) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border-b border-border/50 py-5">
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-kugile text-base text-primary mb-0.5">{job.title}</h3>
            <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-gotham">{job.type}</span>
          </div>
          <button className="text-muted-foreground p-1 hover:text-primary transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{job.description}</p>
      </div>
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-border/30 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-accent mb-2 font-gotham">Requirements</h4>
              <ul className="space-y-1.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-accent mb-2 font-gotham">Responsibilities</h4>
              <ul className="space-y-1.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onApply(job); }} className="btn-cta">
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

const ApplicationModal = ({ job, onClose, onSubmit }: { job: JobPosition; onClose: () => void; onSubmit: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', experience: '',
    availability: [] as string[], coverLetter: '', whyWork: '',
  });
  const availabilityOptions = ['Full-time', 'Part-time', 'Weekends', 'Evenings'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        form_type: 'job_application', name: formData.fullName, email: formData.email,
        phone: formData.phone, job_title: job.title, experience: formData.experience || null,
        availability: formData.availability.join(', ') || null,
        cover_letter: formData.coverLetter || null, why_work_here: formData.whyWork || null,
      });
      if (error) throw error;
      trackFormSuccess('job_application');
      onSubmit();
    } catch (error) {
      onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvailabilityChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-5 flex items-center justify-between">
          <div>
            <h3 className="font-kugile text-lg text-primary">Apply for {job.title}</h3>
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-0.5">{job.type}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-[10px]">Full Name *</label>
              <input type="text" value={formData.fullName} required
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="form-input text-sm py-2.5" />
            </div>
            <div>
              <label className="form-label text-[10px]">Email *</label>
              <input type="email" value={formData.email} required
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input text-sm py-2.5" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-[10px]">Phone *</label>
              <input type="tel" value={formData.phone} required
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input text-sm py-2.5" />
            </div>
            <div>
              <label className="form-label text-[10px]">Years of Experience</label>
              <input type="number" min="0" value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="form-input text-sm py-2.5" />
            </div>
          </div>
          <div>
            <label className="form-label text-[10px]">Availability</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {availabilityOptions.map(option => (
                <label key={option}
                  className={`px-3 py-1.5 rounded-sm border cursor-pointer transition-all duration-300 text-[10px] tracking-wide ${
                    formData.availability.includes(option)
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-transparent border-border text-muted-foreground hover:border-accent/40'
                  }`}>
                  <input type="checkbox" checked={formData.availability.includes(option)}
                    onChange={() => handleAvailabilityChange(option)} className="sr-only" />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label text-[10px]">Cover Letter</label>
            <textarea value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
              rows={3} className="form-input text-sm resize-none" placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="form-label text-[10px]">Why Madras Mami?</label>
            <textarea value={formData.whyWork}
              onChange={(e) => setFormData(prev => ({ ...prev, whyWork: e.target.value }))}
              rows={3} className="form-input text-sm resize-none" placeholder="What draws you to our family..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-cta w-full py-3">
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Careers = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  const handleApplicationSubmit = () => {
    setSelectedJob(null);
    toast({ title: "Application Submitted!", description: "Thank you for your interest. We'll be in touch soon." });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative z-10 text-center px-6 py-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-gotham font-medium">Careers</p>
          <h1 className="font-kugile text-3xl sm:text-4xl md:text-5xl text-primary mb-4">Join the Family</h1>
          <div className="w-10 h-px bg-accent/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-xs max-w-sm mx-auto font-gotham tracking-wide">
            We're not just hiring staff — we're welcoming family. People who understand that food is love.
          </p>
        </div>
      </section>

      <main className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div ref={ref} className={`max-w-2xl mx-auto transition-all duration-[1.2s] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-gotham font-medium">Open Positions</p>
              <h2 className="font-kugile text-xl md:text-2xl text-primary">Current Opportunities</h2>
              <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
                Like Mami always said — a kitchen is only as good as the people in it.
              </p>
            </div>

            {jobPositions.map(job => (
              <JobCard key={job.id} job={job} onApply={setSelectedJob} />
            ))}

            <p className="text-[10px] text-muted-foreground text-center mt-12 tracking-wide">
              Madras Mami is an equal opportunity employer.
            </p>
          </div>
        </div>
      </main>

      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}

      <HomeFooter />
      <FloatingOrderCTA />
    </div>
  );
};

export default Careers;
