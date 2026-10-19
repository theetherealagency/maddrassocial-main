import { FormEvent, useRef, useState } from 'react';
import HomeNavbar from '@/components/homepage/HomeNavbar';
import HomeFooter from '@/components/homepage/HomeFooter';
import './rsvp.css';

/**
 * The creator RSVP page, moved 2026-10-19 from its own subdomain
 * (rsvp.madrassocial.ca, a static page in rsvp/index.html served by
 * middleware.js) to /rsvp on the main site. That host now 308s here.
 *
 * Copy, layout and styles are the static page's, unchanged: the stylesheet
 * is ported verbatim into ./rsvp.css with every rule scoped to .rsvp-page.
 * The one structural change is the page's own brand rail at the top, which
 * is replaced by the shared HomeNavbar/HomeFooter, same as /careers.
 *
 * Submissions still go to the same Apps Script web app (source in
 * rsvp/Code.gs), which appends a row to the "RSVPs" tab of the
 * "Launch - Influencer" sheet.
 */
const ENDPOINT =
  'https://script.google.com/macros/s/AKfycby6CwcoZp-qVOeXTepbxIGmoNcmkvNbJF7G66QWfGlR7fIqHGAAIMr3SJk6rw_sLwJX/exec';

const TIMEOUT_MS = 20000;

function withTimeout(ms: number) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return { signal: ctl.signal, done: () => clearTimeout(t) };
}

// The script's doGet reports the sheet's row count. Used to check whether a
// row landed when the POST reply itself couldn't be read.
async function readRowCount(): Promise<number | null> {
  const g = withTimeout(8000);
  try {
    const r = await fetch(ENDPOINT, { cache: 'no-store', signal: g.signal });
    const j = await r.json();
    return typeof j.rowCount === 'number' ? j.rowCount : null;
  } catch {
    return null;
  } finally {
    g.done();
  }
}

type Status = 'idle' | 'saving' | 'done' | 'error';

