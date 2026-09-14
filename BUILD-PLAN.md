# Madras Social — website build plan

Paste each phase into Claude Code in order. Every prompt is self-contained.

| | |
|---|---|
| Source | `~/madrasmami-11121041` — Vite + React 18 SPA, react-router, shadcn/ui, Tailwind, Supabase, Vercel |
| Target repo | `theetherealagency/maddrassocialfinal` (empty) |
| Vercel | `the-ethereal-agency/maddrassocialfinal` |
| Status | Open — full site, all routes live |
| Approach | Copy the source wholesale, strip what's not needed, swap content. No redesign. |

---

# Part 1 — The brief

## What Madras Social is

A South Indian kitchen **and bar** in Waterloo Region — Kerala and Tamil cooking turned into an evening out rather than a takeout order. Not a dosa counter with a liquor licence: a room you book a table in.

**Audience:** Waterloo, Kitchener, Cambridge. Roughly sixty percent Asian, forty percent everyone else, growing on both sides. The food already crosses borders — it doesn't need translating, it needs a room.

**The gap it fills:** South Indian food is on menus from Times Square to Singapore, and Waterloo Region has the appetite, the demographics and the incomes — but not one South Indian room with a real bar.

**Positioning line:** *For Waterloo Region diners who want a night out rather than a takeout order.*

## Voice — "The Host"

Everyman archetype with a Lover's appetite. Not the expert at the head of the table — the one who pulls out a chair, pours before you ask, and makes the room feel like it was waiting for you. Warm, unhurried, quietly confident. Proud of where the food comes from and completely uninterested in explaining itself.

**What this means for copy:** no "authentic," no "culinary journey," no "a feast for the senses." Short sentences. Specific nouns. Say the dish, say the place it's from, stop. Where Madras Mami's site explains South Indian food to an audience that might not know it, Madras Social assumes you're an adult who can read a menu.

## Brand tokens

| Role | Hex | Name |
|---|---|---|
| Foreground / dark ground | `#1f1b1a` | Carbon |
| Deep brand | `#414c2a` | Curry Leaf |
| Primary accent | `#a83d24` | Burnt Terracotta |
| Muted neutral | `#a59976` | Muted Olive |
| Light ground | `#ece4d8` | Warm Linen |
| Gradient | — | Antique Gold |

| Role | Face | Replaces |
|---|---|---|
| Display / headings | **New Icon** — condensed serif | Kugile |
| Body | **Aksen** — geometric sans | Gotham |
| Accent | **Seruni** — display, Indian print reference | *new — no source equivalent* |

**Seruni rule:** eyebrows, section labels, and nav only. Never body copy, never headings. If a use isn't on that list, don't use it.

**Logo:** MADRAS SOCIAL wordmark (Burnt Terracotta on Warm Linen) for header and footer. MS circle submark (Warm Linen on Curry Leaf) for favicon, app icons, and any square slot. Clear space = one submark width on all sides.

**Graphic element:** Thanjavur Bommai line illustration, gold on dark. Goes in the slots Madras Mami uses for its character and ornament art — nowhere else.

---

# Part 2 — Target structure

**Seven routes.** Dropped from the source: `/gift-cards`, `/brunch-tasting`, `/newsletter`, `/about-us` (merged into `/about`), `/brampton` (orphan).

| Route | Built from | Sections, in order |
|---|---|---|
| `/` | `pages/Index.tsx` | HomeNavbar → HomeHero → HomeOurStory → HomeDiscoverMenu → HomeOurSpace → InstagramFeed → HomeFooter → promo popup |
| `/menu` | `pages/Menu.tsx` | Header → menu display (food + bar) → MandalaBackground → FloatingOrderCTA → HomeFooter |
| `/about` | `pages/AboutUs.tsx` | Header → hero → story → Bommai character → values → ScallopDivider → HomeFooter |
| `/reservations` | `pages/Reservations.tsx` | Header → reservation form → confirmation state → HomeFooter |
| `/events` | `pages/Events.tsx` + `components/events/` | Header → EventsBanner → ScallopDivider → EventGallery → EventModal → EventEnquiryForm → MandalaBackground → HomeFooter |
| `/careers` | `pages/Careers.tsx` | Currently hidden in source — uncomment the import and route |
| `/contact` | `pages/Contact.tsx` | Header → contact form → hours/address → socials → MandalaBackground → FloatingOrderCTA → HomeFooter |

**Menu covers food and drinks.** Same presentation as the source (images + JSON-LD shadow), with the bar programme as its own set of sections inside `MENU_SECTIONS` in `seo/site.mjs`. Not a separate route, not a separate component.

