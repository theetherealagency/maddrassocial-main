/**
 * Adds a newsletter signup to Resend via /api/newsletter-signup.
 * Resolves true when the contact was saved.
 */
export async function subscribeToNewsletter(contact: {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) console.error('Newsletter signup failed:', res.status);
    return res.ok;
  } catch (error) {
    console.error('Newsletter signup failed:', error);
    return false;
  }
}
