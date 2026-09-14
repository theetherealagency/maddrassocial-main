// Utility for submitting form data to Google Apps Script web apps.
// Uses sendBeacon when available (more reliable for cross-origin fire-and-forget),
// and falls back to fetch.

export async function postToGoogleAppsScript(url: string, payload: unknown) {
  const body = JSON.stringify(payload);

  // Prefer sendBeacon: no CORS preflight, designed for background sending.
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const ok = navigator.sendBeacon(
      url,
      new Blob([body], { type: 'text/plain;charset=utf-8' })
    );
    if (ok) return;
  }

  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });
}