**Known inherited debt — keep as-is.** The source runs two nav systems: `HomeNavbar` on `/` only, `Header` everywhere else, with `HomeFooter` on every route and `Footer.tsx` dead. Keeping this preserves the identical clone. Consolidating is a structural change — leave it for a later pass, not this build.

**Delete during the strip phase:** `pages/GiftCards.tsx`, `pages/BrunchTasting.tsx`, `pages/TastingEvent.tsx`, `pages/About.tsx`, `pages/Brampton.tsx`, `components/Footer.tsx`, and the seven unreferenced section components (`MixologySection`, `CulinaryShowcase`, `StorySection`, `JourneySection`, `LocationSection`, `Testimonials`, `HeroSection`). Plus `public/brunch/`, `public/catering/email-*`, `public/temp/`, and all of `src/assets/` that the surviving routes don't reference.

---

# Part 3 — Asset manifest

Source dimensions, to be matched. Matching the aspect ratio is what keeps the layout identical.

| Slot | Dimensions | Used by |
|---|---|---|
| Logo wordmark | 1920×738 | Header, HomeNavbar, HomeFooter |
| Logo (schema) | 1200×461 | `seo/site.mjs` |
| OG banner | 1200×630 | Social shares |
| Favicon / app icon | 512×512 | MS submark |
| Home hero — desktop | 1920×889 | HomeHero |
| Home hero — mobile | 1728×1920 | HomeHero |
| Home space collage | 1920×1168 | HomeOurSpace |
| Menu carousel background | 1768×1920 | HomeDiscoverMenu |
| Menu carousel slides ×8 | 1920×1280 | HomeDiscoverMenu |
| Instagram footer grid | 1594×1408 | HomeFooter |
| About hero | 1920×1489 | /about |
| About ambient background | 1080×1920 | /about |
| Bommai character | 1080×1920, transparent PNG | /about |
| Values graphic | 1920×1188 | /about |
| About banner | 1026×566 | /about |
| Events banner | 2400×1154 | /events |
| Event category tiles ×4 | 664×516 | /events |
| Ornament texture — tile | 512×512, seamless | Background pattern |
| Ornament texture — paper | 512×512, seamless | Background pattern |
| Ornament — large motif | 1080×1350 | Section backgrounds |

**Total: 25 images.** Menu photography is the bulk — 8 slides at 3:2. The Bommai illustration fills the character slot. Textures need Madras Social equivalents of the kolam tile and mandala motif, same dimensions, seamless.

No video. The source's only video is on the dropped brunch page.

---

# Part 4 — Setup

```bash
cd ~
cp -R madrasmami-11121041 maddrassocialfinal
cd maddrassocialfinal

# drop inherited history, build output, deps and secrets
rm -rf .git .vercel dist node_modules .env .env.local

git init
git add -A && git commit -m "Initial structure from Madras Mami"
git remote add origin https://github.com/theetherealagency/maddrassocialfinal.git
git branch -M main && git push -u origin main

npm install
cd ~ && claude
```

**Before the first push:** `maddrassocialfinal` is public on GitHub. Switch it to private in repo Settings — this is client work with env references in it.

`~/madrasmami-11121041` stays untouched as the reference for diffing.

---

# Part 5 — Claude Code phases

## Phase 1 — Strip

```
This repo is a copy of the Madras Mami site, being rebuilt as Madras Social.
~/madrasmami-11121041 is read-only reference — never write to it.

Strip everything the new site doesn't need. Target route set is:
/, /menu, /about, /reservations, /events, /careers, /contact

Delete:
- pages/GiftCards.tsx, pages/BrunchTasting.tsx, pages/TastingEvent.tsx,
  pages/About.tsx, pages/Brampton.tsx
- components/Footer.tsx (dead — nothing imports it)
- components/MixologySection.tsx, CulinaryShowcase.tsx, StorySection.tsx,
  JourneySection.tsx, LocationSection.tsx, Testimonials.tsx, HeroSection.tsx
  (verify each is unreferenced before deleting; report any that aren't)
- public/brunch/, public/catering/email-*.html, public/temp/
- every file in src/assets/ and public/lovable-uploads/ not referenced by a
  surviving route. Report the list before deleting. src/assets/AI_Image.psd
  and any file over 5MB goes regardless.

Then:
- rename pages/AboutUs.tsx to pages/About.tsx and point /about at it
- uncomment the Careers import and route in App.tsx, at path /careers
- remove the deleted routes from App.tsx, vercel.json rewrites, and seo/routes.mjs
- add /careers to vercel.json rewrites and seo/routes.mjs

End with `npm run build` passing and every remaining route rendering.
Report what you deleted and the repo size before and after.
```