const Rsvp = () => {
  const [status, setStatus] = useState<Status>('idle');
  const inFlight = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const showSuccess = () => {
    setStatus('done');
    requestAnimationFrame(() => doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };
  const showError = () => {
    setStatus('error');
    requestAnimationFrame(() => errRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  // Apps Script answers with Access-Control-Allow-Origin: *, and text/plain is
  // a CORS-safelisted type, so this is a readable request with no preflight.
  // A seat is only confirmed once the script says it wrote the row.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return; // no double-write on a double-click
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    inFlight.current = true;
    setStatus('saving');

    const data: Record<string, unknown> = Object.fromEntries(new FormData(form).entries());
    data.agree = !!data.agree;

    const before = await readRowCount();
    const p = withTimeout(TIMEOUT_MS);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
        signal: p.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const out = JSON.parse(await res.text());
      if (out && out.ok === true) {
        showSuccess();
        return;
      }
      throw new Error(out && out.error ? out.error : 'save failed');
    } catch {
      // The row may have landed even though the reply couldn't be read.
      // Check before crying wolf.
      if (before !== null) {
        const after = await readRowCount();
        if (after !== null && after > before) {
          showSuccess();
          return;
        }
      }
      showError();
    } finally {
      p.done();
      inFlight.current = false;
    }
  };

  const saving = status === 'saving';

  return (
    <div style={{ backgroundColor: '#ECE4D8' }}>
      <HomeNavbar />
      <div className="rsvp-page pt-16">
        <main className="wrap">
          <div className="hero">
            <div className="hero-meta">
              <div className="mark-hero" role="img" aria-label="Madras Social" />
              <p className="eyebrow">By invitation · 19th September 2026</p>
            </div>
            <div className="hero-main">
              <h1>
                Take a <span className="thin">seat.</span>
              </h1>
              <p className="standfirst">
                You’re invited to a Madras cocktail experience unlike anything Waterloo has tasted.
              </p>
              <p className="lede">
                Most of what happens that evening isn’t written on this page. Some of it isn’t written
                anywhere — we would rather you met it at the table.
              </p>
            </div>
          </div>

          <section className="sec">
            <div className="sec-head">
              <p className="kicker-t">The invitation</p>
              <h2>Madras Social</h2>
            </div>
            <div className="sec-body">
              <p>
                There’s a version of South Indian cooking that never leaves the house. On{' '}
                <strong>Saturday 19th</strong>, we’re cooking it for twenty-five guests, before the doors open
                to anyone else.
              </p>
              <p className="lift">You’ve eaten South Indian food before. You haven’t drunk it.</p>
            </div>
          </section>

          <section className="sec">
            <div className="sec-head">
              <p className="kicker-t">Before any of it</p>
              <h2>A box arrives</h2>
            </div>
            <div className="sec-body">
              <p>The night before you sit down, something turns up at your door. Open it slowly.</p>
              <ul className="triad">
                <li>
                  <span className="what">Something to sip</span>
                  <p>A cordial of our own making, and the beginning of a drink you’ll meet properly on the night.</p>
                </li>
                <li>
                  <span className="what">Something to smell</span>
                  <p>Curry leaves, dried in our kitchen. Open the box and the room arrives a day early.</p>
                </li>
                <li>
                  <span className="what">Something to keep you going</span>
                  <p>
                    Muruku and banana chips, straight from the kitchen, for the hour before you leave the house.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <section className="sec">
            <div className="sec-head">
              <p className="kicker-t">The particulars</p>
              <h2>Where and when</h2>
            </div>
            <div className="sec-body">
              <dl className="details">
                <dt>Where</dt>
                <dd>8 Erb St. W, Waterloo ON N2J 2W6</dd>
                <dt>When</dt>
                <dd>
                  Saturday 19th, September 2026<span>Arrival 6:30 PM · about three hours</span>
                </dd>
                <dt>Table</dt>
                <dd>
                  Twenty-five seats<span>One long table, family style</span>
                </dd>
              </dl>
              <div className="callout">
                <span className="what">Dress code</span>
                <p>Fall colours only — amber, rust, burgundy, wine, pastel blue.</p>
              </div>
            </div>
          </section>

          <p className="close">You will talk about this evening. That is the only thing we’re asking for.</p>

          <section className="sec">
            <div className="sec-head">
              <p className="kicker-t">In return</p>
              <h2>What we’d love to see</h2>
            </div>
            <div className="sec-body">
              <ul className="list">
                <li>
                  <span className="n">01</span>
                  <strong>One reel from the night</strong>
                </li>
                <li>
                  <span className="n">02</span>
                  <strong>One unboxing story from your PR box</strong>
                </li>
                <li>
                  <span className="n">03</span>
                  <strong>A few stories through the evening</strong>
                </li>
              </ul>
              <p className="tagline">
                Tag <a href="https://instagram.com/madrassocial">@madrassocial</a> and{' '}
                <a href="https://instagram.com/ethereal_pr">@ethereal_pr</a> so we can reshare.
              </p>
            </div>
          </section>

          <h2>Save your seat</h2>

          <div className="panel">
            <form id="rsvp" noValidate onSubmit={onSubmit} className={status === 'done' ? 'off' : undefined}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="instagram">Instagram handle</label>
                <input type="text" id="instagram" name="instagram" placeholder="@" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" autoComplete="tel" required />
              </div>
              <div className="field field-wide">
                <label htmlFor="zone">Where are you based?</label>
                <select id="zone" name="zone" required defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>Kitchener–Waterloo–Cambridge</option>
                  <option>Brampton</option>
                  <option>Mississauga</option>
                  <option>Somewhere else</option>
                </select>
              </div>
              <div className="field field-wide">
                <label htmlFor="address">
                  Where should the box go?
                  <span className="hint">
                    Street, unit, city and postal code. If you’re outside our delivery run, we’ll have yours
                    waiting at your seat instead.
                  </span>
                </label>
                <textarea id="address" name="address" autoComplete="street-address" required />
              </div>
              <div className="check">
                <input type="checkbox" id="agree" name="agree" required />
                <label htmlFor="agree">
                  This is a fully hosted evening on the house — our way of welcoming you to the Madras Social
                  table in exchange for sharing the experience with your community.
                </label>
              </div>
              <button type="submit" id="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save my seat'}
              </button>
              <p id="formError" ref={errRef} role="alert" aria-live="polite" className={status === 'error' ? 'on' : undefined}>
                {status === 'error' &&
                  "We couldn't save your seat just then — nothing has been recorded. Please try again, or DM @madrassocial and we'll hold it by hand."}
              </p>
            </form>

            <div id="done" ref={doneRef} className={status === 'done' ? 'on' : undefined}>
              <div className="mark" />
              <h2>Your seat is requested</h2>
              <p>Twenty-five seats at one table — we’ll read and confirm every RSVP personally.</p>
            </div>
          </div>

          <div className="foot">
            <p>
              <strong>Twenty-five seats, and this one is yours alone</strong> — we aren’t able to accommodate
              plus-ones.
            </p>
            <p>
              Boxes are hand-delivered the day before, across Kitchener–Waterloo–Cambridge, Brampton and
              Mississauga. Please RSVP by <strong>Friday</strong> so yours makes the run.
            </p>
          </div>

          <p className="handles">
            <a href="https://instagram.com/madrassocial">@madrassocial</a>
          </p>

          <div className="rail bottom">
            <span>Everyone’s</span>
            <span className="slash">//</span>
            <span>Table</span>
          </div>
        </main>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Rsvp;
