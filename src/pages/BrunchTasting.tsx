import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";
import { trackFormSuccess } from '@/lib/analytics';

/* Brunch At Mami's Table — campaign landing page.
   One goal: form signups. Styling is scoped to `bt-` classes, following the
   same pattern as GiftCards.tsx, and reuses the site's Kugile/Gotham tokens. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Google Apps Script web app that appends to the Brunch lead sheet (platform =
   "website") and emails the guest. See apps-script/brunch-tasting/Code.gs.
   text/plain keeps it a "simple" request so there is no CORS preflight, which
   Apps Script cannot answer. */
const SHEET_ENDPOINT = import.meta.env.VITE_BRUNCH_SHEET_ENDPOINT as string | undefined;
const SHEET_TOKEN = "mami-brunch-2026";

async function postToSheet(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  if (!SHEET_ENDPOINT) throw new Error("sheet endpoint not configured");
  const res = await fetch(SHEET_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...lead, platform: "website", token: SHEET_TOKEN }),
  });
  if (!res.ok) throw new Error("sheet endpoint returned " + res.status);
  /* Apps Script answers 200 even when it fails, so the body is the real signal. */
  const text = await res.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error("sheet endpoint returned non-JSON: " + text.slice(0, 120));
  }
  if (!body.ok) throw new Error("sheet endpoint rejected: " + (body.error || "unknown"));
}

type Fields = "firstName" | "lastName" | "email" | "phone";