## Phase 2 — Brand tokens

```
Replace the design tokens. Nothing else — no layout, spacing, type scale,
component structure or class name changes.

Colours — convert each hex to HSL and replace the corresponding CSS variables
in src/index.css. The source is a cream/gold/deep-green scheme; map by role:

  cream / --background        -> Warm Linen      #ece4d8
  --foreground                -> Carbon          #1f1b1a
  --secondary (deep green)    -> Curry Leaf      #414c2a
  --primary / --accent (gold) -> Burnt Terracotta #a83d24
  --muted / beige             -> Muted Olive     #a59976
  gold gradient treatments    -> Antique Gold gradient

Keep every named token that exists (cream, beige, green.brand, brown.brand,
gold, offwhite, emerald, mud and their variants). Remap their values, don't
remove or add tokens.

Fonts — the woff2 files, the @font-face block and the tailwind fontFamily
config are already prepared in madras-social-fonts.zip. Do not author these
yourself:
  - copy ms-fonts/public/fonts/*.woff2 into public/fonts/
  - replace the @font-face block at the top of src/index.css with
    ms-fonts/fontface.css
  - replace the fontFamily block in tailwind.config.ts with
    ms-fonts/tailwind-fontFamily.ts
  - delete public/fonts/Kugile*.ttf and public/fonts/Gotham*

The legacy `kugile` and `gotham` Tailwind aliases are deliberately kept and
remapped to the new faces, so no component markup needs editing. `cormorant`
and `jost` are dropped — they were unused.

KNOWN ISSUE: the Aksen files in that bundle are the trial cut, missing
' " : ; ( ) / % – — . Body copy will render with gaps until the licensed
family arrives. Filenames and weights already match, so it is a straight file
swap with no CSS change. Do not substitute a Google font, and do not work
around the missing glyphs by rewriting copy to avoid them.

Swap the logo files: wordmark for header/footer, MS submark for favicon and
app icons, at the source's existing dimensions.

Then run npm run dev and screenshot every route at 1440px and 390px.
```

## Phase 3 — Business data

```
Rewrite the three files in seo/ for Madras Social. These are the single source
of truth for business data — do them before touching page copy.

seo/site.mjs — replace the SITE object: origin, name, legalName, phone,
phoneDisplay, email, priceRange, ogImage, logo, address, geo coordinates,
sameAs socials, kgmid, map link, orderUrl, reserveUrl, cuisines, areaServed.
areaServed becomes Waterloo Region: Waterloo, Kitchener, Cambridge and
surrounding. Update OPENING_HOURS, HOURS_TEXT and FULL_ADDRESS.

MENU_SECTIONS — rebuild from the Madras Social menu. Food sections first,
then the bar programme as its own sections (cocktails, spirits, beer, wine,
zero-proof as applicable). This array powers the Menu JSON-LD, so every dish
and drink that appears on the menu images belongs here.

seo/routes.mjs — rewrite title, description, h1 and crawlable body copy for
all seven routes. Voice is "The Host": warm, unhurried, quietly confident.
Short sentences, specific nouns. Never "authentic", "culinary journey",
"a feast for the senses", or any generic restaurant marketing language.
Titles carry the Waterloo Region geography, not Brampton.

seo/schema.mjs — update the JSON-LD generation for the new entity. It's a
restaurant with a bar, so servesCuisine and the menu schema both apply.

PENDING VALUES. Some values won't exist yet — Toast ordering and reservation
URLs, the Google Maps link, the kgmid, possibly the domain. Do not stop the
build for these and do not invent them. Instead:

- Set each to the string 'PENDING' in SITE
- Add a PENDING.md at the repo root listing every pending key, what it's for,
  which route or component depends on it, and what breaks until it lands
- Any component reading a PENDING value renders its fallback: a disabled
  button with the real label, or the section hidden — never a dead link, never
  a placeholder URL like example.com, never invented text
- Keep the JSON-LD valid: omit the field entirely rather than emitting
  'PENDING' into schema

Everything else — address, phone, hours, menu items, prices — STOP and ask if
missing. Those are not pending-able; the page is wrong without them.
```

## Phase 4 — Page copy, one route at a time

