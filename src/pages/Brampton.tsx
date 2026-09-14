import Header from '@/components/Header';
import HomeFooter from '@/components/homepage/HomeFooter';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Brampton = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <section className="relative min-h-[35vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative z-10 text-center px-5 py-12 md:py-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 font-gotham font-medium">Brampton, Ontario</p>
          <h1 className="font-kugile text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            Authentic South Indian Restaurant in Brampton
          </h1>
          <div className="w-10 h-px bg-accent/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-gotham leading-relaxed">
            100% pure vegetarian. Every dish made with pure desi ghee. Located at Mayfield Plaza, north Brampton.
          </p>
        </div>
      </section>

      <main className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-16">

          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-kugile text-2xl md:text-3xl text-primary mb-6">Brampton's Best South Indian Food</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-gotham">
              Madras Social is Brampton's home for authentic South Indian cuisine — 100% pure vegetarian, every single dish made with pure desi ghee. We are located at Mayfield Plaza on Mayfield Road in north Brampton, serving the communities of Brampton, Vaughan, Caledon, Bolton and the surrounding GTA.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-gotham">
              From heritage dosas and fluffy idlis to Bangalore Benne dosas, filter coffee and modern South Indian desserts — everything on our menu comes from a specific tradition, a specific region, a specific memory. Tamil Nadu's tiffin culture. Karnataka's Benne dosa lanes. Kerala's coconut-softened curries. Andhra's heat. All of it, right here in Brampton.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-gotham">
              We are easy to reach from Heart Lake, Trinity Common Mall, Brampton North and the surrounding neighbourhoods. Free parking available at Mayfield Plaza.
            </p>
          </section>

          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-kugile text-2xl text-primary mb-6">Why Madras Social in Brampton</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: '100% Pure Vegetarian', desc: 'No meat, fish or eggs — ever. Every dish is completely pure vegetarian.' },
                { title: 'Pure Desi Ghee', desc: 'Every dosa, idli and dish is cooked with pure desi ghee. No shortcuts.' },
                { title: 'Heritage Recipes', desc: 'Authentic recipes from Tamil Nadu, Kerala, Andhra Pradesh, Karnataka and Telangana.' },
                { title: 'Fresh Every Day', desc: 'Dosa batter fermented fresh daily. Chutneys ground every morning. Sambar slow-cooked from scratch.' },
                { title: 'Catering Available', desc: 'Weddings, receptions, birthdays, corporate events across Brampton and the GTA.' },
                { title: 'Mayfield Plaza', desc: 'Easy access from north Brampton. Free parking. Close to Heart Lake and Trinity Common.' },
              ].map((item) => (
                <div key={item.title} className="p-4 border border-border/40 rounded-sm">
                  <p className="font-gotham font-semibold text-xs text-primary uppercase tracking-wider mb-2">{item.title}</p>
                  <p className="font-gotham text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-kugile text-2xl text-primary mb-6">What to Order in Brampton</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-gotham">
              Our menu spans twelve dosa varieties, idlis, vadas, uthappam, Bangalore Benne dosas, thali, biryani, Malabar parotta, South Indian mains, desserts and signature drinks. Some favourites with our Brampton guests:
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                'Ghee Roast Masala Dosa', 'Benne Classic', 'Social Thatte Idli',
                'Filter Kapi Tiramisu', 'Madras Filter Kapi', 'Patta Biryani',
                'Vada Curry & Kal Dosa', 'Medhu Vada Poutine', 'Bisi Bele Bath Risotto',
              ].map((dish) => (
                <div key={dish} className="py-2 px-3 border border-border/30 rounded-sm text-center">
                  <p className="font-gotham text-xs text-foreground">{dish}</p>
                </div>
              ))}
            </div>
            <Link to="/menu" className="inline-flex items-center font-gotham font-medium text-[11px] uppercase tracking-[0.25em] transition-all duration-200 text-accent hover:text-primary">
              View Full Menu →
            </Link>
          </section>

          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-kugile text-2xl text-primary mb-6">Visit Us in Brampton</h2>
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                {[
                  { icon: MapPin, title: 'Address', content: '8 Erb Street West\nWaterloo, ON N2L 1S7\nMayfield Plaza, North Brampton' },
                  { icon: Phone, title: 'Phone', content: '(905) 913-5900' },
                  { icon: Mail, title: 'Email', content: 'hello@madrassocial.ca' },
                  { icon: Clock, title: 'Hours', content: 'Please call or check Google Maps\nfor current hours' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-accent/70 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-0.5 font-gotham">{item.title}</p>
                      <p className="text-xs text-foreground font-gotham whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-gotham">Nearby Landmarks</p>
                {[
                  'Mayfield Road & McVean Drive',
                  'Heart Lake Conservation Area',
                  'Trinity Common Mall',
                  'Brampton North',
                  'Castlemore',
                  'Vales of Castlemore',
                ].map((landmark) => (
                  <p key={landmark} className="text-xs text-muted-foreground font-gotham">{landmark}</p>
                ))}
              </div>
            </div>
            <div className="w-full rounded-sm overflow-hidden border border-border/30" style={{ height: '360px' }}>
              <iframe
                title="Madras Social location on Google Maps — 6261 Mayfield Rd Unit 145 Brampton ON"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2878.4!2d-79.7569055!3d43.7895056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b19c4613ff137%3A0x6a096f1e87ed3e5d!2sMadras%20Social%20%7C%20Brampton!5e0!3m2!1sen!2sca!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-kugile text-2xl text-primary mb-6">Frequently Asked Questions — Brampton</h2>
            <div className="space-y-4">
              {[
                { q: 'Where exactly is Madras Social in Brampton?', a: 'We are located at 8 Erb Street West, inside Mayfield Plaza in north Brampton. Free parking is available at the plaza.' },
                { q: 'Is Madras Social 100% vegetarian?', a: 'Yes. Madras Social is a 100% pure vegetarian restaurant. We do not serve any meat, fish or eggs. Every dish on our menu is completely pure vegetarian.' },
                { q: 'Do you cook with desi ghee?', a: 'Yes. All our dishes are made with pure desi ghee, staying true to authentic South Indian culinary tradition.' },
                { q: 'Does Madras Social offer catering in Brampton?', a: 'Yes. We cater weddings, receptions, birthdays, baby showers, kitty parties and corporate events across Brampton and the GTA. Contact hello@madrassocial.ca or call (905) 913-5900.' },
                { q: 'Is there parking at Madras Social Brampton?', a: 'Yes. Free parking is available at Mayfield Plaza where we are located.' },
                { q: 'How far is Madras Social from Heart Lake?', a: 'Madras Social is approximately 10 minutes from Heart Lake Conservation Area on Mayfield Road in north Brampton.' },
              ].map((item) => (
                <div key={item.q} className="border-b border-border/30 pb-4">
                  <p className="font-gotham font-semibold text-xs text-primary mb-2">{item.q}</p>
                  <p className="font-gotham text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-3xl mx-auto text-center">
            <h2 className="font-kugile text-2xl text-primary mb-4">Come Visit Social in Brampton</h2>
            <p className="text-sm text-muted-foreground font-gotham mb-8">8 Erb Street West, Brampton ON · (905) 913-5900</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/menu" className="btn-cta">View Our Menu</Link>
              <Link to="/contact" className="inline-flex items-center font-gotham font-medium text-[11px] uppercase tracking-[0.25em] transition-all duration-200 h-[44px] px-7 border border-accent/50 text-primary hover:border-accent rounded-sm">Contact Us</Link>
            </div>
          </section>

        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Brampton;