const BrunchTasting = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    document.title = "Brunch Tasting | Brunch At Mami's Table — Madras Mami";
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute("content") ?? null;
    meta?.setAttribute(
      "content",
      "Be among the first to try Madras Mami's new brunch menu before anyone else. A free tasting in our Brampton dining room, in exchange for your honest feedback."
    );
    return () => {
      if (previous !== null) meta?.setAttribute("content", previous);
    };
  }, []);

  /* Hold on the poster frame when the visitor prefers less motion */
  useEffect(() => {
    const v = videoRef.current;
    if (v && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
    }
  }, []);

  /* Sticky bar: shows once the hero is behind us, hides while the form is on screen */
  useEffect(() => {
    let queued = false;
    const sync = () => {
      queued = false;
      const hero = heroRef.current;
      const box = boxRef.current;
      if (!hero || !box) return;
      const vh = window.innerHeight;
      const pastHero = hero.getBoundingClientRect().bottom < 40;
      const rect = box.getBoundingClientRect();
      const boxOnScreen = rect.top < vh - 80 && rect.bottom > 80;
      setStickyVisible(pastHero && !boxOnScreen && !isSubmitted);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    sync();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isSubmitted]);

  const rules: Record<Fields, (v: string) => string> = {
    firstName: (v) => (v.trim().length >= 2 ? "" : "Please enter your first name."),
    lastName: (v) => (v.trim().length >= 2 ? "" : "Please enter your last name."),
    email: (v) => (EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address."),
    phone: (v) => {
      const d = v.replace(/\D/g, "");
      return d.length >= 10 && d.length <= 11 ? "" : "Please enter a 10-digit phone number.";
    },
  };

  const update = (key: Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (key === "phone") {
      const d = value.replace(/\D/g, "").slice(0, 10);
      if (d.length > 6) value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      else if (d.length > 3) value = `(${d.slice(0, 3)}) ${d.slice(3)}`;
      else value = d;
    }
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: rules[key](value) }));
  };

  const blur = (key: Fields) => () => setErrors((p) => ({ ...p, [key]: rules[key](form[key]) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    (Object.keys(rules) as Fields[]).forEach((k) => {
      const msg = rules[k](form[k]);
      if (msg) next[k] = msg;
    });
    if (!consent) next.consent = "Please tick the box so we can contact you.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSubmitting(true);
    const lead = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    /* Written to both the sheet (which also sends the guest email) and the
       site's leads table. A lead is only lost if both fail, so that is the
       only case that blocks the success state. */
    const [sheet, db] = await Promise.allSettled([
      postToSheet(lead),
      supabase
        .from("leads")
        .insert({
          form_type: "brunch_tasting",
          name: `${lead.firstName} ${lead.lastName}`,
          email: lead.email,
          phone: lead.phone,
          subject: "Brunch At Mami's Table — tasting signup",
          message: "Requested a seat at the pre-launch brunch tasting. Platform: website",
        })
        .then(({ error }) => {
          if (error) throw error;
        }),
    ]);

    if (sheet.status === "rejected") console.error("Sheet write failed:", sheet.reason);
    if (db.status === "rejected") console.error("Supabase write failed:", db.reason);

    setIsSubmitting(false);

    if (sheet.status === "rejected" && db.status === "rejected") {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    trackFormSuccess("brunch_tasting");
    setIsSubmitted(true);
    setStickyVisible(false);
    boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const scrollToForm = () => {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bt-page">
      <style>{`
        .bt-page{
          --bt-green:#1A2E1A; --bt-gc-green:#21331A; --bt-gc-cream:#E8DCBF; --bt-gc-gold:#D7BD68;
          --bt-cream:#F2EDE4; --bt-offwhite:#F2EBD6; --bt-brown:#3D2210;
          --bt-mud:#392113; --bt-gold:#DBB640; --bt-gold-soft:#D0B771; --bt-gold-rule:#C8922A;
          --bt-jali:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23DBB640' stroke-width='1'%3E%3Cpath d='M32 0 64 32 32 64 0 32Z'/%3E%3Cpath d='M32 16 48 32 32 48 16 32Z'/%3E%3Cpath d='M0 0h64v64H0z'/%3E%3C/g%3E%3C/svg%3E");
          --bt-scallop-cream:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'%3E%3Cpath d='M0,14 Q14,0 28,14 Z' fill='%23F2EDE4'/%3E%3C/svg%3E");
          --bt-scallop-offwhite:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'%3E%3Cpath d='M0,14 Q14,0 28,14 Z' fill='%23F2EBD6'/%3E%3C/svg%3E");
          --bt-scallop-brown:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'%3E%3Cpath d='M0,14 Q14,0 28,14 Z' fill='%233D2210'/%3E%3C/svg%3E");
          --bt-ornament:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='20' viewBox='0 0 60 20' fill='none'%3E%3Cline x1='0' y1='10' x2='18' y2='10' stroke='%23D0B771' stroke-width='1'/%3E%3Ccircle cx='5' cy='10' r='1.5' fill='%23D0B771'/%3E%3Ccircle cx='12' cy='10' r='1' fill='%23D0B771'/%3E%3Cpath d='M30 2 L38 10 L30 18 L22 10 Z' fill='%23D0B771'/%3E%3Cpath d='M30 5 L35 10 L30 15 L25 10 Z' fill='%23EDE5D6'/%3E%3Ccircle cx='30' cy='10' r='2' fill='%23D0B771'/%3E%3Cline x1='42' y1='10' x2='60' y2='10' stroke='%23D0B771' stroke-width='1'/%3E%3Ccircle cx='55' cy='10' r='1.5' fill='%23D0B771'/%3E%3Ccircle cx='48' cy='10' r='1' fill='%23D0B771'/%3E%3C/svg%3E");
          background:var(--bt-cream); color:var(--bt-mud);
          font-family:var(--font-body); font-size:15px; line-height:1.75; overflow-x:hidden;
        }
        .bt-shell{width:100%;max-width:1240px;margin-inline:auto;padding-inline:20px;}

        .bt-eyebrow{font-weight:500;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--bt-gold);margin-bottom:18px;}
        .bt-eyebrow--dark{color:var(--bt-gold-rule);}
        .bt-eyebrow .bt-dot{opacity:.55;margin-inline:2px;}

        .bt-rule{display:block;position:relative;width:74px;height:1px;margin:22px 0 24px;
          background:linear-gradient(90deg,var(--bt-gold),rgba(219,182,64,0));}
        .bt-rule::after{content:'';position:absolute;left:0;top:-2px;width:5px;height:5px;background:var(--bt-gold);transform:rotate(45deg);}
        .bt-ornament{display:block;width:60px;height:20px;margin:18px auto 22px;background:var(--bt-ornament) center/contain no-repeat;}

        .bt-title{font-family:var(--font-display);font-size:clamp(1.55rem,4.6vw,2.35rem);line-height:1.28;color:var(--bt-mud);letter-spacing:.01em;}
        .bt-title--gold{color:var(--bt-gold-soft);}
        .bt-lede{font-size:14.5px;line-height:1.9;color:rgba(242,235,214,.84);max-width:54ch;}
        .bt-lede--muted{color:rgba(242,235,214,.6);margin-top:16px;}

        .bt-btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:15px 30px;
          font-family:var(--font-body);font-weight:500;font-size:12px;letter-spacing:.18em;text-transform:uppercase;
          border:0;border-radius:3px;cursor:pointer;background:var(--bt-gold);color:var(--bt-mud);
          box-shadow:0 6px 20px rgba(219,182,64,.22);transition:background-color .25s ease,transform .25s ease;}
        .bt-btn:hover{background:#C29E2C;transform:translateY(-1px);}
        .bt-btn:disabled{opacity:.62;cursor:progress;transform:none;}
        .bt-btn--block{width:100%;}

        .bt-jali{position:absolute;inset:0;background-image:var(--bt-jali);background-size:58px 58px;opacity:.05;pointer-events:none;}

        /* Hero */
        .bt-hero{position:relative;overflow:hidden;background:var(--bt-green);padding:calc(78px + 40px) 0 58px;}
        .bt-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:14px;z-index:3;
          background:var(--bt-scallop-cream) repeat-x;background-size:28px 14px;transform:scaleY(-1);}
        .bt-hero-grid{position:relative;z-index:2;display:grid;gap:36px;align-items:center;}
        .bt-hero-title{font-family:var(--font-display);font-size:clamp(2.5rem,12vw,3.5rem);line-height:1.12;color:var(--bt-offwhite);letter-spacing:.012em;margin:0;}
        .bt-hero-title span{color:var(--bt-gold-soft);}
        .bt-hero-sub{font-size:16px;line-height:1.68;color:var(--bt-offwhite);max-width:30ch;}
        .bt-hero-body{margin-top:16px;font-size:14px;line-height:1.9;color:rgba(242,235,214,.68);max-width:46ch;}
        .bt-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:34px;padding-top:28px;border-top:1px solid rgba(219,182,64,.2);}
        .bt-chips li{font-size:9.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
          color:rgba(242,235,214,.9);padding:7px 12px;border:1px solid rgba(219,182,64,.35);border-radius:2px;}
        .bt-hero-media{margin:0;border-radius:14px;overflow:hidden;border:1px solid rgba(219,182,64,.38);
          box-shadow:0 20px 48px rgba(0,0,0,.3);background:rgba(0,0,0,.2);}
        .bt-hero-media video{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;}

        /* Sections */
        .bt-section{position:relative;overflow:hidden;padding:62px 0;}
        .bt-section--cream{background:var(--bt-cream);}
        /* Same green as the form box. Why Join and the brunch preview form one
           continuous dark run, scalloped only where it meets the cream above
           and the brown footer below. */
        .bt-section--green{background:var(--bt-gc-green);padding-block:76px;}
        .bt-dark-start::before,.bt-dark-end::after{content:'';position:absolute;left:0;right:0;height:14px;
          background-repeat:repeat-x;background-size:28px 14px;z-index:3;}
        .bt-dark-start::before{top:0;background-image:var(--bt-scallop-cream);}
        .bt-dark-end::after{bottom:0;background-image:var(--bt-scallop-brown);transform:scaleY(-1);}
        .bt-head{text-align:center;margin-bottom:34px;}
        .bt-head .bt-title{margin-inline:auto;max-width:22ch;}
        .bt-head--light .bt-title{color:var(--bt-gc-cream);}

        /* Form box — same layout as the gift-card buy box */
        .bt-form-section{scroll-margin-top:90px;}
        .bt-form-shell{display:grid;justify-items:center;}
        .bt-box{position:relative;overflow:hidden;width:100%;max-width:700px;background:var(--bt-gc-green);
          border-radius:22px;padding:clamp(24px,5vw,52px);box-shadow:0 22px 52px rgba(20,40,20,.3);}
        .bt-pinstripe{position:absolute;inset:0;pointer-events:none;
          background-image:repeating-linear-gradient(118deg,rgba(255,255,255,.045) 0 2px,transparent 2px 26px);}
        .bt-box-head{position:relative;text-align:center;max-width:560px;margin:0 auto clamp(22px,4vw,34px);}
        .bt-box-head .bt-eyebrow{margin-bottom:14px;color:var(--bt-gc-gold);}
        .bt-box-title{font-family:var(--font-display);font-size:clamp(1.6rem,6vw,2.5rem);line-height:1.08;color:var(--bt-gc-cream);margin:0;}
        .bt-box-intro{margin-top:12px;font-size:clamp(14px,4vw,16px);line-height:1.6;color:rgba(232,220,191,.82);}
        .bt-panel{position:relative;background:var(--bt-gc-cream);border-radius:18px;
          padding:clamp(18px,3.4vw,26px);box-shadow:inset 0 0 0 1px rgba(215,189,104,.4);}

        .bt-form{display:grid;gap:15px;}
        .bt-row{display:grid;gap:15px;}
        .bt-field{display:grid;gap:7px;}
        .bt-field label{font-size:10.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(69,46,24,.82);}
        .bt-field input[type=text],.bt-field input[type=email],.bt-field input[type=tel]{
          width:100%;min-height:50px;padding:13px 15px;font-size:15px;color:var(--bt-mud);
          background:rgba(255,255,255,.85);border:1px solid rgba(69,46,24,.2);border-radius:9px;appearance:none;
          transition:border-color .2s ease,box-shadow .2s ease,background-color .2s ease;}
        .bt-field input::placeholder{color:rgba(69,46,24,.35);}
        .bt-field input:focus{outline:none;background:#fff;border-color:var(--bt-gold);box-shadow:0 0 0 3px rgba(219,182,64,.22);}
        .bt-field input[aria-invalid=true]{border-color:#B3452B;background:rgba(179,69,43,.05);}
        .bt-err{font-size:11px;color:#B3452B;}

        .bt-check{display:grid;grid-template-columns:auto 1fr;align-items:start;gap:11px;cursor:pointer;padding:4px 0;}
        .bt-check input{position:absolute;opacity:0;width:1px;height:1px;}
        .bt-check .bt-box-tick{width:20px;height:20px;margin-top:1px;border:1px solid rgba(69,46,24,.3);border-radius:4px;
          background:rgba(255,255,255,.7);display:grid;place-items:center;transition:background-color .18s ease,border-color .18s ease;}
        .bt-check .bt-box-tick::after{content:'';width:9px;height:5px;border-left:2px solid var(--bt-mud);
          border-bottom:2px solid var(--bt-mud);transform:rotate(-45deg) scale(.5);opacity:0;transition:opacity .18s ease,transform .18s ease;}
        .bt-check input:checked + .bt-box-tick{background:var(--bt-gold);border-color:var(--bt-gold);}
        .bt-check input:checked + .bt-box-tick::after{opacity:1;transform:rotate(-45deg) scale(1);}
        .bt-check input:focus-visible + .bt-box-tick{outline:2px solid var(--bt-gold);outline-offset:2px;}
        .bt-field .bt-check-text{font-size:12px;line-height:1.6;font-weight:400;letter-spacing:0;text-transform:none;color:rgba(69,46,24,.8);}
        .bt-micro{font-size:11.5px;line-height:1.7;letter-spacing:.04em;color:rgba(69,46,24,.6);text-align:center;}

        .bt-success{text-align:center;padding:22px 4px 12px;}
        .bt-success-mark{width:52px;height:52px;margin:0 auto 20px;display:grid;place-items:center;border-radius:50%;
          color:var(--bt-mud);background:rgba(219,182,64,.22);border:1px solid rgba(200,146,42,.55);}
        .bt-panel-title{font-family:var(--font-display);font-size:clamp(1.3rem,5.4vw,1.65rem);line-height:1.28;color:var(--bt-mud);margin:0;}
        .bt-panel-intro{margin-top:12px;font-size:12.5px;line-height:1.8;color:rgba(69,46,24,.7);}
        .bt-success-note{font-size:12px;color:rgba(69,46,24,.6);}

        /* Why join */
        .bt-cards{display:grid;gap:16px;}
        .bt-card{background:var(--bt-gc-cream);border-radius:14px;
          padding:30px 24px 26px;box-shadow:inset 0 0 0 1px rgba(215,189,104,.4),0 14px 30px rgba(20,40,20,.22);
          transition:transform .3s ease,box-shadow .3s ease;}
        .bt-card:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1px rgba(215,189,104,.55),0 18px 38px rgba(20,40,20,.28);}
        .bt-card-num{display:block;font-size:10px;font-weight:500;letter-spacing:.3em;color:var(--bt-gold-rule);margin-bottom:14px;}
        .bt-card h3{font-family:var(--font-display);font-size:1.32rem;color:var(--bt-mud);margin:0 0 10px;}
        .bt-card p{font-size:13.5px;line-height:1.85;color:rgba(69,46,24,.78);}

        /* Brunch preview */
        .bt-preview-grid{position:relative;z-index:2;display:grid;gap:36px;align-items:center;}
        .bt-points{display:grid;gap:11px;margin:26px 0 30px;padding-top:22px;border-top:1px solid rgba(219,182,64,.18);}
        .bt-points li{position:relative;padding-left:20px;font-size:13px;letter-spacing:.05em;color:rgba(242,235,214,.82);}
        .bt-points li::before{content:'';position:absolute;left:0;top:9px;width:5px;height:5px;background:var(--bt-gold);transform:rotate(45deg);}
        .bt-preview-media{margin:0;border-radius:14px;overflow:hidden;border:1px solid rgba(215,189,104,.35);box-shadow:0 20px 46px rgba(0,0,0,.28);}
        .bt-preview-media img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;}

        /* Sticky mobile CTA */
        .bt-sticky{position:fixed;inset:auto 0 0 0;z-index:60;display:none;align-items:center;justify-content:space-between;gap:14px;
          padding:11px 16px calc(11px + env(safe-area-inset-bottom,0px));background:rgba(61,34,16,.97);
          -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-top:1px solid rgba(219,182,64,.28);
          transform:translateY(102%);transition:transform .32s cubic-bezier(.4,0,.2,1);}
        .bt-sticky.is-visible{transform:translateY(0);}
        .bt-sticky-copy{display:grid;}
        .bt-sticky-copy strong{font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--bt-offwhite);}
        .bt-sticky-copy span{font-size:10.5px;letter-spacing:.06em;color:rgba(219,182,64,.78);}
        .bt-sticky .bt-btn{min-height:46px;padding:12px 22px;letter-spacing:.14em;white-space:nowrap;}

        @media (max-width:900px){
          .bt-sticky{display:flex;}
          .bt-page{padding-bottom:78px;}
        }
        @media (min-width:480px){ .bt-row--2{grid-template-columns:1fr 1fr;} }
        @media (min-width:700px){
          .bt-shell{padding-inline:32px;}
          .bt-section{padding:84px 0;}
          .bt-cards{grid-template-columns:repeat(3,1fr);gap:20px;}
        }
        @media (min-width:1000px){
          .bt-shell{padding-inline:44px;}
          .bt-section{padding:104px 0;}
          .bt-hero{padding:calc(78px + 46px) 0 88px;}
          .bt-hero-grid{grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:64px;}
          .bt-hero-title{font-size:clamp(3rem,4.4vw,4rem);}
          .bt-hero-sub{font-size:17.5px;}
          .bt-head{margin-bottom:48px;}
          .bt-cards{gap:24px;}
          .bt-card{padding:34px 28px 30px;}
          .bt-preview-grid{grid-template-columns:1.02fr .98fr;gap:64px;}
        }
        @media (prefers-reduced-motion:reduce){
          .bt-card:hover{transform:none;}
          .bt-btn:hover{transform:none;}
        }
      `}</style>

      <Header />

      {/* ============ 1. HERO ============ */}
      <section className="bt-hero" ref={heroRef}>
        <span className="bt-jali" aria-hidden="true" />
        <div className="bt-shell bt-hero-grid">
          <div>
            <p className="bt-eyebrow">
              Limited Seats <span className="bt-dot">&bull;</span> Early Access{" "}
              <span className="bt-dot">&bull;</span> Madras Mami Brunch
            </p>
            <h1 className="bt-hero-title">
              Brunch At
              <br />
              <span>Mami&rsquo;s Table</span>
            </h1>
            <span className="bt-rule" aria-hidden="true" />
            <p className="bt-hero-sub">
              Be among the first to try Madras Mami&rsquo;s new brunch menu before anyone else.
            </p>
            <p className="bt-hero-body">
              We&rsquo;re inviting a small group to experience our new brunch in our dining room
              before launch. It&rsquo;s free, and all we ask is your honest feedback.
            </p>
            <ul className="bt-chips">
              <li>100% Pure Vegetarian</li>
              <li>Pure Desi Ghee</li>
            </ul>
          </div>

          <figure className="bt-hero-media">
            <video
              ref={videoRef}
              poster="/brunch/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-label="Brunch at Madras Mami"
            >
              <source src="/brunch/hero.mp4" type="video/mp4" />
            </video>
          </figure>
        </div>
      </section>

      {/* ============ 2. FORM ============ */}
      <section className="bt-section bt-section--cream bt-form-section" id="signup">
        <div className="bt-shell bt-form-shell">
          <div className="bt-box" ref={boxRef}>
            <span className="bt-pinstripe" aria-hidden="true" />

            {!isSubmitted && (
              <div className="bt-box-head">
                <p className="bt-eyebrow">Request An Invitation</p>
                <h2 className="bt-box-title">Request Your Seat At Mami&rsquo;s Table</h2>
                <p className="bt-box-intro">
                  Fill out the form below for a chance to be among the first guests to try our new
                  brunch menu.
                </p>
              </div>
            )}

            <div className="bt-panel">
              {isSubmitted ? (
                <div className="bt-success">
                  <span className="bt-success-mark" aria-hidden="true">
                    <CheckCircle className="w-6 h-6" />
                  </span>
                  <p className="bt-eyebrow bt-eyebrow--dark">You&rsquo;re On The List</p>
                  <h2 className="bt-panel-title">Thank you for signing up</h2>
                  <p className="bt-panel-intro">
                    We&rsquo;ll be reviewing submissions and reaching out to selected guests soon.
                  </p>
                  <span className="bt-ornament" aria-hidden="true" />
                  <p className="bt-success-note">Keep an eye on your inbox &mdash; and your phone.</p>
                </div>
              ) : (
                <form className="bt-form" onSubmit={handleSubmit} noValidate>
                  <div className="bt-row bt-row--2">
                    <div className="bt-field">
                      <label htmlFor="bt-firstName">First Name</label>
                      <input
                        id="bt-firstName"
                        type="text"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={update("firstName")}
                        onBlur={blur("firstName")}
                        aria-invalid={errors.firstName ? true : undefined}
                      />
                      {errors.firstName && <p className="bt-err">{errors.firstName}</p>}
                    </div>
                    <div className="bt-field">
                      <label htmlFor="bt-lastName">Last Name</label>
                      <input
                        id="bt-lastName"
                        type="text"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={update("lastName")}
                        onBlur={blur("lastName")}
                        aria-invalid={errors.lastName ? true : undefined}
                      />
                      {errors.lastName && <p className="bt-err">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="bt-field">
                    <label htmlFor="bt-email">Email</label>
                    <input
                      id="bt-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      onBlur={blur("email")}
                      aria-invalid={errors.email ? true : undefined}
                    />
                    {errors.email && <p className="bt-err">{errors.email}</p>}
                  </div>

                  <div className="bt-field">
                    <label htmlFor="bt-phone">Phone Number</label>
                    <input
                      id="bt-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(416) 555-0123"
                      value={form.phone}
                      onChange={update("phone")}
                      onBlur={blur("phone")}
                      aria-invalid={errors.phone ? true : undefined}
                    />
                    {errors.phone && <p className="bt-err">{errors.phone}</p>}
                  </div>

                  <div className="bt-field">
                    <label className="bt-check" htmlFor="bt-consent">
                      <input
                        id="bt-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) setErrors((p) => ({ ...p, consent: "" }));
                        }}
                      />
                      <span className="bt-box-tick" aria-hidden="true" />
                      <span className="bt-check-text">
                        I agree to be contacted about Brunch At Mami&rsquo;s Table.
                      </span>
                    </label>
                    {errors.consent && <p className="bt-err">{errors.consent}</p>}
                  </div>

                  <button className="bt-btn bt-btn--block" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Sign Up"}
                  </button>

                  <p className="bt-micro">
                    Takes under a minute. Selected guests will be contacted directly.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. WHY JOIN ============ */}
      <section className="bt-section bt-section--green bt-dark-start">
        <span className="bt-jali" aria-hidden="true" />
        <div className="bt-shell" style={{ position: "relative", zIndex: 2 }}>
          <header className="bt-head bt-head--light">
            <p className="bt-eyebrow bt-eyebrow--dark">The Invitation</p>
            <h2 className="bt-title">Why Join Brunch At Mami&rsquo;s Table</h2>
            <span className="bt-ornament" aria-hidden="true" />
          </header>
          <ul className="bt-cards">
            <li className="bt-card">
              <span className="bt-card-num" aria-hidden="true">01</span>
              <h3>Be First</h3>
              <p>Get early access to Madras Mami&rsquo;s new brunch before the public launch.</p>
            </li>
            <li className="bt-card">
              <span className="bt-card-num" aria-hidden="true">02</span>
              <h3>Enjoy It On Us</h3>
              <p>Selected guests will get to experience the brunch for free in our dining room.</p>
            </li>
            <li className="bt-card">
              <span className="bt-card-num" aria-hidden="true">03</span>
              <h3>Shape The Menu</h3>
              <p>Your honest feedback will help us refine the final brunch experience.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ 4. BRUNCH PREVIEW ============ */}
      <section className="bt-section bt-section--green bt-dark-end">
        <span className="bt-jali" aria-hidden="true" />
        <div className="bt-shell bt-preview-grid">
          <div>
            <p className="bt-eyebrow">A First Taste</p>
            <h2 className="bt-title bt-title--gold">A South Indian Brunch, The Mami Way</h2>
            <span className="bt-rule" aria-hidden="true" />
            <p className="bt-lede">
              Think warm dosas, soft idlis, comforting chutneys, crisp bites, filter coffee, and the
              kind of vegetarian flavours that make you want to slow down and stay a little longer.
            </p>
            <p className="bt-lede bt-lede--muted">
              Brunch At Mami&rsquo;s Table is our first step into a new daytime experience &mdash;
              rooted in South Indian comfort, made with pure desi ghee, and brought to the table with
              Madras Mami warmth.
            </p>
            <ul className="bt-points">
              <li>100% pure vegetarian</li>
              <li>Made with pure desi ghee</li>
              <li>Inspired by South Indian daytime comfort</li>
              <li>Created for slow mornings and shared tables</li>
            </ul>
            <button className="bt-btn" type="button" onClick={scrollToForm}>Sign Up</button>
          </div>

          <figure className="bt-preview-media">
            <img
              src="/brunch/first-taste.jpg"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              alt="Two guests in traditional South Indian dress holding bowls of food at Madras Mami"
            />
          </figure>
        </div>
      </section>

      <HomeFooter />

      {/* Sticky mobile CTA */}
      <div className={`bt-sticky${stickyVisible ? " is-visible" : ""}`} aria-hidden={!stickyVisible}>
        <p className="bt-sticky-copy">
          <strong>Free brunch tasting</strong>
          <span>Limited seats &mdash; invitation only</span>
        </p>
        <button className="bt-btn" type="button" onClick={scrollToForm}>Sign Up</button>
      </div>
    </div>
  );
};

export default BrunchTasting;