```
Replace the hardcoded copy in the page and section components, route by route,
in this order: /, /menu, /about, /reservations, /events, /careers, /contact.

For each route:
1. Replace every Madras Mami string with Madras Social copy in The Host voice
2. Swap images from [ASSET FOLDER PATH], keeping the same filenames and slots
3. Update alt text
4. Run `git diff` against ~/madrasmami-11121041 for that route's files and
   confirm the changes are strings and asset paths only — no structural change
5. Paste that confirmation, then stop and wait before starting the next route

Hard rules:
- Component structure, props, class names, layout and section ordering do not
  change
- If a Madras Social value is missing, STOP and ask. Never invent copy, hours,
  menu items, prices or contact details
- If a section has no Madras Social equivalent, flag it and wait — do not
  delete it on your own judgement

Route notes:
- / : the TastingPopup component becomes a general promo popup. Retarget its
  content; don't remove it
- /menu : food sections then bar sections, same image-based presentation
- /about : this is the merged about page, built from the old AboutUs. The
  character slot takes the Thanjavur Bommai illustration
- /careers : was hidden in the source. Read it fully, then rewrite for Madras
  Social's actual roles
```

## Phase 5 — Integrations

```
Re-point every integration to Madras Social's own accounts. Same services,
same wiring, different credentials.

Env vars (all VITE_ prefixed, all in .env.example with comments):
  VITE_SUPABASE_URL
  VITE_SUPABASE_PUBLISHABLE_KEY
  VITE_SUPABASE_PROJECT_ID
  VITE_CATERING_SHEET_ENDPOINT   (events enquiry form -> Google Sheet)

The brunch sheet endpoint is no longer needed — remove VITE_BRUNCH_SHEET_ENDPOINT
and lib/googleAppsScript.ts references to it if nothing else uses them.

Also update:
- apps-script/ — the Apps Script source for the events enquiry form
- Toast order and reservation URLs (these live in SITE, already done in Phase 3)
- GTM container in gtm/ and index.html — new container ID
- components/InstagramFeed.tsx — Madras Social's handle
- public/robots.txt, public/llms.txt, public/security.txt, .well-known/security.txt

Every integration needs a graceful fallback when its env var is missing, so
local dev runs without secrets. Report anything you can't re-point because the
account or key hasn't been supplied.

DATABASE. supabase/migrations/ holds two migrations. Run them against the new
Madras Social project. Note before you do:
- Every form in the app writes to the single `leads` table, discriminated by a
  `form_type` column. The separate `reservations` table is created by migration
  but nothing ever writes to it — /reservations posts to `leads` with
  form_type 'reservation'. Drop that table from the migration rather than
  carrying dead schema forward.
- RLS: anonymous insert allowed, authenticated select only. Keep this.
- form_type values in the surviving routes: 'contact', 'reservation',
  'job_application', and the events enquiry. Remove 'brunch_tasting',
  'newsletter' and 'newsletter_signup' along with their forms.
- Regenerate src/integrations/supabase/types.ts against the new project.

GTM. gtm/madras-mami-container.json is an exported container. Import it into
Madras Social's new container, rename every tag, trigger and variable off
Madras Mami, remove triggers for the dropped routes, export it back into
gtm/ under a new filename.

APPS SCRIPT. apps-script/ has two scripts: catering and brunch-tasting. Only
catering survives — delete brunch-tasting. Deploy the catering script against
Madras Social's own Sheet and update the endpoint env var.
```

## Phase 6 — Verify

```
Run a verification pass. Report as a checklist, not prose.

- npm run build passes, including the build-seo step
- npm run lint clean
- Repo-wide grep (src, public, seo, scripts, gtm, apps-script, index.html) for:
  "madras mami", "madrasmami", "Brampton", "Mayfield", "905", the Madras Mami
  Instagram and Facebook handles, and every Madras Mami menu item name.
  Zero hits.
- dist/ contains a generated static HTML file for each of the seven routes
- vercel.json rewrites match the seven routes exactly — no orphans, none missing
- Every route returns 200 on the preview deploy
- No console errors on any route
- Fonts loading from self-hosted woff2, correct weights, no FOUT
- /og-banner.jpg and /logo.png both resolve (they 404'd on the source site for
  months — verify, don't assume)
- JSON-LD validates: Restaurant entity, Menu with food and bar sections,
  opening hours, geo
- Lighthouse on /, /menu, /reservations — four scores each
- Screenshots of all seven routes at 1440px and 390px
- Repo size under 50MB
- No image over 400KB; every photographic asset served as WebP
- Submit a test entry through each live form and confirm it lands in Supabase
  with the right form_type
- Every .env.example var set in Vercel or listed as outstanding
- PENDING.md is current: every 'PENDING' value in the codebase appears in it,
  and nothing listed there has since been filled in
- No 'PENDING' string reaches rendered output or JSON-LD
```

