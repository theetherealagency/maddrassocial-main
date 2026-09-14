# PENDING

Values Madras Social has not supplied yet. Every one is the literal string
`PENDING` in `seo/site.mjs` (or `null` in `src/lib/links.ts`), and every
consumer renders a fallback rather than a dead link or invented text.

Three files carry the same `isSet()` guard — `seo/schema.mjs`,
`seo/routes.mjs` and `scripts/build-seo.mjs`. A pending value is omitted from
JSON-LD and from the crawlable copy entirely; the word `PENDING` must never
reach rendered output. Verified: no route's generated HTML contains it.

---

## Hard stops — the site is factually incomplete without these

### `phone` / `phoneDisplay`
E.164 and display form, e.g. `+15195550100` / `(519) 555-0100`.

| Depends on it | Behaviour while pending |
|---|---|
| `seo/schema.mjs` | `telephone` omitted from Restaurant, Organization and ContactPoint nodes |
| `seo/routes.mjs` NAP block | Phone line omitted from all seven routes |
| `scripts/build-seo.mjs` | `restaurant:contact_info:phone_number` meta omitted |
| `src/pages/Contact.tsx` | Phone row omitted from the contact cards |
| `HomeFooter`, `Footer`, `LocationSection`, `EventEnquiryForm` | `tel:` links removed |
| `public/llms.txt` | Phone line omitted |

### `OPENING_HOURS` / `HOURS_TEXT`
The machine-readable array and the prose string must agree.

| Depends on it | Behaviour while pending |
|---|---|
| `seo/schema.mjs` | `openingHoursSpecification` is an empty array |
| `seo/routes.mjs` NAP block | Hours line omitted |
| `scripts/build-seo.mjs` | `business:hours` and the `twitter:data2` "Open" pair omitted |
| `public/llms.txt` | Renders "Not yet published." |

---

## Pending — build proceeds, fallbacks render

### `orderUrl` (also `src/lib/links.ts` `ONLINE_ORDER_URL`)
Online ordering. Toast in the source; Madras Social's POS is unconfirmed.

- `Header` and `HomeNavbar` render the Order button **disabled**, keeping the
  real label, with a title explaining why.
- `FloatingOrderCTA` falls back to an internal link to `/menu`.
- `OrderAction` is dropped from `potentialAction` in JSON-LD.

### `reserveUrl`
Third-party booking link.

- `acceptsReservations` omitted from JSON-LD; `ReserveAction` dropped.
- `/reservations` still works — it posts to Supabase as a request form.

### `map`
Google Maps share link.

- `hasMap` omitted from JSON-LD.
- Maps links removed from `HomeFooter`; the address on `/contact` renders as
  plain text rather than a link.

### `kgmid`
Google Knowledge Graph entity id. Exists only once the Business Profile is
claimed and verified.

- The `identifier` PropertyValue is omitted from the Restaurant node.

### `geo.lat` / `geo.lng`
Take the exact coordinates from the Business Profile once claimed. Do not
approximate — geo drives map-pin accuracy and local-pack ranking.

- `GeoCoordinates` omitted from both the Restaurant and Place nodes.
- `place:location:*`, `geo.position` and `ICBM` meta omitted.

### `origin` — domain not confirmed
`https://www.madrassocial.ca`, inferred from the `hello@madrassocial.ca`
address. **Not verified.** Every canonical URL, the sitemap and all JSON-LD
are built from it, so confirm before launch.

---

## Content and assets still outstanding

### Bar menu
`MENU_SECTIONS` in `seo/site.mjs` holds the 11 food sections. Cocktails,
spirits, beer, wine and zero-proof were never supplied. Append them as further
sections in the same array — nothing else needs to change. `/menu` currently
presents food only.

### Event categories — `src/components/events/eventForms.ts`
The four categories (Weddings, Kitty Parties, Corporate, Festivals & Poojas)
are inherited from Madras Mami and describe off-site vegetarian catering. It
is not established whether Madras Social caters off site at all or only hosts
private dining in the room. Copy is left in place so the page renders; it is
flagged in the file and must be confirmed or replaced before launch.

### Amenities — `seo/schema.mjs`
Reduced to `Dine In`, `Full Bar`, `Private Events`. The source also claimed
Takeout, Delivery, Live Dosa Counter, Jain Menu, Wedding Catering, Family
Friendly and Wheelchair Accessible Entrance. None are confirmed for Madras
Social and `amenityFeature` is a factual claim Google surfaces. Add back once
confirmed.

