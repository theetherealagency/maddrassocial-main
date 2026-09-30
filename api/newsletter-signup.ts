/**
 * Newsletter signup → Resend.
 *
 * The homepage newsletter popup adds the address as a contact in
 * the Madras Social newsletter segment in Resend, which is where the
 * newsletter is sent from. It also writes to Supabase `leads` when Supabase
 * is configured, but Resend is the record that must succeed.
 *
 * Server-side env vars (Vercel → Project → Environment Variables):
 *   RESEND_API_KEY                  Resend API key
 *   RESEND_MADRAS_SOCIAL_SEGMENT_ID   optional; defaults to the
 *                                   "Madras Social – Newsletter" segment below
 *
 * A repeat signup is a success: Resend answers a create for an existing
 * address with that contact, and adding a contact to a segment it is already
 * in is a no-op, so both calls are simply made every time.
 */

const DEFAULT_SEGMENT_ID = '0bfca26f-3da0-4ee3-9725-d305f521187b';
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 4096;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const text = (value: unknown, cap: number) =>
  typeof value === 'string' ? value.trim().slice(0, cap) : '';

async function resend(path: string, apiKey: string, body?: unknown) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'Malformed request.' }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  const email = text(body.email, 160).toLowerCase();
  if (!EMAIL.test(email)) return json({ error: 'Valid email required.' }, 422);

  // Forms send either one "name" field or first/last; Resend wants first/last.
  let firstName = text(body.firstName, 60);
  let lastName = text(body.lastName, 60);
  if (!firstName && !lastName) {
    const [first = '', ...rest] = text(body.name, 120).split(/\s+/);
    firstName = first;
    lastName = rest.join(' ');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId =
    UUID.exec(process.env.RESEND_MADRAS_SOCIAL_SEGMENT_ID ?? '')?.[0] ?? DEFAULT_SEGMENT_ID;

  if (!apiKey) {
    console.error('[newsletter] RESEND_API_KEY is not set — contact not created:', email);
    return json({ error: 'Could not save.' }, 500);
  }

  try {
    await resend('/contacts', apiKey, {
      email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });
    await resend(`/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, apiKey);
  } catch (err) {
    // Logged with the address so a failed signup is recoverable from the logs.
    console.error('[newsletter] Resend write failed:', err, email);
    return json({ error: 'Could not save.' }, 502);
  }

  return json({ ok: true });
}