---

# Part 6 — Things outside the build

The plan above gets the site built. These sit alongside it and are not Claude
Code's job.

**Menu images are a design deliverable, not a photo.** The whole site presents
the menu as artwork with a JSON-LD shadow behind it. That means someone designs
the menu boards — food and bar — plus the 8 homepage carousel slides. This is
the single largest unscoped piece of work in the project and it gates `/menu`
and the homepage both.

**Image optimisation.** The source ships 2MB PNG heroes and a 13MB about-page
graphic — it was never cleaned up. Since every asset here is new, set the spec
at the source: WebP, max 1920px on the long edge, under 400KB each, and the
hero pair exported separately for desktop and mobile rather than one image
scaled. Costs nothing now, expensive to retrofit.

**Domain and redirects.** Not yet decided. Needed before Phase 3 — the domain
is `SITE.origin`, which every canonical URL, the sitemap and all JSON-LD are
built from. If Madras Social has an existing page, or link-in-bio and Google
listing URLs already in circulation, those need redirects in `vercel.json`.

**Google Business Profile.** `SITE.kgmid` is the Knowledge Graph entity id,
hardcoded in the source. Madras Social needs a claimed and verified listing
before that value exists. Schema works without it, but entity matching is
weaker — worth having before launch, not after.

**Toast.** Both the ordering and reservation URLs point at Toast. If Madras
Social is on a different POS or booking system, those two `SITE` values change
and so does `FloatingOrderCTA` — flag it early rather than at Phase 5.

**Handing over pending values later.** When a Toast URL, the Maps link, the
domain or the kgmid arrives, it's a one-line prompt — no phase to re-run:

```
Fill these pending values in seo/site.mjs, remove them from PENDING.md, and
restore any component fallback that was hiding behind them:
  orderUrl: <value>
  reserveUrl: <value>
Then run npm run build and confirm the JSON-LD now carries the fields.
```

---

# Part 7 — Repo `CLAUDE.md`

Save this to the repo root before Phase 1.

```markdown
# Madras Social

Structural clone of the Madras Mami site. ~/madrasmami-11121041 is READ-ONLY
reference for diffing — never write to it.

## Stack
Vite + React 18 SPA, react-router-dom, shadcn/ui, Tailwind, Supabase, Vercel.
`npm run build` = vite build + scripts/build-seo.mjs, which pre-renders static
HTML per route from seo/. vercel.json rewrites each route to it. This is what
makes the SPA crawlable — do not break it.

## Rules
- Structure, layout, sections, components and ordering do not change.
  Content, images, brand tokens and business details do.
- Business data lives in seo/site.mjs, seo/routes.mjs, seo/schema.mjs.
  Address, phone, hours, socials, menu, titles and meta all belong there.
- Never invent copy, hours, menu items, prices or contact details.
  If a value is missing, stop and ask.
- Work one route at a time. After each, diff against the source and confirm
  the changes are content-only.
- Every key is an env var, documented in .env.example, with a graceful
  fallback when unset.
- Run `npm run build` before declaring any task complete.

## Brand
Carbon #1f1b1a, Curry Leaf #414c2a, Burnt Terracotta #a83d24,
Muted Olive #a59976, Warm Linen #ece4d8, Antique Gold gradient.
New Icon (display), Aksen (body), Seruni (accent — eyebrows, labels and nav
only, never body or headings).

## Voice — "The Host"
Warm, unhurried, quietly confident. Short sentences, specific nouns. Say the
dish, say where it's from, stop. Never "authentic", "culinary journey",
"a feast for the senses", or any generic restaurant marketing language.
```

---

# Part 8 — What you supply

**Blocks Phase 2:**
- ~~Fonts~~ — done, in `madras-social-fonts.zip`. Outstanding: the licensed
  Aksen family file to replace the trial cut (straight swap, no CSS change)
- Logo: wordmark and MS submark as SVG, plus a 512×512 favicon source

**Blocks Phase 3:**
- Address, phone, email, opening hours, domain
- Google Maps listing / share link, and the KG entity id once it exists
- Instagram and Facebook handles
- Toast online-ordering URL and Toast Tables reservation URL
- Full menu — food and bar — by section, with dish and drink names

**Blocks Phase 4:**
- The 25 images in Part 3, at those dimensions
- Bommai illustration as a transparent PNG at 1080×1920
- Careers page: the actual roles you're hiring for

**Blocks Phase 5:**
- Supabase project (URL, publishable key, project id)
- Google Apps Script endpoint + Sheet for the events enquiry form
- GTM container ID