### `priceRange`
Set to `$$$` on the reasoning that mains run $16–$38.50 with a full bar.
Madras Mami was `$$`. This shows in Google's listing — confirm.

### Logo and favicon
Not supplied. The site still ships the Madras Mami artwork at
`public/lovable-uploads/mm-logo-web-01.png`, `public/logo.png`,
`public/og-banner.jpg` and `public/favicon.ico`. Needed: MADRAS SOCIAL
wordmark (1920×738), schema logo (1200×461), OG banner (1200×630) and the MS
submark at 512×512.

### Photography — 25 images
Every image on the site is still Madras Mami's. See BUILD-PLAN Part 3 for the
slot list and dimensions. The 8 menu carousel slides and the food/bar menu
boards are design deliverables, not photographs.

### Bommai illustration
Thanjavur Bommai line illustration, transparent PNG at 1080×1920, for the
character slot on `/about`. Currently the Madras Mami character art.

### Aksen licensed family
`public/fonts/Aksen-*.woff2` are the **trial cut**, missing
`' " : ; ( ) / % – —`. Body copy renders with gaps until the licensed family
lands. Filenames and weights already match — a straight file swap, no CSS
change. Do not substitute a Google font.

### Antique Gold gradient
The brand table names it but supplies no hex values. `--gold` currently maps
to Burnt Terracotta; the one gradient treatment in `src/index.css` uses it.
Supply the stops.

---

## Integrations not yet re-pointed

None of these have Madras Social credentials, so Phase 5 has not been run.

| What | Where | State |
|---|---|---|
| Supabase | `.env.example`, `src/integrations/supabase/` | Still the Madras Mami project |
| Events enquiry Sheet | `VITE_CATERING_SHEET_ENDPOINT`, `apps-script/catering/` | Still Madras Mami's |
| GTM container | `gtm/`, `index.html` | Still the Madras Mami container ID |

`apps-script/catering/Code.gs` fetches its email templates over HTTP from
`https://www.madrassocial.ca/catering/email-template.html` and
`email-internal.html`. Those two files live in `public/catering/` and are
still Madras Mami designs. BUILD-PLAN Phase 1 listed them for deletion, but
the surviving Apps Script depends on them — they were kept deliberately. They
need rebranding, not removal.

---

## Known dead code

`src/pages/Brampton.tsx` is an unrouted orphan: a Brampton-specific landing
page with Madras Mami's vegetarian and desi-ghee claims. It has no route, no
rewrite and no entry in `seo/routes.mjs`, so it cannot render or be indexed.
There is no Madras Social equivalent of the page. Left in place pending a
decision to delete it.

---

## Update — asset purge and integration pass

**Unreferenced assets removed.** 68 files from `src/assets` (217 MB) and 7 from
`public/lovable-uploads` (14 MB) that never appeared in the build output. Only
30 files / 43 MB of `src/assets` were ever bundled. Verified afterwards: the
build emits the same 32 assets and all 58 image/font references in the built
HTML, JS and CSS resolve. Everything is recoverable from commit `4f0e2a6`.

**Removed as dead code** (both recoverable from `4f0e2a6`):
- `src/pages/Brampton.tsx` — unrouted Brampton landing page carrying false
  vegetarian and desi-ghee claims. No Madras Social equivalent.
- `apps-script/brunch-tasting/` — its form and route were removed, so the
  script had nothing to serve.

**Catering email templates rebranded.** `public/catering/email-template.html`
and `email-internal.html` now use the Madras Social palette (Carbon, Burnt
Terracotta, Warm Linen, Curry Leaf), the Waterloo address, and no vegetarian
claim. The phone line is dropped while the number is pending.

**`apps-script/catering/Code.gs`** — address corrected; `PHONE` set to empty
with the confirmation email omitting the "call us" line rather than printing a
Madras Mami number.

### Still outstanding in that script
`SHEET_ID` is still Madras Mami's spreadsheet
(`1jPPECYFnWL_k8yRkhL7hWFqLhG1JwCttmQ855f09ltE`). Enquiries will land in the
wrong Sheet until it is replaced and the script is redeployed against Madras
Social's own Google account.

### Live deployment
`https://maddrassocialfinal.vercel.app` — production on the
`the-ethereal-agency/maddrassocialfinal` project, no custom domain attached.
`madrassocial.ca` is untouched. **No environment variables are set on that
project**, so every form on the live site fails by design rather than writing
to Madras Mami's database.
